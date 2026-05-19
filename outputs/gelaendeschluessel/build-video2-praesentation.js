const pptxgen = require("pptxgenjs");
const fs = require("fs");

const RUST   = "7B3F28";
const RUST_L = "C4855A";
const BEIGE  = "FAF6F0";
const WHITE  = "FFFFFF";
const DARK   = "3A1E10";
const GRAY   = "8A7060";

const LOGO   = "C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/logo.png";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "Video 2 – Dein Pferd zieht dich weg";
pres.author = "Anikas Pferdeakademie";

// ─────────────────────────────────────────────
// SLIDE 1 – Titel (angepasstes Design)
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  // Linker Akzentbalken
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: RUST }, line: { color: RUST } });

  // Oberer Label
  s.addText("Ruhig bleiben, wenn es brenzlig wird", {
    x: 0.42, y: 0.5, w: 7.5, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: RUST_L,
    italic: true, align: "left", margin: 0
  });

  // Haupt-Titel
  s.addText("Dein Pferd\nzieht dich weg.", {
    x: 0.42, y: 1.0, w: 7.5, h: 2.0,
    fontSize: 52, fontFace: "Georgia", color: RUST,
    bold: true, align: "left", margin: 0
  });

  // Untertitel
  s.addText("Was du tun kannst\nund wie du ruhig bleibst.", {
    x: 0.42, y: 3.1, w: 6.5, h: 0.95,
    fontSize: 20, fontFace: "Calibri", color: DARK,
    align: "left", margin: 0
  });

  // Logo
  s.addImage({ path: LOGO, x: 7.6, y: 3.0, w: 2.0, h: 2.0 });

  // Footer
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Anikas Pferdeakademie", {
    x: 0.42, y: 5.1, w: 9.3, h: 0.525,
    fontSize: 11, fontFace: "Calibri", color: BEIGE,
    align: "left", valign: "middle", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 – Warum dein Pferd wegzieht
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Warum dein Pferd wegzieht", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Nicht Trotz. Nicht Dominanz. Eine Reaktion.", {
    x: 0.45, y: 1.2, w: 9.1, h: 0.48,
    fontSize: 18, fontFace: "Georgia", color: RUST,
    bold: true, italic: true, align: "left", margin: 0
  });

  const cards = [
    { title: "Angst und Unsicherheit",      body: "Dein Pferd will weg, weil es sich nicht sicher fühlt. Der Instinkt des Fluchttiers übernimmt." },
    { title: "Fehlendes Vertrauen",          body: "Dein Pferd orientiert sich nicht an dir als Führungsperson. Es sucht selbst nach einem Ausweg." },
    { title: "Bedürfnis: Futter oder Gras", body: "Gerade im Frühling ein häufiger Auslöser. Das Pferd folgt seinem Instinkt, nicht dir." },
    { title: "Die Negativspirale",           body: "Du hältst fester, dein Pferd zieht stärker. Deine Anspannung überträgt sich, das Pferd wird unruhiger." },
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

  s.addText("In der Sekunde, in der dein Pferd wegzieht, reagierst du mit einem Reflex.", {
    x: 0.45, y: 1.2, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  const reactions = [
    { label: "Du hältst fest",           text: "Der Reflex ist: festhalten. Das ist normal. Aber genau das zieht dein Pferd stärker.", dark: false },
    { label: "Puls und Angst steigen",   text: "Dein Körper geht in Alarmmodus. Je stärker du dich anspannst, desto mehr spürt es dein Pferd.", dark: false },
    { label: "Die Negativspirale",       text: "Deine Anspannung bestätigt deinem Pferd: Hier ist Gefahr. Es zieht noch stärker. Ihr schaukelt euch gegenseitig hoch.", dark: true },
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

  s.addText("Die Lösung ist keine Kraftfrage. Die Lösung ist eine Körperfrage.", {
    x: 0.45, y: 4.9, w: 9.1, h: 0.42,
    fontSize: 13, fontFace: "Calibri", color: RUST_L,
    bold: true, italic: true, align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 4 – Equipment (identisch Video 1)
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

  s.addText("Gleiches Equipment wie in Video 1. Sicherheit kommt vor dem Training.", {
    x: 0.45, y: 1.18, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  const left = [
    { item: "Kappzaum oder Dually-Halfter", note: "Gibt dir Kontrolle und deinem Pferd klare Kommunikation." },
    { item: "Longe",                         note: "Kein kurzer Führstrick. Du brauchst Abstand und Länge, um reagieren zu können." },
    { item: "Gerte",                         note: "Als Kommunikationsmittel auf Abstand, nicht als Strafe." },
  ];
  const right = [
    { item: "Reitkappe",   note: "Pflicht. Keine Diskussion." },
    { item: "Handschuhe", note: "Schützen deine Hände, wenn die Longe ruckartig gezogen wird." },
    { item: "Gamaschen",  note: "Wenn dein Pferd in der Hektik gegen die eigenen Beine treten könnte." },
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
// SLIDE 5 – Im Moment des Wegziehens
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Dein Pferd zieht: So reagierst du", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  const steps = [
    { num: "1", title: "Nicht festhalten, nicht ziehen",         body: "Kein Tauziehen. Du wirst verlieren. Stattdessen: Technik." },
    { num: "2", title: "90-Grad-Winkel zum Pferd einnehmen",     body: "Stelle dich seitlich zum Pferd. Du stehst nicht direkt davor oder dahinter." },
    { num: "3", title: "Dynamisch auf die Hinterhand zugehen",   body: "Geh mit Energie auf die Hinterhand zu. Das signalisiert: Hinterhand weg." },
    { num: "4", title: "Hinterhand tritt seitwärts von dir weg", body: "Das Pferd bewegt die Hinterhand zur Seite. Dadurch dreht sich der Kopf automatisch zu dir." },
    { num: "5", title: "Kopf kommt zu dir, Aufmerksamkeit auch", body: "Du hast wieder Verbindung. Dein Pferd schaut dich an. Jetzt hört es dir wieder zu." },
  ];

  const colX = [0.35, 5.15];
  steps.forEach((step, i) => {
    const col = i < 3 ? 0 : 1;
    const idx = i < 3 ? i : i - 3;
    const x   = colX[col];
    const y   = 1.2 + idx * 1.37;
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
      fontSize: 13, fontFace: "Calibri", color: RUST,
      bold: true, align: "left", valign: "middle", margin: 0
    });
    s.addText(step.body, {
      x: x + 0.55, y: y + 0.44, w: w - 0.6, h: 0.82,
      fontSize: 12, fontFace: "Calibri", color: DARK,
      align: "left", margin: 0
    });
  });

  for (let i = 0; i < 2; i++) {
    s.addShape(pres.shapes.LINE, {
      x: 0.555, y: 1.62 + i * 1.37, w: 0, h: 0.95,
      line: { color: "D4C4B4", width: 1, dashType: "dash" }
    });
  }
}

// ─────────────────────────────────────────────
// SLIDE 6 – Wenn dein Pferd wieder bei dir ist
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Wenn dein Pferd wieder bei dir ist", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Nicht weiterdrängen. Erst prüfen, ob dein Pferd dir wirklich wieder zuhört.", {
    x: 0.45, y: 1.18, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: RUST_L,
    bold: true, italic: true, align: "left", margin: 0
  });

  const steps = [
    { num: "1", head: "Einen Moment durchatmen",          body: "Du und dein Pferd. Beide. Kein sofortiger Weitermarsch." },
    { num: "2", head: "Kleine Führübungen",               body: "Paar Schritte vorwärts, anhalten, Hinterhand seitwärts. Ist dein Pferd dabei? Hört es zu?" },
    { num: "3", head: "Prüfen, ob dein Pferd ansprechbar ist", body: "Reagiert es auf deine Hilfen? Wenn ja, habt ihr wieder eine Verbindung." },
    { num: "4", head: "Zurück in die Komfortzone",        body: "Erst wenn beide ruhig sind. Kein neuer Versuch Richtung Schwelle, bevor der Stresspegel unten ist." },
  ];

  const colX = [0.35, 5.15];
  steps.forEach((step, i) => {
    const x = colX[i % 2];
    const y = 1.78 + Math.floor(i / 2) * 1.6;
    const w = 4.5;

    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: w, h: 1.42,
      fill: { color: WHITE }, line: { color: "E0D4C8", width: 1 },
      shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 }
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.14, y: y + 0.12, w: 0.38, h: 0.38,
      fill: { color: RUST_L }, line: { color: RUST_L }
    });
    s.addText(step.num, {
      x: x + 0.14, y: y + 0.12, w: 0.38, h: 0.38,
      fontSize: 13, fontFace: "Calibri", color: WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    s.addText(step.head, {
      x: x + 0.65, y: y + 0.1, w: w - 0.78, h: 0.42,
      fontSize: 13, fontFace: "Calibri", color: RUST,
      bold: true, align: "left", valign: "top", margin: 0
    });
    s.addText(step.body, {
      x: x + 0.65, y: y + 0.54, w: w - 0.78, h: 0.82,
      fontSize: 12, fontFace: "Calibri", color: DARK,
      align: "left", margin: 0
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 7 – Stresslevel runter
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Jetzt: Stresslevel runter", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.2, w: 5.5, h: 3.65,
    fill: { color: RUST }, line: { color: RUST },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 }
  });
  s.addText("Annäherung und Rückzug", {
    x: 0.55, y: 1.35, w: 5.1, h: 0.5,
    fontSize: 17, fontFace: "Georgia", color: WHITE,
    bold: true, align: "left", margin: 0
  });
  s.addText([
    { text: "Bleibe jetzt in der Komfortzone.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Lass das Adrenalin bei euch beiden herunterkommen. Das dauert ein paar Minuten.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Erst wenn dein Pferd ruhig atmet und bei dir ist, tastest du dich wieder vorsichtig Richtung Schwelle vor.", options: {} },
  ], {
    x: 0.55, y: 1.92, w: 5.1, h: 2.8,
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
  s.addText("Das Wegziehen ist kein Machtspiel.\n\nEs ist ein Zeichen, dass dein Pferd dich noch nicht als sicheren Anker erlebt.\n\nDas könnt ihr ändern.", {
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
    { text: "Dein Pferd zieht nicht aus Boshaftigkeit.", options: { breakLine: true } },
    { text: "Der Reflex festzuhalten macht es schlimmer.", options: { breakLine: true } },
    { text: "Mit dem 90-Grad-Winkel und der Hinterhand holst du es zurück.", options: { breakLine: true } },
    { text: "Erst Komfortzone, dann Schwelle.", options: {} },
  ], {
    x: 0.45, y: 1.15, w: 9.1, h: 2.2,
    fontSize: 22, fontFace: "Georgia", color: WHITE,
    align: "left", margin: 0
  });

  s.addShape(pres.shapes.LINE, {
    x: 0.45, y: 3.55, w: 5.5, h: 0,
    line: { color: RUST_L, width: 1 }
  });

  s.addText("Im nächsten Video: Dein Pferd bewegt sich gar nicht mehr.", {
    x: 0.45, y: 3.75, w: 9.1, h: 0.45,
    fontSize: 15, fontFace: "Calibri", color: BEIGE,
    italic: true, align: "left", margin: 0
  });

  s.addText("Video 2 von 3   |   Anikas Pferdeakademie", {
    x: 0.45, y: 5.1, w: 9.1, h: 0.38,
    fontSize: 11, fontFace: "Calibri", color: RUST_L,
    align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// Speichern
// ─────────────────────────────────────────────
const outPath = "C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/video2-dein-pferd-zieht-weg.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("Gespeichert:", outPath))
  .catch(e => console.error(e));
