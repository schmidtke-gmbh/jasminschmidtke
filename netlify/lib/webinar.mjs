// Gemeinsame Hilfsfunktionen für die Webinar-Anmeldung (WebinarJam + ActiveCampaign).
// Benötigte Umgebungsvariablen in Netlify (Project configuration > Environment variables):
//   WEBINARJAM_API_KEY  = API-Schlüssel aus WebinarJam (Webinar > Advanced > API custom integration), als Secret
//   AC_API_KEY, AC_API_URL = wie bei der Geschenkvideo-Funktion
// Optional: WEBINARJAM_SCHEDULE (Termin-ID fest vorgeben, sonst wird der 20.10. automatisch gesucht)

export const WEBINAR_ID = '2';            // WebinarJam Webinar-ID (Live-Webinar 20.10.2026)
export const WEBINAR_DATE = '2026-10-20'; // Termin, der automatisch ausgewählt wird
export const AC_FIELD_LINK = '2';         // ActiveCampaign-Feld „Webinar-Link“, Platzhalter %WEBINAR_LINK%

const WJ = 'https://api.webinarjam.com/webinarjam';

async function wjPost(path, params, ms) {
  const key = process.env.WEBINARJAM_API_KEY;
  if (!key) throw new Error('WEBINARJAM_API_KEY fehlt in Netlify');
  const r = await fetch(`${WJ}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ api_key: key, ...params }).toString(),
    signal: AbortSignal.timeout(ms),
  });
  const text = await r.text();
  let j = null;
  try { j = JSON.parse(text); } catch { /* keine JSON-Antwort */ }
  if (!r.ok || !j || j.status !== 'success') {
    const msg = (j && (j.message || j.error)) || text.slice(0, 120) || `HTTP ${r.status}`;
    throw new Error(`WebinarJam ${path}: ${String(msg).slice(0, 160)}`);
  }
  return j;
}

export async function getWebinar() {
  const j = await wjPost('webinar', { webinar_id: WEBINAR_ID }, 4000);
  return j.webinar || {};
}

let scheduleCache = null;
export async function getSchedule() {
  if (process.env.WEBINARJAM_SCHEDULE) return String(process.env.WEBINARJAM_SCHEDULE);
  if (scheduleCache) return scheduleCache;
  const w = await getWebinar();
  const list = Array.isArray(w.schedules) ? w.schedules : [];
  const pick = list.find((s) => String(s.date || '').startsWith(WEBINAR_DATE)) || (list.length === 1 ? list[0] : null);
  if (!pick || pick.schedule == null) throw new Error(`Termin ${WEBINAR_DATE} in WebinarJam nicht gefunden`);
  scheduleCache = String(pick.schedule);
  return scheduleCache;
}

export async function registerToWebinar({ firstName, email, ip }) {
  const schedule = await getSchedule();
  const params = { webinar_id: WEBINAR_ID, first_name: (firstName || '').trim() || 'Teilnehmerin', email: email.trim(), schedule };
  if (ip && /^[0-9a-f.:]{3,45}$/i.test(ip)) params.ip_address = ip;
  const j = await wjPost('register', params, 4500);
  const u = j.user || {};
  if (!u.live_room_url) throw new Error('WebinarJam: kein Raum-Link in der Antwort');
  return u;
}

export async function saveLinkToAC(email, link) {
  const base = (process.env.AC_API_URL || '').replace(/\/+$/, '');
  const key = process.env.AC_API_KEY;
  if (!base || !key) throw new Error('AC_API_URL oder AC_API_KEY fehlt in Netlify');
  const r = await fetch(`${base}/api/3/contact/sync`, {
    method: 'POST',
    headers: { 'Api-Token': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: { email: email.trim(), fieldValues: [{ field: AC_FIELD_LINK, value: link }] } }),
    signal: AbortSignal.timeout(3000),
  });
  if (!r.ok) throw new Error(`ActiveCampaign: HTTP ${r.status}`);
}

export async function acGet(path, ms = 4000) {
  const base = (process.env.AC_API_URL || '').replace(/\/+$/, '');
  const key = process.env.AC_API_KEY;
  if (!base || !key) throw new Error('AC_API_URL oder AC_API_KEY fehlt in Netlify');
  const r = await fetch(`${base}/api/3/${path}`, { headers: { 'Api-Token': key }, signal: AbortSignal.timeout(ms) });
  if (!r.ok) throw new Error(`ActiveCampaign: HTTP ${r.status}`);
  return r.json();
}
