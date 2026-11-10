// Personal site deliberately avoids autoplay, tracking, and scroll hijacking.
document.querySelectorAll("[data-year]").forEach(node => {
  node.textContent = String(new Date().getFullYear());
});
// Gentle link feedback without cursor-following or movement-heavy effects.
document.querySelectorAll(".elsewhere-links a").forEach(link => {
  link.addEventListener("focus", () => link.dataset.focused = "true");
  link.addEventListener("blur", () => delete link.dataset.focused);
});
