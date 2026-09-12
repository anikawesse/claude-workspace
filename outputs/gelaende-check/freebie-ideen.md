# Freebie-Bibliothek Gelände — Ideen & Stand

Stand: 10.09.2026. Ziel: mehrere Freebies am Anfang der Produktleiter, jedes mit eigener kurzer Auslieferungs-Sequenz (ca. 3 Mails), danach alle rein in die Backend-Funnel-Schleife. Ausarbeitung ab morgen.

---

## Ideen-Sammlung

**Diagnose-Freebies (segmentieren)**
- **Der Gelände-Check (Quiz)** — wo stehst du, welche Stufe. Erste Version schon gebaut (siehe unten). Titel-Kandidaten: „Der große Gelände-Check" / „Wie sicher seid ihr im Gelände wirklich?".
- **Angst-Barometer** — „Wie sehr hält dich deine Angst noch zurück?". Enger auf das mentale Thema (Phase-1-Zielgruppe).

**Checklisten und Spickzettel (schnell, teilbar, wenig Arbeit)**
- **Checkliste „Startklar fürs Gelände?"** — Anikas Idee. Konkrete Ja/Nein-Punkte: Equipment, Basis am Boden, Ansprechbarkeit, Hoftor-Übung, Timing. → schnellster Win, Einstieg Stufe 1+2.
- **Notfall-Spickzettel** — eine Seite zum Ausdrucken, 3-Schritte-Strategie (Trecker, Auto) in Kurzform. Beweist die Methode → sicher meistern.
- **Packliste fürs Gelände** — Kappzaum vs. Halfter, Gerte, Longe.

**Vorlagen und Planer**
- **7-Tage-Gelände-Fahrplan** — Mini-Plan vom Hoftor zu den ersten Metern. → Schlüssel/Programm.
- **Selbstvertrauens-Tagebuch** — Erfolgstagebuch-Vorlage aus dem Workbook als eigenes Freebie.

**Besondere Formate**
- **2-Minuten-Ruhe-Audio** — geführte Übung, die die Reiterin vor dem Losgehen herunterfährt. Passt zum mentalen/energetischen Ansatz.
- **5-Tage-vom-Hof-Challenge** — tägliche Mail + kleine Aufgabe. Mehr Aufwand, baut Bindung, verkauft stark.

**Empfehlung als Start:** Checkliste „Startklar fürs Gelände?" (schnellster Win) + das Quiz als Segmentierer.

**Naming-Entscheidung:** Quiz = „Wo stehe ich" (Diagnose, Stufe). Checkliste = „Startklar fürs Gelände?" (Ja/Nein, konkret). Getrennt halten, damit die Titel sich nicht in die Quere kommen.

---

## Stand Quiz-Tool (outputs/gelaende-check/quiz.html)

Erste komplette Version läuft: 10 Fragen (eine pro Screen, Auto-Advance), Fortschrittsbalken, Zurück-Button, E-Mail-Abfrage vor dem Ergebnis, Ergebnisseite mit Skala-Marker + Stufen-Text + CTA. Erdtöne, Playfair/Montserrat, mobil. Meta-Pixel (1250685732578298) mit Lead-Event. UTM-Durchreichung an Produkt-Links.

**Stufen-Logik:** Score 0–30 über 10 Fragen (Nie=0 … Immer=3). 21–30 = Stufe 1 (viel Unsicherheit) → Gelände-Schlüssel (+Programm). 11–20 = Stufe 2 (raus, aber Bauchweh) → Gelände sicher meistern (+Programm). 0–10 = Stufe 3 (starkes Team) → kein Verkauf, Anerkennung.

**Mails:** KEINE drei getrennten Sequenzen. Empfehlung/Produkt steht personalisiert auf der Ergebnisseite + erster Mail. Danach EINE Auslieferungs-Sequenz (2–3 Mails), Stufe 3 sanfter ohne Pitch.

**Offen (morgen / später):**
- [ ] Ergebnis-Texte an Anikas Stimme feilen (aktuell mein Entwurf).
- [ ] 10 Fragen final prüfen (fehlt/zuviel?), Stufen-Grenzen bestätigen.
- [ ] Echte Produkt-Links in den `LINKS`-Block oben im Code (schluessel, sicher, programm).
- [ ] Devine-Anbindung: Netlify-Funktion → Kontakt anlegen, Tag `stufe-1/2/3`, Auslieferungs-Sequenz starten.
- [ ] Auf Netlify deployen (Gratis-Tarif wie Futterrechner/Content-Maschine).
