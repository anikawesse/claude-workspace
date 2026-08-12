/*
Zieht alle Kontakte des Gelände-Webinars (08.26) aus Devine und trennt sie
zuverlässig nach ECHTER Herkunft: Ad vs. Organisch.

HINTERGRUND
Seit dem 10.08.2026 war auf der ORGANISCHEN Webinar-Seite versehentlich die
Ad-Form (QoaCgvYnHryGMHvhh4c5) eingebettet. Dadurch bekamen auch organische
Anmelder die Quelle/den Tag "...Ads". Das Feld `source`/`tags` ist deshalb
UNBRAUCHBAR fuer die Trennung.

Die echte Herkunft steht in der Attribution, die Devine pro Kontakt
unabhaengig vom Formular speichert:
  attributionSource.url  -> Landingpage-URL
    .../webinar-ads-gelaende...  = Ad   (zusaetzlich fbclid + referrer facebook)
    .../webinar-gelaende...      = Organisch
`fbclid` dient als zweites Signal.

AUSGABE
- Konsole: Zusammenfassung (Gesamt, Ad, Organisch, Fehlattribution)
- CSV: outputs/webinar-gelaende/webinar-anmelder-split.csv

AUFRUF:  node scripts/devine-webinar-split.js
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

// ---- .env laden ------------------------------------------------------------
const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const TOKEN = env.DEVINE_TOKEN;
const LOCATION = env.DEVINE_LOCATION_ID;

// ---- Konfiguration ---------------------------------------------------------
const CUTOFF = new Date('2026-08-01T00:00:00Z'); // nur Kontakte ab hier ansehen
const WEBINAR_MATCH = /webinar 08\.26|gelände webinar/i; // Quelle/Tag-Erkennung
const BUG_START = new Date('2026-08-10T00:00:00Z');       // ab hier war die Form falsch

function req(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      host: 'services.leadconnectorhq.com',
      path: urlPath,
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Version: '2021-07-28',
        Accept: 'application/json',
        ...(data ? { 'Content-Type': 'application/json' } : {}),
      },
    }, (res) => {
      let buf = '';
      res.on('data', (c) => buf += c);
      res.on('end', () => {
        try { resolve(JSON.parse(buf)); }
        catch (e) { reject(new Error(`Parse-Fehler ${res.statusCode}: ${buf.slice(0, 300)}`)); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // ---- 1) Alle relevanten Kontakte einsammeln (paginiert, dateAdded desc) ---
  console.log('Lade Kontakte aus Devine ...');
  let searchAfter = null;
  const webinarContacts = [];
  let scanned = 0, reachedCutoff = false;

  while (!reachedCutoff) {
    const body = {
      locationId: LOCATION,
      pageLimit: 100,
      sort: [{ field: 'dateAdded', direction: 'desc' }],
    };
    if (searchAfter) body.searchAfter = searchAfter;

    const res = await req('POST', '/contacts/search', body);
    const contacts = res.contacts || [];
    if (contacts.length === 0) break;

    for (const c of contacts) {
      scanned++;
      const added = new Date(c.dateAdded);
      if (added < CUTOFF) { reachedCutoff = true; continue; }
      const hay = `${c.source || ''} ${(c.tags || []).join(' ')}`;
      if (WEBINAR_MATCH.test(hay)) {
        webinarContacts.push({
          id: c.id,
          name: [c.firstName, c.lastName].filter(Boolean).join(' ') || c.contactName || '',
          email: c.email || '',
          dateAdded: c.dateAdded,
          source: c.source || '',
          tags: c.tags || [],
        });
      }
    }
    searchAfter = contacts[contacts.length - 1].searchAfter;
    if (!searchAfter) break;
    process.stdout.write(`  gescannt: ${scanned}, Webinar-Treffer: ${webinarContacts.length}\r`);
    await sleep(120);
  }
  console.log(`\nGescannt: ${scanned} Kontakte. Webinar-Anmelder gefunden: ${webinarContacts.length}`);

  // ---- 2) Pro Kontakt echte Attribution holen ------------------------------
  console.log('Lese Attribution pro Kontakt ...');
  const rows = [];
  for (let i = 0; i < webinarContacts.length; i++) {
    const wc = webinarContacts[i];
    let firstUrl = '', firstFbclid = '', firstRef = '', lastUrl = '', formId = '';
    try {
      const d = await req('GET', `/contacts/${wc.id}`, null);
      const first = (d.contact && d.contact.attributionSource) || {};   // erster Kontakt = Anmeldeseite
      const last = (d.contact && d.contact.lastAttributionSource) || {}; // letzte Interaktion (oft E-Mail-Klick)
      firstUrl = first.url || '';
      firstFbclid = first.fbclid || '';
      firstRef = first.referrer || '';
      formId = first.mediumId || '';
      lastUrl = last.url || '';
    } catch (e) {
      firstUrl = 'FEHLER: ' + e.message;
    }

    // ---- Klassifikation STRIKT nach Webinar-Seiten-URL im Erstkontakt ----
    // Nur die konkreten Webinar-Landingpages zaehlen als sicheres Signal.
    // Ein generischer fbclid reicht NICHT (koennte alter Erstkontakt sein).
    const u = firstUrl.toLowerCase();
    const taggedAds = wc.tags.some((t) => /ads/i.test(t)) || /ads/i.test(wc.source);
    const inBugWindow = new Date(wc.dateAdded) >= BUG_START;

    let herkunft, sicher;
    if (u.includes('webinar-ads-gelaende') || u.includes('webinar-ads-gelände')) {
      herkunft = 'Ad'; sicher = true;                     // Erstkontakt = Webinar-Ad-Seite
    } else if (u.includes('webinar-gelaende') || u.includes('webinar-gelände')) {
      herkunft = 'Organisch'; sicher = true;              // Erstkontakt = organische Webinar-Seite
    } else {
      // Erstkontakt ist NICHT die Webinar-Seite -> Bestandskontakt.
      // Attribution nutzlos, Rueckfall auf Tag (nur vor dem Bug wirklich zuverlaessig).
      herkunft = taggedAds ? 'Ad (nur Tag)' : 'Organisch (nur Tag)';
      sicher = false;
    }

    // Fehlattribution = sicher organisch (Webinar-Organik-Seite), aber als Ad getaggt
    const fehlattribution = sicher && herkunft === 'Organisch' && taggedAds;

    rows.push({ ...wc, attrUrl: firstUrl, fbclid: firstFbclid, referrer: firstRef, lastUrl, formId, herkunft, sicher, taggedAds, inBugWindow, fehlattribution });
    process.stdout.write(`  ${i + 1}/${webinarContacts.length}\r`);
    await sleep(120);
  }
  console.log('');

  // ---- 3) Auswertung -------------------------------------------------------
  const cnt = (f) => rows.filter(f).length;
  const adSure = cnt((r) => r.herkunft === 'Ad');
  const orgSure = cnt((r) => r.herkunft === 'Organisch');
  const adTag = cnt((r) => r.herkunft === 'Ad (nur Tag)');
  const orgTag = cnt((r) => r.herkunft === 'Organisch (nur Tag)');
  const bestand = adTag + orgTag;
  const fehl = rows.filter((r) => r.fehlattribution);
  const bugWin = rows.filter((r) => r.inBugWindow);

  console.log('\n===================== ERGEBNIS =====================');
  console.log(`Webinar-Anmelder gesamt (ab 01.08.): ${rows.length}\n`);
  console.log(`SICHER (Erstkontakt = Webinar-Landingpage):`);
  console.log(`  Ad:        ${adSure}`);
  console.log(`  Organisch: ${orgSure}`);
  console.log(`\nBESTANDSKONTAKTE (Erstkontakt aelter, nur Tag als Anhalt): ${bestand}`);
  console.log(`  Tag "Ads":      ${adTag}`);
  console.log(`  Tag "Organisch": ${orgTag}`);
  console.log(`\n--- gesamt (sicher + Tag) ---`);
  console.log(`  Ad gesamt:        ${adSure + adTag}`);
  console.log(`  Organisch gesamt: ${orgSure + orgTag}`);
  console.log(`\nIm Bug-Fenster (ab 10.08.): ${bugWin.length}`);
  console.log(`  -> SICHER organisch, aber als "Ads" getaggt: ${fehl.length}  (in Devine umtaggen)`);

  if (fehl.length) {
    console.log('\n--- Fehlattributierte (Erstkontakt = organische Webinar-Seite, aber Ad-Tag) ---');
    for (const r of fehl) {
      console.log(`  ${r.dateAdded.slice(0, 16).replace('T', ' ')}  ${r.email.padEnd(34)}  ${r.name}`);
    }
  }

  // Bestandskontakte im Bug-Fenster: hier ist die Tag-Zuordnung unsicher -> auflisten
  const bestandBug = rows.filter((r) => !r.sicher && r.inBugWindow);
  if (bestandBug.length) {
    console.log(`\n--- Bestandskontakte im Bug-Fenster (Tag evtl. falsch, ${bestandBug.length} Stk. - manuell pruefen) ---`);
    for (const r of bestandBug) {
      console.log(`  ${r.dateAdded.slice(0, 16).replace('T', ' ')}  ${r.email.padEnd(34)}  Tag: ${r.herkunft}`);
    }
  }

  // ---- 4) CSV schreiben ----------------------------------------------------
  const outDir = path.join(__dirname, '..', 'outputs', 'webinar-gelaende');
  fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, 'webinar-anmelder-split.csv');
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const header = ['dateAdded', 'name', 'email', 'herkunft', 'fehlattribution', 'im_bugfenster', 'source_alt', 'tags_alt', 'erstkontakt_url', 'fbclid', 'referrer', 'letzte_url', 'form_id'];
  const lines = [header.join(';')];
  for (const r of rows.sort((a, b) => a.dateAdded.localeCompare(b.dateAdded))) {
    lines.push([
      r.dateAdded, r.name, r.email, r.herkunft,
      r.fehlattribution ? 'JA' : '', r.inBugWindow ? 'JA' : '',
      r.source, r.tags.join('|'), r.attrUrl, r.fbclid ? 'ja' : '', r.referrer, r.lastUrl, r.formId,
    ].map(esc).join(';'));
  }
  fs.writeFileSync(csvPath, '﻿' + lines.join('\n'), 'utf8');
  console.log(`\nCSV geschrieben: ${csvPath}`);
}

main().catch((e) => { console.error('FEHLER:', e); process.exit(1); });
