
document.addEventListener('DOMContentLoaded', () => {

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
    // Sin soporte de IntersectionObserver: mostrar todo directamente
    reveals.forEach(el => el.classList.add('is-visible'));
  }

});
