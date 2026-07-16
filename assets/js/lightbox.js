
(function () {
  "use strict";

  let currentGroup = [];
  let currentIndex = 0;
  let lastFocusedEl = null;

  function buildLightbox() {
    const el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-counter"></span>
        <button type="button" class="lightbox-close" aria-label="Cerrar">✕</button>
        <button type="button" class="lightbox-prev" aria-label="Imagen anterior">‹</button>
        <img class="lightbox-image" src="" alt="">
        <button type="button" class="lightbox-next" aria-label="Imagen siguiente">›</button>
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(el);
    return el;
  }

  const lightbox = buildLightbox();
  const imageEl = lightbox.querySelector(".lightbox-image");
  const captionEl = lightbox.querySelector(".lightbox-caption");
  const counterEl = lightbox.querySelector(".lightbox-counter");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  function getCaption(imgEl) {
    const figure = imgEl.closest("figure");
    const figcaption = figure && figure.querySelector("figcaption");
    if (figcaption) return figcaption.textContent.trim();
    return imgEl.getAttribute("alt") || "";
  }

  function render() {
    const img = currentGroup[currentIndex];
    if (!img) return;
    imageEl.src = img.getAttribute("src");
    imageEl.alt = img.getAttribute("alt") || "";
    captionEl.textContent = getCaption(img);
    counterEl.textContent = currentGroup.length > 1
      ? `${currentIndex + 1} / ${currentGroup.length}`
      : "";
    const multi = currentGroup.length > 1;
    prevBtn.style.display = multi ? "flex" : "none";
    nextBtn.style.display = multi ? "flex" : "none";
  }

  function open(group, index, triggerEl) {
    currentGroup = group;
    currentIndex = index;
    lastFocusedEl = triggerEl || document.activeElement;
    render();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  function step(delta) {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    render();
  }

  function onKeydown(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  }

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  function collectGroups() {
    // Cada .gallery y cada .gallery-section forman su propio grupo navegable
    const containers = document.querySelectorAll(".gallery, .gallery-section .gallery-grid, .gallery-grid");
    const seen = new Set();

    containers.forEach((container) => {
      if (seen.has(container)) return;
      seen.add(container);

      const imgs = Array.from(container.querySelectorAll("img"));
      if (!imgs.length) return;

      imgs.forEach((img, i) => {
        // Envolvemos cada imagen suelta (grid de TAM) en un botón accesible
        // solo si todavía no está dentro de una <figure> (caso INVERTI/TERRA)
        let trigger = img.closest("figure");

        if (!trigger) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "thumb";
          btn.setAttribute("aria-label", `Ampliar imagen: ${img.alt || "captura del proyecto"}`);
          img.parentNode.insertBefore(btn, img);
          btn.appendChild(img);
          trigger = btn;
        } else {
          trigger.setAttribute("tabindex", "0");
          trigger.style.cursor = "zoom-in";
        }

        trigger.addEventListener("click", () => open(imgs, i, trigger));
        trigger.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open(imgs, i, trigger);
          }
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", collectGroups);
  } else {
    collectGroups();
  }
})();