const pptxgen = require("pptxgenjs");

const RUST     = "7B3F28";
const RUST_L   = "C4855A";
const BEIGE    = "FAF6F0";
const WHITE    = "FFFFFF";
const DARK     = "3A1E10";
const GRAY     = "8A7060";

let pres = new pptxgen();
pres.layout  = "LAYOUT_16x9";
pres.title   = "Video 1 – Dein Pferd steigt";
pres.author  = "Anikas Pferdeakademie";

// ─────────────────────────────────────────────
// SLIDE 1 – Titel
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: RUST };

  // Beige Akzentstreifen links
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: RUST_L }, line: { color: RUST_L } });

  // Oberer Label
  s.addText("Ruhig bleiben, wenn es brenzlig wird", {
    x: 0.42, y: 0.55, w: 9.3, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: BEIGE,
    bold: false, italic: true, align: "left", margin: 0
  });

  // Haupt-Titel
  s.addText("Dein Pferd steigt.", {
    x: 0.42, y: 1.15, w: 9, h: 1.5,
    fontSize: 54, fontFace: "Georgia", color: WHITE,
    bold: true, align: "left", margin: 0
  });

  // Untertitel
  s.addText("Was du tun kannst\nund wie du ruhig bleibst.", {
    x: 0.42, y: 2.75, w: 7.5, h: 1.1,
    fontSize: 22, fontFace: "Calibri", color: BEIGE,
    align: "left", margin: 0
  });

  // Video-Label unten
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: "3A1E10" }, line: { color: "3A1E10" } });
  s.addText("Video 1 von 3   |   Anikas Pferdeakademie", {
    x: 0.42, y: 5.1, w: 9.3, h: 0.525,
    fontSize: 11, fontFace: "Calibri", color: RUST_L,
    align: "left", valign: "middle", margin: 0
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 – Warum dein Pferd steigt
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  // Header-Block
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Warum dein Pferd steigt", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  // Kernaussage
  s.addText("Kein Trotz. Keine Absicht. Eine Botschaft.", {
    x: 0.45, y: 1.22, w: 9.1, h: 0.55,
    fontSize: 19, fontFace: "Georgia", color: RUST,
    bold: true, italic: true, align: "left", margin: 0
  });

  // 4 Karten nebeneinander (2x2)
  const cards = [
    { title: "Schmerz",        body: "Dein Pferd weicht dem Druck aus. Körperliche Ursachen immer zuerst ausschließen." },
    { title: "Überforderung",  body: "Zu viel auf einmal. Dein Pferd hat keine andere Sprache mehr, um dir das zu zeigen." },
    { title: "Angst",          body: "Flucht nach oben, wenn Flucht nach vorne nicht geht. Ein Urinstinkt des Fluchttiers." },
    { title: "Fehlendes\nVertrauen", body: "Dein Pferd orientiert sich nicht an dir. Es sucht selbst nach einem Ausweg." },
  ];

  const cols = [0.35, 5.1];
  const rows = [1.95, 3.55];

  cards.forEach((card, i) => {
    const cx = cols[i % 2];
    const cy = rows[Math.floor(i / 2)];
    const cw = 4.45;
    const ch = 1.45;

    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: WHITE },
      line: { color: "E0D4C8", width: 1 },
      shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 }
    });
    // Linker Akzentbalken
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 0.07, h: ch,
      fill: { color: RUST_L }, line: { color: RUST_L }
    });
    s.addText(card.title, {
      x: cx + 0.17, y: cy + 0.1, w: cw - 0.22, h: 0.45,
      fontSize: 14, fontFace: "Calibri", color: RUST,
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

  s.addText("In dem Moment, in dem dein Pferd steigt, passiert auch in dir etwas.", {
    x: 0.45, y: 1.2, w: 9.1, h: 0.45,
    fontSize: 15, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  // 3 große Reaktions-Felder
  const reactions = [
    { label: "Adrenalin",      text: "Dein Körper schaltet sofort auf Alarm. Das ist Biologie, kein Fehler." },
    { label: "Puls steigt",    text: "Herzschlag hoch, Muskeln verkrampfen, Atem flach. Du hältst instinktiv fest." },
    { label: "Dein Pferd spürt das", text: "Es liest deine Energie in der Sekunde. Deine Anspannung bestätigt ihm: Hier ist wirklich Gefahr." },
  ];

  const rx = [0.35, 3.62, 6.89];
  const rw = 3.0;

  reactions.forEach((r, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx[i], y: 1.85, w: rw, h: 2.8,
      fill: { color: i === 2 ? RUST : WHITE },
      line: { color: i === 2 ? RUST : "E0D4C8", width: 1 },
      shadow: { type: "outer", blur: 5, offset: 2, angle: 135, color: "000000", opacity: 0.09 }
    });
    // Nummer-Kreis
    s.addShape(pres.shapes.OVAL, {
      x: rx[i] + 0.18, y: 1.98, w: 0.45, h: 0.45,
      fill: { color: i === 2 ? WHITE : RUST_L }, line: { color: i === 2 ? WHITE : RUST_L }
    });
    s.addText(String(i + 1), {
      x: rx[i] + 0.18, y: 1.98, w: 0.45, h: 0.45,
      fontSize: 14, fontFace: "Calibri", color: i === 2 ? RUST_L : WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    s.addText(r.label, {
      x: rx[i] + 0.14, y: 2.53, w: rw - 0.2, h: 0.55,
      fontSize: 15, fontFace: "Calibri", color: i === 2 ? WHITE : RUST,
      bold: true, align: "left", margin: 0
    });
    s.addText(r.text, {
      x: rx[i] + 0.14, y: 3.1, w: rw - 0.2, h: 1.35,
      fontSize: 12.5, fontFace: "Calibri", color: i === 2 ? BEIGE : DARK,
      align: "left", margin: 0
    });
  });

  // Fazit-Zeile
  s.addText("Deshalb: Deine Ruhe ist keine Kleinigkeit. Sie ist die halbe Arbeit.", {
    x: 0.45, y: 4.88, w: 9.1, h: 0.45,
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

  s.addText("Bevor du ins Training gehst, stelle sicher, dass du gut ausgerüstet bist.", {
    x: 0.45, y: 1.18, w: 9.1, h: 0.42,
    fontSize: 14, fontFace: "Calibri", color: DARK,
    italic: true, align: "left", margin: 0
  });

  // Zwei Spalten Equipment
  const left = [
    { item: "Kappzaum oder Dually-Halfter", note: "Wie im Gelände-Schlüssel gezeigt. Gibt dir Kontrolle ohne Schmerz." },
    { item: "Longe", note: "Kein kurzer Führstrick. Du brauchst Abstand, wenn dein Pferd steigt." },
    { item: "Gerte", note: "Als Kommunikationsmittel. Du nutzt sie auf Abstand, nicht als Strafe." },
  ];
  const right = [
    { item: "Reitkappe", note: "Pflicht. Keine Diskussion." },
    { item: "Handschuhe", note: "Die Longe kann bei einem ruckartigen Zug stark ziehen." },
    { item: "Gamaschen", note: "Wenn dein Pferd sehr hektisch wird und sich selbst gegen das Bein treten könnte." },
  ];

  const renderList = (items, startX) => {
    items.forEach((item, i) => {
      const y = 1.75 + i * 1.2;
      // Punkt-Kreis
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

  // Trennlinie mittig
  s.addShape(pres.shapes.LINE, {
    x: 4.95, y: 1.7, w: 0, h: 3.65,
    line: { color: "D4C4B4", width: 1 }
  });
}

// ─────────────────────────────────────────────
// SLIDE 5 – Erste Reaktion
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Dein Pferd steigt: So reagierst du", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  const steps = [
    { num: "1", title: "Nicht festhalten, nicht ziehen",   body: "Das erste Instinkt ist Festhalten. Tu es nicht. Lass los." },
    { num: "2", title: "Abstand aufbauen mit der Longe",    body: "Geh mit der Longe in der Hand rückwärts weg. Abstand schützt dich." },
    { num: "3", title: "Stelle dich in einem 90-Grad-Winkel", body: "Du stehst seitlich zu deinem Pferd, nicht direkt davor oder dahinter." },
    { num: "4", title: "Kopf sanft aber bestimmt zu dir ziehen", body: "Rückwärts weggehen und dabei den Kopf zu dir führen. Kein Reißen." },
    { num: "5", title: "Pferd kommt runter",                body: "Es verliert das Gleichgewicht und muss die Vorderbeine wieder absetzen. Du bist außerhalb der Gefahrenzone." },
  ];

  steps.forEach((step, i) => {
    const col  = i < 3 ? 0 : 1;
    const idx  = i < 3 ? i : i - 3;
    const x    = col === 0 ? 0.35 : 5.15;
    const y    = 1.2 + idx * 1.38;
    const w    = 4.5;

    // Nummer
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

  // Verbindungslinien zwischen Schritten (links)
  for (let i = 0; i < 2; i++) {
    s.addShape(pres.shapes.LINE, {
      x: 0.555, y: 1.62 + i * 1.38, w: 0, h: 1.38 - 0.42,
      line: { color: "D4C4B4", width: 1, dashType: "dash" }
    });
  }
}

// ─────────────────────────────────────────────
// SLIDE 6 – Wenn dein Pferd wieder unten ist
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: BEIGE };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: RUST }, line: { color: RUST } });
  s.addText("Sobald dein Pferd wieder unten ist", {
    x: 0.45, y: 0, w: 9.1, h: 1.05,
    fontSize: 26, fontFace: "Georgia", color: WHITE,
    bold: true, valign: "middle", align: "left", margin: 0
  });

  s.addText("Nicht weiterdrängen. Nicht ignorieren. Weiteratmen.", {
    x: 0.45, y: 1.18, w: 9.1, h: 0.42,
    fontSize: 15, fontFace: "Calibri", color: RUST_L,
    bold: true, italic: true, align: "left", margin: 0
  });

  const steps = [
    { num: "1", head: "Kurz gemeinsam durchatmen",        body: "Gebt beiden einen Moment. Du und dein Pferd. Keine Hektik jetzt." },
    { num: "2", head: "Hinterhand seitwärts schicken",    body: "Bitte die Hinterhand ein paar Tritte zur Seite weg. Das bringt dein Pferd ins Nachdenken." },
    { num: "3", head: "Vorwärts in eine kleine Volte",    body: "Schick dein Pferd in Bewegung, als würdest du es um dich herum longieren. Kleine Runde, ruhiges Tempo." },
    { num: "4", head: "Pferd ist wieder ansprechbar",     body: "Du merkst es daran, dass es auf deine Hilfen reagiert und du die Aufmerksamkeit zurückbekommst." },
  ];

  const colX = [0.35, 5.15];
  steps.forEach((step, i) => {
    const x = colX[i % 2];
    const y = 1.78 + Math.floor(i / 2) * 1.55;
    const w = 4.5;

    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: w, h: 1.38,
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
      x: x + 0.65, y: y + 0.54, w: w - 0.78, h: 0.78,
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

  // Linke Spalte: Annäherung & Rückzug
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
    { text: "Geh jetzt nicht weiter raus als vorher.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Zurück in die Komfortzone. Dort, wo dein Pferd sich sicher fühlt.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Lass das Adrenalin bei euch beiden runterkommen. Das dauert ein paar Minuten.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Dann, wenn beide ruhig atmen, kannst du vorsichtig wieder einen Schritt zur Schwelle machen.", options: {} },
  ], {
    x: 0.55, y: 1.92, w: 5.1, h: 2.8,
    fontSize: 13.5, fontFace: "Calibri", color: BEIGE,
    align: "left", margin: 0
  });

  // Rechte Spalte: Merksatz
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
  s.addText("Das Steigen ist nicht das Problem.\n\nEs ist ein Zeichen.\n\nDein Job ist es, das Zeichen zu lesen, bevor es zum Steigen kommt.", {
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
    { text: "Dein Pferd steigt nicht aus Boshaftigkeit.", options: { breakLine: true } },
    { text: "Dein Körper reagiert, und das ist normal.", options: { breakLine: true } },
    { text: "Mit der richtigen Ausrüstung bist du sicher.", options: { breakLine: true } },
    { text: "Du weißt jetzt, wie du ruhig reagierst.", options: {} },
  ], {
    x: 0.45, y: 1.15, w: 9.1, h: 2.2,
    fontSize: 24, fontFace: "Georgia", color: WHITE,
    align: "left", margin: 0
  });

  s.addShape(pres.shapes.LINE, {
    x: 0.45, y: 3.55, w: 5.5, h: 0,
    line: { color: RUST_L, width: 1 }
  });

  s.addText("Im nächsten Video: Dein Pferd zieht dich weg.", {
    x: 0.45, y: 3.75, w: 9.1, h: 0.45,
    fontSize: 15, fontFace: "Calibri", color: BEIGE,
    italic: true, align: "left", margin: 0
  });

  s.addText("Video 1 von 3   |   Anikas Pferdeakademie", {
    x: 0.45, y: 5.1, w: 9.1, h: 0.38,
    fontSize: 11, fontFace: "Calibri", color: RUST_L,
    align: "left", margin: 0
  });
}

// ─────────────────────────────────────────────
// Speichern
// ─────────────────────────────────────────────
const outPath = "C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/video1-dein-pferd-steigt.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("Gespeichert:", outPath))
  .catch(e => console.error(e));
