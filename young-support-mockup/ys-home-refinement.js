/* First-stage design review: home hero and its menus only. */
(() => {
  const stage = document.querySelector('.ys-mega-menu__stage');
  if (stage) {
    const detail = document.createElement('div');
    detail.className = 'ys-menu-detail';
    stage.insertBefore(detail, stage.querySelector('figure'));
    stage.querySelectorAll('[data-menu-panel]').forEach(panel => {
      const topic = stage.querySelector(`[data-menu-topic="${panel.dataset.menuPanel}"]`);
      topic.id = `ys-desktop-topic-${panel.dataset.menuPanel}`;
      panel.setAttribute('aria-labelledby', topic.id);
      const title = document.createElement('h3');
      title.textContent = topic.querySelector('strong').textContent;
      panel.prepend(title);
      detail.appendChild(panel);
    });
  }
  document.querySelectorAll('.header [data-button], .header [data-button-alt], .hero__content > [data-button-alt]').forEach(button => {
    button.classList.add('ys-fill-control');
    if (button.matches('[data-button-alt]')) button.classList.add('ys-fill-sand');
  });
})();
