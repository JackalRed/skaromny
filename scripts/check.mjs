import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  "dist/personal/index.html",
  "dist/hire/index.html",
  "dist/hire/spotify-needle/index.html",
  "dist/hire/yope/index.html"
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
for (const site of ["personal", "hire"]) {
  const notFound = resolve(root, "dist", site, "404.html");
  assert(existsSync(notFound), "Missing 404.html for Cloudflare static routing: " + site);
  assert(readFileSync(notFound, "utf8").includes("This page doesn't exist."), "Invalid 404 page: " + site);
}
for (const pagePath of pages.filter(x => !x.includes("/yope/"))) {
  const built = readFileSync(resolve(root, pagePath), "utf8");
  assert(built.includes('<style data-build-inline="true">'), "Built page has no guaranteed inline styles: " + pagePath);
  assert(built.includes('background:' ) || built.includes('background-'), "Embedded CSS content missing: " + pagePath);
}
assert(readFileSync(resolve(root, "dist/personal/CNAME"), "utf8").trim() === "skaromny.com");
assert(readFileSync(resolve(root, "dist/hire/yope/index.html"), "utf8").includes("Understand group health."), "Yope thesis / group-health page missing");
const cvPath = resolve(root, "dist/hire/assets/Eugen_Skaromny_CV.pdf");
const cvBytes = readFileSync(cvPath);
assert(cvBytes.subarray(0, 8).toString("ascii") === "%PDF-1.4", "Missing or invalid CV PDF header");
assert(cvBytes.length > 4000, "CV PDF too small");
assert(cvBytes.toString("latin1").includes("/Count 2"), "CV must have two pages");
console.log("PASS independent domains, Yope page, authentic video and two-page CV");
