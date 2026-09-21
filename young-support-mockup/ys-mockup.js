(function () {
  // The downloaded reference was saved while the original page was scrolled.
  // Reset that captured state before Aardvark's own intro timeline starts.
  document.body.setAttribute('data-scrolling-started', 'false');

  const brandMarkup = `
    <span class="ys-brand">
      <span class="ys-brand__art" aria-hidden="true">
        <img class="ys-brand__mark" src="./young-support-mark-vector.svg?v=20260914-smooth2" alt="">
        <img class="ys-brand__wordmark" src="./young-support-wordmark-clean.png" alt="">
      </span>
    </span>`;

  const footerBrandMarkup = `
    <span class="ys-brand ys-brand--footer">
      <span class="ys-brand__art" aria-hidden="true">
        <img class="ys-brand__mark" src="./young-support-mark-vector.svg?v=20260914-smooth2" alt="">
        <img class="ys-brand__wordmark" src="./young-support-wordmark-clean.png" alt="">
      </span>
    </span>`;

  const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 13" fill="none" aria-hidden="true" class="button-alt__icon"><path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor"/></svg>`;

  const instagramIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" class="button-social__icon ys-header-social__icon"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>`;
  const linkedinIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" class="button-social__icon ys-header-social__icon"><path fill="currentColor" d="M5.2 3.35a1.86 1.86 0 1 1 0 3.72 1.86 1.86 0 0 1 0-3.72ZM3.6 8.55h3.2V20H3.6V8.55Zm5.08 0h3.07v1.57h.04c.43-.81 1.47-1.82 3.03-1.82 3.24 0 3.84 2.13 3.84 4.9V20h-3.2v-6.03c0-1.44-.03-3.29-2-3.29-2 0-2.31 1.57-2.31 3.18V20H8.68V8.55Z"/></svg>`;

  function normalButton(label, href) {
    return `<li class="header__nav-list-item"><a data-button href="${href}" class="button w-inline-block"><span class="button__bg"></span><span class="button__inner"><span data-button-text class="button__text" aria-label="${label}">${label}</span></span></a></li>`;
  }

  function dropdownButton(label) {
    return `<li class="header__nav-list-item ys-nav-dropdown"><button type="button" data-button class="button w-inline-block ys-nav-dropdown__trigger" aria-controls="ys-mega-menu" aria-expanded="false"><span class="button__bg"></span><span class="button__inner"><span data-button-text class="button__text" aria-label="${label}">${label}</span></span></button></li>`;
  }

  function actionButton(label, href) {
    return `<li class="header__nav-list-item"><a data-button-alt data-wf--button-alt--variant="base" href="${href}" class="button-alt w-inline-block"><span class="button-alt__text-wrap"><span class="button-alt__bg"></span><span class="button-alt__text-outer"><span data-button-alt-text class="button-alt__text" aria-label="${label}">${label}</span></span></span><span class="button-alt__icon-wrap"><span class="button-alt__bg"></span><span class="button-alt__icon-outer">${arrow}</span></span></a></li>`;
  }

  function mobileMenuButton(label, href) {
    return `<li class="menu__nav-list-item"><a data-button href="${href}" class="button w-inline-block"><span class="button__bg"></span><span class="button__inner"><span data-button-text class="button__text" aria-label="${label}">${label}</span></span></a></li>`;
  }

  function mobileMenuGroup(label, key, links) {
    return `<li class="menu__nav-list-item ys-mobile-menu-group">
      <button type="button" class="ys-mobile-menu-topic" aria-expanded="false" aria-controls="ys-mobile-menu-${key}">
        <span>${label}</span><span class="ys-menu-chevron" aria-hidden="true">›</span>
      </button>
      <ul id="ys-mobile-menu-${key}" class="ys-mobile-menu-panel" hidden>
        ${links.map(({ label: itemLabel, href, attrs = '' }) => `<li><a href="${href}" ${attrs}>${itemLabel}</a></li>`).join('')}
      </ul>
    </li>`;
  }

  document.title = 'YoungSupport - Website mockup';
  document.documentElement.lang = 'nl';
  const favicon = document.querySelector('link[rel="shortcut icon"]');
  if (favicon) {
    favicon.type = 'image/svg+xml';
    favicon.href = './young-support-favicon.svg?v=20260914-large1';
  }
  const touchIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (touchIcon) touchIcon.href = './young-support-mark-vector.svg?v=20260914-smooth2';

  document.querySelectorAll('.header__title-link, .menu__header-title-link').forEach((logo) => {
    logo.innerHTML = brandMarkup;
    logo.href = '#top';
    logo.setAttribute('data-barba-prevent', 'all');
    logo.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (logo.closest('.menu')) document.querySelector('[data-menu-close]')?.click();
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }), 180);
    }, true);
    logo.setAttribute('aria-label', 'YoungSupport');
  });

  const headerInner = document.querySelector('.header__inner');
  if (headerInner && !headerInner.querySelector('.ys-header-socials')) {
    headerInner.insertAdjacentHTML('beforeend', `
      <div class="ys-header-socials" aria-label="Social media">
        <a href="#" class="button-social ys-header-social w-inline-block" aria-label="YoungSupport op LinkedIn">
          <span class="button-social__inner">
            <span class="button-social__bg"></span>
            <span class="button-social__icon-outer">${linkedinIcon}</span>
          </span>
        </a>
        <a href="#" class="button-social ys-header-social w-inline-block" aria-label="YoungSupport op Instagram">
          <span class="button-social__inner">
            <span class="button-social__bg"></span>
            <span class="button-social__icon-outer">${instagramIcon}</span>
          </span>
        </a>
      </div>`);
    headerInner.querySelectorAll('.ys-header-social').forEach((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });
  }

  const navigation = document.querySelector('.header__nav-list');
  if (navigation) {
    navigation.innerHTML = [
      dropdownButton('Over ons'),
      normalButton('Onze aanpak', '#how-it-works'),
      normalButton('Onze visie', '#onze-visie'),
      actionButton('Aanmelden', './aanmelden/'),
    ].join('');

    const dropdown = navigation.querySelector('.ys-nav-dropdown');
    const dropdownTrigger = navigation.querySelector('.ys-nav-dropdown__trigger');
    if (dropdown && dropdownTrigger) {
      document.querySelector('.page-wrapper').insertAdjacentHTML('beforeend', `
        <div class="ys-mega-backdrop" aria-hidden="true"></div>
        <div id="ys-mega-menu" class="ys-mega-menu" aria-label="Over ons menu" aria-hidden="true" inert>
          <div class="ys-mega-menu__grid ys-mega-menu__modular">
            <div class="ys-mega-menu__intro">
              <h2>Waar kunnen we je mee helpen?</h2>
              <p>Kies een onderwerp. De belangrijkste informatie staat direct in beeld.</p>
            </div>
            <div class="ys-mega-menu__stage">
              <div class="ys-mega-menu__cards" role="tablist" aria-label="Onderwerpen" data-active-topic="about">
                <article class="ys-mega-menu__card is-active" data-menu-card="about">
                  <button type="button" class="ys-mega-menu__topic is-active" role="tab" aria-selected="true" aria-controls="ys-menu-panel-about" data-menu-topic="about">
                    <span class="ys-mega-menu__card-copy"><strong>Over YoungSupport</strong><small>Dit zijn wij en zo werken we.</small></span><span class="ys-menu-chevron" aria-hidden="true">↗</span>
                  </button>
                  <nav id="ys-menu-panel-about" aria-label="Over YoungSupport" class="ys-mega-menu__links ys-mega-menu__panel is-active" role="tabpanel" data-menu-panel="about">
                    <a href="./over-ons/"><span class="ys-mega-menu__link-text">Onze missie / Visie</span></a>
                    <a href="./Certificaat-ISO-9001-Young-Support.pdf" data-ys-certificate><span class="ys-mega-menu__link-text">Onze Kwaliteit</span></a>
                    <a href="#how-it-works"><span class="ys-mega-menu__link-text">Onze Werkwijze</span></a>
                  </nav>
                </article>
                <article class="ys-mega-menu__card" data-menu-card="information">
                  <button type="button" class="ys-mega-menu__topic" role="tab" aria-selected="false" aria-controls="ys-menu-panel-information" tabindex="-1" data-menu-topic="information">
                    <span class="ys-mega-menu__card-copy"><strong>Informatie voor …</strong><small>Voor iedereen die met YoungSupport te maken heeft.</small></span><span class="ys-menu-chevron" aria-hidden="true">→</span>
                  </button>
                  <nav id="ys-menu-panel-information" aria-label="Informatie voor" class="ys-mega-menu__links ys-mega-menu__panel" role="tabpanel" data-menu-panel="information" hidden>
                    <a href="#over-ons"><span class="ys-mega-menu__link-text">Jongeren</span></a>
                    <a href="#over-ons"><span class="ys-mega-menu__link-text">Jongvolwassenen</span></a>
                    <a href="#contact"><span class="ys-mega-menu__link-text">Medewerkers</span></a>
                    <a href="#contact"><span class="ys-mega-menu__link-text">Verwijzers</span></a>
                  </nav>
                  <span class="ys-mega-menu__count">4 pagina’s</span>
                </article>
                <article class="ys-mega-menu__card" data-menu-card="complaints">
                  <button type="button" class="ys-mega-menu__topic" role="tab" aria-selected="false" aria-controls="ys-menu-panel-complaints" tabindex="-1" data-menu-topic="complaints">
                    <span class="ys-mega-menu__card-copy"><strong>Complimenten en klachten</strong><small>Lees welke route bij jouw situatie past.</small></span><span class="ys-menu-chevron" aria-hidden="true">→</span>
                  </button>
                  <nav id="ys-menu-panel-complaints" aria-label="Complimenten en klachten" class="ys-mega-menu__links ys-mega-menu__panel" role="tabpanel" data-menu-panel="complaints" hidden>
                    <a href="./klachtenregeling/"><span class="ys-mega-menu__link-text">Bij wie kun je terecht met je klacht</span></a>
                    <a href="./klachtenregeling/#stap-01"><span class="ys-mega-menu__link-text">Klachten van medewerkers</span></a>
                  </nav>
                  <span class="ys-mega-menu__count">2 routes</span>
                </article>
              </div>
              <figure class="ys-mega-menu__image-wrap">
                <img src="./young-support-menu-photo.webp" alt="Jongere en begeleider lopen samen buiten" loading="lazy">
                <figcaption><small>YoungSupport</small><strong>Jouw stap.<br>Onze support.</strong></figcaption>
              </figure>
            </div>
            <div class="ys-mega-menu__footer">
              <div><a class="ys-mega-menu__email" href="mailto:info@youngsupport.nl">info@youngsupport.nl</a><a href="./privacybeleid/">Privacybeleid</a><a href="./algemene-voorwaarden/">Algemene voorwaarden</a></div>
              <a class="ys-mega-menu__contact" href="#contact">Neem contact op <span>→</span></a>
            </div>
          </div>
        </div>`);

      const panel = document.getElementById('ys-mega-menu');
      const backdrop = document.querySelector('.ys-mega-backdrop');
      const desktopMenu = window.matchMedia('(min-width: 992px)');
      const topicButtons = [...panel.querySelectorAll('[data-menu-topic]')];
      const topicPanels = [...panel.querySelectorAll('[data-menu-panel]')];
      const topicCards = [...panel.querySelectorAll('[data-menu-card]')];
      const cards = panel.querySelector('.ys-mega-menu__cards');
      const activateTopic = (button, moveFocus = false) => {
        const topic = button.dataset.menuTopic;
        topicButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
          item.tabIndex = active ? 0 : -1;
          const chevron = item.querySelector('.ys-menu-chevron');
          if (chevron) chevron.textContent = active ? '↗' : '→';
        });
        topicPanels.forEach((item) => {
          const active = item.dataset.menuPanel === topic;
          item.hidden = !active;
          item.classList.toggle('is-active', active);
        });
        topicCards.forEach((item) => item.classList.toggle('is-active', item.dataset.menuCard === topic));
        if (cards) cards.dataset.activeTopic = topic;
        if (moveFocus) button.focus();
      };
      topicButtons.forEach((button, index) => {
        button.addEventListener('click', () => activateTopic(button));
        button.addEventListener('keydown', (event) => {
          let nextIndex = index;
          if (event.key === 'ArrowDown') nextIndex = (index + 1) % topicButtons.length;
          else if (event.key === 'ArrowUp') nextIndex = (index - 1 + topicButtons.length) % topicButtons.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = topicButtons.length - 1;
          else return;
          event.preventDefault();
          activateTopic(topicButtons[nextIndex], true);
        });
      });
      let finishCloseTimer;
      let openedByHover = false;
      const finishClose = () => {
        window.clearTimeout(finishCloseTimer);
        finishCloseTimer = undefined;
        document.body.classList.remove('ys-mega-closing');
      };
      const closeDropdown = (restoreFocus = false) => {
        if (!document.body.classList.contains('ys-mega-open')) {
          if (restoreFocus) dropdownTrigger.focus();
          return;
        }
        window.clearTimeout(finishCloseTimer);
        document.body.classList.add('ys-mega-closing');
        document.body.classList.remove('ys-mega-open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        panel.inert = true;
        openedByHover = false;
        if (!desktopMenu.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
        else finishCloseTimer = window.setTimeout(finishClose, 710);
        if (restoreFocus) dropdownTrigger.focus();
      };
      const openDropdown = () => {
        if (!desktopMenu.matches) return;
        finishClose();
        document.body.classList.add('ys-mega-open');
        dropdownTrigger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        panel.inert = false;
      };
      const pointerIsInsideMenu = (event) => {
        const { left, right, bottom } = panel.getBoundingClientRect();
        // The fixed header sits directly above the panel; include it so moving
        // from the trigger to the menu does not close the menu in between.
        return event.clientX >= left && event.clientX <= right && event.clientY >= 0 && event.clientY <= bottom;
      };
      const updatePointerBoundary = (event) => {
        if (event.pointerType === 'touch' || dropdownTrigger.getAttribute('aria-expanded') !== 'true') return;
        if (!pointerIsInsideMenu(event)) closeDropdown();
      };

      dropdownTrigger.addEventListener('click', (event) => {
        if (openedByHover) {
          openedByHover = false;
          if (event.detail === 0) panel.querySelector('[data-menu-topic]')?.focus();
          return;
        }
        if (dropdownTrigger.getAttribute('aria-expanded') === 'true') closeDropdown();
        else {
          openDropdown();
          if (event.detail === 0) panel.querySelector('[data-menu-topic]')?.focus();
        }
      });
      dropdown.addEventListener('pointerenter', () => {
        if (dropdownTrigger.getAttribute('aria-expanded') !== 'true') openedByHover = true;
        openDropdown();
      });
      dropdown.addEventListener('pointerleave', updatePointerBoundary);
      panel.addEventListener('pointerleave', updatePointerBoundary);
      backdrop.addEventListener('pointerenter', updatePointerBoundary);
      document.addEventListener('pointermove', updatePointerBoundary, { passive: true });
      backdrop.addEventListener('click', () => closeDropdown());
      document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && !panel.contains(event.target)) closeDropdown();
      });
      document.addEventListener('focusin', (event) => {
        if (!dropdown.contains(event.target) && !panel.contains(event.target)) closeDropdown();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dropdownTrigger.getAttribute('aria-expanded') === 'true') {
          closeDropdown(true);
        }
      });
      desktopMenu.addEventListener('change', () => closeDropdown());
      panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => {
          const hash = link.getAttribute('href');
          if (link.hasAttribute('data-ys-certificate')) {
            const openCertificate = document.querySelector('.ys-site-footer__iso-arrow');
            if (openCertificate) {
              event.preventDefault();
              closeDropdown();
              openCertificate.click();
            }
            return;
          }
          closeDropdown();
          if (!hash?.startsWith('#')) return;
          const target = document.querySelector(hash);
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    navigation.querySelectorAll('.header__nav-list-item:not(.ys-nav-dropdown) > a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, true);
    });
  }

  const mobileNavigation = document.querySelector('.menu__nav-list');
  if (mobileNavigation) {
    mobileNavigation.innerHTML = [
      mobileMenuGroup('Over YoungSupport', 'about', [
        { label: 'Onze missie / Visie', href: './over-ons/' },
        { label: 'Onze Kwaliteit', href: './Certificaat-ISO-9001-Young-Support.pdf', attrs: 'data-ys-certificate' },
        { label: 'Onze Werkwijze', href: '#how-it-works' },
      ]),
      mobileMenuGroup('Informatie voor …', 'information', [
        { label: 'Jongeren', href: '#over-ons' },
        { label: 'Jongvolwassenen', href: '#over-ons' },
        { label: 'Medewerkers', href: '#contact' },
        { label: 'Verwijzers', href: '#contact' },
      ]),
      mobileMenuGroup('Complimenten en klachten', 'complaints', [
        { label: 'Bij wie kun je terecht met je klacht', href: './klachtenregeling/' },
        { label: 'Klachten van medewerkers', href: './klachtenregeling/#stap-01' },
      ]),
      mobileMenuButton('Aanmelden', './aanmelden/'),
    ].join('');

    const mobileMenuTopics = [...mobileNavigation.querySelectorAll('.ys-mobile-menu-topic')];
    mobileMenuTopics.forEach((button) => {
      button.addEventListener('click', () => {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        const willOpen = button.getAttribute('aria-expanded') !== 'true';
        mobileMenuTopics.forEach((item) => {
          item.setAttribute('aria-expanded', 'false');
          item.closest('.ys-mobile-menu-group')?.classList.remove('is-open');
          const itemPanel = document.getElementById(item.getAttribute('aria-controls'));
          if (itemPanel) itemPanel.hidden = true;
        });
        button.setAttribute('aria-expanded', String(willOpen));
        button.closest('.ys-mobile-menu-group')?.classList.toggle('is-open', willOpen);
        if (panel) panel.hidden = !willOpen;
      });
    });
    const firstMobileTopic = mobileMenuTopics[0];
    if (firstMobileTopic) {
      firstMobileTopic.setAttribute('aria-expanded', 'true');
      firstMobileTopic.closest('.ys-mobile-menu-group')?.classList.add('is-open');
      const firstMobilePanel = document.getElementById(firstMobileTopic.getAttribute('aria-controls'));
      if (firstMobilePanel) firstMobilePanel.hidden = false;
    }
  }

  const mobileLogin = document.querySelector('.menu__login [data-button-alt]');
  if (mobileLogin) {
    mobileLogin.href = './aanmelden/';
    mobileLogin.removeAttribute('target');
    const mobileLoginText = mobileLogin.querySelector('[data-button-alt-text]');
    if (mobileLoginText) {
      mobileLoginText.textContent = 'Aanmelden';
      mobileLoginText.setAttribute('aria-label', 'Aanmelden');
    }
  }

  document.querySelectorAll('a[href="./aanmelden/"]').forEach(link => {
    link.setAttribute('data-barba-prevent', 'all');
    link.addEventListener('click', () => {
      // Only navigation context, never registration data.
      try { sessionStorage.setItem('ys-registration-origin', JSON.stringify({url: location.href, y: window.scrollY})); } catch (_) {}
    });
  });

  const mobileMenuSub = document.querySelector('.menu__sub');
  if (mobileMenuSub) {
    mobileMenuSub.innerHTML = `
      <p class="ys-menu__social-label">Volg YoungSupport</p>
      <div class="ys-menu__socials" aria-label="Social media">
        <a href="#" class="button-social ys-menu__social w-inline-block" aria-label="YoungSupport op LinkedIn"><span class="button-social__inner"><span class="button-social__bg"></span><span class="button-social__icon-outer">${linkedinIcon}</span></span></a>
        <a href="#" class="button-social ys-menu__social w-inline-block" aria-label="YoungSupport op Instagram"><span class="button-social__inner"><span class="button-social__bg"></span><span class="button-social__icon-outer">${instagramIcon}</span></span></a>
      </div>`;
    mobileMenuSub.querySelectorAll('a').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
  }

  document.querySelectorAll('.menu__nav-list a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      document.querySelector('[data-menu-close]')?.click();
      window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 180);
    }, true);
  });

  const title = document.querySelector('[data-hero-title]');
  if (title) {
    title.textContent = 'Weer in beweging';
    title.classList.add('ys-accented-title');
    title.setAttribute('aria-label', 'Weer in beweging.');
  }

  const paragraph = document.querySelector('[data-hero-paragraph]');
  if (paragraph) {
    paragraph.textContent = 'YoungSupport biedt persoonlijke begeleiding aan jongeren en jongvolwassenen die vastlopen in het dagelijks leven. Samen werken we aan structuur, zelfstandigheid en een toekomst die weer perspectief geeft.';
  }

  const heroButton = document.querySelector('.hero__content > [data-button-alt]');
  if (heroButton) {
    heroButton.href = './over-ons/';
    heroButton.removeAttribute('target');
    const buttonText = heroButton.querySelector('[data-button-alt-text]');
    if (buttonText) {
      buttonText.textContent = 'Lees verder';
      buttonText.setAttribute('aria-label', 'Lees verder');
    }
  }

  const handwritten = document.querySelector('[data-hero-handwritten-text]');
  if (handwritten) {
    handwritten.textContent = 'Jouw stap. Onze support.';
    handwritten.setAttribute('aria-label', 'Jouw stap. Onze support.');
  }

  const heroVisual = document.querySelector('.hero__visual');
  const heroTextWrap = document.querySelector('.hero__text-wrap');
  if (heroVisual && heroTextWrap) {
    heroVisual.appendChild(heroTextWrap);
    heroTextWrap.classList.add('is--inside-card');
  }

  const heroImage = document.querySelector('.hero__visual-img');
  if (heroImage) {
    heroImage.removeAttribute('srcset');
    heroImage.removeAttribute('sizes');
    heroImage.alt = 'Jongere in gesprek met een begeleider van YoungSupport';

    const heroImageQuery = window.matchMedia('(max-width: 767px)');
    const updateHeroImage = () => {
      heroImage.src = heroImageQuery.matches
        ? './young-support-hero-mobile.png'
        : './young-support-brochure-page.png';
    };
    updateHeroImage();
    heroImageQuery.addEventListener?.('change', updateHeroImage);
  }

  const popUpButton = document.querySelector('.hero__logo-easter-egg .pop-up__button-inner');
  if (popUpButton) popUpButton.innerHTML = '<img class="ys-mini-mark pop-up__button-svg" src="./young-support-mark-vector.svg?v=20260914-smooth2" alt="">';

  const popUpTitle = document.querySelector('.hero__logo-easter-egg .pop-up__overlay-title');
  if (popUpTitle) popUpTitle.textContent = 'Even kennismaken?';

  const popUpCta = document.querySelector('.hero__logo-easter-egg .pop-up__overlay-content-action [data-button-alt]');
  if (popUpCta) {
    popUpCta.href = 'mailto:info@youngsupport.nl';
    popUpCta.removeAttribute('target');
    const popUpText = popUpCta.querySelector('[data-button-alt-text]');
    if (popUpText) {
      popUpText.textContent = 'Neem contact op';
      popUpText.setAttribute('aria-label', 'Neem contact op');
    }
  }

  const transitionLogo = document.querySelector('.transition__logo');
  if (transitionLogo) transitionLogo.innerHTML = '<img class="ys-transition-mark" src="./young-support-mark-vector.svg?v=20260914-smooth2" alt="">';

  const hero = document.querySelector('.hero');
  const originalFlow = document.querySelector('main > .flow');
  if (hero && originalFlow) {
    hero.id = 'top';
    originalFlow.id = 'how-it-works';
    originalFlow.classList.add('ys-flow');
    originalFlow.setAttribute('aria-labelledby', 'ys-flow-title');
    const flowTitle = originalFlow.querySelector('.flow__title');
    if (flowTitle) {
      flowTitle.id = 'ys-flow-title';
      flowTitle.textContent = 'Samen werken aan wat wél mogelijk is';
      flowTitle.classList.add('ys-accented-title');
      flowTitle.setAttribute('aria-label', 'Samen werken aan wat wél mogelijk is.');

      const heading = document.createElement('div');
      heading.className = 'ys-flow__heading';
      flowTitle.before(heading);
      heading.appendChild(flowTitle);
      heading.insertAdjacentHTML('afterbegin', '<p class="ys-flow__eyebrow">Onze aanpak</p>');
      heading.insertAdjacentHTML('afterend', `
        <div class="ys-flow__intro">
          <p class="ys-flow__quote u-handwritten-regular">Kleine stappen maken samen het grote verschil.</p>
          <p>Bij YoungSupport kijken we niet alleen naar waar een jongere of jongvolwassene vastloopt, maar vooral naar wat nodig is om weer verder te kunnen. We sluiten aan bij de leefwereld, mogelijkheden en het tempo van de persoon.</p>
          <p>Onze begeleiding is persoonlijk, praktisch en doelgericht. We werken stap voor stap aan meer grip, vertrouwen, zelfstandigheid en perspectief.</p>
        </div>`);
    }

    const approachQuote = 'Kleine stappen maken samen het grote verschil.';
    originalFlow.querySelectorAll('.flow__text').forEach((text) => {
      text.textContent = approachQuote;
      text.setAttribute('aria-label', approachQuote);
    });

    const flowLogo = originalFlow.querySelector('.flow__cta-logo');
    if (flowLogo) {
      flowLogo.src = './young-support-mark-vector.svg?v=20260914-smooth2';
      flowLogo.alt = 'YoungSupport';
    }

    const approachCards = [
      {
        step: 'Stap 1',
        title: 'Aansluiten',
        image: './aanpak-aansluiten.png',
        text: 'We beginnen bij de jongere of jongvolwassene zelf. Wat speelt er? Wat gaat al goed? Waar liggen zorgen, wensen en mogelijkheden? Vanuit vertrouwen bouwen we aan een werkbare relatie en bepalen we samen wat nodig is.',
      },
      {
        step: 'Stap 2',
        title: 'Activeren',
        image: './aanpak-activeren.png',
        text: 'We helpen om weer in beweging te komen. Dat kan gaan om het opbouwen van dagritme, afspraken nakomen, activiteiten ondernemen of stappen zetten richting school, werk of dagbesteding.',
      },
      {
        step: 'Stap 3',
        title: 'Versterken',
        image: './aanpak-versterken.png',
        text: 'We werken aan vaardigheden die helpen in het dagelijks leven. Denk aan plannen, overzicht houden, omgaan met spanning, zelfvertrouwen en het maken van keuzes. Het doel is dat iemand steeds meer zelf kan.',
      },
      {
        step: 'Stap 4',
        title: 'Vooruitkijken',
        image: './aanpak-vooruitkijken.png',
        text: 'Begeleiding is niet alleen gericht op vandaag. Samen kijken we naar wat nodig is om stappen vol te houden en verder te groeien. We werken toe naar meer zelfstandigheid, deelname aan de maatschappij en een perspectief dat past.',
      },
    ];

    originalFlow.querySelectorAll('.flow__list-item').forEach((item, index) => {
      const card = approachCards[index];
      if (!card) return;
      const step = item.querySelector('.flow__card-header-title');
      const image = item.querySelector('.flow__card-img');
      const title = item.querySelector('.flow__card-content-title');
      const paragraph = item.querySelector('.flow__card-content-paragraph');
      if (step) step.textContent = card.step;
      if (image) {
        image.src = card.image;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.alt = `Pictogram ${card.title}`;
      }
      if (title) title.textContent = card.title;
      if (paragraph) paragraph.textContent = card.text;
    });

    const flowContent = originalFlow.querySelector('.flow__content');
    if (flowContent && !originalFlow.querySelector('.ys-flow__swipe-hint')) {
      flowContent.insertAdjacentHTML('afterbegin', '<p class="ys-flow__swipe-hint">Zo werken we in vier stappen <span aria-hidden="true">→</span></p>');
    }
    if (flowContent && !originalFlow.querySelector('.ys-flow__closing')) {
      flowContent.insertAdjacentHTML('afterend', `
        <div class="ys-flow__closing" id="onze-visie">
          <h3>Geen standaardtraject, maar begeleiding die aansluit.</h3>
          <p>Iedere jongere en jongvolwassene is anders. Daarom kijken we steeds opnieuw welke ondersteuning nodig is, waar ruimte ontstaat om los te laten en wat de volgende haalbare stap is.</p>
        </div>`);
    }
    hero.insertAdjacentElement('afterend', originalFlow);

    originalFlow.querySelector('.flow__cta')?.remove();

    const heroEasterEgg = document.querySelector('.hero__logo-easter-egg');
    if (heroEasterEgg && !originalFlow.querySelector('.ys-flow__logo-easter-egg')) {
      const flowEasterEgg = heroEasterEgg.cloneNode(true);
      flowEasterEgg.classList.add('ys-flow__logo-easter-egg', 'ys-section-contact');
      const flowEasterEggButton = flowEasterEgg.querySelector('.pop-up__button');
      if (flowEasterEggButton) flowEasterEggButton.setAttribute('aria-label', 'Open YoungSupport contactkaart');
      originalFlow.appendChild(flowEasterEgg);
    }
  }

  if (hero && !document.querySelector('.ys-story')) {
    const storyAnchor = originalFlow || hero;
    storyAnchor.insertAdjacentHTML('afterend', `
      <section class="ys-story" id="over-ons" aria-labelledby="ys-story-title">
        <div class="ys-story__inner">
          <div class="ys-story__copy">
            <h2 class="ys-story__title" id="ys-story-title" aria-label="Als meedoen mogelijk wordt.">
              <span>Als meedoen</span>
              <span class="ys-accented-title">mogelijk wordt</span>
            </h2>

            <p class="ys-story__lead">Sommige jongeren en jongvolwassenen lopen vast in het dagelijks leven. Thuis, op school, richting werk of in contact met anderen. Het lukt niet altijd om structuur vast te houden, afspraken na te komen of stappen te zetten richting zelfstandigheid.</p>

            <div class="ys-story__signals">
              <h3>Dat kan zichtbaar worden in:</h3>
              <ul>
                <li>weinig structuur of dagritme;</li>
                <li>moeite met plannen en overzicht houden;</li>
                <li>vastlopen op school, werk of dagbesteding;</li>
                <li>weinig initiatief of motivatie;</li>
                <li>afspraken moeilijk nakomen;</li>
                <li>spanning in contact met anderen;</li>
                <li>steeds meer afstand tot school, werk of maatschappij.</li>
              </ul>
            </div>

            <div class="ys-story__notes">
              <article>
                <h3>Gedrag vertelt vaak dat er iets nodig is.</h3>
                <p>Achter terugtrekken, afhaken of afspraken niet nakomen zit vaak meer dan onwil. YoungSupport kijkt naar wat er speelt, wat iemand nodig heeft en waar ruimte zit om weer vooruit te komen.</p>
              </article>
              <article>
                <h3>We sluiten aan.</h3>
                <p>Niet door alles over te nemen, maar door samen te kijken naar wat haalbaar is. Stap voor stap bouwen we aan structuur, vertrouwen en zelfstandigheid.</p>
              </article>
            </div>
          </div>
        </div>
      </section>`);

    const story = document.querySelector('.ys-story');
    const contactLogo = hero.querySelector('.hero__logo-easter-egg');
    if (story && contactLogo) {
      const storyContact = contactLogo.cloneNode(true);
      storyContact.classList.add('ys-section-contact');
      storyContact.querySelector('.pop-up__button')?.setAttribute('aria-label', 'Open YoungSupport contactkaart');
      story.appendChild(storyContact);
    }
    const flowBackground = originalFlow && originalFlow.querySelector('.flow__bg');
    if (story && flowBackground) {
      const storyBackground = flowBackground.cloneNode(true);
      storyBackground.classList.add('ys-story__bg');
      storyBackground.querySelectorAll('[style]').forEach((element) => element.removeAttribute('style'));
      story.prepend(storyBackground);
    }
    if (heroButton) {
      heroButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        (originalFlow || story).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, true);
    }
  }

  const main = document.querySelector('main');
  if (main && !document.querySelector('.ys-site-footer')) {
    main.insertAdjacentHTML('afterend', `
      <div class="ys-section-bridge" aria-hidden="true"></div>
      <section id="contact" class="ys-site-footer__stage" aria-label="Samen kijken naar wat wél mogelijk is">
          <div class="ys-site-footer__bg" aria-hidden="true"></div>
          <div class="ys-site-footer__inner">
          <div class="ys-site-footer__content">
            <h2 class="ys-site-footer__title" aria-label="Samen kijken naar wat wél mogelijk is.">
              <span>Samen kijken</span>
              <span>naar wat wél</span>
              <span class="ys-accented-title">mogelijk is</span>
            </h2>
            <p class="ys-site-footer__lead">Wil je weten of YoungSupport passend is voor een jongere of jongvolwassene? Neem gerust contact met ons op. We denken mee over de situatie, de ondersteuningsvraag en een passende volgende stap.</p>
            <a data-button-alt data-wf--button-alt--variant="base" class="ys-site-footer__contact-button button-alt w-inline-block" href="mailto:info@youngsupport.nl">
              <span class="button-alt__text-wrap"><span class="button-alt__bg"></span><span class="button-alt__text-outer"><span data-button-alt-text class="button-alt__text" aria-label="Neem contact op">Neem contact op</span></span></span>
              <span class="button-alt__icon-wrap"><span class="button-alt__bg"></span><span class="button-alt__icon-outer">${arrow}</span></span>
            </a>
          </div>
          <figure class="ys-site-footer__visual">
            <img class="ys-contact-brochure-photo" src="./young-support-contact-brochure.png" alt="Een jongen en een begeleider in gesprek bij de Erasmusbrug">
          </figure>
          </div>
      </section>

      <footer class="ys-site-footer" data-footer-parallax aria-label="Footer">
        <div class="ys-site-footer__info">
          <div class="ys-site-footer__bottom" data-footer-parallax-top>
          <div class="ys-site-footer__brand-column">
            ${footerBrandMarkup}
            <p>Persoonlijke begeleiding voor jongeren en jongvolwassenen.</p>
          </div>

          <nav class="ys-site-footer__column" aria-label="Navigatie in de footer">
            <h3>Navigatie</h3>
            <ul>
              <li><a href="#top">Home</a></li>
              <li><a href="#how-it-works">Onze aanpak</a></li>
              <li><a href="./over-ons/">Over ons</a></li>
              <li><a href="#over-ons">Voor wie</a></li>
            </ul>
          </nav>

          <nav class="ys-site-footer__column" aria-label="Informatie in de footer">
            <h3>Informatie</h3>
            <ul>
              <li><a href="./privacybeleid/">Privacybeleid</a></li>
              <li><a href="./algemene-voorwaarden/">Algemene voorwaarden</a></li>
<li><a href="/young-support-mockup/klachtenregeling/">Klachtenregeling</a></li>
            </ul>
          </nav>

          <div class="ys-site-footer__column ys-site-footer__contact-column">
            <h3>Contact</h3>
            <address class="ys-site-footer__address">
              <strong>YoungSupport B.V.</strong>
              <span>Graze Weitje 22</span>
              <span>3077 BM Rotterdam</span>
              <a href="tel:+31681038635">+31 6 81 03 86 35</a>
              <a href="mailto:info@youngsupport.nl">info@youngsupport.nl</a>
            </address>
          </div>
          </div>

          <div class="ys-site-footer__base" data-footer-parallax-bottom>
            <img class="ys-site-footer__certification" src="./iso-9001-label.png" alt="ISO 9001:2015 gecertificeerd">
            <div class="ys-site-footer__base-meta">
              <span>© 2026 YoungSupport</span>
            </div>
            <div class="ys-site-footer__base-actions">
              <div class="ys-site-footer__socials" aria-label="Social media">
                <a class="ys-site-footer__social" href="#" aria-label="YoungSupport op LinkedIn">${linkedinIcon}</a>
                <a class="ys-site-footer__social" href="#" aria-label="YoungSupport op Instagram">${instagramIcon}</a>
              </div>
              <button class="ys-site-footer__back-top" type="button" aria-label="Terug naar boven">Terug naar boven <span aria-hidden="true">↑</span></button>
            </div>
          </div>
        </div>
      </footer>`);

    const footerBackgroundHost = document.querySelector('.ys-site-footer__bg');
    const heroBackground = document.querySelector('.hero__bg');
    if (footerBackgroundHost && heroBackground) {
      const footerBackground = heroBackground.cloneNode(true);
      footerBackground.removeAttribute('style');
      footerBackground.querySelectorAll('[style]').forEach((element) => element.removeAttribute('style'));
      footerBackgroundHost.append(footerBackground);

      const footerPattern = document.createElement('div');
      footerPattern.className = 'ys-site-footer__pattern';
      const footerPatternArt = heroBackground.cloneNode(true);
      footerPatternArt.removeAttribute('style');
      footerPatternArt.querySelectorAll('[style]').forEach((element) => element.removeAttribute('style'));
      footerPattern.append(footerPatternArt);
      document.querySelector('.ys-site-footer')?.prepend(footerPattern);
    }

    document.querySelectorAll('.ys-site-footer a[href="#"]').forEach((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });
    document.querySelectorAll('.ys-site-footer a[href^="#"]:not([href="#"])').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    document.querySelector('.ys-site-footer__back-top')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const siteFooter = document.querySelector('.ys-site-footer');
    if (siteFooter) {
      const footerStage = document.querySelector('.ys-site-footer__stage');
      const footerDesktop = window.matchMedia('(min-width: 992px)');
      const footerReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let footerTicking = false;
      let footerNearby = false;
      const footerMobile = window.matchMedia('(max-width: 990px)');
      const updateFooterReveal = () => {
        footerTicking = false;
        if (!footerNearby || document.hidden) return;
        const footerRect = siteFooter.getBoundingClientRect();
        const stageRect = footerStage.getBoundingClientRect();
        const mainBottom = main.getBoundingClientRect().bottom;
        const sceneProgress = Math.max(0, Math.min(1, (window.innerHeight - stageRect.top) / (window.innerHeight + stageRect.height)));
        const backgroundShift = footerReducedMotion.matches ? 0 : footerDesktop.matches
          ? (1 - sceneProgress) * 26
          : (0.5 - sceneProgress) * 24;

        const footerTop = footerRect.top + window.scrollY;
        const revealStart = footerTop - window.innerHeight;
        const revealEnd = Math.min(footerTop, document.documentElement.scrollHeight - window.innerHeight);
        const revealProgress = Math.max(0, Math.min(1, (window.scrollY - revealStart) / Math.max(1, revealEnd - revealStart)));
        const mobileReveal = footerMobile.matches && !footerReducedMotion.matches;
        // Finish layout reads before writing styles.
        footerStage.style.setProperty('--ys-footer-shift', `${backgroundShift.toFixed(1)}px`);
        siteFooter.style.setProperty('--ys-mobile-reveal-y', mobileReveal ? `${((1 - revealProgress) * 42).toFixed(1)}px` : '0px');
        document.body.classList.toggle(
          'ys-footer-in-view',
          mainBottom < window.innerHeight - 80 && footerRect.bottom > 0,
        );
      };
      const requestFooterUpdate = () => {
        if (footerTicking || !footerNearby || document.hidden) return;
        footerTicking = true;
        window.requestAnimationFrame(updateFooterReveal);
      };
      const footerVisibility = new IntersectionObserver(([entry]) => {
        footerNearby = entry.isIntersecting;
        if (footerNearby) requestFooterUpdate();
        else document.body.classList.remove('ys-footer-in-view');
      }, { rootMargin: '200px 0px' });
      footerVisibility.observe(siteFooter);
      document.addEventListener('visibilitychange', requestFooterUpdate);
      window.addEventListener('scroll', requestFooterUpdate, { passive: true });
      window.addEventListener('resize', requestFooterUpdate);
      footerReducedMotion.addEventListener('change', requestFooterUpdate);
      window.addEventListener('load', requestFooterUpdate, { once: true });
      requestFooterUpdate();
    }
  }
})();
