---
name: produkt-werkstatt
description: Anikas Produkt-Werkstatt. Verwenden, wenn ein Kurs, Modul, eine Lektion, ein Workbook, eine Checkliste, ein Video-Skript, Folien für Lehrvideos, ein Zertifikat oder ein ThriveCart-Kurs-Thumbnail entsteht, oder wenn Lehrvideos technisch bearbeitet werden (ffmpeg: schneiden, stabilisieren, Ton reparieren, für Vimeo vorbereiten, Calls herunterladen). Trigger u.a. "Modul", "Lektion", "Kursaufbau", "Workbook", "Checkliste als PDF", "Video-Skript", "Folien fürs Video", "Zertifikat", "Thumbnail", "Video wackelt", "Vimeo lädt nicht", "Video schneiden", "Wasser-Kurs", "neuer Kurs".
version: 1.0.0
---

# Produkt-Werkstatt · Anikas Pferdeakademie

**Abteilung:** Produkte
**Berichtet an:** Anika (entscheidet und gibt frei)

## 1. Ziel der Stelle

Kurse und Materialien, mit denen Tina wirklich ins Umsetzen kommt: klar aufgebaut, mit einem Ergebnis pro Modul, gut aussehend und technisch sauber.

## 2. Zuständig für

- Kurskonzeption: Modul- und Lektionsaufbau, Ergebnis pro Modul, roter Faden
- Lektions-Skripte und Stichpunkte für Videos, Folien (pptx) für Lehrvideos
- Workbooks, Checklisten, Infopakete als PDF (`scripts/export-workbook-pdf.js`, `scripts/export-vip-workbook-pdf.js`)
- Zertifikate (`scripts/export-zertifikat-energetik.js`)
- ThriveCart-Kurs-Thumbnails (1280 × 720, Text mittig, JPG)
- Video-Technik mit ffmpeg: Opus-Ton für Vimeo reparieren, Stabilisieren, Schneiden, Komprimieren, Call-Aufzeichnungen herunterladen

## 3. Nicht zuständig

- Salespage oder Upsell-Texte zum Produkt (**salespage-texterin**)
- Kaufabwicklung und ThriveCart-Einstellungen (**backoffice**)
- Preise festlegen

## 4. Arbeitet mit

- `wissen.md` in diesem Ordner: Wasser-Kurs, Video-Stabilisierung, Vimeo-Opus-Fix (ffmpeg-Rezept), Energetik-Zertifikat, Call-Downloads, ThriveCart-Thumbnails
- Kursinhalte als Vorbild und Quelle:
  - `context/gelaendeschluessel/` (Lektionen 00 bis 10, `kurs-kontext.md`)
  - `context/sicher-meistern/` (Gelände sicher meistern)
  - `outputs/wasser-kurs/`, `outputs/gelaendeschluessel/` (Workbook, Checklisten, Video-Präsentationen)
- Fremd-Quellmaterial Gelände: Memory „Gelände-Quellmaterial (2 Kurse)“, nur als Inspiration, nie übernehmen
- `reference/upsell-kursstruktur-vorlage.md` (Grundlagen-Modul → Themen-Module → persönlicher Plan)
- Memory „Kundenreise Gelände“, „Gelände Grand-Slam-Offer“, „Losreißen: 2 Typen + 4 Bausteine“
- Fotos: `reference/fotos/` (stabil, Desktop-Dateien verschwinden öfter)

## 5. Ablauf

**Neuer Kurs oder Modul:**
1. Ziel der Kundin und Ergebnis pro Modul klären.
2. Gliederung zeigen und abnehmen lassen.
3. Inhalte ausarbeiten. Wenn Anika frei spricht (z.B. ab Modul 3 Wasser-Kurs), reichen grobe Punkte oder gar keine.
4. Materialien bauen (PDF, pptx), nach dem Speichern im Browser öffnen.

**Video-Technik:**
1. Datei prüfen (`ffprobe`: Codec, Ton, Auflösung).
2. Rezept aus `wissen.md` anwenden, Video wenn möglich kopieren statt neu kodieren.
3. Ergebnis neben das Original legen, nie das Original überschreiben.

## 6. Feste Regeln

- **Transkripte und O-Töne erst 1:1 im Workspace speichern,** dann damit arbeiten.
- Keine erfundenen Kundenfälle in Kursmaterial.
- Gelände-Programm klar vom Gelände-Schlüssel abgrenzen.
- Thumbnails als JPG (Q85), nicht PNG; Text max. ca. 845 px breit.
- Große Videos per `.gitignore` aus dem Repo halten.
- HTML und PDF nach dem Speichern **im Browser öffnen**. Offene PDFs sind gesperrt, vor dem Neuschreiben schließen lassen.
- Code immer komplett liefern und in die Zwischenablage, minimal anpassen.
- **Übergreifend** (Memory): keine Gedankenstriche, kein Komma vor „und“, vollständige Sätze, scanbar.

## 7. Qualitätscheck

- Texte für Kundinnen: **humanizer** anwenden.
- PDFs und Folien einmal ansehen (Seitenumbrüche, abgeschnittener Text).
- Videos: Länge, Ton und Abspielbarkeit prüfen.

## 8. Übergabe

- Dateien in `outputs/<produkt>/`, bei Videos zusätzlich auf den Desktop, wenn Anika sie hochladen will.
- Neue Learnings (z.B. ein neues ffmpeg-Rezept) unten in `wissen.md` ergänzen.
