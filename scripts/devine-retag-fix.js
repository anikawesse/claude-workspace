/*
Nachtrag zu devine-retag.js: entfernt den Ad-Tag zuverlaessig.
Der DELETE-Endpunkt matcht den Tag wegen Unicode-Normalisierung ("ä") nicht.
Deshalb: Tags so auslesen, wie die API sie liefert (byte-genau), den Ad-Tag
per ASCII-Teil "webinar ads" herausfiltern und die Liste per PUT neu setzen.
Aufruf: node scripts/devine-retag-fix.js
*/
const fs = require('fs');
const path = require('path');
const https = require('https');

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2];
}
const TOKEN = env.DEVINE_TOKEN;
const TAG_ORG = 'gelände webinar 08.26';
const IDS = [
  ['ankaufmann83@gmx.de', '9owoKg1DQbHDMFk8w2nz'],
  ['yvonne@yr-immo.de', 'L2YFmDAV6KjWGa1N1dFL'],
  ['g.wenker@outlook.de', 'pNIbB8WFvhkDFlTPHffU'],
  ['corinna@gutschoenberg.com', '5c6DtrdYU1LdgJIt2lnJ'],
];

function req(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      host: 'services.leadconnectorhq.com', path: urlPath, method,
      headers: { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', Accept: 'application/json',
        ...(data ? { 'Content-Type': 'application/json' } : {}) },
    }, (res) => { let b = ''; res.on('data', (c) => b += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, json: JSON.parse(b) }); }
        catch (e) { resolve({ status: res.statusCode, raw: b }); } }); });
    r.on('error', reject); if (data) r.write(data); r.end();
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const [email, id] of IDS) {
    const cur = await req('GET', `/contacts/${id}`, null);
    const tags = (cur.json && cur.json.contact && cur.json.contact.tags) || [];
    // Ad-Tag per ASCII-Teil entfernen (unabhaengig vom "ä"), org-Tag sicherstellen
    let newTags = tags.filter((t) => !/webinar ads/i.test(t));
    if (!newTags.some((t) => /webinar 08\.26/i.test(t) && !/ads/i.test(t))) newTags.push(TAG_ORG);

    const upd = await req('PUT', `/contacts/${id}`, { tags: newTags });
    await sleep(200);
    const chk = await req('GET', `/contacts/${id}`, null);
    const after = (chk.json && chk.json.contact && chk.json.contact.tags) || [];
    const ok = after.some((t) => /webinar 08\.26/i.test(t) && !/ads/i.test(t)) && !after.some((t) => /webinar ads/i.test(t));
    console.log(`${email}`);
    console.log(`  vorher:  [${tags.join(', ')}]`);
    console.log(`  nachher: [${after.join(', ')}]  (PUT ${upd.status})`);
    console.log(`  => ${ok ? 'OK ✓' : 'PRUEFEN ⚠'}\n`);
    await sleep(200);
  }
}
main().catch((e) => { console.error('FEHLER:', e); process.exit(1); });
