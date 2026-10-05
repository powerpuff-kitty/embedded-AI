"""Measure a child process, never infer device compatibility from a file size."""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import hashlib
import importlib.metadata
import json
import math
import os
from pathlib import Path
import platform
import signal
import subprocess
import sys
import tempfile
import time


def fingerprint(path: str | Path) -> str:
    h = hashlib.sha256()
    with open(path, 'rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(data, indent=2, allow_nan=False) + '\n')
    temporary.replace(path)


def percentile(values: list[float], fraction: float) -> float:
    if not values or not 0 <= fraction <= 1:
        raise ValueError('A nonempty sample and fraction in [0,1] are required')
    ordered = sorted(values)
    x = (len(ordered) - 1) * fraction
    lo, hi = math.floor(x), math.ceil(x)
    return ordered[lo] + (ordered[hi] - ordered[lo]) * (x - lo)


def host() -> dict:
    cpu = platform.processor() or platform.machine()
    if Path('/proc/cpuinfo').exists():
        cpu = next((line.split(':', 1)[1].strip() for line in Path('/proc/cpuinfo').read_text().splitlines()
                    if line.startswith('model name')), cpu)
    versions = {}
    for package in ['numpy', 'onnxruntime', 'rtmlib', 'opencv-python-headless', 'psutil']:
        try:
            versions[package] = importlib.metadata.version(package)
        except importlib.metadata.PackageNotFoundError:
            pass
    environment = 'github-actions' if os.getenv('GITHUB_ACTIONS') else 'local-process'
    identity = '-'.join([environment, platform.system().lower(), platform.machine().lower(), hashlib.sha256(cpu.encode()).hexdigest()[:10]])
    return {'id': identity, 'os': platform.system(), 'os_release': platform.release(), 'architecture': platform.machine(),
            'cpu': cpu, 'logical_cpus': os.cpu_count(),
            'thread_environment': {k: os.getenv(k) for k in ['OPENBLAS_NUM_THREADS', 'OMP_NUM_THREADS', 'MKL_NUM_THREADS']},
            'python': platform.python_version(), 'packages': versions, 'environment': environment}


def stop(process: subprocess.Popen) -> None:
    if process.poll() is not None:
        return
    try:
        if os.name == 'posix':
            os.killpg(process.pid, signal.SIGTERM)
        else:
            process.terminate()
        process.wait(timeout=2)
    except ProcessLookupError:
        return
    except subprocess.TimeoutExpired:
        if os.name == 'posix':
            os.killpg(process.pid, signal.SIGKILL)
        else:
            process.kill()
        process.wait(timeout=5)


def run(adapter: str, config: dict, samples: int = 30, warmup: int = 5,
        timeout: float = 120, interval: float = 0.01) -> dict:
    if not 1 <= samples <= 100000 or not 0 <= warmup <= 10000 or not math.isfinite(timeout) or not math.isfinite(interval) or timeout <= 0 or interval < 0.001:
        raise ValueError('Invalid sample count, warmup, timeout or polling interval')
    import psutil
    from .adapters import ADAPTERS
    if adapter not in ADAPTERS:
        raise ValueError(f'Unknown adapter: {adapter}')
    with tempfile.TemporaryDirectory(prefix='embedded-ai-bench-') as temporary:
        root = Path(temporary)
        input_path, output_path = root / 'config.json', root / 'result.json'
        input_path.write_text(json.dumps({'adapter': adapter, 'config': config, 'samples': samples, 'warmup': warmup}))
        with (root / 'stdout.log').open('w+') as stdout, (root / 'stderr.log').open('w+') as stderr:
            start = time.perf_counter()
            process = subprocess.Popen([sys.executable, '-m', 'bench.worker', str(input_path), str(output_path)],
                                       stdout=stdout, stderr=stderr, start_new_session=os.name == 'posix')
            peak, polling_samples, cpu_seconds = 0, 0, 0.0
            try:
                monitored = psutil.Process(process.pid)
                while process.poll() is None:
                    if time.perf_counter() - start > timeout:
                        raise TimeoutError(f'Benchmark exceeded {timeout} seconds')
                    try:
                        tree = [monitored, *monitored.children(recursive=True)]
                        rss, cpu = 0, 0.0
                        for child in tree:
                            try:
                                rss += child.memory_info().rss
                                ct = child.cpu_times()
                                cpu += ct.user + ct.system
                            except (psutil.NoSuchProcess, psutil.AccessDenied):
                                continue
                        peak = max(peak, rss)
                        cpu_seconds = max(cpu_seconds, cpu)
                        polling_samples += 1
                    except psutil.NoSuchProcess:
                        pass
                    time.sleep(interval)
                if process.returncode != 0 or not output_path.exists():
                    stderr.seek(0)
                    raise RuntimeError(f'Adapter failed ({process.returncode}): {stderr.read()[-4000:]}')
                result = json.loads(output_path.read_text())
            finally:
                stop(process)
        result.update({'schema_version': 1, 'record_type': 'measured-run',
                       'recorded_at': datetime.now(timezone.utc).isoformat(), 'hardware': host(),
                       'process_wall_ms': (time.perf_counter() - start) * 1000,
                       'sampled_process_tree_peak_rss_mb': peak / 1e6, 'rss_poll_interval_ms': interval * 1000,
                       'rss_poll_samples': polling_samples, 'sampled_cpu_seconds': cpu_seconds,
                       'power_watts': None, 'accelerator_memory_mb': None,
                       'notes': ['RSS includes the interpreter, imports, inputs and runtime.',
                                 'Process-tree RSS is sampled, can miss short peaks and can double-count shared pages.',
                                 'Host result only; not a Mac, MCU or RV1106 compatibility certification.',
                                 'Synthetic inputs are smoke/performance fixtures, not quality validation.']})
        result['source_files'] = {str(p): fingerprint(p) for folder in ['bench', 'recipes'] for p in sorted(Path(folder).glob('*.py'))}
        result['scope'] = 'synthetic-smoke-performance; not task quality or full application capacity'
        sha = os.getenv('GITHUB_SHA')
        if not sha:
            try:
                sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], stderr=subprocess.DEVNULL, text=True).strip()
                result['source_dirty'] = bool(subprocess.check_output(['git', 'status', '--porcelain'], text=True).strip())
            except (OSError, subprocess.CalledProcessError):
                pass
        if sha:
            result['source_commit'] = sha
        return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('adapter', choices=['dlinear', 'silero-vad', 'rtmpose'])
    parser.add_argument('--config', type=Path, required=True, help='Local JSON configuration; no remote code')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--samples', type=int, default=30)
    parser.add_argument('--warmup', type=int, default=5)
    parser.add_argument('--timeout', type=float, default=120)
    args = parser.parse_args()
    try:
        result = run(args.adapter, json.loads(args.config.read_text()), args.samples, args.warmup, args.timeout)
        write_json(args.output, result)
        print(f'{args.output}: p50={result["latency_ms"]["p50"]:.3f} ms; measured process RSS={result["process_peak_rss_mb"]:.2f} MB')
    except (ValueError, OSError, RuntimeError, TimeoutError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
