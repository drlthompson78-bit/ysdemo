(() => {
  'use strict';
  const {steps, visible, errorsFor} = window.YSRegistrationSchema;
  const form = document.getElementById('registration-form');
  const panels = document.getElementById('panels');
  const values = Object.create(null), attempted = new Set(), reviewed = new Set();
  let dirty = false, current = 0, pages = [], resizing = false;
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function markup(f) {
    const label = escape(f.label || '') + (f.required ? ' *' : '');
    if (f.type === 'heading') return `<h2 class="subheading">${label}</h2>`;
    if (f.type === 'note') return `<p class="note">${label}</p>`;
    if (f.type === 'address-action') return '<p class="note">Vul straat en woonplaats zelf in; automatisch ophalen is nog niet beschikbaar.</p>';
    const attrs = `id="${f.id}" name="${f.id}" aria-describedby="${f.id}-error"${f.required ? ' required' : ''}`;
    const error = `<span id="${f.id}-error" class="field-error" hidden></span>`;
    const when = f.when ? ' hidden' : '';
    if (f.type === 'radio' || f.type === 'checkboxes') {
      return `<fieldset class="field-group" data-field="${f.id}"${when}><legend>${label}</legend><div class="options">${f.options.map((option, i) => `<label class="check"><input id="${f.id}-${i}" type="${f.type === 'radio' ? 'radio' : 'checkbox'}" name="${f.id}" value="${escape(option)}" aria-describedby="${f.id}-error">${escape(option)}</label>`).join('')}</div>${error}</fieldset>`;
    }
    if (f.type === 'consent') return `<div class="wide" data-field="${f.id}"><label class="check"><input type="checkbox" ${attrs}>${label}</label>${error}<p class="form-status">Versturen is nog niet beschikbaar in deze testversie.</p><nav class="legal-links" aria-label="Voorwaarden"><a href="../privacybeleid/" target="_blank" rel="noopener">Privacybeleid</a><a href="../algemene-voorwaarden/" target="_blank" rel="noopener">Algemene voorwaarden</a></nav></div>`;
    if (f.type === 'upload') return `<section class="upload" data-field="${f.id}" aria-label="${label}"${when}><p>${escape(f.hint.replace(/ \(max 5 bestanden\)/, ''))}</p><button type="button" disabled>Documenten toevoegen</button><p>Max. 5 bestanden van elk 10 MB. Uploaden is nog niet beschikbaar in deze testversie.</p></section>`;
    let control;
    if (f.type === 'select') control = `<span class="select-wrap"><select ${attrs}><option value="">${escape(f.placeholder)}</option>${f.options.map(option => `<option value="${escape(option)}">${escape(option)}</option>`).join('')}</select>${arrow}</span>`;
    else if (f.type === 'textarea') control = `<textarea ${attrs} rows="3" maxlength="10000"></textarea>`;
    else control = `<input ${attrs} type="${f.type}"${f.kind === 'bsn' ? ' inputmode="numeric" maxlength="9"' : ''}${f.type === 'number' ? ' min="0" max="7" step="1"' : ''}${f.type === 'text' && f.kind !== 'bsn' ? ' maxlength="300"' : ''}>`;
    return `<div class="field${f.wide || f.type === 'textarea' ? ' wide' : ''}" data-field="${f.id}"${when}><label for="${f.id}">${label}</label>${control}${error}</div>`;
  }

  // Logical groups are split further only when their actual rendered fields do not fit.
  const groups = [
    [0,'Persoonsgegevens',[0,1,2,3,4,5,6]],
    [0,'Contact en woonsituatie',[8,9,7,10]], [0,'Adres van de jongere',[11,12,14,15,13]],
    [1,'Welke begeleiding is nodig?',[0,1,2]],
    [2,'Juridische maatregelen',[0,1,2]], [2,'WLZ-indicatie',[3,4,5]],
    [3,'Wie heeft het gezag?',[0,1,2]],
    [3,'Eerste gezagsdrager',[4,5,6,8,9,10,11,7]],
    [3,'Tweede gezagsdrager',[13,14,15,17,18,19,20,16]],
    [4,'Ouders zonder gezag',[0,1]],
    [5,'Pleeg- of gezinshuisouders',[0,1,2,4,5,6,7,3]],
    [6,'Gegevens van de aanmelder',[0,1,2,3,4,5,6]],
    [7,'Eerdere hulpverlening',[0,1,2,3]],
    [8,'School of dagbesteding',[0,1,2,3]],
    [9,'Aanvullende informatie',[0,1]], [9,'Toestemming en afronding',[3,4,5,6,2]],
  ].map(([step,title,indices],id) => ({step,title,id,indices}));
  const items = new Map();
  steps.forEach((step,si) => step.fields.forEach((field,fi) => {
    if (field.type === 'heading') return; // The heading becomes the screen title.
    const holder = document.createElement('div');
    holder.innerHTML = markup(field);
    const node = holder.firstElementChild;
    node.hidden = true;
    node.dataset.unit = `${si}:${fi}`;
    panels.append(node);
    items.set(`${si}:${fi}`,{node,field,key:`${si}:${fi}`});
  }));
  const sectionSelect = document.querySelector('.section-select');
  sectionSelect.innerHTML = steps.map((s,i)=>`<option value="${i}">${escape(s.name)}</option>`).join('');
  const title = document.getElementById('form-title');
  const stage = document.querySelector('.screen-body');
  const next = document.querySelector('.next');
  const previous = document.querySelector('.back');
  const skipButton = document.querySelector('.skip-step');
  function eligible(group) {
    return group.indices.map(i=>items.get(`${group.step}:${i}`)).filter(item=>item && visible(item.field,values));
  }
  function showItems(list) {
    items.forEach(item => { item.node.hidden = !list.includes(item); });
  }
  function header(group) {
    title.textContent = group.title;
    const intro = document.querySelector('.intro');
    intro.textContent = steps[group.step].intro || (group.title.includes('Tweede gezagsdrager') || group.title.includes('tweede gezagsdrager') ? 'Alleen invullen indien van toepassing.' : '');
    intro.hidden = !intro.textContent;
    skipButton.hidden = !steps[group.step].skippable;
  }
  function rebuild(anchor) {
    if (resizing) return;
    resizing = true;
    const focused = document.activeElement;
    const old = pages[current];
    const keep = anchor || focused?.closest('[data-unit]')?.dataset.unit || old?.items[0]?.key;
    const oldGroup = old?.group.id || 0;
    const nextPages = [];
    items.forEach(({node,field}) => {
      if (field.when) node.querySelectorAll('input,select,textarea').forEach(input => { input.disabled = !visible(field,values); });
    });
    // Measure in the real viewport, including heading, optional intro and footer.
    groups.forEach(group => {
      const available = eligible(group);
      if (!available.length) return;
      header(group);
      let chunk = [];
      available.forEach(item => {
        chunk.push(item);
        showItems(chunk);
        if (stage.scrollHeight > stage.clientHeight + 1 && chunk.length > 1) {
          chunk.pop();
          nextPages.push({group,items:chunk});
          chunk = [item];
        }
      });
      if (chunk.length) nextPages.push({group,items:chunk});
    });
    pages = nextPages;
    let index = pages.findIndex(page=>page.items.some(i=>i.key===keep));
    if(index < 0) index = pages.findIndex(page=>page.group.id >= oldGroup);
    current = Math.max(0,index);
    resizing = false;
    render(false);
    if (focused?.isConnected && !focused.closest('[hidden]')) focused.focus({preventScroll:true});
  }
  function pageErrors(page=pages[current]) {
    const ids = new Set(page.items.map(item=>item.field.id));
    return errorsFor(page.group.step, values).filter(error=>ids.has(error.id));
  }
  function paintErrors(errors) {
    items.forEach(({node})=> {
      node.querySelectorAll('.field-error').forEach(el=>{el.hidden=true;el.textContent='';});
      node.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
    });
    errors.forEach(error=> {
      const msg = document.getElementById(error.id+'-error');
      if (msg) { msg.hidden=false;msg.textContent=error.message; }
      (document.getElementById(error.id) || form.querySelector(`[name="${error.id}"]`))?.setAttribute('aria-invalid','true');
    });
    const summary = document.querySelector('.error-summary');
    summary.textContent = errors.length ? 'Controleer de gemarkeerde velden voordat je verdergaat.' : '';
  }
  const progress = document.querySelector('.progress-ring');
  const segmentPoint = (radius, angle) => {
    const radians=angle*Math.PI/180;
    return `${50+radius*Math.cos(radians)} ${50+radius*Math.sin(radians)}`;
  };
  progress.querySelector('svg').innerHTML = steps.map((step,index)=>{
    const start=-90+index*36+3, end=start+30;
    return `<path data-segment="${index}" d="M${segmentPoint(45,start)} A45 45 0 0 1 ${segmentPoint(45,end)} L${segmentPoint(36,end)} A36 36 0 0 0 ${segmentPoint(36,start)} Z"/>`;
  }).join('');
  function updateProgress() {
    let total=0;
    steps.forEach((step,index)=>{
      const activeItems=[...items.values()].filter(item=>item.key.startsWith(index+':') && visible(item.field,values));
      const invalid=new Set(errorsFor(index,values).map(error=>error.id));
      const done=activeItems.filter(item=>reviewed.has(item.key) && !invalid.has(item.field.id)).length;
      const fraction=activeItems.length ? done/activeItems.length : 1;
      total+=fraction;
      const segment=progress.querySelector(`[data-segment="${index}"]`);
      segment.classList.toggle('is-complete',fraction===1);
      segment.classList.toggle('is-current',index===pages[current].group.step);
    });
    const percent=Math.round(total/steps.length*100);
    progress.querySelector('strong').textContent=percent+'%';
    progress.setAttribute('aria-valuenow',percent);
    progress.setAttribute('aria-valuetext',`${percent}% afgerond. Huidig onderdeel: ${steps[pages[current].group.step].name}.`);
  }
  function render(focus=true) {
    const page=pages[current]; if(!page) return;
    header(page.group);
    showItems(page.items);
    sectionSelect.value = page.group.step;
    form.dataset.pageCount = pages.length;
    form.dataset.pageIndex = current;
    updateProgress();
    previous.disabled = current===0;
    const last=current===pages.length-1;
    next.disabled=last;
    next.querySelector('span').textContent=last?'Versturen':'Verder';
    paintErrors(pageErrors().filter(e=>attempted.has(e.id)));
    stage.scrollTop=0;
    if (focus) title.focus({preventScroll:true});
  }
  function go(index) { current=Math.max(0,Math.min(index,pages.length-1));render(); }
  function onInput(event) {
    const target=event.target;
    const page=pages[current];
    const field=steps[page.group.step].fields.find(f=>f.id===target.name);
    if (!field || field.type==='upload') return;
    dirty=true;
    if (field.type==='checkboxes') {
      if (target.checked) form.querySelectorAll(`[name="${field.id}"]`).forEach(el=>{if(el!==target && (target.value==='Geen'||el.value==='Geen')) el.checked=false;});
      values[field.id]=Array.from(form.querySelectorAll(`[name="${field.id}"]:checked`),el=>el.value);
    } else values[field.id]=field.type==='consent'?target.checked:target.value;
    const isTrigger=steps.some(step=>step.fields.some(f=>f.when?.[0]===field.id));
    if(field.type==='consent') reviewed.add(target.closest('[data-unit]').dataset.unit);
    if(isTrigger) rebuild(target.closest('[data-unit]').dataset.unit);
    updateProgress();
    paintErrors(pageErrors().filter(e=>attempted.has(e.id)));
  }
  form.addEventListener('input',onInput);
  form.addEventListener('change',onInput);
  form.addEventListener('submit',e=>e.preventDefault());
  next.addEventListener('click',()=>{
    const errors=pageErrors();
    pages[current].items.forEach(item=>{if(item.field.id) attempted.add(item.field.id);});
    paintErrors(errors);
    if(errors.length) {
      (document.getElementById(errors[0].id)||form.querySelector(`[name="${errors[0].id}"]`))?.focus({preventScroll:true});
      return;
    }
    pages[current].items.forEach(item=>reviewed.add(item.key));
    go(current+1);
  });
  previous.addEventListener('click',()=>go(current-1));
  sectionSelect.addEventListener('change',()=>go(pages.findIndex(p=>p.group.step===Number(sectionSelect.value))));
  skipButton.addEventListener('click',()=>{
    const step=pages[current].group.step;
    if(steps[step].fields.some(f=>f.id && values[f.id]) && !confirm('De ingevulde gegevens van dit onderdeel wissen en overslaan?')) return;
    steps[step].fields.forEach(f=>{delete values[f.id];const input=document.getElementById(f.id);if(input) input.value='';});
    items.forEach(item=>{if(item.key.startsWith(step+':')) reviewed.add(item.key);});
    dirty=true;go(pages.findIndex(p=>p.group.step>step));
  });
  window.YSRegistration={canClose(){
    if(dirty && !confirm('Aanmelding sluiten? Je ingevulde gegevens worden niet bewaard.')) return false;
    dirty=false;return true;
  }};
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  document.querySelector('.close').addEventListener('click',event=>{
    event.preventDefault();
    if(!window.YSRegistration.canClose()) return;
    let destination=new URL('../',location.href), returnY=0;
    try {const origin=JSON.parse(sessionStorage.getItem('ys-registration-origin')||'null');const url=origin&&new URL(origin.url);if(url?.origin===location.origin && url.pathname===destination.pathname) {destination=url;returnY=Math.max(0,Number(origin.y)||0);}}catch(_){}
    destination.searchParams.set('ys-return','registration');
    destination.searchParams.set('ys-y',String(returnY));
    if(window.YSLegalTransition?.leave) window.YSLegalTransition.leave(destination.href);else location.assign(destination.href);
  });
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>rebuild(),150);});
  rebuild();
  document.fonts?.ready.then(()=>rebuild());
})();
