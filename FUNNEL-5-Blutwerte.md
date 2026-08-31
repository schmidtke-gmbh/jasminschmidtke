# Funnel: Leadmagnet „Die 5 wichtigsten Blutwerte ab 40"

Stand: 30.08.2026 · Variante **E-Mail-Opt-in mit Direkt-Download**

---

## 1. Der Ablauf

```
Reel auf Instagram
   ↓  Zuschauerin kommentiert das Keyword (z. B. "BLUTWERTE")
ManyChat: automatische DM
   ↓  Nachricht mit Button, Klick öffnet das 24-Stunden-Fenster
ManyChat: zweite DM mit dem Link
   ↓
5-blutwerte.html  (Download-Seite)
   ↓  Modal: Vorname + E-Mail (Netlify Forms)
5-blutwerte-danke.html  (Dankeseite)
   ↓  Download-Button, PDF liegt sofort vor
Video von Jasmin  →  Masterclass-Warteliste
```

Die E-Mail ist der Gegenwert für das PDF, ausgeliefert wird direkt auf der Dankeseite. Kein Wechsel in eine andere App, kein Warten, keine Spam-Ordner-Frage. Das ist der kürzeste Weg vom Kommentar zum Dokument.

---

## 2. Die Dateien

| Datei | Zweck |
|---|---|
| `5-blutwerte.html` | Download-Seite: ein Bildschirm, kein Menü, ein Button. Formular liegt in einem Modal |
| `5-blutwerte-danke.html` | Dankeseite mit rotem Banner, Fortschrittsbalken, Download-Button, Video und Masterclass-Sektion |
| `Die-5-wichtigsten-Blutwerte-ab-40-Jasmin-Schmidtke.pdf` | Das PDF, das der Download-Button ausliefert |
| `5-blutwerte-cover.jpg` | Mockup-Vorschau, ab dem Titel unscharf, damit die Werte nicht lesbar sind |
| `5-blutwerte-og.jpg` | Social-Preview 1200 × 630 |
| `5-Blutwerte-Optimalbereiche-Ue40.pdf` | Ursprungsdatei, identisch mit dem Download. Kann bleiben oder weg |
| `5-blutwerte-cover-scharf.jpg` | Scharfe Fassung der Vorschau, wird von keiner Seite eingebunden |

Alles liegt in `GitHub-Upload-LIVE`, also im gleichen Ordner wie der Rest der Website. Farben, Schriften, Buttons und Footer sind aus `index.html` und `warteliste.html` übernommen.

**Aufbau der Landingpage:** minimal, nach dem Vorbild von fullstack.de/playbook. Kein Menü, keine Sektionen, kein Scrollen auf Desktop. Nur Logo, Headline, drei Sätze, vier Häkchen, das PDF-Mockup und ein Button. Der Klick öffnet ein Modal mit Vorname und E-Mail. Es führt kein Link von der Seite weg, außer Impressum und Datenschutz im Footer.

**Aufbau der Dankeseite:**

1. **Rotes Banner**, fest am oberen Bildschirmrand: „Fast geschafft. Lade dir jetzt deine Übersicht herunter."
2. **Fortschrittsbalken** mit Prozentzahl am Ende, zählt beim Laden auf 90 % hoch
3. **Pill-Badge** „Die letzten zwei Schritte …"
4. **Schritt 1: Download.** Grüner Button mit Download-Icon, liefert das PDF direkt aus
5. **Schritt 2: Video.** YouTube-Video von Jasmin zum Thema Stoffwechsel, verlinkt als Vorschaubild statt als iframe, damit kein Cookie-Banner davorspringt
6. **Masterclass-Sektion** mit Mockup-Bild und Button auf `warteliste.html`

Beim Klick auf den Download springt der Balken auf 100 % und das Banner wird grün: „Geschafft. Deine Übersicht ist heruntergeladen."

---

## 3. Was Netlify bekommt

Formularname: `5-blutwerte-freebie`

| Feld | Inhalt |
|---|---|
| `vorname` | Vorname |
| `email` | E-Mail-Adresse |
| `einverstanden` | Einwilligung (Pflichtfeld) |

Nach dem Deploy taucht das Formular automatisch im Netlify-Dashboard auf. Für den Weg in ActiveCampaign: Netlify-Formular per Zapier oder Make an AC übergeben, oder das Formular direkt gegen den AC-Embed tauschen.

### Optional, aber empfohlen: Willkommens-Mail

Die Auslieferung läuft über die Dankeseite, die E-Mail ist also technisch nicht nötig. Trotzdem lohnt sie sich:

- Wer den Download-Button auf der Dankeseite übersieht oder das Tab zu früh schließt, hat sonst nichts
- Sie öffnet den E-Mail-Kanal, den du später für die Masterclass brauchst
- Sie liefert einen ersten Berührungspunkt, bevor der eigentliche Newsletter startet

Inhalt: kurzer Gruß, Link zum PDF, Hinweis auf die Warteliste. Zwei Sätze reichen.

---

## 4. Upload und URLs

Der Ordner geht per Git zu GitHub, Netlify baut daraus die Live-Seite. Beide Dateien kommen ins Wurzelverzeichnis, nicht in einen Unterordner.

Netlify liefert HTML-Dateien ohne Endung aus. Aus `5-blutwerte.html` wird also automatisch:

| Seite | URL |
|---|---|
| Landingpage | `jasminschmidtke.de/5-blutwerte` |
| Dankeseite | `jasminschmidtke.de/5-blutwerte-danke` |

In beiden Dateien steht kein einziger Link mehr mit `.html`. Formular-Weiterleitung, Footer und Masterclass-Button zeigen alle auf die endungslose Variante. Die Endung taucht damit nie in der Adresszeile auf.

**Für ManyChat und alle Reels gilt also:** `jasminschmidtke.de/5-blutwerte`

---

## 5. Vor dem Livegang

- [ ] Beide HTML-Seiten, das PDF, `5-blutwerte-cover.jpg` und `5-blutwerte-og.jpg` deployt
- [ ] Download-Button getestet: PDF öffnet sich, Dateiname stimmt
- [ ] Testeintragung: Formular abschicken, Dankeseite prüfen, Balken springt auf 100 %
- [ ] Netlify-Dashboard: Formular `5-blutwerte-freebie` taucht auf
- [ ] Link in der ManyChat-DM zeigt auf `jasminschmidtke.de/5-blutwerte`, ohne Endung
- [ ] `5-blutwerte-og.jpg` im Facebook Sharing Debugger einmal neu einlesen lassen

---

## 6. Tracking

Auf der Landingpage:

- **Meta Pixel** `FreebieFormOpen` beim Öffnen des Modals
- **Meta Pixel** `FreebieFormSubmit` beim Absenden

Auf der Dankeseite:

- **Meta Pixel** `Lead` beim Seitenaufruf
- **Meta Pixel** `FreebieDownload` beim Klick auf den Download-Button
- **GA4** `freebie_download` und `video_klick`

So siehst du getrennt, wie viele das Modal öffnen, wie viele absenden und wie viele das PDF tatsächlich herunterladen. Alle Events laufen nur bei erteiltem Cookie-Consent.

---

## 7. Kennzahlen für den ersten Test

| Kennzahl | Realistischer Startwert |
|---|---|
| Kommentare, die die DM auslösen | 60 bis 80 % |
| Button-Klicks in der ersten DM (= echte Opt-ins) | 50 bis 70 % |
| Klicks auf die Landingpage | 40 bis 60 % |
| Modal-Öffnungen auf der Landingpage | 30 bis 50 % der Besucherinnen |
| Absendungen (von den Modal-Öffnungen) | 60 bis 80 % |
| Downloads auf der Dankeseite | 80 bis 90 % |

Die Downloadrate sollte hoch sein, weil kein Medienwechsel mehr nötig ist. Liegt sie unter 70 %, ist der Button auf der Dankeseite nicht sichtbar genug.

Wenn die Landingpage unter 25 % Absendungen liegt, liegt es fast immer an der Headline oder daran, dass das Reel etwas anderes versprochen hat als die Seite. Dann zuerst die Headline an das Reel angleichen, nicht das Formular umbauen.

---

## 8. Zwei Randnotizen zur bestehenden Website

1. `index.html` und `warteliste.html` verweisen auf `og-image.jpg` und `site.webmanifest`. Beide Dateien liegen nicht im Ordner `GitHub-Upload-LIVE`. Beim Teilen dieser Seiten erscheint deshalb kein Vorschaubild.
2. `design-system.md` und der Live-Stand weichen an mehreren Stellen voneinander ab: Die Doku schreibt Poppins für Headlines vor, live läuft überall Playfair. Auch `--text-body`, `--border` und `--text-muted` unterscheiden sich. Die neuen Seiten folgen dem Live-Stand. Sinnvoll wäre, die Doku bei Gelegenheit nachzuziehen.
