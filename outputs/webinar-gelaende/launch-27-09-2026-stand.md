# Gelände-Webinar Launch — Stand 14.09.2026

**Termin:** Sonntag, 27.09.2026, 19:00 Uhr (live). Alles um genau +5 Wochen (35 Tage) gegenüber dem letzten Launch (23.08.) verschoben → alle Wochentage bleiben gleich.

## Eckdaten der neuen Runde
- Webinar: So 27.09.2026, 19:00
- Selfie-Mail: Fr 25. / Sa 26.09.
- Appell (1 Tag vorher): Sa 26.09.
- Tag des Webinars: So 27.09. (nachmittags)
- 2 Std vorher: So 27.09., 17:00
- 15 Min vorher: So 27.09., 18:45
- Live-jetzt an Gesamtliste: So 27.09., ca. 19:00
- Frühbucher-Bonus (24 h): bis Mo 28.09., 23:59
- Verkaufsmails: FAQ Mi 30.09. · Einwand Do 01.10. vormittags · Lastcall Do 01.10. abends
- Cart-Close (Programm): Do 01.10.2026, 23:59
- Downsell „Geländepaket" Deadline: Mi 07.10.2026, Mitternacht

## Was aktualisiert wurde (Dateien in outputs/)
- **Alle Webinar-Mails/Folien/Ads** (webinar-gelaende/, 44 Ersetzungen) auf +35 Tage.
- **optin-organisch.html** + **optin-ads.html**: Datum 27.09., Countdown-Ziel `2026-09-27T19:00:00`, Bullet „…bis zum entspannten **Ausritt**." (war „Spaziergang"), **neue Formulare** eingebunden:
  - Organisch: `quFp7u3wv2sEIoIQQmfx`
  - Ads: `UIyxRQnDfiVIUcjS7DeQ`
- **salespage.html** (Programm): kein Datum/Countdown enthalten → nichts zu ändern.
- **gelaende-programm/salespage-gelaendepaket.html** (Downsell): Deadline 4× auf Mi 07.10.2026.

## Devine-Automation „Gelände Webinar"
- Feld **`webinardatum_gelaende` = Specific Date = 2026-09-27** (Aktion „Kontakt aktualisieren" oben) → steuert alle dynamischen Wait-Schritte automatisch mit.
- **Reminder-Timing-Regel** (Feld ist reines Datum = intern 00:00 Uhr):
  - Ganze Tage vorher → „Vor diesem Datum": X Tage
  - Uhrzeit am Webinar-Tag → „**Nach** diesem Datum": so viele Stunden wie die Uhrzeit (17:00 = 17 Std, 18:45 = 18 Std 45 Min, 19:00 = 19 Std)
  - Bei jedem Datums-Wait unten: „Falls verstrichen → Outbound überspringen".
- **Neue Formulare** (organisch + Ads, Duplikate) im **Trigger** eingetragen (ausgetauscht). **Trigger-Links** mussten NICHT geändert werden (hängen nicht am Formular).

## Einladungs-Mail-Auswahl (Liste schonen: nur 4 statt 8)
Letzter Launch = 8 Einladungs-Mails an die Liste. Auswertung (Klicks):

| Mail | Datum | Klicks | Klickrate | Abm. |
|---|---|---|---|---|
| 1. Einladung | 05.08. | 61 | 1,8 % | 13 |
| 2. Einladung | 09.08. | **70** | 3,1 % | 7 |
| 3. Einladung | 12.08. | 61 | 1,8 % | 15 |
| 4. Einladung | 14.08. | 28 | 1,2 % | 3 |
| 5. Einladung | 17.08. | 34 | 1,5 % | 3 |
| 6. Einladung | 19.08. | 23 | 1,1 % | 3 |
| 7. Einladung | 21.08. | 28 | 1,3 % | 9 |
| 8. Webinar-Tag | 23.08. | 52 | 1,5 % | 9 |

Gesamt 357 Klicks. **BEHALTEN (4): Nr. 1, Nr. 2, Nr. 3, Nr. 8 (Webinar-Tag).** Diese 4 = 244 Klicks = 68 %. **WEGLASSEN: Nr. 4, 5, 6, 7** (zusammen nur 113 Klicks). Anika plant gerade genau diese 4 ein.
- Verteilung neu: Nr. 1 ~10 Tage vorher, Nr. 2 ~5 Tage vorher, Nr. 3 2–3 Tage vorher, Webinar-Tag-Mail am Morgen 27.09.
- ⏭️ offen: Betreff/Blickwinkel von Nr. 2 (Klick-Königin) als Muster festhalten; die 4 Texte ggf. noch polieren.

## Noch offen (Anikas To-dos)
- Reminder-Zeiten der kurz-vorher-Mails prüfen (Nach-diesem-Datum-Regel).
- Text-Datum in den Mails prüfen (falls fest eingetippt statt Platzhalter) → aus den aktualisierten Entwürfen neu einfügen.
- Countdown-Timer prüfen (Cart-Close 01.10.).
- Webinar-Raum (Zoom/WebinarKit) für 27.09. 19:00 anlegen, Link ins Feld `webinar_link`; Zoom-Verbindung checken.
- Neuer Launch-Tag für diese Runde.
