# Dr. André Alesi — Webinar-Landingpage

Landing Page für das kostenlose Live-Webinar „Schluss mit der 3-Uhr-Nacht".

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Startseite (Marken-Homepage) |
| `ueber-mich.html` | Über Dr. André Alesi |
| `kurs.html` | Verkaufsseite „Die Durchschlaf-Formel" (997 € inkl. MwSt.) |
| `kurs-danke.html` | Bestätigungsseite nach dem Kauf (Checkout-Redirect, Purchase-Pixel) |
| `webinar.html` | Webinar-Landingpage |
| `webinar-danke.html` | Bestätigungsseite nach der Anmeldung (WebinarJam-Redirect) |
| `kontakt.html` | Kontaktformular (Backend einrichten, z. B. Formspree) |
| `warteliste.html` / `warteliste-danke.html` | Warteliste der Schlaf-Masterclass (eigener Funnel im hellen Design, Netlify-Formular) |
| `newsletter.html` / `newsletter-danke.html` | Newsletter-Anmeldung (Tool einbinden) + Double-Opt-in-Seite |
| `impressum.html`, `datenschutz.html`, `agb.html`, `widerruf.html` | Rechtsseiten (Platzhalter, anwaltlich prüfen) |
| `site.css`, `site.js` | Gemeinsames Design-System der neuen Seiten |
| `styleguide.html` | Brand Style Guide (Logo, Farben, Typografie, Dark/Light) |
| `favicon.svg`, `logo-zeichen-*.svg`, `logo-lockup-*.svg` | Offizielle Logo-Dateien (Zeichen solo + komplettes Lockup, je hell/dunkel) |
- `logo-header-dunkel.svg` / `logo-header-hell.svg` – Header-Varianten: ohne Mikro-Tagline, Schriftzug 1,45x größer. Werden in Navigation und Seitenköpfen genutzt, Footer behalten das volle Lockup.
| `img/` | Beispielbilder (KI-generiert, bei Bedarf durch echte Fotos ersetzen) |

## Vor dem Livegang

0. **Rechtsseiten:** Alle [Platzhalter] in Impressum, Datenschutz, AGB und Widerruf ausfüllen und prüfen lassen. Kontaktdaten (kontakt@andre-alesi.de ist ein Platzhalter) überall anpassen.
1. **Termin:** Alle Stellen sind im Code mit `▼ TERMIN ändern (1/5 … 5/5)` markiert (index.html + webinar-danke.html).
2. **WebinarJam:** Embed-Code in `index.html` beim Marker `WEBINARJAM-ANMELDUNG` einfügen; Bestätigungsseite auf `webinar-danke.html` stellen.
3. **Checkout:** In `kurs.html` beim Marker `▼ CHECKOUT-LINK` den Bezahllink einsetzen (z. B. Digistore24, CopeCart, Stripe).
4. **Meta-Pixel:** In `webinar-danke.html` vorbereitet (auskommentiert).
4. **André-Foto:** Das echte Porträt liegt als `img/andre-portrait.jpg` im Repo (Querformat-Original: `img/andre-portrait-quer.jpg`).
5. **Fotos:** Die KI-Bilder liegen aktuell auf dem Higgsfield-CDN (automatischer Fallback im HTML). Für dauerhafte Nutzung einmal herunterladen und unter diesen Namen in `img/` speichern — die Seite nutzt dann automatisch die lokalen Dateien:
   | Datei | Download |
   |---|---|
   | `img/schlaf-nacht.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260720_102649_169e3d4c-8980-4143-a280-14bde6d9a7e4.png |
   | `img/morgen-energie.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260720_102651_bd0b10d6-7d59-4532-8ed2-dbbc1944e1d6.png |
   | `img/schlafzimmer-ruhe.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260720_102653_70cd2293-bdda-4741-9d5d-a2ad193ce0d3.png |
   | `img/szene-schlafzimmer.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260830_142617_ad82471c-12df-4ad9-b921-4210cac1deab.png |
   | `img/szene-mondfenster.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260830_142619_d829a28a-e57d-413f-8ef6-e0e30e2e24ee.png |
   | `img/szene-wach.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260830_144734_fd19963f-0e82-4507-987a-9c3de7a054ed.png |
   | `img/szene-morgen.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260830_144743_74afa12c-0148-4220-829c-14f94b592318.png |
   | `img/szene-schwarzwald.jpg` | https://d8j0ntlcm91z4.cloudfront.net/user_39bpvnosVvqwhbus3q5PhClCw2s/hf_20260830_142620_bf3c84b6-c7ef-47df-9d7a-eda5468f0200.png |

   Später einfach durch echte Fotos von André ersetzen (gleiche Dateinamen genügen).
5. **Impressum/Datenschutz:** `impressum.html` und `datenschutz.html` ergänzen.

## GitHub Pages

Repo → Settings → Pages → Branch `main`, Ordner `/ (root)` — die Seite liegt dann unter `https://USERNAME.github.io/REPONAME/`.
