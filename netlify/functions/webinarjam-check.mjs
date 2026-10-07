// Netlify-Funktion für die Einrichtung: prüft die WebinarJam-Verbindung und trägt bisherige Anmeldungen nach.
//   /api/webinarjam-check                              zeigt Webinar, Termine und ob alle Variablen gesetzt sind
//   /api/webinarjam-check?nachtragen=2026-10-07        zeigt, wie viele Kontakte (Formular 3, ab Datum) noch keinen Link haben
//   /api/webinarjam-check?nachtragen=2026-10-07&los=1  meldet diese bei WebinarJam an und setzt den Link in ActiveCampaign
// Gibt keine E-Mail-Adressen oder Schlüssel aus. Kann nach dem Webinar gelöscht werden.

import { WEBINAR_ID, WEBINAR_DATE, AC_FIELD_LINK, getWebinar, registerToWebinar, saveLinkToAC, acGet } from '../lib/webinar.mjs';

export const config = { path: '/api/webinarjam-check' };

const json = (o, status = 200) => new Response(JSON.stringify(o, null, 2), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export default async (req) => {
  const url = new URL(req.url);
  const env = {
    WEBINARJAM_API_KEY: !!process.env.WEBINARJAM_API_KEY,
    AC_API_KEY: !!process.env.AC_API_KEY,
    AC_API_URL: !!process.env.AC_API_URL,
    SLACK_WEBHOOK_URL: !!process.env.SLACK_WEBHOOK_URL,
  };
  const since = url.searchParams.get('nachtragen');

  if (!since) {
    try {
      const w = await getWebinar();
      const schedules = (w.schedules || []).map((s) => ({ schedule: s.schedule, date: s.date, comment: s.comment }));
      const gewaehlt = schedules.find((s) => String(s.date || '').startsWith(WEBINAR_DATE)) || (schedules.length === 1 ? schedules[0] : null);
      return json({
        ok: !!gewaehlt, webinar_id: WEBINAR_ID, name: w.name, type: w.type, timezone: w.timezone,
        schedules, gewaehlt, registration_url: w.registration_url, direct_live_room_url: w.direct_live_room_url, env,
      });
    } catch (e) {
      return json({ ok: false, fehler: e.message, env }, 500);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(since) || since < '2026-09-29') return json({ ok: false, fehler: 'Datum als JJJJ-MM-TT ab 2026-09-29' }, 400);
  const los = url.searchParams.get('los') === '1';
  const start = Date.now();
  const out = { ok: true, ab: since, modus: los ? 'anmelden' : 'nur zählen', gefunden: 0, schon_mit_link: 0, abgemeldet: 0, ohne_link: 0, angemeldet: 0, fehler: [], weitere_offen: 0 };
  try {
    const list = await acGet(`contacts?formid=3&limit=100&filters[created_after]=${since}`);
    const contacts = (list.contacts || []).filter((c) => c.deleted !== '1');
    out.gefunden = contacts.length;
    for (const c of contacts) {
      if (Date.now() - start > 7000) { out.weitere_offen++; continue; }
      const full = await acGet(`contacts/${c.id}`);
      const link = (full.fieldValues || []).find((f) => String(f.field) === AC_FIELD_LINK && f.value);
      if (link) { out.schon_mit_link++; continue; }
      const lists = full.contactLists || [];
      if (lists.length && lists.every((l) => ['2', '3'].includes(String(l.status)))) { out.abgemeldet++; continue; }
      out.ohne_link++;
      if (!los) continue;
      try {
        const user = await registerToWebinar({ firstName: c.firstName, email: c.email });
        await saveLinkToAC(c.email, user.live_room_url);
        out.angemeldet++;
      } catch (e) {
        out.fehler.push(`Kontakt ${c.id}: ${e.message}`);
      }
    }
  } catch (e) {
    return json({ ok: false, fehler: e.message, env }, 500);
  }
  if (out.weitere_offen) out.hinweis = 'Zeitlimit erreicht: Adresse noch einmal aufrufen, dann geht es weiter.';
  return json(out);
};
