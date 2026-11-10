import { cpSync, mkdirSync, rmSync, copyFileSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createCV } from "./create-cv.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const at = (...paths) => resolve(root, ...paths);
const out = at("dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const app of ["personal", "hire"]) {
  cpSync(at("apps", app), at("dist", app), { recursive: true });
  writeFileSync(at("dist", app, ".nojekyll"), "");
}
mkdirSync(at("dist", "personal", "media"), { recursive: true });
copyFileSync(at("assets", "selected.webp"), at("dist", "personal", "media", "selected.webp"));

cpSync(at("assets"), at("dist", "hire", "assets"), { recursive: true });
const cv = createCV(at("dist", "hire", "assets", "Eugen_Skaromny_CV.pdf"));
console.log("Generated selectable two-page CV:", cv.bytes, "bytes");


// Deploy robustness: put the final stylesheet inside the page document.
// Cloudflare can serve /spotify-needle without a trailing slash, and broken
// stylesheet URLs or stale separate CSS assets must never make the UI unstyled.
// Keep source styles.css files in the output for browser/dev inspection.
for (const [site, file, styles, script] of [
  ["personal", "index.html", "styles.css", "/script.js"],
  ["hire", "index.html", "styles.css", "/script.js"],
  ["hire", "spotify-needle/index.html", "spotify-needle/styles.css", "/spotify-needle/script.js"]
]) {
  const htmlPath = at("dist", site, file);
  const cssPath = at("dist", site, styles);
  const css = readFileSync(cssPath, "utf8");
  if (css.length < 3000) throw new Error("Unexpectedly short CSS: " + cssPath);
  let html = readFileSync(htmlPath, "utf8");
  const cssLink = '<link rel="stylesheet" href="styles.css">';
  const scriptTag = '<script defer src="script.js"></script>';
  const alternativeScriptTag = '<script src="script.js" defer></script>';
  if (!html.includes(cssLink)) throw new Error("Missing stylesheet marker in " + htmlPath);
  if (!html.includes(scriptTag) && !html.includes(alternativeScriptTag)) {
    throw new Error("Missing script marker in " + htmlPath);
  }
  // All current CSS is authored locally. An HTML-embedded style cannot 404.
  // Explicit path for JS also survives routes requested without trailing slash.
  html = html.replace(cssLink, '<style data-build-inline="true">\n' + css.replaceAll("</style", "<\\/style") + '\n</style>');
  html = html.replace(scriptTag, '<script defer src="' + script + '"></script>');
  html = html.replace(alternativeScriptTag, '<script defer src="' + script + '"></script>');
  writeFileSync(htmlPath, html);
  console.log("Embedded", css.length, "CSS bytes in", site + "/" + file);
}

writeFileSync(at("dist", "personal", "CNAME"), "skaromny.com\n");
writeFileSync(at("dist", "hire", "CNAME"), "hire.skaromny.com\n");

const sites = [
  ["personal", "https://skaromny.com/", ["/"]],
  ["hire", "https://hire.skaromny.com/", ["/", "/spotify-needle/", "/yope/"]],
];
for (const [name, origin, routes] of sites) {
  const entries = routes.map(route => "  <url><loc>" + origin.replace(/\/$/, "") + route + "</loc></url>").join("\n");
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries + '\n</urlset>\n';
  writeFileSync(at("dist", name, "sitemap.xml"), xml);
  writeFileSync(at("dist", name, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: " + origin + "sitemap.xml\n");
}
if (!existsSync(at("dist", "hire", "assets", "needle-demo.mp4"))) {
  throw new Error("Real Needle video is missing. Never replace it with a mock.");
}
console.log("Built dist/personal → skaromny.com");
console.log("Built dist/hire → hire.skaromny.com (including /spotify-needle/ and /yope/)");
console.log("Real Needle demo and screenshot media copied.");
