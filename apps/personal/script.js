// SKAROMNY / PERSONAL — narrative motion, not generic scroll-fade cards.
// No content is hidden without animation; everything remains accessible with JS off.
document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion && typeof Element.prototype.animate === "function") {
  const entrance = [
    [".cover-architecture", [
      { opacity: .4, transform: "scale(1.11)" },
      { opacity: 1, transform: "scale(1.045)" }
    ], 950, 0],
    [".cover-record", [
      { opacity: 0, transform: "translate(-55px,30px) rotate(-15deg)" },
      { opacity: 1, transform: "translate(0,0) rotate(-5deg)" }
    ], 1000, 150],
    [".red-sticker", [
      { opacity: 0, transform: "translateY(45px) rotate(-9deg)" },
      { opacity: 1, transform: "translateY(0) rotate(3deg)" }
    ], 690, 350],
    [".cover-firstname", [
      { opacity: 0, transform: "translateY(30px) rotate(-5deg)" },
      { opacity: 1, transform: "translateY(0) rotate(-5deg)" }
    ], 700, 480],
    [".cover h1", [
      { opacity: 0, clipPath: "inset(0 100% 0 0)" },
      { opacity: 1, clipPath: "inset(0 0 0 0)" }
    ], 1100, 620]
  ];
  for (const [selector, frames, duration, delay] of entrance) {
    const el = document.querySelector(selector);
    if (el) el.animate(frames, { duration, delay, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
  }

  const sections = document.querySelectorAll(".statement h2, .statement-copy, .work-intro, .project, .closing h2, .social-links");
  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const el = entry.target;
        const isProject = el.matches(".project");
        el.animate(
          [
            { opacity: .72, transform: isProject ? "translateY(24px)" : "translateY(17px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: isProject ? 720 : 560, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      }
    }, { threshold: .13 });
    sections.forEach(el => reveal.observe(el));
  }
}
