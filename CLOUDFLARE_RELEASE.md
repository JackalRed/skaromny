# Cloudflare Pages release runbook — Skaromny

Two independent Cloudflare Pages projects, one GitHub repository: **JackalRed/skaromny**, production branch **main**.

## Build configuration

| Field | Personal | Hire |
| --- | --- | --- |
| Project name | skaromny-personal | skaromny-hire |
| Git repository | JackalRed/skaromny | JackalRed/skaromny |
| Production branch | main | main |
| Framework | None | None |
| Root directory | repository root (blank) | repository root (blank) |
| Build command | npm run build | npm run build |
| Build output directory | dist/personal | dist/hire |
| Node.js | 22 (.node-version) | 22 (.node-version) |

The names are suggestions; if Cloudflare says the name is taken, choose an available name and use its actual pages.dev address. Both projects must be configured **separately**, even though the repo is shared.

## Phase 1 — deploy to temporary URLs (NO DNS changes)

1. Sign in at https://dash.cloudflare.com/.
2. Select the account that manages the skaromny.com domain.
3. Open **Workers & Pages → Create application → Pages → Connect to Git**.
4. Choose GitHub and authorize access to **JackalRed/skaromny** if prompted.
5. Name the first project **skaromny-personal** and enter the Personal column values above.
6. Click **Save and Deploy**. Wait for the build to complete.
7. Open **https://YOUR-PERSONAL-PROJECT.pages.dev/** and check the Personal site.
8. Repeat the creation process with the **same repo** and name **skaromny-hire**, using the Hire column values.
9. Check both **https://YOUR-HIRE-PROJECT.pages.dev/** and **https://YOUR-HIRE-PROJECT.pages.dev/spotify-needle/**.
10. Watch the genuine Needle MP4 on the Spotify page and check return navigation.

**Do not change DNS until both sites display the new version correctly on pages.dev.**

## Phase 2 — connect domains

Cloudflare official guide: https://developers.cloudflare.com/pages/configuration/custom-domains/

### Before touching DNS

- Confirm skaromny.com is an **active Cloudflare zone** with Cloudflare nameservers. Cloudflare Pages requires this for a root/apex domain.
- If your nameservers are at another DNS provider, migrate the zone first and carefully preserve every email-related MX/SPF/DKIM/DMARC record and any other required records. Do not blindly replace nameservers.
- Save the exact old web DNS records for **@**, **www** and **hire** (type, value, TTL, proxy state). This is your rollback plan.
- Existing GitHub Pages uses a root repository CNAME containing **hire.skaromny.com**. That old site remains available until you swap its DNS.

### Personal: skaromny.com

1. Cloudflare → **Workers & Pages → skaromny-personal → Custom domains → Set up a domain**.
2. Enter **skaromny.com** and continue.
3. If an older root A/AAAA/CNAME record conflicts, change **only the web-hosting record**. Do not touch MX or verification TXT records.
4. Confirm the custom-domain status shows **Active**, and visit **https://skaromny.com**.

### Professional: hire.skaromny.com

1. Cloudflare → **Workers & Pages → skaromny-hire → Custom domains → Set up a domain**.
2. Enter **hire.skaromny.com**.
3. If a legacy hire CNAME points to GitHub Pages, save its original value and replace the conflicting **hire record** with the Pages record suggested by Cloudflare.
4. Confirm status **Active**, then visit **https://hire.skaromny.com** and **https://hire.skaromny.com/spotify-needle/**.
5. Test the Needle video and link back to your professional profile.

Important: **Add the custom domain inside the Pages project first**. Manually creating only a CNAME, without registering the domain in Pages, can fail.

## Phase 3 — retire legacy GitHub Pages AFTER cutover

Existing root files (index.html, CNAME, robots.txt, sitemap.xml) are legacy GitHub Pages content and remain intact to avoid downtime. They are **not** what Cloudflare Pages publishes; only the selected dist output directory is uploaded.

Once both custom domains are confirmed live, go to GitHub → **JackalRed/skaromny → Settings → Pages** and disable the legacy GitHub Pages publishing if it is still enabled. You can clean up the obsolete root files in a separate PR after verifying the new domains.

## Updates and rollback

- A new merge/push to **main** automatically rebuilds both Cloudflare Pages projects.
- Pull requests can get preview deploy URLs on the connected GitHub project.
- If a new deploy fails, use Cloudflare Pages → Deployments to inspect the build and roll back to a healthy deployment.
- If you need to restore the old hire domain, ensure GitHub Pages is still enabled (or re-enable it), then restore **exactly the original hire DNS value** you recorded.
- Never delete MX/TXT email records to fix a web-hosting problem.

## Verification checklist

- [ ] Personal pages.dev URL works.
- [ ] Hire pages.dev URL works.
- [ ] Spotify case pages.dev URL works and plays the real demo video.
- [ ] skaromny.com custom domain Active, HTTPS works.
- [ ] hire.skaromny.com custom domain Active, HTTPS works.
- [ ] /spotify-needle/ custom route works, LinkedIn link works.
- [ ] Email DNS records preserved.
- [ ] Legacy GitHub Pages disabled ONLY after new pages are live.
