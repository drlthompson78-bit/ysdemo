(() => {
  function init() {
    const section = document.querySelector('#contact');
    const photo = section?.querySelector('.ys-site-footer__visual');
    const copy = section?.querySelector('.ys-site-footer__content');
    const cta = section?.querySelector('.ys-site-footer__contact-button');
    if (!photo || !copy || !cta || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion:no-preference)', () => {
      section.classList.add('ys-contact-scroll');
      const offset = () => {
        const p = photo.getBoundingClientRect();
        const c = copy.getBoundingClientRect();
        // Read layout positions independently of the animated transform.
        const current = parseFloat(photo.style.getPropertyValue('--contact-x')) || 0;
        return Math.min(0, c.left - (p.left - current));
      };
      const timeline = gsap.timeline({scrollTrigger:{
        trigger:photo,start:'top 90%',end:'top 35%',scrub:0.8,
        invalidateOnRefresh:true
      }});
      timeline.fromTo(photo, {'--contact-x':() => `${offset()}px`},
        {'--contact-x':'0px',duration:1,ease:'none'},0);
      timeline.fromTo(cta,{opacity:0},{opacity:1,duration:.45,ease:'none'},.45);
      const focus = () => { gsap.set(cta,{opacity:1}); };
      cta.addEventListener('focus',focus);
      photo.querySelector('img')?.addEventListener('load',ScrollTrigger.refresh,{once:true});
      return () => { cta.removeEventListener('focus',focus); section.classList.remove('ys-contact-scroll'); };
    });
  }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load',init,{once:true});
})();
