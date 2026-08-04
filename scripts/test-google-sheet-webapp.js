// Testet die Logik von google-sheet-webapp.gs ohne Google — Zeilen-/Spaltenfindung
// und die Formeln der "Insgesamt"-Spalte, gegen einen nachgebauten Juli-Block.
//
// Aufruf:  node scripts/test-google-sheet-webapp.js
// Nach jeder Aenderung am .gs laufen lassen, BEVOR es in Google eingefuegt wird.
//
// ⚠️ Was dieser Test NICHT abdeckt: den Weg von PowerShell zur Webapp. Der Fehler
// vom 03.08.2026 (Stueckzahl-Zeilen blieben leer) sass genau dort — PowerShell
// verschickte Umlaute als "?", weil der Body als String statt als UTF-8-Bytes ging.
// Dagegen hilft nur die Warnung "Fuer diese Kennzahlen wurde KEINE Tabellenzeile
// gefunden", die das Skript jetzt ausgibt.
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/google-sheet-webapp.gs', 'utf8');

// Minimaler Ersatz fuer Google, damit formelTrenner() eine Sprache vorfindet.
let SPRACHE = 'de_DE';
const stubs = 'const ContentService = null;\n' +
  'const SpreadsheetApp = { getActiveSpreadsheet: function () {' +
  '  return { getSpreadsheetLocale: function () { return SPRACHE; } }; } };\n';
eval(stubs + code + '\nglobalThis.__t = { normalisiere, findeZeile, findeSpalte, istDatum, formelTrenner, standText, GESAMT_UEBERSCHRIFTEN };');
const T = globalThis.__t;

let fehler = 0;
function pruefe(name, ist, soll) {
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if (!ok) { fehler++; console.log('  FEHLT  ' + name + ' -> ' + JSON.stringify(ist) + ' statt ' + JSON.stringify(soll)); }
  else console.log('  ok     ' + name);
}

console.log('\n--- normalisiere: zerlegte Umlaute (NFD) gelten als gleich ---');
pruefe('zusammengesetzt = zerlegt',
       T.normalisiere('Gelände-Schlüssel'),
       T.normalisiere('Gelände-Schlüssel'));

console.log('\n--- standText: Stand wird wiedererkannt, auch als echtes Datum ---');
// Google macht aus "03.08.2026" beim Schreiben ein Date. Wird das beim Vergleich
// nicht beruecksichtigt, haengt sich derselbe Stand ein zweites Mal an (03.08.2026).
pruefe('als Text',  T.standText('03.08.2026'), '03.08.2026');
pruefe('als Datum', T.standText(new Date(2026, 7, 3)), '03.08.2026');
pruefe('einstellig aufgefuellt', T.standText(new Date(2026, 0, 9)), '09.01.2026');

// Aufbau wie im echten Juli-Blatt: Spalte A = Beschriftung, dann Tage, dann Insgesamt
const juli = [
  ['Datum', '10.07.26', '11.07.26', '12.07.26', 'Insgesamt'],
  ['Gelände-Schlüssel 27€', 3, 5, 4, ''],
  ['Audiotraining 17€', '', 1, '', ''],
  ['Videoserie 27€', '', 2, 1, ''],
  ['Upsell Gelände s.m. 99€', '', 1, '', ''],
  ['Upsell Kopfkino 97€', '', '', '', ''],
  ['Upsell Handarbeit 197€', '', '', '', ''],
  ['Upsell Offenstallplaner 47€', '', '', '', ''],
  ['Bruttoumsatz', 81, 305, 135, ''],
  ['Verdienst ', 69.14, 245.1, 121.71, ''],
  ['Gesamtumsatz organisch', '', '', '', ''],
  ['', '', '', '', ''],
  ['Adspend', 65.52, 107.28, 86.53, ''],
  ['ROAS', 1.24, 2.84, 1.56, ''],
  ['Warenkorb brutto', 27, 61, 33.75, ''],
  ['Einkaufspreis (CPA)', 21.84, 21.46, 21.63, ''],
  ['Gewinn', 3.62, 137.82, 35.18, ''],
  ['', '', '', '', ''],
  ['Salespage Besucher', 40, 72, 77, ''],
  ['Salespage Conversion', 0.075, 0.0694, 0.0519, ''],
  ['Breakeven( CPA)', 23.05, 49.02, 30.43, ''],
  ['', '', '', '', ''],
  ['Stornostatistik ', '', '', '', ''],
  ['Stornostückzahl', '', '', '', ''],
  ['Bruttoumsatz', '', '', '', ''],          // <- Falle: darf NICHT getroffen werden
  ['Gewinn', '', '', '', ''],                // <- dito
  ['Prozent vom Bruttoumsatz', '', '', '', ''],
  ['Änderungen', '', '', '', '']
];

console.log('\n--- findeZeile: jede gelieferte Kennzahl landet in der richtigen Zeile ---');
const erwartet = {
  'Gelände-Schlüssel': 1, 'Audiotraining': 2, 'Videoreihe': 3,
  'Upsell Gelände': 4, 'Upsell Kopfkino': 5, 'Upsell Handarbeit': 6,
  'Upsell Offenstallplaner': 7, 'Bruttoumsatz': 8, 'Verdienst': 9,
  'Gesamtumsatz organisch': 10, 'Adspend': 12, 'ROAS': 13,
  'Warenkorb brutto': 14, 'Einkaufspreis (CPA)': 15, 'Gewinn': 16,
  'Salespage Besucher': 18, 'Salespage Conversion': 19, 'Breakeven (CPA)': 20
};
Object.keys(erwartet).forEach(function (k) {
  const fund = T.findeZeile(juli, 0, k);
  pruefe(k, fund ? fund.zeile : null, erwartet[k]);
});

console.log('\n--- findeSpalte: Tag wird gefunden, "Insgesamt" nicht als Tag missverstanden ---');
pruefe('11.07.26', T.findeSpalte(juli, '11.07.26'), { datumZeile: 0, spalte: 2 });
pruefe('01.09.26', T.findeSpalte(juli, '01.09.26'), null);
pruefe('istDatum Tag',       T.istDatum('11.07.26'), true);
pruefe('istDatum Insgesamt', T.istDatum('Insgesamt'), false);

// Genau die Suche aus schreibeGesamt — muss egal sein, ob die Summenspalte
// hinten steht (alter Aufbau) oder vorne in Spalte B (Anikas Wunsch 03.08.2026).
function spaltenFinden(kopf) {
  let gesamtSpalte = -1;
  for (let s = 1; s < kopf.length; s++) {
    const t = T.normalisiere(String(kopf[s]).trim().toLowerCase());
    if (T.GESAMT_UEBERSCHRIFTEN.indexOf(t) >= 0) { gesamtSpalte = s; break; }
  }
  let ersterTag = -1, letzterTag = -1;
  for (let s = 1; s < kopf.length; s++) {
    if (s === gesamtSpalte) continue;
    if (T.istDatum(kopf[s])) { if (ersterTag < 0) ersterTag = s; letzterTag = s; }
  }
  return { gesamtSpalte: gesamtSpalte, ersterTag: ersterTag, letzterTag: letzterTag };
}

console.log('\n--- Summenspalte HINTEN (alter Aufbau) ---');
const hinten = spaltenFinden(juli[0]);
pruefe('Summenspalte = E', hinten.gesamtSpalte, 4);
pruefe('Tagesspalten B bis D', [hinten.ersterTag, hinten.letzterTag], [1, 3]);

console.log('\n--- Summenspalte VORNE in Spalte B (Anikas Aufbau) ---');
const vorne = spaltenFinden(['Datum', 'Insgesamt', '10.07.26', '11.07.26', '12.07.26']);
pruefe('Summenspalte = B', vorne.gesamtSpalte, 1);
pruefe('Tagesspalten C bis E', [vorne.ersterTag, vorne.letzterTag], [2, 4]);

console.log('\n--- Formeln (nachgebaut wie in schreibeGesamt) ---');
const gesamtSpalte = hinten.gesamtSpalte, ersterTag = hinten.ersterTag, letzterTag = hinten.letzterTag;
const buchst = ['A', 'B', 'C', 'D', 'E'];
const von = buchst[ersterTag], bis = buchst[letzterTag], G = buchst[gesamtSpalte];
const r = function (k) { return T.findeZeile(juli, 0, k).zeile + 1; };

// ⚠️ Das Trennzeichen ist der Grund, warum am 03.08.2026 ALLE Summenformeln
// als "#ERROR!" in der Tabelle standen: Anikas Tabelle ist deutsch und will ";".
console.log('  (Sprache der Tabelle: ' + SPRACHE + ')');
const TR = T.formelTrenner();
pruefe('Trennzeichen deutsch = Semikolon', TR, ';');

pruefe('Summe Bruttoumsatz',
       '=IFERROR(SUM(' + von + r('Bruttoumsatz') + ':' + bis + r('Bruttoumsatz') + ')' + TR + '"")',
       '=IFERROR(SUM(B9:D9);"")');
pruefe('ROAS aus Summen, nicht addiert',
       '=IFERROR(' + G + r('Bruttoumsatz') + '/' + G + r('Adspend') + TR + '"")',
       '=IFERROR(E9/E13;"")');
pruefe('Gewinn = Verdienst minus Adspend',
       '=IFERROR(' + G + r('Verdienst') + '-' + G + r('Adspend') + TR + '"")',
       '=IFERROR(E10-E13;"")');

SPRACHE = 'en_US';
pruefe('Trennzeichen englisch = Komma', T.formelTrenner(), ',');
SPRACHE = 'de_DE';

console.log(fehler === 0 ? '\nAlles gruen.\n' : '\n' + fehler + ' Test(s) fehlgeschlagen.\n');
process.exit(fehler === 0 ? 0 : 1);
