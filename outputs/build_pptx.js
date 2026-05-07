const pptxgen = require("pptxgenjs");
let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Warum dein Pferd nicht alleine vom Hof geht';

const BG = "FAF6F0";
const RUST = "7B3F28";
const DARK = "2C2C2C";
const PLACEHOLDER_BG = "E8E0D8";
const FONT_HEAD = "Montserrat";
const FONT_BODY = "Open Sans";

const RIGHT_X = 4.7;
const RIGHT_W = 5.0;
const LABEL_H = 0.28;
const HEAD_H = 0.75;

function addImgPlaceholder(slide, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.5, w: 4.0, h: 4.6,
    fill: { color: PLACEHOLDER_BG },
    line: { color: "C8BAB0", width: 1 }
  });
  slide.addText(label, {
    x: 0.4, y: 2.4, w: 4.0, h: 0.8,
    align: "center", valign: "middle",
    fontSize: 10, color: "8B7A72", italic: true,
    fontFace: FONT_BODY
  });
}

// SLIDE 1 — Cover
let s1 = pres.addSlide();
s1.background = { color: BG };
s1.addText("Warum dein Pferd nicht alleine vom Hof geht", {
  x: 1.0, y: 1.3, w: 8.0, h: 1.8,
  fontSize: 40, bold: true, color: RUST,
  fontFace: FONT_HEAD, align: "center", wrap: true
});
s1.addText("Was wirklich hinter dem Blockieren steckt — und warum es nicht deine Schuld ist", {
  x: 1.2, y: 3.2, w: 7.6, h: 1.0,
  fontSize: 18, color: DARK,
  fontFace: FONT_BODY, align: "center", wrap: true
});
s1.addShape(pres.shapes.RECTANGLE, {
  x: 8.5, y: 4.85, w: 1.1, h: 0.45,
  fill: { color: "EDE4DC" }, line: { color: "C8BAB0", width: 1 }
});
s1.addText("[LOGO]", {
  x: 8.5, y: 4.85, w: 1.1, h: 0.45,
  align: "center", valign: "middle",
  fontSize: 10, color: RUST, fontFace: FONT_BODY
});

// SLIDE 2 — Problem-Einstieg
let s2 = pres.addSlide();
s2.background = { color: BG };
addImgPlaceholder(s2, "[BILD: Pferd schaut zurück zur Herde]");
s2.addText("DU KENNST DAS VIELLEICHT...", {
  x: RIGHT_X, y: 0.52, w: RIGHT_W, h: LABEL_H,
  fontSize: 9, bold: true, color: RUST, charSpacing: 2,
  fontFace: FONT_HEAD, margin: 0
});
s2.addText("Du kennst das vielleicht...", {
  x: RIGHT_X, y: 0.85, w: RIGHT_W, h: HEAD_H,
  fontSize: 26, bold: true, color: RUST,
  fontFace: FONT_HEAD, wrap: true
});
s2.addText([
  { text: "Die Sonne scheint. Alle ziehen los. Du bleibst zurück.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Dein Pferd blockiert an der Hofauffahrt — und bewegt sich keinen Millimeter.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Es wird hektisch, sobald ihr das Stallgelände verlasst.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Oder: Es zieht immer nur zum anderen Pferd hin, nie von ihm weg.", options: { bullet: true } }
], {
  x: RIGHT_X, y: 1.7, w: RIGHT_W, h: 2.4,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});
s2.addText("Du hast schon alles probiert. Und fragst dich: Warum klappt das bei anderen?", {
  x: RIGHT_X, y: 4.2, w: RIGHT_W, h: 0.75,
  fontSize: 13, italic: true, color: RUST,
  fontFace: FONT_BODY, wrap: true
});

// SLIDE 3 — Impact
let s3 = pres.addSlide();
s3.background = { color: BG };
s3.addText("DIE ANTWORT", {
  x: 1.0, y: 0.65, w: 8.0, h: 0.35,
  fontSize: 10, bold: true, color: RUST, charSpacing: 4,
  fontFace: FONT_HEAD, align: "center"
});
s3.addText([
  { text: "Dein Pferd ist nicht stur.", options: { breakLine: true } },
  { text: "Es ist nicht kaputt.", options: { breakLine: true } },
  { text: "Es hat gerade ein Bedürfnis —", options: { breakLine: true } },
  { text: "das noch nicht erfüllt wird.", options: {} }
], {
  x: 1.0, y: 1.2, w: 8.0, h: 3.8,
  fontSize: 36, bold: true, color: DARK,
  fontFace: FONT_HEAD, align: "center", valign: "middle", wrap: true
});

// SLIDE 4 — Uralte Regeln
let s4 = pres.addSlide();
s4.background = { color: BG };
addImgPlaceholder(s4, "[BILD: Pferd allein auf Weide]");
s4.addText("DEIN PFERD", {
  x: RIGHT_X, y: 0.52, w: RIGHT_W, h: LABEL_H,
  fontSize: 9, bold: true, color: RUST, charSpacing: 2,
  fontFace: FONT_HEAD, margin: 0
});
s4.addText("Dein Pferd lebt noch nach uralten Regeln", {
  x: RIGHT_X, y: 0.85, w: RIGHT_W, h: HEAD_H,
  fontSize: 24, bold: true, color: RUST,
  fontFace: FONT_HEAD, wrap: true
});
s4.addText([
  { text: "Pferde sind Beutetiere. Ihr oberstes Bedürfnis: Sicherheit.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Nicht Fressen. Nicht Komfort. Sicherheit — also: nicht gefressen werden.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Dieser Urinstinkt ist nach Jahrtausenden Domestizierung noch genauso stark.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Er lässt sich nicht einfach abstellen.", options: { bullet: true } }
], {
  x: RIGHT_X, y: 1.7, w: RIGHT_W, h: 2.4,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});
s4.addText("Rational weiß dein Pferd, dass kein Raubtier kommt. Aber der Körper reagiert trotzdem.", {
  x: RIGHT_X, y: 4.2, w: RIGHT_W, h: 0.75,
  fontSize: 13, italic: true, color: RUST,
  fontFace: FONT_BODY, wrap: true
});

// SLIDE 5 — Herde = Sicherheitsweste
let s5 = pres.addSlide();
s5.background = { color: BG };
addImgPlaceholder(s5, "[BILD: Pferde in Gruppe, friedlich]");
s5.addText("WARUM DIE HERDE SO WICHTIG IST", {
  x: RIGHT_X, y: 0.52, w: RIGHT_W, h: LABEL_H,
  fontSize: 9, bold: true, color: RUST, charSpacing: 2,
  fontFace: FONT_HEAD, margin: 0
});
s5.addText("Die Herde ist die Sicherheitsweste deines Pferdes", {
  x: RIGHT_X, y: 0.85, w: RIGHT_W, h: HEAD_H,
  fontSize: 22, bold: true, color: RUST,
  fontFace: FONT_HEAD, wrap: true
});
s5.addText([
  { text: "In der Herde gibt es viele Augen, viele Ohren — Schutz durch Gemeinschaft.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Allein draußen bedeutet: keine Warnung, kein Rückhalt, keine Orientierung.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Je weiter weg vom Stall und von den Artgenossen — desto mehr Alarm im Nervensystem.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
  { text: "Das ist keine Entscheidung. Das ist Biologie.", options: { bullet: true } }
], {
  x: RIGHT_X, y: 1.75, w: RIGHT_W, h: 2.7,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});

// SLIDE 6 — Wie zeigt sich das
let s6 = pres.addSlide();
s6.background = { color: BG };
addImgPlaceholder(s6, "[BILD: Pferd blockiert/zögert]");
s6.addText("SO SIEHT ES AUS", {
  x: RIGHT_X, y: 0.52, w: RIGHT_W, h: LABEL_H,
  fontSize: 9, bold: true, color: RUST, charSpacing: 2,
  fontFace: FONT_HEAD, margin: 0
});
s6.addText("So sieht 'Ich bin nicht sicher' aus", {
  x: RIGHT_X, y: 0.85, w: RIGHT_W, h: HEAD_H,
  fontSize: 24, bold: true, color: RUST,
  fontFace: FONT_HEAD, wrap: true
});
s6.addText([
  { text: "Es friert ein — steht wie ein Fels, lässt sich nicht bewegen", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
  { text: "Es steigt, bockt oder läuft rückwärts", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
  { text: "Es wird hektisch und zieht ständig in Richtung Stall", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
  { text: "Es ist am Putzplatz unruhig, wenn die anderen nicht in Sicht sind", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
  { text: "Auf dem Rückweg: plötzlich Gas — als wäre es ein anderes Pferd", options: { bullet: true } }
], {
  x: RIGHT_X, y: 1.7, w: RIGHT_W, h: 2.5,
  fontSize: 13, color: DARK, fontFace: FONT_BODY, wrap: true
});
s6.addText("Manche Pferde schreien. Manche frieren. Beides ist dasselbe: Angst.", {
  x: RIGHT_X, y: 4.3, w: RIGHT_W, h: 0.7,
  fontSize: 13, italic: true, color: RUST,
  fontFace: FONT_BODY, wrap: true
});

// SLIDE 7 — Zwei Typen
let s7 = pres.addSlide();
s7.background = { color: BG };
s7.addText("WICHTIG ZU WISSEN", {
  x: 0.5, y: 0.42, w: 9.0, h: 0.3,
  fontSize: 9, bold: true, color: RUST, charSpacing: 3,
  fontFace: FONT_HEAD, align: "center"
});
s7.addText("Nicht jede Angst sieht gleich aus", {
  x: 0.5, y: 0.78, w: 9.0, h: 0.65,
  fontSize: 30, bold: true, color: RUST,
  fontFace: FONT_HEAD, align: "center"
});
// Left box
s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.65, w: 4.2, h: 2.4,
  fill: { color: "F5E6DF" }, line: { color: "DBC4B8", width: 1 }
});
s7.addText("Extrovertiert", {
  x: 0.7, y: 1.8, w: 3.8, h: 0.5,
  fontSize: 18, bold: true, color: RUST, fontFace: FONT_HEAD
});
s7.addText("Steigt, bockt, reißt sich los.\nWirkt dramatisch — ist schwer zu übersehen.", {
  x: 0.7, y: 2.35, w: 3.8, h: 1.4,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});
// Right box
s7.addShape(pres.shapes.RECTANGLE, {
  x: 5.3, y: 1.65, w: 4.2, h: 2.4,
  fill: { color: "F0EAE0" }, line: { color: "D8CEBC", width: 1 }
});
s7.addText("Introvertiert", {
  x: 5.5, y: 1.8, w: 3.8, h: 0.5,
  fontSize: 18, bold: true, color: DARK, fontFace: FONT_HEAD
});
s7.addText("Friert ein, bewegt sich nicht.\nWird oft als Sturheit missverstanden.", {
  x: 5.5, y: 2.35, w: 3.8, h: 1.4,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});
s7.addText("In beiden Fällen: 'Ich fühle mich gerade nicht sicher.'", {
  x: 0.5, y: 4.25, w: 9.0, h: 0.7,
  fontSize: 17, bold: true, color: DARK,
  fontFace: FONT_BODY, align: "center", wrap: true
});

// SLIDE 8 — Impact
let s8 = pres.addSlide();
s8.background = { color: BG };
s8.addText("DAS WICHTIGSTE", {
  x: 1.0, y: 0.65, w: 8.0, h: 0.35,
  fontSize: 10, bold: true, color: RUST, charSpacing: 4,
  fontFace: FONT_HEAD, align: "center"
});
s8.addText("Dein Pferd macht es nicht, um dich zu ärgern.", {
  x: 1.0, y: 1.2, w: 8.0, h: 1.2,
  fontSize: 30, bold: true, color: RUST,
  fontFace: FONT_HEAD, align: "center", wrap: true
});
s8.addText([
  { text: "Es kann in diesem Moment nicht einfach einen Schalter umlegen.", options: { breakLine: true } },
  { text: "Und du hast auch nichts falsch gemacht.", options: { breakLine: true } },
  { text: "Du hattest nur noch nicht den richtigen Schlüssel.", options: {} }
], {
  x: 1.5, y: 2.7, w: 7.0, h: 2.2,
  fontSize: 20, color: DARK,
  fontFace: FONT_BODY, align: "center", wrap: true
});

// SLIDE 9 — Verstehen kommt zuerst
let s9 = pres.addSlide();
s9.background = { color: BG };
addImgPlaceholder(s9, "[BILD: Mensch führt Pferd entspannt]");
s9.addText("DER ERSTE SCHRITT", {
  x: RIGHT_X, y: 0.52, w: RIGHT_W, h: LABEL_H,
  fontSize: 9, bold: true, color: RUST, charSpacing: 2,
  fontFace: FONT_HEAD, margin: 0
});
s9.addText("Verstehen kommt zuerst", {
  x: RIGHT_X, y: 0.85, w: RIGHT_W, h: HEAD_H,
  fontSize: 26, bold: true, color: RUST,
  fontFace: FONT_HEAD, wrap: true
});
s9.addText("Wer weiß, warum sein Pferd so reagiert, hört auf, dagegen zu kämpfen. Und fängt an, mit dem Pferd zusammenzuarbeiten.", {
  x: RIGHT_X, y: 1.7, w: RIGHT_W, h: 1.0,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});
s9.addText([
  { text: "Dein Pferd braucht jemanden, dem es vertrauen kann — draußen.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Es braucht eine Führungsperson, die zeigt: 'Hier ist es sicher.'", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Und es braucht einen Plan, der Schritt für Schritt die Komfortzone erweitert.", options: { bullet: true } }
], {
  x: RIGHT_X, y: 2.75, w: RIGHT_W, h: 1.7,
  fontSize: 14, color: DARK, fontFace: FONT_BODY, wrap: true
});
s9.addText("Genau das lernst du im nächsten Schritt.", {
  x: RIGHT_X, y: 4.5, w: RIGHT_W, h: 0.6,
  fontSize: 14, bold: true, italic: true, color: RUST,
  fontFace: FONT_BODY, wrap: true
});

// SLIDE 10 — Closing
let s10 = pres.addSlide();
s10.background = { color: BG };
s10.addText("ALS NÄCHSTES", {
  x: 1.0, y: 0.7, w: 8.0, h: 0.35,
  fontSize: 10, bold: true, color: RUST, charSpacing: 4,
  fontFace: FONT_HEAD, align: "center"
});
s10.addText("Vertrauen aufbauen — noch auf dem Hof", {
  x: 1.0, y: 1.25, w: 8.0, h: 1.3,
  fontSize: 36, bold: true, color: DARK,
  fontFace: FONT_HEAD, align: "center", wrap: true
});
s10.addText([
  { text: "Die eine Übung, die alles verändert.", options: { breakLine: true } },
  { text: "Dein Pferd lernt: Ich kann ihr folgen. Ich bin bei ihr sicher.", options: {} }
], {
  x: 1.5, y: 2.9, w: 7.0, h: 1.2,
  fontSize: 18, color: DARK,
  fontFace: FONT_BODY, align: "center", wrap: true
});
s10.addText("Bis gleich — deine Anika 🗝️", {
  x: 1.0, y: 4.35, w: 8.0, h: 0.6,
  fontSize: 16, italic: true, color: RUST,
  fontFace: FONT_BODY, align: "center"
});
s10.addShape(pres.shapes.RECTANGLE, {
  x: 8.5, y: 4.85, w: 1.1, h: 0.45,
  fill: { color: "EDE4DC" }, line: { color: "C8BAB0", width: 1 }
});
s10.addText("[LOGO]", {
  x: 8.5, y: 4.85, w: 1.1, h: 0.45,
  align: "center", valign: "middle",
  fontSize: 10, color: RUST, fontFace: FONT_BODY
});

pres.writeFile({ fileName: "C:\\Users\\Olive\\Desktop\\claude-workspace\\outputs\\modul1-warum-pferd-nicht-mitgeht.pptx" })
  .then(() => console.log("Done"))
  .catch(e => { console.error(e); process.exit(1); });
