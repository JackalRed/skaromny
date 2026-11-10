document.querySelectorAll("[data-year]").forEach(el => el.textContent = String(new Date().getFullYear()));
// The real iPhone demo uses native HTML video controls; no autoplay or fake animation.
