(() => {
  const lift = document.querySelector('.lift');
  const button = document.querySelector('#motion');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:767px)');
  let paused = false, inView = false;
  lift.querySelectorAll('.track').forEach(track => {
    [...track.children].forEach(tile => {
      const clone = tile.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      track.append(clone);
    });
  });
  lift.classList.add('is-ready');
  function update() {
    lift.classList.toggle('is-running', inView && !paused && !document.hidden && !reduced.matches && !mobile.matches);
  }
  button.addEventListener('click', () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Hervat de bewegende tegels' : 'Pauzeer de bewegende tegels');
    button.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    update();
  });
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); }).observe(lift);
  reduced.addEventListener('change', update);
  mobile.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
})();
