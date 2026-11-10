# Skaromny — personal identity + professional profile

Two independent sites, one repository, three pages. All public-facing branding uses **Skaromny**.

| Site | Source | Output | Role |
| --- | --- | --- | --- |
| [skaromny.com](https://skaromny.com/) | `apps/personal/` | `dist/personal/` | Experimental personal identity and selected interests |
| [hire.skaromny.com](https://hire.skaromny.com/) | `apps/hire/` | `dist/hire/` | Restrained professional profile / online CV |
| [hire.skaromny.com/spotify-needle/](https://hire.skaromny.com/spotify-needle/) | `apps/hire/spotify-needle/` | `dist/hire/spotify-needle/` | Personal Spotify-focused case, not a product marketing page |

**Status:** Cloudflare Pages release candidate. Site assets are built and tested from GitHub; the live custom-domain deployment requires the two Pages projects to be connected by the owner. See [CLOUDFLARE_RELEASE.md](CLOUDFLARE_RELEASE.md) for the exact dashboard steps.

## Creative intention

### Personal
Art-directed editorial identity inspired by photographic collage, sharp typographic composition and a warm paper + black + red-orange visual language. No hiring copy or resume blocks. The four-scene layout uses layered editorial photography, type that overlaps the image, and a tightly edited project index. The monochrome visuals are **architectural and vinyl photography, not a portrait of Skaromny**. For a truly personal final hero, replace these with owner-approved photos.

### Professional
Compact editorial CV: quiet ivory and deep green, outcomes attributed to the right work, experience and capabilities side by side, concise case rows and one purposeful contact point. No false "open to work" or recruiter-facing slogans.

### Spotify / Needle
An independent, short note to a Spotify product team. **The opening is why Skaromny wants to build there**, with the real Needle video visible immediately; the next scenes explain judgement, relevant background and the personal ask. Uses the **real** 39-second Needle video and actual screenshot already present in this repository. It explicitly disclaims Spotify affiliation. The 22-track note is a specific demo example and is not presented as a production metric.


### Visual research and credits

This revision draws **patterns, not assets or source code**, from the [Inspora](https://www.inspora.design/websites) design archive, and references three examples for distinct reasons:

- [Graham McDonnell](https://greymac.com/): high-confidence editorial introduction, professional identity expressed without a corporate hero card.
- [The Grid System](https://www.thegridsystem.org/): shared column anchors, disciplined baselines and intentional rule-breaking for the Personal poster composition.
- [Cassette](https://www.cassettemusic.com/): concise music-first language and a physical-record visual motif, adapted to the independent Spotify/Needle story.

Personal-site collage includes licensed, monochrome image treatments: [architecture by Osman Rana](https://unsplash.com/photos/grayscale-photo-of-concrete-building-5LED2xbiKvk) and [vinyl image by Chris Wilson](https://unsplash.com/photos/grayscale-photography-of-turntable-z_jBXhX50K0), used under the [Unsplash License](https://unsplash.com/license). These are editorial illustrations of interests, not personal photography. Images currently load from Unsplash URLs and should be self-hosted after selection/approval for robust production delivery.

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

## Cloudflare Pages deployment

**One repository, two separate static publishing targets.** Recommended: two Cloudflare Pages projects linked to the same repo and the same protected production branch, with identical build command `npm run build` but different output directories:

| Pages project | Build command | Output directory | Custom domain |
| --- | --- | --- | --- |
| personal | `npm run build` | `dist/personal` | `skaromny.com` |
| professional | `npm run build` | `dist/hire` | `hire.skaromny.com` |

The root `CNAME` and root `index.html` from the old website are deliberately **left untouched** until Cloudflare is attached and tested, preserving the legacy GitHub Pages host during cutover. Follow [CLOUDFLARE_RELEASE.md](CLOUDFLARE_RELEASE.md) to deploy both sites on their temporary pages.dev URLs before switching domain DNS. The generated per-site CNAME files do not configure Cloudflare automatically; use Pages → Custom domains.

## Review gates

GitHub Actions checks `npm run build`, local media/links, JS syntax, viewport overflow at 320/390/768/1440, focus, real image loading and the hire-to-Spotify route. It stores full-page screenshots and deploy-ready output as **review artifacts**, not live previews. Review the screenshots and case copy before merging.

### Remaining decisions
- Personal portrait: add authentic, owner-approved imagery for a final art-directed version.
- Published CV: only expose a PDF when the final CV is available and verified.
- Review public metrics and employer details.
- Create two Cloudflare Pages projects and review them on temporary pages.dev URLs before custom domain cutover. Keep the old DNS records saved for rollback.
