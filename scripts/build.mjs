import { cpSync, mkdirSync, rmSync, copyFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
