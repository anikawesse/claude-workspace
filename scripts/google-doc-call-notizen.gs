/**
 * Apps Script fuer Anikas Google Doc "Gelände-Programm — Call-Notizen Kundinnen".
 * Nimmt den kompletten Doc-Inhalt von scripts\gelaende-call-doc-update.ps1
 * entgegen und schreibt ihn ins Dokument.
 *
 * EINBAU (einmalig):
 *   1. Das Google Doc oeffnen -> Menue Erweiterungen -> Apps Script
 *   2. Diesen Code komplett hineinkopieren (vorhandenes ersetzen)
 *   3. Speichern -> Bereitstellen -> Neue Bereitstellung -> Typ "Web-App"
 *      Ausfuehren als: Ich   |   Zugriff: Jeder
 *   4. Web-App-URL kopieren -> in scripts\.env bei GELAENDE_DOC_WEBAPP_URL eintragen
 *
 * SICHERHEIT: Die URL ist oeffentlich erreichbar und wird ohne Passwort-Pruefung
 * angenommen (bewusste Entscheidung wie bei der Ads-Tabelle — URL nicht weitergeben).
 *
 * WIE ES SCHREIBT: Der Doc-Inhalt wird bei jedem Aufruf KOMPLETT ERSETZT.
 * Die Quelle der Wahrheit ist die Master-Datei im Workspace
 * (outputs\gelaende-calls\kundinnen-uebersicht.md). Damit Anikas eigene
 * Aenderungen im Doc nicht verloren gehen, liest Claude das Doc VOR jedem
 * Update und uebernimmt Abweichungen zuerst in die Master-Datei.
 *
 * ERWARTETES FORMAT (JSON im POST-Body):
 *   { "bloecke": [ { "typ": "titel|h1|h2|text|bullet|linie", "text": "..." }, ... ] }
 * In "text" und "bullet" wird **fett** wie in Markdown unterstuetzt.
 */

function doPost(e) {
  try {
    const daten = JSON.parse(e.postData.contents);
    const bloecke = daten.bloecke || [];
    if (!bloecke.length) return antwort({ ok: false, fehler: 'Keine "bloecke" uebergeben.' });

    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    leereBody(body);

    let geschrieben = 0;
    bloecke.forEach(function (b) {
      const text = String(b.text || '');
      switch (b.typ) {
        case 'titel':
          body.appendParagraph(ohneFettMarker(text)).setHeading(DocumentApp.ParagraphHeading.TITLE);
          break;
        case 'h1':
          body.appendParagraph(ohneFettMarker(text)).setHeading(DocumentApp.ParagraphHeading.HEADING1);
          break;
        case 'h2':
          body.appendParagraph(ohneFettMarker(text)).setHeading(DocumentApp.ParagraphHeading.HEADING2);
          break;
        case 'linie':
          body.appendHorizontalRule();
          break;
        case 'bullet':
          schreibeMitFett(body.appendListItem('').setGlyphType(DocumentApp.GlyphType.BULLET), text);
          break;
        default: // 'text'
          schreibeMitFett(body.appendParagraph(''), text);
      }
      geschrieben++;
    });

    // body.clear() laesst einen leeren Absatz am Anfang stehen — weg damit,
    // sonst beginnt das Doc bei jedem Update mit einer Leerzeile mehr.
    const erster = body.getChild(0);
    if (erster.getType() === DocumentApp.ElementType.PARAGRAPH &&
        erster.asParagraph().getText() === '' && body.getNumChildren() > 1) {
      body.removeChild(erster);
    }

    return antwort({ ok: true, absaetze: geschrieben, dokument: doc.getName() });
  } catch (err) {
    return antwort({ ok: false, fehler: String(err) });
  }
}

/**
 * Leert den Body zuverlaessig. body.clear() wirft "Letzter Absatz kann nicht
 * entfernt werden", sobald das Dokument mit einem Listenpunkt endet (ist seit
 * dem 12.09.2026 der Fall, weil die Uebersicht mit Bullets aufhoert). Deshalb:
 * erst einen leeren Absatz ans Ende haengen (dann ist das letzte Element sicher
 * ein Absatz), dann alles davor entfernen. Der uebrig gebliebene Leerabsatz
 * wird nach dem Schreiben vom Aufraeum-Schritt in doPost entfernt.
 */
function leereBody(body) {
  body.appendParagraph('');
  for (let i = body.getNumChildren() - 2; i >= 0; i--) {
    body.removeChild(body.getChild(i));
  }
}

/** Kurzer Gesundheitscheck im Browser: Web-App-URL aufrufen -> "ok" heisst deployed. */
function doGet() {
  return antwort({ ok: true, hinweis: 'Web-App laeuft. Inhalte kommen per POST.' });
}

/**
 * Schreibt Text mit Markdown-Fett (**so**) in einen Absatz oder Listenpunkt.
 * Aufgeteilt an "**": ungerade Teile sind fett. Ein unpaariges "**" faellt
 * dadurch einfach weg statt einen Fehler zu werfen.
 */
function schreibeMitFett(element, text) {
  const teile = String(text).split('**');
  const t = element.editAsText();
  let pos = 0;
  for (let i = 0; i < teile.length; i++) {
    if (!teile[i]) continue;
    t.appendText(teile[i]);
    t.setBold(pos, pos + teile[i].length - 1, i % 2 === 1);
    pos += teile[i].length;
  }
}

/** Fuer Ueberschriften: Fett-Marker entfernen (Ueberschriften sind eh fett). */
function ohneFettMarker(text) {
  return String(text).replace(/\*\*/g, '');
}

function antwort(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
