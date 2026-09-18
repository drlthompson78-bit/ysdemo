/* Local photo-montage demo. No video generation or external player. */
(() => {
  const section = document.querySelector('.ys-flow');
  const original = section?.querySelector('.flow__list');
  if (!original) return;
  const scenes = [
    ['01-aansluiten', 'Jouw verhaal. Ons vertrekpunt.', 'Een jongere vertelt; een begeleider luistert naast haar op een buitentrap.', 'jij vertelt.'],
    ['02-activeren', 'Een kleine stap brengt je verder.', 'Een jongere strikt een sneaker om op pad te gaan.', 'jouw tempo.'],
    ['03-versterken', 'Meer overzicht. Meer zelf kunnen.', 'Een jongere brengt overzicht in een eigen planning.', 'meer grip.'],
    ['04-vooruitkijken', 'Een volgende stap die bij jou past.', 'Een jongere komt zelfstandig aan bij een creatieve werkplaats.', 'jouw plek.'],
  ];
  const grid = document.createElement('ol');
  grid.className = 'ys-demo-grid';
  grid.id = 'aanpak-fotodemo';
  grid.setAttribute('aria-label', 'Onze aanpak in vier stappen');
  original.querySelectorAll('.flow__list-item').forEach((old, index) => {
    const [file, tagline, alt, sticker] = scenes[index];
    const title = old.querySelector('.flow__card-content-title').textContent.trim();
    const text = old.querySelector('.flow__card-content-paragraph').textContent.trim();
    const item = document.createElement('li');
    item.className = 'ys-demo-card';
    item.dataset.phase = '0';
    item.dataset.title = title;
    item.innerHTML = `<button class="ys-demo-play" type="button" aria-pressed="false" aria-label="Bekijk de foto-impressie ${title}">
      <img class="ys-demo-photo ys-demo-photo--a" src="./card-demo/${file}.webp" alt="${alt}" width="1000" height="1250" loading="lazy" decoding="async">
      <img class="ys-demo-photo ys-demo-photo--b" src="./card-demo/${file}-shot.webp" alt="" aria-hidden="true" width="1000" height="1250" loading="lazy" decoding="async">
      <img class="ys-demo-collage" src="./card-demo/${file}.webp" alt="" aria-hidden="true">
      <canvas class="ys-demo-grain" width="192" height="240" aria-hidden="true"></canvas>
      <span class="ys-demo-step">Stap ${index + 1}</span><span class="ys-demo-play-label">Bekijk 3 sec. <span aria-hidden="true">▷</span></span>
      <span class="ys-demo-sticker" aria-hidden="true">${sticker}</span><span class="ys-demo-progress" aria-hidden="true"></span>
    </button><div class="ys-demo-copy"><h3>${title}</h3><p class="ys-demo-tagline">${tagline}</p>
      <details><summary>Meer over ${title.toLowerCase()}</summary><p class="ys-demo-explanation"></p></details></div>`;
    item.querySelector('.ys-demo-explanation').textContent = text;
    grid.append(item);
  });
  original.replaceWith(grid);
  section.classList.add('ys-photo-demo');
  section.querySelector('.ys-flow__swipe-hint').remove();

  const cards = [...grid.children];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let autoplayTimer = 0;
  let desktopSelected = cards[0];
  const desktopVisible = new Set();
  const isDesktop = () => matchMedia('(min-width:1024px), (min-width:768px) and (min-height:501px)').matches;
  function startDesktop() {
    if (!isDesktop() || document.hidden || reduce.matches || !desktopVisible.has(desktopSelected)) return;
    if (active !== desktopSelected) play(desktopSelected);
  }
  grid.addEventListener('ys:select-card', event => {
    const next = cards[event.detail.index];
    if (!next) return;
    if (next !== desktopSelected) { stop(); desktopSelected = next; }
    startDesktop();
  });
  let active = null, frame = 0, pending = 0, start = 0;
  function stop() {
    cancelAnimationFrame(frame);
    clearTimeout(pending);
    clearTimeout(autoplayTimer);
    if (!active) return;
    active.dataset.phase = '0';
    active.querySelector('.ys-demo-progress').style.width = '0%';
    const button = active.querySelector('button.ys-demo-play');
    button?.setAttribute('aria-pressed', 'false');
    button?.setAttribute('aria-label', `Bekijk de foto-impressie ${active.dataset.title}`);
    active.querySelector('.ys-demo-play-label').textContent = 'Bekijk 3 sec. ▷';
    active = null;
  }
  function tick(now) {
    if (!active) return;
    const elapsed = now - start;
    if (elapsed >= 3200) {
      if (isDesktop() && active === desktopSelected && desktopVisible.has(active)) { start = now; frame = requestAnimationFrame(tick); return; }
      stop(); return;
    }
    const phase = elapsed < 700 ? '1' : elapsed < 1280 ? '2' : elapsed < 2300 ? '3' : '4';
    if (active.dataset.phase !== phase) active.dataset.phase = phase;
    if (!isDesktop()) active.querySelector('.ys-demo-progress').style.width = `${elapsed / 32}%`;
    frame = requestAnimationFrame(tick);
  }
  function play(card) {
    stop();
    if (reduce.matches) return;
    active = card;
    const button = card.querySelector('button.ys-demo-play');
    button?.setAttribute('aria-pressed', 'true');
    button?.setAttribute('aria-label', `Stop de foto-impressie ${card.dataset.title}`);
    card.querySelector('.ys-demo-play-label').textContent = 'Stop ■';
    start = performance.now();
    frame = requestAnimationFrame(tick);
  }
  cards.forEach(card => {
    const button = card.querySelector('button');
    button.addEventListener('keydown', event => { if (event.key === 'Escape') stop(); });
    const canvas = card.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const noise = ctx.createImageData(canvas.width, canvas.height);
      let seed = 12345;
      for (let i = 0; i < noise.data.length; i += 4) {
        seed = seed * 16807 % 2147483647;
        noise.data[i] = noise.data[i + 1] = noise.data[i + 2] = seed % 255;
        noise.data[i + 3] = 100;
      }
      ctx.putImageData(noise, 0, 0);
    }
  });
  function motionPreference() {
    stop();
    cards.forEach(card => {
      const button = card.querySelector('button');
      button.disabled = reduce.matches;
      card.querySelector('.ys-demo-play-label').textContent = reduce.matches ? 'Stilstaand beeld' : 'Bekijk 3 sec. ▷';
    });
  }
  motionPreference();
  reduce.addEventListener('change', motionPreference);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting && active === entry.target) stop(); });
  });
  cards.forEach(card => observer.observe(card));
  const desktopObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target.closest('.ys-demo-card');
      if (entry.isIntersecting && entry.intersectionRatio >= .5) desktopVisible.add(card);
      else { desktopVisible.delete(card); if (active === card) stop(); }
    });
    startDesktop();
  }, {threshold:[0,.5],rootMargin:'-90px 0px 0px 0px'});
  cards.forEach(card => desktopObserver.observe(card.querySelector('.ys-demo-play')));
  document.addEventListener('visibilitychange', startDesktop);

  // A separate mobile presentation keeps the existing desktop grid intact.
  const fan = document.createElement('section');
  fan.className = 'ys-fan';
  fan.setAttribute('aria-label', 'Onze aanpak, stap voor stap');
  fan.setAttribute('aria-roledescription', 'carousel');
  fan.innerHTML = `<div class="ys-fan-stage" aria-label="Veeg links of rechts voor de volgende of vorige stap"></div>
    <div class="ys-fan-nav"><button type="button" class="ys-fan-prev" aria-label="Vorige stap">←</button><p class="ys-fan-status" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" class="ys-fan-next" aria-label="Volgende stap">→</button></div>
    `;
  grid.after(fan);
  const stage = fan.querySelector('.ys-fan-stage');
  const mobileCards = cards.map((card, index) => {
    const clone = card.cloneNode(true);
    const mediaButton = clone.querySelector('.ys-demo-play');
    const media = document.createElement('div');
    media.className = mediaButton.className;
    media.append(...mediaButton.childNodes);
    mediaButton.replaceWith(media);
    const returnButton = document.createElement('button');
    returnButton.type = 'button';
    returnButton.className = 'ys-fan-return';
    returnButton.setAttribute('aria-label', `Terug naar stap ${index + 1}: ${card.dataset.title}`);
    returnButton.addEventListener('click', event => {
      if ((!suppressCardClick || event.detail === 0) && index < selected) selectStep(index);
    });
    clone.append(returnButton);
    clone.querySelector('details').addEventListener('toggle', () => { if (active === clone) stop(); });
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    clone.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    clone.querySelector('canvas').getContext('2d')?.drawImage(card.querySelector('canvas'), 0, 0);
    stage.append(clone);
    observer.observe(clone);
    return clone;
  });
  const previous = fan.querySelector('.ys-fan-prev');
  const next = fan.querySelector('.ys-fan-next');
  const status = fan.querySelector('.ys-fan-status');
  let selected = 0;
  let selectionPlayed = false;
  const visibleMedia = new Set();
  function queueAutoplay() {
    clearTimeout(autoplayTimer);
    const card = mobileCards[selected];
    if (!phone.matches || reduce.matches || document.hidden || gesture || selectionPlayed || !visibleMedia.has(card)) return;
    // Let the card's 550ms settling transition finish before its montage starts.
    autoplayTimer = setTimeout(() => {
      if (card !== mobileCards[selected] || !phone.matches || reduce.matches || document.hidden || gesture || selectionPlayed || !visibleMedia.has(card)) return;
      selectionPlayed = true;
      play(card);
    }, 600);
  }
  function measureFan() {
    stage.style.height = `${mobileCards[selected].offsetHeight + 72}px`;
  }
  const fanSize = new ResizeObserver(measureFan);
  mobileCards.forEach(card => fanSize.observe(card));
  function positionCards(position) {
    mobileCards.forEach((card, i) => {
      const offset = Math.max(-2.5, Math.min(2.5, i - position));
      card.style.setProperty('--fan-offset', offset);
      card.style.setProperty('--fan-drop', `${Math.abs(offset) * 15}px`);
      card.style.setProperty('--fan-scale', String(1 - Math.abs(offset) * .07));
    });
  }
  function selectStep(index) {
    const bounded = Math.max(0, Math.min(cards.length - 1, index));
    stop();
    if (bounded !== selected) selectionPlayed = false;
    selected = bounded;
    stage.classList.remove('is-dragging');
    positionCards(selected);
    mobileCards.forEach((card, i) => {
      card.style.translate = '';
      const distance = i - selected;
      card.style.zIndex = String(10 - Math.abs(distance));
      card.classList.toggle('is-selected', i === selected);
      card.inert = i > selected;
      card.setAttribute('aria-hidden', String(i > selected));
      card.querySelector('.ys-fan-return').hidden = i >= selected;
      card.querySelector('.ys-demo-copy').inert = i !== selected;
      card.querySelector('.ys-demo-copy').setAttribute('aria-hidden', String(i !== selected));
      card.querySelector('.ys-demo-play').setAttribute('aria-hidden', String(i !== selected));
      if (i !== selected) (window.ysSetCardExpanded ? window.ysSetCardExpanded(card.querySelector('details'), false) : card.querySelector('details').open = false);
    });
    previous.disabled = selected === 0;
    next.disabled = selected === cards.length - 1;
    status.textContent = `Stap ${selected + 1} van ${cards.length}`;
    measureFan();
    stage.setAttribute('aria-label', `${cards[selected].querySelector('h3').textContent}. ${scenes[selected][2]} Veeg links of rechts om van stap te wisselen.`);
    queueAutoplay();
  }
  previous.addEventListener('click', () => selectStep(selected - 1));
  next.addEventListener('click', () => selectStep(selected + 1));
  fan.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectStep(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Escape') stop();
  });
  let gesture = null;
  let suppressCardClick = false;
  // Opt-in, screen-only diagnostics: no storage, analytics or network requests.
  const swipeDebug = new URLSearchParams(location.search).get('swipeDebug') === '1';
  const swipeReports = [];
  let swipePanel;
  if (swipeDebug) {
    swipePanel = document.createElement('pre');
    swipePanel.style.cssText = 'position:fixed;bottom:8px;left:8px;right:8px;z-index:2147483647;padding:10px;margin:0;background:#082f62f2;color:white;border-radius:10px;font:12px/1.4 monospace;white-space:pre-wrap;pointer-events:none;max-height:28vh;overflow:hidden';
    swipePanel.textContent = 'SWIPE TEST 2 — veeg bij de kaarten.\nMaak na een mislukte veeg een screenshot.';
    document.body.append(swipePanel);
  }
  function reportSwipe(message) {
    if (!swipePanel) return;
    swipeReports.push(message);
    if (swipeReports.length > 6) swipeReports.shift();
    swipePanel.textContent = 'SWIPE TEST 2 — alleen op dit scherm\n' + swipeReports.join('\n');
  }
  function beginSwipe(event) {
    suppressCardClick = false;
    gesture = {id:event.pointerId,touch:event.pointerType === 'touch',x:event.clientX,y:event.clientY,dx:0,locked:false,time:performance.now()};
    reportSwipe(`START stap ${selected + 1} (${event.pointerType}) ${event.target.closest('.ys-demo-copy') ? 'tekst' : 'beeld/kaartrand'}`);
  }
  function moveSwipe(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    gesture.dx = dx;
    gesture.dy = dy;
    if (!gesture.locked) {
      // Only commit once there is a clear direction; a small diagonal start
      // must not discard a horizontal swipe. Native vertical scrolling stays on.
      if (Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx) * 1.5) { reportSwipe(`AFGEKEURD als verticaal: x=${Math.round(dx)} y=${Math.round(dy)}`); gesture = null; return; }
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      gesture.locked = true;
      reportSwipe(`HERKEND ${dx > 0 ? 'terug' : 'vooruit'}: x=${Math.round(dx)} y=${Math.round(dy)}`);
      stop();
      if (!gesture.touch) stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
    }
    gesture.dx = dx;
    const resisted = (selected === 0 && dx > 0) || (selected === cards.length - 1 && dx < 0) ? dx * .2 : dx;
    mobileCards[selected].style.translate = `${resisted}px 0`;
  }
  function endSwipe(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, locked = gesture.locked;
    const speed = Math.abs(dx) / Math.max(1, performance.now() - gesture.time);
    const accepted = locked && (Math.abs(dx) >= 30 || (Math.abs(dx) >= 18 && speed > .35));
    reportSwipe(`EINDE ${accepted ? 'swipe geaccepteerd' : locked ? 'veeg te kort' : 'niet als swipe herkend'}: x=${Math.round(dx)}, ${speed.toFixed(2)}px/ms`);
    suppressCardClick = locked;
    gesture = null;
    if (event.pointerType !== 'touch' && stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (locked) { selectStep(selected + (accepted ? (dx < 0 ? 1 : -1) : 0)); reportSwipe(`RESULTAAT stap ${selected + 1}`); }
    else queueAutoplay();
  }
  stage.addEventListener('click', event => {
    if (suppressCardClick && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  function cancelSwipe() {
    reportSwipe(`BROWSER AFGEBROKEN: ${gesture?.locked ? 'na herkenning' : 'voor herkenning'}, x=${Math.round(gesture?.dx || 0)} y=${Math.round(gesture?.dy || 0)}`);
    suppressCardClick = !!gesture?.locked;
    gesture = null;
    stage.classList.remove('is-dragging');
    mobileCards[selected].style.translate = '';
    positionCards(selected);
    queueAutoplay();
  }
  // Touch has its own non-passive stream. A pointercancel issued by iOS
  // must not discard a still-running touch swipe; only touchcancel ends it.
  const touchPoint = (touch, event) => ({pointerId:touch.identifier,pointerType:'touch',clientX:touch.clientX,clientY:touch.clientY,target:event.target});
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) { if (gesture) cancelSwipe(); return; }
    beginSwipe(touchPoint(event.touches[0], event));
  }, {passive:true});
  stage.addEventListener('touchmove', event => {
    if (!gesture?.touch) return;
    if (event.touches.length !== 1) { cancelSwipe(); return; }
    const touch = [...event.touches].find(t => t.identifier === gesture.id);
    if (!touch) return;
    moveSwipe(touchPoint(touch, event));
    if (gesture?.locked) {
      if (event.cancelable) event.preventDefault();
      else reportSwipe('Touchbeweging niet annuleerbaar');
    }
  }, {passive:false});
  stage.addEventListener('touchend', event => {
    if (!gesture?.touch) return;
    const touch = [...event.changedTouches].find(t => t.identifier === gesture.id);
    if (!touch) return;
    if (gesture.locked && event.cancelable) event.preventDefault();
    endSwipe(touchPoint(touch, event));
  }, {passive:false});
  stage.addEventListener('touchcancel', () => { if (gesture?.touch) cancelSwipe(); }, {passive:true});
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    beginSwipe(event);
  });
  stage.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') moveSwipe(event); });
  stage.addEventListener('pointerup', event => { if (event.pointerType !== 'touch') endSwipe(event); });
  stage.addEventListener('pointercancel', event => { if (event.pointerType !== 'touch') cancelSwipe(); });
  const phone = matchMedia('(max-width:767px), (max-width:1023px) and (max-height:500px) and (orientation:landscape)');
  function syncMobile() {
    stop();
    grid.inert = phone.matches;
    grid.setAttribute('aria-hidden', String(phone.matches));
    fan.inert = !phone.matches;
    fan.setAttribute('aria-hidden', String(!phone.matches));
    requestAnimationFrame(measureFan);
    queueAutoplay();
    startDesktop();
  }
  const autoplayObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target.closest('.ys-demo-card');
      if (entry.isIntersecting && entry.intersectionRatio >= .5) visibleMedia.add(card);
      else {
        visibleMedia.delete(card);
        if (active === card) stop();
      }
    });
    queueAutoplay();
  }, {threshold: [0, .5], rootMargin: '-90px 0px 0px 0px'});
  mobileCards.forEach(card => autoplayObserver.observe(card.querySelector('.ys-demo-play')));
  document.addEventListener('visibilitychange', queueAutoplay);
  selectStep(0);
  syncMobile();
  phone.addEventListener('change', syncMobile);
  reduce.addEventListener('change', syncMobile);
})();
