
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Menú móvil ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('nav ul');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navList.classList.contains('open'));
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navList.classList.remove('open'));
    });
  }

  /* ---- Resaltar sección activa en el nav ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul a');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.style.color = '');
          const active = document.querySelector(`nav ul a[href="#${entry.target.id}"]`);
          if (active) active.style.color = 'var(--teal)';
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => navIo.observe(s));
  }

  /* ---- Botón volver arriba ---- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 600);
    });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Toggles "Ver más" en cada proyecto ---- */
  document.querySelectorAll('.details-toggle').forEach(btn => {
    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains('details-panel')) return;
    const chevron = btn.querySelector('.chevron');
    const baseLabel = btn.dataset.label || btn.textContent.replace('▾', '').replace('▴', '').trim();
    btn.addEventListener('click', () => {
      const isOpen = panel.hasAttribute('hidden') === false;
      if (isOpen) {
        panel.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        if (chevron) chevron.textContent = '▾';
      } else {
        panel.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        if (chevron) chevron.textContent = '▴';
      }
    });
  });

});
