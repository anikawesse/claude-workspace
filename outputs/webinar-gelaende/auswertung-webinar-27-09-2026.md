# Gelände-Webinar 27.09.2026: Auswertung

Quellen: Zoom-Export `Meetinglistdetails_2026_09_27_2026_09_28.csv`, Devine-Export `Export_Contacts_All_Sep_2026_9_50_AM.csv` (beide Desktop, 28.09.), Meta-API (Ad-Spend). Webinar 19:00:19 bis 20:58:36 (119 Min), Pitch-Start nach 59 Min (≈ 19:59).

## Kernzahlen

| Kennzahl | 27.09.2026 | 23.08.2026 |
|---|---|---|
| Anmeldungen gesamt | **150** | 348 |
| davon organisch (Tag `gelände webinar 09.26`) | 82 | 165 |
| davon Ads (Tag `gelände webinar ads 09.26`) | 71 | 192 |
| Überschneidung org/Ads | 3 | 9 |
| Ad-Spend Webinar | **535,32 €** | 1.124,64 € |
| Kosten pro Ads-Anmeldung | 7,54 € (71) · 9,39 € je neuem Kontakt (57) | 5,86 € |
| Live-Teilnehmer (eindeutig, bereinigt) | **ca. 47** | 141 |
| Show-up-Rate | **31 %** | 40,5 % |
| davon länger als 5 Min dabei | 43 | – |
| Peak gleichzeitig | 40 (19:43) | – |
| Anwesend beim Pitch-Start | **35** (19:59, nach 59 Min) | 110 (nach 75 Min) |
| Anwesend 20:30 | 33 | – |
| Anwesend am Ende | 13 | 27 |
| Ø Verweildauer (Personen ≥ 5 Min) | ca. 87 Min | 98 Min |

**Bereinigung Zoom:** 49 verschiedene Anzeigenamen, 72 Einwahlen. Zusammengelegt: „Barbara Hammer’s iPhone" = Barbara Hammer, „iPhone von Corinna" = Corinna Drave (vermutlich), „S25 FE von SIMONE" = Simone (vermutlich). Getrennt gezählt: 2× „Zoom-Benutzer", 2× „Petra" (gleichzeitig drin). → ca. 47 Personen.

## Ads: Kampagnen liefen nur bis 22.09.

| Kampagne | Zeitraum | Spend |
|---|---|---|
| Gelände Webinar Sandkasten – August | 14.–17.09. | 224,39 € |
| Gelände Webinar Interessen – September | 17.–22.09. | 206,79 € |
| Gelände Webinar Broad – September | 17.–22.09. | 104,14 € |

Neue Ads-Kontakte kamen nur vom 14. bis 21.09. (5–9 pro Tag). **In den letzten 5 Tagen vor dem Webinar kamen keine neuen Ads-Anmeldungen mehr**, weil ab dem 22.09. kein Budget mehr lief. Im August hat sich eine der beiden Ads-Käuferinnen 1 Tag vor dem Webinar angemeldet.

## Wer ist erschienen: organisch oder Ads?

Zoom liefert keine E-Mails, deshalb nur über den Namensabgleich. Eindeutig zuordenbar sind 21 Personen: **18 organisch, 3 Ads** (Barbara, Sonja, Birgit). Ein grober Hinweis, keine exakte Zahl, aber er zeigt deutlich: **die Live-Runde bestand fast nur aus organischen Anmeldungen.** Ads-Leads (57 von 71 ganz neue Kontakte) sind kaum erschienen.

Organisch: 38 der 82 waren schon im August angemeldet, 28 besitzen den Gelände-Schlüssel. Nur 9 organische Anmeldungen sind ganz neue Kontakte.

## Show-up nach Quelle (Zoom-Link-Klick-Proxy, 05.10.)

Methode wie Aug: alle Zoom-Link-Klicker aus den 4 Webinar-Mails (24.–27.09.) + der „Wir sind live"-Mail an den Gesamtbestand, dedupliziert, über die Devine-Tags `gelände webinar 09.26` (82) / `gelände webinar ads 09.26` (71) der Quelle zugeordnet.

- **Organisch: 28 Klicker → 34,1 %** (von 82)
- **Ads: 2 Klicker → 2,8 %** (von 71)
- **31 Klicker ohne Webinar-Anmeldung:** Bestandskontakte, die nur über die „Wir sind live"-Mail an den Gesamtbestand kamen (zählen beim Quellen-Split nicht mit).

**Deutliches Bild:** Die Ads-Leads sind so gut wie gar nicht erschienen (2 von 71), die organischen dagegen ordentlich (34 %). Ein großer Teil der ~47 Live-Zuschauer kam über die „Wir sind live"-Blast an den Gesamtbestand, nicht über die getrackten Anmeldungen — der Gesamtlisten-Live-Link ([[feedback-webinar-livelink-gesamtliste]]) trägt also spürbar. Der grobe Namensabgleich (18 org / 3 Ads) wird durch diesen Proxy bestätigt: Ads-Show-up ist minimal.

⚠️ Datenhinweis: Die Desktop-Ordner „Ads klicker" und „organisch klicker" enthielten **identische Dateien** (beide organisch). Der Split lief über die Devine-Tag-Listen (API). Ads-Reminder-Klicker fehlen → die Ads-Zahl (2) ist nur eine Untergrenze aus der Live-Blast, der echte Ads-Export steht noch aus.

### ⭐ ROOT CAUSE des schlechten Ads-Show-ups (05.10.)

Anika hat die **Vorfreude-/Reminder-Automation und die Webinar-Ads-Automation nur im organischen Bereich gebaut und für die Ads-Registrierten vergessen.** Die 71 Ads-Leads bekamen bis zur „Wir sind live"-Blast (an den Gesamtbestand) **keine einzige** Erinnerungs-/Vorfreude-Mail → sie haben das Webinar schlicht vergessen. Deshalb Ads-Show-up ~2,8 % gegen organisch 34 %.

**Konsequenz für die Bewertung:** Die Ads sind NICHT als schlechte Lead-Quelle zu werten — der Test war durch die fehlende Aktivierung ungültig. CPL 7,54 € war gut. **Nächster Launch (25.10.): Ads-Automationen 1:1 spiegeln** (Vorfreude-Strecke + Reminder-Timing auf den Ads-Tag), dann realistischer Sprung Richtung organisches Show-up-Niveau.

## Verlauf (gleichzeitig anwesend)

19:05 28 · 19:15 31 · 19:30 36 · **19:43 40 (Peak)** · **19:59 35 (Pitch)** · 20:15 31 · 20:30 33 · 20:40 26 · 20:45 21 · 20:50 17 · 20:58 13

- Pitch-Haltequote: 35 von 47 Personen waren beim Pitch-Start da (74 %, August 78 %).
- Während des Pitchs bis 20:30 kaum Abgang (35 → 33). Erst ab 20:35 geht es deutlich runter (Q&A/Abschluss).

## Durchgehalten bis zum Schluss (≥ 110 Min)

Bianca Willems, Birgit, Sonja Lemberger, Simone, Barbara Hammer, Christine, iPhone Babs, iPhone von frank braeunling, Anne Rührer (mehrfach neu eingewählt), Andrea Schäfer, Simone Pruefig, Sophie, Corinna Drave. → heißeste Leads für Verkaufsmails/Gespräche.

## Verkäufe (Zwischenstand laut Anika, 30.09.)

| Nr. | Wann | Wie | Was (brutto) | Quelle |
|---|---|---|---|---|
| 1 | Mo 28.09. | nach Telefonat | Gelände-Programm 549 € Einmalzahlung + Freiarbeitskurs 97 € | organisch |
| 2 | Mi 30.09. | nach der FAQ-Mail | Gelände-Programm 549 € Einmalzahlung | organisch |

→ 2 Programm-Käufe (1.098 € brutto) + 97 € Zusatzumsatz. Gesprächstermine: 2 geführt, 1 gekauft (das zweite Gespräch Di 29.09. war JG, die Kritikerin aus dem Webinar, kein Kaufinteresse). Ads-Käufe: bisher 0.

### Finale Zahlen aus ThriveCart (Stand 05.10.)

ThriveCart-API (Produkt 44 = Gelände-Programm, Produkt 42 = VIP):

- **Programm (549 €):** nur **1 Verkauf in ThriveCart** (30.09. 11:51, 549 €, **0 % USt** = Reverse Charge/Ausland, netto = brutto = 549). Verkauf 1 (Telefonat, 28.09.) und der 97-€-Freiarbeitskurs sind **nicht in ThriveCart** → liefen außerhalb (Rechnung/Digistore). Programm-Netto gesamt in der Tabelle: **1.010,34 €** (549,00 + 461,34; V1 mit 19 % angenommen).
- **VIP-Paket (9 €):** **5 Verkäufe** (16./21./26./27.09.×2), Netto 5 × 7,56 = **37,80 €**.
- **Cross-Sell Freiarbeitskurs:** 1 × 97 € brutto (81,51 € netto), außerhalb ThriveCart.
- **Checkout Bezahlseite Produkt 44** (Dashboard, 23.09.–02.10.): **12 Aufrufe → 1 Bestellung** (Conversion 8,3 %). Die 1 Bestellung = der ThriveCart-549er; Verkauf 1 lief nicht über die Bezahlseite, daher 1 statt 2.

## Verkaufsstrecke: Öffnungs- und Klickraten (8 Mails)

Quelle: Devine-Exporte `Salesmails Gelände-Programm_stats_delivered*.csv` (Desktop, 05.10.2026). Reihenfolge über Zustell-Zeitstempel. Öffner = eindeutige Öffner inkl. Klicker und Antworter. Öffnungsrate = Öffner ÷ Zugestellte. Klickrate = Klicks ÷ Zugestellte.

| Mail | Versand | Zugestellt | Öffner | ÖffnR | Klicks | KlickR | Abm. | Verkauf |
|---|---|---|---|---|---|---|---|---|
| 1 nach Webinar | 27.09. 21:07 | 145 | 69 | 47,6% | 10 | 6,9% | 5 | – |
| 2 | 28.09. 07:00 | 141 | 65 | 46,1% | 6 | 4,3% | 5 | – |
| 3 | 28.09. 20:02 | 136 | 57 | 41,9% | 7 | 5,1% | 5 | – |
| 4 | 29.09. 07:00 | 130 | 59 | 45,4% | 4 | 3,1% | 3 (1 Antwort) | – |
| 5 FAQ | 30.09. 07:00 | 122 | 56 | 45,9% | 4 | 3,3% | 2 (2 Antw.) | ✅ Verkauf 2 (549 €) |
| 6 | 01.10. 07:00 | 119 | 39 | 32,8% | 6 | 5,0% | 3 | – |
| 7 | 01.10. 13:00 | 116 | 44 | 37,9% | 3 | 2,6% | 0 | – |
| 8 Last Call | 01.10. 20:00 | 115 | 35 | 30,4% | 1 | 0,9% | 0 | – |

**Verkaufszuordnung:** Verkauf 2 (Mi 30.09.) kam über die FAQ-Mail (Mail 5). Verkauf 1 (Mo 28.09.) lief über das Telefonat, nicht direkt über eine Mail. Preis Programm = 549 € brutto.

**Learnings:**
- Öffnungsraten stark (42–48 % über die ersten 5 Mails), typische Ermüdung erst am letzten Tag (30–38 %).
- ⚠️ Am letzten Verkaufstag (01.10.) FIEL die Klickrate von Mail zu Mail (5,0 % → 2,6 % → 0,9 %), entgegen der Sophie-Beckmann-Regel (Klickrate soll steigen). Last Call = nur 1 Klick. → Last-Day-Mails, v.a. Last Call, nachschärfen.
- Der einzige Mailkauf kam über die sachliche FAQ-Mail, nicht über die Dringlichkeits-Mails am Schluss.
- Zustellbasis schrumpft über die Strecke von 145 auf 115 (Abmeldungen/Entfernungen).

### Vergleich zum Aug-Launch (Anika hat die Mails überarbeitet)

Sep-Betreffzeilen (neues Gelände-/Baum-Framing 🌳): M1 „Die Türen zum Gelände-Programm sind offen" · M2 „❤️ Das erleben meine Schülerinnen im Gelände" · M3 „⏳ Um Mitternacht ist dein Bonus weg" · M4 „📋 Kurseinblicke ins Gelände-Programm" · M5 „🖊️ Dein Name fehlt auf meiner Liste" · M6 „❓ Hilft mir das beim Ausreiten?" · M7 (NEU, versteckter Bonus) „🎁 Ich schenke dir noch was dazu" · M8 Ende „😍 Du willst es doch auch".

- **Klickrate stieg oder hielt in 6 von 7 vergleichbaren Mails.** Größter Sprung: **M6 Einwand 1,7 % → 5,0 %** (Reframe „Hilft mir das beim Ausreiten?" statt „Schaffe ich das wirklich alleine?" — die Ausreiten-Relevanz zieht). Außerdem M3 4,1→5,1, M4 2,0→3,1, M7 2,4→2,6. Nur **M1 fiel** (Klick 10,8→6,9, Öffnung 60,8→47,6).
- Öffnungsraten sonst ~flach (Differenzen ≤2 pp).
- **Neue Mail 7 „versteckter Bonus" öffnete 37,9 %** (besser als die finale Mail) → guter Zug am letzten Tag; die finale M8 fiel erwartbar auf 0,9 % Klick.
- ⚠️ **Abmelderate deutlich höher:** 23/145 = **15,9 %** (Aug 27/332 = 8,1 %), plus Soft-Opt-out 10/145 = 6,9 % (Aug 6/332 = 1,8 %, läuft noch). Die kleinere, wärmere und mehrfach angeschriebene Liste churnt stärker.
- ⚠️ **Kein sauberer A/B-Test:** Sep-Liste war halb so groß, weniger Live (47 vs 141, u. a. Ads-Automationslücke), mehr Wiederholer. Die Unterschiede spiegeln also Copy UND Publikum, nicht nur die Mail-Änderungen.

## Offen

- Netto-Basis klären: Verkauf 2 hatte 0 % USt (549 netto), Verkauf 1 mit 19 % angenommen (461,34). Falls V1 anders, Programm-Netto anpassen.
- Downsell-Mails starten 05.10. → Zahlen folgen.
- Storno-Fenster (14 Tage ab 28.09./30.09.) läuft bis ~14.10. → Netto-Käufe erst danach final.
- Opt-in-/Salespage-Aufrufe nur im Browser ablesbar (Devine-API 401).
- Warum liefen die Ads nur bis 22.09.? (Budget/Laufzeit bewusst so gesetzt?)

## Abschließendes Fazit (05.10.2026)

**Das Ergebnis in Zahlen:** 150 Anmeldungen (82 organisch / 71 Ads, Ad-Spend 535,32 €, CPL 7,54 €), ~47 live (31 % Show-up). Verkäufe: 2× Gelände-Programm (netto 1.010,34 €) + 5× VIP (37,80 €) + 1× Freiarbeitskurs-Cross-Sell (97 € brutto). Gesamt-Nettoumsatz 1.048,14 €, Gewinn grob 512,82 €, Gesamt-ROAS 1,96. Beide Programmkäufe organisch, einer nach Telefonat, einer über die FAQ-Mail.

**Der eine große Befund:** Die schwache Runde lag nicht an schlechten Leads, sondern an einem **Setup-Fehler** — die Vorfreude-/Reminder-Automation lief nur organisch, für die 71 Ads-Leads gab es keine. Ergebnis: Ads-Show-up 2,8 % gegen organisch 34,1 %. Der teuerste, aber auch am leichtesten behebbare Fehler. Die Automation ist inzwischen gespiegelt, der Hebel steht für den 25.10. bereit.

**Was gut lief:**
- Organische Leads sind Gold: 34 % Show-up, beide Käufe, der stärkste Lead-Kanal. Der Gesamtlisten-Live-Link holte zusätzlich viele Bestandskontakte rein.
- Die überarbeiteten Verkaufsmails haben die Klickrate in 6 von 7 Mails gehalten oder gesteigert; der Reframe „Hilft mir das beim Ausreiten?" (M6) und die neue Bonus-Mail (M7) sind klare Keeper.
- Wirtschaftlich leicht positiv trotz halbierter Liste und Aktivierungsfehler.

**Was zu verbessern ist:**
- Ads-Automation spiegeln ✅ (erledigt) und Ads länger laufen lassen — diesmal war ab 22.09. fünf Tage Funkstille vor dem Webinar.
- Mehr Live = mehr Verkäufe: Die organische Show-up-Zahl zeigt, dass aktivierte Leads kommen. Mit aktivierten Ads-Leads wäre die Live-Runde und damit die Verkaufsbasis deutlich größer gewesen.
- Abmelderate im Blick behalten (15,9 % + 6,9 % Soft-Opt-out), aber: Wiederholer-Anmeldungen = echtes Interesse, Abmelder = gesunde Selbstselektion.

**Unterm Strich:** Eine kleine, durch einen vermeidbaren Automationsfehler gebremste Runde, die trotzdem schwarze Zahlen schrieb und zwei starke, übertragbare Learnings liefert (Ausreiten-Reframe + Ads-Aktivierung). Kein Grund zur Sorge wegen der Ads — der nächste Launch am 25.10. hat mit der gespiegelten Automation realistisch das Potenzial, die Live-Runde und die Verkäufe spürbar zu heben.
