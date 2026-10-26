// Aufruf: node scripts/export-zertifikat-energetik.js "Petra Schröder" ["26. Oktober 2026"]
// Nutzt Chrome headless direkt (kein puppeteer nötig). Querformat kommt aus @page in der HTML.
const { execFileSync } = require('child_process');
const fs = require('fs');

const name = process.argv[2] || 'Petra Schröder';
const datum = process.argv[3];

const params = new URLSearchParams({ name });
if (datum) params.set('datum', datum);

const url = 'file:///C:/Users/Olive/Desktop/claude-workspace/outputs/energetik/zertifikat/zertifikat.html?' + params;
const outPath = `C:/Users/Olive/Desktop/claude-workspace/outputs/energetik/zertifikat/Zertifikat Energetik - ${name}.pdf`;

// Erst in eine Temp-Datei drucken: Chrome scheitert sonst still, wenn das Ziel-PDF gerade geöffnet ist
const tmpPath = require('path').join(require('os').tmpdir(), `zertifikat-${Date.now()}.pdf`);
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=4000',
  `--print-to-pdf=${tmpPath}`,
  url
], { stdio: 'ignore' });

try {
  fs.copyFileSync(tmpPath, outPath);
} catch (e) {
  console.error(`FEHLER: ${outPath} ist gesperrt (noch im PDF-Viewer offen?). Bitte schließen und nochmal starten.`);
  process.exit(1);
} finally {
  fs.unlinkSync(tmpPath);
}

console.log(`PDF saved: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
