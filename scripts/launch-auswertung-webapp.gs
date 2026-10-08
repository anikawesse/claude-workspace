/**
 * Apps Script fuer Anikas Google-Tabelle "Launch-Auswertung Gelände-Webinar".
 * Nimmt die Zahlen von launch-auswertung-push.ps1 entgegen und traegt sie ein.
 *
 * LAYOUT DIESER TABELLE (anders als die Tages-Auswertung!):
 *   Spalte A = Kennzahl-Beschriftung, Spalte B = erster Launch (Aug 2026),
 *   Spalte C, D ... = weitere Launches. EIN LAUNCH = EINE SPALTE.
 *   Zeile mit A = "Kennzahl" ist die Kopfzeile; darunter stehen die Werte.
 *   Weisse Zeilen = Handeingabe. Beige Zeilen = Formeln (rechnen automatisch).
 *
 * EINBAU (einmalig):
 *   1. Tabelle oeffnen -> Menue Erweiterungen -> Apps Script
 *   2. Diesen Code komplett hineinkopieren (vorhandenes ersetzen)
 *   3. Speichern -> Bereitstellen -> Neue Bereitstellung -> Typ "Web-App"
 *      Ausfuehren als: Ich   |   Zugriff: Jeder
 *   4. Web-App-URL kopieren -> in scripts\.env bei LAUNCH_SHEET_WEBAPP_URL eintragen
 *
 * SICHERHEIT: Die URL ist oeffentlich erreichbar und wird ohne Passwort-Pruefung
 * angenommen (bewusste Entscheidung — URL nicht weitergeben).
 *
 * WIE ES SCHREIBT:
 *   - Es wird das Blatt gesucht, in dessen Spalte A "Kennzahl" steht.
 *   - Fuer den gelieferten Launch (z.B. "Sep 2026") wird die passende Spalte in der
 *     Kopfzeile gesucht. Gibt es sie noch nicht, wird die naechste leere Spalte
 *     genommen (oder eine neue angelegt) und dabei einmalig die FORMELN aus der
 *     ersten Launch-Spalte (B) hineinkopiert — so rechnen die beigen Zeilen in der
 *     neuen Spalte genauso automatisch. Das meldet die Webapp ausdruecklich zurueck.
 *   - Danach werden die gelieferten Handeingabe-Werte in ihre Zeilen geschrieben
 *     (Zeile per exakter Beschriftung in Spalte A gefunden).
 *   - FORMEL-Zeilen werden NIE mit einem Wert ueberschrieben. Zusammengefuehrte
 *     Zeilen (Abschnitts-Ueberschriften, Notizen) werden nie angefasst.
 *   - Leere Werte werden bewusst nicht geschrieben (ueberschreiben nichts).
 */

function doPost(e) {
  try {
    const daten = JSON.parse(e.postData.contents);
    const launch = String(daten.launch || '').trim();
    const werte  = daten.werte || {};
    if (!launch) return antwort({ ok: false, fehler: 'Kein "launch" uebergeben (z.B. "Sep 2026").' });

    const blatt = findeLaunchBlatt();
    if (!blatt) return antwort({ ok: false, fehler: 'Kein Blatt mit "Kennzahl" in Spalte A gefunden.' });

    const lastRow = blatt.getLastRow();
    const lastCol = Math.max(blatt.getLastColumn(), 2);

    // Kopfzeile (die Zeile, in der A = "Kennzahl" steht)
    const spalteA = blatt.getRange(1, 1, lastRow, 1).getValues();
    let kopfZeile = -1;
    for (let z = 0; z < spalteA.length; z++) {
      if (String(spalteA[z][0]).trim().toLowerCase() === 'kennzahl') { kopfZeile = z; break; }
    }
    if (kopfZeile < 0) return antwort({ ok: false, fehler: '"Kennzahl"-Kopfzeile nicht gefunden.' });

    // Welche Zeilen sind zusammengefuehrt (Abschnitts-Ueberschriften/Notizen)?
    // Diese Zeilen duerfen NICHT beschrieben werden.
    const gesperrt = merkeGesperrteZeilen(blatt, lastRow, lastCol);

    // Zielspalte fuer den Launch finden
    const kopf = blatt.getRange(kopfZeile + 1, 1, 1, Math.max(lastCol, 8)).getValues()[0];
    let zielSpalte = -1;
    for (let s = 1; s < kopf.length; s++) {
      if (normalisiere(String(kopf[s]).trim().toLowerCase()) === normalisiere(launch.toLowerCase())) {
        zielSpalte = s; break;
      }
    }

    let neuAngelegt = false;
    if (zielSpalte < 0) {
      // Erste leere Kopfspalte ab B nehmen; sonst hinten eine neue Spalte anlegen.
      for (let s = 1; s < Math.max(lastCol, 8); s++) {
        if (String(kopf[s]).trim() === '') { zielSpalte = s; break; }
      }
      if (zielSpalte < 0) { blatt.insertColumnAfter(lastCol); zielSpalte = lastCol; }
      neuAngelegt = true;
      baueLaunchSpalte(blatt, kopfZeile, zielSpalte, launch, lastRow, gesperrt);
    }

    // Handeingabe-Werte schreiben
    const bFormate     = blatt.getRange(1, 2, lastRow, 1).getNumberFormats();
    const bHintergrund = blatt.getRange(1, 2, lastRow, 1).getBackgrounds();
    const bFormelnR1C1 = blatt.getRange(1, 2, lastRow, 1).getFormulasR1C1();

    const geschrieben = [];
    const nichtGefunden = [];
    const formelKollision = [];

    Object.keys(werte).forEach(function (label) {
      const wert = werte[label];
      if (wert === '' || wert === null || wert === undefined) return;   // Leeres nie schreiben

      let zeile = -1;
      for (let z = kopfZeile + 1; z < spalteA.length; z++) {
        if (gesperrt[z]) continue;
        if (normalisiere(String(spalteA[z][0]).trim().toLowerCase()) === normalisiere(String(label).trim().toLowerCase())) {
          zeile = z; break;
        }
      }
      if (zeile < 0) { nichtGefunden.push(label); return; }

      // Eine Formel-Zeile (beige) niemals mit einem Wert ueberschreiben.
      if (bFormelnR1C1[zeile][0] !== '') { formelKollision.push(label); return; }

      const zelle = blatt.getRange(zeile + 1, zielSpalte + 1);
      if (typeof wert === 'string') {
        // ⚠️ Text-Werte (z.B. "23.08.2026", "19:00 Uhr") ZUERST auf Textformat
        // stellen, sonst macht Google aus "23.08.2026" eine Datums-Seriennummer
        // (46257) und zeigt sie als blanke Zahl an.
        zelle.setNumberFormat('@');
        zelle.setValue(wert);
      } else {
        zelle.setValue(wert);
        if (bFormate[zeile][0]) zelle.setNumberFormat(bFormate[zeile][0]);   // Format wie erste Launch-Spalte (€/%/Zahl)
      }
      if (bHintergrund[zeile][0]) zelle.setBackground(bHintergrund[zeile][0]); // meist weiss
      geschrieben.push(label);
    });

    // Optional: Sales-Mail-Tabelle desselben Launches mitschreiben (Blatt "Sales-Mails").
    let mailInfo = null;
    if (daten.mails && daten.mails.length) {
      mailInfo = schreibeMailBlatt(launch, daten.mails, daten.softOptOut);
    }

    // Optional: Downsell-Mail-Tabelle mitschreiben (Blatt "Downsell-Mails").
    let downsellInfo = null;
    if (daten.downsell && daten.downsell.length) {
      downsellInfo = schreibeDownsellBlatt(launch, daten.downsell);
    }

    return antwort({
      ok: true,
      launch: launch,
      spalte: spaltenBuchstabe(blatt, zielSpalte),
      spalte_neu_angelegt: neuAngelegt,
      geschrieben: geschrieben,
      nicht_gefunden: nichtGefunden,
      formel_zeile_uebersprungen: formelKollision,
      mails: mailInfo,
      downsell: downsellInfo
    });
  } catch (err) {
    return antwort({ ok: false, fehler: String(err) });
  }
}

/**
 * Baut eine frische Launch-Spalte: kopiert Kopf-Beschriftung + alle FORMELN aus
 * der ersten Launch-Spalte (B) hinein, damit die beigen Zeilen automatisch rechnen.
 * Handeingabe-Zeilen bleiben leer (werden gleich mit den gelieferten Werten gefuellt).
 * Zusammengefuehrte Zeilen (Ueberschriften/Notizen) werden ausgelassen.
 *
 * Formeln werden in R1C1-Schreibweise kopiert: dann stimmen die relativen Bezuege
 * in der neuen Spalte automatisch (aus =B9+B10-B11 wird in Spalte C =C9+C10-C11),
 * ohne dass Spaltenbuchstaben von Hand umgeschrieben werden muessen.
 */
function baueLaunchSpalte(blatt, kopfZeile, zielSpalte, launch, lastRow, gesperrt) {
  // Kopf setzen (fett, wie B)
  const kopfZelle = blatt.getRange(kopfZeile + 1, zielSpalte + 1);
  kopfZelle.setValue(launch);
  const bKopf = blatt.getRange(kopfZeile + 1, 2);
  kopfZelle.setFontWeight(bKopf.getFontWeight());
  kopfZelle.setBackground(bKopf.getBackground());
  kopfZelle.setHorizontalAlignment(bKopf.getHorizontalAlignment());

  const bFormelnR1C1 = blatt.getRange(1, 2, lastRow, 1).getFormulasR1C1();
  const bFormate     = blatt.getRange(1, 2, lastRow, 1).getNumberFormats();
  const bHintergrund = blatt.getRange(1, 2, lastRow, 1).getBackgrounds();

  for (let z = kopfZeile + 1; z < lastRow; z++) {
    if (gesperrt[z]) continue;                 // Ueberschriften/Notizen nie anfassen
    const formel = bFormelnR1C1[z][0];
    const zelle = blatt.getRange(z + 1, zielSpalte + 1);
    if (formel !== '') {
      zelle.setFormulaR1C1(formel);            // beige Formel uebernehmen
      if (bFormate[z][0])     zelle.setNumberFormat(bFormate[z][0]);
      if (bHintergrund[z][0]) zelle.setBackground(bHintergrund[z][0]);   // beige Fuellung
    } else {
      zelle.clearContent();                    // Handeingabe-Zeile bleibt leer
    }
  }
}

/**
 * Markiert alle Zeilen, die zu einer zusammengefuehrten (spaltenuebergreifenden)
 * Zelle gehoeren — Abschnitts-Ueberschriften (ECKDATEN ...) und die Notiz-/
 * Legendenzeilen ganz unten. Diese Zeilen werden weder beschrieben noch geleert.
 */
function merkeGesperrteZeilen(blatt, lastRow, lastCol) {
  const gesperrt = {};
  const bereich = blatt.getRange(1, 1, lastRow, Math.max(lastCol, 8));
  bereich.getMergedRanges().forEach(function (mr) {
    if (mr.getNumColumns() > 1) {              // spaltenuebergreifend = Banner/Notiz
      const start = mr.getRow() - 1;           // 0-basiert
      for (let i = 0; i < mr.getNumRows(); i++) gesperrt[start + i] = true;
    }
  });
  return gesperrt;
}

/** Sucht das Blatt, in dessen Spalte A irgendwo "Kennzahl" steht. */
function findeLaunchBlatt() {
  const blaetter = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (let i = 0; i < blaetter.length; i++) {
    const b = blaetter[i];
    const n = b.getLastRow();
    if (n < 1) continue;
    const a = b.getRange(1, 1, n, 1).getValues();
    for (let z = 0; z < a.length; z++) {
      if (String(a[z][0]).trim().toLowerCase() === 'kennzahl') return b;
    }
  }
  return null;
}

/** Spaltenbuchstabe zu einem 0-basierten Spaltenindex ("A", "B", ... "AA"). */
function spaltenBuchstabe(blatt, index) {
  return blatt.getRange(1, index + 1).getA1Notation().replace(/\d+/g, '');
}

/**
 * Entfernt Umlaute/Akzente fuer den Vergleich (ä/ü -> a/u). Noetig, weil Copy&Paste
 * Sonderzeichen manchmal in eine andere Unicode-Form umwandelt (zerlegt statt
 * zusammengesetzt) — ein simpler String-Vergleich liefert dann still "kein Treffer",
 * obwohl beide Texte gleich aussehen.
 */
function normalisiere(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function antwort(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// doGet: liest eine Launch-Spalte LIVE zurueck (zur Kontrolle nach dem Schreiben).
// Aufruf:  <web-app-url>?launch=Sep%202026   (ohne launch = letzte befuellte Spalte)
// Antwort: { ok, launch, spalte, werte:{ "Beschriftung": Wert, ... } }
// ============================================================================
function doGet(e) {
  try {
    const launch = String((e && e.parameter && e.parameter.launch) || '').trim();
    const blatt = findeLaunchBlatt();
    if (!blatt) return antwort({ ok: false, fehler: 'Kein Blatt mit "Kennzahl" in Spalte A.' });

    const lastRow = blatt.getLastRow();
    const spalteA = blatt.getRange(1, 1, lastRow, 1).getValues();
    let kopfZeile = -1;
    for (let z = 0; z < spalteA.length; z++) {
      if (String(spalteA[z][0]).trim().toLowerCase() === 'kennzahl') { kopfZeile = z; break; }
    }
    if (kopfZeile < 0) return antwort({ ok: false, fehler: '"Kennzahl"-Kopfzeile nicht gefunden.' });

    const lastCol = Math.max(blatt.getLastColumn(), 2);
    const kopf = blatt.getRange(kopfZeile + 1, 1, 1, lastCol).getValues()[0];
    let ziel = -1;
    if (launch) {
      for (let s = 1; s < kopf.length; s++) {
        if (normalisiere(String(kopf[s]).trim().toLowerCase()) === normalisiere(launch.toLowerCase())) { ziel = s; break; }
      }
    } else {
      for (let s = 1; s < kopf.length; s++) { if (String(kopf[s]).trim() !== '') ziel = s; }  // letzte befuellte
    }
    if (ziel < 0) return antwort({ ok: false, fehler: 'Launch-Spalte nicht gefunden: ' + launch });

    const colVals = blatt.getRange(1, ziel + 1, lastRow, 1).getValues();
    const werte = {};
    for (let z = kopfZeile + 1; z < spalteA.length; z++) {
      const label = String(spalteA[z][0]).trim();
      const v = colVals[z][0];
      if (label && v !== '' && v !== null) werte[label] = v;
    }
    return antwort({ ok: true, launch: String(kopf[ziel]).trim(), spalte: spaltenBuchstabe(blatt, ziel), werte: werte });
  } catch (err) {
    return antwort({ ok: false, fehler: String(err) });
  }
}

/** Sucht das Blatt "Sales-Mails" (oder irgendeines mit "Sales-Mail-Auswertung" in Spalte A); legt es sonst an. */
function findeMailBlatt() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const direkt = ss.getSheetByName('Sales-Mails');
  if (direkt) return direkt;
  const blaetter = ss.getSheets();
  for (let i = 0; i < blaetter.length; i++) {
    const n = blaetter[i].getLastRow();
    if (n < 1) continue;
    const a = blaetter[i].getRange(1, 1, n, 1).getValues();
    for (let z = 0; z < a.length; z++) {
      if (String(a[z][0]).indexOf('Sales-Mail-Auswertung') > -1) return blaetter[i];
    }
  }
  return ss.insertSheet('Sales-Mails');
}

/**
 * Schreibt/aktualisiert fuer den Launch einen eigenen Mail-Block auf dem Blatt
 * "Sales-Mails" (jeder Launch untereinander). Oeffnungs-/Klickrate werden als
 * Formel gesetzt (rechnen automatisch). Laeuft der Push erneut, wird derselbe
 * Block ueberschrieben statt verdoppelt.
 *
 * rows = [{ mail, betreff, versand, empfaenger, oeffner, klicks, abmeldungen, kaeufe }, ...]
 */
function schreibeMailBlatt(launch, rows, softOptOut) {
  const blatt = findeMailBlatt();
  const titel = 'Sales-Mail-Auswertung Gelände-Webinar (' + launch + ')';
  const note = 'Zahlen aus Devine (je Kontakt ein Status: Zugestellt/Geöffnet/Geklickt/Beantwortet/Abmeldung). Öffner = eindeutige Öffner inkl. Klicker und Antworter. Öffnungs- und Klickrate rechnen sich automatisch. Reihenfolge über Zustell-Zeitstempel.';
  const header = ['Mail', 'Betreff', 'Versand', 'Empfänger', 'Öffnungen', 'Öffnungsrate', 'Klicks', 'Klickrate', 'Abmeldungen', 'Käufe danach'];

  const lastRow = Math.max(blatt.getLastRow(), 0);
  let titelRow = -1;
  if (lastRow > 0) {
    const colA = blatt.getRange(1, 1, lastRow, 1).getValues();
    for (let z = 0; z < colA.length; z++) {
      if (normalisiere(String(colA[z][0]).trim()) === normalisiere(titel)) { titelRow = z + 1; break; }
    }
  }
  let neu = false;
  if (titelRow < 0) { titelRow = lastRow > 0 ? lastRow + 2 : 1; neu = true; }
  const headerRow = titelRow + 2;
  const dataStart = headerRow + 1;

  if (neu) {
    blatt.getRange(titelRow, 1, 1, header.length).merge();
    blatt.getRange(titelRow, 1).setValue(titel).setFontWeight('bold');
    blatt.getRange(titelRow + 1, 1, 1, header.length).merge();
    blatt.getRange(titelRow + 1, 1).setValue(note).setWrap(true);
    blatt.getRange(headerRow, 1, 1, header.length).setValues([header]).setFontWeight('bold');
  }

  // Datenbereich leeren (Daten + Summe + Soft-Opt-out + Puffer); Titel/Note/Header bleiben stehen.
  blatt.getRange(dataStart, 1, rows.length + 4, header.length).clearContent();

  for (let i = 0; i < rows.length; i++) {
    const r = dataStart + i;
    const m = rows[i] || {};
    const _e = (m.empfaenger == null || m.empfaenger === '') ? null : Number(m.empfaenger);
    const _o = (m.oeffner == null || m.oeffner === '') ? null : Number(m.oeffner);
    const _k = (m.klicks == null || m.klicks === '') ? null : Number(m.klicks);
    blatt.getRange(r, 1).setValue(m.mail || '');
    blatt.getRange(r, 2).setValue(m.betreff || '');
    blatt.getRange(r, 3).setValue(m.versand || '');
    blatt.getRange(r, 4).setValue(_e == null ? '' : _e);
    blatt.getRange(r, 5).setValue(_o == null ? '' : _o);
    // Öffnungs-/Klickrate als FERTIGE WERTE (nicht als Formel): ein deutsch-
    // lokalisiertes Google-Sheet braucht in Formeln Semikolons; eine per Apps
    // Script gesetzte Komma-Formel ergibt sonst #ERROR!. Werte sind locale-sicher.
    blatt.getRange(r, 6).setValue((_e && _o != null) ? _o / _e : '').setNumberFormat('0.0%');
    blatt.getRange(r, 7).setValue(_k == null ? '' : _k);
    blatt.getRange(r, 8).setValue((_e && _k != null) ? _k / _e : '').setNumberFormat('0.0%');
    blatt.getRange(r, 9).setValue(m.abmeldungen == null ? '' : m.abmeldungen);
    blatt.getRange(r, 10).setValue((m.kaeufe == null || m.kaeufe === '') ? '' : m.kaeufe);
  }

  const sumRow = dataStart + rows.length + 1;
  blatt.getRange(sumRow, 1).setValue('Abmeldungen gesamt (Sequenz)').setFontWeight('bold');
  blatt.getRange(sumRow, 9).setValue(rows.reduce(function (s, m) { return s + (Number(m.abmeldungen) || 0); }, 0));

  // Soft-Opt-out (Trigger-Link) — nur schreiben, wenn geliefert.
  if (softOptOut != null && softOptOut !== '') {
    const soRow = sumRow + 1;
    blatt.getRange(soRow, 1).setValue('Soft-Opt-out genutzt (Trigger-Link, nur aus Sales-Strecke raus)').setFontWeight('bold');
    blatt.getRange(soRow, 9).setValue(softOptOut);
  }

  return { blatt: blatt.getName(), titel: titel, zeilen: rows.length, neu: neu, ab_zeile: titelRow };
}

/** Sucht das Blatt "Downsell-Mails" (oder eins mit "Downsell" im Namen); legt es sonst an. */
function findeDownsellBlatt() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const direkt = ss.getSheetByName('Downsell-Mails');
  if (direkt) return direkt;
  const blaetter = ss.getSheets();
  for (let i = 0; i < blaetter.length; i++) {
    if (blaetter[i].getName().toLowerCase().indexOf('downsell') > -1) return blaetter[i];
  }
  return ss.insertSheet('Downsell-Mails');
}

/**
 * Schreibt/aktualisiert fuer den Launch einen Downsell-Block auf dem Blatt
 * "Downsell-Mails" (jeder Launch untereinander). Gleiche Struktur wie der
 * Sales-Mail-Block; Oeffnungs-/Klickrate als fertige Werte (locale-sicher).
 * rows = [{ mail, betreff, versand, empfaenger, oeffner, klicks, abmeldungen, kaeufe }, ...]
 */
function schreibeDownsellBlatt(launch, rows) {
  const blatt = findeDownsellBlatt();
  const titel = 'Downsell-Auswertung Gelände-Paket (' + launch + ')';
  const note = 'Downsell-Strecke an die Programm-Nicht-Käufer (Bundle Gelände-Schlüssel + sicher meistern, 199 €). Zahlen aus Devine. Öffner = eindeutige Öffner inkl. Klicker und Antworter. Öffnungs-/Klickrate als Wert. Käufe = Gelände-Paket-Bestellungen (ThriveCart).';
  const header = ['Mail', 'Betreff', 'Versand', 'Empfänger', 'Öffnungen', 'Öffnungsrate', 'Klicks', 'Klickrate', 'Abmeldungen', 'Käufe danach'];

  const lastRow = Math.max(blatt.getLastRow(), 0);
  let titelRow = -1;
  if (lastRow > 0) {
    const colA = blatt.getRange(1, 1, lastRow, 1).getValues();
    for (let z = 0; z < colA.length; z++) {
      if (normalisiere(String(colA[z][0]).trim()) === normalisiere(titel)) { titelRow = z + 1; break; }
    }
  }
  let neu = false;
  if (titelRow < 0) { titelRow = lastRow > 0 ? lastRow + 2 : 1; neu = true; }
  const headerRow = titelRow + 2;
  const dataStart = headerRow + 1;

  if (neu) {
    blatt.getRange(titelRow, 1, 1, header.length).merge();
    blatt.getRange(titelRow, 1).setValue(titel).setFontWeight('bold');
    blatt.getRange(titelRow + 1, 1, 1, header.length).merge();
    blatt.getRange(titelRow + 1, 1).setValue(note).setWrap(true);
    blatt.getRange(headerRow, 1, 1, header.length).setValues([header]).setFontWeight('bold');
  }

  blatt.getRange(dataStart, 1, rows.length + 3, header.length).clearContent();

  for (let i = 0; i < rows.length; i++) {
    const r = dataStart + i;
    const m = rows[i] || {};
    const _e = (m.empfaenger == null || m.empfaenger === '') ? null : Number(m.empfaenger);
    const _o = (m.oeffner == null || m.oeffner === '') ? null : Number(m.oeffner);
    const _k = (m.klicks == null || m.klicks === '') ? null : Number(m.klicks);
    blatt.getRange(r, 1).setValue(m.mail || '');
    blatt.getRange(r, 2).setValue(m.betreff || '');
    blatt.getRange(r, 3).setValue(m.versand || '');
    blatt.getRange(r, 4).setValue(_e == null ? '' : _e);
    blatt.getRange(r, 5).setValue(_o == null ? '' : _o);
    blatt.getRange(r, 6).setValue((_e && _o != null) ? _o / _e : '').setNumberFormat('0.0%');
    blatt.getRange(r, 7).setValue(_k == null ? '' : _k);
    blatt.getRange(r, 8).setValue((_e && _k != null) ? _k / _e : '').setNumberFormat('0.0%');
    blatt.getRange(r, 9).setValue(m.abmeldungen == null ? '' : m.abmeldungen);
    blatt.getRange(r, 10).setValue((m.kaeufe == null || m.kaeufe === '') ? '' : m.kaeufe);
  }

  const sumRow = dataStart + rows.length + 1;
  blatt.getRange(sumRow, 1).setValue('Abmeldungen gesamt (Downsell)').setFontWeight('bold');
  blatt.getRange(sumRow, 9).setValue(rows.reduce(function (s, m) { return s + (Number(m.abmeldungen) || 0); }, 0));

  return { blatt: blatt.getName(), titel: titel, zeilen: rows.length, neu: neu, ab_zeile: titelRow };
}
