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

## Stand Quiz-Tool (outputs/gelaende-check/quiz.html) — Stand 12.09.2026

Titel „Gelände-Quiz", Intro „In 2 Minuten zu deinem persönlichen Gelände-Fahrplan". Ablauf: Intro → 16 Fragen (eine pro Screen, Auto-Advance, Zurück-Button, Fortschrittsbalken) → Opt-in „Fast geschafft" → Ergebnisseite. Erdtöne, Playfair/Montserrat, mobil. Meta-Pixel 1250685732578298 mit neutralem Lead-Event (EIN Funnel für alle). Pflichtfelder im Opt-in aktuell AUS für die Testphase, vor Livegang wieder AN.

**16 Fragen** als Aussagen (KEINE Verneinungen), Skala Wiedererkennen: „Kenne ich gar nicht / Manchmal / Kenne ich gut / Das ist bei uns Alltag" (0–3). Je 4 Aussagen pro Meilenstein.

**Ergebnis = 4-Bereiche-Profil (kein einzelner Typ):** alle vier Meilensteine als Balken. Balkenlänge = wie gut es läuft (invertiert), Farbe: grün „Schon stark" (Score 0–3), caramel „Ausbaufähig" (4–8), BLUTROT #C0392B „Großer Hebel" (9–12, kurzer Balken). Darunter Satz „Am meisten Potential holst du gerade im Bereich X heraus…" + Erklär-Text je Top-Bereich (ERKLAER im Code). Gleichstand: mehrere Top-Bereiche gleichberechtigt („Deine größten Hebel"). Alles niedrig → „Dein Fazit" (kein Verkauf). Keine Produkt-Buttons auf der Seite. Abschluss: Hinweis „📩 Dein persönlicher Fahrplan liegt schon in deinem Postfach."

Meilensteine: 1 Fundament am Boden (Vertrauen/Kommunikation), 2 Souveräne Führungsperson (Kopfkino), 3 Entspannt vom Hof (auch ohne Pferdekumpel), 4 Souverän draußen (Notfallstrategien/Kontrolle). Meilenstein 5 (Dranbleiben) NICHT als Ergebnis (kein Produkt).

**Vorschau aller Ergebnis-Varianten:** outputs/gelaende-check/vorschau-ergebnisse.html (6 Karten inkl. Gleichstand).

**Ergebnis in der Mail (Konzept, entschieden):** Balken lassen sich in Mails nicht sauber rendern. Lösung zweiteilig: (1) personalisierter Satz per Devine-Platzhalter (größter Hebel als Custom-Field), (2) Button „Kompletten Fahrplan ansehen" → Ergebnisseite, die die Werte aus der URL liest und das Profil neu aufbaut. Diese teilbare Ergebnis-URL ist noch zu bauen.

**Mails:** KEINE getrennten Sequenzen. EINE Auslieferungs-Sequenz für alle (Produkte laufen über Anikas Mails, nicht über die Seite).

**Content-Stand 13.09.2026:** Quiz-Fragen, 4 Erklär-Texte (in Anikas Fassung, mobil-feine Absätze, Gleichstand mit Bereichs-Überschriften), Fazit-Text und alle Ergebnis-Varianten sind inhaltlich FERTIG und abgenommen. Nächster Schritt ist nur noch die Technik.

**Technik-Stand 13.09.2026 (gebaut + getestet):**
- ✅ `results.js` als gemeinsame Ergebnis-Logik (MEILEN, ERKLAER, level, buildProfil). Quiz und Ergebnisseite nutzen sie, damit Texte synchron bleiben.
- ✅ `quiz.html` refaktoriert: nutzt results.js, Pflichtfelder wieder AN, Opt-in schickt Lead per `fetch` an `/.netlify/functions/lead` (fire-and-forget, blockiert das Ergebnis nicht).
- ✅ `ergebnis.html`: teilbare Ergebnisseite, liest `?werte=a-b-c-d&name=` aus der URL, baut das Profil neu (Link für den Mail-Button).
- ✅ `netlify/functions/lead.js`: upsert Kontakt in Devine (`POST /contacts/upsert`), setzt Felder `quiz_hebel` (größter Hebel als Text) und `quiz_ergebnis_url` (voller ergebnis.html-Link, Basis aus Netlify `process.env.URL`). Token aus Netlify-Env `DEVINE_TOKEN`.
- ✅ **Tags für die Workflow-Weiche** (Bereichs-Targeting, z. B. passende Podcastfolgen): `gelaende-quiz` (startet Sequenz) + Bereichs-Tag des größten Hebels: `hebel-fundament`, `hebel-fuehrung`, `hebel-vom-hof`, `hebel-draussen`. Alles stark → `hebel-starkes-team`. Gleichstand → mehrere hebel-Tags. Live getestet.
- ✅ `netlify.toml`: publish=".", functions-Ordner, `/` → quiz.html, freebie-ideen.md nicht ausliefern.
- ✅ Zwei Custom-Fields in Devine angelegt: `quiz_hebel` [XOdJxEUzs4HI42kTiFD8], `quiz_ergebnis_url` [xmfZihq4Fexmm5UY6XGH].
- ✅ Devine-Upsert LIVE getestet (Test-Kontakt angelegt, Felder + Tag korrekt, danach gelöscht). Format bestätigt: customFields als `[{id, value}]`.

**✅ LIVE seit 13.09.2026:** Deployed auf **https://gelaendequiz.netlify.app/** (Netlify, Drag-and-drop). Env-Variable `DEVINE_TOKEN` gesetzt. End-to-End live getestet: echter Lead → Kontakt in Devine mit Tags `gelaende-quiz` + `hebel-vom-hof`, Feldern `quiz_hebel` + `quiz_ergebnis_url` (korrekte Prod-URL), Test-Kontakt gelöscht. Bei Änderungen: Ordner neu auf den Deploys-Tab ziehen (Env-Var-Änderungen brauchen einen Redeploy).

**Double-Opt-in-Architektur (Stand 13.09.2026):**
- **Bestätigungs-Tag = `gelaende-quiz-doi`** (quiz-eigen, NICHT der allgemeine `doi`). Grund: `doi` teilt sich Anika mit anderen Funnels → Auslieferung darf NIE über blankes `doi` starten. Der eigene Tag löst zuverlässig aus, auch bei Kontakten, die schon `doi` haben (kommt immer neu dazu). Regel: Auslieferung nur über `gelaende-quiz-doi`.
- `netlify/functions/confirm.js` setzt beim Bestätigungs-Klick **`gelaende-quiz-doi`** (lokal geändert). ⚠️ **NOCH NICHT DEPLOYED** — die Live-Version auf Netlify setzt noch `doi`. Finaler Deploy kommt, wenn Teil 2 (WF2 + Mails) fertig ist (Anika will nur EINMAL deployen).
- `ergebnis.html` ruft confirm.js beim `?bestaetigen=<contactId>` auf + zeigt „bestätigt"-Banner. `confirm.js` valide/getestet lokal.
- Bestätigungs-Link in der Mail = `{{contact.quiz_ergebnis_url}}&bestaetigen={{contact.id}}`.

**Workflow 1 „Gelände Quiz DOI" (in Devine gebaut):** Trigger `gelaende-quiz` → Wenn/Sonst „Tags enthält `doi`?": JA → Add Tag `gelaende-quiz-doi` → Ende (schon Bestätigte ohne Mail direkt in Auslieferung); NEIN → Bestätigungs-Mail → Wait 24h → Wenn/Sonst „Tags enthält `gelaende-quiz-doi`?": Nein → Reminder-Mail. Bestätigungs- + Reminder-Mail sind getextet und in Devine drin. (Noch veröffentlichen.)

**Offen (Teil 2, dann EIN finaler Deploy):**
- [ ] **Workflow 2 „Auslieferung"**: Trigger „Tag hinzugefügt = `gelaende-quiz-doi`" (KEIN Filter nötig) → Auslieferungs-Mails + Wenn/Dann-Weiche auf `hebel-*`-Tags für bereichsspezifische Podcastfolgen. Merge-Felder `{{contact.quiz_hebel}}` + `{{contact.quiz_ergebnis_url}}`.
- [ ] Auslieferungs-Mails texten (allgemein + 4 bereichsspezifisch). Für die Podcast-Zuordnung braucht Claude Anikas Podcastfolgen-Liste (Titel + Link).
- [ ] **Finaler Netlify-Deploy** (confirm.js → gelaende-quiz-doi) + WF1/WF2 veröffentlichen. Danach End-to-End live testen (neu vs. schon-doi).
- [ ] Danach: Checkliste „Startklar fürs Gelände?" als Freebie Nr. 2.
