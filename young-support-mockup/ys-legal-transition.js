(() => {
  const base = '/young-support-mockup/';
  const legalPath = path => /^\/young-support-mockup\/(privacybeleid|algemene-voorwaarden|klachtenregeling)\/?$/.test(path);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pathData = 'M66.858-19C57.597 196.452 127.164 482.585 206.5 464.5c125.428-28.592 52.293-293.51 200.001-339 568.234-175-241.425 712.6 15.5 803.02C645 1007 629.398 499 810.5 499c113.398 0 106.54 189.465 164.235 429.52 48.005 199.72 89.415 213.09 105.265 173.78';
  let busy = false, overlay, timeline;
  const gsap = window.gsap;
  if (gsap && window.CustomEase && window.DrawSVGPlugin) {
    gsap.registerPlugin(window.CustomEase, window.DrawSVGPlugin);
    CustomEase.create('ys-legal-sweep', '0.625, 0.05, 0, 1');
  }
  function createOverlay() {
    overlay?.remove();
    overlay = document.createElement('div');
    overlay.className = 'ys-legal-wipe';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `<div class="ys-legal-wipe__shape"><svg viewBox="0 0 1080 1080" fill="none" preserveAspectRatio="none"><path d="${pathData}" stroke="currentColor" stroke-width="70%" stroke-linecap="round" stroke-linejoin="round"/></svg></div><img class="ys-legal-wipe__logo" src="${base}young-support-mark-vector.svg?v=20260914-smooth2" alt="">`;
    document.body.append(overlay);
    return {path:overlay.querySelector('path'),logo:overlay.querySelector('img')};
  }
  function clear() {
    timeline?.kill();
    overlay?.remove();
    document.documentElement.classList.remove('ys-legal-arrival');
    busy = false;
  }
  function reveal(onReveal = () => {}) {
    if (reduced() || !gsap || !window.DrawSVGPlugin) { clear(); onReveal(); return Promise.resolve(); }
    busy = true;
    const {path, logo} = createOverlay();
    gsap.set(path, {drawSVG:'0% 100%',strokeWidth:'70%'});
    gsap.set(logo, {scale:1,rotate:0,autoAlpha:1});
    document.documentElement.classList.remove('ys-legal-arrival');
    onReveal();
    return new Promise(resolve => {
      timeline = gsap.timeline({defaults:{ease:'ys-legal-sweep'},onComplete:() => { clear(); resolve(); }});
      // The reference's page-enter stroke and logo keyframes.
      timeline.to(path,{keyframes:{'95%':{strokeWidth:'8%',ease:'circ.out'},'100%':{drawSVG:'100% 100%'}},duration:1.25},0);
      // Opacity and scale must decrease once, never bounce through zero and reappear.
      timeline.to(logo,{scale:0,rotate:64,autoAlpha:0,duration:.45,ease:'power2.in'},0);
      if (document.body.classList.contains('ys-legal-page')) {
        timeline.from('.legal-hero h1, .legal-hero p', {y:32,autoAlpha:0,duration:.8,stagger:.08}, .4);
        timeline.from('.legal-header', {yPercent:-100,duration:.5}, .7);
      }
    });
  }
  function leave(destination) {
    const url = new URL(destination, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return;
    if (busy) return;
    const navigate = () => {
      if (url.pathname === location.pathname && url.search === location.search && url.hash) {
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) { clear(); return; }
        if (location.hash !== url.hash) history.pushState(null, '', url.href);
        const y = url.hash === '#top' ? 0 : target.getBoundingClientRect().top + scrollY;
        if (typeof lenis !== 'undefined' && lenis) lenis.scrollTo(y, {immediate:true, force:true});
        else window.scrollTo({top:y,behavior:'instant'});
        reveal();
        return;
      }
      try { sessionStorage.setItem('ys-legal-navigation', JSON.stringify({path:url.pathname,time:Date.now()})); } catch (_) {}
      location.assign(url.href);
    };
    if (reduced() || !gsap || !window.DrawSVGPlugin) { navigate(); return; }
    const preload = document.createElement('link');
    preload.rel = 'prefetch';
    preload.href = url.href;
    document.head.append(preload);
    busy = true;
    const {path,logo} = createOverlay();
    timeline = gsap.timeline({defaults:{ease:'ys-legal-sweep'},onComplete:navigate});
    gsap.set(path,{strokeWidth:'8%',drawSVG:'0% 0%'});
    gsap.set(logo,{scale:0,rotate:-64,autoAlpha:0});
    // The reference's page-leave stroke and logo keyframes.
    timeline.to(path,{keyframes:{'15%':{strokeWidth:'8%'},'90%':{drawSVG:'0% 100%'},'100%':{strokeWidth:'70%'}},duration:1.25},0);
    timeline.to(logo,{scale:1,rotate:0,delay:.5,duration:.65,ease:'elastic.out(1,0.72)'},0);
    timeline.to(logo,{autoAlpha:1,duration:.2,ease:'power2.out'},.5);
  }
  window.YSLegalTransition = {reveal, leave, incoming:!!window.YSLegalArrival};
  window.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(base)) return;
    const registration = url.pathname === base + 'aanmelden/';
    const footerNav = !!link.closest('.ys-site-footer nav[aria-label="Navigatie in de footer"]');
    if (!footerNav && !registration && !legalPath(url.pathname) && !legalPath(location.pathname)) return;
    if (!footerNav && url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (busy) return;
    if (registration) {
      try { sessionStorage.setItem('ys-registration-origin', JSON.stringify({url:location.href,y:window.scrollY})); } catch (_) {}
    }
    link.classList.add('ys-link-selected');
    leave(url.href);
  }, true);
  window.addEventListener('pageshow', event => { if (event.persisted) clear(); });
  if ((document.body.classList.contains('ys-legal-page') || document.getElementById('registration-form')) && window.YSLegalArrival) {
    reveal();
  }
})();
