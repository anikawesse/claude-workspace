const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT  = path.join(__dirname, 'checkliste-pferd-signale.pdf');
const LOGO = path.join(__dirname, 'logo.png');

const BG      = '#FAF6F0';
const RUST    = '#7B3F28';
const RUST_LT = '#C4855A';
const DARK    = '#2C2C2C';
const BOX_LT  = '#F0E8E0';
const BOX_ROW = '#F0E8E0';

function hex(c) {
  const r = parseInt(c.slice(1,3),16)/255;
  const g = parseInt(c.slice(3,5),16)/255;
  const b = parseInt(c.slice(5,7),16)/255;
  return [r,g,b];
}

const doc = new PDFDocument({
  size: 'A4', margin: 0,
  info: { Title: 'Checkliste – Pferd-Signale', Author: 'Anikas Pferdeakademie' }
});
const ws = fs.createWriteStream(OUT);
doc.pipe(ws);

const W = doc.page.width;   // 595.28
const H = doc.page.height;  // 841.89

// ── Background
doc.rect(0,0,W,H).fill(BG);

// ── Top bar
doc.rect(0,0,W,5).fill(RUST);

// ── Header
const HDR_H = 114;
doc.rect(0,5,W,HDR_H).fill(RUST);

// Logo circle (clipped)
const LOGO_R = 36;   // radius
const LOGO_X = W - 52;
const LOGO_Y = 5 + HDR_H/2;
doc.save();
doc.circle(LOGO_X, LOGO_Y, LOGO_R).clip();
doc.image(LOGO, LOGO_X - LOGO_R, LOGO_Y - LOGO_R, { width: LOGO_R*2, height: LOGO_R*2 });
doc.restore();
// Circle border
doc.circle(LOGO_X, LOGO_Y, LOGO_R)
   .lineWidth(2).stroke('rgba(255,255,255,0.4)');

// Header label
doc.fillColor('white').opacity(0.65)
   .font('Helvetica').fontSize(7.5).text('ANIKAS PFERDEAKADEMIE', 38, 20, { characterSpacing: 2 });

// Header title
doc.fillColor('white').opacity(1)
   .font('Helvetica-Bold').fontSize(22)
   .text('Woran erkennst du, dass dein Pferd nervös wird?', 38, 33, { width: W - 120, lineGap: 1 });

// Header sub
doc.fillColor('white').opacity(0.85)
   .font('Helvetica-Oblique').fontSize(10)
   .text('Checkliste: Subtile und deutliche Signale', 38, 96);

// ── Intro
const INTRO_Y = 5 + HDR_H + 11;
doc.fillColor(DARK).opacity(1)
   .font('Helvetica').fontSize(9.5)
   .text(
     'Pferde zeigen ihre Unsicherheit oft lange, bevor sie wirklich heftig werden. Lerne, die frühen Zeichen zu lesen, dann kannst du beruhigend eingreifen, bevor der Stresspegel zu hoch wird.',
     38, INTRO_Y, { width: W - 76, lineGap: 2 }
   );

// ── Columns setup
const COL_Y    = INTRO_Y + 33;
const GAP      = 12;
const COL_W    = (W - 76 - GAP) / 2;
const COL1_X   = 38;
const COL2_X   = 38 + COL_W + GAP;

// Footer & hint heights (to calculate available item area)
const FOOTER_H = 32;
const HINT_H   = 46;
const HINT_MG  = 10;
const BOT_BAR  = 4;
const BOTTOM   = H - BOT_BAR - FOOTER_H - HINT_MG - HINT_H - HINT_MG;

// Section head height
const HEAD_H = 24;

// Available height for items
const ITEMS_AREA = BOTTOM - COL_Y - HEAD_H;
const ITEM_COUNT = 10;
const ITEM_H     = ITEMS_AREA / ITEM_COUNT;

// ── Draw section
function drawSection(x, headColor, items, checkColor) {
  // Header bar
  doc.rect(x, COL_Y, COL_W, HEAD_H).fill(headColor);

  // Draw items
  items.forEach((text, i) => {
    const iy = COL_Y + HEAD_H + i * ITEM_H;
    // Row background (alternating)
    if (i % 2 === 1) doc.rect(x, iy, COL_W, ITEM_H).fill(BOX_ROW);

    // Checkbox
    const cbSize = 9;
    const cbX = x + 10;
    const cbY = iy + ITEM_H/2 - cbSize/2;
    doc.rect(cbX, cbY, cbSize, cbSize)
       .lineWidth(1.2).stroke(checkColor);

    // Text
    doc.fillColor(DARK).font('Helvetica').fontSize(9)
       .text(text, x + 26, iy + ITEM_H/2 - 5.5, {
         width: COL_W - 32,
         height: ITEM_H,
         lineGap: 0
       });
  });
}

// Section labels on header bars
function drawSectionLabel(x, color, label) {
  doc.fillColor('white').opacity(1)
     .font('Helvetica-Bold').fontSize(9.5)
     .text(label, x + 10, COL_Y + HEAD_H/2 - 5.5, { width: COL_W - 16 });
}

const subtileItems = [
  'Ohren aufgestellt, drehen sich angespannt',
  'Blick wird starr, Augen weiten sich leicht',
  'Nüstern blähen sich auf',
  'Hals- und Rückenmuskeln spannen sich an',
  'Schaut ständig Richtung Stall oder Herde',
  'Schritte werden zögerlicher, Tempo nimmt ab',
  'Orientiert sich nur noch am Begleitpferd',
  'Schweif angezogen oder nervös schlagend',
  'Atmung wird schneller und flacher',
  'Kaut nicht mehr, Kiefer pressen aufeinander',
];

const deutlicheItems = [
  'Bleibt abrupt stehen, lässt sich kaum bewegen',
  'Zieht stark in Richtung Stall oder Herde',
  'Wiehert laut oder ruft wiederholt',
  'Steigt oder macht Versuche zu bocken',
  'Läuft rückwärts oder dreht sich weg',
  'Versucht sich loszureißen',
  'Gibt auf dem Heimweg plötzlich Gas',
  'Ist kaum noch ansprechbar und zu bremsen',
  'Friert komplett ein — Ochs vorm Berg',
  'Schwitzt trotz wenig Bewegung',
];

// Draw columns background (reset BG after rows)
doc.rect(COL1_X, COL_Y, COL_W, HEAD_H + ITEMS_AREA).fill(BG);
doc.rect(COL2_X, COL_Y, COL_W, HEAD_H + ITEMS_AREA).fill(BG);

drawSection(COL1_X, RUST_LT, subtileItems, RUST_LT);
drawSection(COL2_X, RUST,    deutlicheItems, RUST);

// Section head labels (drawn after sections so they're on top)
doc.rect(COL1_X, COL_Y, COL_W, HEAD_H).fill(RUST_LT);
doc.rect(COL2_X, COL_Y, COL_W, HEAD_H).fill(RUST);
// Draw colored dot + label for each section header
function drawDotLabel(x, dotColor, label) {
  const dotR = 4.5;
  const dotX = x + 14;
  const dotY = COL_Y + HEAD_H / 2;
  doc.circle(dotX, dotY, dotR).fill(dotColor);
  doc.fillColor('white').opacity(1)
     .font('Helvetica-Bold').fontSize(9.5)
     .text(label, x + 26, COL_Y + HEAD_H / 2 - 5.5, { width: COL_W - 32 });
}

drawDotLabel(COL1_X, '#F5C518', 'Subtile Signale — frühe Warnung');
drawDotLabel(COL2_X, '#E03B2B', 'Deutliche Signale — klare Alarmzeichen');

// ── Hint box
const HINT_Y = BOTTOM + HINT_MG;
doc.rect(38, HINT_Y, W-76, HINT_H).fill(BOX_LT);
doc.rect(38, HINT_Y, 3.5, HINT_H).fill(RUST);
doc.fillColor(RUST).font('Helvetica-Bold').fontSize(9)
   .text('Dein Gradmesser:', 50, HINT_Y + 7);
doc.fillColor(DARK).font('Helvetica').fontSize(9)
   .text(
     'Je mehr Signale du gleichzeitig siehst, desto höher der Stresspegel deines Pferdes. Halte an, bevor er kippt — ein kurzer Moment der Ruhe ist wertvoller als ein Meter mehr Strecke.',
     50, HINT_Y + 19, { width: W - 100, lineGap: 1.5 }
   );

// ── Footer
const FOOT_Y = H - BOT_BAR - FOOTER_H;
doc.rect(0, FOOT_Y, W, FOOTER_H).fill(RUST);
doc.fillColor('white').opacity(0.9)
   .font('Helvetica-Oblique').fontSize(9)
   .text(
     'Ein ruhiges Pferd beginnt damit, dass du die Signale verstehst. — Deine Anika',
     38, FOOT_Y + FOOTER_H/2 - 5,
     { width: W - 76, align: 'center' }
   );

// ── Bottom bar
doc.rect(0, H-BOT_BAR, W, BOT_BAR).fill(RUST_LT);

doc.end();
ws.on('finish', () => {
  console.log('PDF created:', OUT, `(${fs.statSync(OUT).size} bytes)`);
});
