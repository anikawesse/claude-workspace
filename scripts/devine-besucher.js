/*
Holt die taeglichen Besucherzahlen der Ads-Salespage aus Devine Funnels.

HINTERGRUND
Devine laeuft auf GoHighLevel. Die oeffentliche GHL-API hat KEINEN Analytics-
Endpunkt — die Funnel-API kann nur Funnels/Seiten auflisten und zaehlen.
Die Devine-Oberflaeche selbst benutzt aber einen internen Endpunkt MIT Datums-
filter (gefunden am 17.07.2026 ueber die Netzwerkanalyse):

  GET https://backend.leadconnectorhq.com/stats/
        ?funnelId=<funnelId>&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&locationId=<locationId>

Antwort: Array von Steps, je mit pageViewsAll und pageViewsUnique.
Anikas "Besucher" in der Auswertungs-Tabelle = pageViewsUnique.

AUTHENTIFIZIERUNG
Der Endpunkt braucht Header, die die App setzt (u.a. 'token-id'). Das Token
steht im localStorage, ist aber abgeschirmt und laeuft ohnehin ab. Deshalb:
NICHT das Token auslesen, sondern XMLHttpRequest.setRequestHeader patchen, die
Header eines echten App-Abrufs mitschneiden und wiederverwenden. Das Token
bleibt so im Browser.
⚠️ withCredentials MUSS aus bleiben — mit Credentials scheitert CORS.

DESHALB: Das laeuft nur im eingeloggten Browser, nicht unbeaufsichtigt aus
PowerShell heraus. minikurs-auswertung.ps1 liest die Zahlen aus
outputs/ads-auswertung/besucher-devine.csv.

ANWENDUNG
1. In Devine die Statistik-Seite des Funnels oeffnen:
   /v2/location/<locationId>/funnels-websites/funnels/<funnelId>/stats
2. Schritt 1 (unten) in der Konsole ausfuehren.
3. Im UI den Datumsfilter aendern und bestaetigen -> Header werden gefangen.
4. Schritt 2 ausfuehren -> liefert die Tageswerte.
5. Werte in outputs/ads-auswertung/besucher-devine.csv eintragen (Format TT.MM.JJ;Zahl).
*/

// ---- Anikas IDs (Gelaende-Schluessel-Funnel, Stand 17.07.2026) -------------
const LOCATION_ID = 'YTcO1DtAeZWVMFTPktEB';
const FUNNEL_ID   = 'YP50R9ThSMOKNHmWJ0pr';
const ADS_STEP    = '745197b3-6286-44c2-9429-dd0461b9b418';  // "Salespage Ads"
// Zum Vergleich: 'ca455da2-bdc8-40d9-ba5e-9b24a128d44a' = "Salespage (Organisch)"

// ---- Schritt 1: Header mitschneiden ---------------------------------------
window.__ghlCap = null;
const _open = XMLHttpRequest.prototype.open;
const _setH = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.open = function (m, u, ...rest) {
  this.__url = String(u); this.__h = {};
  return _open.call(this, m, u, ...rest);
};
XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
  try {
    if (this.__h) this.__h[k] = v;
    if (this.__url && this.__url.includes('backend.leadconnectorhq.com/stats')) window.__ghlCap = this.__h;
  } catch (e) {}
  return _setH.call(this, k, v);
};
// -> jetzt im UI den Datumsfilter aendern + bestaetigen, dann pruefen:
//    window.__ghlCap ? Object.keys(window.__ghlCap) : 'noch nichts gefangen'

// ---- Schritt 2: Tageswerte holen ------------------------------------------
async function devineBesucher(vonISO, bisISO) {
  if (!window.__ghlCap) throw new Error('Keine Header gefangen — erst Schritt 1, dann Datum im UI aendern.');

  const hole = (tag) => new Promise((res) => {
    const x = new XMLHttpRequest();
    x.open('GET', `https://backend.leadconnectorhq.com/stats/?funnelId=${FUNNEL_ID}` +
                  `&fromDate=${tag}&toDate=${tag}&locationId=${LOCATION_ID}`);
    for (const [k, v] of Object.entries(window.__ghlCap)) { try { x.setRequestHeader(k, v); } catch (e) {} }
    // withCredentials bewusst NICHT setzen (sonst CORS-Fehler)
    x.onload = () => { try { res(JSON.parse(x.responseText)); } catch (e) { res(null); } };
    x.onerror = () => res(null);
    x.send();
  });

  const out = [];
  for (let d = new Date(vonISO); d <= new Date(bisISO); d.setDate(d.getDate() + 1)) {
    const tag = d.toISOString().slice(0, 10);
    const j = await hole(tag);
    const s = Array.isArray(j) ? j.find(e => e.stepId === ADS_STEP) : null;
    const [y, m, t] = tag.split('-');
    out.push(`${t}.${m}.${y.slice(2)};${s ? s.pageViewsUnique : ''}`);
    await new Promise(r => setTimeout(r, 250));   // freundlich zum Server
  }
  return out.join('\n');   // direkt im CSV-Format
}

// Beispiel:
// await devineBesucher('2026-07-01', '2026-07-31')
