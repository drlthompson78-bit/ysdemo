/* Field names and choices transcribed from youngsupport.nl/aanmelden.
   No personal information or document contents are persisted by this preview. */
(function (root, factory) {
  const schema = factory();
  if (typeof module === 'object' && module.exports) module.exports = schema;
  else root.YSRegistrationSchema = schema;
})(typeof window === 'undefined' ? globalThis : window, function () {
  const field = (id, label, type = 'text', required = false, extra = {}) => ({ id, label, type, required, ...extra });
  const select = (id, label, placeholder, options, required = true) => field(id, label, 'select', required, { placeholder, options });
  const heading = label => ({ type: 'heading', label });
  const note = label => ({ type: 'note', label });
  const address = (prefix, required = false) => [
    field(prefix + 'Postcode', 'Postcode', 'text', required, { kind: 'postcode' }),
    field(prefix + 'Huisnummer', 'Huisnummer', 'text', required),
    { type: 'address-action' },
    field(prefix + 'Straat', 'Straat', 'text', required),
    field(prefix + 'Woonplaats', 'Woonplaats', 'text', required),
  ];
  const contact = prefix => [field(prefix + 'Telefoon', 'Telefoonnummer', 'tel'), field(prefix + 'Email', 'E-mailadres', 'email')];
  const upload = (id, label, hint, when) => field(id, label, 'upload', false, { hint, when, wide: true });
  const steps = [
    { name: 'Jongere', fields: [
      field('voornaam', 'Voornaam', 'text', true), field('achternaam', 'Achternaam', 'text', true),
      field('geboortedatum', 'Geboortedatum', 'date', true), field('bsnNummer', 'BSN-nummer', 'text', true, { kind: 'bsn' }),
      select('geslacht', 'Geslacht', 'Selecteer geslacht', ['Man', 'Vrouw', 'Anders']),
      select('genderidentiteit', 'Genderidentiteit', 'Selecteer genderidentiteit', ['Man', 'Vrouw', 'Non-binair', 'Anders'], false),
      field('andereAanspreekvorm', 'Andere gewenste aanspreekvorm', 'text', false, { wide: true }),
      field('gemeente', 'Verantwoordelijke gemeente', 'text', true, { wide: true }),
      field('jongereEmail', 'E-mailadres jongere', 'email'), field('jongereTelefoon', 'Telefoonnummer jongere', 'tel'),
      select('verblijfplaats', 'Huidige verblijfplaats', 'Selecteer verblijfplaats', ['Thuis bij ouder(s)', 'Pleeggezin', 'Gezinshuis', 'Zelfstandig', 'Anders']),
      ...address('jongere', true),
    ] },
    { name: 'Doelgroep', fields: [
      select('doelgroep', 'Doelgroep jongere', 'Selecteer doelgroep', ['LVB (Licht Verstandelijke Beperking)', 'GGZ problematiek', 'Gedragsproblematiek', 'Autisme spectrum', 'Trauma gerelateerd', 'Combinatie problematiek', 'Anders']),
      select('aanmeldingBetreft', 'Aanmelding betreft', 'Selecteer type aanmelding', ['Begeleiding', 'Coaching', 'Dagbesteding', 'Combinatie']),
      field('redenAanmelding', 'Reden van aanmelding', 'textarea'),
    ] },
    { name: 'Juridisch kader', fields: [
      field('maatregelen', 'Welke juridische maatregel(en) is/zijn van toepassing?', 'checkboxes', false, { options: ['Geen', 'VOTS', 'OTS', 'Voorlopige voogdij', 'Voogdij', 'Jeugdreclassering', 'MUHP'] }),
      field('datumMachtiging', 'Datum/data aanvang machtiging(en)', 'date'),
      upload('machtigingsdocumenten', 'Machtigingsdocumenten', 'Upload hier de relevante machtigingsdocumenten (max 5 bestanden)'),
      field('wlz', 'Is er sprake van een WLZ indicatie?', 'radio', false, { options: ['Ja', 'Nee'] }),
      field('zorgzwaartepakket', 'Welk Zorgzwaartepakket?', 'text', false, { when: ['wlz', 'Ja'], wide: true }),
      upload('wlzDocumenten', 'WLZ Indicatie documenten', 'Upload hier de WLZ indicatie (max 5 bestanden)', ['wlz', 'Ja']),
    ] },
    { name: 'Wettelijk gezag', fields: [
      select('gezag', 'Het wettelijk gezag berust bij', 'Selecteer gezag', ['Beide ouders', 'Alleen moeder', 'Alleen vader', 'Instelling', 'Overig']),
      field('gezagInstelling', 'Welke instelling?', 'text', false, { when: ['gezag', 'Instelling'], wide: true }),
      field('gezagOverig', 'Verklaar overig', 'text', false, { when: ['gezag', 'Overig'], wide: true }),
      heading('Eerste gezagsdrager'), field('gezagsdrager1Naam', 'Voor- en achternaam', 'text', false, { wide: true }), ...address('gezagsdrager1'), ...contact('gezagsdrager1'),
      heading('Tweede gezagsdrager (indien van toepassing)'), field('gezagsdrager2Naam', 'Voor- en achternaam', 'text', false, { wide: true }), ...address('gezagsdrager2'), ...contact('gezagsdrager2'),
    ] },
    { name: 'Ouders zonder gezag', intro: 'Alleen invullen indien ouders geen gezag hebben', skippable: true, fields: [
      field('biologischeMoederNaam', 'Voor- en achternaam biologische moeder', 'text', false, { wide: true }),
      field('tweedeOuderNaam', 'Voor- en achternaam tweede (betrokken) ouder', 'text', false, { wide: true }),
    ] },
    { name: 'Pleeg-/Gezinshuisouders', intro: 'Alleen invullen indien van toepassing', skippable: true, fields: [
      field('pleegoudersNaam', 'Voor- en achternaam pleegouders/gezinshuisouders', 'text', false, { wide: true }), ...address('pleegouders'), ...contact('pleegouders'),
    ] },
    { name: 'Aanmelder', fields: [
      field('aanmelderNaam', 'Voor- en achternaam aanmelder', 'text', true, { wide: true }),
      field('aanmelderRelatie', 'Relatie aanmelder tot jongere', 'text', true, { wide: true }),
      field('aanmelderTelefoon', 'Telefoonnummer aanmelder', 'tel', true), field('aanmelderEmail', 'E-mailadres aanmelder', 'email', true),
      field('instantie', 'Bent u een verwijzende instantie?', 'radio', false, { options: ['Ja', 'Nee'] }),
      field('instantieNaam', 'Naam instantie en functie aanmelder', 'text', false, { when: ['instantie', 'Ja'], wide: true }),
      field('instantieAdres', 'Adres verwijzende instantie', 'text', false, { when: ['instantie', 'Ja'], wide: true }),
    ] },
    { name: 'Laatste hulpverlening', intro: 'Verslagen van eerdere hulpverlening helpen ons een completer beeld te krijgen', fields: [
      field('hulpverleningInstelling', 'Naam instelling', 'text', false, { wide: true }),
      field('hulpverleningContactpersoon', 'Contactpersoon/behandelaar', 'text', false, { wide: true }),
      field('hulpverleningEmail', 'E-mailadres contactpersoon', 'email', false, { wide: true }),
      upload('verslagen', 'Verslagen hulpverlening', 'Upload hier verslagen, behandelplannen of andere relevante documenten (max 5 bestanden)'),
    ] },
    { name: 'School/Dagbesteding', fields: [
      field('school1Naam', 'Naam School/Dagbesteding', 'text', false, { wide: true }),
      field('school1Contactpersoon', 'Contactpersoon/mentor', 'text', false, { wide: true }),
      field('school1Email', 'E-mailadres', 'email'), field('school1Dagen', 'Aantal dagen per week', 'number'),
    ] },
    { name: 'Overig & Verzenden', fields: [
      field('opmerkingen', 'Overige belangrijke gegevens/opmerkingen', 'textarea'),
      upload('overigeDocumenten', 'Overige documenten', 'Upload hier eventuele andere relevante documenten (max 5 bestanden)'),
      field('akkoordVoorwaarden', 'Ja, ik ga akkoord met de algemene voorwaarden', 'consent', true),
      note('Ik geef YoungSupport toestemming om mijn gegevens op te slaan en te verwerken.'),
      note('De aanmelder stuurt deze gegevens aan YoungSupport. De aanmelder besprak dit met de betrokkene(n) en kreeg toestemming om deze informatie te delen.'),
      note('YoungSupport kan nog meer informatie en documenten opvragen via de aanmelder indien nodig.'),
      note("Tip: Gebruik de pijl 'Vorige' onderaan om het formulier nog eens te controleren voordat je verzendt."),
    ] },
  ];
  const visible = (f, values) => !f.when || values[f.when[0]] === f.when[1];
  function errorsFor(index, values) {
    return steps[index].fields.flatMap(f => {
      if (!f.id || f.type === 'upload' || !visible(f, values)) return [];
      const value = values[f.id];
      const empty = value == null || value === false || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && !value.length);
      let message = '';
      if (empty && f.required) message = 'Vul dit verplichte veld in.';
      else if (!empty) {
        const text = String(value).trim();
        if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) message = 'Vul een geldig e-mailadres in.';
        if (f.kind === 'bsn' && !/^\d{9}$/.test(text)) message = 'Vul een BSN van 9 cijfers in.';
        if (f.kind === 'postcode' && !/^[1-9]\d{3}\s?[a-z]{2}$/i.test(text)) message = 'Vul een postcode in, bijvoorbeeld 1234 AB.';
        if (f.type === 'date' && (isNaN(Date.parse(text)) || !/^\d{4}-\d{2}-\d{2}$/.test(text))) message = 'Vul een geldige datum in.';
        if (f.id === 'geboortedatum' && new Date(text) > new Date()) message = 'De geboortedatum kan niet in de toekomst liggen.';
        if (f.id === 'school1Dagen' && (!Number.isInteger(Number(text)) || Number(text) < 0 || Number(text) > 7)) message = 'Vul een heel aantal dagen van 0 tot en met 7 in.';
        if (f.options && f.type !== 'checkboxes' && !f.options.includes(value)) message = 'Kies een optie uit de lijst.';
      }
      return message ? [{ id: f.id, label: f.label, message }] : [];
    });
  }
  return { steps, visible, errorsFor };
});
