import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  "dist/personal/index.html",
  "dist/hire/index.html",
  "dist/hire/spotify-needle/index.html"
];
const forbidden = /\bSkoromny\b/gi;
for (const pagePath of pages) {
  const absolute = resolve(root, pagePath);
  assert(existsSync(absolute), "Missing page: " + pagePath);
  const html = readFileSync(absolute, "utf8");
  assert(html.includes("Skaromny"), "Wrong branding: " + pagePath);
  assert(!forbidden.test(html), "Old surname spelling: " + pagePath);
  assert(html.includes('<meta name="viewport"'), "Missing mobile viewport: " + pagePath);
  assert(html.includes('href="#main"'), "Missing skip link: " + pagePath);

  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|#|data:)/.test(url)) continue;
    const target = url.startsWith("/")
      ? resolve(root, pagePath.startsWith("dist/hire/") ? "dist/hire" : "dist/personal", "." + url)
      : resolve(dirname(absolute), url);
    const resolved = existsSync(target) && statSync(target).isDirectory() ? resolve(target, "index.html") : target;
    assert(existsSync(resolved), pagePath + " broken local link: " + url);
  }
  console.log("PASS static references: " + pagePath);
}
assert(statSync(resolve(root, "dist/hire/assets/needle-demo.mp4")).size > 100_000, "Needle video too small/missing");
assert(statSync(resolve(root, "dist/personal/media/selected.webp")).size > 5_000, "Needle product screenshot missing");
assert(readFileSync(resolve(root, "dist/hire/CNAME"), "utf8").trim() === "hire.skaromny.com");
assert(readFileSync(resolve(root, "dist/personal/CNAME"), "utf8").trim() === "skaromny.com");
console.log("PASS independent domains and authentic video");
