// Netlify-Funktion, läuft automatisch alle 15 Minuten (geplante Funktion, hat keine Adresse zum Aufrufen).
//
// 1. Link nachtragen: Wer in ActiveCampaign den Tag „Webinar 20.10.“ hat (Webinar-Seite bestätigt
//    oder Klick auf „Ja, ich bin dabei“ in der Wartelisten-Einladung), aber noch keinen Webinar-Link,
//    wird bei WebinarJam angemeldet. Der persönliche Link kommt ins Feld „Webinar-Link“ (%WEBINAR_LINK%).
// 2. Bestätigungs-Erinnerung, einmalig: Wer sich über die Webinar-Seite eingetragen, aber nach 20 Stunden
//    noch nicht bestätigt hat, bekommt die Bestätigungsmail von ActiveCampaign noch einmal
//    (das Formular wird für sie erneut ausgelöst). Nur bis 72 Stunden nach der Anmeldung, danach nie wieder.
//    Ausschalten: DOI_ERINNERUNG = false setzen.
// 3. Kurze Nachricht in Slack, wenn etwas passiert ist.
// Umgebungsvariablen wie bei der Anmeldung: WEBINARJAM_API_KEY, AC_API_KEY, AC_API_URL, SLACK_WEBHOOK_URL.

import { AC_FIELD_LINK, registerToWebinar, saveLinkToAC, acGet } from '../lib/webinar.mjs';

export const config = { schedule: '*/15 * * * *' };

const TAG_WEBINAR = '17';      // „Webinar 20.10.“
const TAG_DOI = '20';          // „DOI-Erinnerung gesendet“
const LISTE = '8';             // „Webinar-Anmeldung 20. Oktober“
const DOI_ERINNERUNG = true;
const DOI_AB_STUNDEN = 20;
const DOI_BIS_STUNDEN = 72;
const AC_FORM_URL = 'https://jasminschmidtke70927.activehosted.com/proc.php';
const AC_FORM = { u: '3', f: '3', s: '', c: '0', m: '0', act: 'sub', v: '2', or: 'a3770ea6-b8d6-4cbc-a6f7-5b6341c4d38e' };
const BUDGET_MS = 20000;

async function acPost(path, body) {
  const base = (process.env.AC_API_URL || '').replace(/\/+$/, '');
  const r = await fetch(`${base}/api/3/${path}`, {
    method: 'POST',
    headers: { 'Api-Token': process.env.AC_API_KEY || '', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok && r.status !== 422) throw new Error(`ActiveCampaign ${path}: HTTP ${r.status}`);
}

async function alleSeiten(path, key, max = 500) {
  const out = [];
  for (let offset = 0; offset < max; offset += 100) {
    const sep = path.includes('?') ? '&' : '?';
    const j = await acGet(`${path}${sep}limit=100&offset=${offset}`);
    const rows = j[key] || [];
    out.push(...rows);
    if (rows.length < 100) break;
  }
  return out;
}

async function slack(text) {
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(3000) });
  } catch { /* Slack ist nur Info */ }
}

export default async () => {
  const start = Date.now();
  const zeitUebrig = () => Date.now() - start < BUDGET_MS;
  const ergebnis = { links: 0, erinnerungen: 0, fehler: [] };

  // Alle vorhandenen Webinar-Links: Kontakt-ID -> { value, cdate }
  const links = new Map();
  try {
    for (const fv of await alleSeiten(`fieldValues?filters[fieldid]=${AC_FIELD_LINK}`, 'fieldValues', 2000)) {
      if (fv.value && String(fv.field) === String(AC_FIELD_LINK)) links.set(String(fv.contact), { value: fv.value, cdate: fv.cdate });
    }
  } catch (e) {
    console.log('Links nicht lesbar:', e.message);
    return new Response('ok');
  }

  // 1. Tag „Webinar 20.10.“ ohne Link -> bei WebinarJam anmelden
  try {
    const kontakte = await alleSeiten(`contacts?tagid=${TAG_WEBINAR}&status=-1`, 'contacts');
    for (const c of kontakte) {
      if (!zeitUebrig()) break;
      if (c.deleted === '1' || links.has(String(c.id)) || !c.email) continue;
      try {
        const user = await registerToWebinar({ firstName: c.firstName, email: c.email });
        await saveLinkToAC(c.email, user.live_room_url);
        links.set(String(c.id), { value: user.live_room_url, cdate: new Date().toISOString() });
        ergebnis.links++;
      } catch (e) {
        ergebnis.fehler.push(`Kontakt ${c.id}: ${e.message}`);
      }
    }
  } catch (e) {
    ergebnis.fehler.push(`Tag-Liste: ${e.message}`);
  }

  // 2. Einmalige Erinnerung an die Bestätigung
  if (DOI_ERINNERUNG) {
    try {
      const offen = await alleSeiten(`contacts?listid=${LISTE}&status=0`, 'contacts');
      for (const c of offen) {
        if (!zeitUebrig()) break;
        const l = links.get(String(c.id));
        if (!l || !l.cdate || !c.email || c.deleted === '1') continue;   // nur Anmeldungen über die Webinar-Seite
        const stunden = (Date.now() - new Date(l.cdate).getTime()) / 36e5;
        if (!(stunden >= DOI_AB_STUNDEN && stunden <= DOI_BIS_STUNDEN)) continue;
        const tags = await acGet(`contacts/${c.id}/contactTags`);
        if ((tags.contactTags || []).some((t) => String(t.tag) === TAG_DOI)) continue;
        try {
          // Tag zuerst setzen: lieber eine Erinnerung zu wenig als zwei
          await acPost('contactTags', { contactTag: { contact: String(c.id), tag: TAG_DOI } });
          const body = new URLSearchParams({ ...AC_FORM, firstname: c.firstName || '', email: c.email });
          await fetch(AC_FORM_URL, { method: 'POST', body, redirect: 'manual', signal: AbortSignal.timeout(5000) });
          ergebnis.erinnerungen++;
        } catch (e) {
          ergebnis.fehler.push(`Erinnerung ${c.id}: ${e.message}`);
        }
      }
    } catch (e) {
      ergebnis.fehler.push(`Unbestätigte: ${e.message}`);
    }
  }

  console.log('webinarjam-sync', JSON.stringify(ergebnis));
  const teile = [];
  if (ergebnis.links) teile.push(`:link: ${ergebnis.links} Webinar-Link(s) nachgetragen`);
  if (ergebnis.erinnerungen) teile.push(`:envelope: ${ergebnis.erinnerungen} Bestätigungs-Erinnerung(en) verschickt`);
  if (ergebnis.fehler.length) teile.push(`:warning: ${ergebnis.fehler.length} Fehler: ${ergebnis.fehler.slice(0, 3).join(' | ').slice(0, 300)}`);
  if (teile.length) await slack(`*Webinar-Abgleich*\n${teile.join('\n')}`);
  return new Response('ok');
};
