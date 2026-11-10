# Wissen der Stelle (aus der Memory umgezogen am 06.11.2026)

Diese Einträge standen vorher einzeln in der Memory. Inhalt 1:1 übernommen. Neue Learnings für diesen Bereich hier unten ergänzen, nicht mehr in der Memory.

---

## Karussell aus Yapping bauen

Anika fügt Yapping-Slides (1 Satz/Slide) + Caption in den Chat; Claude baut daraus ein Instagram-Karussell in Canva.

**Vorlage:** „Vorlage Karussell 2b" design_id `DAHH3H4q7ww` (7 Seiten, 1080×1080; je Seite: Vollbild-Rect, weiße Box opacity 0.69, zentrierter Bold-Text). Für mehr Seiten: copy-design → merge-designs `insert_pages` (nur EINE Operation pro Call, Quelle = Vorlage, ggf. mehrfach; 20 Seiten = 7+7+6).

**Fertige/WIP-Karussells → Ordner „Karussell-Posts 2026" `FAHHwXqmOq8`** (NICHT „Gepostet" FAHH3CLTD4Q — das ist nur für echt Gepostetes).

**Ein Bild pro Post** (nicht pro Slide), pro Karussell ein anderes Portrait aus Canva-Ordner „Portrait" FAHHwcdOCXM. „mache einfach" = Claude wählt selbst.
- Landscape-Bilder (z.B. MAG13UeqqDY, MAG17wSzsqY) sitzen mit Default-Crop gut → kein crop_media nötig.
- Hochformat, bei dem der Kopf oben abgeschnitten wird (z.B. MAG1ZaOrxes): crop nach unten schieben, bewährt top −117.1002132211, left −19.2857142857, width 1282.0850600912, height 1924.3302965721. Slide 1 bauen, Thumbnail prüfen, Crop dann auf alle Slides übernehmen. Anika will Slide-1-Crop selbst justieren können, wenn sie da ist.

**Box-Fit (Option A, sauber, zentriert bei y≈744):** pro Seite 3 edit-design-Calls, deterministisch (Zeilenanzahl NICHT vorhersagbar — gleiche Zeichenzahl bricht mal 3, mal 4 Zeilen):
1. Discovery: `replace_text` mit bogus locator_id „probe" → schlägt fehl, liefert aber page-document mit echten locator_ids. Locators MÜSSEN page-präfigiert sein (`PageID-ElementID`).
2. `update_fill` (Bild) + `replace_text` (echte H auslesen). Vorlage-Seiten 1–7 haben über alle Kopien DIESELBEN locator_ids → Discovery für 3–7 sparbar; merge-eingefügte Seiten ab 8 haben neue IDs → Discovery nötig.
3. Box-Fit aus echter Text-Höhe H: box height = H+80, box top = 744−(H+80)/2, text top = 744−H/2, box left 30/width 1020, text left 60. H je Zeilen: 1→50.47 (box130/top679/text719), 2→109.47 (box189/649/689), 3→168.47 (box248/620/660), 4→227.47 (box307/590/630), 5→286.47 (box366/561/601).

Titel via `update_title` auf Seite 1. Am Ende `finalize:commit`, dann move-item-to-folder.

24.09.2026: 5 heute gequeuete Karussells fertig in Karussell-Posts 2026 → Vertrauen(12) DAHWHHHLc6U, Aufmerksamkeit/Verlasspferd(11) DAHWHQt4G1M, Aufsteigen(12) DAHWHbyiMi4, Angst über 50(20) DAHWHqjrmG4, Fels/Verlasspferd-Sarina(15) DAHWH7eC2dQ. Captions liefert Anika mit; siehe [[feedback_carousel_posts]], [[feedback_code_in_zwischenablage]], [[reference_yapping_anika_muster]].

25.09.2026: 5 weitere fertig in Karussell-Posts 2026 → Wohlfühlen erkennen(8) DAHWLrmM6z8 Bild MAG0jCVfJvs / 2 Übungen Quiz(14) DAHWLh-ouUU Bild MAG13UeqqDY (Bild von Anika selbst korrigiert) / Angst ansprechen Reitlehrerin(16) DAHWL36PkJs Bild MAGxu0r7dYY / Gelände-Runde vorbereiten(16) DAHWMRwc3x8 Bild MAG17lGm5Ko / Überforderung erkennen(16) DAHWMVBqqK4 Bild MAGRL4aoB8I. ⚠️ Anika-Regel: NICHT die gleichen Bilder wie am Vortag nehmen → jeden Tag frische Landscape-Portraits aus Ordner „Portrait". Erledigt-Bilder gestern: MAG17wSzsqY, MAG1vyNoXbY, MAG1ZUPK9x4, MAG1ZaOrxes.

27.10.2026 (Morgen): 7 Karussells automatisch fertig + 1 manuell → Gelände-keinen-Schritt/Quiz(14) DAHZNerLPno Bild MAG13UeqqDY / Stur-oder-Angst/Schlüssel(12) DAHZNroVcZ4 Bild MAG17lGm5Ko / Führung-ohne-Dominanz/Verlasspferd(13) DAHZNno52LA Bild MAG0jCVfJvs / Muskelaufbau-Boden/Quiz(13) DAHZNqgOiNA Bild MAG17wSzsqY / Betteln-Leckerli/Keks(12) DAHZNsvLNfM Bild MAGRL4aoB8I / Vertraut-Pferd-Anderen/Schlüssel(11) DAHZNiXVbuA Bild MAGl7wuNwHc / Stress-Ausreiten/Quiz(13) DAHZNuFeeK0 Bild MAHZNp4_x9w. ⚠️ Letztes (Losreißen-Angst/Quiz, 17 Slides, DAHZNrT5UNs, Vorgesehen MAHZNpdzmRQ) hat Anika manuell abgeschlossen — Transaction war durch Pause abgelaufen. ⚠️ Anika-Hinweis 27.10.: Bilder stärker variieren — nicht mehrere Posts hintereinander mit demselben Bild. **Je Karussell-Batch ein neues Portrait wählen** und per Session im Kopf behalten, welche schon dran waren. Anika hat am 27.10. 10 neue Pferd-Bilder (MAHZN*, P1184xxx) in den Ordner geladen — Vorrat erweitert.

27.10.2026 (Nachmittag, 7 weitere): Alle in Karussell-Posts 2026, alle MAHZN*-Pferd-Landscape-Bilder (neu von Anika hochgeladen), jedes Karussell anderes Bild → Webinar-Spaziergang-Entfernung(14) DAHZO5Tojvw Bild MAHZNhta2sA / Webinar-Reitergruppe-entgegen(13) DAHZO-GtBh4 Bild MAHZNoWjodc / Webinar-Gruselecke(10) DAHZOxbSZE8 Bild MAHZNvkvaIE / Videotraining-Panik-Ausritt(12) DAHZO7WC5Wc Bild MAHZNuu0LF0 / Pferd-rennt-weg(11, follow-CTA) DAHZOyyJbqU Bild MAHZNs7LNrQ / Masterclass-Trageerschöpfung(10) DAHZO-XY0hA Bild MAHZNgkiBVg / Kappzaum-Bodenarbeit(12) DAHZO6l4rZc Bild MAHZNppE3Ns. ⚠️ Workflow 2.0 bewährt: alle 7 Vorlagen parallel kopieren → alle merge-designs parallel → alle move-to-folder parallel → pro Karussell: read-design mit open_transaction:true + fields:["design_content"] für ALLE Seiten gleichzeitig (nicht nur Seite 1) → alle Content-Ops parallel → alle Position-Ops parallel → commit. Spart massiv Zeit vs. sequenziell.

⚠️ Lesson 27.10.: Edit-Transactions laufen ab, wenn der Workflow länger pausiert (Nachrichtenlimit, Unterbrechung). Bei langen Karussells (≥14 Slides) **lieber in Batches committen**: alle 7-8 Slides einmal committen + neue Transaction öffnen, statt eine Transaction über alle Slides offen zu halten.

⚠️ Ähnlichkeits-Fallen (27.10.26): MAG0jCVfJvs und MAGxu0r7dYY sind beide „Anika mit SCHIMMEL" und wirken gleich — nicht beide im selben Batch nehmen. Auch MAG17lGm5Ko (Fuchspony, Anika kniet) und MAG13UeqqDY (schwarzes Pferd nah dran) sind klar getrennt. Faustregel: Pferdefarbe + Kulisse (Hof/Wiese/Stall) als Unterscheidungsmerkmal nehmen, nicht nur die Datei-ID.

⚠️ WICHTIG Bild-Auswahl: Der professionelle Pferde-Landscape-Pool (P118er-Serie) war am 25.09. erschöpft. Die NEUESTEN Uploads im Portrait-Ordner (MAHMdE6SAZY/MAHMdAxw88U/MAHMJhSzzuc, DSC-Namen) sind POOL-/Studio-Porträts OHNE Pferd → passen NICHT für Gelände-Karussells. Frische Pferde-Fotos stattdessen aus der älteren P1156er-Serie (z.B. MAGRL4aoB8I = Anika mit schwarzem Pferd, Landscape, sitzt mit Default-Crop). Immer Slide 1 prüfen, ob Pferd + professioneller Look passt.

⚠️ 16-Seiten-Bauweise mit merge-designs: type=modify_existing_design, design_id, operations=[{type:"insert_pages", source:{type:"design", design_id, page_indices:[...]}, insert_at_index:N}]. ⚠️ Bug am 25.09.: zweiter insert mit page_indices [1,2] fügte trotzdem 7 Seiten ein (→21). Fix: {type:"delete_pages", page_numbers:[17,18,19,20,21]}. Also nach jedem Merge page_count prüfen und ggf. überzählige löschen.

---

## Karussell-Post Präferenzen

Kein Logo auf Instagram/Facebook Karussell-Posts.

**Why:** Anika möchte das nicht — Posts sollen ohne Logo-Branding auskommen.

**How to apply:** Bei jeder Karussell-Erstellung kein Logo einbauen, auch wenn Brand Kit vorhanden.

---

Slide-Anzahl variieren — nicht immer gleich viele Slides pro Karussell.

**Why:** Mehr Slides = mehr Lesezeit = besserer Algorithmus-Reach (aktuelle Empfehlung).

**How to apply:** Mal 7, mal 10, mal 12 Slides — bewusst variieren je nach Thema und Tiefe.

---

Letzter Slide IMMER mit ManyChat-Codewort als CTA.

**Why:** Löst ManyChat-Automation aus — direkte Lead-Generierung über Kommentare.

**How to apply:** CTA-Slide immer mit Aufforderung "Schreib mir das Wort XYZ in die Kommentare" — Codewort kommt aus Anikas ManyChat-Übersicht (noch ausständig).

---

Stil: Warm, Erdtöne — orientiert an Homepage anikas-pferdeakademie.de und Logo-Farben.
Plattformen: Instagram + Facebook-Gruppe (Format: 1:1 Quadrat, 1080×1080px).

---

### Design-Varianten (bewusst abwechseln, nie zweimal hintereinander gleich)

**Variante 1 — Grafischer Hintergrund**
Einfarbig oder dezentes Muster, Erdtöne/Natur. Nur Typografie, kein Foto.

**Variante 2a — Bild + dunkles Overlay**
Foto als Hintergrund → schwarzes Rechteck halbtransparent → weiße Schrift

**Variante 2b — Bild + weißes Textfeld**
Foto normal → weißes Rechteck als Textfeld → schwarze Schrift

**Bild-Layout A — Ein Bild für alle Slides**
Gleiches Foto auf jeder Slide, Text wechselt.

**Bild-Layout B — Zwei Bilder pro Karussell**
Slide 1 = Bild A (Hook), Slides 2–Ende = Bild B (einheitlich).

Bildquelle und Canva-Ablageordner: noch zu definieren (gemeinsam festgelegt).

---

### Learnings aus Karussell-Produktion April 2026 (Woche Mo–Fr)

**CTA-Codewort-Farbe (manuell):**
Nur das Codewort auf der letzten Slide soll in Dunkelrot (#691212) sein, restlicher Text schwarz. Die Canva-API kann nicht einzelne Wörter in einem Textblock einfärben → Anika macht das manuell in Canva (5 Sekunden pro Post).

**CTA-Slide: Codewort immer in Anführungszeichen + Erklärung was passiert:**
Das Codewort muss in Anführungszeichen gesetzt werden, z.B. „MUSKELN". Außerdem muss der CTA erklären, was nach dem Kommentieren passiert — die Leserinnen müssen wissen, was sie bekommen. Beispiel: „Schreib „MUSKELN" in die Kommentare und ich schicke dir den Link zum [Angebot] direkt per Nachricht."

**Textfeld-Position beim 2b-Template:**
Anika bevorzugt das weiße Textfeld TIEFER (y=600), nicht hochgeschoben (y=500). Das Foto kommt besser zur Geltung, wenn der Text im unteren Bereich bleibt.

**Weißes Textfeld (2b-Template) — horizontale Ausrichtung KRITISCH:**
SHAPE (weiße Box) und TEXT-Element müssen exakt gleiche horizontale Position haben. Häufiger Fehler: SHAPE hat left≠60 und width≠960, während TEXT immer left=60, width=960 hat → Text steht außerhalb der Box. Fix: SHAPE immer auf left=60, width=960 setzen (= identisch mit TEXT-Element). Höhe = (text_top - shape_top) + text_height + 35px Puffer unten.

**Bildausschnitt/Kopf-Probleme:**
Claude kann NICHT erkennen ob Anika's Kopf in einem Foto abgeschnitten ist (keine Bildinhaltsanalyse möglich, nur Thumbnails). Lösung: Nur Fotos aus einer von Anika vorab geprüften "Safe Photo List" verwenden. Liste muss aufgebaut werden. Bis dahin: Fotos bevorzugen die laut Dateiname oder Beschreibung als Portrait/Halbkörper gekennzeichnet sind.

**BBP/MASTERCLASS Hook-Richtung:**
Hook darf NICHT sagen "Ich trainiere keine Pferde" — Anika trainiert Pferde, sie tut es nur mit Fokus auf gesunden Aufbau. Korrekte Richtung: Training UND Aufbau als Einheit. Gute Formulierungen: "Ich trainiere Pferde. Aber ich trainiere sie stark – nicht kaputt." oder "Trainieren kann jeder. Aufbauen ist die Kunst."

**Texte der KW-Posts werden oft manuell nachgearbeitet:**
Anika überarbeitet Texte nach der KI-Erstellung gerne selbst (eigene Sprache, eigene Erfahrungen). Das ist normal und erwünscht. Claude liefert die Struktur und Grundtexte, Anika verfeinert.

**Themen-Zuordnung — NIEMALS fremde Content-Bibliotheken verwenden:**
Jedes Programm (BBP, Traumteam, Offenstall etc.) hat seinen eigenen Inhalt. NIEMALS BBP-Hooks für Traumteam-Posts verwenden und umgekehrt. Wenn für ein geplantes Thema keine Inhalte vorhanden sind (z.B. Offenstall) → Anika FRAGEN, bevor man auf andere Themen ausweicht.

**Variante 1 — Grafischer Hintergrund (Template 1a–1e):**
Für Variante-1-Posts die Vorlagen 1a, 1b, 1c, 1d, 1e aus dem Vorlagen-Ordner (FAHH3L97DGA) verwenden. Nicht eine eigene Lösung mit Foto + Overlay bauen. Die 5 Vorlagen (Design-IDs: DAHH3FodioI, DAHH3KspiFQ, DAHH3GM2XfA, DAHH3MUToqc, DAHH3O72kjA) abwechseln — nie zweimal hintereinander dieselbe.

**Foto-Auswahl — themenpassende Bilder:**
Nicht immer aus dem Portrait-Ordner nehmen. Zum Thema Offenstall → Stall-/Offenstall-Fotos. Zum Thema Beziehung/Vertrauen → emotionale Mensch-Pferd-Fotos. Thema bestimmt die Bildauswahl.

---

### CTA-Überleitung: Logische Brücke zum letzten Slide

**Why:** Ein abrupter CTA ohne Überleitung wirkt aufgesetzt. Die Leserin muss spüren, warum jetzt der richtige Moment ist, das Codewort zu schreiben.

**How to apply:** Vorletzter Slide (S6) muss eine logische Brücke zum CTA bauen — entweder eine Zusammenfassung ("Das ist der erste Schritt"), eine offene Frage ("Wo stehst du gerade?") oder ein Angebot ("Genau dafür habe ich..."). Der CTA-Slide (S7) greift das dann auf. Kein harter Schnitt von Inhalt → "Schreib XYZ".

Beispiel-Überleitung S6: "Wenn du weißt, wo bei dir und deinem Pferd der Hebel liegt, ändert sich alles."
Dann S7: "Schreib „CHECK" in die Kommentare — und ich schicke dir den Beziehungs-Check direkt per Nachricht."

---

### Schreibstil: Immer konkrete Situation, nie abstrakte Aussagen

**Why:** Abstrakte Identitäts-Aussagen wie "Du willst nicht die sein, die sich im Stall klein fühlt" erzeugen kein inneres Bild. Konkrete Situationen treffen sofort.

**How to apply:** Jeder Post muss sich auf eine einzige, spezifische, visuelle Situation beziehen, die die Leserin sofort vor Augen hat. Keine allgemeinen Umschreibungen.

Beispiele für konkrete Situationen:
- "Dein Pferd bleibt an der Stalleinfahrt stehen. Alle anderen reiten los."
- "Der Hufschmied kommt. Dein Pferd macht Theater. Er schaut dich an."
- "Du willst ins Gelände. Dein Pferd dreht einfach um."
- "Du sitzt 20 Minuten oben. Alle traben vorbei. Du kriegst keinen Trab raus."

Die Content-Bibliothek (context/content-traumteam.md, context/content-bbp.md) enthält Rohmaterial — nicht alles ist direkt verwendbar. Immer in konkrete Szenen übersetzen.

---

## Karussell "Why I Love This Woman"

### Karussell-Struktur "Why I Love Working With This Woman"

Anikas finale Umsetzung des Mentorin-Hooks "Ich liebe es mit Frauen zu arbeiten die...". Diese 8-Slide-Struktur und der Wording-Stil sollen als Vorlage für ähnliche Identitäts-Posts dienen.

### 8-Slide-Aufbau

| Slide | Funktion | Beispiel-Wording (Gelände-Schlüssel) |
|---|---|---|
| 1 | **Hook** — Traumkundin definieren | "Ich liebe es mit Freizeitreiterinnen zu arbeiten, die ihr Pferd zu sehr lieben, um es mit viel Druck zu etwas zu zwingen." |
| 2 | **Was ihr wichtig ist** + was sie schon tut (Identifikation) | "Ihr ist es extrem wichtig, ihr Pferd zu verstehen und Vertrauen aufzubauen. Deshalb sammelt sie Wissen in Podcastfolgen, Videos und Büchern." |
| 3 | **Aber-Wendung** — Selbstzweifel (Pain) | "Trotzdem zweifelt sie manchmal, ob sie die 'Richtige' für ihr Pferd ist." |
| 4 | **Reframe** — was ihr wirklich fehlt | "Dabei fehlt ihr eigentlich nur ein klarer Plan, wie sie mit ihrem Pferd ein unschlagbares Team wird." |
| 5 | **Versprechen** — die Transformation | "Hat sie diesen roten Faden, kann sie auf einmal alleine mit ihrem Pferd ins Gelände gehen. Auch ohne Pferdekumpel." |
| 6 | **Hook-Verstärkung** — Liebeserklärung mit neuer Eigenschaft | "Ich liebe diesen Typ Frau. Sie setzt einfach um und sucht nicht mehr weiter nach Ausreden." |
| 7 | **Anikas Perspektive** — was sie als Trainerin erlebt | "Und dann kann ich ihr förmlich zusehen, wie sie immer selbstbewusster wird und ihr Pferd sie immer mehr als Sicherheitsanker sieht." |
| 8 | **CTA mit Codewort** — greift Bild aus Slide 5 wieder auf | "Möchtest du auch zu diesen starken Frauen gehören? Tippe 'Verlasspferd' in die Kommentare und ich schicke dir deinen roten Faden dafür zu." |

### Wording-Regeln (Anikas Stil)

- Nische statt "Frauen" verwenden → "Freizeitreiterinnen" (zielgruppenspezifisch)
- Methode konkret benennen → "mit viel Druck zu etwas zu zwingen" (nicht abstrakt)
- Persönliche Bewertung einbauen → "Ihr ist es extrem wichtig"
- Konkrete Beispiele für Verhalten → "Podcastfolgen, Videos und Büchern"
- Emotionale Identitätsfrage mit Anführungszeichen → "die 'Richtige'"
- Starke Bilder/Metaphern → "klarer Plan", "unschlagbares Team", "roter Faden", "Sicherheitsanker"
- Kurzer Schlusssatz als Punch → "Auch ohne Pferdekumpel."
- Hook-Verstärkung Slide 6 mit "Ich liebe diesen Typ Frau" + zweite Eigenschaft
- Slide 7 wechselt zur Anika-Perspektive ("Und dann kann ich ihr förmlich zusehen...")
- CTA greift ein Bild aus früherem Slide auf (semantische Klammer, z.B. "roter Faden")

### Grafische Darstellung

- **Format:** 1080×1080 (Karussell)
- **Hintergrund:** EIN einheitliches Foto auf allen Slides (Anika mit Pferd)
- **Overlay:** Dunkles Overlay über dem Foto für Lesbarkeit
- **Text:** Weiß, fett, zentriert
- **Logo:** Kein Logo (siehe [[feedback-carousel-posts]])

### Anwendungs-Logik (Template)

Diese Struktur funktioniert für jede Zielgruppe/jedes Angebot:
- Slide 1: "Ich liebe es mit [Nische] zu arbeiten, die [auffälliges Merkmal + Methode]"
- Slide 2: "Ihr ist [Wert] wichtig. Deshalb [konkretes Verhalten]"
- Slide 3: "Trotzdem zweifelt sie an [Identitäts-Punkt]"
- Slide 4: "Dabei fehlt ihr nur [Reframe → was wirklich fehlt]"
- Slide 5: "Hat sie das, kann sie [Transformation]. [Punch-Satz]"
- Slide 6: "Ich liebe diesen Typ Frau. Sie [zweite anziehende Eigenschaft]."
- Slide 7: "Und dann kann ich ihr förmlich zusehen, wie sie [innere Entwicklung] und [Beziehungs-Veränderung zu Pferd/Ergebnis]."
- Slide 8: "Möchtest du auch zu [diesen Frauen] gehören? Tippe '[CODEWORT]' in die Kommentare und ich schicke dir [versprochener Mehrwert mit Bild aus Slide 5] zu."

### Codewort-Zuordnung

CTA-Codewort thematisch passend zum Post wählen (siehe [[project-manychat]]):
- Angst / Unsicherheit / Vertrauen / Gelände → **VERLASSPFERD** (führt zum **kostenlosen Videotraining / Auto-Webinar**, das dann den Gelände-Schlüssel verkauft — NICHT direkt auf die Kurs-Salespage)
- Notfall-Paket (€27) direkt → **GELÄNDE** (anderes Codewort, anderes Angebot)

Wichtig: "Verlasspferd" und "Gelände" sind ZWEI verschiedene Codewörter mit zwei verschiedenen Funnels. Bei Karussell-Posts rund um die Verlasspferd-Methode immer VERLASSPFERD verwenden, damit die Lead-Journey über das kostenlose Videotraining läuft.

### Caption-Stil (Insta + FB)

Die Caption verstärkt und vertieft das Karussell, ohne es zu wiederholen. Anikas Caption-Stil aus dem finalen Post:

**Einstieg:**
- "Ehrlich?" als persönlicher Hook
- "Ich könnte stundenlang über [meine 'Lieblings-Nische']..." (NICHT "diesen Typ Frau" — wärmer, possessiver)
- Beispiel: "über diese 'meine' Lieblings-Freizeitreiterin schreiben"

**Existentielle Selbstzweifel wörtlich zitieren:**
- Nicht nur situativ ("heute klappt das wieder nicht")
- Sondern identitär: "Werde ich ihm wirklich gerecht? Bin ich die Richtige für ihn?"

**Vorurteile reframen mit "nicht ZU ...":**
- "Diese Frau ist nicht zu sensibel oder zu schwach, um sich mal richtig durchzusetzen."
- Adressiert pferdetypische Stallhof-Vorwürfe direkt

**Positiven Wunsch explizit machen (nicht nur Negativ-Abgrenzung):**
- Nach "zu sehr liebt, um zu zwingen" UNBEDINGT folgen lassen:
- "Sie möchte ein tiefes Vertrauen und eine echte Bindung aufbauen."

**Reframe "der richtige Weg":**
- "Weil sie nicht den schnellsten Weg geht, sondern den richtigen." (Superlativ "schnellsten")

**Umsetzungs-Mentalität betonen statt Szene auszumalen:**
- Nicht: "Dann geht sie alleine los, mit Pferd, ohne Bauchschmerzen..."
- Sondern: "Dann ist sie nicht mehr aufzuhalten und setzt fleißig um, was man ihr zeigt."

**"hätte sein können" (Konjunktiv) statt "sein könnte":**
- "Ihr Pferd wird zu dem Verlasspferd, das es schon längst hätte sein können."
- Weicher, schicksalhafter Klang

**Vor dem CTA nochmal qualifizieren:**
- "Wenn bei dir auch der Wille da ist, mit deinem Pferd ein unschlagbares Team zu werden, aber der rote Faden fehlt."
- Greift Schlüsselbilder aus dem Karussell wieder auf

**CTA-Schlusssatz:**
- "Tippe '[CODEWORT]' in die Kommentare und ich schick dir [Mehrwert] mit dem genauen Weg dorthin."
- KEINE Signatur, KEIN Emoji am Ende — Caption endet mit dem CTA

Siehe auch: [[feedback-carousel-posts]], [[reference-big-idea]], [[project-manychat]], [[feedback-kein-bindestrich-vor-und]]

---

## Karussell "Before You Work With Me"

### Karussell-Struktur "Before You Work With Me"

Anikas finale Umsetzung des Mentorin-Hooks "Bevor du mit mir arbeitest, gibt es ein paar Dinge die du wissen solltest". Polarisierender Identitäts-Post, filtert Wunschkundin und falsche Kundin in einem Rutsch.

### 8-Slide-Aufbau

| Slide | Funktion | Beispiel-Wording (Anika) |
|---|---|---|
| 1 | **Hook** — Einladung zur Ehrlichkeit | "Bevor du mit mir arbeitest, gibt es ein paar Dinge, die du wissen solltest." |
| 2 | **Glaubenssatz NICHT** (Anti-Mainstream) | "Ich glaube nicht daran, dass man Pferden dominant zeigen muss 'wer hier der Chef ist'." |
| 3 | **Wie ich arbeite** (anders) + Proof-Statistik | "Ich unterstütze dich ausschließlich online mit Kursen und persönlichem Feedback. Und 93% meiner Schülerinnen haben damit schneller Erfolg als früher im Vor-Ort Unterricht." |
| 4 | **Was Kunden NICHT erwarten** (Charakter) | "Wenn du nicht umsetzt, bekommst du von mir einen liebevollen Tritt in den Allerwertesten." |
| 5 | **Glaubenssatz JA** (positive Überzeugung) | "Ich glaube daran, dass jedes Pferd ein Verlasspferd werden kann. Wirklich jedes." |
| 6 | **Vulnerable Story** (eigene Pain) | "Ich habe selbst mal vor einem Pferd auf dem Boden gesessen und geheult, weil ich alleine kaum vom Hof gekommen bin." |
| 7 | **Authority / Heute** (Transformation + Proof) | "Heute habe ich 500+ Pferd-Mensch-Teams trainiert und ihnen mit der Verlasspferd-Methode geholfen, entspannt ins Gelände zu gehen." |
| 8 | **CTA** — Saison-Trigger + Codewort | "Neugierig auf die Verlasspferd-Methode? Denn schließlich willst du diesen Sommer noch das Gelände genießen? Kommentiere mit 'Videotraining' und ich zeige dir kostenlos den genauen Weg dorthin." |

### Format-Unterschiede zum "Why I Love"-Karussell

Anderer Look — bewusst gewählt für persönlicheren Ton:

| Element | "Why I Love" | "Before You Work With Me" |
|---|---|---|
| Hintergrund | Foto mit Pferd, dunkles Overlay | **Selfie** (Talking-Head-artig), unverändert |
| Textbox | Direkt auf Foto | **Weiße abgerundete Textbox** mit schwarzem Text |
| Text-Farbe | Weiß, fett, zentriert | Schwarz, fett, zentriert |
| Stimmung | Anziehend, romantisch | **Persönlich, ehrlich, augenkontaktreich** |

### Wording-Patterns (für ähnliche Posts wiederverwendbar)

- **Anti-Glaube formulieren:** "Ich glaube nicht daran, dass [Mainstream-Aussage in Anführungszeichen wenn umgangssprachlich]"
- **Methode konkret + Proof in einem Satz:** "Ich arbeite [Methode]. Und [konkrete Statistik] meiner Schülerinnen [Resultat]."
- **Charakter mit warmer Härte:** "Wenn du [Verhalten], bekommst du von mir [Konsequenz mit weichem Bild]" — z.B. "liebevoller Tritt in den Allerwertesten"
- **Positiv-Glaube als Wiederholungs-Satz:** "Ich glaube daran, dass [Aussage]. [Verstärkung]." — z.B. "Wirklich jedes."
- **Vulnerable Story als 1 Satz:** "Ich habe selbst mal [konkrete Szene mit körperlichem Detail], weil [eigene Pain]." — Körperlichkeit (auf dem Boden, geheult) macht es real
- **Authority mit Methoden-Namen:** "Heute habe ich [Zahl] [Zielgruppe] trainiert und ihnen mit [Methoden-Name] geholfen, [Resultat]."
- **CTA mit Saison-Trigger:** "Denn schließlich willst du diesen [Saison] noch [Versprechen]?"
- **Codewort-Anweisung:** "Kommentiere mit '[CODEWORT]' und ich zeige dir kostenlos [Mehrwert]."

### Anwendungs-Template

Diese Struktur funktioniert für jeden Personal-Brand-Identitäts-Post:

- Slide 1: "Bevor du mit mir arbeitest, gibt es ein paar Dinge, die du wissen solltest."
- Slide 2: "Ich glaube nicht daran, dass [Anti-Mainstream-Position]."
- Slide 3: "Ich arbeite [Setup]. Und [Proof-Statistik]."
- Slide 4: "Wenn du [Verhalten], bekommst du von mir [warm-harte Konsequenz]."
- Slide 5: "Ich glaube daran, dass [positive Überzeugung]. [Verstärkung]."
- Slide 6: "Ich habe selbst mal [vulnerable konkrete Szene]."
- Slide 7: "Heute habe ich [Authority-Proof] mit [Methode]."
- Slide 8: "Neugierig auf [Methode]? [Saison-Trigger]? Kommentiere mit '[CODEWORT]' und ich zeige dir kostenlos den genauen Weg."

Siehe auch: [[reference-anika-positionen]], [[reference-karussell-traumkundin-struktur]], [[project-manychat]], [[feedback-carousel-posts]]

---

## Caption-Stil (Insta+FB)

### Anikas Caption-Stil

Diese Regeln gelten für alle Insta-/FB-Captions, unabhängig vom Post-Format (Karussell, Reel, Talking-Head).

### Instagram-Zeichenlimit (WICHTIG, immer prüfen)

Instagram schneidet Captions nach **2.200 Zeichen** (inkl. Leerzeichen und Emojis) ab. Wer darüber liegt, verliert den Rest inklusive CTA.

**Regel:** JEDE Caption vor der Auslieferung mit `wc -m` prüfen. Ziel unter 2.150 Zeichen mit Puffer. Bei Überschreitung durch Wortverdichtung kürzen, NICHT durch Fragmente.

### Caption-CTA (Anfang)

- **👉🏻** als bevorzugtes Emoji für den CTA-Anker oben (nicht 👇, 🔽 oder ➡️)
- **Konkretes Nutzen-Versprechen im CTA:** "Wenn du die Details zu den Schritten willst" — greifbar statt "diesen Weg mit mir gehen" (vage Reise-Rhetorik)
- **CTA oben mit ZAHL + greifbarem Ergebnis** (NEU):
  - ✅ "mit welchen 3 Schritten du deine Angst in den Griff bekommst"
  - ✅ "die 3 Grundlagen für ein Verlasspferd"
  - ❌ "wie du deiner Angst begegnest, ohne dich innerlich zusammenreißen zu müssen" (poetisch, zu abstrakt)
  - Zahl (3 Schritte, 5 Bausteine) + konkreter Nutzen ("in den Griff bekommen", "verlässlich stehen") ist immer stärker als eine schöne Umschreibung.

### Wording-Do's und Don'ts (Anikas exakte Formulierungen)

- ✅ "vorwärts treiben" — bei konkreten Situationen am Hoftor oder beim Losgehen (spezifischer als "Druck machen")
- ✅ "auf dem Weg vom Hof ins Gelände" — präziser als "am Hoftor" für das Kernthema (Bewegung, nicht Ort)
- ✅ "Sondern bei dir" (Aussagesatz mit "Sondern"-Start) — direkter als "Es fängt bei dir an"
- ✅ "Druck machen" — ❌ NICHT "drängen"
- ✅ "eine Übung machen" — ❌ NICHT "eine Übung holen" (kein Deutsch)
- ✅ "wie der Fels in der Brandung" — Anikas etabliertes Bild
- ✅ "leicht fällt" — für Übungen, die Pferde können ("vom Leichten zum Schweren")
- ✅ "Nein-Modus" (mit Anführungszeichen) — für inneres Verhalten des Pferdes
- ✅ "Sicherheitsanker" — Kernbegriff für Verlasspferd-Methode
- ✅ "erprobte Verlasspferd-Methode" — mit "erprobt" als Vertrauens-Adjektiv
- ✅ Innere Gedanken der Wunschkundin wörtlich zitieren ("Das wird wohl auch nichts mehr mit uns.")

### Von Anika gelieferte Captions bleiben WORTGLEICH (NEU 27.08.26, sehr wichtig)

Wenn Anika einen fertigen Caption-Text liefert, wird er **Wort für Wort und Abstand für Abstand** übernommen: keine Punkt-Trenner einfügen, keine Absätze zusammenfassen, keine Verdichtungen ohne Rückfrage. Ihre kurzen Textblöcke sind Absicht (zusammengefügte Blöcke muss sie wieder teilen). Erlaubt sind nur: offensichtliche Tippfehler korrigieren und explizit vereinbarte Ergänzungen (z.B. Folge-Zeile oben). Verwandt: [[feedback-code-immer-speichern]].

### Layout-Patterns

- **Punkte als Absatz-Trenner:** Anika setzt einen einzelnen Punkt "." in einer Leerzeile, um Absätze sauber zu trennen (verhindert, dass Instagram/Facebook die Leerzeilen kollabiert). Pattern auf BEIDEN Plattformen sinnvoll.
- **"Im Post"** statt "Im Karussell" — plattform-neutral, funktioniert für Insta + FB gleich
- **Caption = FB-Gruppen-Text möglich:** Anika nutzt oft eine einzige Caption-Version sowohl für Insta als auch für die FB-Gruppe (Slide 1 als Bild + Caption als Text). Statt zwei separate Versionen lieber EINE Kombi-Caption schreiben, wenn der Workflow effizient sein soll.
- **Vollintegrierte Kombi-Caption (NEU):** Bei Mentorin-Format-Posts integriert Anika die Karussell-Slide-Inhalte DIREKT in die Caption (Hook + alle Schmerzpunkte + Reframe). Plus Mehrwert-Caption-Brücke (z.B. "Ein Teil von dir fragt sich..."). Vorteil: FB-Leser, die nur das Bild sehen, bekommen ALLES im Text.
- **Trenn-Punkte (.) zwischen JEDEM Absatz**, auch zwischen einzelnen Schmerzpunkten in Listen — konsequent durchziehen.
- **Emoji nach JEDEM Schmerzpunkt zusätzlich zur 🙈-Listen-Markierung:** z.B. 😥 (Trauer/Kloß im Hals), 🐴 (Pferd-Anker), 💪🏻 (Stärke).
- **Optional warmer Mehrwert-Abschluss:** Bei reinen Mehrwert-Posts kann der Mail-Abschluss "Genieße die Zeit mit deinem Pferd. / Deine Anika" auch in der Caption verwendet werden (NICHT bei Verkaufs-/Identitäts-Posts).
- **Bullet-Listen mit Emoji-Ankern SIND OK** bei konkreten Schmerzpunkten (z.B. 🙈 vor jedem Punkt). Voraussetzung: konkrete, wahrhaftige Schmerzpunkte (NICHT abstrakt). Bei abstrakten/vagen Aussagen weiterhin Fließtext.

### Konkretisierung-Regel (sehr wichtig)

**Anika konkretisiert ALLES, was ich abstrakt formuliere.** Bevor ich abgebe, prüfen:
- ❌ Abstrakt: "Hoftor-Momente", "kennt das Gefühl", "ähnliche Sorgen"
- ✅ Konkret: "die Sorge, dass ihr Pferd sich aufregt", "die Zweifel, ob sie das alleine hinbekommen", "die 'vielleicht ist es heute doch zu windig'-Momente"

**Pattern:** Jeder Pain-Punkt sollte ein **körperlich/situativ spürbares** Detail haben, kein Konzept.

### Wording-Feinheiten

- **"einfachere"** (Komparativ) statt "einfache" — präziser
- **"inzwischen"** als zeitlicher Anker bei Lösungs-Beschreibungen ("sie wissen nur, wie sie inzwischen damit umgehen") — suggeriert: war auch ein Prozess
- **"wahrscheinlich"** als Weichmacher bei absoluten Aussagen — vorsichtiger
- **"Gelände-Traum" / "[Thema]-Traum"** als emotionales Ergebnis-Bild
- **🩷** als Wärme-Anker nach Versprechen ("kannst auch du lernen.🩷")

### Einstieg-Patterns

- **"Heute mal ungefiltert."** — Beichte-Einstieg
- **"Ich könnte stundenlang über meine 'Lieblings-[Nische]' schreiben."** — persönliche Liebeserklärung
- **"Anika, ganz ehrlich..."** — als Story-Einstieg (Selbstansprache, NICHT "Ehrlich?" allein)
- Generell: Eröffnungssatz ist kurz, direkt, lädt zum Lesen ein

⚠️ **"Ehrlich?" als alleinstehender Einstieg ist NICHT Anikas Stil** (Korrektur 06.06.26). Bitte nicht verwenden, auch nicht für Mails. Möglich ist nur "Anika, ganz ehrlich..." als Selbstansprache (siehe Webinar-Einladungs-Karussell vom 30.05).

### Wording-Regeln

- **"Lieblings-[Nische]"** statt "diesen Typ Frau" oder "Traumkundin" — wärmer, possessiver
- **Existentielle Selbstzweifel wörtlich zitieren:** "Bin ich die Richtige für ihn?" (nicht situativ "heute klappt das nicht")
- **"nicht zu ... ODER zu ...":** "Diese Frau ist nicht zu sensibel oder zu schwach, um sich mal richtig durchzusetzen"
- **Positiv-Wunsch nach Negativ-Reframe sofort explizit:** "Sie möchte ein tiefes Vertrauen und eine echte Bindung aufbauen"
- **Superlative wo möglich:** "den schnellsten Weg" (nicht "den schnellen")
- **Konjunktiv II:** "hätte sein können" (weicher, schicksalhafter als "sein könnte")
- **"Wirklich jedes."** / **"Wirklich [X]."** als Verstärkungs-Punch nach Aussagen
- **Rhythmische Dreierschritte** kürzen, wenn zu lang: 2 sind oft stärker als 3 ("Ich glaube nicht an Dominanz. Ich glaube nicht an 'wer hier der Chef ist'.")
- **Nicht zu viele Dreier-Aufzählungen** über den ganzen Text verteilen (gilt auch für Bullet-/Emoji-Blöcke). Gehäufte 3er-Listen wirken auf Anika zu KI-/listig. Lieber Fließtext oder 2er-Rhythmus.
- **Umgangssprachliche Anführungszeichen** für Mainstream-Floskeln: "zeige ich mal, wer hier der Chef ist", "die 'Richtige'", "in den Griff bekommen"

### Keine Preise / keine Verkaufssprache in Captions (NEU 27.08.26, sehr wichtig)

**In Reel-/Post-Captions (und B-Roll-Overlays) werden KEINE Preise genannt und KEINE Kauf-/Verkaufsabsicht formuliert.** Preisnennungen ("27€ statt 197€") und Verkaufsframing ("gibt es den Kurs gerade für...") haben zu extremen Einbrüchen bei den Kommentaren geführt. Der Verkauf passiert erst NACH dem Codewort-Kommentar in der ManyChat-/Mail-Strecke, nie in der Caption selbst.

- ❌ "gibt es den Kurs gerade für 27€ statt 197€"
- ❌ "sichere dir", "kaufen", "Angebot", Produktnamen mit Kauf-Kontext
- ✅ "Kommentiere mit '[CODEWORT]', dann schicke ich dir alle Infos direkt in dein Postfach."

### Test-Reel-Caption-Struktur (NEU 27.08.26)

Bei Test-Reels (Ziel: neue Follower, da nur Nicht-Follower sie sehen) hat die Caption drei Teile:

1. **Oben eine Folge-Aufforderung** in Anikas Wording: "Folge mir gerne, wenn du endlich mit deinem Pferd alleine ins Gelände möchtest." Abwechselnd auch mal eine **Speicher-Aufforderung** (Speicherungen helfen dem Algorithmus).
2. **Dann die Value-Caption** (Story + konkrete Schritte).
3. **Zum Schluss der Codewort-CTA** ohne Preis und ohne Kaufaufforderung.

### Pre-CTA-Qualifizierung (sehr wichtig)

Direkt vor dem CTA die Wunschkundin in ihrer **eigenen inneren Sprache** ansprechen, mit Bildern aus dem Karussell. Beispiel:

> "Wenn du dich beim Lesen wiedererkannt hast und dich jetzt fragst: 'Okay, der Wille ist da. Aber ich habe keinen roten Faden, wie ich zu meinem Geländeziel komme.' — dann bekommst du jetzt Hilfe."

Pattern:
1. Anker: "Wenn du dich beim Lesen wiedererkannt hast"
2. Innerer Monolog der Wunschkundin in Anführungszeichen (greift Bilder aus dem Karussell auf!)
3. Versprechen: "dann bekommst du jetzt Hilfe" / "dann ist dieser Post für dich"

### CTA-Schluss

- **"Kommentiere mit '[CODEWORT]'"** — IMMER "Kommentiere", NIE "Kommentier" (Korrektur 06.06.26)
- **"Schreibe '[CODEWORT]' in die Kommentare"** — alternative Variante, auch OK (18.06.26)
- **"Kommentiere einfach mit '[CODEWORT]'"** — "einfach" senkt die mentale Hürde
- **Codewort PASST ZUM THEMA**, nicht zum Standard-Funnel (z.B. "Respekt" für ein Respekt-Video, nicht "Gespräch" als generisches Kennenlerngespräch-Codewort)
- **Klares Wert-Versprechen NACH Codewort-Anweisung:** "Dann schicke ich dir direkt den Link zum Video in dein Postfach." (Mehrwert ist sofort sichtbar)
- **Single-CTA-Strategie:** EINE klare Aktion, nicht "Link in Bio ODER Kommentar" gleichzeitig
- **"und ich schicke dir kostenlos [Mehrwert]"**

### "Videotraining" NICHT wörtlich benennen (NEU, sehr wichtig)

Das Wort "Videotraining" wird bewusst NICHT in jedem Post ausgeschrieben. Anika umschreibt es je nach Post unterschiedlich, um die Neugier zu wecken und das Freebie nicht abgenutzt wirken zu lassen.

**Umschreibungen für "Videotraining":**
- "meine kostenlose 3-Schritte-Anleitung"
- "die Anleitung"
- "die Details zu den Schritten"
- "meinen kostenlosen Weg"
- "was ich meinen Kundinnen zeige"
- "Wie das konkret geht, zeige ich dir, wenn du mit '[CODEWORT]' kommentierst"

**Prinzip:** Bei jedem Post schauen, welche Umschreibung zum Video-Inhalt passt. Wenn das Video von 3 Schritten spricht, ist "3-Schritte-Anleitung" passend. Wenn von einer Methode, dann "meine Methode" usw.

**Nur gelegentlich** darf "Videotraining" noch stehen, damit klar bleibt, was es ist.

### CTA unten kann im Fließtext stehen (NEU)

Statt separater Kommentiere-mit-X-und-du-bekommst-Y-Block darf der zweite CTA elegant in einen Fließsatz eingebaut sein:

- ✅ "Wie das konkret geht, zeige ich dir, wenn du mit 'Verlasspferd' kommentierst."
- ✅ "Warum das so ist, verrate ich dir, sobald du 'Schlüssel' in die Kommentare schreibst."
- ❌ Separater Block "👉🏻 Kommentiere mit '[X]' und du bekommst [Y]" nur oben, unten fließender

Der CTA oben bleibt der klassische 👉🏻-Anker, der CTA unten wird organisch.

### Fragment-Aufzählungen sind IMMER auszubauen (Erinnerung)

Ich falle immer wieder in den Fragment-Reflex:
- ❌ "Du rufst seinen Namen. Du ruckst am Strick. Du wirst lauter."
- ✅ "Und du versuchst alles, um wieder in seinen Fokus zu kommen."

Wenn ich drei parallele Fragment-Sätze bauen will → einen ganzen Satz mit "alles" oder "auf jede erdenkliche Weise" oder "auf allen Ebenen" schreiben. Siehe [[feedback-vollstaendige-saetze]].

### 3er-Aufzählungen AUCH ALS FLIESSSATZ meist zu KI-listig (NEU, sehr wichtig)

Selbst wenn drei Punkte in einem Fließsatz mit Kommas stehen (nicht als Fragment), streicht Anika sie regelmäßig auf einen Punkt oder EINEN anderen Satz.

- ❌ "Es geht nicht um mehr Wiederholung, nicht um mehr Willen und nicht um mehr Übung am Hoftor."
- ✅ "Es geht nicht um noch mehr Wiederholung."

- ❌ "Das änderst du weit davor. Zuhause, im Alltag, in den kleinen Momenten, in denen du souverän die Führung übernimmst."
- ✅ Komplett gestrichen, ein positiver Satz stattdessen.

**Regel:** Wenn ich einen 3er-Rhythmus schreibe (drei parallele Wortgruppen/Phrasen/Präpositionen), aggressiv prüfen: Trägt der erste Punkt allein? Wenn ja, die anderen zwei streichen. Der eine ist meist genug.

### Positive Aussage statt negativer Reframe (NEU)

Statt "was du nicht tun sollst" + Aufzählung wo → EIN positiver Satz, der die Vision zeichnet.

- ❌ "Das änderst du nicht mit dem 20. Versuch am Hoftor. Das änderst du weit davor..."
- ✅ "Dabei darfst du die Vertrauensperson für dein Pferd werden, der es in jeder Situation bereitwillig folgt."

Anikas Muster: **"Du darfst..."** + positive Zielrolle/Zielhandlung. Nicht die Negation der aktuellen Situation.

### Redundante Erklär-Absätze streichen (NEU)

Wenn eine Punchline oder ein Reframe schon steht, keinen zusätzlichen Erklär-Absatz hinterher. Anika streicht regelmäßig meine "Der Weg geht über X, nicht über Y"-Sätze, wenn die Auflösung direkt folgt.

- ❌ "Und der Weg raus geht nicht über 'härter werden'. Er geht über zwei Dinge gleichzeitig." + danach die zwei Dinge nennen
- ✅ Direkt die zwei Dinge nennen ("Du darfst lernen, freundlicher mit dir selbst zu sein. Und du darfst dein Pferd zu einem Partner machen...")

### Punchlines NICHT doppelt erklären (NEU)

Nach einer Punchline nicht die Auflösung nachlegen. Kurz wirkt stärker als "Nicht weil X, sondern weil Y".

- ❌ "Wenn beides zusammenkommt, wird deine Angst kleiner. Nicht weil du sie wegkämpfst, sondern weil du sie nicht mehr brauchst 🩷"
- ✅ "Wenn beides zusammenkommt, wird deine Angst kleiner. 🩷"

### Absatz-Splits bei parallelen Aufzählungssätzen (NEU)

Bei drei parallelen Sätzen (z.B. "Sie sagt X. Sie sagt Y. Sie sagt Z.") nicht alle drei in EINEN Block, sondern nach zwei Sätzen einen Absatz-Umbruch. Mobile-Weißraum, bessere Lesbarkeit.

### CTA unten in ZWEI Absätzen (NEU)

Der untere CTA-Block darf in zwei Absätze aufgeteilt sein:
- Absatz 1: "Wie du dahin kommst..." (Value-Zusammenfassung)
- Absatz 2: "Kommentiere einfach mit '[X]' und du bekommst..." (Handlungs-Anweisung)

Nicht beides zusammen in einem dichten Block.

### Emojis strategisch in Absätzen platzieren

Neben der 🩷-Wärme setzt Anika Emojis in einzelnen Absätzen als Emotions-Marker:
- 😍 nach positivem Vorsatz/Vorfreude ("Endlich mal wieder eine Runde alleine.😍")
- 😧 nach frustrierendem Moment ("danach ist die Aufmerksamkeit wieder weg.😧")
- 🤔 nach zweifelnden Fragen/Selbstzweifel ("Vielleicht klappt es dann."🤔)
- 🩷 nach Punchline-Reframe ("Sondern bei dir 🩷")

Emotional-Arc einer Caption: 😍 (Vorfreude) → 😧 (Bruch) → 🤔 (Zweifel) → 🩷 (Reframe/Wärme). Nicht alle vier immer nötig, aber diese Reihenfolge funktioniert.

Nicht am Satzende immer ein Emoji, sondern gezielt an Emotions-Höhepunkten.

### Value-Caption Typ B (für Value-Reels ohne Codewort, siehe [[reference-yapping-anika-muster]])

Bei Value-Reels vom Typ B (Video ohne Codewort, Verweis auf Caption für Details) hat die Caption eine ganz eigene Struktur:

1. **Hook = direkte Zielgruppen-Frage**, oft mit 🐴 am Ende
   - "Willst du endlich aufsteigen können, ohne dass dein Pferd schon losläuft, bevor du überhaupt im Sattel sitzt? 🐴"

2. **Kurzer Reframe (1-2 Sätze)**, keine Kaskade
   - "Stillstehen ist keine Selbstverständlichkeit, sondern etwas, das dein Pferd lernen darf. Und genau das kannst du Schritt für Schritt trainieren."

3. **"So bringst du deinem Pferd bei... 👇"** als Übergang zur Schritte-Liste

4. **5 nummerierte Schritte** mit 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ als Marker
   - Jeder Schritt hat einen Fett-Titel (in der Caption ohne Formatierung, aber als kurzer Titel-Satz)
   - Erklärungs-Absatz mit konkreter Handlungsanweisung
   - Info-Box mit Emoji-Anker am Ende jedes Schritts

5. **Info-Box-Emojis** rotieren:
   - 🧠 Merke: [grundsätzliche Regel/Prinzip]
   - ☝️ Tipp: [praktische Ausführungs-Empfehlung]
   - 🔖 Wichtig: [Sonderfall/Warnung]
   - 👏 Hack: [Zeit-/Effizienz-Trick]

6. **Save/Share-CTA am Ende**, KEIN Codewort:
   - "Speichere den Beitrag gerne ab oder schicke ihn einer Reiterfreundin."

**Wichtig:** Bei Typ B werden Preise, Verkaufssprache und Freebies IMMER NOCH weggelassen. Die Caption ist reiner Value-Post, der Instagram-Save-Rate und Reichweite optimiert.
- **Saison-Trigger im Abschlusssatz:** "Damit du diesen [Sommer/Frühling/...] endlich [Versprechen] kannst."
- **Punch-Schlusssatz benennt den mentalen Stress, nicht nur das Symptom:** 
  - "Ohne Kopfkino." (mentaler Stress)
  - "Ohne Bauchschmerzen." (körperliches Symptom — schwächer)
  - "Ohne Druck." / "Ohne Zweifel."
  - → Möglichst das benennen, was im Kopf läuft, nicht nur was körperlich passiert

### Emoji-Regeln (KONTEXT-ABHÄNGIG)

Anika nutzt Emojis **funktional**, aber die Menge hängt vom Post-Typ ab:

**Bei sachlich-ehrlichen Posts (z.B. "Before You Work With Me"):** sparsam, 2-3 Emojis
- 🔴 als visueller "Stop"/"Achtung" nach kritischen Aussagen
- ❤️ als Wärme-Anker nach Versprechen
- ➡️ als visueller Pfeil zum CTA

**Bei emotionalen Story-Posts (z.B. Origin Story Bine):** **viel mehr Emojis (8+)**, jeweils mit klarer emotionaler Funktion
- 😱 Schock | 😯 Überraschung | 🙈 "Oh nein" | 🤷🏻‍♀️ Schulterzucken | 🙃 Ironisch | 😅 Selbstironisches Schwitzen | 🌟 Magie/Mehrwert
- Siehe Detail-Tabelle in [[reference-storytelling-anika]]

**Generell:**
- **Keine Emoji-Signatur am Ende** (kein "🤍 Anika")
- Emojis sind funktional, nicht dekorativ
- Im Zweifel: am Post-Typ orientieren, nicht an starrer Regel

### Hashtag-Set (Pferd/Verlasspferd-Bereich)

Empfehlung 15-18 Tags pro Post:
#verlasspferd #freizeitreiterin #pferdetraining #pferdeliebe #pferdundmensch #ausreiten #spazierenmitpferd #pferdetrainerin #vertrauensaufbau #hofklebend #pferdeangst #bodenarbeit #pferdeakademie #pferdkommunikation #onlinepferdetraining

### Was zu vermeiden ist

- Em-dashes / Pausenstriche (—) — siehe [[feedback-kein-bindestrich-vor-und]]
- KI-typische Doppelpunkt-Schluss-Sätze ohne Pointe
- "Mit deinem Pferd. Und ohne Bauchschmerzen." — zu generisch, lieber den mentalen Stress benennen
- Cheerleader-Sprache ("Du schaffst das!") — Anika ist warm-bestimmt, nicht jubelnd
- Lange verschachtelte Sätze für Hooks

Siehe auch: [[reference-karussell-traumkundin-struktur]], [[reference-karussell-before-you-work]], [[reference-anika-positionen]], [[feedback-kein-bindestrich-vor-und]]

---

## Reel-Format "2 falsche Ansätze"

### Reel-Format "Situation + 2 falsche Ansätze + Lösung in Caption"

Anikas virales Format (Beispiel: Reel Dan5O4IihN6 vom 10.07. — 100+ Likes, viral). Save-orientiert, drückt Leser in die Caption.

### Struktur

**Video (B-Roll, kein Talking-Head):**
- Anika mit Pferd im Hintergrund
- 3 Text-Overlays, die nacheinander aufploppen

**Overlay 1 (Situation, weiße Textbox):**
> "Wenn dein Pferd [KONKRETE SITUATION]..."
> Beispiel: "Wenn dein Pferd nicht mit dir ALLEINE vom Hof gehen möchte."

**Overlay 2 (Erste falsche Strategie, weiße Textbox + ❌):**
> "❌ Versuche nicht: [KONKRETE FALSCHSTRATEGIE 1]"
> Beispiel: "Dein Pferd zu beruhigen und ihm viel Zeit zu geben."

**Overlay 3 (Zweite falsche Strategie, weiße Textbox + ❌):**
> "❌ Versuche nicht: [KONKRETE FALSCHSTRATEGIE 2]"
> Beispiel: "Dein Pferd schrittweise nach vorne zu treiben."

**Wichtig:** Die LÖSUNG steht NICHT im Video, sondern nur in der Caption. Das drückt Leute in die Caption, was Reichweite und Verweildauer massiv erhöht.

### Caption-Aufbau (viraler Post)

1. **Speichern-Hook zuerst:** "Speichere dir diesen Beitrag am besten ab. 🌸"
2. **Setup:** "Das sind meistens die ersten zwei Strategien die ausprobiert werden. 😍🐴"
3. **Situation ausführlich beschreiben:** "Die Situation: Du möchtest..." + Ausmalen des Moments
4. **Erste falsche Strategie ausführlicher:** "Dann wird das Pferd beruhigt, gestreichelt und abgewartet..."
5. **Zweite falsche Strategie ausführlicher:** "Oder es wird weitergetrieben, Schritt für Schritt. Und für jeden Meter Landgewinn ein Leckerli reingesteckt."
6. **Warum beide falsch:** "Beide Strategien sind der falsche Ansatz. In beiden Fällen stehst du deinem Pferd nichts als souveräne Führungsperson zur Seite."
7. **Lösung ansatzweise (Teaser):** "❗ Die Lösung sieht so aus, dass..."
8. **Cliffhanger:** "Der Platz hier reicht nicht für die detaillierte Strategie."
9. **CTA:** Codewort für den Rest / Videotraining / Kurs

### Warum das viral funktioniert

- **Save-Hook** ganz oben → Algorithmus-Boost
- **Konkret + zielgruppen-spezifisch** → hohe Identifikation
- **❌-Format** trifft echte Frustpunkte → emotionale Resonanz
- **Auflösung nur in Caption** → hohe Verweildauer + Kommentare
- **Cliffhanger am Schluss** → Codewort-CTA hat hohe Conversion

### Anwendungs-Template

Für neue Reels in diesem Format:

1. **Konkrete Situation aus dem Kunden-Alltag wählen** (nicht abstrakt)
2. **Situation sollte 2 EBENEN kombinieren** (bewährter Pattern von Anika, z.B. "bei anderen klappt's" UND "überholt werden"). Nicht nur eine Ebene beschreiben.
3. **2 typische Fehler-Strategien identifizieren**, die viele probieren — sie müssen genau zur zweistufigen Situation passen
4. **B-Roll Video drehen** (Anika + Pferd, ruhig, ~15-20 Sek)
5. **3 Overlays** einbauen: Situation → ❌ Falsch 1 → ❌ Falsch 2
6. **Caption schreiben** nach obigem Aufbau (Save-Hook → Situation → 2 Fehler → Warum falsch → Teaser Lösung → Cliffhanger + CTA)
7. **Codewort-CTA** thematisch passend

### Beispiel-Situationen (bewährt)

- "Wenn dein Pferd sich von anderen entspannt führen lässt, dich aber gerne überholt." (2 Ebenen: Vergleich + konkrete Handlung) → Falsch: härter durchgreifen / andere imitieren → CTA Videotraining ("Verlasspferd")
- "Wenn dein Pferd nicht mit dir ALLEINE vom Hof gehen möchte." (viral) → Falsch: beruhigen+abwarten / schrittweise treiben → CTA Gelände-Schlüssel
- "Wenn dein Pferd sich einmal losgerissen hat und du jetzt Angst hast, dass ihm etwas passiert." → ❌ aus Angst gar nicht mehr ins Gelände / ❌ mit Hengstkette führen und so Kontrolle behalten wollen → CTA Quiz (28.10.26)

### Anika-Korrekturen zum Formulieren (28.10.26)

- **Situation nicht dramatisieren.** Mein Entwurf hatte "Horrorszenarien im Kopf" — Anika hat auf "Angst hast, dass ihm etwas passiert" gekürzt. Reel-Overlays sollen die Situation benennen, nicht ausmalen. Das Ausmalen übernimmt die Caption.
- **Fehler 2 = konkretes Material/Werkzeug nennen, das Reiterinnen wirklich greifen** (Hengstkette, nicht "Doppelstrick und Kappzaum"). Je spezifischer das falsche Hilfsmittel, desto stärker die „oh nein, das mache ich"-Reaktion. Generisches „mehr Absicherung" trifft nicht.
- **Kern-Reframe des Fehlers = Kontroll-Illusion**, nicht „diesmal gut gehen". „Zu hoffen, dass du so die Kontrolle behältst" trifft den Mechanismus — das Werkzeug ersetzt nicht die fehlende Beziehung/Ausbildung.

### Emoji-Set in Caption (aus dem viralen Beispiel)

- 🌸 (Save-Hook)
- 😍🐴 (Setup, warme Ansprache)
- 😯 (Spannung)
- 😐 (Frust/Blockade)
- 🙏 (Verzweiflung)
- 😊 (Selbstironie)
- ❗ (Lösung-Anker)

Siehe auch: [[reference-caption-stil]], [[reference-storytelling-anika]]

---

## Yapping-Skript Anikas Muster

### Anikas Yapping-Skript-Muster

Anika hat den Yapping-Aufbau nach der ersten Runde selbst geschärft (Video "Aufmerksamkeit des Pferdes"). Dieses Muster ist die verlässliche Vorlage für alle weiteren Yapping-Skripte. Ich soll es standardmäßig anwenden, nicht neu erfinden.

Detaillierte Version steht in [[content-produktion-max-saal]] unter "Anikas fertiges Yapping-Muster".

### Kurz-Regeln

**1. Hook (1 Satz):** Value-Promise mit emotionalem Hebel. Kleine Wörter wie "wieder" prüfen, wenn sie andeuten, dass etwas verloren ging.

**2. Hero Story (1 Satz):** "Hey, ich bin Anika und durch die Begleitung von über 500 Schülerinnen weiß ich, dass [Gefühl der Zuschauerin]..."
- Hero Story = Aufbau von Anikas Expertise, nicht Kunden-Kontext
- Direkt in das Gefühl der Zuschauerin kippen

**3. Kontext (2-3 Sätze):** Konkrete körperliche Szenen visualisieren, keine Theorie
- 3 konkrete Bilder statt Beutetier-Trainer-Sprech
- Emotional zuspitzen erlaubt: "kann im schlimmsten Fall richtig weh tun"

**4. Learning = REFRAME, NICHT Schritte-Liste (3-5 Sätze):**
- Muster: "Viele stufen das als [gängige Deutung] ein, aber ich sehe dahinter [Reframe]"
- Perspektivwechsel: "in den Augen deines Pferdes"
- Anikas Standard-Bilder: "Berglöwe" (Bedrohungswahrnehmung), "Job zutrauen" (Verantwortungsübernahme)
- Übergang: "Das heißt, du darfst dich erstmal beweisen, dass..."

**5. CTA mit Cliff:**
- Konkrete Zahl versprechen, aber nicht verraten: "Um das zu erreichen brauchst du [3 klare Schritte]"
- Codewort → Freebie/Videotraining
- Konkretes Nutzen-Versprechen ("die kostenlose Anleitung")

### Zwei Post-Typen — Typ A ist Standard, Typ B ist Fallback

**Standard = Typ A (Codewort-Lead-Reel).** Ich baue standardmäßig Typ A und suche einen passenden Codewort-CTA. Nur wenn wirklich kein Freebie/Codewort zum Thema passt, ist Typ B eine Notlösung. Sobald Anika mehr Freebies hat, wird auch bei "Fallback"-Themen wieder auf Codewörter gepitcht.

**Wenn ich keinen guten Codewort-Match sehe, kurz die Alternativen benennen und Anika entscheiden lassen**, ob wir zu einem der bestehenden Codewörter greifen oder auf Typ B ausweichen. Nicht ungefragt Typ B produzieren.

### Typ A: Codewort-Lead-Reel

- Video liefert Hook + Hero Story + Kontext + REFRAME
- CTA = Codewort für Freebie (Verlasspferd, Gelände, Schlüssel usw.)
- Caption qualifiziert und pusht Richtung Codewort, hat NICHT die konkreten Schritte
- Passt bei: Vertrauens-Themen, Beziehungs-Themen, Angst-Themen, tiefen psychologischen Reframes
- Ziel: Leads generieren

### Typ B: Value-Reel mit Details in Caption

- Video liefert Hook + Hero Story (mit konkretem Anika-Alltagsbeispiel) + Kontext + kurze Reframe-Aussage + Verweis auf Caption
- CTA im Video: "Die Details dazu siehst du in der Caption." + "Teile das Video mit deiner Reiterfreundin und speichere es dir ab."
- Caption hat die konkreten 5 Schritte mit Info-Boxen (siehe [[reference-caption-stil]] → Value-Caption Typ B)
- KEIN Codewort, KEIN Freebie
- Passt bei: konkreten Trainings-How-tos, wo eine 5-Schritte-Anleitung Sinn ergibt
- Ziel: Save-Rate, Reichweite, Autoritätsaufbau

**Zuordnung nach Frage-Typ (Faustregel):**

- "Wie bekomme ich..." / "Was mache ich, wenn..." mit klaren Handlungsschritten → oft Typ B
- "Woran erkenne ich..." / "Warum..." mit psychologischem Umdenker → oft Typ A
- Aber IMMER fragen, nicht raten.

### Für Typ A: Der Kernpunkt (wo ich vorher zweimal danebenlag)

**Das Video liefert den REFRAME, nicht die Schritte.** Wenn ich alle 5 Handlungstipps ins Video packe, hat die Zuschauerin keinen Grund mehr, das Codewort zu schreiben. Video macht neugierig auf die Umsetzung, Codewort-Freebie liefert die Umsetzung.

### Hero Story: Drei Varianten (nach Kontext wählen)

Der "500 Schülerinnen"-Anker ist EINE Standardversion, aber nicht die einzige. Bei jedem Skript prüfen, welche der drei am besten zum Thema passt.

### Variante 1: Positionierung als Spezialistin (bei Gelände-Themen bevorzugt)

- ✅ "Hey, ich bin Anika und ich bin Spezialistin, wenn es darum geht, mit deinem Pferd entspannt ins Gelände zu kommen."
- Kürzer und stärker als der Zahlen-Anker
- Passt zu allen Themen, die klar in Anikas Kern-Positionierung liegen (Gelände, Verlasspferd, Basis)

### Variante 2: Autoritäts-Zahl (500 Schülerinnen)

- ✅ "Hey, ich bin Anika und durch die Begleitung von über 500 Schülerinnen weiß ich, dass [Beobachtung/Aussage]..."
- Sicher, funktioniert immer
- Gut, wenn das Thema breiter ist als nur Gelände (Angst, Vertrauen, allgemeines Training)

### Variante 3: LIVED Experience mit eigenen Pferden

- ✅ "Hey, ich bin Anika und ein Pferd, das in jeder Situation ruhig stehen bleibt, ist für mich als Ausbilderin absolute Basis. Meine Pferde stehen z.B. auch frei auf dem Hof still, während ich sie putze und Equipment aus der Sattelkammer hole."
- Am stärksten, weil konkret und persönlich
- Nur nutzen, wenn Anika mir das Alltagsbeispiel bestätigt hat oder aus vorhandenen Referenzen belegen kann

### Rhetorische Frage + Empathie-Beruhigung direkt nach der Hook (NEU)

Zwischen Hook und Hero Story kann eine kurze Bridge stehen:

1. **Rhetorische Frage**, die die Not zusammenfasst: "Wie schaffe ich es jetzt, mein Pferd wieder in Bewegung zu bringen?"
2. **Empathie-Satz**, der validiert: "Das ist ein häufiges Problem, was wirklich sehr frustrierend sein kann."

Diese zwei Sätze machen die Zuschauerin abholbereit, bevor Anika sich vorstellt.

### CTA mit KUNDINNEN-STORY statt Zahl (NEU, sehr wichtig)

Alternative zum "3-Schritte-Cliff": ein konkretes Kundenbeispiel mit Namen, Zeit und Ergebnis. Das ist emotional stärker als abstrakte Zahlen.

**Muster:**
> "Meine Schülerin [Name] hat es damit in [Zeit] mit nur [Aufwand] geschafft, [konkretes Ergebnis]. Tippe '[Codewort]' in die Kommentare und ich zeige dir, was ich auch [Name] gezeigt habe."

**Beispiel:**
> "Meine Schülerin Sarina hat es damit in 2 Wochen mit nur 4 Mal üben geschafft, mit ihrer Stute entspannt alleine ins Gelände zu starten. Tippe 'Gelände' in die Kommentare und ich zeige dir, was ich auch Sarina gezeigt habe."

**Voraussetzung:** Nur echte Kundinnen mit Namen und echten Zahlen ([[feedback-kein-erfundener-kundenfall]]). Wenn ich keinen echten Fall belegen kann, nachfragen oder Zahlen-Cliff verwenden.

### Verb-Variation im CTA

Nicht immer "Kommentiere mit" — auch "Tippe [Codewort] in die Kommentare" ist Anikas Wording.

### Produkt-/Methodennamen darf ich im Skript direkt nennen

- ✅ "habe ich dir meine Verlasspferd-Methode mitgebracht"
- Freebie-Umschreibungen (Anleitung, Weg, 3 Grundlagen) sind eine Option, aber der Methodenname darf auch direkt fallen, wenn es die Autorität stärkt.

### Codewörter (aktuelle Zuordnung)

- **Verlasspferd** / **Videotraining** → kostenloses 90-Minuten-Videotraining (Beziehungs-/Basis-Themen)
- **Schlüssel** → Gelände-Schlüssel Mini-Kurs 27€ EB (Direkt-Verkauf Hoftor)
- **Gelände** → Gelände-Content (bei rein Gelände-thematischen Reels, wenn nicht direkt verkauft wird)

Immer prüfen, welches Codewort thematisch am direktesten passt, nicht das "Standard-Codewort" für alles nehmen.

### Reframe muss nicht immer psychologisch sein

Bei manchen Themen ist der Reframe nicht "es liegt nicht an X, sondern an Y", sondern schlicht "das ist eine erlernbare Fähigkeit, du darfst sie deinem Pferd beibringen."

- Umsetzungs-Formulierung: "Jedes Pferd kann [X] lernen. Du darfst deinem Pferd das mit liebevoller Konsequenz beibringen."
- Anikas Standardwendungen: "liebevolle Konsequenz", "liebevoller Tritt"

### Codewort-Freebie NICHT als "Videotraining" ausschreiben

In Caption UND Video-CTA nicht immer "Videotraining" wörtlich benennen. Anika umschreibt es je nach Post, um Neugier zu wecken:
- "3-Schritte-Anleitung"
- "die Anleitung"
- "der Weg"
- "Wie das konkret geht, zeige ich dir, wenn du kommentierst"

Detail in [[reference-caption-stil]] unter "Videotraining NICHT wörtlich benennen".

### Warum das wichtig ist (Anikas Korrekturen an mir)

1. Ich hatte "meine Kundinnen kennen das" als Hero Story geliefert → das ist Kontext, keine Hero Story
2. Ich hatte alle 5 Tipps ins Video gepackt → schwacher CTA-Cliff
3. Ich hatte "Beutetier scannt die Umgebung" statt "Berglöwe" verwendet → zu abstrakt

### Siehe auch

- [[content-produktion-max-saal]] — vollständige Yapping-Struktur und Max Saal Framework
- [[reference-caption-stil]] — Caption-Stil für Yapping-Videos
- [[feedback-vollstaendige-saetze]] — Wording-Regeln
- [[reference-storytelling-anika]] — Anikas Story-Elemente und Bilder

---

## Test-Reel-Gewinner neu hochladen

Wenn ein Test-Reel gut läuft, lädt Anika dasselbe Reel **neu im Feed hoch**. Sie teilt/verschiebt das Test-Reel NICHT in den Feed. So existiert es zweimal (Test-Reel + Feed-Post) und kann in beiden Bereichen Leads sammeln.

**Why:** Empfehlung ihrer Mentorin; von Anika am 08.10.2026 als feste Regel genannt. Ersetzt den älteren Stand in [[project_content_maschine]] (v4.3: „teilt das bestehende Test-Reel in den Feed").

**How to apply:** In Abläufen, Tool-Texten („Heute zu posten") und Empfehlungen immer „Gewinner neu im Feed hochladen" formulieren, nie „Test-Reel teilen". Bei Auswertungen ([[project_instagram_content_analyse]]) zählt der Feed-Upload als eigener Beitrag mit eigenen Zahlen.

---

## Reel-Produktion Test-Reels

### Reel-Produktion Test-Reels (seit 2026-08-27)

Claude übernimmt den kompletten Schnitt der Test-Reel-Varianten (statt Freelancerin oder Edits-Handarbeit): 3 B-Rolls × 5 Hooks = 15 Reels à 7 Sekunden, Text-Look aus Anikas Vorlage nachgebaut.

- **Skripte + Doku:** `scripts/reel-produktion/` (build_overlays.ps1, Poppins-Medium.ttf, Noto-Emoji, README mit ffmpeg-Kommando und Layout-Parametern). ffmpeg portable jeweils frisch in den Scratchpad laden.
- **Ablage:** Anika legt Rohmaterial in `Desktop\Vorlage Reels`, fertige MP4s nach `...\Fertig` (Benennung HookN-VideoM.mp4). Kein Google-Drive-Upload durch Claude (Videos zu groß für MCP-Upload), Anika lädt selbst hoch bzw. zieht sie aufs Handy.
- **Log:** Google-Tabelle "Reels Hook-Caption-Übersicht" (Blätter Hooks + Captions, IDs C1, C2, ...); nach dem Testen trägt Anika Views/Winner ein, Claude kann das übernehmen.
- **Immer nur die ersten 7 Sekunden** der B-Rolls verwenden (Anikas Vorgabe).
- Musik legt Anika beim Posten in der Instagram-App drauf; Test-Reels im Abstand von 1 bis 2 Minuten posten.
- **Handy-Aufräumen (27.10.2026):** Test-Reels liegen auf Anikas S20 FE unter `SD-Karte\DCIM\Susanne` (per USB/MTP über Shell.Application lesbar). Zuordnung Datei ↔ IG-Reel per Frame-Vergleich mit IG-`thumbnail_url` (Graustufen 27×48, Abweichung <3 = Treffer). Gewinner (Test-Gewinner + ins Feed hochgeladene) → `Desktop\Reel-Gewinner`, Größe+Abspielbarkeit geprüft. Löschen macht Anika selbst am Handy (über USB wäre es endgültig). Ordner `DCIM\Reels` ebenfalls erledigt: Einzelvideos → `Desktop\SM Content\{Energetik,TTP,Gelände,Offenstall}`, Test-Gewinner → Reel-Gewinner (Anika wählte über HTML-Übersicht mit Häkchen). ⚠️ PowerShell-5.1-Skripte mit Umlauten in Dateinamen IMMER mit UTF-8-BOM speichern, sonst falsche Namen/„nicht gefunden“.
- ⚠️ In der Google-Tabelle NICHT arbeiten, während Anika selbst darin editiert; Einträge vorher ankündigen. Siehe [[reference-caption-stil]] (keine Preise in Captions, gelieferte Texte wortgleich übernehmen).

---

## IG-Content-Analyse 08.10.2026

Analyse vom 08.10.2026 über 207 Beiträge (10.07.–08.10.2026; 43 Feed, 164 Test-Reels), gemeinsam mit Anika begonnen.

**Zahlen:** Feed-Median Aufrufe Juli 11.990 / Aug 11.541 / Sept 938 / Okt 406. Test-Reels Median 2.106 / 1.612 / 209 / 162. Seit Mitte Sept bleiben 58–90 % der Test-Reels unter 300 Aufrufen hängen (vorher 0–19 %). Ø-Wiedergabezeit Test-Reels 8,1 s → 5,5 s; Reels unter 300 Aufrufen 4,9 s, Reels ab 5.000 Aufrufen 9,3 s.

**Was sich ab Sept geändert hat:** Yapping-Ablauf (Talking Head + B-Roll-Varianten), Hooks als Ratgeber/Frage („So erkennst du …", „Woran erkennst du …", „Willst du endlich …"), Themen breiter (Aufsteigen, Leckerli, Kappzaum), Caption beginnt mit Codewort-CTA, Menge 17 → 75 Test-Reels/Monat (5 Varianten pro Caption).

**Stärkster Einzelbefund (kleines n, mein Schluss, noch nicht breit geprüft):** Derselbe B-Roll-Clip in derselben Woche: Hook „So bekommst du die Aufmerksamkeit deines Pferdes wieder auf dich gelenkt." → 258 Aufrufe; Hook „Wenn du möchtest, dass dein Pferd dir im Gelände vertraut." → 4.033 (Schwester-Variante 14.492). Die Juli/August-Gewinner hatten alle die Form „Wenn dein Pferd [konkrete Gelände-Situation]" + echte Gelände-Szene (Gras, ALLEINE vom Hof, Kumpel klebt, Trecker). Spricht für Hook-Form statt Konto-Drosselung.

**⚠️ Korrektur durch Anika (08.10.2026):** Die Gruppe vom 17.09. („Wenn du möchtest, dass dein Pferd dir im Gelände vertraut.") war das ALTE Format (kurzer Clip, Musik, zwei falsche Ansätze), kein Yapping-B-Roll. Der „Einzelbefund" oben vergleicht also zwei Formate und belegt NICHT die Hook-Form allein. Damit ist das Format der am besten gestützte Treiber: altes Format mitten im September 667–14.492 Aufrufe (0 von 5 unter 300), Yapping-B-Rolls derselben Woche Median 174 (14 von 19 unter 300). Das spricht auch gegen eine Konto-Drosselung und gegen „zu viele Uploads" als Hauptursache. Mit Korrektur: Format A n 31, E n 81 (Median 191, 72 % unter 300). Hook-Form und Format sind weiterhin nicht sauber trennbar (Wenn-Hooks gab es fast nur in A).

**Format-Auswertung (alle 205 Reels per Vorschaubild klassifiziert, Test-Reels bis 05.10.):**
- A „Zwei falsche Ansätze" (ca. 9 s, Text + Musik, Wenn-Hook, Lösung in Caption; 10.07.–02.08.): n 26, Median 2.242, 4 % unter 300, 62 % ab 2.000.
- B Meinungs-B-Roll 61 s (07.–14.08.): n 15, Median 1.283, 0 % unter 300, Durchsehquote 18 %.
- C 7-Sek-Hook + „Hier ist die Anleitung 👇" (Claude-Batches 26./27.08.): n 27, Median 1.493, 19 % unter 300, Durchsehquote 108 %.
- E Yapping-B-Roll (ab 15.09., 30–65 s): n 86, Median 209, 67 % unter 300, Durchsehquote 13 %.
- D Talking Head im Feed: n 13, Median 751, Länge ~71 s, Durchsehquote 14 %.
Anikas eigene Vermutung (kurzes B-Roll-Format war der Treiber) passt zu den Zahlen: kurze Text-B-Rolls werden ganz bzw. mehrfach gesehen. Nicht allein Format: innerhalb C schwankt der Median je Hook von 217 bis 8.239; in E lief nur der Wenn-Hook vom 17.09. Hook-Formen Test-Reels gesamt: Wenn-Situation Median 2.081, Meinung/Aussage 1.014, So-Anleitung 359, Hilfe-Ruf 188, Frage 185.
Technik: `media_url` fehlt bei Reels mit lizenzierter Musik → Länge nur bei Originalton aus MP4-Kopf lesbar (Range-Request, `mvhd`); Kontaktbögen per PowerShell System.Drawing (ffmpeg ist nicht installiert).

**Vorbehalt:** Feed-Vergleich hinkt, weil im Juli/Aug v.a. Test-Reel-Gewinner ins Feed geteilt wurden, ab Sept jeder Talking Head unabhängig von Performance. Ob die hohe Menge fast gleicher Uploads zusätzlich bremst, ist nicht trennbar.

**How to apply:** Bei Hook-Arbeit ([[project_reel_produktion]], hook-reel-coach) die „Wenn dein Pferd …"-Situationsform mit Gelände-Bezug als belegten Favoriten behandeln, aber als vorläufig kennzeichnen. Abruf: lokal per Graph API mit `META_IG_TOKEN` (kostet keine Netlify-Credits), Zusatz-Metrik `ig_reels_avg_watch_time` pro Reel über `/{media-id}/insights`; On-Screen-Hooks stehen NICHT in der API, nur über `thumbnail_url` ablesbar. Verbindung siehe [[project_instagram_insights_integration]].

---

## Instagram-Insights-Anbindung (läuft)

Anika will künftig (a) Beiträge, die sie **vom Handy** postet (nicht über die [[project_content_maschine]]-Karteikarte), automatisch in der Content-Maschine **erfassen/abgleichen**, und (b) ihren Instagram-Content **anhand der Zahlen auswerten**. Beides läuft über **dieselbe Verbindung** (Instagram Graph API), daher einmal richtig aufsetzen.

**Status der Prüfung (2026-09-07):** Der vorhandene Meta-Token in `scripts/.env` (`META_ACCESS_TOKEN`, System-User „Auswertung G-S") hat NUR `ads_read` + `public_profile` → **kann Instagram-Posts NICHT lesen**. `/me/accounts` kam leer (fehlt `pages_show_list`). Reicht also nicht.

**Was gebraucht wird:**
1. Meta-App um Rechte erweitern: `instagram_basic` (Posts) + **`instagram_manage_insights`** (Performance-Zahlen) + `pages_show_list` + `pages_read_engagement`. IG muss Business/Creator sein und mit der FB-Seite verbunden (ist es, wegen Ads/Business Suite).
2. Neuer **langlebiger Token** mit diesen Rechten (Anika erzeugt ihn im Meta-Dashboard; Claude gibt KEINE Zugangsdaten ein, nur Klick-Anleitung).
3. Wahrscheinlich **ohne formale Meta-App-Prüfung** machbar, weil eigenes Konto + Admin (Dev-Modus).
4. Für die Web-App-Integration später eine **Netlify-Funktion** als sicherer Token-Speicher (App ist öffentlich ohne Passwort → Token darf NICHT in den Client).

**Vorgehen (vereinbart):**
- **Schritt 1 (morgen):** Anika erzeugt Token mit IG+Insights-Rechten → Claude schreibt lokales PowerShell-Skript (analog [[project_ads_auswertung]]), das die letzten IG-Posts + Zahlen abruft und anzeigt → beweisen, dass es geht.
- **Schritt 2 (später):** Anbindung an die Content-Maschine über Netlify-Funktion, Import-/Abgleich-Ansicht (Posts den Karteikarten zuordnen oder als „gepostet" abhaken); speist perspektivisch die Best-Performer-Logik [[project_reel_produktion]] datenbasiert.

**✅ Schritt 1 ERLEDIGT (2026-09-08):** Verbindung läuft. Setup, das funktioniert hat:
- System-Benutzer „Auswertung G-S" (Business „Anikas Pferdeakademie") bekam Facebook-Seite **„Anika Wesse"** (Page-ID `267529773117705`) UND Instagram-Konto **@anikas_pferdeakademie** (IG-Business-ID `17841404268109208`) als Assets zugewiesen (Vollzugriff).
- App „Auswertung G-S" (App-ID `1015618424408902`) brauchte den Anwendungsfall **„Messaging und Content auf Instagram verwalten"** (unter Anwendungsfälle → Content-Management), erst danach waren `instagram_basic` + `instagram_manage_insights` im Token-Dialog wählbar.
- Neuer System-User-Token (Rechte: instagram_basic, instagram_manage_insights, pages_show_list, pages_read_engagement, ads_read) liegt in `scripts/.env` als **`META_IG_TOKEN`** (gitignored). System-User-Token = läuft nicht ab.
- ⚠️ Metrik-Namen aktuell: **`views`** (nicht mehr `plays`), sonst reach/likes/comments/saved/shares/total_interactions. IG-Konto wird über die Seite aufgelöst: `/me/accounts` → Page-ID → `/{page}?fields=instagram_business_account`.
- **✅ WICHTIGSTE ERKENNTNIS: Test-Reels (Trial Reels) KOMMEN über die API** — mit Permalink UND Insights. Bestätigt an Anikas Batch vom 27.08.: 15 B-Roll-Varianten desselben Hooks, alle abrufbar, Gewinnerin klar (6248 Views vs. 216). ⚠️ Ein ins Feed geteiltes Test-Reel behält sein Ursprungs-Datum (kein separater Feed-Timestamp) → fürs Feed-Timing zählt Anikas geplantes Datum im Tool, die API liefert Zahlen+Links.
- **Skript gebaut:** `scripts/instagram-insights.mjs` (Node, `node scripts/instagram-insights.mjs [anzahl]`): letzte Medien inkl. Insights in EINER Abfrage (Feld-Erweiterung `insights.metric(...)`), gruppiert nach Caption-Hook, markiert beste Variante 🏆, gibt Permalink aus. Basis für Schritt 2.

**Schritt 2 IN ARBEIT (2026-09-08):** Netlify-Funktion als Token-Türsteher gebaut + committet: `outputs/content-maschine/deploy/netlify/functions/instagram.js` (+ `deploy/netlify.toml` mit `[functions] directory="netlify/functions"`), auch in Desktop-Ordner `Content-Maschine-Deploy` gespiegelt. Funktion = serverseitiger Proxy zur Graph API, App ruft `/.netlify/functions/instagram` (same-origin, kein CORS). META_IG_TOKEN hat Anika in Netlify als Umgebungsvariable hinterlegt.
- ⚠️ **WICHTIG gelernt: Netlify Drag-and-Drop deployt NUR statische Dateien, KEINE Functions** (getestet: App v4.3 ist live, aber `/.netlify/functions/instagram` → 404). Functions gehen nur über Netlify-CLI oder Git-Anbindung.
- ⏭️ **Nächster Schritt (morgen):** Anika legt Netlify **Personal Access Token** an (User settings → Applications → Personal access tokens) → `scripts/.env` als **`NETLIFY_AUTH_TOKEN`** (gitignored). Dann deployt CLAUDE via `npx netlify deploy --prod --dir=outputs/content-maschine/deploy --site <id>` (bündelt Functions mit) und testet `/.netlify/functions/instagram` live. Ab dann übernimmt Claude die Deploys (kein Drag-and-Drop mehr nötig). Site-ID via `npx netlify sites:list` mit dem Token finden (Seite „contentanika").
**✅ Schritt 2 ERLEDIGT (2026-09-09):** Funktion live deployt + App-UI gebaut, alles funktioniert end-to-end.
- **Deploy-Weg jetzt: Netlify-CLI** (Drag-and-Drop deployt keine Functions!). Anika hat Netlify **Personal Access Token** in `scripts/.env` als `NETLIFY_AUTH_TOKEN` (gitignored). Claude deployt mit: `export NETLIFY_AUTH_TOKEN=... ; npx --yes netlify-cli@latest deploy --prod --site cb3d949d-ce19-4d21-8ca9-5bf63b49b019 --dir outputs/content-maschine/deploy --functions outputs/content-maschine/deploy/netlify/functions`. Site-ID contentanika = `cb3d949d-ce19-4d21-8ca9-5bf63b49b019`. **Ab jetzt deployt Claude, Anika muss NICHT mehr den Ordner ziehen.** (Desktop-Ordner + deploy/ trotzdem aktuell halten.)
- **Instagram-Tab in der App** (NAV „📷 Instagram"): `renderInstagram()` ruft `/.netlify/functions/instagram?limit=50` (same-origin), gruppiert nach Caption-Hook, sortiert nach Aufrufen, markiert Gewinnerin 🏆, Tabelle Datum/Aufrufe/Reichw./Likes/Komm./Gesp./Geteilt + „öffnen ↗" (Permalink). Cache in localStorage (`cm-ig-cache`) + „🔄 Aktualisieren". Offline/lokal: sauberer Hinweis „nur auf Live-Seite". Live getestet: 11 Gruppen, Gewinner korrekt.
- **„Heute zu posten"-B-Roll-Task → `showBroll(yid)`** springt jetzt in den Instagram-Tab, gefiltert nach `y.caption` (nur wenn Caption gesetzt). ⚠️ Damit der Filter greift, muss die Caption im Yapping-Video mit der echten IG-Caption übereinstimmen.
- Metrik-Hinweis bleibt: `views` (nicht `plays`). Trial Reels kommen mit rein (bestätigt).

**Erweiterungen (2026-09-09, live):**
- **Feed vs. Test-Reel-Trennung** über API-Feld **`is_shared_to_feed`** (getestet, funktioniert): Feed = kein REEL ODER is_shared_to_feed=true; Test-Reel = REEL && !shared. Funktion paginiert jetzt (`?days=120`, Standard) + liefert `feed`-Flag pro Post. Instagram-Tab zeigt zwei Abschnitte: **📤 Feed** (chronologisch) und **🧪 Test-Reels** (nach Hook gruppiert, Gewinner 🏆).
- **Feed-Nachtrag** (`backfillFeed`): Button „➕ Anlegen" im Feed-Abschnitt + Datumsfeld (Default 10.07.2026) legt fehlende Feed-Posts ab Stichtag als **Reel-Karten** an (status Gepostet, caption, postDatum, `igId`+`igUrl`; Dedup über eindeutige `igId`). Anikas Stand: 20 Feed-Posts seit 10.07. ⚠️ Muss sie in ihrer ECHTEN (eingeloggten/synchronisierten) App klicken, nicht in einer Test-Sitzung, sonst persistiert es nicht.
- **Yapping-Karte: Button „📋 Skript kopieren"** (`copyYappingScript`) — kopiert die 5 Skript-Abschnitte am Stück (für Edits-Teleprompter).
- ⚠️ loadIg lädt beim Tab-Öffnen jetzt IMMER frisch (force), Cache-Key `cm-ig-cache2` (alter Cache ohne feed-Flag ignoriert).

- **Karten-Identifikation verbessert (2026-09-09):** Nachgetragene Feed-Karten zeigten als „Hook" nur die erste Caption-Zeile = oft die immer gleiche CTA („Speichere dir…"). Fix: Funktion liefert `thumbnail_url`/`media_url` als `thumb`; Karte zeigt **Vorschaubild** (`igThumb`, `img.ig-thumb`, onerror-Fallback da fbcdn-URLs ablaufen können); Titel = **„Feed <Datum> · <erster Nicht-CTA-Satz>"** (`igTitleFrom`, überspringt Zeilen mit 👉/Tippe/Speicher/Folge/… ). Gleiche-Caption-Posts vom selben Tag unterscheiden sich übers Bild. `backfillFeed` AKTUALISIERT bestehende igId-Karten ohne igThumb (Bild+Titel nachrüsten, kein Duplikat). ⚠️ Anika muss in ihrer echten App EINMAL erneut „➕ Anlegen" klicken, damit ihre schon angelegten 20 Karten Bild+Titel bekommen (0 neu, 20 aktualisiert).

**⚠️ Netlify Free-Credits (2026-09-09):** Anika bekam „50% Credits verbraucht"-Mail. Geprüft: Team „anikawesse's team" = **Free-Plan**, Bandbreite nur ~2,5 MB (also NICHT Traffic). Neuer Free-Plan zählt Credits v.a. für **Deploys + Function-Invocations**. Ursache war v.a. Claudes vieles Test-Deployen heute (~8 Deploys + viele Live-Ladungen). **Konsequenz: sparsam sein** — gebündelt + selten deployen, Live-Tests minimieren, App-seitig Function nur bei Bedarf aufrufen. Umgestellt: `loadIg` **Cache-first** (kein force beim Tab-Öffnen; frisch nur via „🔄 Aktualisieren" oder wenn kein Cache), Cache-Key `cm-ig-cache3`. Deploy-Kommando siehe oben. ⚠️ Site-ID/Token nicht verschwenden. Doku der Alt-Posts hat für Anika KEINE hohe Priorität.
- Bug offen/harmlos: Nach „Anlegen" wurde Anika aufs Dashboard geleitet + Reels leer — vermutlich igData beim Klick noch nicht geladen (früh geklickt) + Sync-Pull-reRender (reRender fällt auf 'dashboard' wenn kein `.tab.active`). Workaround: erst klicken, wenn die Zahlen sichtbar sind.

Status: Instagram-Anbindung KOMPLETT, jetzt sparsam (Cache-first). ⏭️ Sparsam bleiben. Optional/niedrige Prio: Alt-Post-Doku, Inline-Zahlen auf Karten, Zeitraum-Auswertung.

---

## Instagram Mitbewerber

### Content Radar Empfehlung (Tool der Mentorin)

Für die erste Analyse im Content Radar empfohlen (Hauptthema Gelände + Traumteam, Energetik nur bei Launch):

1. **@kernkompetenzpferd** — Format-Benchmark, erstes Analyse-Ziel
2. **@die.sandra.schneider** — direkter Gelände-Wettbewerb
3. **@sandra.fencl** — Gelände + ganzheitlich
4. **@sonjaleitenstern** — BBP-Zielgruppe, stark gewachsen
5. **@equipsych** — Reitangst-Hooks übertragbar auf Gelände-Content

Nicht ins Radar: @woelbchen (Annica Hansen, 337K) — Lifestyle-Creator, kein Kurs-Business, verfälscht Analyse.

Energetik-Benchmark (@_pferde.verstehen_, @frag_dein_pferd) nur bei Launch-Phasen relevant eingeben.

---

### Energetik / Tierkommunikation mit Pferd

| Account | Follower | Besonderheit |
|---|---|---|
| [@_pferde.verstehen_](https://www.instagram.com/_pferde.verstehen_/) (Catherin Seib) | ~29K | SPIEGEL-Bestseller-Autorin, Online-Kurs "Sprich mit deinem Pferd", 17+ Jahre. **Primärer Benchmark für Energetik-Content.** |
| [@frag_dein_pferd](https://www.instagram.com/frag_dein_pferd/) (Lisa Huck) | ~14K | Tierkommunikation + Ausbildung + energetische Behandlung. **Primärer Benchmark für Energetik-Content.** |
| [@pferdetelepathie](https://www.instagram.com/pferdetelepathie/) (Louisa) | ~9K | Tierkommunikation & Reflexion mit Pferd |

### Fitness / Reiterin-Körper (BBP-Zielgruppe)

| Account | Follower | Besonderheit |
|---|---|---|
| [@sonjaleitenstern](https://www.instagram.com/sonjaleitenstern/) | ~63K | Stark gewachsener Account; Zielgruppe passt zu Anikas BBP-Programm. Interessant wegen Wachstums-Dynamik und Content-Format. |

### Online-Kurs-Business Pferdegesundheit (Struktur-Benchmark)

| Account | Follower | Besonderheit |
|---|---|---|
| [@kernkompetenzpferd](https://www.instagram.com/kernkompetenzpferd/) (Dr. Veronika Klein) | ~43K | Pferdefachtierärztin, Pferdegesundheit, Community "KKP-Welt" (Kurse + Live-Q&As + Gastdozenten). Podcast "von Mensch mit Pferd zum Pferdemensch" >2 Mio Downloads. Creator Purpose Award 2026. **Primärer Content-Format-Benchmark für Anikas Kurs-Business** — kein Themen-Overlap, daher ideal zum Abschauen. Analyse via Content Radar empfohlen als erstes. |

### Gelände / Ausreiten mit Online-Kursen (Gelände-Schlüssel Wettbewerb)

| Account | Follower | Besonderheit |
|---|---|---|
| [@die.sandra.schneider](https://www.instagram.com/die.sandra.schneider/) (Sandra Schneider, westerntrainerin.com) | ~42K | Online-Kurs "Sicher ausreiten im Gelände" (7 Schritte, 7 Pferde, Boden+Sattel) + Extreme Trail. Direkter Themen-Wettbewerb zu Gelände-Schlüssel. |
| [@sandra.fencl](https://www.instagram.com/sandra.fencl/) | ~22K | Ganzheitliche Online-Pferdeausbildung (~50h Video + Live-Webinare), inkl. Gelände-Komponente für nicht-zuverlässige Pferde. |
| [mindfulhorseacademy.com](https://mindfulhorseacademy.com) (Instagram unbekannt) | ? | Kurs "Alleine ausreiten im Gelände" — direkter Themen-Wettbewerb. |
| [@equipsych](https://www.instagram.com/equipsych/) (Malu Abbink) | ? | Psychologin & Angstexpertin für Reiter; Online-Kurse zu Reitangst beim Ausreiten/Galoppieren/nach Unfall + Podcast + Reitcoach-Ausbildung. Interessant weil Reitangst im Gelände = Anikas Kernkundenproblem. |

### Sonstige Pferdetrainerinnen mit Online-Angebot

| Account | Besonderheit |
|---|---|
| [@kerstinrester.7p](https://www.instagram.com/kerstinrester.7p/) | ~23K, Bayern, 7P-Ranch |
| [@victory_horselove](https://www.instagram.com/victory_horselove/) | Diplom Pferdepsychologin, DACH |
| [@equihumana](https://www.instagram.com/equihumana/) | Pferdetrainerin + Psychologin für Reiter |

---

## Bildgenerierung via Gemini (User)

Anika nutzt für KI-Bildgenerierung **Gemini** (vorher Manus, aber Manus hat ca. August 2026 den kostenlosen Plan gestrichen, günstigster Plan $20/Monat).

**Why:** Claude kann keine fotorealistischen Bilder erzeugen; Anika weiß das und hat sich bewusst für Gemini entschieden.

**How to apply:** Wenn Anika Bilder braucht (z.B. für Reels, Karussells, Thumbnails), direkt vorschlagen, den Prompt für Gemini zu formulieren, statt selbst SVG/HTML-Ersatz zu bauen. Siehe auch [[feedback_carousel_posts]] und [[reference_thrivecart_thumbnails]].

---

## Webinar-Folien Design (Feedback)

**Wording-Standard:** immer „Notfallstrategien" in EINEM Wort (nicht „Notfall-Strategien"). Passt zu [[feedback-kein-bindestrich-vor-und]].

**Arbeitsteilung (festgelegt 2026-08-08):** Claude liefert nur den **folienfertigen TEXT** (pro Folie: Titel, Unterzeile, Bullets, getrennt der 🗣️ Sprechtext), Anika baut das **Layout selbst in ihrer eigenen Canva-Vorlage**. KEINE Folien mehr per KI generieren lassen — die Auto-Layouts (Schrift-/Weißraum-Aufteilung) entsprechen nicht Anikas Anspruch, sie ist selbst schneller und besser. Format-Beispiel: outputs/webinar-gelaende/folientext-phase1-kontext.md.

Falls doch mal in Canva gebaut wird, gelten diese Vorgaben:

- **Deko-Blüte/Blob-Elemente IMMER entfernen.** Der Canva-KI-Generator setzt oft eine Blüten-Deko in die Ecken. Anika mag sie nicht, überall raus.
- **Erdtöne, kein Blau.** Der `generate-design-structured`-Generator ignoriert das Brand Kit häufig und liefert ein blaues Design. Danach Hintergründe umfärben: Rost/Braun `#7B3F28` (dunkle Folien, weißer Text) bzw. Beige `#E6C5B4` (helle Folien, dunkler Text `#2C2C2C`). Schrift Montserrat. Farb-Referenz siehe outputs/modul1-folien-bauplan.md.
- **Hintergrund umfärben** geht per `recolor_element` auf die Page-Locator-ID. **Deko-Blüte (RECT mit Bild-Fill)** lässt sich NICHT recolorieren („rect-element cannot be recolored") → stattdessen `delete_element`.
- **Umfrage-Zitate wortwörtlich.** Der Generator formuliert Zitate um. Immer prüfen und die exakten O-Töne wieder einsetzen (mit vorangestelltem Satzanfang, z.B. „Meine größte Herausforderung mit dem Thema Gelände ist…").
- **Platzhalter** wie „Präsentiert von [Name hier]" entfernen.

**Why:** Anika baut ihre Präsentationen sonst selbst in Canva; sie will schnell selbst nachbearbeiten und erwartet, dass ich in ihrem Look baue statt im KI-Default.
**How to apply:** Bei jedem Canva-Folien-Bau fürs [[reference-webinar-playbook]] Gelände-Webinar diese Schritte gleich mitmachen, nicht erst auf Nachfrage.

---

## Content-Vorlauf 14 Tage: Absprache mit Anika (06.11.2026)

Vorbild Mentorin: Content ist immer 14 Tage im Voraus fertig, Anika nickt nur ab. Vorschlag: `outputs/content-maschine/vorschlag-content-vorlauf-14-tage.html`, von Anika am 06.11.2026 freigegeben.

- **Karussells Mo bis Fr**, je eins pro Tag, max. 10 Slides (Devine-Grenze).
- **Feed-Posts gehen um 7:00 raus**, über den Devine Social Planner auf Instagram UND Facebook-Seite „Anika Wesse“. Test-Reels postet Anika weiter selbst.
- **Freigabe-Status** je Karte: Entwurf → Wartet auf Freigabe → Freigegeben → Geplant → Gepostet. Nichts wird ohne Anikas Freigabe eingeplant.
- **Vorproduktion einmal pro Woche, montags früh**, füllt bis 21 Tage im Voraus auf. So fällt der Vorlauf im Lauf der Woche nie unter 14 Tage.
- **Codewort-Prüfung als Pflicht-Zwischenschritt:** Bei jedem Post mit Codewort prüfen, ob es dafür eine aktive ManyChat-Automation gibt (Instagram UND Facebook-Version). Fehlt sie oder ist sie ungeprüft, bekommt die Karte den Hinweis „⚠️ ManyChat-Automation fehlt“ und wird nicht eingeplant. Codewort-Tabelle im Skill backoffice (wissen.md, „ManyChat Automationen“) ist veraltet (Quiz und Gras fehlen) und muss einmal mit ManyChat abgeglichen werden.
- Devine-Social-Planner-API: `GET /social-media-posting/{locationId}/accounts` (Header Version 2021-07-28) liefert instagram anikas_pferdeakademie, facebook page Anika Wesse, youtube. Planner war am 06.11.2026 leer.

### Geprüfte ManyChat-Codewörter (Pflicht-Check vor jedem Codewort-Post)

Nur Codewörter mit ✅ bei Instagram UND Facebook dürfen in vorproduzierten Posts stehen. Alles andere bekommt den Hinweis „⚠️ ManyChat-Automation fehlt oder ungeprüft“ und wird nicht eingeplant. Bei jeder Prüfung in ManyChat (app.manychat.com → Automations, nur lesen) Datum nachtragen.

| Codewort (Auslöser „enthält“) | Automation | Instagram | Facebook | geprüft am |
|---|---|---|---|---|
| Quiz (quiz, qiz, plan) | Gelände-Quiz | ✅ | ✅ | 06.11.26 |
| Verlasspferd / Videotraining | TTP - Videotraining | ✅ | ✅ | 06.11.26 |
| Schlüssel / Gelände | Gelände-Schlüssel | ✅ | ✅ | 06.11.26 |
| Webinar | Gelände-Webinar | ✅ | ✅ | 06.11.26 |
| Gras | Gras-Videoanleitung mit E-Mail | ✅ | ✅ | 06.11.26 |
| Kappzaum | Podcast Gebiss mit E-Mail | ✅ | ✅ | 06.11.26 |
| Masterclass / Muskeln | Masterclass | ✅ | ✅ | 06.11.26 (Backend) |
| Offenstall, Konzept, Trail | Offenstall-Themen | ✅ | ✅ | 06.11.26 (Backend) |
| Keks | Höflichkeitsvideo | ✅ | ❌ | 06.11.26 |
| Karotte | Youtube Video alleine ausreiten | ✅ | ❌ | 06.11.26 |
| Respekt | Youtube Video respektloses Verhalten | ✅ | ❌ | 06.11.26 |
| Ute, Tiergespräch, Futterplan | Ute-Interview, Tiergespräch, Futter-Fahrplan | ✅ | ❌ | 06.11.26 |
| Check, Gruppe, Magie | keine Automation gefunden | ❌ | ❌ | 06.11.26 |

⚠️ Der Quiz-Auslöser enthält „plan“. Ein Kommentar „Futterplan“ löst deshalb auch das Quiz aus. Für Gelände-Posts kein Codewort mit „plan“ nehmen.

### B-Roll Shorts schneiden: Layout-Regel von Anika (06.11.2026)

- ⛔ **Situationstext NIE mittig** (sitzt dann auf dem Pferdekopf). Position hängt vom Clip ab: **oben**, wenn dort Himmel/Hintergrund frei ist, sonst **unten**, je nachdem wo Pferd und Anika NICHT sind. Pro Clip ein Standbild ansehen und die freie Zone wählen.
- Das erste Bild dient Anika oft als **Vorschaubild**, also muss der Situationstext dort gut lesbar sein und nichts Wichtiges verdecken.
- Steht die Situation anfangs unten, rutscht sie nach oben, sobald ❌ Ansatz 1 erscheint. Dann ❌ 1, danach ❌ 2 darunter.
- Anika korrigiert zur Not selbst, Ziel ist aber, dass sie nichts verschieben muss.
- **Im Zweifel unten anfangen:** Oben sitzt bei vielen Clips die Reiterin oder ein Kind. Nachkorrektur 10.11.: Rohclips `20261022_162303` (Kind auf Schimmel) und `20261016_153545` (Kind führt Rappe) immer mit Situation unten. `20250130_140557` (Schimmel, rotes Halfter) je nach Abschnitt: Kopf hoch → unten, frisst mit Kopf unten (ab 1 s) → oben. Darum jeden Abschnitt einzeln am Standbild prüfen, nicht pro Clip.
- Videos immer OHNE Ton (Musik legt Anika in Instagram drauf). Nach der Situation mehr Abstand (90 px) vor ❌ 1. Zum Schluss unten eine Box „Sondern 👇“ (Verweis auf die Lösung in der Caption).
- Rohclips müssen nicht vorgeschnitten sein. Anika legt ganze Clips ab, die Redaktion sucht sich ruhige Abschnitte (auch mehrere Abschnitte aus einem Clip) und schneidet selbst auf Länge.
- Vor dem ersten Batch ein Testvideo zur Abnahme des Looks.

### Karussell-Korrekturen: Content-Maschine ist die Vorlage (10.11.2026)

Anika korrigiert Slide-Texte und Caption direkt in der Content-Maschine und gibt dann frei. Canva gleicht die Redaktion an: Vor jedem Export (Schritt A der Content-Vorproduktion) werden die Canva-Texte mit dem Feld `slides` verglichen und abweichende Slides ersetzt, Kästen bei längeren Texten vergrößert. Anika muss Canva nie selbst anfassen.

### B-Roll-Shorts: Posten und Gewinner (10.11.2026)

- Ein Thema pro Tag, 5 Shorts als Testreels. Anika postet sie selbst in der Handy-App (am PC gibt es keinen Testreel-Schalter, Devine kann keine Testreels). Ordner `Fertig\MM-TT Titel` heißen nach dem Post-Datum, Anika zieht sie per Kabel aufs Handy.
- Zwei Tage später plant die geplante Aufgabe **Shorts-Gewinner einplanen** (täglich 8:00, `node scripts/shorts-gewinner.mjs auto`) das Short mit den meisten Aufrufen als Feed-Reel um **18:00** auf IG + FB ein, **ohne Musik** (Anika: „Devine ohne Musik“). Zuordnung Testreel ↔ Datei über das Vorschaubild; ist sie unsicher, wird nichts eingeplant.
- Warum nicht das Testreel mit Musik herunterladen: Über die Instagram-Schnittstelle sind 49 von 58 Testreels gar nicht abrufbar, die abrufbaren Reels kommen fast immer ohne Ton und nur in 720p (getestet 10.11.).

### Short-Texte: Anikas Korrekturen (06.11.2026, 12 Shorts, 7 davon geändert)

- **Situation aus Sicht ihres Wunsches oder ihrer Sorge, nicht als Befund.** ❌ „…aber dein Pferd nach jeder Runde einen immer tieferen Rücken bekommt.“ ✅ „…aber Angst hast, dem Rücken deines Pferdes zu schaden.“
- **Nicht dramatisieren, auch positive Motive zählen.** ❌ „…und schon beim Satteln nervös wirst.“ ✅ „…und sicher gehen willst, dass du gut vorbereitet bist.“
- **Pferdeverhalten in Alltagssprache:** ✅ „dieselbe Stelle gruselig findet“ statt „an derselben Stelle angespannt wird“.
- **Keine fremden Meinungen in die Situation packen.** ❌ „…und alle sagen, es ist einfach nur stur.“ ✅ „…und keinen Schritt vom Hof machen will.“ Nur das Verhalten zeigen.
- **Beim ❌-Ansatz das echte Motiv der Reiterin nennen:** „um es abzulenken“, „wieder aufmerksam zu machen“ statt bildhafter Unterstellungen wie „damit es dranbleibt“ oder „wieder einzufangen“.
- **❌-Ansatz als Gewohnheit, nicht als Bild:** ✅ „Dich nur noch hinter einem erfahrenen Pferd raus zu trauen.“ statt „…zu verstecken und hinterherzulaufen“. ✅ „…die Runde zu schaffen“ statt „…loszureiten“.

### Vorproduktion 09.11.2026 (Montag, automatisch)

- Gebaut in „Karussell-Posts 2026“: Traktor-entgegen/Quiz (9) DAHaZdz-GCQ Bild MAHZNqMSaj4 (Schimmel im Paddock) für 24.11. und Grasziehen/Gras (10) DAHaZUA_h1o Bild MAGRL4aoB8I (Anika mit Rappe am Stall) für 26.11.
- ⚠️ Bild-Check: MAGxDkWNr8c und MAGaMvxVeR0 sind Familienfotos (Mann, Baby, Hund), passen nicht für Gelände-Karussells. MAGIF01sbMg ist ein Schimmel von hinten mit Anika, wirkt neben MAHZNqMSaj4 zu ähnlich.
- Die Content-Maschine hat keinen CTA-Wert für Gras oder Kappzaum. Gras-Karten bekommen deshalb cta „—“, das Codewort steht in Caption und letzter Slide.
- Mehrere Karussell-Karten im Planer (10.11., 12.11., 16.11., 23.11., 25.11.) stehen auf Status „Idee“ ohne Canva-Link im Feld `medien`, obwohl die Designs am 27.10. gebaut wurden. Beim Einplanen über Devine fehlt dann der Link.

## Psychologische Prinzipien für alle Skripte (Anika, 09.11.2026)

**Regel:** Bei jedem Skript (Reel, Yapping, B-Roll-Short, Karussell, Caption) diese Prinzipien mitdenken. Quelle: Karussell von @sarah_menges, das Anika weitergegeben hat.

Nicht alle 17 in einen Text packen. Pro Skript bewusst 3 bis 5 auswählen, die zum Format passen, und vor der Abgabe kurz prüfen, welche drin sind.

| Prinzip | Was es heißt | So nutzen wir es im Gelände-Content |
|---|---|---|
| **Pattern Interrupt** | Etwas Unerwartetes stoppt das Scrollen | Erster Satz oder erstes Bild bricht das Gewohnte, z.B. „Hör auf, dein Pferd am Traktor vorbeizuführen.“ |
| **Zeigarnik-Effekt (Open Loops)** | Offene Fragen wollen geschlossen werden | Früh eine Frage aufmachen und erst am Ende auflösen („Warum das bei Stuten anders läuft, sage ich dir gleich.“) |
| **Concreteness** | Konkret schlägt abstrakt | Flatterband, Mülltonne, Radfahrer von hinten statt „schwierige Situationen“ |
| **Mere-Exposure-Effekt** | Was man oft sieht, wird vertraut | Wiederkehrende Begriffe (Verlasspferd, Sicherheitsanker, Pferdemagnet) und gleiche Formate immer wieder zeigen |
| **Reziprozität** | Wer etwas bekommt, will etwas zurückgeben | Echten Mehrwert verschenken (eine Übung zum Sofort-Umsetzen), bevor ein CTA kommt |
| **Violation of Expectation** | Gegen die Erwartung überrascht und bleibt hängen | Gängige Tipps drehen („Mehr Gelände ist nicht die Lösung.“) |
| **Kontrast-Effekt** | Vorher/Nachher macht den Unterschied sichtbar | Pferd klebt am Hof vs. entspannt allein im Wald; Szene A gegen Szene B |
| **Commitment-Konsistenz** | Kleines Ja führt zu größerem Ja | Kleine Mitmach-Aufforderung („Schreib mir ‚Wald‘, wenn …“), Kommentar-Codewörter |
| **Social Proof** | Andere haben es geschafft | Nur **echte** Kundinnen-Fälle zum Gelände-Thema (keine erfundenen, keine Traumteam-Fälle) |
| **Ankereffekt** | Die erste Zahl prägt die Bewertung | Zahlen bewusst setzen, z.B. „6 Jahre Reitbeteiligung, 3 Wochen Training“ |
| **Verlustaversion** | Verlieren wiegt schwerer als Gewinnen | Zeigen, was ohne Lösung bleibt: verpasste Ausritte, der Sommer am Platz |
| **Autoritätsprinzip** | Expertise schafft Vertrauen | Anikas Erfahrung zeigen (500+ Teams), Fachwissen in einem Satz erklären |
| **Sympathie-Prinzip** | Wir folgen Menschen, die wir mögen | Persönliche Momente, eigene Fehler, Anikas Humor und Stall-Alltag |
| **Knappheitsprinzip** | Begrenztes wirkt wertvoller | Nur bei **echter** Frist (Webinar-Termin, Launch-Ende), nie erfunden |
| **Peak-End-Regel** | Höhepunkt und Ende bleiben in Erinnerung | Stärkster Moment in der Mitte, starker letzter Satz statt ausfransendem Ende |
| **Storytelling-Effekt** | Geschichten bleiben besser als Fakten | Fakten in eine kurze Szene packen (Tina, ihre Stute, der Feldweg) |
| **Primacy** | Das Erste wird am stärksten erinnert | Die wichtigste Aussage gehört in den ersten Satz oder auf die erste Folie |

Die übrigen Regeln gelten weiter: Humanizer, keine Gedankenstriche, Wording-Don'ts.
