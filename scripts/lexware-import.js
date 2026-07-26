/*
 * ThriveCart-Rechnungen -> Lexware Office Belege
 * ==================================================
 * Pro ThriveCart-Rechnung (PDF aus dem manuellen ThriveCart-Export):
 *   1. Kontakt in Lexware anlegen ODER vorhandenen wiederverwenden (Dedup per E-Mail)
 *   2. Beleg (voucherType salesinvoice) mit korrekter Kategorie/Steuer buchen
 *      - DE:        Einnahmen, 19% (Satz aus ThriveCart)
 *      - EU-B2C:    Elektronische Dienstleistung in EU-Land steuerpflichtig (OSS), Zielland-Satz
 *      - Drittland: Einnahmen, 0% (Privatkunden, kein B2B)
 *   3. Original-ThriveCart-PDF an den Beleg haengen
 * Danach schlaegt Lexware den Beleg unter "Umsaetze zuordnen" als Treffer vor.
 *
 * DOPPELBUCHUNGS-SCHUTZ: Rechnungen, die in Lexware schon als Beleg existieren
 * (egal ob manuell als "000000099" oder automatisch als "TC-99"), werden uebersprungen.
 *
 * Verwendung:
 *   node scripts/lexware-import.js "<PDF-Ordner>" --all            # alle PDFs im Ordner
 *   node scripts/lexware-import.js "<PDF-Ordner>" 126 106 109      # nur diese Rechnungsnummern
 *   node scripts/lexware-import.js "<PDF-Ordner>" --all --dry-run  # nur Vorschau, nichts buchen
 *
 * Voraussetzung: scripts/.env mit THRIVECART_API_KEY und LEXWARE_API_KEY
 */

const fs = require('fs');
const path = require('path');

// ---------- .env laden ----------
const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const TC_KEY = env.THRIVECART_API_KEY;
const LX_KEY = env.LEXWARE_API_KEY;
if (!TC_KEY || !LX_KEY) { console.error('THRIVECART_API_KEY oder LEXWARE_API_KEY fehlt in scripts/.env'); process.exit(1); }

const LX = 'https://api.lexware.io/v1';
const EU = new Set('AT BE BG HR CY CZ DK EE FI FR GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE'.split(' '));
const KAT = {
  DE:        '8f8664a1-fd86-11e1-a21f-0800200c9a66', // Einnahmen
  EU:        '7ecea006-844c-4c98-a02d-aa3142640dd5', // Elektronische Dienstleistung in EU-Land steuerpflichtig
  DRITTLAND: '8f8664a1-fd86-11e1-a21f-0800200c9a66', // Einnahmen (0%)
};

// ---------- Args ----------
const args = process.argv.slice(2);
const dir = args[0];
if (!dir || !fs.existsSync(dir)) { console.error('Bitte PDF-Ordner als erstes Argument angeben.'); process.exit(1); }
const dryRun = args.includes('--dry-run');
const wantAll = args.includes('--all');
const wantNums = new Set(args.slice(1).filter(a => /^\d+$/.test(a)).map(a => String(parseInt(a, 10))));

// ---------- PDFs im Ordner: Rechnungsnummer -> Dateiname ----------
const num2file = {};
for (const f of fs.readdirSync(dir)) {
  if (!/\.pdf$/i.test(f)) continue;
  const m = f.match(/(\d{4,})/);
  if (m) num2file[String(parseInt(m[1], 10))] = path.join(dir, f);
}

// ---------- HTTP-Helfer ----------
async function tc(pfad, query = {}) {
  const qs = new URLSearchParams(query).toString();
  const r = await fetch(`https://thrivecart.com/api/external${pfad}?${qs}`, { headers: { Authorization: `Bearer ${TC_KEY}` } });
  return r.json();
}
// Lexware erlaubt max ~2 Anfragen/Sekunde -> drosseln + bei 429 erneut versuchen
const sleep = ms => new Promise(r => setTimeout(r, ms));
let lastLx = 0;
async function gate() {
  const wait = Math.max(0, lastLx + 600 - Date.now());
  if (wait) await sleep(wait);
  lastLx = Date.now();
}
async function lx(method, pfad, body, tries = 5) {
  for (let attempt = 1; ; attempt++) {
    await gate();
    const r = await fetch(`${LX}${pfad}`, {
      method,
      headers: { Authorization: `Bearer ${LX_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const txt = await r.text();
    let json; try { json = txt ? JSON.parse(txt) : {}; } catch { json = { raw: txt }; }
    if (r.status === 429 && attempt < tries) { await sleep(1500 * attempt); continue; }
    return { status: r.status, json };
  }
}
async function attachPdf(voucherId, filePath, tries = 5) {
  const buf = fs.readFileSync(filePath);
  for (let attempt = 1; ; attempt++) {
    await gate();
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'application/pdf' }), path.basename(filePath));
    fd.append('type', 'voucher');
    const r = await fetch(`${LX}/vouchers/${voucherId}/files`, { method: 'POST', headers: { Authorization: `Bearer ${LX_KEY}`, Accept: 'application/json' }, body: fd });
    if (r.status === 429 && attempt < tries) { await sleep(1500 * attempt); continue; }
    return { status: r.status };
  }
}
const round2 = n => Math.round(n * 100) / 100;

// voucherNumber -> ThriveCart-Rechnungsnummer (int) normalisieren; sonst null
function invNumFromVoucherNumber(vn) {
  if (!vn) return null;
  let m = String(vn).match(/^TC-(\d+)$/i);      // automatisch: TC-126
  if (m) return String(parseInt(m[1], 10));
  m = String(vn).match(/^0{2,}(\d+)$/);          // manuell:    000000099
  if (m) return String(parseInt(m[1], 10));
  return null;
}

(async () => {
  // ---------- 1) ThriveCart-Transaktionen nach invoice_id gruppieren (nur charges) ----------
  const byInv = {};
  for (let p = 1; p <= 8; p++) {
    const d = await tc('/transactions', { perPage: 100, page: p });
    const list = (d && d.transactions) || [];
    if (!list.length) break;
    for (const t of list) {
      if (t.transaction_type !== 'charge') continue;
      const inv = String(t.invoice_id);
      (byInv[inv] = byInv[inv] || []).push(t);
    }
  }

  // ---------- 2) Schon gebuchte Belege laden (Doppelbuchungs-Schutz) ----------
  const alreadyBooked = new Set();
  for (let page = 0; page < 20; page++) {
    const r = await lx('GET', `/voucherlist?voucherType=salesinvoice&voucherStatus=open,paid,voided,transferred&size=250&page=${page}`);
    const content = r.json.content || [];
    for (const v of content) {
      const n = invNumFromVoucherNumber(v.voucherNumber);
      if (n) alreadyBooked.add(n);
    }
    if (r.status >= 300 || content.length < 250) break;
  }

  // ---------- Kontakt-Cache (Dedup per E-Mail) ----------
  const contactCache = {};
  async function getOrCreateContact(c, a, land, num, orderId) {
    const email = (c.email || '').trim().toLowerCase();
    if (email && contactCache[email]) return contactCache[email];
    if (email) {
      const found = await lx('GET', `/contacts?email=${encodeURIComponent(email)}`);
      const hit = (found.json.content || [])[0];
      if (hit && hit.id) { contactCache[email] = hit.id; return hit.id; }
    }
    let firstName = (c['first name'] || '').trim();
    let lastName = (c['last name'] || '').trim();
    if (!firstName && !lastName) { lastName = c.email ? c.email.trim() : `Unbekannt (Rechnung ${num})`; }
    const body = {
      version: 0,
      roles: { customer: {} },
      person: { firstName, lastName },
      addresses: { billing: [{ street: (a['line 1'] || '').trim(), zip: (a.zip || '').trim(), city: (a.city || '').trim(), countryCode: land }] },
      emailAddresses: email ? { other: [c.email.trim()] } : undefined,
      note: `ThriveCart Order ${orderId} / Rechnung ${num}`,
    };
    const ct = await lx('POST', '/contacts', body);
    if (ct.status >= 300) throw new Error(`Kontakt-Fehler ${ct.status}: ${JSON.stringify(ct.json)}`);
    if (email) contactCache[email] = ct.json.id;
    return ct.json.id;
  }

  // ---------- 3) Zu verarbeitende Rechnungsnummern ----------
  const nums = Object.keys(num2file).filter(n => wantAll || wantNums.has(n)).sort((x, y) => x - y);
  if (!nums.length) { console.error('Keine passenden Rechnungsnummern im Ordner gefunden.'); process.exit(1); }

  const stats = { gebucht: 0, uebersprungen: 0, fehler: 0 };
  console.log(`\n${dryRun ? '[VORSCHAU – es wird NICHTS gebucht]\n' : ''}${nums.length} Rechnung(en) im Ordner, ${alreadyBooked.size} bereits in Lexware gebucht.\n`);

  for (const num of nums) {
    const items = byInv[num];
    const file = num2file[num];
    if (!items) { console.log(`Nr ${num}: kein ThriveCart-Treffer -> uebersprungen`); stats.uebersprungen++; continue; }
    if (alreadyBooked.has(num)) { console.log(`Nr ${num}: bereits gebucht -> uebersprungen`); stats.uebersprungen++; continue; }

    const first = items[0];
    const c = first.customer || {};
    const a = c.address || {};
    const land = a.country || 'DE';
    const fall = land === 'DE' ? 'DE' : EU.has(land) ? 'EU' : 'DRITTLAND';
    const rate = fall === 'DRITTLAND' ? 0 : Math.round((first.tax || 0) * 100);
    const voucherItems = items.map(t => ({
      amount: round2(parseFloat(t.amount_str)),
      taxAmount: fall === 'DRITTLAND' ? 0 : round2(parseFloat(t.tax_paid_str || '0')),
      taxRatePercent: rate,
      categoryId: KAT[fall],
    }));
    const totalGross = round2(voucherItems.reduce((s, i) => s + i.amount, 0));
    const totalTax = round2(voucherItems.reduce((s, i) => s + i.taxAmount, 0));

    // Test-/Gratis-Bestellungen (eigene Testkaeufe mit TESTCODE, 0-EUR) niemals als Einnahme buchen
    if (items.some(t => (t.coupon || '') === 'TESTCODE') || totalGross <= 0) {
      console.log(`Nr ${num}: Test-/0€-Bestellung -> uebersprungen`);
      stats.uebersprungen++;
      continue;
    }

    let name = `${(c['first name'] || '').trim()} ${(c['last name'] || '').trim()}`.trim();
    if (!name) name = `⚠ Name fehlt (${c.email || 'keine E-Mail'})`;

    if (dryRun) {
      console.log(`Nr ${num} | ${fall} ${rate}% | ${name} (${land}) | ${totalGross}€ / ${totalTax}€ USt | ${items.length} Pos. -> WUERDE gebucht`);
      stats.gebucht++;
      continue;
    }

    try {
      const contactId = await getOrCreateContact(c, a, land, num, first.order_id);
      const vc = await lx('POST', '/vouchers', {
        type: 'salesinvoice',
        voucherNumber: `TC-${num}`,
        voucherDate: first.date,
        totalGrossAmount: totalGross,
        totalTaxAmount: totalTax,
        taxType: 'gross',
        useCollectiveContact: false,
        contactId,
        remark: `ThriveCart Order ${first.order_id} – ${items.map(i => i.item_name).join(', ')}`,
        voucherItems,
      });
      if (vc.status >= 300) throw new Error(`Beleg-Fehler ${vc.status}: ${JSON.stringify(vc.json)}`);
      const at = await attachPdf(vc.json.id, file);
      const pdf = at.status < 300 ? 'PDF ✓' : `PDF-FEHLER ${at.status}`;
      console.log(`Nr ${num} | ${fall} ${rate}% | ${name} (${land}) | ${totalGross}€ / ${totalTax}€ USt | ${pdf}`);
      stats.gebucht++;
    } catch (e) {
      console.log(`Nr ${num}: FEHLER – ${e.message}`);
      stats.fehler++;
    }
  }

  console.log(`\nFertig. Gebucht: ${stats.gebucht}${dryRun ? ' (Vorschau)' : ''} | Uebersprungen: ${stats.uebersprungen} | Fehler: ${stats.fehler}`);
})().catch(e => { console.error(e); process.exit(1); });
