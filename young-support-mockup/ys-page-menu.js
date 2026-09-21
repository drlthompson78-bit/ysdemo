(function () {
  const header = document.querySelector('.legal-header');
  if (!header || header.querySelector('.ys-page-menu-toggle')) return;

  const groups = {
    about: {
      short: 'Over ons',
      title: 'Over YoungSupport',
      links: [
        ['Onze missie / Visie', '/young-support-mockup/over-ons/'],
        ['Onze Kwaliteit', '/young-support-mockup/Certificaat-ISO-9001-Young-Support.pdf'],
        ['Onze Werkwijze', '/young-support-mockup/#how-it-works'],
      ],
    },
    information: {
      short: 'Voor wie',
      title: 'Informatie voor …',
      links: [
        ['Jongeren', '/young-support-mockup/#over-ons'],
        ['Jongvolwassenen', '/young-support-mockup/#over-ons'],
        ['Medewerkers', '/young-support-mockup/#contact'],
        ['Verwijzers', '/young-support-mockup/#contact'],
      ],
    },
    complaints: {
      short: 'Klachten',
      title: 'Complimenten en Klachten',
      links: [
        ['Bij wie kun je terecht met je klacht?', '/young-support-mockup/klachtenregeling/'],
        ['Klachten van medewerkers', '/young-support-mockup/klachtenregeling/'],
      ],
    },
  };

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ys-page-menu-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'ys-page-menu');
  toggle.innerHTML = '<span class="ys-page-menu-toggle__label">Menu</span><span class="ys-page-menu-toggle__icon" aria-hidden="true"><span></span></span>';
  header.appendChild(toggle);

  const menu = document.createElement('aside');
  menu.id = 'ys-page-menu';
  menu.className = 'ys-page-menu';
  menu.setAttribute('aria-label', 'Hoofdmenu');
  menu.setAttribute('aria-hidden', 'true');
  menu.inert = true;
  menu.innerHTML = `
    <a class="ys-page-menu__brand" href="/young-support-mockup/" aria-label="YoungSupport — home">
      <img src="/young-support-mockup/young-support-mark-vector.svg?v=20260914-smooth2" alt="">
      <img src="/young-support-mockup/young-support-wordmark-clean.png" alt="YoungSupport. Jouw stap. Onze support.">
    </a>
    <div class="ys-page-menu__content">
      <section class="ys-page-menu__card" aria-live="polite"></section>
      <div class="ys-page-menu__tabs" role="tablist" aria-label="Menu-onderwerpen"></div>
      <a class="ys-page-menu__enrol" href="/young-support-mockup/aanmelden/"><span>Aanmelden</span><span aria-hidden="true">→</span></a>
    </div>`;
  document.body.appendChild(menu);

  const card = menu.querySelector('.ys-page-menu__card');
  const tabs = menu.querySelector('.ys-page-menu__tabs');
  let active = 'about';
  let returnFocus = null;

  const showGroup = (key, focusTab) => {
    active = key;
    const group = groups[key];
    card.innerHTML = `<p class="ys-page-menu__crumb">Menu&nbsp;&nbsp;›&nbsp;&nbsp;${group.short}</p><h2>${group.title}</h2><ul class="ys-page-menu__links">${group.links.map(([label, href]) => `<li><a href="${href}"><span>${label}</span><span class="ys-page-menu__arrow" aria-hidden="true">→</span></a></li>`).join('')}</ul>`;
    tabs.querySelectorAll('button').forEach((button) => {
      const selected = button.dataset.group === key;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    if (focusTab) tabs.querySelector(`[data-group="${key}"]`)?.focus();
  };

  Object.entries(groups).forEach(([key, group]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ys-page-menu__tab';
    button.dataset.group = key;
    button.setAttribute('role', 'tab');
    button.textContent = group.short;
    button.addEventListener('click', () => showGroup(key));
    tabs.appendChild(button);
  });
  showGroup(active);

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    document.body.classList.toggle('ys-page-menu-open', open);
    if (open) {
      returnFocus = document.activeElement;
      window.setTimeout(() => {
        if (menu.getAttribute('aria-hidden') === 'false') card.querySelector('a')?.focus();
      }, 640);
    } else {
      window.setTimeout(() => {
        if (menu.getAttribute('aria-hidden') === 'true') returnFocus?.focus?.();
      }, 640);
    }
  };
  toggle.addEventListener('click', () => setOpen(menu.getAttribute('aria-hidden') === 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') setOpen(false);
  });
})();
