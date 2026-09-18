(() => {
  'use strict';
  const { steps, visible, errorsFor } = window.YSRegistrationSchema;
  const form = document.getElementById('registration-form');
  const panels = document.getElementById('panels');
  const completed = new Set(), attempted = new Set(), notApplicable = new Set();
  const values = Object.create(null);
  let current = 0, dirty = false, overviewOpen = false;
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function markup(f) {
    const label = escape(f.label || '') + (f.required ? ' *' : '');
    if (f.type === 'heading') return `<h2 class="subheading">${label}</h2>`;
    if (f.type === 'note') return `<p class="note">${label}</p>`;
    if (f.type === 'address-action') return '<div class="address-action"><button type="button" disabled>Adres ophalen</button><small>In deze testversie vul je straat en woonplaats zelf in.</small></div>';
    const attrs = `id="${f.id}" name="${f.id}" aria-describedby="${f.id}-error"${f.required ? ' required' : ''}`;
    const error = `<span id="${f.id}-error" class="field-error" hidden></span>`;
    const when = f.when ? ' hidden' : '';
    if (f.type === 'radio' || f.type === 'checkboxes') {
      return `<fieldset class="field-group" data-field="${f.id}"${when}><legend>${label}</legend><div class="options">${f.options.map((option, i) => `<label class="check"><input id="${f.id}-${i}" type="${f.type === 'radio' ? 'radio' : 'checkbox'}" name="${f.id}" value="${escape(option)}" aria-describedby="${f.id}-error">${escape(option)}</label>`).join('')}</div>${error}</fieldset>`;
    }
    if (f.type === 'consent') return `<div class="wide" data-field="${f.id}"><label class="check"><input type="checkbox" ${attrs}>${label}</label>${error}</div>`;
    if (f.type === 'upload') return `<section class="upload" data-field="${f.id}"${when}><h2>${label}</h2><p>${escape(f.hint)}</p><label for="${f.id}">Klik of sleep bestanden</label><input type="file" id="${f.id}" multiple disabled aria-describedby="${f.id}-hint"><p id="${f.id}-hint">Max 5 bestanden, elk max 10 MB. Documentuploads worden pas beschikbaar na koppeling van de beveiligde verwerking.</p></section>`;
    let control;
    if (f.type === 'select') control = `<span class="select-wrap"><select ${attrs}><option value="">${escape(f.placeholder)}</option>${f.options.map(option => `<option value="${escape(option)}">${escape(option)}</option>`).join('')}</select>${arrow}</span>`;
    else if (f.type === 'textarea') control = `<textarea ${attrs} rows="4" maxlength="10000"></textarea>`;
    else control = `<input ${attrs} type="${f.type}"${f.kind === 'bsn' ? ' inputmode="numeric" maxlength="9"' : ''}${f.type === 'number' ? ' min="0" max="7" step="1"' : ''}${f.type === 'text' && f.kind !== 'bsn' ? ' maxlength="300"' : ''}>`;
    return `<div class="field${f.wide || f.type === 'textarea' ? ' wide' : ''}" data-field="${f.id}"${when}><label for="${f.id}">${label}</label>${control}${error}</div>`;
  }
  panels.innerHTML = steps.map((step, index) => `<section class="panel" data-panel="${index}"${index ? ' hidden' : ''} aria-labelledby="form-title"><div class="fields">${step.fields.map(markup).join('')}${step.skippable ? '<button class="skip-step" type="button">Niet van toepassing</button>' : ''}</div><p class="required-note">* Verplicht veld</p></section>`).join('');
  const panel = index => panels.querySelector(`[data-panel="${index}"]`);
  function updateConditional() {
    steps.forEach(step => step.fields.forEach(f => {
      if (!f.when) return;
      const wrapper = panels.querySelector(`[data-field="${f.id}"]`);
      wrapper.hidden = !visible(f, values);
      wrapper.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = wrapper.hidden || f.type === 'upload'; });
    }));
  }
  function status(index) {
    if (completed.has(index)) return { type: 'done', text: notApplicable.has(index) ? 'Niet van toepassing' : 'Afgerond', mark: '✓' };
    if (attempted.has(index) && errorsFor(index, values).length) return { type: 'incomplete', text: 'Nog aanvullen', mark: '!' };
    return { type: 'todo', text: index === current ? 'Je bent hier' : 'Nog te doen', mark: String(index + 1).padStart(2, '0') };
  }
  function updateProgress() {
    const nav = steps.map((step, index) => {
      const s = status(index), active = index === current;
      return `<button type="button" class="step" data-step="${index}" data-status="${s.type}"${active ? ' aria-current="step"' : ''}><b aria-hidden="true">${s.mark}</b><span>${escape(step.name)}<small>${active && s.text !== 'Je bent hier' ? 'Je bent hier · ' : ''}${s.text}</small></span></button>`;
    }).join('');
    document.querySelector('.step-list').innerHTML = nav;
    document.querySelector('.overview-list').innerHTML = nav;
    const percent = completed.size * 10;
    document.getElementById('percent').textContent = `${percent}% afgerond`;
    document.getElementById('finished').textContent = `${completed.size} van 10 onderdelen`;
    document.querySelector('.track').setAttribute('aria-valuenow', percent);
    document.querySelector('.track span').style.width = percent + '%';
    document.getElementById('current-name').textContent = `Stap ${current + 1} van 10 — ${steps[current].name}`;
  }
  function showErrors(index, errors) {
    panel(index).querySelectorAll('.field-error').forEach(el => { el.hidden = true; el.textContent = ''; });
    panel(index).querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    errors.forEach(error => {
      const msg = document.getElementById(error.id + '-error');
      msg.textContent = error.message; msg.hidden = false;
      const input = document.getElementById(error.id) || panel(index).querySelector(`[name="${error.id}"]`);
      input?.setAttribute('aria-invalid', 'true');
    });
    const summary = document.querySelector('.error-summary');
    summary.hidden = !errors.length;
    summary.innerHTML = errors.length ? '<strong>Controleer de volgende gegevens:</strong>' + errors.map(error => `<a href="#${error.id}">${escape(error.label)}: ${escape(error.message)}</a>`).join('') : '';
  }
  function setOverview(open) {
    overviewOpen = open;
    document.getElementById('step-overview').hidden = !open;
    document.querySelector('.layout').hidden = open;
    const button = document.querySelector('.overview-toggle');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? '← Terug naar formulier' : 'Bekijk alle stappen ☰';
  }
  function go(index, focus = true) {
    if (attempted.has(current) && errorsFor(current, values).length) completed.delete(current);
    current = index;
    setOverview(false);
    panels.querySelectorAll('[data-panel]').forEach((el, i) => { el.hidden = i !== current; });
    const step = steps[current];
    document.querySelector('.counter').textContent = `Onderdeel ${current + 1} van 10`;
    document.getElementById('form-title').textContent = step.name;
    document.querySelector('.intro').textContent = step.intro || '';
    document.querySelector('.intro').hidden = !step.intro;
    document.querySelector('.back').disabled = current === 0;
    document.querySelector('.next span').textContent = current === 9 ? 'Verstuur' : 'Volgende';
    document.querySelector('.next').disabled = current === 9;
    document.querySelector('.form-status').textContent = current === 9 ? 'Verzenden is nog niet beschikbaar. De beveiligde verwerking moet eerst worden gekoppeld. Er is niets verstuurd.' : '';
    showErrors(current, attempted.has(current) ? errorsFor(current, values) : []);
    updateProgress();
    if (focus) { const title = document.getElementById('form-title'); title.focus({ preventScroll: true }); title.scrollIntoView({ block: 'start', behavior: 'auto' }); }
  }
  function onInput(event) {
    const target = event.target;
    if (!target.name) return;
    const f = steps[current].fields.find(f => f.id === target.name);
    if (!f || f.type === 'upload') return;
    dirty = true; notApplicable.delete(current);
    if (f.type === 'checkboxes') {
      // "Geen" and a legal measure cannot be selected simultaneously.
      if (target.checked && target.value === 'Geen') panel(current).querySelectorAll(`[name="${f.id}"]`).forEach(el => { if (el !== target) el.checked = false; });
      else if (target.checked) { const none = panel(current).querySelector(`[name="${f.id}"][value="Geen"]`); if (none) none.checked = false; }
      values[f.id] = Array.from(panel(current).querySelectorAll(`[name="${f.id}"]:checked`), el => el.value);
    } else values[f.id] = f.type === 'consent' ? target.checked : target.value;
    updateConditional();
    if (f.type === 'consent') attempted.add(current);
    const errors = errorsFor(current, values);
    if (errors.length) completed.delete(current);
    else if (attempted.has(current)) completed.add(current);
    if (attempted.has(current)) showErrors(current, errors);
    updateProgress();
  }
  form.addEventListener('input', onInput);
  form.addEventListener('change', onInput);
  form.addEventListener('submit', event => { event.preventDefault(); });
  document.querySelector('.next').addEventListener('click', () => {
    attempted.add(current);
    const errors = errorsFor(current, values);
    showErrors(current, errors);
    if (errors.length) {
      completed.delete(current); updateProgress();
      (document.getElementById(errors[0].id) || panel(current).querySelector(`[name="${errors[0].id}"]`))?.focus();
      return;
    }
    completed.add(current); go(Math.min(current + 1, steps.length - 1));
  });
  document.querySelector('.back').addEventListener('click', () => go(Math.max(0, current - 1)));
  document.querySelectorAll('.step-list, .overview-list').forEach(nav => nav.addEventListener('click', event => {
    const button = event.target.closest('[data-step]'); if (!button) return;
    if (Object.keys(values).some(key => steps[current].fields.some(f => f.id === key))) attempted.add(current);
    go(Number(button.dataset.step));
  }));
  document.querySelector('.overview-toggle').addEventListener('click', () => {
    setOverview(!overviewOpen);
    (overviewOpen ? document.getElementById('overview-title') : document.getElementById('form-title')).focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overviewOpen) { setOverview(false); document.querySelector('.overview-toggle').focus(); }
  });
  panel(4).querySelector('.skip-step').addEventListener('click', skip);
  panel(5).querySelector('.skip-step').addEventListener('click', skip);
  function skip() {
    const step = steps[current];
    if (step.fields.some(f => f.id && String(values[f.id] || '').trim())) {
      if (!confirm('De ingevulde gegevens in dit onderdeel worden gewist wanneer je Niet van toepassing kiest. Doorgaan?')) return;
    }
    step.fields.forEach(f => { if (f.id) { delete values[f.id]; const input = document.getElementById(f.id); if (input) input.value = ''; } });
    notApplicable.add(current); completed.add(current); attempted.add(current); dirty = true;
    go(current + 1);
  }
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  let closing = false;
  document.querySelector('.close').addEventListener('click', async event => {
    event.preventDefault();
    if (closing) return;
    if (dirty && !confirm('Aanmelding sluiten? Je ingevulde gegevens worden niet bewaard.')) return;
    closing = true;
    dirty = false;
    let destination = new URL('../', location.href), y = 0;
    try {
      const origin = JSON.parse(sessionStorage.getItem('ys-registration-origin') || 'null');
      const url = origin && new URL(origin.url);
      if (url && url.origin === location.origin && url.pathname === destination.pathname) {
        destination = url;
        y = Math.max(0, Number(origin.y) || 0);
      }
    } catch (_) {}
    destination.searchParams.set('ys-return', 'registration');
    destination.searchParams.set('ys-y', String(y));
    await window.YSAnimateRegistrationClose?.();
    if (window.YSLegalTransition?.leave) window.YSLegalTransition.leave(destination.href);
    else location.assign(destination.href);
  });
  // Never write registration data to storage, logs, query parameters or a remote endpoint.
  updateConditional(); go(0, false);
})();
