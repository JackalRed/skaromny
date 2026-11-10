# DESIGN SYSTEM — skaromny

This is an editorial product portfolio, with a record sleeve as the visual motif. Its job is to make product **judgment** memorable, not to simulate a dashboard or generic startup landing page.

## Direction
**Record sleeve meets product memo.** Large, disciplined typography, hard divisions, no decorative card grids. The record in the hero is symbolic; it is not a Needle screenshot. Needle's interactive three-step mechanism is explicitly labeled as an explanation, not a product demo.

## Color
| Token | Value | Use |
| --- | --- | --- |
| paper | #efede6 | Main background |
| paper-strong | #f7f5ee | Secondary paper |
| ink | #161915 | Default foreground |
| secondary | #51564e | Secondary copy |
| dark | #191c19 | Contrasting sections |
| light-text | #f5f4e9 | Type on dark |
| acid | #d4f66f | Music / interaction / editorial punctuation |
| sage | #dbe0d1 | Hero art |
No purple or blue gradients, no neon glows.

## Typography
- Primary editorial display: Space Grotesk 600, dense spacing. Use large but not bloated headings.
- Human note / italic contrast: Georgia Italic.
- Interface and narrative: DM Sans.
- Technical labels, folios, metadata: IBM Plex Mono (11–12 px).
- Actual code font fallbacks are defined in style.css.
- Keep high contrast; do not use tiny text for task-critical content.

## Layout
- Max content width 1600 px; edge padding 22–86 px responsive.
- Hero asymmetry and one strong art direction, not symmetrical cards.
- Selected work: Needle gets the major surface; other work is supporting evidence.
- Broad sections have generous rhythm and editorial rules.
- On mobile, stack sections, avoid lateral scrolling, preserve reading order and visible tap targets.

## Motion and interactions (after Emil Kowalski's principles)
- Motion must have a job. On this page the *only* scripted animation confirms a selected Needle workflow step.
- For the narrative step change: opacity + translateY(7px), 180ms, cubic-bezier(0.23, 1, 0.32, 1).
- Hover movement is only for fine hover pointers, maximum 3px, 160ms.
- Never use transition: all, endless hero animations, scroll hijacking, or made-up confetti.
- Respect prefers-reduced-motion; on reduced motion, don't move the narrative content.
- Buttons expose aria-pressed state; keyboard works natively.

## Component behavior
- LinkedIn is the primary contact destination. External links open in a new tab with rel protection.
- All actionable items must be genuine links or buttons; dead CTA elements are prohibited.
- Needle stepper is intentionally NOT named "Try Needle": it demonstrates the decision sequence, not live recognition.
- The visual record is decorative / metaphorical and can never replace a real capture.

## Before publishing
- Review at 1440px, 768px, and 390px.
- Check 320px and long content for horizontal overflow.
- Check keyboard, focus states, contrast, touch, reduced motion, link targets, missing images and actual video authenticity.
- Confirm all copy with the owner.
