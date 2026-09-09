/**
 * Checkout-Aufrufe des Gelaende-Schluessels aus dem ThriveCart-Dashboard holen.
 *
 * WARUM DIESER UMWEG: Die offizielle ThriveCart-Schnittstelle (/api/external)
 * kennt KEINE Besucherzahlen — sie gibt nur Transaktionen heraus. Am 08.09.2026
 * durchprobiert: kein Endpunkt fuer Statistiken, kein Report-Aufruf, nichts.
 * Die Zahl steht ausschliesslich im eingeloggten Dashboard. Deshalb wird hier der
 * dashboard-eigene Aufruf abgehoert und mit eigenen Datumsbereichen wiederholt.
 *
 * FOLGE: Es geht nur, solange Anikas Chrome laeuft und sie bei ThriveCart
 * angemeldet ist. Ist das nicht der Fall, bleiben die beiden Tabellenzeilen fuer
 * diesen Tag leer — genau wie die Devine-Zeile es heute schon macht. Kein Fehler,
 * einfach spaeter nachholen (die Zahlen sind rueckwirkend abrufbar).
 *
 * WAS DABEI HERAUSKOMMT (Zeilen fuer outputs\ads-auswertung\checkout-thrivecart.csv):
 *   Datum;Checkout;Bestellungen
 *   09.09.26;4;1
 *
 *   Checkout     = checkout_view, wie oft die Bezahlseite aufgerufen wurde
 *   Bestellungen = unique_order, wie viele davon gekauft haben
 *
 * ⚠️ WICHTIG ZUM VERSTAENDNIS: ThriveCart zaehlt ALLE Besucher der Bezahlseite,
 *    also auch die aus Instagram. Die Zeile "Salespage Besucher" (Devine) zaehlt
 *    dagegen nur Ads-Traffic. Die beiden Zahlen sind deshalb NICHT direkt
 *    verrechenbar. Die Checkout-Conversion (Bestellungen / Checkout) vergleicht
 *    dagegen Aepfel mit Aepfeln und ist die belastbare Kennzahl.
 *
 * ABLAUF (mit den Chrome-Werkzeugen, nicht mit node ausfuehrbar):
 *
 *   1. navigate  ->  https://thrivecart.com/anikas-pferdeakademie/#dashboard
 *   2. read_page (filter: interactive)  ->  liefert die beiden Auswahlfelder:
 *        das Produkt-Feld (dort "product-12" = Gelaende-Schluessel waehlen)
 *        das Zeitraum-Feld (irgendeinen Zeitraum waehlen, z.B. "month")
 *   3. SCHRITT 1 unten ausfuehren (Haken setzen) — VOR dem Umstellen der Felder!
 *   4. Produkt auf "product-12", danach Zeitraum umstellen. Dadurch schickt das
 *      Dashboard von sich aus den Aufruf los, den wir gleich nachbauen.
 *      ⚠️ form_input laesst sich nicht in einen Stapel packen (Rueckfrage wegen
 *         der Berechtigung) — das Produkt-Feld einzeln setzen.
 *   5. SCHRITT 2 unten ausfuehren  ->  gibt die fertigen CSV-Zeilen zurueck.
 *
 * WARUM DER AUFRUF ABGEHOERT UND NICHT NACHGEBAUT WIRD: "requested_stats" ist ein
 * verschachteltes Feld mit rund 30 Eintraegen, das das Dashboard aus den
 * Benutzereinstellungen zusammensetzt. Selbst gebaut antwortet der Server mit
 * lauter Nullen (am 08.09.2026 mehrfach probiert). Mit dem echten Koerper als
 * Vorlage, in dem nur die Datumsbereiche ausgetauscht werden, klappt es sofort.
 */

// ---------------------------------------------------------------- SCHRITT 1
// Haken in die Seite setzen. Faengt jeden Aufruf an plugin/call mit und legt
// den Koerper in window.__cap2 ab. Muss laufen, BEVOR die Auswahlfelder
// umgestellt werden — sonst gibt es nichts zu fangen.

window.__cap2 = [];
const OS2 = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (body) {
  try { if (this.__url && this.__url.indexOf('plugin/call') > -1) window.__cap2.push({ b: String(body) }); } catch (e) {}
  return OS2.apply(this, arguments);
};
const OO2 = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (m, u) { this.__url = u; return OO2.apply(this, arguments); };
const OF2 = window.fetch;
window.fetch = function (u, o) {
  try { if (String(u).indexOf('plugin/call') > -1 && o && o.body) window.__cap2.push({ b: String(o.body) }); } catch (e) {}
  return OF2.apply(this, arguments);
};
'Haken gesetzt';

// ---------------------------------------------------------------- SCHRITT 2
// Die Vorlage nehmen, die Datumsbereiche austauschen, Tag fuer Tag abfragen.
// Von/Bis unten anpassen. Ein Aufruf deckt problemlos einen ganzen Monat ab;
// laengere Zeitraeume lieber in Monatsstuecke teilen (so wie hier).

const vorlage = window.__cap2.find(x => x.b.indexOf('checkout_view') > -1).b;

window.__hole = async function (von, bis) {
  // Alles aus der Vorlage behalten AUSSER den Datumsbereichen — die kommen neu.
  const behalten = vorlage.split('&').filter(p => p.indexOf('ranges') !== 0 && p.indexOf('collect_history') !== 0);
  const teile = [];
  let i = 0;
  // Mittags starten, damit die Sommerzeit-Umstellung keinen Tag verschluckt.
  for (let t = new Date(von + 'T12:00:00'); t <= new Date(bis + 'T12:00:00'); t.setDate(t.getDate() + 1)) {
    const a = new Date(t); a.setHours(0, 0, 0, 0);
    const b = new Date(t); b.setHours(23, 59, 59, 0);
    const k = encodeURIComponent('ranges[' + i + '][]');
    teile.push(k + '=' + Math.floor(a.getTime() / 1000));
    teile.push(k + '=' + Math.floor(b.getTime() / 1000));
    i++;
  }
  const body = behalten.concat(teile, ['collect_history=false']).join('&');
  const r = await fetch(location.pathname.replace(/#.*$/, '') + 'api/v1/plugin/call/', {
    method: 'POST', credentials: 'include',
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: body
  });
  return await r.json();   // Schluessel = Unix-Zeit des Tagesanfangs
};

const raus = [];
for (const [a, b] of [['2026-09-01', '2026-09-09']]) {
  const j = await window.__hole(a, b);
  Object.keys(j).sort((x, y) => Number(x) - Number(y)).forEach(ts => {
    const t = new Date(Number(ts) * 1000);
    const d = ('0' + t.getDate()).slice(-2) + '.' + ('0' + (t.getMonth() + 1)).slice(-2) + '.' + String(t.getFullYear()).slice(-2);
    raus.push(d + ';' + j[ts].checkout_view + ';' + j[ts].unique_order);
  });
}
raus.join('\n');

/**
 * DANACH: die Zeilen in outputs\ads-auswertung\checkout-thrivecart.csv eintragen
 * (vorhandene Tage ueberschreiben, der laufende Tag aendert sich ja noch) und
 *
 *   .\scripts\minikurs-auswertung.ps1 -Von ... -Bis ...
 *
 * laufen lassen. Das Skript liest die Datei und schreibt die Zeilen
 * "Checkout Aufrufe" und "Checkout Conversion" in die Google-Tabelle.
 */
