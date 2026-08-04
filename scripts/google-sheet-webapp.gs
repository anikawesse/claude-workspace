/**
 * Apps Script fuer Anikas Google-Tabelle "Auswertung Gelände-Schlüssel 2026".
 * Nimmt die Zahlen von minikurs-auswertung.ps1 entgegen und traegt sie ein.
 *
 * EINBAU (einmalig):
 *   1. Tabelle oeffnen -> Menue Erweiterungen -> Apps Script
 *   2. Diesen Code komplett hineinkopieren (vorhandenes ersetzen)
 *   3. Speichern -> Bereitstellen -> Neue Bereitstellung -> Typ "Web-App"
 *      Ausfuehren als: Ich   |   Zugriff: Jeder
 *   4. Web-App-URL kopieren -> in scripts\.env bei SHEET_WEBAPP_URL eintragen
 *
 * SICHERHEIT: Die URL ist oeffentlich erreichbar und wird ohne Passwort-Pruefung
 * angenommen (bewusste Entscheidung — URL nicht weitergeben).
 *
 * WIE ES SCHREIBT: Die Tabelle hat MEHRERE BLAETTER (April, Mai, Juli ...), je Monat
 * eins. Deshalb werden ALLE Blaetter durchsucht — nicht nur das erste.
 * In jedem Blatt wird in Spalte A nach "Datum" gesucht; rechts davon stehen die Tage.
 * Fuer jeden gelieferten Tag wird die passende Spalte gesucht und in den Zeilen
 * darunter der jeweilige Wert gesetzt.
 * Zeilen, die nicht geliefert werden (z.B. "Änderungen", Stornostatistik), bleiben
 * unangetastet — Anikas eigene Notizen werden nie ueberschrieben.
 *
 * MONATSSUMME: Steht im Datum-Kopf ganz rechts eine Spalte "Insgesamt" (oder
 * "Summe"/"Gesamt"), wird sie auf Wunsch mit FORMELN gefuellt (=SUMME(...) bzw.
 * Verhaeltnisse wie ROAS). Formeln statt fester Zahlen, damit die Spalte immer
 * stimmt, sobald neue Tage dazukommen — auch ohne erneuten Skriptlauf.
 */

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
  { key: 'Upsell Gelände',      praefix: 'upsell gelände',       format: ZAHL },
  { key: 'Upsell Kopfkino',     praefix: 'upsell kopfkino',      format: ZAHL },
  { key: 'Upsell Handarbeit',   praefix: 'upsell handarbeit',    format: ZAHL },
  { key: 'Upsell Offenstallplaner', praefix: 'upsell offenstallplaner', format: ZAHL },
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

// Welche Zeilen werden in der "Insgesamt"-Spalte einfach aufaddiert?
// Alles andere (ROAS, Warenkorb, CPA, Breakeven, Conversion) ist ein VERHAELTNIS
// und darf NICHT summiert werden — das wird unten aus den Summen neu gerechnet.
const GESAMT_SUMME = [
  'Gelände-Schlüssel', 'Audiotraining', 'Videoreihe',
  'Upsell Gelände', 'Upsell Kopfkino', 'Upsell Handarbeit', 'Upsell Offenstallplaner',
  'Bruttoumsatz', 'Verdienst', 'Gesamtumsatz organisch', 'Adspend', 'Salespage Besucher'
];

// So heisst die Summenspalte in Anikas Blaettern (April: "Summe", Juli: "Insgesamt").
const GESAMT_UEBERSCHRIFTEN = ['insgesamt', 'summe', 'gesamt'];

// ---------------------------------------------------------------- BLATT "MAILS"
// Eigenes Blatt fuer die monatliche Mail-Auswertung des Workflows
// "Gelände-Schlüssel" (15 Workflow-Mails, Tag 1 bis Tag 15).
//
// WARUM EIN EIGENER WEG: Diese Zahlen kommen NICHT aus einer API. Devine/GHL
// gibt Oeffnungs- und Klickraten pro Workflow-Mail weder ueber die API noch
// ueber den Browser heraus (Cross-Origin-iframe). Anika liest sie per Screenshot
// ab, Claude traegt sie ein. Siehe outputs\mail-auswertung\.
//
// WICHTIG: Devine zeigt IMMER "all time", nie einen Zeitraum. Deshalb steht in
// den Spalten E bis H der kumulierte Stand, und die Monatswerte (K bis O) werden
// als FORMEL gegen den vorherigen Stand-Block gerechnet. Formeln statt fester
// Zahlen, damit eine spaetere Korrektur eines alten Wertes automatisch durchschlaegt.
//
// LAYOUT (flach, eine Zeile je Mail und Stand — so laesst es sich filtern/pivotieren):
//   A Stand | B Mail | C Thema | D Zweck | E Empfaenger kum. | F Geoeffnet % kum.
//   G Geklickt % kum. | H Klicks abs. kum. | I Kaeufe | J Umsatz
//   K Neu im Monat | L Oeffnungen Monat | M Klicks Monat | N Oeffnungsrate Monat
//   O Klickrate Monat
const MAIL_BLATT      = 'Mails';
const MAIL_KOPFZEILE  = 2;   // Zeile mit den Spaltenueberschriften
const MAIL_ERSTE_ZEILE= 3;   // erste Datenzeile
const MAIL_PRO_BLOCK  = 15;  // Tag 1 bis Tag 15

const MAIL_KOPF = [
  'Stand', 'Mail', 'Thema', 'Zweck',
  'Empfänger kum.', 'Geöffnet % kum.', 'Geklickt % kum.', 'Klicks abs. kum.',
  'Käufe', 'Umsatz',
  'Neu im Monat', 'Öffnungen Monat', 'Klicks Monat', 'Öffnungsrate Monat', 'Klickrate Monat'
];

function doPost(e) {
  try {
    const daten = JSON.parse(e.postData.contents);

    // Eigener Zweig: Mail-Auswertung. Hat mit den Tagesspalten nichts zu tun.
    if (daten.mails) return antwort(schreibeMails(daten.mails));

    // Alle Blaetter einlesen (ein Blatt pro Monat)
    const blaetter = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function (b) {
      return { blatt: b, werte: b.getDataRange().getValues() };
    });

    const geschrieben = [];
    const nichtGefunden = [];
    // Kennzahlen, zu denen es keine Tabellenzeile gibt. ⚠️ Wurde frueher still
    // uebergangen — so blieb im Juli/August 2026 die Zeile "Gelände-Schlüssel"
    // wochenlang leer, ohne dass irgendwo eine Meldung auftauchte.
    const ohneZeile = [];

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
        if (!fund) {
          if (ohneZeile.indexOf(kennzahl) < 0) ohneZeile.push(kennzahl);
          return;
        }
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

    // Monatssumme ("Insgesamt"-Spalte) — nur fuer die angefragten Blaetter.
    const summen = [];
    // [].concat(...): PowerShell schickt bei nur einem Monat einen blanken String
    // statt einer Liste — so passt beides.
    [].concat(daten.gesamt || []).forEach(function (blattName) {
      const ziel = blaetter.filter(function (b) {
        return normalisiere(b.blatt.getName().trim().toLowerCase()) ===
               normalisiere(String(blattName).trim().toLowerCase());
      })[0];
      if (!ziel) { summen.push(blattName + ': Blatt nicht gefunden'); return; }
      summen.push(blattName + ': ' + schreibeGesamt(ziel.blatt));
    });

    return antwort({
      ok: true,
      geschrieben: geschrieben,
      datum_nicht_gefunden: nichtGefunden,
      kennzahl_ohne_zeile: ohneZeile,
      summen: summen
    });
  } catch (err) {
    return antwort({ ok: false, fehler: String(err) });
  }
}

/**
 * Fuellt in einem Blatt die Spalte "Insgesamt" mit Formeln.
 * Pro Datum-Block: Summenspalte im Kopf suchen, Tagesspalten links davon bestimmen,
 * dann je Kennzahl die passende Formel setzen.
 * Rueckgabe: kurzer Text fuer die Rueckmeldung ans Skript.
 */
function schreibeGesamt(blatt) {
  let bloecke = 0, gesetzt = 0, kaputt = 0;

  // Anika will die Summe VORNE haben (Spalte B, direkt hinter den Beschriftungen),
  // damit der Monat auf einen Blick dasteht. Falls sie noch hinten steht, wird sie
  // einmalig nach vorn geholt; danach ist nichts mehr zu tun.
  let werte = blatt.getDataRange().getValues();
  const verschoben = holeGesamtNachVorn(blatt, werte);
  if (verschoben) werte = blatt.getDataRange().getValues();   // Spalten haben sich verschoben

  for (let z = 0; z < werte.length; z++) {
    if (String(werte[z][0]).trim().toLowerCase() !== 'datum') continue;
    const kopf = werte[z];

    // 1. Summenspalte im Kopf finden (steht normalerweise in B, darf aber ueberall stehen)
    let gesamtSpalte = -1;
    for (let s = 1; s < kopf.length; s++) {
      const t = normalisiere(String(kopf[s]).trim().toLowerCase());
      if (GESAMT_UEBERSCHRIFTEN.indexOf(t) >= 0) { gesamtSpalte = s; break; }
    }
    if (gesamtSpalte < 0) continue;                      // Blatt/Block ohne Summenspalte

    // 2. Tagesspalten = alle uebrigen Spalten mit einem Datum im Kopf.
    //    Bewusst NICHT "links der Summenspalte" — die steht jetzt ja davor.
    let ersterTag = -1, letzterTag = -1;
    for (let s = 1; s < kopf.length; s++) {
      if (s === gesamtSpalte) continue;
      if (istDatum(kopf[s])) { if (ersterTag < 0) ersterTag = s; letzterTag = s; }
    }
    if (ersterTag < 0) continue;

    const von = spaltenBuchstabe(blatt, ersterTag);
    const bis = spaltenBuchstabe(blatt, letzterTag);
    const G   = spaltenBuchstabe(blatt, gesamtSpalte);

    // 3. Zeilennummern der Kennzahlen im Block einsammeln (nur was es wirklich gibt)
    const zeile = {};
    ZEILEN_MUSTER.forEach(function (m) {
      if (zeile[m.key]) return;
      const fund = findeZeile(werte, z, m.key);
      if (fund) zeile[m.key] = fund;
    });

    const TR = formelTrenner();          // "," oder ";" — je nach Sprache der Tabelle
    const gesetzteZeilen = [];

    const setze = function (key, formel) {
      const fund = zeile[key];
      if (!fund) return;
      const zelle = blatt.getRange(fund.zeile + 1, gesamtSpalte + 1);
      zelle.setFormula(formel);
      zelle.setNumberFormat(fund.format);
      gesetzteZeilen.push(fund.zeile);
      gesetzt++;
    };

    // Zeilennummer in A1-Schreibweise (1-basiert) fuer die Verhaeltnis-Formeln
    const zn = function (key) { return zeile[key] ? (zeile[key].zeile + 1) : null; };

    // 4a. Alles, was sich einfach aufaddieren laesst
    GESAMT_SUMME.forEach(function (key) {
      if (!zeile[key]) return;
      const r = zn(key);
      setze(key, '=IFERROR(SUM(' + von + r + ':' + bis + r + ')' + TR + '"")');
    });

    // 4b. Verhaeltnisse — aus den Monatssummen neu gerechnet, nie aufaddiert.
    //     Bezugsgroesse fuer Stueckzahl ist immer das Hauptprodukt.
    const brutto    = zn('Bruttoumsatz');
    const verdienst = zn('Verdienst');
    const adspend   = zn('Adspend');
    const stueck    = zn('Gelände-Schlüssel');
    const besucher  = zn('Salespage Besucher');
    const teile = function (oben, unten) {
      return '=IFERROR(' + G + oben + '/' + G + unten + TR + '"")';
    };

    if (brutto    && adspend)  setze('ROAS',                teile(brutto, adspend));
    if (brutto    && stueck)   setze('Warenkorb brutto',    teile(brutto, stueck));
    if (adspend   && stueck)   setze('Einkaufspreis (CPA)', teile(adspend, stueck));
    if (verdienst && stueck)   setze('Breakeven (CPA)',     teile(verdienst, stueck));
    if (stueck    && besucher) setze('Salespage Conversion',teile(stueck, besucher));

    // Gewinn = Verdienst minus Adspend. Bewusst NICHT die Tageswerte summiert:
    // so stimmt die Zelle auch an Tagen, an denen nur eine der beiden Zahlen steht.
    if (verdienst && adspend) {
      setze('Gewinn', '=IFERROR(' + G + verdienst + '-' + G + adspend + TR + '"")');
    }

    // 5. Nachkontrolle: hat Sheets die Formeln wirklich geschluckt?
    // Eine abgelehnte Formel steht als "#ERROR!" in der Zelle und faellt sonst
    // niemandem auf. Genau das passierte am 03.08.2026 (Komma statt Semikolon).
    const anzeige = blatt.getRange(1, gesamtSpalte + 1, blatt.getMaxRows(), 1).getDisplayValues();
    gesetzteZeilen.forEach(function (z0) {
      if (String(anzeige[z0][0]).charAt(0) === '#') kaputt++;
    });

    bloecke++;
  }

  if (!bloecke) return 'keine "Insgesamt"-Spalte gefunden';
  return gesetzt + ' Formeln in ' + bloecke + ' Block/Bloecken' +
         (kaputt ? ' — ⚠️ ' + kaputt + ' davon FEHLERHAFT (#ERROR)' : '');
}

/**
 * Holt eine hinten stehende Summenspalte nach vorne auf Spalte B.
 * Die alte Spalte wird MIT Inhalt und Formatierung kopiert und danach geloescht,
 * damit Ueberschrift und Aussehen erhalten bleiben.
 * Laeuft nur, wenn wirklich etwas zu tun ist — steht sie schon in B, passiert nichts.
 * Rueckgabe: true, wenn Spalten verschoben wurden (Aufrufer muss neu einlesen).
 *
 * ⚠️ Nebenwirkung: Alle Zellen rutschen eine Spalte nach rechts, auch Zeilen
 * ausserhalb des Datum-Blocks (z.B. die Notizzeile ganz unten). Das ist gewollt,
 * damit die Tagesspalten und Anikas "Änderungen"-Notizen zusammen bleiben.
 */
function holeGesamtNachVorn(blatt, werte) {
  for (let z = 0; z < werte.length; z++) {
    if (String(werte[z][0]).trim().toLowerCase() !== 'datum') continue;
    const kopf = werte[z];

    let alt = -1;
    for (let s = 1; s < kopf.length; s++) {
      const t = normalisiere(String(kopf[s]).trim().toLowerCase());
      if (GESAMT_UEBERSCHRIFTEN.indexOf(t) >= 0) { alt = s; break; }
    }
    if (alt < 0) return false;    // keine Summenspalte in diesem Blatt
    if (alt === 1) return false;  // steht schon vorne

    blatt.insertColumnBefore(2);
    // Die alte Spalte ist durch das Einfuegen um eins nach rechts gerutscht.
    blatt.getRange(1, alt + 2, blatt.getMaxRows(), 1).copyTo(blatt.getRange(1, 2));
    blatt.deleteColumn(alt + 2);
    return true;
  }
  return false;
}

/**
 * Argument-Trennzeichen fuer Formeln.
 * ⚠️ Google Sheets richtet sich nach der SPRACHE DER TABELLE: Anikas Tabelle steht
 * auf Deutsch und erwartet ein Semikolon. Ein Komma ergibt in JEDER Zelle "#ERROR!".
 * Apps Script uebersetzt das NICHT automatisch (am 03.08.2026 nachgewiesen: alle
 * 18 Summenformeln standen auf #ERROR!, bis auf Semikolon umgestellt wurde).
 */
function formelTrenner() {
  const sprache = String(SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale() || '');
  return sprache.toLowerCase().indexOf('en') === 0 ? ',' : ';';
}

/**
 * Traegt einen Stand-Block (15 Mails) im Blatt "Mails" ein.
 * nutzlast = { stand: "03.08.2026", zeilen: [ {mail, thema, zweck, empfaenger,
 *              geoeffnet, geklickt, kaeufe, umsatz}, ... ] }
 * geoeffnet/geklickt als BRUCHWERT (0.787), nicht als 78.7.
 *
 * Ein bereits vorhandener Stand wird UEBERSCHRIEBEN statt angehaengt — so ist ein
 * zweiter Lauf mit korrigierten Zahlen gefahrlos und erzeugt keine Dubletten.
 */
function schreibeMails(nutzlast) {
  const tabelle = SpreadsheetApp.getActiveSpreadsheet();
  let blatt = tabelle.getSheetByName(MAIL_BLATT);
  if (!blatt) blatt = tabelle.insertSheet(MAIL_BLATT);

  const stand  = String(nutzlast.stand || '').trim();
  const zeilen = nutzlast.zeilen || [];
  if (!stand)    return { ok: false, fehler: 'Kein "stand" uebergeben.' };
  if (!zeilen.length) return { ok: false, fehler: 'Keine Zeilen uebergeben.' };

  // Kopf anlegen, falls das Blatt noch leer ist
  if (blatt.getLastRow() < MAIL_KOPFZEILE) {
    blatt.getRange(1, 1).setValue('Mail-Auswertung Funnel „Gelände-Schlüssel" — Zahlen sind kumuliert (Devine zeigt nur all time)')
         .setFontWeight('bold');
    blatt.getRange(MAIL_KOPFZEILE, 1, 1, MAIL_KOPF.length).setValues([MAIL_KOPF]).setFontWeight('bold');
    blatt.setFrozenRows(MAIL_KOPFZEILE);
    blatt.setFrozenColumns(2);
  }

  // Gibt es diesen Stand schon? Dann an derselben Stelle ueberschreiben.
  // ⚠️ Vergleich ueber standText(): Google macht aus "03.08.2026" beim Schreiben ein
  // echtes DATUM. Ein simpler String-Vergleich erkennt den Stand dann nicht wieder und
  // haengt ihn ein zweites Mal an — genau das ist am 03.08.2026 passiert.
  const vorhanden = blatt.getLastRow() >= MAIL_ERSTE_ZEILE
    ? blatt.getRange(MAIL_ERSTE_ZEILE, 1, blatt.getLastRow() - MAIL_ERSTE_ZEILE + 1, 1).getValues()
    : [];

  // Zusammenhaengende Bloecke mit diesem Stand sammeln
  const laeufe = [];
  for (let i = 0; i < vorhanden.length; i++) {
    if (standText(vorhanden[i][0]) !== stand) continue;
    const zeile = MAIL_ERSTE_ZEILE + i;
    const letzter = laeufe.length ? laeufe[laeufe.length - 1] : null;
    if (letzter && zeile === letzter.start + letzter.anzahl) letzter.anzahl++;
    else laeufe.push({ start: zeile, anzahl: 1 });
  }

  // Doppelt vorhandene Bloecke entfernen (von hinten, sonst verschieben sich die Zeilen).
  // Raeumt auch auf, was eine frueher fehlerhafte Version angelegt hat.
  let entfernt = 0;
  for (let i = laeufe.length - 1; i >= 1; i--) {
    blatt.deleteRows(laeufe[i].start, laeufe[i].anzahl);
    entfernt += laeufe[i].anzahl;
  }

  const istNeu = laeufe.length === 0;
  let startZeile = istNeu ? Math.max(blatt.getLastRow() + 1, MAIL_ERSTE_ZEILE) : laeufe[0].start;

  // Spalte A ausdruecklich als TEXT formatieren, BEVOR geschrieben wird — sonst macht
  // Google wieder ein Datum daraus und der naechste Lauf erkennt den Stand nicht.
  blatt.getRange(startZeile, 1, zeilen.length, 1).setNumberFormat('@');

  // A bis J: die abgelesenen Werte
  const block = zeilen.map(function (z) {
    return [
      stand,
      z.mail || '',
      z.thema || '',
      z.zweck || '',
      zahlOderLeer(z.empfaenger),
      zahlOderLeer(z.geoeffnet),
      zahlOderLeer(z.geklickt),
      '',                       // H: Formel, kommt gleich
      zahlOderLeer(z.kaeufe),
      zahlOderLeer(z.umsatz)
    ];
  });
  blatt.getRange(startZeile, 1, block.length, 10).setValues(block);

  // Formate
  blatt.getRange(startZeile, 5, block.length, 1).setNumberFormat(ZAHL);      // Empfaenger
  blatt.getRange(startZeile, 6, block.length, 2).setNumberFormat(PROZENT);   // Geoeffnet/Geklickt
  blatt.getRange(startZeile, 8, block.length, 1).setNumberFormat('0.0');     // Klicks abs.
  blatt.getRange(startZeile, 9, block.length, 1).setNumberFormat(ZAHL);      // Kaeufe
  blatt.getRange(startZeile,10, block.length, 1).setNumberFormat(EURO);      // Umsatz

  // ⚠️ Trennzeichen: Anikas Tabelle ist deutsch und will ";" — ein Komma ergibt
  // in JEDER Formelzelle "#ERROR!". Am 03.08.2026 stand die ganze Spalte H so da.
  const TR = formelTrenner();

  // H: Klicks absolut = Empfaenger x Klickrate
  const hFormeln = [];
  for (let i = 0; i < block.length; i++) {
    const r = startZeile + i;
    hFormeln.push(['=IFERROR(E' + r + '*G' + r + TR + '"")']);
  }
  blatt.getRange(startZeile, 8, block.length, 1).setFormulas(hFormeln);

  // K bis O: Monatswerte als Differenz zum vorherigen Stand-Block.
  // Nur wenn es einen gibt — beim allerersten Stand bleiben die Spalten leer.
  const vorherStart = startZeile - MAIL_PRO_BLOCK;
  let monatswerte = 'keine (erster Stand, kein Vergleichswert)';
  if (vorherStart >= MAIL_ERSTE_ZEILE) {
    const formeln = [];
    for (let i = 0; i < block.length; i++) {
      const r = startZeile + i;
      const v = vorherStart + i;
      formeln.push([
        '=IFERROR(E' + r + '-E' + v + TR + '"")',                                       // K Neu im Monat
        '=IFERROR(E' + r + '*F' + r + '-E' + v + '*F' + v + TR + '"")',                 // L Oeffnungen
        '=IFERROR(E' + r + '*G' + r + '-E' + v + '*G' + v + TR + '"")',                 // M Klicks
        '=IF(K' + r + '>0' + TR + 'IFERROR(L' + r + '/K' + r + TR + '"")' + TR + '"")', // N Oeffnungsrate
        '=IF(K' + r + '>0' + TR + 'IFERROR(M' + r + '/K' + r + TR + '"")' + TR + '"")'  // O Klickrate
      ]);
    }
    blatt.getRange(startZeile, 11, block.length, 5).setFormulas(formeln);
    blatt.getRange(startZeile, 11, block.length, 1).setNumberFormat(ZAHL);
    blatt.getRange(startZeile, 12, block.length, 2).setNumberFormat('0.0');
    blatt.getRange(startZeile, 14, block.length, 2).setNumberFormat(PROZENT);
    monatswerte = 'gegen Stand in Zeile ' + vorherStart + ' gerechnet';
  } else {
    blatt.getRange(startZeile, 11, block.length, 5).clearContent();
  }

  // Trennlinie ueber jedem Block, damit die Staende optisch auseinanderfallen
  blatt.getRange(startZeile, 1, 1, MAIL_KOPF.length)
       .setBorder(true, null, null, null, null, null, '#999999', SpreadsheetApp.BorderStyle.SOLID);

  blatt.autoResizeColumns(1, 4);

  // Nachkontrolle: hat Sheets die Formeln akzeptiert? Sonst steht "#ERROR!" in
  // der Zelle und faellt niemandem auf.
  let kaputt = 0;
  blatt.getRange(startZeile, 8, block.length, 1).getDisplayValues().forEach(function (r) {
    if (String(r[0]).charAt(0) === '#') kaputt++;
  });

  return {
    ok: true,
    blatt: MAIL_BLATT,
    stand: stand,
    zeilen: block.length,
    formelfehler: kaputt,
    dubletten_entfernt: entfernt,
    ab_zeile: startZeile,
    modus: istNeu ? 'neu angelegt' : 'vorhandenen Stand ueberschrieben',
    monatswerte: monatswerte
  };
}

/**
 * Macht aus einer Stand-Zelle einheitlich "TT.MM.JJJJ" — egal ob Text drinsteht
 * oder Google daraus ein echtes Datum gemacht hat.
 */
function standText(zelle) {
  if (zelle instanceof Date) {
    const t = ('0' + zelle.getDate()).slice(-2);
    const m = ('0' + (zelle.getMonth() + 1)).slice(-2);
    return t + '.' + m + '.' + zelle.getFullYear();
  }
  return String(zelle).trim();
}

/** Leere Felder sollen leer bleiben, nicht als 0 in der Tabelle landen. */
function zahlOderLeer(w) {
  if (w === null || w === undefined || w === '') return '';
  const n = Number(w);
  return isNaN(n) ? '' : n;
}

/** Ist die Kopfzelle ein Tagesdatum (echtes Datum oder "TT.MM.JJ")? */
function istDatum(zelle) {
  if (zelle instanceof Date) return true;
  return /^\d{2}\.\d{2}\.\d{2}$/.test(String(zelle).trim());
}

/** Spaltenbuchstabe zu einem 0-basierten Spaltenindex ("A", "B", ... "AA"). */
function spaltenBuchstabe(blatt, index) {
  return blatt.getRange(1, index + 1).getA1Notation().replace(/\d+/g, '');
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

// Entfernt Umlaute/Akzente fuer den Vergleich (ä/ü -> a/u usw.). Noetig, weil
// Copy&Paste (z.B. Zwischenablage -> Apps-Script-Editor) Sonderzeichen manchmal
// in eine andere Unicode-Form umwandelt (zerlegt statt zusammengesetzt) — dann
// liefert ein simpler String-Vergleich still ein "kein Treffer", obwohl beide
// Texte gleich aussehen. Durch das Entfernen der Akzente ist der Vergleich
// unabhaengig von der jeweiligen Unicode-Form.
function normalisiere(s) {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Sucht ab der Datum-Zeile abwaerts die Zeile zur Kennzahl (bis zum naechsten Block).
 * Gibt { zeile, format } zurueck oder null.
 * Wichtig: "Bruttoumsatz" und "Gewinn" stehen je Block ZWEIMAL (einmal oben, einmal
 * unter "Stornostatistik"). Der erste Treffer ist der richtige — deshalb sofort return.
 */
function findeZeile(werte, datumZeile, kennzahl) {
  const muster = ZEILEN_MUSTER.filter(function (m) { return normalisiere(m.key) === normalisiere(kennzahl); });
  if (!muster.length) return null;

  for (let z = datumZeile + 1; z < werte.length; z++) {
    const beschriftung = normalisiere(String(werte[z][0]).trim().toLowerCase());
    if (beschriftung === 'datum') break;                 // naechster Monatsblock -> Schluss
    if (!beschriftung) continue;
    for (let i = 0; i < muster.length; i++) {
      if (beschriftung.indexOf(normalisiere(muster[i].praefix)) === 0) {
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
