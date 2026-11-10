// Small, intentional interaction: explain the product flow without pretending to be the app.
const steps = [
  {
    index: "01 / 03",
    title: "Drop the link.",
    description: "Paste a Reel or YouTube URL. Needle starts from the discovery, not a perfectly formatted track name.",
    symbol: "↗"
  },
  {
    index: "02 / 03",
    title: "Review the match.",
    description: "Find possible tracks, compare versions, and keep uncertain results visible rather than silently guessing.",
    symbol: "≈"
  },
  {
    index: "03 / 03",
    title: "Keep the music.",
    description: "Select what belongs and create a playlist you can open in Spotify. The choice stays yours.",
    symbol: "✓"
  }
];

const controls = Array.from(document.querySelectorAll("[data-step]"));
const index = document.getElementById("demo-index");
const title = document.getElementById("demo-title");
const description = document.getElementById("demo-description");
const symbol = document.querySelector(".demo-glyph-center");
const message = document.querySelector(".demo-message");
const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

controls.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = Number(button.dataset.step);
    const step = steps[selected];
    if (!step || button.getAttribute("aria-pressed") === "true") return;

    controls.forEach((control) => {
      control.setAttribute("aria-pressed", String(control === button));
    });

    index.textContent = step.index;
    title.textContent = step.title;
    description.textContent = step.description;
    symbol.textContent = step.symbol;

    // Explanation animation only: cheap, interruptible, and disabled when requested.
    if (!prefersLessMotion.matches && typeof message.animate === "function") {
      message.getAnimations().forEach((animation) => animation.cancel());
      message.animate(
        [{ opacity: 0.7, transform: "translateY(7px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
      );
    }
  });
});

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
