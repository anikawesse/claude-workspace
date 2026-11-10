// B-Roll-Shorts: Gewinner der 5 Testreels finden und als Feed-Reel (ohne Musik) in Devine einplanen.
// Anika postet pro Thema 5 Testreels (Ordner "SM Content/Vorlage Reels/Fertig/MM-TT Titel/Short 1-5.mp4").
// Zwei Tage später liest dieses Skript die Instagram-Zahlen, ordnet die Reels per Vorschaubild den
// Dateien zu und plant das Short mit den meisten Aufrufen über scripts/devine-social-post.mjs ein.
//
// Nutzung:
//   node scripts/shorts-gewinner.mjs auswerten <JJJJ-MM-TT>          nur anzeigen (Thema mit diesem postDatum)
//   node scripts/shorts-gewinner.mjs einplanen <JJJJ-MM-TT> [feedDatum] [HH:MM]
//   node scripts/shorts-gewinner.mjs auto [HH:MM]                     alle Themen, die vor >= 2 Tagen dran waren
//                                                                     und noch keinen Gewinner haben (max. 7 Tage zurück)
// Standard-Uhrzeit Feed: 18:00 (7:00 ist für Karussells belegt).
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const env = fs.readFileSync(path.join(HERE, '.env'), 'utf8');
const get = k => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1]?.trim();
const IG_TOKEN = get('META_IG_TOKEN');
const IG_ID = '17841404268109208';
const FERTIG = 'C:/Users/Olive/Desktop/SM Content/Vorlage Reels/Fertig';
const STANDARD_ZEIT = '18:00';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'shorts-gewinner-'));

const capcut = 'C:/Users/Olive/AppData/Local/CapCut/Apps';
const FF = process.env.FFMPEG || path.join(capcut, fs.readdirSync(capcut).filter(d => fs.existsSync(path.join(capcut, d, 'ffmpeg.exe'))).sort().pop(), 'ffmpeg.exe');

const heute = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
const plusTage = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);
const berlinTag = iso => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date(iso));
const norm = s => (s || '').replace(/\s+/g, ' ').trim().slice(0, 80).toLowerCase();

function db(...args) { return execFileSync('node', [path.join(HERE, 'content-maschine-db.mjs'), ...args], { encoding: 'utf8' }); }
function ladeMaschine() { const f = path.join(TMP, 'cm.json'); db('dump', f); return JSON.parse(fs.readFileSync(f, 'utf8')); }

async function ig(url) {
  const r = await fetch(url + (url.includes('?') ? '&' : '?') + 'access_token=' + IG_TOKEN);
  const j = await r.json(); if (j.error) throw new Error('Instagram: ' + j.error.message); return j;
}
async function igReels() {
  let url = `https://graph.facebook.com/v22.0/${IG_ID}/media?fields=id,timestamp,media_product_type,is_shared_to_feed,thumbnail_url,caption,permalink&limit=100`;
  const out = [];
  for (let i = 0; i < 3 && url; i++) { const j = await ig(url); out.push(...j.data); url = j.paging?.next?.replace(/[?&]access_token=[^&]*/, ''); }
  return out.filter(x => x.media_product_type === 'REELS' && !x.is_shared_to_feed);
}
async function insights(id) {
  const werte = {};
  for (const m of ['views', 'reach', 'ig_reels_avg_watch_time']) {
    try { const j = await ig(`https://graph.facebook.com/v22.0/${id}/insights?metric=${m}`); werte[m] = j.data[0].values[0].value; } catch { werte[m] = null; }
  }
  return werte;
}

// Graustufen-Fingerabdruck 18x32 Pixel
function abdruck(input, ss) {
  const out = path.join(TMP, 'fp.raw');
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', ...(ss != null ? ['-ss', String(ss)] : []), '-i', input,
    '-frames:v', '1', '-vf', 'scale=18:32,format=gray', '-f', 'rawvideo', out]);
  return fs.readFileSync(out);
}
const abstand = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2; return s / a.length; };

async function auswerten(datum) {
  const cm = ladeMaschine();
  const karte = (cm.shorts || []).find(x => x.postDatum === datum && x.freigabe);
  if (!karte) return { fehler: `Kein freigegebenes Short-Thema mit Datum ${datum}` };
  const ordnerName = `${datum.slice(5, 7)}-${datum.slice(8, 10)} ${karte.titel.replace(/[\/:?"<>|]/g, '')}`;
  const ordner = path.join(FERTIG, ordnerName);
  const kopf = norm(karte.caption);
  const reels = (await igReels()).filter(r => {
    const tag = berlinTag(r.timestamp);
    return tag >= plusTage(datum, -1) && tag <= plusTage(datum, 3) && kopf && norm(r.caption).slice(0, 50) === kopf.slice(0, 50);
  });
  if (!reels.length) return { karte, fehler: `Keine Testreels zu „${karte.titel}“ gefunden (gepostet?)` };

  const dateien = fs.existsSync(ordner) ? fs.readdirSync(ordner).filter(f => /^Short \d+\.mp4$/.test(f)).sort() : [];
  const lokal = dateien.map(f => ({ f, fp: abdruck(path.join(ordner, f), 0.3) }));
  for (const r of reels) {
    Object.assign(r, await insights(r.id));
    if (r.thumbnail_url && lokal.length) {
      const t = path.join(TMP, r.id + '.jpg');
      fs.writeFileSync(t, Buffer.from(await (await fetch(r.thumbnail_url)).arrayBuffer()));
      const fp = abdruck(t);
      const rang = lokal.map(l => ({ f: l.f, d: abstand(fp, l.fp) })).sort((a, b) => a.d - b.d);
      r.datei = rang[0].f; r.sicher = rang.length < 2 || rang[1].d > rang[0].d * 1.5;
    }
  }
  reels.sort((a, b) => (b.views ?? -1) - (a.views ?? -1) || (b.ig_reels_avg_watch_time ?? 0) - (a.ig_reels_avg_watch_time ?? 0));
  return { karte, ordner, reels, gewinner: reels[0] };
}

function zeigen(e) {
  if (e.fehler) { console.log('⚠️ ' + e.fehler); return; }
  console.log(`📊 ${e.karte.titel} (${e.karte.postDatum}), ${e.reels.length} Testreels`);
  for (const r of e.reels) console.log(`  ${r === e.gewinner ? '🏆' : '  '} ${r.datei || '?'}${r.sicher === false ? ' (Zuordnung unsicher)' : ''}: ${r.views ?? '?'} Aufrufe, Reichweite ${r.reach ?? '?'}, Ø ${r.ig_reels_avg_watch_time != null ? (r.ig_reels_avg_watch_time / 1000).toFixed(1) + ' s' : '?'} · ${r.permalink}`);
}

async function einplanen(datum, feedDatum, zeit) {
  const e = await auswerten(datum); zeigen(e);
  if (e.fehler) return false;
  if (e.karte.gewinnerDevinePostId) { console.log('ℹ️ Gewinner ist schon eingeplant: ' + e.karte.gewinnerFeedDatum); return false; }
  const g = e.gewinner;
  if (!g.datei || g.sicher === false) { console.log('⚠️ Gewinner-Datei nicht sicher zugeordnet, nichts eingeplant. Bitte Anika fragen.'); return false; }
  if ([...(e.karte.caption || '')].length > 2200) { console.log('⚠️ Caption über 2.200 Zeichen, nichts eingeplant.'); return false; }
  const auftrag = path.join(TMP, 'auftrag.json');
  fs.writeFileSync(auftrag, JSON.stringify({ caption: e.karte.caption, video: path.join(e.ordner, g.datei), datum: feedDatum, uhrzeit: zeit }));
  const res = JSON.parse(execFileSync('node', [path.join(HERE, 'devine-social-post.mjs'), auftrag], { encoding: 'utf8' }).trim().split('\n').pop());
  const upd = path.join(TMP, 'upd.json');
  fs.writeFileSync(upd, JSON.stringify([{ col: 'shorts', id: e.karte.id, set: {
    gewinner: `${g.datei.replace('.mp4', '')} (${g.views} Aufrufe)`, gewinnerFeedDatum: `${feedDatum} ${zeit}`,
    gewinnerDevinePostId: res.postId, freigabe: 'Geplant' } }]));
  db('update', upd);
  console.log(`✅ ${g.datei} eingeplant für ${feedDatum} ${zeit} (Instagram + Facebook, ohne Musik), Devine-ID ${res.postId}`);
  return true;
}

const [cmd, a, b, c] = process.argv.slice(2);
try {
  if (cmd === 'auswerten' && a) zeigen(await auswerten(a));
  else if (cmd === 'einplanen' && a) await einplanen(a, b || heute(), c || STANDARD_ZEIT);
  else if (cmd === 'auto') {
    const zeit = a || STANDARD_ZEIT, bis = plusTage(heute(), -2), ab = plusTage(heute(), -7);
    const offen = (ladeMaschine().shorts || []).filter(x => x.freigabe && x.postDatum && x.postDatum <= bis && x.postDatum >= ab && !x.gewinnerDevinePostId)
      .sort((x, y) => x.postDatum.localeCompare(y.postDatum));
    if (!offen.length) console.log('Keine Shorts zum Auswerten.');
    let tag = heute();
    for (const k of offen) { if (await einplanen(k.postDatum, tag, zeit)) tag = plusTage(tag, 1); }
  } else console.log('Nutzung: auswerten <datum> | einplanen <datum> [feedDatum] [HH:MM] | auto [HH:MM]');
} finally { fs.rmSync(TMP, { recursive: true, force: true }); }
