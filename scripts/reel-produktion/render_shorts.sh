#!/usr/bin/env bash
# Rendert B-Roll Shorts (Situation + 2 falsche Ansaetze) aus plan.json und Overlay-PNGs von build_shorts.ps1.
# Aufruf: bash render_shorts.sh <plan.json> <overlay-ordner> <rohclip-ordner> <ausgabe-ordner>
# plan.json: [{n, v, datum, titel, clip, ss, pos:"top"|"bot"}]
# Ablauf im Video (9 s): 0 bis 3,2 s Situation allein (oben oder unten, NIE mittig),
# ab 3,2 s Situation oben + Ansatz 1, ab 6 s zusaetzlich Ansatz 2. Ton vom Clip bleibt, Musik legt Anika in Instagram drauf.
set -u
# ffmpeg aus der CapCut-Installation (libx264 fehlt dort, h264_mf stuerzt ab, NVIDIA-Encoder laeuft)
FF="${FFMPEG:-$(ls -d /c/Users/Olive/AppData/Local/CapCut/Apps/*/ffmpeg.exe | tail -1)}"
VENC="${VENC:--c:v h264_nvenc -preset p5 -rc vbr -cq 21 -b:v 12M -maxrate 16M -profile:v high}"
PLAN="$1"; OV="$2"; RAW="$3"; OUT="$4"
node -e 'for(const p of require(process.argv[1]))console.log([p.n,p.v,p.datum,p.titel,p.clip,p.ss,p.pos].join("\t"))' "$PLAN" |
while IFS=$'\t' read -r n v datum titel clip ss pos; do
  dir="$OUT/${datum:5:2}-${datum:8:2} ${titel//[\/:?\"<>|]/}"
  mkdir -p "$dir"
  out="$dir/Short ${v}.mp4"
  [ -s "$out" ] && { echo "schon da: $out"; continue; }
  base="[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v]"
  if [ "$pos" = bot ]; then
    fc="$base;[v][1:v]overlay=0:0:enable='lt(t,3.2)'[a];[a][2:v]overlay=0:0:enable='gte(t,3.2)'[b];[b][3:v]overlay=0:0:enable='gte(t,3.2)'[c];[c][4:v]overlay=0:0:enable='gte(t,6)',format=yuv420p[o]"
  else
    fc="$base;[v][2:v]overlay=0:0[b];[b][3:v]overlay=0:0:enable='gte(t,3.2)'[c];[c][4:v]overlay=0:0:enable='gte(t,6)',format=yuv420p[o]"
  fi
  "$FF" -hide_banner -loglevel error -nostdin -y -ss "$ss" -t 9 -i "$RAW/$clip" \
    -i "$OV/s${n}_bot.png" -i "$OV/s${n}_top.png" -i "$OV/s${n}_f1.png" -i "$OV/s${n}_f2.png" \
    -filter_complex "$fc" -map "[o]" -map "0:a?" -r 30 $VENC -c:a aac -b:a 128k -movflags +faststart "$out" \
    && echo "ok: $out ($clip ab ${ss}s, $pos)" || echo "FEHLER: $out ($clip)"
done
