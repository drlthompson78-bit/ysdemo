(() => {
  const hint = document.querySelector('.about-scroll-hint');
  if (!hint) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => hint.classList.toggle('is-hidden', scrollY > 10);

  hint.addEventListener('click', event => {
    const target = document.querySelector(hint.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: reduced.matches ? 'auto' : 'smooth', block: 'start'});
    history.replaceState(null, '', hint.getAttribute('href'));
  });

  addEventListener('scroll', update, {passive:true});
  addEventListener('pageshow', update);
  update();
})();
