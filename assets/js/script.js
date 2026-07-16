
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Menú móvil ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('nav ul');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      navList.classList.toggle('open');
      const isOpen = navList.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navList.classList.remove('open'));
    });
  }

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
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

});
