(() => {
  const footer = document.querySelector('.ys-site-footer');
  document.querySelectorAll('.ys-site-footer a[href="#"]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });
  const pattern = document.querySelector('.legal-hero__pattern');
  document.querySelector('.ys-site-footer__back-top')?.addEventListener('click', () => window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}));
  if(pattern) new IntersectionObserver(([entry]) => {pattern.style.animationPlayState=entry.isIntersecting?'running':'paused';}).observe(pattern);
  if (!footer) return;
  // Keep tall footers readable on phones; recalculate after fonts or rotation.
  const measureFooter = () => {
    const viewport = document.documentElement.clientHeight;
    footer.style.setProperty('--legal-footer-bottom', Math.min(0, viewport - footer.offsetHeight) + 'px');
  };
  new ResizeObserver(measureFooter).observe(footer);
  window.addEventListener('resize', measureFooter, {passive:true});
  document.fonts?.ready.then(measureFooter);
  measureFooter();
})();
