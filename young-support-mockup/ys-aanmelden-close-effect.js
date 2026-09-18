(() => {
  const button = document.querySelector('.close');
  const label = button?.querySelector('.close-label');
  const gsap = window.gsap;
  if (!label || !gsap) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  label.replaceChildren(...Array.from(label.textContent, letter => {
    const span = document.createElement('span');
    span.className = 'close-char'; span.textContent = letter;
    return span;
  }));
  const targets = [...label.children];
  let timeline, closing = false;
  function play(done = () => {}) {
    timeline?.kill();
    gsap.killTweensOf(targets);
    if (reduced.matches) { done(); return; }
    gsap.set(targets, {yPercent:0,scaleY:1,rotate:0});
    // Same keyframes, elastic easing and stagger as the site's initButton().
    timeline = gsap.timeline({onComplete:done});
    timeline.to(targets, {
      keyframes:{
        '0%':{yPercent:0,scaleY:1,rotate:0},
        '20%':{yPercent:55,scaleY:.3,rotate:17,ease:'power2.in'},
        '100%':{yPercent:0,scaleY:1,rotate:0,ease:'elastic.out(1,0.4)'}
      },duration:.725,stagger:{amount:.225}
    });
  }
  function reset() {
    if (closing) return;
    timeline?.kill();
    gsap.to(targets,{yPercent:0,scaleY:1,rotate:0,duration:reduced.matches?0:.2,ease:'power2.out',overwrite:true});
  }
  button.addEventListener('mouseenter', () => { if (hover.matches && !closing) play(); });
  button.addEventListener('mouseleave', reset);
  button.addEventListener('focusin', () => { if (button.matches(':focus-visible') && !closing) play(); });
  button.addEventListener('focusout', reset);
  window.YSAnimateRegistrationClose = () => {
    closing = true;
    button.classList.add('is-closing');
    return new Promise(resolve => {
      const fallback = setTimeout(resolve, 1100);
      play(() => { clearTimeout(fallback); resolve(); });
    });
  };
})();
