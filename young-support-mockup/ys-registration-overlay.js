(() => {
  if (window.self !== window.top || document.getElementById('registration-form')) return;
  const base = '/young-support-mockup/';
  let dialog, frame, opener, closing = false, previousOverflow;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'ys-registration-window';
    dialog.setAttribute('aria-label', 'Aanmelden bij YoungSupport');
    dialog.innerHTML = `<div class="ys-registration-window__shell">
      <header class="ys-registration-window__header">
        <div class="ys-registration-window__brand"><img src="${base}young-support-mark-vector.svg" alt="YoungSupport"></div>
        <button class="ys-registration-window__close" type="button" aria-label="Aanmeldformulier sluiten"><span aria-hidden="true">×</span></button>
      </header>
      <div class="ys-registration-window__body" data-lenis-prevent>
        <p class="ys-registration-window__loading" role="status">Het formulier wordt geladen… <a href="${base}aanmelden/" data-registration-standalone>Open het formulier op een aparte pagina</a></p>
        <iframe title="Aanmeldformulier YoungSupport" src="${base}aanmelden/?embedded=menu&v=ring3" ></iframe>
      </div></div>`;
    document.body.append(dialog);
    frame = dialog.querySelector('iframe');
    frame.addEventListener('load', () => {
      const ready = frame.contentDocument?.getElementById('registration-form');
      dialog.querySelector('.ys-registration-window__loading').hidden = !!ready;
      if (!ready) return;
      frame.contentWindow.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault(); close();
        }
      });
    });
    dialog.querySelector('button').addEventListener('click', close);
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  }
  function open(source) {
    if (dialog?.open) return;
    opener = source || document.activeElement;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    build();
    closing = false;
    dialog.showModal();
    dialog.querySelector('button').focus({preventScroll:true});
    // The same rounded menu frame opens over the current page; no navigation.
  }
  async function close() {
    if (!dialog?.open || closing) return;
    if (frame.contentWindow.YSRegistration?.canClose && !frame.contentWindow.YSRegistration.canClose()) return;
    closing = true;
    dialog.classList.add('is-closing');
    if (!reduced()) await new Promise(resolve => setTimeout(resolve, 320));
    dialog.close();
    dialog.remove();
    document.documentElement.style.overflow = previousOverflow;
    opener?.focus?.({preventScroll:true});
    dialog = frame = null;
    closing = false;
  }
  window.YSRegistrationOverlay = {open, close};
})();
