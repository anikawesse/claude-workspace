/**
 * Apps Script fuer Anikas Google-Tabelle "Auswertung Gelände-Schlüssel 2026".
 * Nimmt die Zahlen von minikurs-auswertung.ps1 entgegen und traegt sie ein.
 *
 * EINBAU (einmalig):
 *   1. Tabelle oeffnen -> Menue Erweiterungen -> Apps Script
 *   2. Diesen Code komplett hineinkopieren (vorhandenes ersetzen)
 *   3. Unten GEHEIM durch den Wert aus scripts\.env (SHEET_SECRET) ersetzen
 *   4. Speichern -> Bereitstellen -> Neue Bereitstellung -> Typ "Web-App"
 *      Ausfuehren als: Ich   |   Zugriff: Jeder
 *   5. Web-App-URL kopieren -> in scripts\.env bei SHEET_WEBAPP_URL eintragen
 *
 * SICHERHEIT: Die URL ist oeffentlich erreichbar, deshalb prueft das Skript das
 * Passwort. Ohne passendes Passwort passiert nichts. URL + Passwort zusammen
 * nicht weitergeben.
 *
 * WIE ES SCHREIBT: Die Tabelle hat MEHRERE BLAETTER (April, Mai, Juli ...), je Monat
 * eins. Deshalb werden ALLE Blaetter durchsucht — nicht nur das erste.
 * In jedem Blatt wird in Spalte A nach "Datum" gesucht; rechts davon stehen die Tage.
 * Fuer jeden gelieferten Tag wird die passende Spalte gesucht und in den Zeilen
 * darunter der jeweilige Wert gesetzt.
 * Zeilen, die nicht geliefert werden (z.B. "Änderungen", Stornostatistik), bleiben
 * unangetastet — Anikas eigene Notizen werden nie ueberschrieben.
 */

const GEHEIM = 'GEHEIM';   // <- durch SHEET_SECRET aus der .env ersetzen

// Welche gelieferte Kennzahl gehoert in welche Tabellenzeile?
// Gesucht wird per "faengt an mit", weil die Beschriftungen je Monatsblock
// leicht abweichen ("Audiotraining 27/17€" vs. "Audiotraining 17€").
// format: Anzeigeformat der Zelle. Geschrieben werden immer echte ZAHLEN —
// so bleibt die Spalte rechenbar und sortierbar, das €/% macht die Formatierung.
// Prozent: Google erwartet den Bruchwert (0,0519 wird als 5,19% angezeigt).
const EURO    = '#,##0.00 €';
const PROZENT = '0.00%';
const ZAHL    = '0';
const KOMMA   = '0.00';

const ZEILEN_MUSTER = [
  { key: 'Gelände-Schlüssel',   praefix: 'gelände-schlüssel',    format: ZAHL },
  { key: 'Audiotraining',       praefix: 'audiotraining',        format: ZAHL },
  { key: 'Videoreihe',          praefix: 'videoserie',           format: ZAHL },  // heisst in der Tabelle "Videoserie"
  { key: 'Videoreihe',          praefix: 'videoreihe',           format: ZAHL },  // falls doch mal so benannt
  { key: 'Upsell',              praefix: 'upsell',               format: ZAHL },
  { key: 'Bruttoumsatz',        praefix: 'bruttoumsatz',         format: EURO },
  { key: 'Verdienst',           praefix: 'verdienst',            format: EURO },
  { key: 'Gesamtumsatz organisch', praefix: 'gesamtumsatz organisch', format: EURO },
  { key: 'Adspend',             praefix: 'adspend',              format: EURO },
  { key: 'ROAS',                praefix: 'roas',                 format: KOMMA },
  { key: 'Warenkorb brutto',    praefix: 'warenkorb',            format: EURO },
  { key: 'Einkaufspreis (CPA)', praefix: 'einkaufspreis',        format: EURO },
  { key: 'Gewinn',              praefix: 'gewinn',               format: EURO },
  { key: 'Salespage Besucher',  praefix: 'salespage besucher',   format: ZAHL },
  { key: 'Salespage Conversion',praefix: 'salespage conversion', format: PROZENT },
  { key: 'Breakeven (CPA)',     praefix: 'breakeven',            format: EURO }
];

function doPost(e) {
  try {
    const daten = JSON.parse(e.postData.contents);
    if (daten.secret !== GEHEIM) return antwort({ ok: false, fehler: 'Falsches Passwort' });

    // Alle Blaetter einlesen (ein Blatt pro Monat)
    const blaetter = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function (b) {
      return { blatt: b, werte: b.getDataRange().getValues() };
    });

    const geschrieben = [];
    const nichtGefunden = [];

    (daten.tage || []).forEach(function (tag) {
      let treffer = null, ziel = null;
      for (let i = 0; i < blaetter.length && !treffer; i++) {
        treffer = findeSpalte(blaetter[i].werte, tag.datum);
        if (treffer) ziel = blaetter[i];
      }
      if (!treffer) { nichtGefunden.push(tag.datum); return; }

      let gesetzt = 0;
      Object.keys(tag.werte).forEach(function (kennzahl) {
        const wert = tag.werte[kennzahl];
        if (wert === '' || wert === null || wert === undefined) return;   // Leeres nie schreiben
        const fund = findeZeile(ziel.werte, treffer.datumZeile, kennzahl);
        if (!fund) return;
        const zelle = ziel.blatt.getRange(fund.zeile + 1, treffer.spalte + 1);
        zelle.setValue(wert);                    // echte Zahl
        zelle.setNumberFormat(fund.format);      // €, % oder blanke Zahl
        gesetzt++;
      });

      // Ampelfarben (z.B. Break-even) — Hintergrund je Zelle
      if (tag.farben) {
        Object.keys(tag.farben).forEach(function (kennzahl) {
          const fund = findeZeile(ziel.werte, treffer.datumZeile, kennzahl);
          if (fund) ziel.blatt.getRange(fund.zeile + 1, treffer.spalte + 1).setBackground(tag.farben[kennzahl]);
        });
      }
      geschrieben.push(tag.datum + ': ' + gesetzt + ' Werte in "' + ziel.blatt.getName() + '"');
    });

    return antwort({ ok: true, geschrieben: geschrieben, datum_nicht_gefunden: nichtGefunden });
  } catch (err) {
    return antwort({ ok: false, fehler: String(err) });
  }
}

/** Sucht die Spalte, in der ein Datum steht — in irgendeinem "Datum"-Block. */
function findeSpalte(werte, datumText) {
  for (let z = 0; z < werte.length; z++) {
    if (String(werte[z][0]).trim().toLowerCase() !== 'datum') continue;
    for (let s = 1; s < werte[z].length; s++) {
      if (normDatum(werte[z][s]) === datumText) return { datumZeile: z, spalte: s };
    }
  }
  return null;
}

/**
 * Sucht ab der Datum-Zeile abwaerts die Zeile zur Kennzahl (bis zum naechsten Block).
 * Gibt { zeile, format } zurueck oder null.
 * Wichtig: "Bruttoumsatz" und "Gewinn" stehen je Block ZWEIMAL (einmal oben, einmal
 * unter "Stornostatistik"). Der erste Treffer ist der richtige — deshalb sofort return.
 */
function findeZeile(werte, datumZeile, kennzahl) {
  const muster = ZEILEN_MUSTER.filter(function (m) { return m.key === kennzahl; });
  if (!muster.length) return null;

  for (let z = datumZeile + 1; z < werte.length; z++) {
    const beschriftung = String(werte[z][0]).trim().toLowerCase();
    if (beschriftung === 'datum') break;                 // naechster Monatsblock -> Schluss
    if (!beschriftung) continue;
    for (let i = 0; i < muster.length; i++) {
      if (beschriftung.indexOf(muster[i].praefix) === 0) {
        return { zeile: z, format: muster[i].format };
      }
    }
  }
  return null;
}

/** Macht aus Datumszelle oder Text einheitlich "TT.MM.JJ". */
function normDatum(zelle) {
  if (zelle instanceof Date) {
    const t = ('0' + zelle.getDate()).slice(-2);
    const m = ('0' + (zelle.getMonth() + 1)).slice(-2);
    const j = String(zelle.getFullYear()).slice(-2);
    return t + '.' + m + '.' + j;
  }
  return String(zelle).trim();
}

function antwort(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
