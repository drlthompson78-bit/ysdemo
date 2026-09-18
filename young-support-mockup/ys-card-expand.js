(() => {
  const states = new WeakMap();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  window.ysSetCardExpanded = (details, open) => {
    if (!details) return;
    const previous = states.get(details);
    if (previous?.open === open || (!previous && details.open === open)) return;
    const start = details.getBoundingClientRect().height;
    previous?.animation.cancel();
    details.style.height = '';
    details.style.overflow = '';
    details.open = true;
    const end = open ? details.getBoundingClientRect().height : details.querySelector('summary').getBoundingClientRect().height;
    if (reduced.matches || !details.animate) { details.open = open; states.delete(details); return; }
    details.style.overflow = 'hidden';
    const animation = details.animate([{height:`${start}px`},{height:`${end}px`}],{duration:420,easing:'cubic-bezier(.22,.7,.2,1)'});
    const state = {open,animation};
    states.set(details,state);
    animation.onfinish = () => {
      if (states.get(details) !== state) return;
      details.open = open;
      details.style.height = '';
      details.style.overflow = '';
      states.delete(details);
    };
  };
  document.addEventListener('click', event => {
    const summary = event.target.closest('.ys-demo-card summary');
    if (!summary) return;
    event.preventDefault();
    const details = summary.parentElement;
    window.ysSetCardExpanded(details, !(states.get(details)?.open ?? details.open));
  });
})();
