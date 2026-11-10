from __future__ import annotations

import threading
import shutil
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        return


def launch_site(folder: Path):
    server = ThreadingHTTPServer(
        ("127.0.0.1", 0),
        partial(Quiet, directory=str(folder)),
    )
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f"http://127.0.0.1:{server.server_port}/"


def assert_no_overflow(page, label, width):
    result = page.evaluate("""() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      offenders: Array.from(document.querySelectorAll('body *'))
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.right > document.documentElement.clientWidth + 2 &&
            getComputedStyle(el).display !== 'none';
        })
        .slice(0,8).map(el => ({
          selector: el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className : ''),
          right: Math.round(el.getBoundingClientRect().right),
          text: (el.textContent || '').trim().slice(0,45)
        }))
    })""")
    assert result["content"] <= result["viewport"] + 2, \
        f"{label} at {width}px has horizontal overflow: {result}"


def main():
    personal_server, personal = launch_site(ROOT / "dist" / "personal")
    hire_server, hire = launch_site(ROOT / "dist" / "hire")
    pages = [
        ("personal", personal, "Skaromny"),
        ("hire", hire, "Product leadership"),
        ("spotify-needle", hire + "spotify-needle/", "Spotify"),
        ("yope", hire + "yope/", "Less scroll."),
    ]
    try:
        with sync_playwright() as p:
            chrome = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
            launch_args = {"headless": True, "args": ["--no-sandbox"]}
            if chrome:
                launch_args["executable_path"] = chrome
            browser = p.chromium.launch(**launch_args)
            for label, url, expected in pages:
                for width in [320, 390, 768, 1440]:
                    context = browser.new_context(
                        viewport={"width": width, "height": 900},
                        device_scale_factor=1,
                    )
                    page = context.new_page()
                    errors: list[str] = []
                    page.on("pageerror", lambda exc: errors.append(str(exc)))
                    response = page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    assert response and response.status == 200, f"{label}: bad HTTP"
                    assert expected.casefold() in page.locator("h1").inner_text().casefold(), \
                        f"{label}: wrong hero headline"
                    assert "Skaromny" in page.title(), f"{label}: branding absent"
                    page.evaluate("(label) => document.documentElement.dataset.siteCheck = label", label)
                    page.wait_for_timeout(500)
                    # A real styled layout is required: plain HTML can pass size
                    # and script checks while ALL production CSS is unavailable.
                    style_state = page.evaluate("""() => {
                        const selectors = {
                          'personal': '.site-head',
                          'hire': '.site-header',
                          'spotify-needle': '.case-header',
                          'yope': '.topbar'
                        };
                        const name = document.documentElement.dataset.siteCheck;
                        const el = document.querySelector(selectors[name]);
                        const body = getComputedStyle(document.body);
                        return {
                          display: el && getComputedStyle(el).display,
                          background: body.backgroundColor,
                          fontFamily: body.fontFamily,
                          inlineRules: Array.from(document.querySelectorAll('style'))
                            .map(tag => tag.textContent.length).reduce((a,b) => a+b, 0),
                          markedInline: !!document.querySelector('style[data-build-inline]')
                        };
                    }""")
                    assert style_state["display"] == "flex", f"{label} at {width}: missing styled header: {style_state}"
                    assert style_state["inlineRules"] > 3000, f"{label}: no rendered CSS rules: {style_state}"
                    if label != "yope":
                        assert style_state["markedInline"], f"{label}: built HTML CSS fallback missing"
                    assert style_state["background"] != "rgba(0, 0, 0, 0)", f"{label}: unstyled body"
                    assert_no_overflow(page, label, width)
                    assert not errors, f"{label}: JavaScript errors: {errors}"
                    images = page.locator("img")
                    for i in range(images.count()):
                        image = images.nth(i)
                        image.evaluate("(el) => { el.loading = 'eager'; }")
                        page.wait_for_function(
                            "(el) => el.complete && el.naturalWidth > 0",
                            arg=image.element_handle(),
                            timeout=10000,
                        )
                    page.screenshot(path=str(OUT / f"{label}-{width}.png"), full_page=True)
                    print(f"PASS {label:15} {width}px (render, links, images, script, overflow)", flush=True)

                    if width == 390:
                        page.keyboard.press("Tab")
                        assert page.evaluate("document.activeElement !== document.body"), \
                            f"{label}: no focus"
                    context.close()

            context = browser.new_context(
                viewport={"width": 390, "height": 844},
                reduced_motion="reduce",
            )
            ppage = context.new_page()
            ppage.goto(personal, wait_until="domcontentloaded")
            assert ppage.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
            assert "Skaromny" in ppage.title()
            context.close()

            hpage = browser.new_page()
            hpage.goto(hire, wait_until="domcontentloaded")
            link = hpage.locator('a[href="/spotify-needle/"]')
            assert link.count() == 1
            link.click()
            hpage.wait_for_url("**/spotify-needle/")
            assert "Spotify" in hpage.locator("h1").inner_text()
            print("PASS hire -> /spotify-needle/ navigation", flush=True)

            video = hpage.locator("video source").get_attribute("src")
            assert video == "/assets/needle-demo.mp4", f"Unexpected media source: {video}"
            media_response = hpage.request.get(hire + "assets/needle-demo.mp4", timeout=30000)
            assert media_response.status == 200 and len(media_response.body()) > 100000
            print("PASS real Needle video available via built route", flush=True)
            # Explicit HTTP checks: a 200 HTML fallback for a CSS/JS URL is a failure.
            for origin, path, content_type in [
                (personal, "styles.css", "text/css"),
                (personal, "script.js", "javascript"),
                (hire, "styles.css", "text/css"),
                (hire, "script.js", "javascript"),
                (hire, "spotify-needle/styles.css", "text/css"),
                (hire, "spotify-needle/script.js", "javascript"),
                (hire, "yope/", "text/html"),
                (hire, "assets/Eugen_Skaromny_CV.pdf", "application/pdf"),
            ]:
                response = hpage.request.get(origin + path, timeout=30000)
                mime = response.headers.get("content-type", "").lower()
                assert response.status == 200 and content_type in mime, (
                    f"Bad asset response {origin + path}: status={response.status}, mime={mime}"
                )
            print("PASS all stylesheet, script, Yope and PDF HTTP responses", flush=True)

            hpage.close()
            browser.close()
    finally:
        personal_server.shutdown()
        hire_server.shutdown()


if __name__ == "__main__":
    main()
