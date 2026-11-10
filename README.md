# skaromny

An editorial, responsive personal product portfolio for Eugen Skoromny.

## Status

The first website concept is in a review branch / PR. It is **not deployed** and the default branch should not be published until approved.

### What is here

- Static HTML/CSS/JS, no front-end framework or build dependency.
- Product-led narrative: Needle (personal project), enterprise AI (Vodafone), consumer scale (MegaFon).
- Simple three-step interactive **explanation** of Needle. This is not a recording or a live AI recognition demo.
- Responsive design, accessible step controls and reduced-motion handling.
- PRODUCT.md and DESIGN.md capture content and design decisions.

### Local preview

Run from the repo root:

\`\`\`sh
python3 -m http.server 4173
\`\`\`

Then visit http://localhost:4173. Static hosting (e.g., Cloudflare Pages) can serve this directory directly, without a build command.

## Design-skill experiment

The implementation is **informed by** these publicly documented systems, but their CLIs, automatic hook audits, and browser inspectors were **not executed** in this GitHub-only editing session. To run the full comparison locally, open the repo in a supported coding agent and install:

\`\`\`sh
npx impeccable install
npx skills add Leonxlnx/taste-skill
npx skills add emilkowalski/skills
\`\`\`

Use Node 22+ and Chrome/Chromium for Taste's browser inspector. In Codex, re-open the project after installation.

Suggested ordered experiment:
1. Read PRODUCT.md. Run Impeccable's init and review DESIGN.md; use critique, audit, and polish.
2. Run Taste's inventory, direction selection and browser checks. Compare 1440/768/390 screenshots. Keep all changes in another branch.
3. Run Emil's review-animations / improve-animations and check reduced-motion behavior.
4. Compare the screenshots and the friction of the real Needle flow, rather than blindly applying all recommendations.

Official docs:
- https://impeccable.style/docs/
- https://www.tasteskill.dev/docs
- https://emilkowal.ski/skill

## Media to integrate

The Needle pitch includes a real iPhone recording from a previous session. **It is not committed here.** Do not present the CSS workflow illustration as a recording. Once the approved MP4 is uploaded to the repository (e.g., assets/needle-demo.mp4), add a real player with poster, captions/transcript, file-size optimization and a fallback. Never fake user-interface footage.

## Publication checklist

- [ ] Confirm copy and quantitative claims.
- [ ] Add real Needle video, optimize delivery, verify playback.
- [ ] Run the installed skill workflows and actual browser QA.
- [ ] Review mobile (390 / 320px), tablet (768px), desktop (1440px).
- [ ] Check links, contrast, keyboard navigation, and reduced-motion.
- [ ] Approve and merge the PR.
- [ ] Configure custom domain/deployment in a separate step.
