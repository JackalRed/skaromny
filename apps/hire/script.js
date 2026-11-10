// SKAROMNY / PROFESSIONAL — deliberate, restrained evidence-led motion.
document.querySelectorAll("[data-year]").forEach(el => el.textContent = String(new Date().getFullYear()));
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const metrics = [...document.querySelectorAll(".metric[data-count]")];
const completeMetric = (metric) => {
  const number = metric.querySelector("strong");
  if (number) number.textContent = metric.dataset.count + metric.dataset.suffix;
  metric.classList.add("activated");
};
if (prefersReduced || !("IntersectionObserver" in window)) {
  metrics.forEach(completeMetric);
} else {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      const display = target.querySelector("strong");
      const finalValue = Number(target.dataset.count);
      const suffix = target.dataset.suffix;
      if (!display || !Number.isFinite(finalValue)) continue;
      const started = performance.now();
      const duration = 560;
      target.classList.add("activated");
      const tick = (now) => {
        if (!display.isConnected) return;
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        display.textContent = Math.round(finalValue * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else display.textContent = finalValue + suffix;
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: .5 });
  metrics.forEach(metric => counterObserver.observe(metric));
}

// Native details preserve keyboard and screen-reader semantics; only one long case is open at once.
const stories = [...document.querySelectorAll(".case-story")];
stories.forEach(story => story.addEventListener("toggle", () => {
  if (!story.open) return;
  stories.forEach(other => { if (other !== story && other.open) other.open = false; });
}));

if (!prefersReduced && typeof Element.prototype.animate === "function" && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, io) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      entry.target.animate([
        { opacity: .72, transform: "translateY(13px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 410, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  }, { threshold: .18 });
  document.querySelectorAll(".career-row, .case-story, .contact-grid").forEach(el => observer.observe(el));
}
