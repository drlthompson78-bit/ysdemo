/* Compatibility for phones that cached the previous prototype script. */
(() => {
  const hint = document.querySelector('.ys-flow__swipe-hint');
  if (hint && !document.querySelector('.ys-photo-demo')) hint.innerHTML = 'Zo werken we in vier stappen <span aria-hidden="true">→</span>';

  // Let long cards scroll fully into view before they stick behind the next one.
  const deck = document.querySelector('.ys-flow .flow__list');
  if (deck) {
    const phone = window.matchMedia('(max-width: 767px)');
    const cards = Array.from(deck.querySelectorAll('.flow__list-item'));
    const header = document.querySelector('.header');
    let pendingFrame;
    const measureDeck = () => {
      cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(() => {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const headerHeight = header?.getBoundingClientRect().height || 80;
        cards.forEach((card, index) => {
          if (!phone.matches) {
            card.style.removeProperty('--ys-card-top');
            return;
          }
          const height = card.getBoundingClientRect().height;
          const top = Math.min(headerHeight + 12 + index * 8, viewportHeight - height - 16);
          card.style.setProperty('--ys-card-top', `${Math.round(top)}px`);
        });
      });
    };
    const observer = new ResizeObserver(measureDeck);
    cards.forEach(card => observer.observe(card));
    if (header) observer.observe(header);
    phone.addEventListener('change', measureDeck);
    window.addEventListener('resize', measureDeck, { passive: true });
    window.visualViewport?.addEventListener('resize', measureDeck, { passive: true });
    document.fonts.ready.then(measureDeck);
    measureDeck();
  }

  document.querySelectorAll('.hero__logo-easter-egg .pop-up__overlay-content-action a').forEach((link) => {
    link.href = 'mailto:info@youngsupport.nl';
  });

  if (window.matchMedia('(max-width: 767px)').matches) {
    const oldButton = document.querySelector('.ys-flow__logo-easter-egg .pop-up__button');
    if (oldButton) {
      const button = oldButton.cloneNode(true);
      button.setAttribute('aria-label', 'Open Young Support contactkaart');
      oldButton.replaceWith(button);
    }
  }

  const footer = document.querySelector('.ys-site-footer');
  const heroBackground = document.querySelector('.hero__bg');
  if (footer && heroBackground && !footer.querySelector('.ys-site-footer__pattern')) {
    const pattern = document.createElement('div');
    pattern.className = 'ys-site-footer__pattern';
    const art = heroBackground.cloneNode(true);
    art.removeAttribute('style');
    art.querySelectorAll('[style]').forEach((element) => element.removeAttribute('style'));
    pattern.append(art);
    footer.prepend(pattern);
  }
})();
