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

// Sticky header, reading progress, and active chapter navigation.
// requestAnimationFrame keeps scroll-linked work cheap on mobile.
const header = document.getElementById("site-header");
const progress = document.querySelector(".reading-progress span");
const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
let scheduled = false;
function updateScrollUI() {
  const y = window.scrollY || 0;
  header?.classList.toggle("is-scrolled", y > 16);
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  if (progress) progress.style.transform = "scaleX(" + Math.min(y / max, 1) + ")";
  scheduled = false;
}
window.addEventListener("scroll", () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateScrollUI);
}, { passive: true });
window.addEventListener("resize", updateScrollUI, { passive: true });
updateScrollUI();

// Keep simple, keyboard-operable native anchors; CSS scroll-behavior provides the ease.
if ("IntersectionObserver" in window && navLinks.length) {
  const refs = navLinks.map(link => document.getElementById(link.getAttribute("href").slice(1))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const current = link.getAttribute("href") === "#" + entry.target.id;
        link.classList.toggle("is-current", current);
        if (current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-19% 0px -64% 0px", threshold: 0 });
  refs.forEach(section => sectionObserver.observe(section));
}

// Motion should feel like a composed story, not a repeating generic fade.
// JS-off, old browsers and reduced-motion users see everything immediately.
if (!prefersReduced && "IntersectionObserver" in window) {
  const sections = [...document.querySelectorAll(
    ".career-intro, .career-row, .cases-head, .case-story, .principles-grid, .contact-grid"
  )];
  sections.forEach((el, index) => {
    el.setAttribute("data-motion", "");
    el.style.setProperty("--motion-delay", (index % 3) * 60 + "ms");
  });
  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add("in-view");
      observer.unobserve(target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -4% 0px" });
  sections.forEach(el => reveal.observe(el));
  document.documentElement.classList.add("motion-enhanced");
}

if (!prefersReduced && typeof Element.prototype.animate === "function") {
  const heroScenes = [
    [".intro-name",[
      { opacity:0, letterSpacing:".18em", transform:"translateY(20px)" },
      { opacity:1, letterSpacing:"-.055em", transform:"translateY(0)" }
    ],850,80],
    [".intro h1",[
      { opacity:0, clipPath:"inset(0 0 100% 0)",transform:"translateY(24px)" },
      { opacity:1, clipPath:"inset(0 0 0 0)",transform:"translateY(0)" }
    ],1050,220],
    [".intro-summary",[
      { opacity:0, transform:"translateY(18px)" },
      { opacity:1, transform:"translateY(0)" }
    ],720,560],
    [".numbers",[
      { opacity:.35, transform:"translateY(22px)" },
      { opacity:1, transform:"translateY(0)" }
    ],800,690]
  ];
  for(const [selector, keyframes, duration, delay] of heroScenes) {
    document.querySelector(selector)?.animate(keyframes, {
      duration, delay, easing:"cubic-bezier(.16,1,.3,1)",fill:"backwards"
    });
  }
}
