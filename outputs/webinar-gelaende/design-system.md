# Gelände Design-System — Koffer-Bonus & Webinar-Workbook (einheitlicher Look)

**Zweck:** Ein gemeinsames Design für alle gedruckten Gelände-Webinar-Materialien (Koffer voller Notfallstrategien + Webinar-Workbook), damit sie einheitlich aussehen.
**Basis:** Struktur des bewährten Energetik-VIP-Workbooks (outputs/energetik/vip-workbook.html), umgefärbt auf Gelände-Erdtöne.

## Fonts
- Überschriften: Playfair Display (elegant, warm) — wie im Energetik-Workbook (Produktfamilie).
- Fließtext: Montserrat.
- (Alternative, falls exakt wie die Slides gewünscht: Überschriften auch Montserrat. Anika entscheidet.)

## Palette (Gelände)
- `--rust` #7B3F28 — Überschriften, Top-Akzentleiste, Badge (ersetzt Bordeaux)
- `--caramel` #C58B5C — Trennlinie, Box-Rahmen links, Skala-Kreise (ersetzt Gold)
- `--beige` #F5EDE2 — Seitengrund / Box-Beige
- `--sage` #E4EADD — zweite Box-Farbe, Natur-Touch (ersetzt Babyblau)
- `--text` #2C2C2C
- `--white` #FFFFFF

## Wiederverwendbare Bausteine (aus dem Energetik-Workbook)
- A4-Seite (210×297mm), Padding 24/22mm, weiße Seite auf beigem Grund, Box-Shadow
- Top-Akzentleiste (Verlauf rust→caramel)
- `.kicker` (kleines Uppercase-Label in rust)
- `.gold-line` → Karamell-Trennlinie
- `.box` (beige, Karamell-Rahmen links) + `.box.sage` (Salbei, rust-Rahmen)
- `.line` Schreiblinien (dotted), `.write-block`
- `.scale` 1–10 (Karamell-Kreise), Labels, Hinweis
- `.checkrow` (Checkbox), `.step` (nummerierte Kreise in rust)
- `.cover` (Logo + Badge + Playfair-Titel + 🐴-Emoji + Subtitle + „mit Anika Wesse")
- `.footer` (Seitenzahl + „Anikas Pferdeakademie")
- Print-CSS für A4 (@page size:A4; margin:0; print-color-adjust:exact)

## Dokument 1 — Koffer voller Notfallstrategien (Live-dabei-Bonus)
- Referenz-Handout, kaum Schreiblinien.
- Cover + eine Seite (oder zwei) mit den 4 Kategorie-Boxen (A–D), jede Strategie als knackiger Ein-Zeiler.
- Quelle-Text: outputs/webinar-gelaende/koffer-notfallstrategien.docx (Anika finalisiert Wording).

## Dokument 2 — Webinar-Workbook (Mitmach-Heft)
- Struktur analog Energetik-Workbook, gemappt auf den Gelände-Webinar-Aufbau:
  - Cover
  - Vor dem Webinar: Ausgangs-Selbsteinschätzung + 1–10-Skala (wie sicher fühlst du dich im Gelände?)
  - Pro Content-Schritt eine Seite (Aha-Moment-Linien, Kernbox, Notizen)
  - Abschluss: größte Erkenntnis + 1–10-Skala (nachher) + sanfter Ausblick
- Wird gebaut, wenn der Webinar-Content steht.

## Status / offene Entscheidungen (Anika)
- Akzentfarbe Karamell #C58B5C ok, oder lieber anderer Ton?
- Überschriften-Font Playfair Display ok, oder Montserrat (wie Slides)?
- Zweite Box-Farbe Salbeigrün ok?
