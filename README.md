# skaromny — product portfolio / Spotify pitch

A public, static English-language candidate portfolio featuring the independent **Needle** music-discovery product.

**Intended URL:** https://hire.skaromny.com/

## What's included
- `index.html` — responsive portfolio and role-specific pitch
- `assets/needle-demo.mp4` — real 39-second screen recording, trimmed to remove waits
- `assets/*.webp` — real mobile interface screenshots, optimized for the web
- `decks/*.pdf` — seven tailored eight-slide presentations
- `CNAME` — desired GitHub Pages custom domain
- `.nojekyll` — plain static site without Jekyll

## Role-specific links

| Audience | URL |
|---|---|
| General | https://hire.skaromny.com/ |
| Subscriptions | https://hire.skaromny.com/?role=subscriptions |
| Core Experience | https://hire.skaromny.com/?role=core |
| Search Personalization | https://hire.skaromny.com/?role=search |
| Customer Service | https://hire.skaromny.com/?role=service |
| Data Platform | https://hire.skaromny.com/?role=data |
| Spotify Connect | https://hire.skaromny.com/?role=connect |

Each role link updates the framing and the PDF link.

## Publish to GitHub Pages (one-time setup)

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source: Deploy from a branch**; **Branch: main**; **Folder: /(root)**; **Save**.
3. Under **Custom domain**, use `hire.skaromny.com`; save it. The committed `CNAME` file alone is not enough.
4. At your DNS provider, add a **CNAME** record: name/host `hire`, target `jackalred.github.io` (no protocol or repository path). If using Cloudflare, start as DNS only.
5. Once GitHub finishes deployment and DNS/SSL validation, enable **Enforce HTTPS** and test the demo playback and each role-specific PDF.

This repository is the source of the site. Future commits to `main` should publish automatically once Pages is enabled.

## Notes
Needle was built independently and is not affiliated with Spotify. The 22-track figure is a specific demo outcome, **not** a production KPI. No AI-generated product UI or fake interface screens are used.
