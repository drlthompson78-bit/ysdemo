(function () {
  const assetBase = new URL('.', document.currentScript.src);
  const footer = document.querySelector('.ys-site-footer');
  const certificate = footer?.querySelector('.ys-site-footer__certification');
  const referencePopup = document.querySelector('.hero__logo-easter-egg [data-pop-up]') || document.querySelector('#ys-iso-template')?.content.querySelector('[data-pop-up]');
  if (!footer || !certificate || !referencePopup) return;

  footer.querySelector('.ys-site-footer__base-meta a[href*="youngsupport.nl"]')?.remove();

  const popup = referencePopup.cloneNode(true);
  popup.className = 'pop-up ys-site-footer__certification ys-site-footer__iso-pop-up';
  popup.removeAttribute('data-wf--logo-pop-up--variant');
  popup.removeAttribute('style');

  const trigger = popup.querySelector('[data-pop-up-button]');
  trigger.setAttribute('aria-label', 'ISO 9001-keurmerk: bekijk ons certificaat');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'ys-iso-popup-content');
  popup.querySelector('.pop-up__button-inner').innerHTML =
    '<img class="pop-up__button-svg ys-site-footer__iso-mark" src="./iso-9001-label.png" alt="" aria-hidden="true">';

  popup.querySelector('img').src = new URL('iso-9001-label.png', assetBase).href;
  const content = popup.querySelector('.pop-up__overlay-content');
  content.id = 'ys-iso-popup-content';
  popup.querySelector('.pop-up__overlay-title').textContent = 'Bekijk ons certificaat';
  const certificateUrl = new URL('Certificaat-ISO-9001-Young-Support.pdf', assetBase).href;
  popup.querySelector('.pop-up__overlay-content-action').innerHTML = `
    <a class="ys-site-footer__iso-arrow" href="${certificateUrl}" aria-label="Bekijk ons ISO 9001-certificaat op deze pagina">
      <svg viewBox="0 0 14 13" fill="none" aria-hidden="true"><path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor"/></svg>
    </a>`;

  certificate.replaceWith(popup);
  if (document.querySelector('#ys-iso-template')) {
    let lockedOpen = false;
    popup.addEventListener('pointerenter', () => popup.classList.add('is--open'));
    popup.addEventListener('pointerleave', () => { if (!lockedOpen) popup.classList.remove('is--open'); });
    trigger.addEventListener('click', event => {
      event.preventDefault(); lockedOpen = !lockedOpen;
      popup.classList.toggle('is--open', lockedOpen);
    });
    popup.addEventListener('focusin', () => popup.classList.add('is--open'));
    popup.addEventListener('focusout', event => {
      if (!lockedOpen && !popup.contains(event.relatedTarget)) popup.classList.remove('is--open');
    });
  }
  const viewer = document.createElement('dialog');
  viewer.className = 'ys-certificate-viewer';
  viewer.setAttribute('aria-label', 'ISO 9001-certificaat YoungSupport');
  viewer.innerHTML = `
    <div class="ys-certificate-viewer__inner">
      <div class="ys-certificate-viewer__header">
        <h2>ISO 9001-certificaat</h2>
        <div class="ys-certificate-viewer__actions">
          <a href="${certificateUrl}" target="_blank" rel="noopener noreferrer">Open PDF</a>
          <button type="button" aria-label="Sluit certificaat">×</button>
        </div>
      </div>
      <iframe class="ys-certificate-viewer__frame" title="ISO 9001-certificaat van YoungSupport" data-src="${certificateUrl}#toolbar=1&navpanes=0"></iframe>
    </div>`;
  document.body.appendChild(viewer);
  const certificateLink = popup.querySelector('.ys-site-footer__iso-arrow');
  // Delegate before the page-navigation handler; animated controls may replace
  // their inner markup during initialization.
  window.addEventListener('click', (event) => {
    if (!event.target.closest?.('.ys-site-footer__iso-arrow')) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const frame = viewer.querySelector('.ys-certificate-viewer__frame');
    if (!frame.hasAttribute('src')) frame.src = frame.dataset.src;
    viewer.showModal();
    viewer.querySelector('button').focus();
  }, true);
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => certificateLink.focus());
  new MutationObserver(() => {
    trigger.setAttribute('aria-expanded', String(popup.classList.contains('is--open')));
  }).observe(popup, { attributes: true, attributeFilter: ['class'] });
})();
