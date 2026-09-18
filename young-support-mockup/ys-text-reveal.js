/* Edge-inspired text entrance: 10px, 500ms, 100ms stagger.
   Native compositor animation; replays when text re-enters the viewport. */
(() => {
  function init() {
    if (!window.IntersectionObserver || !Element.prototype.animate) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    // Explicit text targets avoid the hero intro, cards, handwritten and photo effects.
    const targets = [...document.querySelectorAll('.ys-legal-page .legal-copy h2, .ys-legal-page .legal-copy h3, .ys-legal-page .legal-copy p, .ys-legal-page .legal-copy li, #how-it-works h2, #how-it-works p, .ys3-intro-copy h2, .ys3-lead, #ys3-aansluiten h3, #ys3-aansluiten p, #contact h2, #contact .ys-site-footer__lead')].filter(el => !el.closest('[data-handwritten-text-inview], .ys-flow__quote, .ys-flow__swipe-hint, .ys-demo-card') && !el.querySelector('[data-handwritten-text-inview]'));
    const animations = new Set();
    const seen = new WeakSet();
    const running = new WeakSet();
    const farOutside = new WeakSet();
    // Hysteresis: crossing the entrance edge does not re-arm the animation.
    const resetObserver = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) farOutside.delete(target);
        else {
          farOutside.add(target);
          if (!running.has(target)) seen.delete(target);
        }
      });
    }, {threshold: 0, rootMargin: '200px 0px'});
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      visible.forEach((entry,index) => {
        if (motion.matches || seen.has(entry.target) || running.has(entry.target)) return;
        seen.add(entry.target);
        running.add(entry.target);
        const animation = entry.target.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay:Math.min(index,2)*100,easing:'cubic-bezier(0,0,0.58,1)',fill:'backwards'});
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => {
          animations.delete(animation);
          running.delete(entry.target);
          if (farOutside.has(entry.target)) seen.delete(entry.target);
        };
      });
    },{threshold:0,rootMargin:'0px'});
    targets.forEach(el => {
      // Already-visible text stays readable on reload or direct anchor navigation.
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) seen.add(el);
      resetObserver.observe(el);
      observer.observe(el);
    });
    motion.addEventListener('change',() => {
      if (motion.matches) animations.forEach(a=>a.cancel());
    });
    document.addEventListener('focusin',e => animations.forEach(a => {
      if (a.effect.target.contains(e.target)) a.cancel();
    }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
