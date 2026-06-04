# Webinar-Funnel — Jasmin Schmidtke

Statische Seiten für das Live-Webinar (So., 14.06.2026, 11:00 Uhr).

## Dateien
- `webinar.html` — Landingpage (Ziel-URL der Meta-Ads)
- `webinar-danke.html` — Bestätigungsseite (in WebinarJam als Custom-Thank-You eintragen)
- `logo.svg` + 8 webvoptimierte Bilder (gesamt ~1,6 MB)

## Deploy (Netlify)
1. Dieses Verzeichnis als GitHub-Repo pushen
2. Netlify → "Add new site" → "Import an existing project" → Repo wählen
3. Build command: leer · Publish directory: `/` (Root)
4. Domain verbinden (z. B. `webinar.jasminschmidtke.de` als CNAME auf die Netlify-URL)

## Vor dem Livegang
- [ ] WebinarJam-Embed-Code in `webinar.html` einfügen (Platzhalter in der Final-CTA-Sektion, Anleitung im HTML-Kommentar)
- [ ] In WebinarJam Bestätigungsseite setzen: volle URL zu `webinar-danke.html`
- [ ] Meta-Pixel-Basiscode in BEIDE Dateien einfügen, `CompleteRegistration`-Event in `webinar-danke.html` aktivieren (Kommentar im `<head>`)
- [ ] Links im Footer prüfen: `impressum.html` / `datenschutz.html` auf die echten URLs der Hauptseite zeigen lassen

**Wichtig:** Die Original-Fotos (50-MB-PNGs) gehören NICHT ins Repo — hier liegen nur die optimierten Web-Versionen.
