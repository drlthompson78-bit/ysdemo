(() => {
  'use strict';
  const layout = document.querySelector('.layout');
  const shell = document.querySelector('.sidebar-shell');
  const grip = document.querySelector('.sidebar-grip');
  const desktop = matchMedia('(min-width:801px)');
  const max = 280;
  let width = max, expanded = true, drag = null, suppressClick = false;
  const clamp = value => Math.max(0, Math.min(max, value));
  function position(value) {
    width = clamp(value);
    layout.style.setProperty('--sidebar-width', width + 'px');
  }
  function settle(open) {
    expanded = open;
    position(open ? max : 0);
    shell.inert = !open;
    shell.setAttribute('aria-hidden', String(!open));
    grip.setAttribute('aria-expanded', String(open));
    grip.setAttribute('aria-label', 'Onderdelenoverzicht ' + (open ? 'verbergen' : 'onthullen'));
  }
  function alignGrip() {
    if (!desktop.matches || layout.hidden) return;
    const step = shell.querySelector('[data-step="5"]');
    if (!step) return;
    const rect = step.getBoundingClientRect();
    layout.style.setProperty('--grip-top', rect.top + rect.height / 2 - layout.getBoundingClientRect().top + 'px');
  }
  grip.addEventListener('pointerdown', event => {
    if (!desktop.matches || event.button !== 0) return;
    suppressClick = false;
    // Start at the rendered width, including when an animation is interrupted.
    width = shell.getBoundingClientRect().width;
    drag = { id: event.pointerId, x: event.clientX, start: width, moved: false, open: expanded };
    layout.classList.add('is-dragging');
    position(width);
    grip.setPointerCapture(event.pointerId);
  });
  grip.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) > 4) drag.moved = true;
    if (drag.moved) position(drag.start + delta);
  });
  function finish(event, cancelled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const previous = drag;
    drag = null;
    layout.classList.remove('is-dragging');
    suppressClick = previous.moved || cancelled;
    if (grip.hasPointerCapture(event.pointerId)) grip.releasePointerCapture(event.pointerId);
    settle(cancelled || !previous.moved ? previous.open : width >= max / 2);
  }
  grip.addEventListener('pointerup', event => finish(event));
  grip.addEventListener('pointercancel', event => finish(event, true));
  grip.addEventListener('lostpointercapture', event => finish(event, true));
  grip.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
    settle(!expanded);
  });
  grip.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    settle(event.key === 'ArrowRight' || event.key === 'End');
  });
  const observer = new ResizeObserver(alignGrip);
  observer.observe(shell.querySelector('.sidebar'));
  desktop.addEventListener('change', () => { if (drag) finish({ pointerId: drag.id }, true); alignGrip(); });
  alignGrip();
})();
