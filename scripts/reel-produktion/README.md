# Reel-Produktion (Test-Reels mit Hook-Overlays)

Erzeugt aus B-Roll-Videos und einer Hook-Liste fertige 7-Sekunden-Reels (1080×1920) mit Text-Overlays im Look von Anikas Edits-Vorlage (weiße Boxen, Poppins Medium, Hook oben, Versprechen mit 👇 unten).

## Ablauf pro Batch

1. Anika legt B-Rolls und ggf. eine neue Vorlage in einen Ordner (zuletzt `Desktop\Vorlage Reels`, Ausgabe nach `...\Fertig`).
2. Hook-Liste in `build_overlays.ps1` im `$hooks`-Array anpassen (top = Einleitung, bottom = Versprechen).
3. Overlays erzeugen: `powershell -NoProfile -ExecutionPolicy Bypass -File build_overlays.ps1` (schreibt PNGs nach `<scratchpad>\overlays`; `$SP`-Pfad im Skript auf den aktuellen Arbeitsordner setzen).
4. Rendern pro Kombination (ffmpeg, erste 7 Sekunden, Hochkant-Clips mit Rotations-Metadaten werden automatisch gedreht):

```
ffmpeg -y -ss 0 -t 7 -i <clip.mp4> -i <hookN.png> -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[v];[v][1:v]overlay=0:0" -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p -c:a aac -b:a 128k <Ausgabe.mp4>
```

## Layout-Parameter (aus Vorlage.mp4 vermessen, Safe-Zone-geprüft)

- Canvas 1080×1920, Schrift Poppins Medium 50 px, Zeilenhöhe 70 px, Box-Padding 45/38 px, Eckenradius 10 px
- Obere Box: Oberkante y=220 (Instagram-Safe-Zone oben: mind. 108, konservativ 220)
- Untere Box: Unterkante y=1574 (unten sicher bis ca. 1600), max. Textbreite unten 650 px (rechte Icon-Leiste)
- Emoji: Noto 👇 512 px (`emoji_1f447_512.png`), Twemoji 72 px war zu pixelig

## Voraussetzungen

- ffmpeg ist NICHT installiert: portable Version laden von https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip und in den Scratchpad entpacken (nicht ins Repo, ~100 MB)
- Kein Python auf dem Rechner; Overlays laufen über PowerShell/GDI+ (node-canvas kann die Poppins unter Windows nicht laden)
- Achtung PowerShell: `$h` und `$H` sind DIESELBE Variable (case-insensitive)

## Kontext

- Hooks und Captions werden in der Google-Tabelle "Reels Hook-Caption-Übersicht" gepflegt (Blätter Hooks + Captions)
- Test-Reels: Musik legt Anika beim Posten in der Instagram-App drauf (bessere Audio-Verlinkung), Posting-Rhythmus 1 bis 2 Minuten Abstand

## B-Roll Shorts „Situation + 2 falsche Ansätze“ (seit 06.11.2026)

1. Texte kommen aus den freigegebenen Short-Karten der Content-Maschine (`node scripts/content-maschine-db.mjs dump <datei>`, Felder hook, falsch1, falsch2). Jobs als JSON: `[{n, sit, f1, f2}]`.
2. Overlays: `powershell -NoProfile -ExecutionPolicy Bypass -File build_shorts.ps1 -Jobs <jobs.json> -Out <ordner>` erzeugt je Thema `s<n>_top.png`, `s<n>_bot.png`, `s<n>_f1.png`, `s<n>_f2.png` (Box-Breite 860 px, rotes gezeichnetes X).
3. Plan: pro Thema 5 Clips aus `Desktop\SM Content\Vorlage Reels\Rohclips`, keine ähnlichen Clips im selben Thema, pro Clip Position `top` oder `bot` nach Standbild (Situation NIE mittig, nicht über dem Pferdekopf).
4. Rendern: `bash render_shorts.sh <plan.json> <overlay-ordner> <rohclip-ordner> "<...>\Vorlage Reels\Fertig"` → `Fertig\MM-TT Titel\Short 1..5.mp4`. Ablauf: 0 bis 3,2 s Situation allein, ab 3,2 s oben + Ansatz 1, ab 6 s Ansatz 2, 9 s.
5. ffmpeg: das aus der CapCut-Installation (`AppData\Local\CapCut\Apps\<version>\ffmpeg.exe`). Dort fehlt libx264 und `h264_mf` stürzt ab, deshalb NVIDIA-Encoder `h264_nvenc`. Ein frisch geladenes ffmpeg darf Claude im Auto-Modus nicht starten.
6. Clip-Notizen 06.11.: `3.mp4` ist identisch mit `Flow_VID_20260822_150130_02_011_1.mp4`, `20250401_094107.mp4` hat nur 4 s → beide nicht nutzen.
