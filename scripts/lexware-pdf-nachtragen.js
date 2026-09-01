/*
 * ThriveCart-Rechnungs-PDFs an bereits gebuchte Lexware-Belege nachtraeglich anhaengen.
 * ====================================================================================
 * Gedacht fuer den Fall, dass ein Monat ohne PDF-Ordner gebucht wurde (siehe
 * lexware-import.js --month). Belege, die schon eine Datei haben, werden uebersprungen.
 *
 * Verwendung:
 *   node scripts/lexware-pdf-nachtragen.js "<PDF-Ordner>"            # anhaengen
 *   node scripts/lexware-pdf-nachtragen.js "<PDF-Ordner>" --dry-run  # nur anzeigen
 *
 * Voraussetzung: scripts/.env mit LEXWARE_API_KEY
 */

const fs = require('fs');
const path = require('path');

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const LX_KEY = env.LEXWARE_API_KEY;
if (!LX_KEY) { console.error('LEXWARE_API_KEY fehlt in scripts/.env'); process.exit(1); }

const LX = 'https://api.lexware.io/v1';
const args = process.argv.slice(2);
const dir = args[0];
const dryRun = args.includes('--dry-run');
if (!dir || !fs.existsSync(dir)) { console.error('Bitte PDF-Ordner als erstes Argument angeben.'); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
let last = 0;
async function gate() { const w = 550 - (Date.now() - last); if (w > 0) await sleep(w); last = Date.now(); }

async function lx(method, pfad, tries = 5) {
  for (let a = 1; ; a++) {
    await gate();
    const r = await fetch(`${LX}${pfad}`, { method, headers: { Authorization: `Bearer ${LX_KEY}`, Accept: 'application/json' } });
    if (r.status === 429 && a < tries) { await sleep(1500 * a); continue; }
    let j = null; try { j = await r.json(); } catch (e) {}
    return { status: r.status, json: j };
  }
}

async function attach(voucherId, filePath, tries = 5) {
  for (let a = 1; ; a++) {
    await gate();
    const buf = fs.readFileSync(filePath);
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'application/pdf' }), path.basename(filePath));
    fd.append('type', 'voucher');
    const r = await fetch(`${LX}/vouchers/${voucherId}/files`, {
      method: 'POST', headers: { Authorization: `Bearer ${LX_KEY}`, Accept: 'application/json' }, body: fd,
    });
    if (r.status === 429 && a < tries) { await sleep(1500 * a); continue; }
    return r.status;
  }
}

// voucherNumber -> ThriveCart-Rechnungsnummer (wie in lexware-import.js)
function invNum(vn) {
  if (!vn) return null;
  let m = String(vn).match(/^TC-(\d+)$/i);
  if (m) return String(parseInt(m[1], 10));
  m = String(vn).match(/^0{2,}(\d+)$/);
  if (m) return String(parseInt(m[1], 10));
  return null;
}

(async () => {
  // PDFs einlesen: Rechnungsnummer -> Datei
  const num2file = {};
  for (const f of fs.readdirSync(dir)) {
    if (!/\.pdf$/i.test(f)) continue;
    const m = f.match(/(\d{4,})/);
    if (m) num2file[String(parseInt(m[1], 10))] = path.join(dir, f);
  }

  // Belege laden
  const belege = {};
  for (let page = 0; page < 20; page++) {
    const r = await lx('GET', `/voucherlist?voucherType=salesinvoice&voucherStatus=open,paid,voided,transferred&size=250&page=${page}`);
    const content = (r.json && r.json.content) || [];
    for (const v of content) {
      const n = invNum(v.voucherNumber);
      if (n) belege[n] = v.id;
    }
    if (r.status >= 300 || content.length < 250) break;
  }

  const nums = Object.keys(num2file).sort((a, b) => a - b);
  console.log(`\n${dryRun ? '[VORSCHAU]\n' : ''}${nums.length} PDF(s) im Ordner, ${Object.keys(belege).length} Belege in Lexware.\n`);

  const stats = { angehaengt: 0, hatte_schon: 0, kein_beleg: 0, fehler: 0 };
  for (const n of nums) {
    const id = belege[n];
    if (!id) { console.log(`Nr ${n}: kein Beleg in Lexware -> uebersprungen`); stats.kein_beleg++; continue; }
    const d = await lx('GET', `/vouchers/${id}`);
    const hat = ((d.json && d.json.files) || []).length > 0;
    if (hat) { stats.hatte_schon++; continue; }
    if (dryRun) { console.log(`Nr ${n}: WUERDE angehaengt`); stats.angehaengt++; continue; }
    const st = await attach(id, num2file[n]);
    if (st >= 300) { console.log(`Nr ${n}: FEHLER ${st}`); stats.fehler++; continue; }
    stats.angehaengt++;
  }

  console.log(`\nFertig. Angehaengt: ${stats.angehaengt}${dryRun ? ' (Vorschau)' : ''} | hatte schon ein PDF: ${stats.hatte_schon} | ohne Beleg: ${stats.kein_beleg} | Fehler: ${stats.fehler}`);
})().catch(e => { console.error(e); process.exit(1); });
