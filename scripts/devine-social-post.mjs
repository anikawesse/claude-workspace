// Devine Social Planner: Beitrag (auch Karussell) auf Instagram + Facebook-Seite anlegen.
// Liest DEVINE_TOKEN und DEVINE_LOCATION_ID aus scripts/.env. Token wird nie ausgegeben.
//
// Nutzung:
//   node scripts/devine-social-post.mjs <auftrag.json>
//   node scripts/devine-social-post.mjs list [tage]      geplante Beiträge der nächsten Tage anzeigen
//
// auftrag.json:
// {
//   "caption": "Text …",
//   "bilder": ["C:/pfad/slide1.jpg", "https://…/slide2.jpg"],   // max. 10, lokale Dateien werden hochgeladen
//   "datum": "2026-11-12",          // Post-Tag, Uhrzeit fest 07:00 deutscher Zeit
//   "uhrzeit": "07:00",             // optional
//   "entwurf": false,               // true = nur Entwurf, wird nicht veröffentlicht
//   "video": "C:/pfad/short.mp4",   // statt bilder: ein Video, wird als Reel gepostet (ohne Musik)
//   "typ": "reel"                   // optional, Standard: "reel" bei Video, sonst "post"
// }
// Ausgabe: JSON {postId, status, scheduleDate}
import fs from 'fs';
import path from 'path';

const env = fs.readFileSync(new URL('./.env', import.meta.url), 'utf8');
const get = k => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1]?.trim();
const TOKEN = get('DEVINE_TOKEN'), LOC = get('DEVINE_LOCATION_ID');
if (!TOKEN || !LOC) { console.error('❌ DEVINE_TOKEN oder DEVINE_LOCATION_ID fehlt'); process.exit(1); }
const API = 'https://services.leadconnectorhq.com';
const H = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28' };
const ACCOUNTS = [
  '685583b6a1741ec73eea96ed_YTcO1DtAeZWVMFTPktEB_17841404268109208',   // Instagram anikas_pferdeakademie
  '685583c9229155050574c18a_YTcO1DtAeZWVMFTPktEB_267529773117705_page', // Facebook-Seite Anika Wesse
];
const USER_ID = 'tcgGHoPvcd84uwGaI3wQ'; // Anika Wesse (admin)

// Deutsche Zeit inkl. Sommer-/Winterzeit als ISO mit Offset
function berlinISO(datum, uhrzeit = '07:00') {
  const guess = new Date(`${datum}T${uhrzeit}:00Z`);
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hour12: false });
  const offset = (Number(fmt.format(guess)) - guess.getUTCHours() + 24) % 24; // 1 oder 2
  return `${datum}T${uhrzeit}:00+0${offset}:00`;
}

async function upload(src) {
  if (/^https?:\/\//.test(src)) {
    if (src.includes('filesafe.space')) return src; // liegt schon in Devine
    const r = await fetch(src); if (!r.ok) throw new Error('Download fehlgeschlagen: ' + src.slice(0, 60));
    return uploadBlob(new Blob([await r.arrayBuffer()], { type: 'image/jpeg' }), 'slide.jpg');
  }
  const buf = fs.readFileSync(src);
  return uploadBlob(new Blob([buf], { type: mime(src) }), path.basename(src));
}
function mime(u) { u = u.toLowerCase().split('?')[0]; return u.endsWith('.mp4') ? 'video/mp4' : u.endsWith('.mov') ? 'video/quicktime' : u.endsWith('.png') ? 'image/png' : 'image/jpeg'; }
async function uploadBlob(blob, name) {
  const fd = new FormData(); fd.append('file', blob, name); fd.append('name', 'Content-Redaktion ' + name);
  for (let i = 0; i < 3; i++) {
    const r = await fetch(`${API}/medias/upload-file`, { method: 'POST', headers: H, body: fd });
    const t = await r.text();
    try { const j = JSON.parse(t); if (j.url) return j.url; } catch {}
    await new Promise(res => setTimeout(res, 2000));
  }
  throw new Error('Upload fehlgeschlagen: ' + name);
}

const [arg, arg2] = process.argv.slice(2);
if (arg === 'list') {
  const tage = Number(arg2) || 21;
  const from = new Date(), to = new Date(Date.now() + tage * 864e5);
  const r = await fetch(`${API}/social-media-posting/${LOC}/posts/list`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'all', skip: '0', limit: '100', fromDate: from.toISOString(), toDate: to.toISOString(), includeUsers: 'false' }) });
  const j = await r.json();
  for (const p of j.results?.posts || []) console.log(`${(p.scheduleDate || p.displayDate || '').slice(0, 16)} ${p.status} ${p.platform} ${(p.media || []).length} Bild(er) · ${(p.summary || '').replace(/\s+/g, ' ').slice(0, 60)} · ${p._id}`);
  if (!(j.results?.posts || []).length) console.log('Keine Beiträge im Zeitraum.');
  process.exit(0);
}
if (arg === 'loeschen') {
  const r = await fetch(`${API}/social-media-posting/${LOC}/posts/${arg2}`, { method: 'DELETE', headers: H });
  console.log(r.status, (await r.text()).slice(0, 200)); process.exit(0);
}
if (!arg) { console.log('Nutzung: node scripts/devine-social-post.mjs <auftrag.json> | list [tage]'); process.exit(0); }

const job = JSON.parse(fs.readFileSync(path.resolve(arg), 'utf8'));
if (job.video) job.bilder = [job.video];
if (!job.caption || !Array.isArray(job.bilder) || !job.bilder.length) throw new Error('caption und bilder (oder video) sind Pflicht');
if (job.bilder.length > 10) throw new Error(`Zu viele Bilder (${job.bilder.length}). Devine/Instagram-API erlaubt max. 10.`);
if ([...job.caption].length > 2200) throw new Error('Caption über 2.200 Zeichen');
if (!job.entwurf && !/^\d{4}-\d{2}-\d{2}$/.test(job.datum || '')) throw new Error('datum (JJJJ-MM-TT) fehlt');

const urls = [];
for (const b of job.bilder) urls.push(await upload(b));
const body = {
  accountIds: ACCOUNTS, userId: USER_ID, summary: job.caption, type: job.typ || (job.video ? 'reel' : 'post'),
  media: urls.map(url => ({ url, type: mime(url) })),
  status: job.entwurf ? 'draft' : 'scheduled',
};
if (!job.entwurf) body.scheduleDate = berlinISO(job.datum, job.uhrzeit || '07:00');
const r = await fetch(`${API}/social-media-posting/${LOC}/posts`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const j = await r.json();
if (!j.success) { console.error('❌ Devine:', JSON.stringify(j).slice(0, 500)); process.exit(1); }
const p = j.results.post;
console.log(JSON.stringify({ postId: p._id, status: p.status, scheduleDate: body.scheduleDate || null, bilder: urls.length }));
