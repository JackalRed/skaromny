"""Browser smoke test for skaromny. Runs against actual rendered pages."""
from __future__ import annotations

import os
import shutil
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
url = f"http://127.0.0.1:{server.server_port}/"

chrome_path = os.environ.get("CHROME_PATH")
if not chrome_path:
    chrome_path = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")

errors: list[str] = []
try:
    with sync_playwright() as p:
        launch = {"headless": True, "args": ["--no-sandbox"]}
        if chrome_path:
            launch["executable_path"] = chrome_path
        browser = p.chromium.launch(**launch)

        for width in (320, 390, 768, 1440):
            context = browser.new_context(viewport={"width": width, "height": 900}, device_scale_factor=1)
            page = context.new_page()
            page.on("pageerror", lambda exception: errors.append(str(exception)))
            response = page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            assert response and response.status == 200, f"HTTP failed at {width}"
            page.evaluate("document.fonts.ready")
            assert "Eugen Skoromny" in page.title(), "Missing page title"
            assert page.get_by_role("heading", name="I make complex things feel simple.").count() == 1

            dimensions = page.evaluate("""() => ({
                scroll: document.documentElement.scrollWidth,
                viewport: document.documentElement.clientWidth
            })""")
            assert dimensions["scroll"] <= dimensions["viewport"] + 2, f"Horizontal overflow at {width}: {dimensions}"
            assert page.locator("a[href='https://github.com/JackalRed/Music-box']").count() == 0, "Private GitHub repo exposed"

            match = page.get_by_role("button", name="02 Match")
            match.click()
            assert match.get_attribute("aria-pressed") == "true"
            assert "Review the match." in page.locator("#demo-title").inner_text()
            assert page.get_by_role("button", name="01 Capture").get_attribute("aria-pressed") == "false"

            page.screenshot(path=str(OUT / f"portfolio-{width}.png"), full_page=True)
            print(f"PASS viewport={width}px; screenshot={OUT / f'portfolio-{width}.png'}")
            context.close()

        reduced = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        page = reduced.new_page()
        page.goto(url)
        assert page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
        page.get_by_role("button", name="03 Save").click()
        assert "Keep the music." in page.locator("#demo-title").inner_text()
        reduced.close()
        browser.close()

    assert not errors, f"JavaScript page errors: {errors}"
    print("PASS: keyboard-native stepper, reduced motion, responsive widths, no page errors")
finally:
    server.shutdown()
