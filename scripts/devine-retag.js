/*
Korrigiert die 4 fehlattributierten Webinar-Kontakte (Bug 10.-12.08.2026):
Sie kamen ueber die ORGANISCHE Webinar-Seite, bekamen aber wegen der falsch
eingebetteten Ad-Form den Ad-Tag. Dieses Skript:
  - entfernt Tag  "gelände webinar ads 08.26"
  - setzt   Tag  "gelände webinar 08.26"
Mit Vorher/Nachher-Kontrolle. Aufruf: node scripts/devine-retag.js
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const TOKEN = env.DEVINE_TOKEN;
const LOCATION = env.DEVINE_LOCATION_ID;

const EMAILS = [
  'ankaufmann83@gmx.de',
  'yvonne@yr-immo.de',
  'g.wenker@outlook.de',
  'corinna@gutschoenberg.com',
];
const TAG_AD  = 'gelände webinar ads 08.26';
const TAG_ORG = 'gelände webinar 08.26';

function req(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      host: 'services.leadconnectorhq.com', path: urlPath, method,
      headers: {
        Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', Accept: 'application/json',
        ...(data ? { 'Content-Type': 'application/json' } : {}),
      },
    }, (res) => {
      let buf = ''; res.on('data', (c) => buf += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, json: JSON.parse(buf) }); }
        catch (e) { resolve({ status: res.statusCode, json: null, raw: buf }); } });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findByEmail(email) {
  const res = await req('GET', `/contacts/?locationId=${LOCATION}&query=${encodeURIComponent(email)}&limit=5`, null);
  const list = (res.json && res.json.contacts) || [];
  return list.find((c) => (c.email || '').toLowerCase() === email.toLowerCase()) || null;
}

async function main() {
  for (const email of EMAILS) {
    const c = await findByEmail(email);
    if (!c) { console.log(`NICHT GEFUNDEN: ${email}`); continue; }
    console.log(`\n${email}  (${c.id})`);
    console.log(`  vorher: [${(c.tags || []).join(', ')}]`);

    // organischen Tag hinzufuegen
    const add = await req('POST', `/contacts/${c.id}/tags`, { tags: [TAG_ORG] });
    // Ad-Tag entfernen
    const del = await req('DELETE', `/contacts/${c.id}/tags`, { tags: [TAG_AD] });
    await sleep(200);

    // Kontrolle
    const check = await req('GET', `/contacts/${c.id}`, null);
    const tags = (check.json && check.json.contact && check.json.contact.tags) || [];
    console.log(`  add:${add.status} del:${del.status}`);
    console.log(`  nachher: [${tags.join(', ')}]`);
    const ok = tags.includes(TAG_ORG) && !tags.includes(TAG_AD);
    console.log(`  => ${ok ? 'OK ✓' : 'PRUEFEN ⚠'}`);
    await sleep(200);
  }
}
main().catch((e) => { console.error('FEHLER:', e); process.exit(1); });
