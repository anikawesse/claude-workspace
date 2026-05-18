const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const rust = "7B3F28";
const rustLight = "C4855A";
const beige = "FAF6F0";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: rust, font: "Calibri" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: rustLight, font: "Calibri" })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Calibri", ...opts })]
  });
}

function pause(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    indent: { left: 720 },
    children: [new TextRun({ text, size: 20, italics: true, color: "888888", font: "Calibri" })]
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "C4855A", space: 1 } },
    children: []
  });
}

function empty() {
  return new Paragraph({ children: [] });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // TITEL
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Audio-Training: Session 1", bold: true, size: 40, color: rust, font: "Calibri" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "\"Wo ist die magische Schwelle deines Pferdes?\"", size: 28, italics: true, color: rustLight, font: "Calibri" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 240 },
        children: [new TextRun({ text: "Order Bump 2 — \"Ich bin an deiner Seite\"", size: 20, color: "888888", font: "Calibri" })]
      }),

      divider(),

      // META
      body("Format: Gesprochene Anleitung, direkt beim Führen auf Kopfhörern"),
      body("Länge: ca. 12–15 Minuten"),
      body("Ziel: Die magische Schwelle finden — der Punkt, wo dein Pferd anfängt, unsicherer zu werden"),

      empty(),
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Hinweis für die Aufnahme:", bold: true, size: 22, font: "Calibri" })]
      }),
      body("- Ruhige, warme Stimme — wie eine gute Freundin, die neben dir steht"),
      body("- Viele kurze Pausen einbauen (im Skript als [Pause] markiert)"),
      body("- Nicht hetzen — das Tempo der Aufnahme gibt das Tempo der Session vor"),

      divider(),

      // INTRO
      h1("INTRO"),
      pause("(wird abgespielt, bevor die Person zum Pferd geht)"),
      empty(),
      body("Hallo, ich bin Anika — und ich begleite dich heute durch deine erste Session."),
      empty(),
      body("Du brauchst nichts weiter als dein Pferd, dein Führseil — und diese Aufnahme."),
      empty(),
      body("Das Ziel heute ist kein großes Ziel. Wir gehen nicht weit. Wir kämpfen nicht. Wir entdecken nur."),
      empty(),
      body("Dein einziger Job in den nächsten Minuten: beobachten. Dein Pferd zeigt dir heute etwas. Du lernst zuzuhören."),
      empty(),
      body("Schnapp dir dein Pferd. Ich warte auf dich."),
      empty(),
      pause("[Pause — 15 Sekunden]"),

      divider(),

      // TEIL 1
      h1("TEIL 1: ANKOMMEN — AUF DEM HOF"),
      pause("(Person ist beim Pferd, hat es angehalftert)"),
      empty(),
      body("Gut, dass du da bist."),
      empty(),
      body("Bevor ihr losgeht — bleib kurz stehen, genau hier."),
      empty(),
      body("Schau dein Pferd an. Nicht um irgendetwas zu beurteilen. Einfach nur schauen."),
      empty(),
      body("Wie ist es heute? Bewegen sich die Ohren locker? Steht der Hals entspannt?"),
      empty(),
      pause("[Pause — 8 Sekunden]"),
      empty(),
      body("Und jetzt du: Wie bist du heute? Bist du angespannt, weil du nicht weißt, was passiert? Das ist okay. Das darf sein."),
      empty(),
      body("Atme einmal tief ein — und lass beim Ausatmen die Schultern fallen."),
      empty(),
      pause("[Pause — 5 Sekunden]"),
      empty(),
      body("Dein Pferd spürt dich. Je ruhiger du bist, desto ruhiger kann es sein."),
      empty(),
      body("Jetzt fangt ihr an — ganz entspannt, ganz ohne Ziel. Einfach ein bisschen durch den Hof schlendern. Da, wo es deinem Pferd gut geht."),
      empty(),
      pause("[Pause — 20 Sekunden — Zeit zum Bewegen]"),

      divider(),

      // TEIL 2
      h1("TEIL 2: AUFWÄRMEN IN ZONE 1"),
      pause("(Führarbeit auf dem Hof — ca. 3 Minuten)"),
      empty(),
      body("Schön. Ihr seid in Bewegung."),
      empty(),
      body("Schau, wie dein Pferd läuft. Folgt es dir — oder zieht es dich? Bleibt es bei dir, wenn du langsamer wirst?"),
      empty(),
      body("Probier es aus: Mach zwei, drei Schritte langsamer als bisher."),
      empty(),
      pause("[Pause — 8 Sekunden]"),
      empty(),
      body("Was macht dein Pferd?"),
      empty(),
      body("Wenn es auch langsamer wird und bei dir bleibt — dann seid ihr schon ein Team. Das ist der Anfang von allem."),
      empty(),
      body("Lauft noch ein bisschen. Entspannt. Kein Ziel, keine Richtung."),
      empty(),
      pause("[Pause — 25 Sekunden]"),
      empty(),
      body("Gut. Ihr habt gerade Vertrauen aufgebaut — auch wenn es sich noch nach nichts Großem anfühlt."),

      divider(),

      // TEIL 3
      h1("TEIL 3: AUF DIE SCHWELLE ZUGEHEN"),
      pause("(Richtung Hoftor — langsam)"),
      empty(),
      body("Jetzt kommt der spannende Teil."),
      empty(),
      body("Wir gehen gemeinsam Richtung Hoftor. Ganz langsam. Keine Eile."),
      empty(),
      body("Und während ihr geht, passiert dein eigentlicher Job: Du beobachtest."),
      empty(),
      body("Schau auf den Hals. Schau auf die Ohren. Schau, ob der Schritt leichter oder schwerer wird."),
      empty(),
      pause("[Pause — 10 Sekunden — Zeit zum Gehen]"),
      empty(),
      body("Ihr nähert euch dem Tor. Und irgendwo auf diesem Weg — vielleicht schon jetzt, vielleicht erst am Tor selbst — wird etwas in deinem Pferd leicht anders."),
      empty(),
      body("Vielleicht hebt es den Kopf minimal. Vielleicht wird der Schritt einen Tick zackiger. Vielleicht schaut es in eine bestimmte Richtung."),
      empty(),
      body("Das ist sie. Die Schwelle.", { bold: true }),
      empty(),
      body("Nicht der Ort. Das Gefühl — das kleine Zögern, bevor es größer wird."),
      empty(),
      pause("[Pause — 10 Sekunden]"),
      empty(),
      body("Bist du schon dort? Oder noch auf dem Weg?"),
      empty(),
      body("Lauf einfach weiter, bis du diesen Moment spürst."),
      empty(),
      pause("[Pause — 20 Sekunden]"),

      divider(),

      // TEIL 4
      h1("TEIL 4: AN DER SCHWELLE STEHENBLEIBEN"),
      empty(),
      body("Wenn du das Gefühl hast — jetzt verändert sich etwas — dann bleib stehen. Genau hier."),
      empty(),
      body("Noch nicht zurück. Einfach nur stehen."),
      empty(),
      pause("[Pause — 5 Sekunden]"),
      empty(),
      body("Leg deine Hand an den Hals deines Pferdes, wenn es sich richtig anfühlt."),
      empty(),
      body("Atme. Ruhig. Ohne etwas zu erwarten."),
      empty(),
      pause("[Pause — 10 Sekunden]"),
      empty(),
      body("Schau: Kann dein Pferd hier stehen? Auch wenn es angespannter ist als auf dem Hof — kann es bleiben?"),
      empty(),
      body("Wenn ja, dann wartet ihr gemeinsam. So lange, bis ihr beide ruhig atmet."),
      empty(),
      pause("[Pause — 15 Sekunden]"),
      empty(),
      body("Das ist Annäherung und Rückzug in der ersten Übung. Nicht mit dem Körper des Pferdes — sondern mit dem Stresslevel. Du gehst an die Schwelle heran. Du bleibst. Du wartest, bis es sich entspannt."),
      empty(),
      body("Das ist heute deine Arbeit. Mehr nicht."),

      divider(),

      // TEIL 5
      h1("TEIL 5: FREIWILLIG ZURÜCKGEHEN"),
      empty(),
      body("Jetzt — bevor dein Pferd unruhig wird — gehst du zurück."),
      empty(),
      body("Nicht weil es drängt. Sondern weil du entscheidest."),
      empty(),
      body("Das ist der wichtigste Moment der Session: Du gehst freiwillig zurück. Und dein Pferd lernt: Mein Mensch entscheidet. Und entscheidet gut.", { bold: true }),
      empty(),
      pause("[Pause — 5 Sekunden]"),
      empty(),
      body("Dreh euch um. Geht ein Stück zurück in den Hof."),
      empty(),
      pause("[Pause — 15 Sekunden]"),
      empty(),
      body("Spürst du, wie dein Pferd anders wird? Lockerer? Leichter?"),
      empty(),
      body("Das ist Erleichterung. Und diese Erleichterung ist Gold. Sie zeigt dir: Hier, an der Schwelle, war etwas anders. Das Pferd hat es gespürt. Und du hast es jetzt gefunden."),

      divider(),

      // TEIL 6
      h1("TEIL 6: ZWEITE ANNÄHERUNG"),
      pause("(Optional — nur wenn beide noch entspannt sind)"),
      empty(),
      body("Wenn du möchtest und dein Pferd noch ruhig ist — geht noch einmal zur Schwelle."),
      empty(),
      body("Gleicher Punkt. Gleiche Ruhe."),
      empty(),
      body("Diesmal weißt du schon, was dich erwartet. Das macht es leichter."),
      empty(),
      pause("[Pause — 25 Sekunden — Zeit für den zweiten Durchgang]"),
      empty(),
      body("Und wieder: Freiwillig zurück, bevor es eng wird."),
      empty(),
      pause("[Pause — 15 Sekunden]"),

      divider(),

      // ABSCHLUSS
      h1("ABSCHLUSS"),
      empty(),
      body("Ihr könnt jetzt entspannt zum Stall zurückgehen."),
      empty(),
      pause("[Pause — 10 Sekunden]"),
      empty(),
      body("Du hast heute etwas Wichtiges getan: Du hast zugehört. Nicht auf dein Pferd eingewirkt — zugehört."),
      empty(),
      body("Und du hast die magische Schwelle gefunden. Den Ort, wo die Arbeit beginnt. Den Punkt, wo Vertrauen entsteht."),
      empty(),
      body("Morgen gehst du wieder dorthin. Und du wartest wieder. Und wenn dein Pferd dort entspannter wird — dann hast du eure gemeinsame Komfortzone ein kleines Stück erweitert."),
      empty(),
      body("So funktioniert die Methode. Schritt für Schritt."),
      empty(),
      body("Ich bin bei deiner nächsten Session wieder dabei."),

      divider(),

      // PRODUKTIONSHINWEISE
      h1("PRODUKTIONSHINWEISE"),
      empty(),
      body("Gesamtlänge Ziel: 12–14 Minuten"),
      body("Pausen großzügig nehmen — lieber zu lang als zu kurz; die Person ist in Bewegung"),
      body("Ton: warm, ruhig, kein Coaching-Pathos — wie ein ruhiges Gespräch"),
      body("Kein Musik-Hintergrund während der aktiven Teile (Ablenkung für Pferd möglich)"),
      body("Optionale sanfte Musik nur im Intro und Abschluss (5–10 Sek. fade)"),
      body("Dateiname Vorschlag: gs-audio-session1-schwelle-finden.mp3"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const out = 'C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/audio-training-session1-skript.docx';
  fs.writeFileSync(out, buffer);
  console.log('Gespeichert:', out);
});
