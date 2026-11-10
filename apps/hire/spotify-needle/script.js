// SKAROMNY × NEEDLE — a personal product story. The 39-second video is an authentic recording.
document.querySelectorAll("[data-year]").forEach(el => el.textContent = String(new Date().getFullYear()));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = !reduced && typeof Element.prototype.animate === "function";
if (canAnimate) {
  const beats = [
    [".opening h1", [{ opacity: .2, clipPath: "inset(0 0 100% 0)", transform: "translateY(30px)" }, { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translateY(0)" }], 830, 80],
    [".opening-sub", [{ opacity: 0, transform: "translateY(15px)" }, { opacity: 1, transform: "translateY(0)" }], 580, 450],
    [".video-feature", [{ opacity: .4, transform: "translate(35px,9px) scale(.965)" }, { opacity: 1, transform: "translate(0,0) scale(1)" }], 850, 380]
  ];
  for (const [selector, frames, duration, delay] of beats) {
    const el = document.querySelector(selector);
    el?.animate(frames, { duration, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
  }
  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver((entries, io) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        io.unobserve(target);
        target.animate([
          { opacity: .75, transform: "translateY(17px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 540, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
    }, { threshold: .16 });
    document.querySelectorAll(".decision-list article, .opportunity-heading, .flow-step, .hypothesis-metrics>div, .fit-evidence>div").forEach(el => reveal.observe(el));

    const opportunity = document.querySelector(".opportunity");
    if (opportunity) {
      const visibility = new IntersectionObserver(entries => {
        opportunity.classList.toggle("flow-idle", !entries[0].isIntersecting);
      }, { threshold: .03 });
      visibility.observe(opportunity);
    }
  }
}
