// Netlify-Funktion: nimmt Ereignisse der Geschenkvideo-Seiten entgegen
// und setzt in ActiveCampaign den passenden Tag beim Kontakt.
// Benötigte Umgebungsvariablen in Netlify (Site settings > Environment variables):
//   AC_API_KEY  = API-Schlüssel aus ActiveCampaign (Einstellungen > Entwickler)
//   AC_API_URL  = API-URL aus ActiveCampaign, z. B. https://jasminschmidtke70927.api-us1.com

// Tag-IDs in ActiveCampaign (angelegt am 07.10.2026)
const TAGS = {
  '1': { seite: 7, start: 8, '50': 9, '90': 10, pdf: 11 },
  '2': { seite: 12, start: 13, '50': 14, '90': 15, pdf: 16 },
};

const ALLOWED = /^https:\/\/(www\.)?jasminschmidtke\.de$|^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.netlify\.app$|^https:\/\/[a-z0-9-]+\.netlify\.app$|^http:\/\/localhost(:\d+)?$/;

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const origin = req.headers.get('origin');
  if (origin && !ALLOWED.test(origin)) return new Response('Forbidden', { status: 403 });

  let data;
  try { data = JSON.parse(await req.text()); } catch { return new Response('Bad request', { status: 400 }); }

  const c = String(data?.c ?? '');
  const v = String(data?.v ?? '');
  const e = String(data?.e ?? '');
  const tag = TAGS[v]?.[e];
  if (!/^\d{1,12}$/.test(c) || !tag) return new Response('Bad request', { status: 400 });

  const key = process.env.AC_API_KEY;
  const base = (process.env.AC_API_URL || 'https://jasminschmidtke70927.api-us1.com').replace(/\/+$/, '');
  if (!key) return new Response('Not configured', { status: 500 });

  try {
    const res = await fetch(`${base}/api/3/contactTags`, {
      method: 'POST',
      headers: { 'Api-Token': key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ contactTag: { contact: c, tag: String(tag) } }),
    });
    if (!res.ok) {
      console.log('AC-Fehler', res.status, (await res.text()).slice(0, 300));
      return new Response(null, { status: 502 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    console.log('AC nicht erreichbar', String(err));
    return new Response(null, { status: 502 });
  }
};

export const config = { path: '/api/video-event' };
