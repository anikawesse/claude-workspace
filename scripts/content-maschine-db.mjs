// Content-Maschine: Daten lesen und Karten anlegen/ändern (für die Content-Redaktion).
// Liest SUPABASE_SECRET_KEY aus scripts/.env. Schlüssel wird nie ausgegeben.
//
// Nutzung:
//   node scripts/content-maschine-db.mjs stand [tage]        Bericht: Planer, Freigaben, Vorlauf (Standard 14 Tage)
//   node scripts/content-maschine-db.mjs stand-json [tage]   dasselbe als JSON (für Aufgaben/Skripte)
//   node scripts/content-maschine-db.mjs add <datei.json>    Karten anlegen: [{"col":"karussells","item":{...}}]
//   node scripts/content-maschine-db.mjs update <datei.json> Felder ändern:  [{"col":"karussells","id":"...","set":{...}}]
//   node scripts/content-maschine-db.mjs dump <datei.json>   ganze Datenbank als Sicherung speichern
//
// Sicherheit: Vor jedem Schreiben wird eine Sicherung in scripts/backups/ abgelegt (gitignored).
// Geschrieben wird nur, was in der Datei steht. Alle anderen Karten bleiben unverändert.
// _t (Zeitstempel) wird neu gesetzt, damit offene Apps die Änderung beim nächsten Abgleich übernehmen.
import fs from 'fs';
import path from 'path';

const URL_BASE = 'https://cmeusofrxqzewhtbpszw.supabase.co/rest/v1/content_store';
const envPath = new URL('./.env', import.meta.url);
const env = fs.readFileSync(envPath, 'utf8');
const KEY = (env.match(/^SUPABASE_SECRET_KEY=(.*)$/m) || [])[1]?.trim();
if (!KEY) { console.error('❌ SUPABASE_SECRET_KEY fehlt in scripts/.env'); process.exit(1); }
const H = { apikey: KEY, 'Content-Type': 'application/json' };
const COLS = ['reels', 'karussells', 'yapping', 'shorts', 'hooks', 'vorlagen', 'ideen'];

async function fetchRow() {
  const r = await fetch(`${URL_BASE}?select=user_id,updated_at,data`, { headers: H });
  if (!r.ok) throw new Error(`Lesen fehlgeschlagen: ${r.status} ${await r.text()}`);
  const rows = await r.json();
  if (rows.length !== 1) throw new Error(`Erwartet genau 1 Datensatz, gefunden: ${rows.length}`);
  return rows[0];
}
function backup(row, tag) {
  const dir = new URL('./backups/', import.meta.url);
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const f = new URL(`content-maschine-${stamp}-${tag}.json`, dir);
  fs.writeFileSync(f, JSON.stringify(row.data));
  // nur die letzten 30 Sicherungen behalten
  const all = fs.readdirSync(dir).filter(n => n.startsWith('content-maschine-')).sort();
  all.slice(0, Math.max(0, all.length - 30)).forEach(n => fs.unlinkSync(new URL(n, dir)));
  return f.pathname;
}
async function writeRow(row, data) {
  data._t = Date.now();
  const r = await fetch(`${URL_BASE}?user_id=eq.${row.user_id}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ data, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`Schreiben fehlgeschlagen: ${r.status} ${await r.text()}`);
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const localISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return localISO(d); };

function stand(data, tage) {
  const today = localISO(new Date());
  const end = addDays(today, tage - 1);
  const inRange = d => d && d >= today && d <= end;
  const ev = [];
  for (const y of data.yapping || []) {
    const g = y.gepostet || {}; const t = (y.frage || '').slice(0, 70);
    if (inRange(y.postDatum)) ev.push({ date: y.postDatum, typ: 'Yapping-Video', titel: t, erledigt: !!g.yap, freigabe: y.freigabe || '', col: 'yapping', id: y.id });
    if (inRange(y.postDatumShort)) ev.push({ date: y.postDatumShort, typ: 'Short (Feed)', titel: t, erledigt: !!g.short, col: 'yapping', id: y.id });
    if (inRange(y.postDatumKarussell)) ev.push({ date: y.postDatumKarussell, typ: 'Karussell', titel: t, erledigt: !!g.karussell, col: 'yapping', id: y.id });
    if (inRange(y.postDatumBroll)) ev.push({ date: y.postDatumBroll, typ: 'Lange B-Roll', titel: t, erledigt: !!g.broll, col: 'yapping', id: y.id });
  }
  for (const [c, typ] of [['karussells', 'Karussell-Karte'], ['shorts', 'Short-Karte'], ['reels', 'Reel']]) {
    for (const x of data[c] || []) if (inRange(x.postDatum)) ev.push({ date: x.postDatum, typ, titel: (x.titel || x.hook || '').slice(0, 70), status: x.status || '', freigabe: x.freigabe || '', canva: !!x.medien, col: c, id: x.id });
  }
  ev.sort((a, b) => a.date.localeCompare(b.date));
  const werktage = []; for (let i = 0; i < tage; i++) { const d = addDays(today, i); const wd = new Date(d + 'T00:00:00').getDay(); if (wd >= 1 && wd <= 5) werktage.push(d); }
  const karTage = new Set(ev.filter(e => e.typ.startsWith('Karussell')).map(e => e.date));
  const freigabe = {};
  for (const c of ['reels', 'karussells', 'yapping', 'shorts']) for (const x of data[c] || []) if (x.freigabe && x.freigabe !== '—') {
    (freigabe[x.freigabe] ||= []).push({ col: c, id: x.id, titel: (x.titel || x.frage || x.hook || '').slice(0, 70), datum: x.postDatum || x.postDatumKarussell || '', notiz: x.freigabeNotiz || '' });
  }
  const letzterYapping = (data.yapping || []).map(y => y.postDatum).filter(Boolean).sort().pop() || '';
  const offeneYapping = (data.yapping || []).filter(y => y.status === 'Offen').length;
  const skriptFertigUngeplant = (data.yapping || []).filter(y => y.status === 'Skript fertig' && !y.postDatum).length;
  return { heute: today, bis: end, termine: ev, karussellWerktage: { belegt: werktage.filter(d => karTage.has(d)).length, von: werktage.length, frei: werktage.filter(d => !karTage.has(d)) }, freigabe, letzterYappingFeed: letzterYapping, offeneYappingFragen: offeneYapping, yappingSkriptFertigOhneDatum: skriptFertigUngeplant };
}

const [cmd, arg] = process.argv.slice(2);
const row = await fetchRow();
const data = row.data;

if (cmd === 'stand' || cmd === 'stand-json') {
  const s = stand(data, Number(arg) || 14);
  if (cmd === 'stand-json') { console.log(JSON.stringify(s, null, 1)); process.exit(0); }
  console.log(`Content-Maschine · ${s.heute} bis ${s.bis} · Stand Cloud ${row.updated_at.slice(0, 16)}`);
  for (const e of s.termine) console.log(`${e.date} ${e.erledigt ? '✔' : ' '} ${e.typ.padEnd(15)} ${e.status ? '[' + e.status + '] ' : ''}${e.freigabe && e.freigabe !== '—' ? '{' + e.freigabe + '} ' : ''}${e.titel}`);
  console.log(`\nKarussell-Werktage belegt: ${s.karussellWerktage.belegt} von ${s.karussellWerktage.von}. Frei: ${s.karussellWerktage.frei.join(', ') || 'keine'}`);
  for (const [k, v] of Object.entries(s.freigabe)) console.log(`Freigabe „${k}“: ${v.length}`);
  console.log(`Letztes Yapping-Video im Feed geplant: ${s.letzterYappingFeed || '–'} · offene Yapping-Fragen: ${s.offeneYappingFragen} · Skript fertig ohne Datum: ${s.yappingSkriptFertigOhneDatum}`);
} else if (cmd === 'add' || cmd === 'update') {
  if (!arg) throw new Error('Datei fehlt');
  const ops = JSON.parse(fs.readFileSync(path.resolve(arg), 'utf8'));
  if (!Array.isArray(ops) || !ops.length) throw new Error('Datei muss eine nicht-leere Liste sein');
  const b = backup(row, cmd);
  let n = 0;
  for (const op of ops) {
    if (!COLS.includes(op.col)) throw new Error('Unbekannte Sammlung: ' + op.col);
    data[op.col] ||= [];
    if (cmd === 'add') {
      const item = { id: uid(), createdAt: Date.now(), ...op.item };
      if (data[op.col].some(x => x.id === item.id)) throw new Error('ID existiert schon: ' + item.id);
      data[op.col].unshift(item); n++; console.log(`+ ${op.col} ${item.id} ${(item.titel || item.frage || '').slice(0, 60)}`);
    } else {
      const x = data[op.col].find(i => i.id === op.id);
      if (!x) throw new Error(`Nicht gefunden: ${op.col} ${op.id}`);
      Object.assign(x, op.set); n++; console.log(`~ ${op.col} ${op.id} ${Object.keys(op.set).join(',')}`);
    }
  }
  // Kurz vor dem Schreiben prüfen, ob sich die Cloud inzwischen geändert hat (Anika arbeitet parallel)
  const again = await fetchRow();
  if (again.updated_at !== row.updated_at) throw new Error('Abgebrochen: Die Content-Maschine wurde gerade parallel geändert. Bitte noch einmal ausführen.');
  await writeRow(row, data);
  console.log(`✅ ${n} Änderung(en) geschrieben. Sicherung: ${b}`);
} else if (cmd === 'dump') {
  fs.writeFileSync(path.resolve(arg || 'content-maschine-dump.json'), JSON.stringify(data, null, 1));
  console.log('✅ gespeichert');
} else {
  console.log('Befehle: stand [tage] | stand-json [tage] | add <datei> | update <datei> | dump <datei>');
}
