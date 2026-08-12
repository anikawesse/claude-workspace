# Gelände-Webinar — Automation-Setup (Devine/GHL), monatlich wiederverwendbar

**Ziel:** Monatliches Webinar, pro Monat nur EINE Änderung nötig (das Datum).

## 1. Datumsfeld (einmalig angelegt)
- Benutzerdefiniertes Feld, Typ „Datumsauswahl", Objekt „Kontakt".
- Name: „Webinardatum Gelände" · Key: `webinardatum_gelaende` (bzw. `..._gelnde_...`).

## 2. Feld im Haupt-Workflow automatisch füllen
- Direkt nach dem Trigger (Anmeldung): Aktion „Kontakt aktualisieren" → Webinardatum Gelände = **Specific Date** = aktuelles Webinardatum (z. B. 23.08.2026).
- → Jede neue Anmeldung bekommt das Datum automatisch. Monatlich hier nur das Datum tauschen.

## 3. Wait-Schritte relativ zum Feld
- Wartetyp „Bis zu bestimmtem Datum/bestimmter Uhrzeit" → Datum = Feld dynamisch: `{{contact.webinardatum_gelaende}}`.
- Feld ist reines Datum = intern 00:00 Uhr. Uhrzeit über den Versatz steuern (Webinar immer 19:00):
  - 14 / 3 / 1 Tag vorher → „Vor diesem Datum": X Tage
  - 3 Std vorher (16:00) → „Nach diesem Datum": 16 Stunden
  - 1 Std vorher (18:00) → „Nach diesem Datum": 18 Stunden
  - Live-Link (19:00) → „Nach diesem Datum": 19 Stunden

## 4. Schutz gegen Spätanmelder (Guard)
- Bei JEDER Datums-Warteaktion unten „Falls dieses Datum bereits verstrichen ist" → **„Überspringen Sie alle Outbound-Kommunikation bis zur nächsten Warteaktion."**
- Wirkung: Ist der Zeitpunkt schon vorbei, wird die zugehörige Mail übersprungen (kein Zuballern). NICHT „mit nächster Aktion fortfahren" (würde die alte Mail sofort senden).

## 5. Bestehende/geparkte Kontakte nachziehen
- Feld nachträglich setzen: kleine Hilfs-Automation (kein Trigger nötig) mit nur „Kontakt aktualisieren = Webinardatum" → veröffentlichen → Kontakte auswählen → „Automatisierung auslösen" → diese Hilfs-Automation.
- Kontakte im Workflow weiterschieben: im Schritt (Aktionsstatistiken) Kontakte auswählen → Button „zum nächsten Schritt" (laufendes Männchen). NUR auf einen Wait-Schritt schieben, NIE direkt auf einen Mail-Schritt (löst die Mail aus).

## Mail-Sequenz (Texte in outputs/webinar-gelaende/)
- mail-1-einladung.md — Erst-Einladung Gesamtliste
- mail-2-geschenk-angemeldete.md — 14 Tage vorher, an Angemeldete (Geschenk-Teaser)
- mail-3-geschenk-nicht-angemeldete.md — an Noch-nicht-Angemeldete (Geschenk + Anmelde-CTA)
- offen: Reminder 3 Tage / 1 Tag vorher, Stunden-Reminder, Live-Link

## Geschenk
- „Koffer voller Notfallstrategien" (27 Strategien) = Live-dabei-Geschenk.
- Dateien: koffer-notfallstrategien.html/.docx, PDF auf Anikas Desktop.
- Bedingung: nur wer live dabei ist; auf Opt-in nur teasern.
