const pptxgen = require("pptxgenjs");

const RUST   = "7B3F28";
const RUST_L = "C4855A";
const BEIGE  = "FAF6F0";
const WHITE  = "FFFFFF";
const DARK   = "3A1E10";
const GRAY   = "8A7060";
const LOGO   = "C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/logo.png";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "Video 3 – Dein Pferd bewegt sich gar nicht mehr";
pres.author = "Anikas Pferdeakademie";

// ─────────────────────────────────────────────
// SLIDE 1 – Titel
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: RUST }, line: { color: RUST } });

  s.addText("Ruhig bleiben, wenn es brenzlig wird", {
    x: 0.42, y: 0.5, w: 7.5, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: RUST_L,
    italic: true, align: "left", margin: 0
  });

  s.addText("Dein Pferd bewegt\nsich gar nicht mehr.", {
    x: 0.42, y: 1.0, w: 7.5, h: 2.0,
    fontSize: 48, fontFace: "Georgia", color: RUST,
    bold: true, align: "left", margin: 0
  });

  s.addText("Was du tun kannst\nund wie du ruhig bleibst.", {
    x: 0.42, y: 3.1, w: 6.5, h: 0.95,
    fontSize: 20, fontFace: "Calibri", color: DARK,
    align: "left", margin: 0
  });

  s.addImage({ path: LOGO, x: 7.6, y: 3.0, w: 2.0, h: 2.0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Anikas Pferdeakademie", {
    x: 0.42, y: 5.1, w: 9.3, h: 0.525,
    fontSize: 11, fontFace: "Calibri", color: BEIGE,
    align: "left", valign: "middle", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 – Warum dein Pferd einfriert
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Warum dein Pferd einfriert", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Einfrieren ist keine Sturheit. Es ist die letzte Schutzreaktion.", {
    x: 0.45, y: 1.2, w: 9.1, h: 0.48,
    fontSize: 18, fontFace: "Georgia", color: RUST,
    bold: true, italic: true, align: "left", margin: 0
  });

  const cards = [
    { title: "Mentale Überflutung",        body: "Zu viele Reize auf einmal. Das Pferd kann nicht mehr verarbeiten und schaltet ab." },
    { title: "Angst ohne Ausweg",          body: "Flucht nach vorne geht nicht, nach oben auch nicht. Was bleibt: stillstehen und hoffen, dass die Gefahr verschwindet." },
    { title: "Überforderung an der Schwelle", body: "Du bist zu weit in Zone 3 gegangen. Dein Pferd ist an seine mentale Grenze gestoßen." },
    { title: "Erlerntes Verhalten",        body: "Hat dein Pferd die Erfahrung gemacht, dass Stillstehen den Druck wegnimmt, wiederholt es das Muster." },
  ];

  const cols = [0.35, 5.1];
  const rows = [1.85, 3.45];
  cards.forEach((card, i) => {
    const cx = cols[i % 2];
    const cy = rows[Math.floor(i / 2)];
    const cw = 4.45;
    const ch = 1.45;

    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: WHITE }, line: { color: "E0D4C8", width: 1 },
      shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 0.07, h: ch,
      fill: { color: RUST_L }, line: { color: RUST_L }
    });
    s.addText(card.title, {
      x: cx + 0.17, y: cy + 0.1, w: cw - 0.22, h: 0.45,
      fontSize: 13.5, fontFace: "Calibri", color: RUST,
      bold: true, align: "left", margin: 0
    });
    s.addText(card.body, {
      x: cx + 0.17, y: cy + 0.52, w: cw - 0.25, h: 0.88,
      fontSize: 12, fontFace: "Calibri", color: DARK,
      align: "left", margin: 0
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3 – Was in deinem Körper passiert
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Was in deinem Körper passiert", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Ein stehendes Pferd löst in uns eine ganz bestimmte Reaktion aus.", {
    x: 0.45, y: 1.2, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  const reactions = [
    { label: "Ungeduld",              text: "Du wartest, es passiert nichts. Die Ungeduld steigt. Der Drang, jetzt irgendetwas zu tun, wird größer.", dark: false },
    { label: "Treiben, locken, bitten", text: "Du probierst alles. Schimpfen, Leckerli, Ziehen. Meistens wird das Pferd dadurch noch blockierter.", dark: false },
    { label: "Dein Druck macht es schlimmer", text: "Je mehr du drängst, desto mehr friert dein Pferd ein. Es braucht einen Ausweg, keinen Anstoß von vorne.", dark: true },
  ];

  const rx = [0.35, 3.62, 6.89];
  reactions.forEach((r, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx[i], y: 1.82, w: 3.0, h: 2.88,
      fill: { color: r.dark ? RUST : WHITE },
      line: { color: r.dark ? RUST : "E0D4C8", width: 1 },
      shadow: { type: "outer", blur: 5, offset: 2, angle: 135, color: "000000", opacity: 0.09 }
    });
    s.addShape(pres.shapes.OVAL, {
      x: rx[i] + 0.18, y: 1.95, w: 0.45, h: 0.45,
      fill: { color: r.dark ? WHITE : RUST_L }, line: { color: r.dark ? WHITE : RUST_L }
    });
    s.addText(String(i + 1), {
      x: rx[i] + 0.18, y: 1.95, w: 0.45, h: 0.45,
      fontSize: 14, fontFace: "Calibri", color: r.dark ? RUST_L : WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    s.addText(r.label, {
      x: rx[i] + 0.14, y: 2.52, w: 2.75, h: 0.52,
      fontSize: 14, fontFace: "Calibri", color: r.dark ? WHITE : RUST,
      bold: true, align: "left", margin: 0
    });
    s.addText(r.text, {
      x: rx[i] + 0.14, y: 3.06, w: 2.75, h: 1.5,
      fontSize: 12.5, fontFace: "Calibri", color: r.dark ? BEIGE : DARK,
      align: "left", margin: 0
    });
  });

  s.addText("Dein Pferd braucht keinen Anstoß von vorne. Es braucht einen Ausweg zur Seite.", {
    x: 0.45, y: 4.9, w: 9.1, h: 0.42,
    fontSize: 13, fontFace: "Calibri", color: RUST_L,
    bold: true, italic: true, align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 4 – Equipment
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Das brauchst du", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Gleiches Equipment wie in Video 1 und 2.", {
    x: 0.45, y: 1.18, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  const left = [
    { item: "Dually-Halfter",  note: "Besonders wichtig bei diesem Szenario. Du brauchst die Option, sanft seitlich zu ziehen." },
    { item: "Longe",           note: "Gibt dir Abstand und Spielraum für die Seitwärtsbewegung." },
    { item: "Gerte",           note: "Dein verlängerter Arm. Du touchierst damit in der Schenkellage, nicht am Kopf." },
  ];
  const right = [
    { item: "Reitkappe",   note: "Pflicht. Auch wenn es nur ums Führen geht." },
    { item: "Handschuhe", note: "Schutz für deine Hände bei ruckartigen Bewegungen." },
    { item: "Gamaschen",  note: "Wenn dein Pferd in der Aufregung gegen die eigenen Beine tritt." },
  ];

  const renderList = (items, startX) => {
    items.forEach((item, i) => {
      const y = 1.75 + i * 1.2;
      s.addShape(pres.shapes.OVAL, {
        x: startX, y: y + 0.04, w: 0.26, h: 0.26,
        fill: { color: RUST_L }, line: { color: RUST_L }
      });
      s.addText(item.item, {
        x: startX + 0.38, y: y, w: 4.0, h: 0.35,
        fontSize: 13.5, fontFace: "Calibri", color: RUST,
        bold: true, align: "left", margin: 0
      });
      s.addText(item.note, {
        x: startX + 0.38, y: y + 0.37, w: 4.0, h: 0.65,
        fontSize: 12, fontFace: "Calibri", color: DARK,
        align: "left", margin: 0
      });
    });
  };

  renderList(left,  0.35);
  renderList(right, 5.15);
  s.addShape(pres.shapes.LINE, {
    x: 4.95, y: 1.7, w: 0, h: 3.65,
    line: { color: "D4C4B4", width: 1 }
  });
}

// ─────────────────────────────────────────────
// SLIDE 5 – Plan A: Ansprechbarkeit zurückgewinnen
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Plan A: Ansprechbarkeit zurückgewinnen", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 24, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Nicht schieben, nicht locken. Einen Ausweg zur Seite anbieten.", {
    x: 0.45, y: 1.18, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: RUST_L,
    bold: true, italic: true, align: "left", margin: 0
  });

  const steps = [
    { num: "1", title: "90-Grad-Winkel zum Pferd einnehmen",         body: "Stelle dich seitlich zu deinem Pferd. Nicht direkt davor, das erzeugt Gegendruck." },
    { num: "2", title: "Kopf sanft zur Seite ziehen",                body: "Ziehe den Kopf mit der Longe leicht zu dir. Das gibt dem Pferd eine Richtung, kein Vorwärts-Druck." },
    { num: "3", title: "Mit der Gerte in der Schenkellage touchieren", body: "Touchiere sanft an der Flanke. Nicht hauen, sondern einen Impuls setzen. Gerte als Kommunikation." },
    { num: "4", title: "Sobald das Pferd einen Schritt macht: aufhören", body: "Jeden noch so kleinen Schritt belohnen. Den Impuls wegnehmen, sobald Bewegung entsteht." },
    { num: "5", title: "Führübungen und Ansprechbarkeit prüfen",      body: "Folgt dein Pferd dir? Reagiert es auf deine Hilfen? Dann seid ihr wieder verbunden." },
  ];

  const colX = [0.35, 5.15];
  steps.forEach((step, i) => {
    const col = i < 3 ? 0 : 1;
    const idx = i < 3 ? i : i - 3;
    const x   = colX[col];
    const y   = 1.72 + idx * 1.27;
    const w   = 4.5;

    s.addShape(pres.shapes.OVAL, {
      x: x, y: y, w: 0.42, h: 0.42,
      fill: { color: RUST }, line: { color: RUST }
    });
    s.addText(step.num, {
      x: x, y: y, w: 0.42, h: 0.42,
      fontSize: 14, fontFace: "Calibri", color: WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    s.addText(step.title, {
      x: x + 0.55, y: y, w: w - 0.6, h: 0.42,
      fontSize: 12.5, fontFace: "Calibri", color: RUST,
      bold: true, align: "left", valign: "middle", margin: 0
    });
    s.addText(step.body, {
      x: x + 0.55, y: y + 0.44, w: w - 0.6, h: 0.75,
      fontSize: 11.5, fontFace: "Calibri", color: DARK,
      align: "left", margin: 0
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 6 – Plan B: Mit dem Dually-Halfter
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Plan B: Wenn Plan A nicht reicht", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 24, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Dein Pferd reagiert nicht auf die Gerte alleine. Dann kombinierst du beides.", {
    x: 0.45, y: 1.15, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  // Großes Erklärungs-Panel links
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.68, w: 5.5, h: 3.65,
    fill: { color: RUST }, line: { color: RUST },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 }
  });
  s.addText("So geht es", {
    x: 0.55, y: 1.82, w: 5.1, h: 0.45,
    fontSize: 16, fontFace: "Georgia", color: WHITE,
    bold: true, align: "left", margin: 0
  });
  s.addText([
    { text: "Stelle dich im 90-Grad-Winkel seitlich zu deinem Pferd.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Zeige mit der Gerte Richtung Touchierpunkt in der Schenkellage und treibe dort sanft.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Gleichzeitig: Baue am Dually-Halfter sanften Zug parallel zur Seite auf.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Beides zusammen gibt deinem Pferd einen klaren, sanften Ausweg.", options: {} },
  ], {
    x: 0.55, y: 2.35, w: 5.1, h: 2.8,
    fontSize: 13, fontFace: "Calibri", color: BEIGE,
    align: "left", margin: 0
  });

  // Rechts: Wichtig-Box und Merksatz
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.68, w: 3.55, h: 1.7,
    fill: { color: WHITE }, line: { color: "E0D4C8", width: 1 }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.68, w: 0.07, h: 1.7,
    fill: { color: RUST_L }, line: { color: RUST_L }
  });
  s.addText("Wichtig:", {
    x: 6.27, y: 1.82, w: 3.2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: GRAY,
    bold: true, align: "left", margin: 0
  });
  s.addText("Kein Reißen am Halfter. Sanfter, gleichmäßiger Zug zur Seite. Du zeigst einen Weg, du erzwingst ihn nicht.", {
    x: 6.27, y: 2.22, w: 3.25, h: 1.1,
    fontSize: 12.5, fontFace: "Calibri", color: DARK,
    align: "left", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 3.55, w: 3.55, h: 1.78,
    fill: { color: WHITE }, line: { color: "E0D4C8", width: 1 }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 3.55, w: 0.07, h: 1.78,
    fill: { color: RUST_L }, line: { color: RUST_L }
  });
  s.addText("Sobald es geht:", {
    x: 6.27, y: 3.68, w: 3.2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: GRAY,
    bold: true, align: "left", margin: 0
  });
  s.addText("Beim ersten Schritt sofort Druck wegnehmen. Das ist der Moment, den dein Pferd lernen soll.", {
    x: 6.27, y: 4.08, w: 3.25, h: 1.2,
    fontSize: 12.5, fontFace: "Calibri", color: DARK,
    align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 7 – Stresslevel runter
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Wenn dein Pferd wieder läuft", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.2, w: 5.5, h: 3.65,
    fill: { color: RUST }, line: { color: RUST },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 }
  });
  s.addText("Zurück in die Komfortzone", {
    x: 0.55, y: 1.35, w: 5.1, h: 0.48,
    fontSize: 16, fontFace: "Georgia", color: WHITE,
    bold: true, align: "left", margin: 0
  });
  s.addText([
    { text: "Mach ein paar ruhige Führübungen, damit du weißt, ob dein Pferd wieder bei dir ist.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Dann geht ihr zurück in die Komfortzone. Stresspegel runterfahren, bevor du wieder Richtung Schwelle gehst.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Wenn beide ruhig atmen: Dann und nur dann ein kleines Stück weiter.", options: {} },
  ], {
    x: 0.55, y: 1.92, w: 5.1, h: 2.75,
    fontSize: 13.5, fontFace: "Calibri", color: BEIGE,
    align: "left", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.2, w: 3.55, h: 3.65,
    fill: { color: WHITE }, line: { color: "E0D4C8", width: 1 }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.2, w: 0.07, h: 3.65,
    fill: { color: RUST_L }, line: { color: RUST_L }
  });
  s.addText("Merke dir:", {
    x: 6.27, y: 1.38, w: 3.2, h: 0.38,
    fontSize: 12, fontFace: "Calibri", color: GRAY,
    bold: true, align: "left", margin: 0
  });
  s.addText("Dein Pferd friert nicht ein, weil es dich ärgern will.\n\nEs friert ein, weil es keinen anderen Ausweg sieht.\n\nDu gibst ihm diesen Ausweg.", {
    x: 6.27, y: 1.85, w: 3.25, h: 2.8,
    fontSize: 14, fontFace: "Georgia", color: RUST,
    italic: true, align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 8 – Abschluss
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: RUST_L }, line: { color: RUST_L } });

  s.addText("Das nimmst du aus diesem Video mit:", {
    x: 0.45, y: 0.55, w: 9.1, h: 0.48,
    fontSize: 14, fontFace: "Calibri", color: RUST_L,
    italic: true, align: "left", margin: 0
  });

  s.addText([
    { text: "Einfrieren ist kein Trotz. Es ist die letzte Schutzreaktion.", options: { breakLine: true } },
    { text: "Druck von vorne macht es schlimmer.", options: { breakLine: true } },
    { text: "Ein Ausweg zur Seite löst das Einfrieren.", options: { breakLine: true } },
    { text: "Plan A: Gerte. Plan B: Dually dazu. Beides sanft.", options: {} },
  ], {
    x: 0.45, y: 1.15, w: 9.1, h: 2.2,
    fontSize: 22, fontFace: "Georgia", color: WHITE,
    align: "left", margin: 0
  });

  s.addShape(pres.shapes.LINE, {
    x: 0.45, y: 3.55, w: 5.5, h: 0,
    line: { color: RUST_L, width: 1 }
  });

  s.addText("Du hast jetzt alle drei Videos. Gut gemacht.", {
    x: 0.45, y: 3.75, w: 9.1, h: 0.45,
    fontSize: 15, fontFace: "Calibri", color: BEIGE,
    italic: true, align: "left", margin: 0
  });

  s.addText("Video 3 von 3   |   Anikas Pferdeakademie", {
    x: 0.45, y: 5.1, w: 9.1, h: 0.38,
    fontSize: 11, fontFace: "Calibri", color: RUST_L,
    align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// Speichern
// ─────────────────────────────────────────────
const outPath = "C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/video3-pferd-bewegt-sich-nicht.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("Gespeichert:", outPath))
  .catch(e => console.error(e));
