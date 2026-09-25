# Wiederherstellung: Upsell-Seiten Gelände-Schlüssel-Funnel

Stand: 25.09.2026. Quellen: Session-Transkripte (`~/.claude/projects/C--Users-Olive-Desktop-claude-workspace/*.jsonl`), Git-Historie, Worktrees, Memory `project_thrivecart.md`.
Inhalte 1:1 übernommen, nichts umformuliert.

## Funnel-Reihenfolge (laut Anika, Session 33428205, 23.07.2026)
Gelände-Schlüssel (27 €, product-12) → **1. Gelände sicher meistern** (99 €) → **2. Schluss mit Kopfkino** (97 €) → **3. Handarbeits-Programm** (197 €) → **4. Offenstallplaner** (47 €)

- Laut Claude-Zusammenfassung vom 23.07. ist Handarbeit der „4. Upsell nach Kopfkino". Die Zählung passt nicht ganz zur Reihenfolge oben, aber die Reihenfolge selbst ist klar.
- In ThriveCart sind das One-Click-Upsells. GSM läuft in `purchase_map_flat` als `upsell-1` (Filter `product-12` + `upsell-1`).
- Ablehnen-Link im ThriveCart-Standardtext (Screenshot Kopfkino): „Nein danke, bitte fügen Sie dieses Angebot meinem Einkauf nicht hinzu“.
- Button-Text bei Kopfkino und Handarbeit: „Zur Bestellung hinzufügen!“
- Zur GSM-Upsell-Seite: Sie lag zuerst auf Devine. Nach dem 19.07. hat Anika sie komplett in ThriveCart neu aufgebaut („hosted“, vorher „über eigene Seite anzeigen“).
- Downsell-Logik für diesen Funnel: nichts gefunden. Nach Nicht-Kauf laufen 3 Mails pro Produkt mit 72h/48h/24h-Timer (upsell-sicher-meistern-mails.md, upsell-kopfkino-mails.md, upsell-handarbeit-mails.md).
- Verkäufe laut Memory: GSM ~7–8, Kopfkino 1, Handarbeit und Offenstallplaner als Upsell nie.

## 1. Gelände sicher meistern → `sicher-meistern.html`
- **Quelle:** Session 64f33619 (Desktop-ID local_85871f22), **30.07.2026**, Zeile 511. Anika hat den Code einer Upsell-Seite eingefügt, Claude hat nur die Button-Links von Digistore 688257 auf `https://anikas-pferdeakademie.thrivecart.com/gsm/` getauscht. Sonst ist der Code identisch (geprüft).
- Headline: „Du hast das Hoftor gemeistert. Jetzt meisterst du das Gelände.“ · Preis: 99 € statt 147 € (noch mit „oder 2 × 59 €“) · Button (2×): „Ja! Ich will das Gelände sicher meistern!“ · Testimonial: Sandra mit Hannoveraner Stute Fiona · Bild: filesafe …/69fdf49fbc1f77cc35faf5fa.png
- **Wie sicher ist das die Endfassung:** mittel. Das ist die letzte HTML-Fassung, die es gibt. Die neu aufgebaute ThriveCart-Version (nach dem 19.07.) wurde aber im Editor gebaut, dazu gibt es weder Code noch Screenshots. Am 17.06. hatte Anika „2 × 59 €“ aus zwei Preisbox-Bildern entfernen lassen (gsm-preisbox-hero/-rot.png, liegen nicht mehr auf dem Desktop). Die ThriveCart-Version hatte die Teilzahlung also womöglich nicht mehr.

## 2. Schluss mit Kopfkino → `kopfkino.md` + `screenshots/kopfkino-*`
- **Quelle:** Session 33428205, **22.07.2026**. Kopie von `outputs/gelaendeschluessel/upsell-kopfkino-seite.md` (Status dort: „in ThriveCart umgesetzt“).
- **Wie sicher ist das die Endfassung:** hoch. Anikas 4 ThriveCart-Screenshots vom 22.07. (aus dem Transkript gezogen) passen Wort für Wort zum Text. In den Transkripten gibt es keine neuere Fassung.
- Nur Text, kein HTML: Anika hat die Seite direkt im ThriveCart-Editor gebaut. Das Headerbild hat sie selbst getauscht. Foto Anika + Schimmel und Kirstin-Screenshot sind nur als Screenshot vorhanden.

## 3. Handarbeits-Programm → `handarbeit.html` + `screenshots/handarbeit-*`
- **Quelle:** Session 33428205, **23.07.2026** (Commit 07d8c58). `handarbeit.html` ist Claudes HTML-Entwurf (Platzhalter `__HEADER_BILD_HANDARBEIT__`, Links `#`).
- **Wie sicher ist das die Endfassung:** Der Entwurf ist **nicht** die Live-Version. Anika hat die Seite selbst im ThriveCart-Editor gebaut und dabei eigene Texte genommen, z. B. „Achtung: Hier kommt noch ein riesiger Hebel…“, „100€ sparen! Im Handarbeits-Programm“, „in 8 Wochen“, „Kurs mit unbegrenzter Laufzeit für nur 197 € statt 299 € sichern!“, „Weißt du, was einer der Hauptgründe ist…“, 5 Ergebnis-Bullets, Lydia B., Schlusssatz „Gib deinem Pferd den Körper, den es braucht…“ und ein Friesen-Schlussbild. **Die Live-Fassung steckt nur in den 5 Screenshots vom 23.07.** Das Stück zwischen Screenshot 1 und 2 und der Teil nach dem Schlussbild fehlen eventuell.

## 4. Offenstallplaner → keine Datei
- **Nichts gefunden.** Claude hat in keiner Session eine Upsell-Seite für den Offenstallplaner gebaut. Die Seite hat Anika vermutlich selbst in ThriveCart angelegt.
- Belegt ist nur: ThriveCart-Produkt „Offenstallplaner“, als Upsell im Funnel mit **47 €** (Auswertungstabelle „Upsell Offenstallplaner 47€“, Session 43022357, 29.07.). Kein Streichpreis bekannt.
- Mögliches Ausgangsmaterial: die normale Salespage `outputs/offenstall/salespage.html` („Dein fertiges Konzept in nur 24 Stunden.“, Checkout thrivecart.com/offenstallplaner/) und `context/content-offenstall.md`.
