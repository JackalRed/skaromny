# Design audit — skaromny v1

This report separates **functionally working** from **visually approved**. The site has a real first design direction but has **not passed** the full design-skill gates.

## Tools actually executed

- **Playwright** via GitHub Actions: real browser at 320/390/768/1440 px, horizontal overflow, clickable Needle steps, reduced-motion setting, JavaScript errors. Uploads screenshots.
- **Impeccable CLI**: the official source checker, with reports uploaded from GitHub Actions. Nonzero checker outcomes are preserved in logs.
- **Taste Skill**: current GitHub source v2.5, official copy-lint and browser consistency scripts (the older website docs' lint/inspect names are no longer applicable).
- **Emil Kowalski**: applied animation principles manually; no automatic Emil skill assessment was claimed or performed.

## First-pass findings

| Audit | Result | Key issues |
| --- | --- | --- |
| Playwright smoke test, first version | PASS, 4 widths | Site operates, no script errors, no overflow |
| Impeccable original | 39 anti-patterns + 12 advisory notes | Tiny UI text, tracking, spacing, generic fonts and palette |
| Impeccable after first revision | 20 anti-patterns | Significant improvement, still not clean |
| Taste copy-lint first pass | 2 FAIL, 3 WARN groups | Repeated two-fragment headings, generic copy, punctuation |
| Taste browser consistency first pass | FAIL | CTA/visual requirements, heading scale, contrast, tap size, section rhythm |

The design audit is configured **nonblocking**, meaning a green GitHub Actions job does not mean the visual audit is clean. Inspect actual raw reports.

## What changed based on evidence

- Changed the Space Grotesk display face to Syne and cooled the palette.
- Increased mobile labels and improved contrast.
- Reduced overly compressed letter spacing and generic two-sentence headings.
- Increased touch targets for primary links.
- Diagnosed narrow mobile overflow and adjusted headline sizing.
- Preserved an editorial art direction and a short, meaningful Needle step animation instead of animating everything.

## Intentional disagreements with Taste

- Its strict one-section-per-screen, mandatory visuals and elaborate hero motion conventions are not universally right for a personal product portfolio.
- The rotated vinyl-record details are intentional illustration, not misaligned interface text.
- Any demanded visual should support actual product evidence; do not invent app captures to pass a “no-visual” metric.

## Before publishing

1. Review screenshots at phone/tablet/desktop.
2. Fix genuine accessibility issues first (contrast, focus and tap targets).
3. Include the **real** Needle screen recording, with optimization and captions. The current interactive explanation is not a real demo.
4. Verify metrics/employment copy before public use.
5. Run the full agent-guided Impeccable critique/polish, Taste build process, and Emil motion review in a browser-capable coding environment.
6. Merge and deploy only after review.

## What was tested, and what was not

This is a hands-on first implementation plus repeatable technical and partial official design audits. It is **not** a claim that all three AI agent skills were installed and automatically executed end-to-end, nor that the design is production-ready.
