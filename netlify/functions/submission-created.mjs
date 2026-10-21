// Netlify-Funktion: läuft automatisch nach jeder bestätigten Formular-Eintragung (nicht bei Spam).
// Bei der Umfrage Phönixjahre (umfrage.html, ab 21.10.2026): Tags in ActiveCampaign + Slack ohne Name/E-Mail.
// Bei der Webinar-Anmeldung:
//   1. Anmeldung bei WebinarJam (persönlicher Raum-Link)
//   2. Raum-Link ins ActiveCampaign-Feld „Webinar-Link“ (%WEBINAR_LINK%) für die Mails
//   3. Nachricht in Slack mit dem Ergebnis
// Der Dateiname "submission-created" ist das Netlify-Ereignis: bitte nicht umbenennen und keinen eigenen Pfad setzen.
// Umgebungsvariablen: SLACK_WEBHOOK_URL, WEBINARJAM_API_KEY, AC_API_KEY, AC_API_URL (siehe netlify/lib/webinar.mjs)

import { registerToWebinar, saveLinkToAC, acGet } from '../lib/webinar.mjs';

// Welche Formulare in Slack gemeldet werden (Formularname: Überschrift). Weitere bei Bedarf einkommentieren.
const FORMS = {
  'webinar-anmeldung': 'Neue Webinar-Anmeldung',
  'webinar-umfrage': 'Neue Umfrage-Antwort (Webinar)',
  'phoenixjahre-umfrage': 'Neue Antwort: Umfrage Phönixjahre',
  // 'kontakt': 'Neue Kontaktanfrage',
  // '5-blutwerte-freebie': 'Neuer Download: 5 Blutwerte',
  // 'quiz-ue40': 'Neues Quiz-Ergebnis',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().slice(0, 200);
const ok = () => new Response('ok');

// Umfrage auf webinar-bestaetigt.html: ActiveCampaign-Felder (angelegt am 12.10.2026)
//   3 = „Umfrage: Was belastet dich“ (%UMFRAGE_BELASTUNG%), 4 = „Umfrage: Was würde helfen“ (%UMFRAGE_HILFE%), 5 = „Frage an Jasmin (Webinar)“ (%FRAGE_AN_JASMIN%)
const AC_FIELDS_UMFRAGE = { belastung: '3', hilfe: '4', frage: '5' };

async function saveSurveyToAC(d) {
  const email = String(d.email || '').trim();
  if (!/\S+@\S+\.\S+/.test(email)) return ':grey_question: ohne E-Mail, nur in Netlify gespeichert';
  const found = await acGet(`contacts?email=${encodeURIComponent(email)}`);
  if (!found?.contacts?.length) return ':grey_question: E-Mail nicht in ActiveCampaign, nur in Netlify gespeichert';
  const fieldValues = Object.entries(AC_FIELDS_UMFRAGE)
    .map(([k, field]) => ({ field, value: String(d[k] || '').trim().slice(0, 1000) }))
    .filter((v) => v.value);
  if (!fieldValues.length) return ':grey_question: keine Antworten';
  const base = (process.env.AC_API_URL || '').replace(/\/+$/, '');
  const r = await fetch(`${base}/api/3/contact/sync`, {
    method: 'POST',
    headers: { 'Api-Token': process.env.AC_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: { email, fieldValues } }),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error(`ActiveCampaign: HTTP ${r.status}`);
  return ':white_check_mark: in ActiveCampaign gespeichert';
}

// Umfrage Phönixjahre (umfrage.html): nur bestehende Kontakte markieren, keine neuen Kontakte anlegen.
//   Tag 30 „Umfrage Phönixjahre: teilgenommen“ (angelegt am 21.10.2026). Die Gesprächsfrage ist entfallen.
const AC_TAG_UMFRAGE = '30';

async function tagSurveyInAC(d) {
  const email = String(d.email || '').trim();
  if (!/\S+@\S+\.\S+/.test(email)) return ':grey_question: anonym, nur in Netlify gespeichert';
  const found = await acGet(`contacts?email=${encodeURIComponent(email)}`);
  const id = found?.contacts?.[0]?.id;
  if (!id) return ':grey_question: E-Mail nicht in ActiveCampaign, nur in Netlify gespeichert';
  const tags = [AC_TAG_UMFRAGE];
  const base = (process.env.AC_API_URL || '').replace(/\/+$/, '');
  for (const tag of tags) {
    const r = await fetch(`${base}/api/3/contactTags`, {
      method: 'POST',
      headers: { 'Api-Token': process.env.AC_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactTag: { contact: String(id), tag } }),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) throw new Error(`ActiveCampaign: HTTP ${r.status}`);
  }
  return ':white_check_mark: in ActiveCampaign markiert (teilgenommen)';
}

export default async (req) => {
  let payload;
  try { ({ payload } = await req.json()); } catch { return ok(); }
  const form = payload?.form_name || payload?.data?.['form-name'];
  const d = payload?.data || {};

  // 1 + 2: WebinarJam und ActiveCampaign
  let status = '';
  if (form === 'webinar-anmeldung' && /\S+@\S+\.\S+/.test(d.email || '')) {
    try {
      const user = await registerToWebinar({ firstName: d.vorname, email: d.email, ip: d.ip });
      try {
        await saveLinkToAC(d.email, user.live_room_url);
        status = ':white_check_mark: WebinarJam angemeldet, Link in ActiveCampaign';
      } catch (e) {
        status = `:warning: WebinarJam angemeldet, Link NICHT in ActiveCampaign (${esc(e.message)})`;
      }
    } catch (e) {
      status = `:x: WebinarJam-Anmeldung fehlgeschlagen (${esc(e.message)})`;
    }
    console.log('Webinar-Anmeldung:', status.replace(/:[a-z_]+: /, ''));
  }

  // Umfrage: in ActiveCampaign beim Kontakt speichern
  if (form === 'webinar-umfrage') {
    try { status = await saveSurveyToAC(d); } catch (e) { status = `:warning: NICHT in ActiveCampaign (${esc(e.message)})`; }
    console.log('Webinar-Umfrage:', status.replace(/:[a-z_]+: /, ''));
  }

  // Umfrage Phönixjahre: Kontakt in ActiveCampaign markieren
  if (form === 'phoenixjahre-umfrage') {
    try { status = await tagSurveyInAC(d); } catch (e) { status = `:warning: NICHT in ActiveCampaign markiert (${esc(e.message)})`; }
    console.log('Umfrage Phönixjahre:', status.replace(/:[a-z_]+: /, ''));
  }

  // 3: Slack
  const title = FORMS[form];
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!title || !hook) return ok();

  const quelle = [d.utm_source, d.utm_campaign, d.utm_content].map(esc).filter(Boolean).join(' / ') || 'direkt';
  const zeit = new Date(payload.created_at || Date.now())
    .toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' });
  const long = (v) => esc(String(v ?? '').slice(0, 400)) || 'keine Angabe';
  const text = form === 'phoenixjahre-umfrage'
    // Ohne Name und E-Mail (Gesundheitsangaben möglich), Zuordnung über die Tags in ActiveCampaign
    ? `:memo: *${title}*\nHindernis: ${long(d.hindernis)}${d.hindernis_sonstiges ? ` (${long(d.hindernis_sonstiges)})` : ''}\nFairer Preis: ${long(d.preis)} · Raten: ${long(d.raten)}\nFormat: ${long(d.format)}\nGewinnspiel: ${esc(d.gewinnspiel) || 'nein'}\n${status}`
    : form === 'webinar-umfrage'
    // Umfrage ohne Name und E-Mail in Slack (Gesundheitsangaben), Zuordnung steht in ActiveCampaign
    ? `:memo: *${title}*\nBelastet: ${long(d.belastung)}\nWürde helfen: ${long(d.hilfe)}\nFrage an Jasmin: ${long(d.frage)}\n${status}`
    : `:tada: *${title}*\n*${esc(d.vorname) || 'ohne Vorname'}* · ${esc(d.email)}\nQuelle: ${quelle} · ${zeit} Uhr`
    + (status ? `\n${status}` : '');

  try {
    const r = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) console.log('Slack antwortet mit Status', r.status);
  } catch (e) {
    console.log('Slack nicht erreichbar', e?.name);
  }
  return ok();
};
