# Skaromny — personal identity + professional profile

Two independent sites, one repository, three pages. All public-facing branding uses **Skaromny**.

| Site | Source | Output | Role |
| --- | --- | --- | --- |
| [skaromny.com](https://skaromny.com/) | `apps/personal/` | `dist/personal/` | Experimental personal identity and selected interests |
| [hire.skaromny.com](https://hire.skaromny.com/) | `apps/hire/` | `dist/hire/` | Restrained professional profile / online CV |
| [hire.skaromny.com/spotify-needle/](https://hire.skaromny.com/spotify-needle/) | `apps/hire/spotify-needle/` | `dist/hire/spotify-needle/` | Personal Spotify-focused case, not a product marketing page |

**Status:** work-in-progress review branch. No production deployment is initiated by this branch.

## Creative intention

### Personal
Art-directed editorial identity inspired by photographic collage, sharp typographic composition and a warm paper + black + red-orange visual language. No hiring copy or resume blocks. **The hero uses original abstract vector architecture, not a fake portrait.** A real portrait can replace that composition after approval.

### Professional
Editorial CV: quiet ivory and deep green, outcomes attributed to the right work, concrete scope, experience, selected cases, ways of working and credible contact points. No false "open to work" or recruiter-facing slogans.

### Spotify / Needle
An independent note to a Spotify product team. **The main claim is why Skaromny wants to build there**; Needle is supporting proof. Uses the **real** 39-second Needle video and actual screenshot already present in this repository. It explicitly disclaims Spotify affiliation. The 22-track note is a specific demo example and is not presented as a production metric.

## Getting started

Requirements: Node.js 22+ for the built-in static build; Python 3.11+ and Playwright for optional browser checks.

```sh
npm run build
npm run check
```

Then serve the outputs independently, from two terminals:

```sh
python3 -m http.server 4173 --directory dist/personal
python3 -m http.server 4174 --directory dist/hire
```

Open http://localhost:4173 and http://localhost:4174 (including http://localhost:4174/spotify-needle/). There is no runtime dependency and no JS framework required. The browser test can be run after `pip install playwright`:

```sh
python3 tests/split_sites_smoke.py
```

## Media and source of truth

Existing assets are kept at the repository root, **not duplicated in git**:

- `assets/needle-demo.mp4`: original, real edited iPhone screen recording.
- `assets/selected.webp`, `assets/review.webp`, `assets/social.webp`, `assets/spotify.webp`: existing real product screenshots.
- `decks/*.pdf`: existing tailored presentations kept as source material only; **not published** until rebranded and content-approved.

The build copies authentic app media into `dist/hire/assets/` and one screenshot into `dist/personal/media/`. It deliberately **does not publish** the older pitch PDFs because they need surname and content verification.

Never fabricate user metrics, employment dates or endorsements. Exact numeric statements need owner approval before publishing. No generated fake face, fake Needle interface or simulated product video is included.

## Deployment plan (not executed)

**One repository, two separate static publishing targets.** Recommended: two Cloudflare Pages projects linked to the same repo and the same protected production branch, with identical build command `npm run build` but different output directories:

| Pages project | Build command | Output directory | Custom domain |
| --- | --- | --- | --- |
| personal | `npm run build` | `dist/personal` | `skaromny.com` |
| professional | `npm run build` | `dist/hire` | `hire.skaromny.com` |

The root `CNAME` and root `index.html` from the previous site are deliberately **not modified in this branch**; they remain the current GitHub Pages publication source until a migration is explicitly approved. On publication, move `hire.skaromny.com` DNS away from GitHub Pages to the chosen new deployment and test HTTPS/redirects. Avoid pointing one domain at both providers. The generated per-site CNAME files are inert until each output is deployed.

## Review gates

GitHub Actions checks `npm run build`, local media/links, JS syntax, viewport overflow at 320/390/768/1440, focus, real image loading and the hire-to-Spotify route. It stores full-page screenshots and deploy-ready output as **review artifacts**, not live previews. Review the screenshots and case copy before merging.

### Remaining decisions
- Personal portrait: add authentic, owner-approved imagery for a final art-directed version.
- Published CV: only expose a PDF when the final CV is available and verified.
- Review public metrics and employer details.
- Set up two DNS / Pages projects only after design approval.
