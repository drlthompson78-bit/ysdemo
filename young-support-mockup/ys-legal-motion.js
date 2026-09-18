(() => {
  const footer = document.querySelector('.ys-site-footer');
  document.querySelectorAll('.ys-site-footer a[href="#"]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });
  const pattern = document.querySelector('.legal-hero__pattern');
  document.querySelector('.ys-site-footer__back-top')?.addEventListener('click', () => window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}));
  if(pattern) new IntersectionObserver(([entry]) => {pattern.style.animationPlayState=entry.isIntersecting?'running':'paused';}).observe(pattern);
  if (!footer) return;
  window.initYSFooterParallax?.(document);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  const update = () => {
    queued = false;
    const rect = footer.getBoundingClientRect();
    const start = rect.top + scrollY - innerHeight;
    const end = Math.min(rect.top + scrollY, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, end - start)));
    footer.style.setProperty('--ys-mobile-reveal-y', innerWidth <= 990 && !reduced.matches ? `${(1-progress)*42}px` : '0px');
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  document.fonts?.ready.then(() => { window.ScrollTrigger?.refresh(); schedule(); });
  schedule();
})();
