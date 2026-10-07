"""Fresh-browser fixture observations, not universal upstream/hardware compatibility claims."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import platform
import threading
import time
import psutil
from playwright.sync_api import sync_playwright, expect

OUT = Path('runs/procedural')
OUT.mkdir(parents=True, exist_ok=True)
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory='dist'))
threading.Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}'

# Sample ONLY fresh Chromium descendants of this runner; shared pages may be counted more than once.
# This measures a browser process tree, never incremental adapter RAM or MCU fit.
def sample_rss(stop, samples):
    while not stop.is_set():
        total = 0
        for process in psutil.Process().children(recursive=True):
            try:
                if any(s in process.name().lower() for s in ('chromium', 'chrome', 'headless_shell')):
                    total += process.memory_info().rss
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        if total:
            samples.append(total / (1024 * 1024))
        stop.wait(.02)

try:
    with sync_playwright() as pw:
        for adapter in ('noise', 'svg', 'tree', 'audio'):
            options = {'executable_path': os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']} if os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE') else {}
            browser = pw.chromium.launch(headless=True, args=['--no-sandbox'], **options)
            context = browser.new_context(viewport={'width': 1280, 'height': 1050}, accept_downloads=True)
            external, errors, requests = [], [], []
            def route_request(route):
                url = route.request.url
                if not url.startswith(origin + '/'):
                    external.append(url)
                    route.abort()
                else:
                    route.continue_()
            context.route('**/*', route_request)
            context.on('request', lambda request: requests.append(request.url))
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            stop, samples = threading.Event(), []
            sampler = threading.Thread(target=sample_rss, args=(stop, samples), daemon=True)
            sampler.start()
            try:
                page.goto(f'{origin}/procedural/?adapter={adapter}&seed=42&detail=2')
                expect(page.locator('#status')).to_have_attribute('data-state', 'idle')
                assert not any('runtime.bundle' in u for u in requests), 'Runtime loaded before opt-in'
                expect(page.locator('#play')).to_be_disabled()
                page.locator('#generate').click()
                expect(page.locator('#status')).to_have_attribute('data-state', 'ready', timeout=20000)
                record = json.loads(page.locator('#report').inner_text())
                assert record['adapter'] == adapter and record['config']['seed'] == 42
                assert record['repeated_output_equal'] and record['different_seed_changes_output']
                assert len(record['generation_ms']) == 3 and record['output_payload_bytes'] > 0
                if adapter == 'audio':
                    page.locator('#play').click()
                    expect(page.locator('#status')).to_have_attribute('data-state', 'ready')
                else:
                    expect(page.locator('#play')).to_be_disabled()
                with page.expect_download() as event:
                    page.locator('#output').click()
                downloaded = event.value
                downloaded.save_as(str(OUT / downloaded.suggested_filename))
                if adapter == 'audio':
                    assert (OUT / downloaded.suggested_filename).read_bytes()[:4] == b'RIFF'
                with page.expect_download() as event:
                    page.locator('#receipt').click()
                assert json.loads(Path(event.value.path()).read_text())['output_sha256'] == record['output_sha256']
                # Reload preserves configuration but never starts work automatically.
                page.reload()
                expect(page.locator('#status')).to_have_attribute('data-state','idle')
                assert page.locator('#adapter').input_value() == adapter
                page.locator('#generate').click()
                expect(page.locator('#status')).to_have_attribute('data-state','ready',timeout=20000)
                assert json.loads(page.locator('#report').inner_text())['output_sha256'] == record['output_sha256']
                page.screenshot(path=str(OUT / f'{adapter}-desktop.png'), full_page=True)
                page.set_viewport_size({'width':390,'height':844})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Mobile horizontal overflow'
                page.screenshot(path=str(OUT / f'{adapter}-mobile.png'), full_page=True)
                # Cancel during the async launch boundary; stale completions must not enable exports.
                page.evaluate("() => { document.querySelector('#controls').requestSubmit(); document.querySelector('#stop').click(); }")
                expect(page.locator('#status')).to_have_text('Stopped.')
                page.wait_for_timeout(200)
                expect(page.locator('#receipt')).to_be_disabled()
                assert not errors, errors
                assert not external, external
                stop.set(); sampler.join()
                record['host_observation'] = {
                    'os':platform.system(), 'release':platform.release(), 'architecture':platform.machine(),
                    'logical_cpus':os.cpu_count(), 'browser_version':browser.version, 'headless':True,
                    'browser_process_tree_peak_rss_mb':max(samples) if samples else None,
                    'sampling_interval_ms':20, 'samples':len(samples),
                    'scope':'Sampled sum of RSS for fresh Chromium descendants during page load, worker generation, render, export and repeat checks. Shared pages may be double counted; includes browser overhead, NOT incremental adapter RAM or device fit.'
                }
                # Only write success observations after all assertions and export checks pass.
                (OUT / f'{adapter}.json').write_text(json.dumps(record,indent=2)+'\n')
                print(f"{adapter}: repeatable, no external requests, exports valid; {record['output_payload_bytes']} output bytes")
            except Exception:
                page.screenshot(path=str(OUT / f'{adapter}-FAILED.png'),full_page=True)
                raise
            finally:
                stop.set();sampler.join();context.close();browser.close()
finally:
    server.shutdown();server.server_close()
