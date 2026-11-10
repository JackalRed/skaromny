// SKAROMNY / PERSONAL: scroll controls the scene, not just one-off entrance fades.
// No GSAP dependency. Two pinned stages continuously respond to scroll position.
// With JavaScript disabled, each section is still readable. Honors reduced motion.

document.querySelectorAll("[data-year]").forEach(node => {
  node.textContent = String(new Date().getFullYear());
});

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".site-head");
const hero = document.querySelector(".hero");
const about = document.querySelector(".statement");
const work = document.querySelector(".work");
const steps = [...document.querySelectorAll(".statement-index span")];
const projects = [...document.querySelectorAll(".project")];

const clamp01 = n => Math.max(0, Math.min(1, n));
function progressFor(el) {
  if (!el) return 0;
  const range = Math.max(1, el.offsetHeight - window.innerHeight + (header?.offsetHeight ?? 72));
  return clamp01((window.scrollY - el.offsetTop + (header?.offsetHeight ?? 72)) / range);
}

let queued = false;
function render() {
  queued = false;
  const scrollY = window.scrollY || 0;
  header?.classList.toggle("is-scrolled", scrollY > 14);
  if (reduce.matches) return;

  if (hero) {
    const p = progressFor(hero);
    hero.style.setProperty("--hero-progress", p.toFixed(4));
    hero.dataset.scene = p < .28 ? "opening" : p < .72 ? "transition" : "reveal";
  }
  if (about) {
    const p = progressFor(about);
    about.style.setProperty("--about-progress", p.toFixed(4));
    const phase = Math.min(2, Math.floor(p * 3));
    steps.forEach((step, i) => step.classList.toggle("is-active", i === phase));
    about.dataset.scene = ["products", "music", "making"][phase];
  }
  if (work) {
    const rect = work.getBoundingClientRect();
    const w = clamp01((window.innerHeight - rect.top) / Math.max(1, rect.height + window.innerHeight));
    work.style.setProperty("--gallery-progress", w.toFixed(4));
    for (const [i, project] of projects.entries()) {
      const media = project.querySelector(".project-art");
      if (!media) continue;
      const box = media.getBoundingClientRect();
      const local = clamp01((window.innerHeight - box.top) / (window.innerHeight + box.height));
      media.style.setProperty("--project-progress", local.toFixed(4));
      media.style.setProperty("--project-index", String(i));
    }
  }
}
function requestRender() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(render);
}

window.addEventListener("scroll", requestRender, { passive:true });
window.addEventListener("resize", requestRender, { passive:true });
reduce.addEventListener?.("change", () => {
  if (reduce.matches) {
    hero?.style.setProperty("--hero-progress", "0");
    about?.style.setProperty("--about-progress", "0");
    work?.style.setProperty("--gallery-progress", "0");
  }
  requestRender();
});

requestRender();
