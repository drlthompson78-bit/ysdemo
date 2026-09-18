(() => {
  const story = document.querySelector('.ys-story');
  const inner = story?.querySelector('.ys-story__inner');
  if (!inner || story.classList.contains('ys3-ready')) return;
  inner.innerHTML = "<section class=\"ys3-intro ys3-wrap\" aria-labelledby=\"ys-story-title\">\n  <div class=\"ys3-intro-copy\">\n    <h2 id=\"ys-story-title\" aria-label=\"Als meedoen mogelijk wordt.\"><span class=\"ys3-title-line\">Als meedoen</span><span class=\"ys3-title-line ys3-title-green\">mogelijk wordt<span class=\"ys3-title-dot\">.</span></span></h2>\n    <p class=\"ys3-lead\">Sommige jongeren en jongvolwassenen lopen vast in het dagelijks leven. Thuis, op school, richting werk of in contact met anderen. Het lukt niet altijd om structuur vast te houden, afspraken na te komen of stappen te zetten richting zelfstandigheid.</p>\n  <figure class=\"ys3-approach-photo\"><img src=\"./young-support-page2-portrait.png\" alt=\"Een jonge vrouw die buiten zit en opzij kijkt\" width=\"1000\" height=\"1250\" loading=\"lazy\"></figure>\n  </div>\n  <div class=\"ys3-signals\">\n    <div class=\"ys3-signals-heading\"><h2>Dat kan zichtbaar worden in:</h2><button id=\"ys3-motion\" type=\"button\" aria-pressed=\"false\" aria-label=\"Pauzeer de bewegende tegels\"><span aria-hidden=\"true\">Ⅱ</span></button></div>\n    <div class=\"ys3-lift\" aria-label=\"Zeven signalen in het dagelijks leven\">\n      <ul class=\"ys3-track ys3-track-a\">\n        <li class=\"ys3-tile ys3-sage\"><span>Weinig structuur<br>of dagritme.</span></li>\n        <li class=\"ys3-tile ys3-sand\"><span>Vastlopen op school, werk of dagbesteding.</span></li>\n        <li class=\"ys3-tile ys3-navy\"><span>Afspraken moeilijk nakomen.</span></li>\n        <li class=\"ys3-tile ys3-pale\"><span>Steeds meer afstand tot school, werk of maatschappij.</span></li>\n      </ul>\n      <ul class=\"ys3-track ys3-track-b\">\n        <li class=\"ys3-tile ys3-pale\"><span>Moeite met plannen en overzicht houden.</span></li>\n        <li class=\"ys3-tile ys3-green\"><span>Weinig initiatief of motivatie.</span></li>\n        <li class=\"ys3-tile ys3-sand\"><span>Spanning in contact met anderen.</span></li>\n      </ul>\n    </div>\n  </div>\n</section>\n<section id=\"ys3-aansluiten\" class=\"ys3-approach-summary ys3-wrap\" aria-label=\"Hoe we aansluiten\">\n  <div class=\"ys3-approach-topics\">\n    <article class=\"ys3-approach-topic\" aria-labelledby=\"ys3-understanding-title\">\n      <img class=\"ys3-topic-icon\" src=\"./icon-begrijpen-transparant.png\" alt=\"\" width=\"80\" height=\"80\">\n      <div><h3 id=\"ys3-understanding-title\">Gedrag vertelt vaak dat er iets nodig is.</h3><p>Achter terugtrekken, afhaken of afspraken niet nakomen zit vaak meer dan onwil. YoungSupport kijkt naar wat er speelt, wat iemand nodig heeft en waar ruimte zit om weer vooruit te komen.</p></div>\n    </article>\n    <article class=\"ys3-approach-topic\" aria-labelledby=\"ys3-together-title\">\n      <img class=\"ys3-topic-icon\" src=\"./icon-aansluiten-transparant.png\" alt=\"\" width=\"80\" height=\"80\">\n      <div><h3 id=\"ys3-together-title\">We sluiten aan.</h3><p>Niet door alles over te nemen, maar door samen te kijken naar wat haalbaar is. Stap voor stap bouwen we aan structuur, vertrouwen en zelfstandigheid.</p></div>\n    </article>\n  </div>\n</section>\n";
  story.classList.add('ys3-ready');
  const lift = inner.querySelector('.ys3-lift');
  const button = inner.querySelector('#ys3-motion');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:767px), (max-width:1023px) and (max-height:500px) and (orientation:landscape)');
  let paused = false, inView = false;
  lift.querySelectorAll('.ys3-track').forEach(track => {
    [...track.children].forEach(tile => {
      const clone = tile.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      track.append(clone);
    });
  });
  lift.classList.add('is-ready');
  function update() {
    lift.classList.toggle('is-running', inView && !paused && !document.hidden && !reduced.matches);
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
