"""Real browser checks for all four opt-in procedural adapters. No outside network is allowed."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import threading
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'runs/procedural'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'observations').mkdir(exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT / 'dist')))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
errors, outside, requests = [], [], []
try:
    with sync_playwright() as pw:
        launch = {'headless': True, 'args': ['--no-sandbox']}
        if os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE'):
            launch['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']
        browser = pw.chromium.launch(**launch)
        context = browser.new_context(viewport={'width': 1200, 'height': 1200}, color_scheme='light', accept_downloads=True)
        def intercept(route):
            url = route.request.url
            requests.append(url)
            if url.startswith(base + '/') or url.startswith('blob:'):
                route.continue_()
            else:
                outside.append(url)
                route.abort()
        context.route('**/*', intercept)
        context.add_init_script("""(() => {
          window.__audioCreated = 0;
          const Native = window.AudioContext;
          if (Native) window.AudioContext = class extends Native {
            constructor(...args) { super(...args); window.__audioCreated++; window.__lastAudio = this; }
          };
        })();""")
        page = context.new_page()
        page.on('pageerror', lambda err: errors.append(str(err)))
        page.goto(base + '/lab/?adapter=noise&seed=42&detail=2')
        expect(page.locator('#empty')).to_be_visible()
        assert page.evaluate('() => window.__audioCreated') == 0
        assert not any('/worker.mjs' in u or '/adapters.mjs' in u for u in requests), 'No generator should load before opt-in'
        reports = {}
        for adapter in ('noise', 'svg', 'tree', 'audio'):
            page.locator(f'[data-adapter="{adapter}"]').click()
            expect(page.locator('#empty')).to_be_visible()
            page.locator('#generate').click()
            expect(page.locator('#preview')).to_have_class('visible', timeout=15000)
            expect(page.locator('#error')).to_be_empty()
            assert page.evaluate('() => window.__audioCreated') == 0, 'Generation must not initialize audio'
            with page.expect_download() as event:
                page.locator('#export').click()
            downloaded = event.value
            downloaded.save_as(OUT / downloaded.suggested_filename)
            page.locator('#benchmark').click()
            expect(page.locator('#report-export')).to_be_enabled(timeout=30000)
            report = json.loads(page.locator('#report').text_content())
            assert report['recipe']['adapter'] == adapter
            assert report['validation']['same_runtime_repeatable'] is True
            assert len(set(report['validation']['repeat_hashes'])) == 1
            assert report['measurements']['process_peak_rss_mb'] is None
            (OUT / 'observations' / f'{adapter}.json').write_text(json.dumps(report, indent=2) + '\n')
            reports[adapter] = report
            if adapter in ('svg', 'tree'):
                page.screenshot(path=str(OUT / f'{adapter}-desktop.png'), full_page=True)
            assert page.evaluate('() => window.__audioCreated') == 0
        # Audio is explicit, one context/voice, and stoppable.
        page.locator('#play').click()
        expect(page.locator('#stop')).to_be_enabled()
        assert page.evaluate('() => window.__audioCreated') == 1
        page.locator('#stop').click()
        expect(page.locator('#status')).to_have_text('Stopped.')
        # Recipe exports and imports preserve a versioned contract, not executable code.
        with page.expect_download() as event:
            page.locator('#recipe-export').click()
        event.value.save_as(OUT / 'recipe.json')
        assert json.loads((OUT / 'recipe.json').read_text())['adapter'] == 'audio'
        page.locator('#recipe-import').set_input_files({'name': 'bad.json', 'mimeType': 'application/json', 'buffer': b'{"schema_version":1,"adapter":"noise","seed":42,"detail":2,"script":"alert(1)"}'})
        expect(page.locator('#error')).to_contain_text('exactly')
        page.locator('#recipe-import').set_input_files({'name': 'big.json', 'mimeType': 'application/json', 'buffer': b' ' * 2049})
        expect(page.locator('#error')).to_contain_text('2 KiB')
        good = {'schema_version': 1, 'adapter': 'tree', 'seed': 913, 'detail': 3}
        page.locator('#recipe-import').set_input_files({'name': 'recipe.json', 'mimeType': 'application/json', 'buffer': json.dumps(good).encode()})
        expect(page.locator('#seed')).to_have_value('913')
        expect(page.locator('#detail')).to_have_value('3')
        expect(page.locator('#empty')).to_be_visible()
        # Cancel in the same event-loop tick, then ensure no stale output reappears.
        page.locator('#benchmark').evaluate("button => { button.click(); document.getElementById('stop').click(); }")
        expect(page.locator('#status')).to_have_text('Stopped.')
        page.wait_for_timeout(250)
        expect(page.locator('#export')).to_be_disabled()
        # Reload does not execute deep-linked configurations automatically.
        page.reload()
        expect(page.locator('#seed')).to_have_value('913')
        expect(page.locator('#detail')).to_have_value('3')
        expect(page.locator('#empty')).to_be_visible()
        page.locator('#generate').click()
        expect(page.locator('#preview')).to_have_class('visible')
        page.set_viewport_size({'width': 390, 'height': 844})
        assert page.evaluate('() => document.documentElement.scrollWidth <= innerWidth + 1')
        page.screenshot(path=str(OUT / 'tree-mobile.png'), full_page=True)
        page.emulate_media(color_scheme='dark')
        page.screenshot(path=str(OUT / 'tree-mobile-dark.png'), full_page=True)
        # Same inputs, fresh worker after navigation: compare replay output again.
        page.goto(base + '/lab/?adapter=noise&seed=42&detail=2')
        page.locator('#benchmark').click()
        expect(page.locator('#report-export')).to_be_enabled(timeout=30000)
        fresh = json.loads(page.locator('#report').text_content())
        assert fresh['validation']['output_sha256'] == reports['noise']['validation']['output_sha256']
        # Hiding a page cancels outstanding work and stops audio.
        page.locator('#benchmark').evaluate("button => { button.click(); Object.defineProperty(document, 'hidden', {value:true, configurable:true}); document.dispatchEvent(new Event('visibilitychange')); }")
        expect(page.locator('#status')).to_contain_text('page is hidden')
        expect(page.locator('#stop')).to_be_disabled()
        assert not outside, outside
        assert not errors, errors
        assert (OUT / 'sound.wav').read_bytes()[:4] == b'RIFF'
        assert (OUT / 'tree.obj').read_text().startswith('# EZ-Tree')
        summary = {k: {'p50_ms': v['measurements']['latency_ms']['p50'], 'output_payload_bytes': v['measurements']['output_payload_bytes'], 'repeatable': v['validation']['same_runtime_repeatable']} for k, v in reports.items()}
        print(json.dumps(summary, indent=2))
        print('All four upstream-backed adapters, exports, replay, cancellation, activation, privacy and mobile checks passed.')
        browser.close()
finally:
    server.shutdown()
    server.server_close()
