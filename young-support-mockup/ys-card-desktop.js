(() => {
  const row = document.querySelector('.ys-demo-grid');
  if (!row) return;
  const cards = [...row.children];
  const desktop = matchMedia('(min-width:1024px), (min-width:768px) and (min-height:501px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const offsets = [{y:0,r:-2},{y:0,r:1.5},{y:0,r:-1.5},{y:0,r:2}];
  let selected = 0;
  function arrange(index, immediate = false) {
    if (!desktop.matches) return;
    selected = index;
    cards.forEach((card, i) => {
      const chosen = i === index;
      if (!chosen) (window.ysSetCardExpanded ? window.ysSetCardExpanded(card.querySelector('details'), false) : card.querySelector('details').open = false);
      const x = index < 0 || chosen ? 0 : 12 / (i - index);
      const y = chosen ? -2 : offsets[i].y;
      const rotation = chosen ? 0 : offsets[i].r;
      const scale = chosen ? 1.035 : 1;
      card.classList.toggle('is-desktop-color', i === (index < 0 ? 0 : index));
      card.style.zIndex = chosen ? '10' : String(cards.length - i);
      if (window.gsap) {
        window.gsap.to(card, {xPercent:x,yPercent:y,rotation,scale,
          duration:immediate || reduced.matches ? 0 : .6,
          ease:'elastic.out(1,0.9)',overwrite:true});
      } else {
        card.style.transform = `translate(${x}%,${y}%) rotate(${rotation}deg) scale(${scale})`;
      }
    });
    row.dispatchEvent(new CustomEvent('ys:select-card', {detail:{index}}));
  }
  cards.forEach((card, index) => {
    const details = card.querySelector('details');
    details.addEventListener('toggle', () => {
      if (desktop.matches && index !== selected && details.open) (window.ysSetCardExpanded ? window.ysSetCardExpanded(details, false) : details.open = false);
    });
  });
  row.addEventListener('click', event => {
    const index = cards.findIndex(card => card.contains(event.target));
    if (index >= 0) arrange(index);
  });
  row.addEventListener('focusin', event => {
    const index = cards.findIndex(card => card.contains(event.target));
    if (index >= 0 && index !== selected) arrange(index);
  });
  function reset() {
    if (desktop.matches) arrange(selected, true);
    else cards.forEach(card => {
      window.gsap?.killTweensOf(card);
      card.style.removeProperty('transform');
      card.style.removeProperty('translate');
      card.style.removeProperty('rotate');
      card.style.removeProperty('scale');
      card.style.removeProperty('z-index');
    });
  }
  desktop.addEventListener('change', reset);
  reduced.addEventListener('change', () => arrange(selected, true));
  row.classList.add('is-desktop-ready');
  reset();
})();
