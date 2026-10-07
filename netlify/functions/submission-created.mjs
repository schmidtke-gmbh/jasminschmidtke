// Netlify-Funktion: läuft automatisch nach jeder bestätigten Formular-Eintragung (nicht bei Spam).
// Bei der Webinar-Anmeldung:
//   1. Anmeldung bei WebinarJam (persönlicher Raum-Link)
//   2. Raum-Link ins ActiveCampaign-Feld „Webinar-Link“ (%WEBINAR_LINK%) für die Mails
//   3. Nachricht in Slack mit dem Ergebnis
// Der Dateiname "submission-created" ist das Netlify-Ereignis: bitte nicht umbenennen und keinen eigenen Pfad setzen.
// Umgebungsvariablen: SLACK_WEBHOOK_URL, WEBINARJAM_API_KEY, AC_API_KEY, AC_API_URL (siehe netlify/lib/webinar.mjs)

import { registerToWebinar, saveLinkToAC } from '../lib/webinar.mjs';

// Welche Formulare in Slack gemeldet werden (Formularname: Überschrift). Weitere bei Bedarf einkommentieren.
const FORMS = {
  'webinar-anmeldung': 'Neue Webinar-Anmeldung',
  // 'kontakt': 'Neue Kontaktanfrage',
  // '5-blutwerte-freebie': 'Neuer Download: 5 Blutwerte',
  // 'quiz-ue40': 'Neues Quiz-Ergebnis',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().slice(0, 200);
const ok = () => new Response('ok');

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

  // 3: Slack
  const title = FORMS[form];
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!title || !hook) return ok();

  const quelle = [d.utm_source, d.utm_campaign, d.utm_content].map(esc).filter(Boolean).join(' / ') || 'direkt';
  const zeit = new Date(payload.created_at || Date.now())
    .toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' });
  const text = `:tada: *${title}*\n*${esc(d.vorname) || 'ohne Vorname'}* · ${esc(d.email)}\nQuelle: ${quelle} · ${zeit} Uhr`
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
