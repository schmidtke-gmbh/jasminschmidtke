# ManyChat-Setup für den Blutwerte-Leadmagnet

Stand: 30.08.2026 · geprüft gegen die ManyChat-Doku (Artikel zuletzt aktualisiert am 27.08.2026)
Variante: **E-Mail-Opt-in mit Direkt-Download**, kein WhatsApp

Du brauchst nur **eine** Automation in ManyChat. Sie bringt die Leute vom Kommentar auf die Landingpage. Alles danach macht die Website.

---

## Die zwei Fragen, die immer kommen

**Gilt das Keyword für den ganzen Account?**

Nein, wenn du es nicht willst. Beim Trigger „User comments on your Post or Reel" wählst du im zweiten Schritt zwischen drei Optionen:

| Option | Was passiert |
|---|---|
| **Specific post or reel** | Nur Kommentare unter genau diesem einen Reel lösen aus |
| All posts or reels | Kommentare unter jedem Beitrag lösen aus |
| Next post or reel | Nur der nächste Beitrag, den du veröffentlichst |

Für deinen Fall: **Specific post or reel**. Dann kann jemand das Keyword unter ein anderes Reel schreiben und bekommt nichts.

**Warum nicht „PDF" als Keyword?**

Zwei Gründe. Es ist zu generisch und kollidiert, sobald du ein zweites Freebie baust. Und: Ein Keyword-Trigger für eingehende **Direktnachrichten** lässt sich nicht auf einen Beitrag begrenzen, der gilt kontoweit. Wer dir irgendwann „PDF" als DM schreibt, würde die Automation auslösen.

Empfehlung: **`BLUTWERTE`**.

---

## Die Automation: Kommentar zur Landingpage

**Automation → + New Automation → Start From Scratch → Blank**

### Schritt 1: Trigger

- Trigger wählen: **User comments on your Post or Reel** (Instagram-Tab)
- Beitrag: **Specific post or reel** → dein Blutwerte-Reel auswählen
- Keywords: **Include certain words** → `BLUTWERTE`, `Blutwerte`, `blutwerte`
  Als Tippfehler-Puffer optional: `BLUTWERT`, `WERTE`

### Schritt 2: Öffentliche Antwort

Leg 4 bis 6 Varianten an, ManyChat rotiert sie zufällig. Das ist kein Nice-to-have, sondern Spam-Schutz: Immer die gleiche kurze Antwort lässt Instagram die Automation als Spam einstufen. Vermeide reine Emoji-Antworten und sehr kurze Texte.

**Kurz:**

> Hab dir geschrieben 💛
> Ist in deinen DMs
> Schau in deine Nachrichten 🌿
> Ist raus an dich
> Liegt in deinem Postfach
> Hab ich dir geschickt 💛
> Check mal deine DMs
> Ist unterwegs zu dir 🌿
> Ist bei dir in den DMs 💛
> Hab dir was geschickt
> Schau mal ins Postfach
> Ist für dich raus 🌿
> Wartet in deinen Nachrichten

**Länger, mit Neugier-Haken:**

> Ist in deinen DMs. Achte besonders auf Wert Nummer 4, den übersehen die meisten
> Hab dir geschrieben. Spannend wird es bei Seite 1, da siehst du den Unterschied sofort
> Schau in deine Nachrichten. Und sag mir gern, welcher Wert dich am meisten überrascht

Guter Mix: vier kurze plus ein bis zwei lange.

### Schritt 3: Erste DM (Private Reply)

- Erster Schritt im Flow: **Instagram → Send Message**
- Unbedingt **Send as a Private Reply** aktivieren
- Nur **ein** Inhaltsblock erlaubt: Text plus Buttons oder Quick Replies. Keine User-Inputs, keine Verzögerungen, keine dynamischen Blöcke, keine nachfolgenden Schritte in diesem Node.

Text:

> Hey 💛 Schön, dass du dabei bist.
> Ich hab dir die Übersicht mit den 5 wichtigsten Blutwerten fertig gemacht.
> Tipp kurz auf den Button, dann schick ich dir den Link.

Button: **„Ja, schick sie mir"** (Instagram erlaubt maximal 20 Zeichen)

Alternativen für den Text:

> Da bist du ja 💛
> Ich hab dir alles zusammengestellt. Ein Tipp auf den Button und der Link ist bei dir.

> Hey 💛 Die 5 Werte habe ich dir zusammengestellt, samt der Bereiche, in denen sich die meisten Frauen wirklich gut fühlen.
> Tipp auf den Button, dann schick ich dir den Link.

### ⚠️ Der Fehler, der die meisten Funnels kaputt macht

Es ist verlockend, direkt einen Button mit der Aktion **Open website** in die erste DM zu setzen. Mach das nicht.

Laut ManyChat-Doku gilt: Eine Private Reply allein optet die Person **nicht** ein und öffnet das 24-Stunden-Fenster **nicht**. Und ein Button mit der Aktion „Open website" zählt ausdrücklich **nicht** als Opt-in. Die Person landet dann nicht in deiner Kontaktliste, und du kannst ihr nie wieder schreiben.

Das Fenster öffnet sich erst, wenn die Person **auf eine Quick Reply oder einen normalen Button tippt**. Deshalb: erst der Button ohne Website-Aktion, dann im nächsten Schritt der Link.

### Schritt 4: Zweite DM mit dem Link

> Perfekt 💛
> Trag dich kurz ein, dann kannst du die Übersicht direkt herunterladen. Dauert keine Minute.

Button: **„Übersicht holen"** → Aktion *Open website* → `https://www.jasminschmidtke.de/5-blutwerte`

Hier ist „Open website" völlig in Ordnung, weil das Opt-in durch den Klick auf den ersten Button schon passiert ist.

Alternativen für den Text:

> Hier entlang 💛
> Ein kurzes Formular, dann liegt die Übersicht als PDF vor dir.

> Sehr gern.
> Klick auf den Button, trag dich ein und du hast die 5 Werte in unter einer Minute auf dem Handy.

> Da lang 💛
> Kurz eintragen, danach kannst du das PDF sofort herunterladen. Kein Warten, kein Spam-Ordner.

Weitere Button-Texte: „Zur Übersicht" · „Jetzt eintragen" · „Blutwerte holen" · „Hier entlang 💛"
Ich würde **„Übersicht holen"** nehmen. „Holen" klingt nach Belohnung, „eintragen" nach Arbeit.

### Schritt 5: Tag setzen

Als **Action** in den Flow: Tag `IG-Blutwerte-Kommentar` vergeben. So siehst du später, wie viele über das Reel gekommen sind.

---

## Was du beachten solltest

- Der Trigger feuert **nur beim ersten Kommentar** einer Person unter einem Beitrag. Kommentiert dieselbe Person nochmal mit dem gleichen Keyword, passiert nichts mehr. Das ist eine Instagram-Beschränkung und gilt für alle Tools.
- Wenn du mehrere Kommentar-Trigger hast: Bei Triggern ohne Keyword auf „alle Beiträge" gewinnt immer der älteste. Mit Keywords aktiviert jedes Keyword seine eigene Automation.
- Wechsle die Formulierungen der öffentlichen Antworten von Zeit zu Zeit aus.

---

## Reihenfolge zum Aufbauen

1. Website deployen, `jasminschmidtke.de/5-blutwerte` und `/5-blutwerte-danke` live prüfen
2. Download-Button testen: PDF öffnet sich korrekt
3. Automation in ManyChat bauen, mit dem Link zur Landingpage in der zweiten DM
4. **Set Live** schalten
5. Mit einem Zweitaccount komplett durchtesten: kommentieren, DM bekommen, Button tippen, Link öffnen, Formular absenden, PDF herunterladen
6. Erst danach das Reel bewerben

---

## Optional: Nachfassen über E-Mail

Weil die Auslieferung jetzt über die Website läuft, brauchst du für den Masterclass-Pitch den E-Mail-Kanal statt WhatsApp. Zwei Mails reichen:

**Mail 1, sofort nach dem Eintragen**

> Betreff: Deine Blutwerte-Übersicht
>
> Hey [Vorname],
> hier ist deine Übersicht noch einmal zum Nachlesen: [Link zum PDF]
> Nimm dir zwei Minuten für Seite 1. Links steht, was dein Labor ausdruckt, rechts, wo du dich wirklich gut fühlst.

**Mail 2, nach 2 bis 3 Tagen**

> Betreff: Welcher Wert war bei dir am weitesten weg?
>
> Die meisten stolpern über Ferritin oder TSH.
> Falls du das Thema größer angehen willst: Ich baue gerade eine Online-Masterclass für Frauen ab 40. Alles an einem Ort, statt überall ein bisschen.
> Die Warteliste ist kostenlos: jasminschmidtke.de/warteliste

---

## Quellen

- [Instagram Post and Reel Comments trigger – Manychat Help](https://help.manychat.com/hc/en-us/articles/14281316989724-Instagram-Post-and-Reel-Comments-trigger)
- [How to use Keywords Trigger in Manychat – Manychat Help](https://help.manychat.com/hc/en-us/articles/14281211785884-How-to-use-Keywords-Trigger-in-Manychat)
