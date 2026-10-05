"""Real browser checks; screenshots are UI evidence, not model benchmarks."""
from pathlib import Path
import subprocess
import time
from playwright.sync_api import sync_playwright

root=Path('runs/browser');root.mkdir(parents=True,exist_ok=True)
server=subprocess.Popen(['python3','-m','http.server','4173','--bind','127.0.0.1','--directory','dist'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    time.sleep(.5)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000});errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto('http://127.0.0.1:4173');page.wait_for_selector('tbody tr')
        assert page.locator('#count').inner_text().startswith('95 ')
        page.screenshot(path=str(root/'explorer-desktop.png'))
        page.locator('[name=domain]').select_option('finance')
        assert page.locator('tbody tr').count()==5
        page.locator('tbody input').nth(0).check();page.locator('tbody input').nth(1).check()
        page.locator('#compare').click();assert page.locator('#details').is_visible();page.keyboard.press('Escape')
        page.locator('[name=target]').select_option('luckfox-rv1106')
        assert page.locator('#count').inner_text().startswith('0 ')
        page.locator('[name=candidates]').check();assert page.locator('#candidates-section').is_visible()
        page.goto('http://127.0.0.1:4173/skeleton.html');page.locator('#demo').click()
        page.wait_for_function("document.querySelector('#play').disabled === false")
        page.locator('#play').click();page.wait_for_timeout(200)
        assert 'SYNTHETIC' in page.locator('#status').inner_text()
        page.screenshot(path=str(root/'skeleton-desktop.png'))
        page.set_viewport_size({'width':390,'height':844});page.goto('http://127.0.0.1:4173')
        page.wait_for_selector('tbody tr');page.screenshot(path=str(root/'explorer-mobile.png'))
        assert not errors,errors
        browser.close()
    print('Browser smoke passed: load, filters, comparison, unknown hardware, skeleton playback, mobile viewport.')
finally:
    server.terminate();server.wait(timeout=5)
