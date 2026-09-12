# /gelaende-call — Live-Call aus dem Gelände-Programm auswerten

Werte einen wöchentlichen Live-Call des Gelände-Programms aus. Zwei Ziele: (1) Kundinnen-Infos ins Google Doc, (2) Marketing-Material sammeln.

**Argument (optional):** Pfad zur .vtt-Datei. Ohne Argument die neueste `GMT*Recording.transcript.vtt` (bzw. neueste .vtt) auf dem Desktop (`C:\Users\Olive\Desktop`) nehmen und das gefundene Datum/Datei kurz bestätigen.

**Feste IDs:**
- Google Doc „Gelände-Programm — Call-Notizen Kundinnen": fileId `1PCKEAOxnaiTGQByD4fDyUjWcm67HV3vqOw0Emxi6u9Y` (Drive: 3. Kunden)
- Webapp-URL: `GELAENDE_DOC_WEBAPP_URL` in `scripts\.env`

## Schritte

1. **Transkript einlesen und sichern.** Die .vtt lesen, von Timestamps befreien und als `outputs/gelaende-calls/transkripte/JJJJ-MM-TT-call-transkript.md` speichern (Datum aus Dateiname/Inhalt). ⚠️ Anikas eigene Tonspur ist in Zoom-Transkripten oft lückenhaft — dann auf Kundinnen-Aussagen stützen und den Vorbehalt in der Zusammenfassung kurz erwähnen.

2. **Pro Kundin extrahieren:** Name (Vorname + abgekürzter Nachname), Pferdename, besprochenes Thema/Frage, aktueller Stand/Fortschritt, Anikas Empfehlung, offene Punkte. Unsichere Namenszuordnungen kennzeichnen statt raten.

3. **Google Doc auf Handänderungen prüfen.** Das Doc per Drive-MCP (`read_file_content`, fileId oben) lesen und mit `outputs/gelaende-calls/kundinnen-uebersicht.md` abgleichen. Hat Anika im Doc etwas geändert oder ergänzt, ihre Änderungen ZUERST in die Master-Datei übernehmen (das Doc wird gleich komplett überschrieben — nichts von ihr verlieren, gleiche Lektion wie beim exceljs-Generator).

4. **Master-Datei aktualisieren** (`outputs/gelaende-calls/kundinnen-uebersicht.md`): neue Kundinnen als eigenen Abschnitt anlegen (Vorlage im Kommentar der Datei, alphabetisch nach Vorname), bei bekannten Kundinnen „Aktueller Stand" anpassen und den Call als datierten Bullet unter „Calls" ergänzen. Stand-Zeile oben auf das Call-Datum setzen. Texte scanbar: kurz, Schlüsselstellen fett.

5. **Ins Google Doc pushen:**
   ```
   powershell -File scripts\gelaende-call-doc-update.ps1
   ```
   Fehlt `GELAENDE_DOC_WEBAPP_URL` in `scripts\.env`, ist das Apps-Script noch nicht deployed → Anika auf die Einbau-Anleitung in `scripts/google-doc-call-notizen.gs` hinweisen (Doc öffnen → Erweiterungen → Apps Script, wie bei der Ads-Tabelle).

6. **Marketing-Insights ergänzen** (`outputs/gelaende-calls/marketing-insights.md`), neueste oben, immer mit Datum:
   - **O-Töne & Erfolge:** wörtliche Zitate + Aha-Momente (Name, Pferd, Kontext). Nur echte Aussagen, nie geglättet erfinden.
   - **Einwände & Ängste:** Zweifel und Blockaden, besonders „online/alleine umsetzbar?" (Tinas Kern-Einwand). Häufungen markieren → Kandidaten für die 3 Einwand-Content-Blöcke im Webinar.
   - **Häufige Fragen & Themen:** wiederkehrende Praxisfragen als Content-/Reel-Ideen und Kurs-Lücken; bei Wiederholung Zähler hochsetzen.
   - **Tina-Abgleich:** Abweichungen vom Avatar + Original-Wording der Kundinnen.

7. **Kurzbericht an Anika:** Welche Kundinnen besprochen wurden (1 Zeile je Kundin), was im Doc aktualisiert wurde (mit Doc-Link), und die 2-3 stärksten Marketing-Takeaways des Calls (z.B. „dieses Zitat wäre ein Testimonial", „dieser Einwand kam zum 3. Mal → Webinar-Block"). Keine Fixes an Webinar/Salespage direkt vornehmen — Verwertung schlägt Claude nur vor.
