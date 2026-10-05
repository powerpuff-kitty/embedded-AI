"""Explicit, bounded model acquisition. No code execution or unsafe ZIP extraction."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import tempfile
import urllib.request
from urllib.parse import urlparse
import zipfile
from bench.runner import fingerprint, write_json

ALLOWED_HOSTS = {'raw.githubusercontent.com', 'download.openmmlab.com'}
LIMIT = 256 * 1024 * 1024


class CheckedRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        check_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def check_url(url):
    parsed = urlparse(url)
    if parsed.scheme != 'https' or parsed.hostname not in ALLOWED_HOSTS or parsed.username or parsed.password:
        raise ValueError('Download URL is outside the explicit HTTPS model-source allowlist')


def acquire(name: str, target: Path):
    manifest = json.loads(Path(__file__).with_name('artifacts.json').read_text())
    artifact = manifest[name]
    check_url(artifact['url'])
    target.mkdir(parents=True, exist_ok=True)
    destination, receipt_path = target / artifact['file'], target / f'{name}.receipt.json'
    if destination.exists() and receipt_path.exists():
        receipt = json.loads(receipt_path.read_text())
        if receipt.get('url') == artifact['url'] and receipt.get('model_sha256') == fingerprint(destination):
            if artifact['sha256'] and receipt.get('download_sha256') != artifact['sha256']:
                raise ValueError('Cached receipt disagrees with the pinned download hash')
            return receipt
        raise ValueError('Cache mismatch; remove the two affected files and reacquire deliberately')
    with tempfile.TemporaryDirectory(prefix='acquire-', dir=target) as temp:
        raw = Path(temp)/'download'
        opener = urllib.request.build_opener(CheckedRedirect())
        with opener.open(artifact['url'], timeout=30) as response, raw.open('wb') as out:
            total = 0
            while block := response.read(1024 * 1024):
                total += len(block)
                if total > LIMIT:
                    raise ValueError('Model download exceeds size limit')
                out.write(block)
        download_hash = fingerprint(raw)
        if artifact['sha256'] and download_hash != artifact['sha256']:
            raise ValueError('Downloaded artifact SHA-256 does not match the pinned manifest')
        model = Path(temp)/'model'
        if artifact['url'].endswith('.zip'):
            with zipfile.ZipFile(raw) as archive:
                members = [m for m in archive.infolist() if m.filename.endswith('.onnx') and not m.is_dir()]
                if len(members) != 1 or members[0].file_size > LIMIT:
                    raise ValueError('Expected one bounded ONNX file in checkpoint archive')
                with archive.open(members[0]) as stream, model.open('wb') as out:
                    count = 0
                    while block := stream.read(1024 * 1024):
                        count += len(block)
                        if count > LIMIT:
                            raise ValueError('Inflated model exceeds limit')
                        out.write(block)
        else:
            raw.replace(model)
        receipt = {'name': name, **artifact, 'download_sha256': download_hash,
                   'model_sha256': fingerprint(model), 'bytes': model.stat().st_size,
                   'verification': 'pinned-sha256' if artifact['sha256'] else 'HTTPS upstream acquisition; fingerprint recorded, not independently authenticated'}
        model.replace(destination)
        write_json(receipt_path, receipt)
        return receipt


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('name', choices=['silero','pose','detector'])
    p.add_argument('--directory', type=Path, default=Path('.models'))
    p.add_argument('--accept-upstream-terms', action='store_true')
    a = p.parse_args()
    if not a.accept_upstream_terms:
        p.error('Review recipes/artifacts.json and upstream terms; then pass --accept-upstream-terms')
    print(json.dumps(acquire(a.name,a.directory),indent=2))


if __name__ == '__main__':
    main()
