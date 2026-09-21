(() => {
  const hint = document.querySelector('.about-scroll-hint');
  if (!hint) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => hint.classList.toggle('is-hidden', scrollY > 10);
  const startMotion = () => {
    if (reduced.matches || document.body.classList.contains('about-motion-ready')) return;
    let started = false;
    let observer;
    let fallback;
    const transitionFinished = () => !document.querySelector('.ys-legal-wipe') && !document.documentElement.classList.contains('ys-legal-arrival');
    const begin = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      clearTimeout(fallback);
      requestAnimationFrame(() => {
        setTimeout(() => document.body.classList.add('about-motion-ready'), 320);
      });
    };
    if (transitionFinished()) { begin(); return; }
    observer = new MutationObserver(() => { if (transitionFinished()) begin(); });
    observer.observe(document.documentElement, {attributes:true,attributeFilter:['class'],childList:true,subtree:true});
    fallback = setTimeout(begin, 9000);
  };

  hint.addEventListener('click', event => {
    const target = document.querySelector(hint.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: reduced.matches ? 'auto' : 'smooth', block: 'start'});
    history.replaceState(null, '', hint.getAttribute('href'));
  });

  addEventListener('scroll', update, {passive:true});
  addEventListener('pageshow', update);
  if (document.readyState === 'complete') startMotion();
  else addEventListener('load', startMotion, {once:true});
  update();
})();
