# Wissen der Stelle (aus der Memory umgezogen am 06.11.2026)

Diese Einträge standen vorher einzeln in der Memory. Inhalt 1:1 übernommen. Neue Learnings für diesen Bereich hier unten ergänzen, nicht mehr in der Memory.

---

## Wasser-Kurs

Anika dreht einen neuen Kurs: **Entspannt mit dem Pferd durchs Wasser** (zuerst beim Spaziergang, Reiten erst am Ende). Passt in die Gelände-Positionierung, gleiche DNA wie der [[gelaendeschluessel]] (Mini-Kurs mit Plan + Checklisten, noch offen).

- Outline + Stichpunkte Modul 1/2: `outputs/wasser-kurs/kurs-outline.md`
- 7 Module: 1 Warum Wasser ein Ding ist → 2 Basics ohne Wasser → 3 Wasser zuhause → 4 erste echte Wasserstelle → 5 festigen/steigern → 6 in den Sattel → 7 Troubleshooting
- Stand 16.09.2026: Modul 1 (ein Video) und Modul 2 eingesprochen; Modul-2-Aufnahme hatte Opus-Audio-Problem → repariert (siehe [[vimeo-opus-fix]])
- ⚠️ Ab Modul 3 filmt Anika draußen und spricht spontan → KEINE weiteren Stichpunkte-Skripte nötig, außer sie fragt danach
- Marketing: Hölle→Himmel-Transformations-Bullets (7 Paare + kompakte Benefit-Liste) in `outputs/wasser-kurs/transformation-bullets.md` (20.09.2026, zur Auswahl); ⚠️ nie „liebt Wasser" versprechen, Kursziel = dulden statt lieben
- Offen: Positionierung im Funnel (Preis, Frontend/Backend), Workbook-Beilagen (2-Wochen-Pfützen-Plan, Stellen-Check-Liste)

---

## Video-Stabilisierung Lehrfilme

Anikas Gelände-Lehrvideos (Mitlauf-Aufnahmen, Mann filmt) wackeln; Premiere Elements' Verwacklungsreduzierung taugt nicht (schwarzer Rand, Wabern). Stattdessen etablierter ffmpeg-Workflow (August 2026, Gelände 1–4 damit erfolgreich verarbeitet, Anika zufrieden):

**Pipeline** (ffmpeg unter `C:/Users/Olive/ffmpeg-tool/ffmpeg-2024-11-28-git-bc991ca048-essentials_build/bin/`):
1. Pass 1: `vidstabdetect=shakiness=5:accuracy=15`
2. Pass 2: `vidstabtransform=input=X.trf:smoothing=15:optzoom=1:interpol=bicubic,unsharp=5:5:0.8:3:3:0` → `-c:v libx264 -preset fast -crf 18 -c:a copy` → „NAME stabilisiert.mp4" (Master, groß, behalten bis Vimeo geprüft)
3. Vimeo-Version: vom Master `-preset medium -crf 21 -maxrate 14M -bufsize 28M -movflags +faststart` → „NAME vimeo.mp4" (~1,4 GB / 13 Min)

**Why:** smoothing=15 lässt die gewollte Laufbewegung stehen und nimmt nur Zittern; ohne maxrate-Deckel bläst crf 20 die Datei wegen der Nachschärfung auf 6,5 GB auf.

**How to apply:** Rohvideos liegen auf dem Desktop; Kette als EINE Hintergrund-Bash (detect && transform && compress), ~4–6× Videolänge Rechenzeit; Original nie anfassen, Dateigröße + Duration nach Abschluss verifizieren.

**Kamera-Kontext:** Gefilmt mit Samsung Galaxy S20 FE + Insta360 Flow Pro 2 Gimbal. Rohmaterial in 1080p ist matschig (aggressive Rauschunterdrückung, schlimmer bei trübem Licht). Empfehlung: in 4K30 filmen (S20 FE kann das), Samsung-Kamera-App statt Insta360-App (kann auf microSD speichern, Insta360-App nicht; Gimbal stabilisiert trotzdem). Offener Test: 4K-Testminute Samsung-App vs. Insta360-App auf Pixel-Ebene vergleichen, danach Entscheidung ob DJI Pocket 3 Creator Combo (~800 €) nötig. Pocket 3 löst NICHT das Geh-Hüpfen (Gimbal-Walk-Technik nötig), aber wohl die Bildqualität (1-Zoll-Sensor).

---

## Vimeo-Fix: Opus-Audio in MP4 (Referenz)

Anikas Kursvideo-Aufnahmen (Windows-Kamera-App/Browser-Recorder) haben teils **Opus-Audio im MP4-Container** → Vimeo kann die Datei nicht richtig verarbeiten. Das Video selbst ist dabei intakt.

Fix (ffmpeg portable, siehe [[video-stabilisierung]] / scripts/reel-produktion/README.md — Download gyan.dev ffmpeg-release-essentials.zip in den Scratchpad, ~100 MB):

```
ffmpeg -i input.mp4 -map 0:v -map 0:a -c:v copy \
  -af "highpass=f=90,afftdn=nr=12:nf=-35:tn=1,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:a aac -b:a 192k -movflags +faststart output.mp4
```

- Video verlustfrei kopiert, nur Ton neu (AAC 192k)
- Filterkette zugleich gegen Raschel-/Griffgeräusche (moderat; bei Bedarf afftdn nr höher)
- Vorher/nachher-Hörproben als MP3 schicken, bevor Anika hochlädt
- Erprobt 16.09.2026, Kurs „durchs Wasser" Modul-Video

---

## Energetik-Zertifikat

Zertifikat fürs [[project-energetik]] (Wunsch der Teilnehmerinnen, erstellt 2026-10-26). Vorlage `outputs/energetik/zertifikat/zertifikat.html` (A4 quer, Bordeaux/Gold, Logo oben, Name in Pinyon Script). Neues PDF pro Name: `node scripts/export-zertifikat-energetik.js "Vorname Nachname"` → landet in `outputs/energetik/zertifikat/`, danach Kopie auf den Desktop. Bisher erstellt: Petra Schröder, Tanja Stucke.

Anikas Entscheidungen: KEIN Siegel, KEIN „Anika's Pferdeakademie" unter der Unterschrift, KEIN Hinweis auf Live-Begleitung/Zoom-Calls. Stehen bleiben: Inhalte-Zeile, „Juni bis Oktober 2026", Datum, Unterschrift Anika Wesse.

**Why:** Anika wollte es schlicht, ohne Akademie-Wiederholungen unten.
**How to apply:** Für weitere Teilnehmerinnen nur das Skript mit dem Namen laufen lassen, Layout nicht ändern. Datum/Zeitraum per 2. Argument bzw. ?zeitraum= anpassbar, falls ein späterer Durchgang kommt. ⚠️ Offenes PDF im Viewer blockiert das Überschreiben (Skript meldet das).

---

## Energetik Call-Downloads

Am 2026-07-23 alle **22 Call-Aufzeichnungen** aus der Facebook-Gruppe „Energetik-Programm💫Alumni Gruppe" (facebook.com/groups/energetikprogramm.alumni, Info-Guide „Aufzeichnungen") heruntergeladen.

**Ablageort:** `C:\Users\Olive\Desktop\Energetik-Calls\` — Dateien `YYYY-MM-DD_Energetik-Call.mp4`, jeweils Bild+Ton, Zeitraum 2025-08-05 bis 2026-01-26. Zweck: Upload zu Vimeo.

**Status (Stand 2026-07-23, Projekt abgeschlossen):** Alle 22 heruntergeladen & abspielbar. Bei Vimeo (Ordner „Energetik Calls") lagen 20 → die letzten 2 lädt Anika selbst hoch: **01.09.25** (`2025-09-01_Energetik-Call.mp4`) und **10.11.25** (`2025-11-10_Energetik-Call.mp4`). Hinweis: Datei `2025-08-25` war anfangs defekt (abgebrochener Mux, „moov atom not found") → neu geladen & repariert (72,9 MB, 1:19:22).

**Warum es tricky war / wie es lief (falls nochmal FB-Videos zu ziehen):**
- FB bietet KEINEN Download-Button für Gruppen-Reels; DYI-Datenexport liefert Gruppen-Videos nicht.
- Methode: pro Reel `facebook.com/reel/<video_id>` öffnen → DASH-Manifest aus den Seiten-Scripts parsen (`<BaseURL` escaped), Video-/Audiospur-URLs (signiert, funktionieren cookielos) im Browser per `fetch`→Blob laden → Download landet auf **Desktop** (Chrome default_directory = Desktop, NICHT Downloads!) → lokal mit ffmpeg (`C:\Users\Olive\ffmpeg-tool\...\ffmpeg.exe`) muxen.
- Datum je Reel aus `publish_time` (Berlin-Zeitzone), Filter auf Call-Zeitraum; weicht ±1 Tag von Guide-Labels ab.
- 3 neuere Reels (01.09., 10.11., 17.11.) nutzen segmentiertes Format (r2av1 q20–q90) — dort Video per JS `.play()` starten, dann progressive Voll-URL (`vencode_tag` enthält `xpv_progressive`) aus `performance.getEntriesByType('resource')` holen (ist bereits gemuxt mit Ton).
- Browser-Downloads liefen über claude-in-chrome MCP; große Blobs lösten Tool-Timeout aus, Download lief aber im Hintergrund fertig.

Siehe [[project_energetik]] und [[project_energetik_launch_content]].

---

## ThriveCart Thumbnails

ThriveCart Learn schneidet Kurs-Thumbnails in der Schüler-Übersicht ("Deine Kurse & Programme") **seitlich fast quadratisch** zu (object-fit cover) — links/rechts fliegt weg. Reines 16:9 + nur kleiner Rand reicht NICHT; Text am Bildrand wird abgeschnitten.

**Richtig:**
- Format **1280 × 720 px (16:9)**
- **Text mittig zentriert** über dem Foto (NICHT links/seitlich)
- ⚠️ Crop ist STARK: Kachel fast quadratisch (~1.3) → nur mittlere **~66 % der Breite** sichtbar (links/rechts je ~13 % weg). Text-/Titelbreite daher max **~845 px** (auf 1280 Canvas) halten, lange Untertitel automatisch **umbrechen** (max ~820 px breit). Sonst werden Wortenden abgeschnitten (z.B. „…Gesundheit förder[n]").
- Pferdefoto als Vollbild-Hintergrund + dunkelroter Marken-Overlay (rgba 74,18,32, ~165 alpha) + leichter dunkler Verlauf für Lesbarkeit
- Weißer Titel (Segoe UI Bold, Montserrat lokal nicht installiert), creme Subtitle, "ANIKAS PFERDEAKADEMIE" klein unten mittig

So bleibt der Titel sichtbar, egal wie stark ThriveCart croppt. Build-Methode: PowerShell System.Drawing (GDI). Layout: Kicker (caps, Akzentfarbe) + Titel + Akzent-Trennlinie + Untertitel + "ANIKAS PFERDEAKADEMIE". Jeder Kurs eigene Erdton-Farbe (Foto-Vollbild + Farb-Overlay ~160 alpha) zur Unterscheidung. Mockup-Kurse: Mockup mittig auf passendem Hintergrund (Eckfarbe sampeln). Bei „sieht gleich aus" → ThriveCart Browser-Cache, Strg+F5.

⚠️ **Als JPG speichern (Q85), NICHT PNG** — Foto-PNGs werden ~1,5 MB und sind zu groß für ThriveCart; JPG derselben Kachel ~125 KB. GDI: JPEG-Encoder mit Quality 85.

⚠️ **Desktop-Dateien verschwinden ständig** (Sync-Problem) → wiederverwendbare Quell-Fotos in **`claude-workspace/reference/fotos/`** ablegen (stabil). Bisher: `paddock-ruhende-pferde.jpg` (Pferde im Paddock, für Offenstall/Paddock-Kurse). Fertige Thumbnails zeitnah in ThriveCart hochladen, solange sie auf dem Desktop liegen.

Beispiel-Output: Desktop/Energetik_neu.png + Energetisch_Testen_neu.png (Juni 2026). Siehe [[project_thrivecart]].
