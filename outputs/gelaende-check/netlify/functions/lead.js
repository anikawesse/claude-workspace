// Netlify-Funktion: nimmt den Quiz-Lead entgegen und legt/aktualisiert den Kontakt in Devine (GoHighLevel).
// Setzt Custom-Fields quiz_hebel + quiz_ergebnis_url und den Tag "gelaende-quiz" (startet die Auslieferungs-Sequenz).
// Secret: DEVINE_TOKEN als Environment-Variable in Netlify hinterlegen. Location optional als DEVINE_LOCATION_ID.

const GHL = "https://services.leadconnectorhq.com";
const TITLES = ["Fundament am Boden", "Souveräne Führungsperson", "Entspannt vom Hof", "Souverän draußen unterwegs"];
const SLUGS  = ["hebel-fundament", "hebel-fuehrung", "hebel-vom-hof", "hebel-draussen"]; // Bereichs-Tags fuer die Workflow-Weiche
const FIELD_HEBEL = "XOdJxEUzs4HI42kTiFD8";        // contact.quiz_hebel
const FIELD_URL   = "xmfZihq4Fexmm5UY6XGH";        // contact.quiz_ergebnis_url

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function topIdx(w) {
  const max = Math.max(...w);
  const idx = [];
  for (let i = 0; i < 4; i++) { if (w[i] === max) idx.push(i); }
  return { max, idx };
}

function hebelNamen(w) {
  const { max, idx } = topIdx(w);
  if (max <= 3) return "Ihr seid schon ein starkes Team";
  const tops = idx.map(i => TITLES[i]);
  return tops.length === 1 ? tops[0] : tops.slice(0, -1).join(", ") + " und " + tops[tops.length - 1];
}

function hebelTags(w) {
  const { max, idx } = topIdx(w);
  if (max <= 3) return ["hebel-starkes-team"];
  return idx.map(i => SLUGS[i]);
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: CORS, body: "Method Not Allowed" };

  const token = process.env.DEVINE_TOKEN;
  const locationId = process.env.DEVINE_LOCATION_ID || "YTcO1DtAeZWVMFTPktEB";
  if (!token) return { statusCode: 500, headers: CORS, body: "Missing DEVINE_TOKEN" };

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch (e) { return { statusCode: 400, headers: CORS, body: "Bad JSON" }; }

  const vorname = (data.vorname || "").toString().trim().slice(0, 80);
  const email = (data.email || "").toString().trim().toLowerCase();
  const werte = Array.isArray(data.werte) ? data.werte.map(x => parseInt(x, 10)) : [];
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const werteOk = werte.length === 4 && werte.every(v => Number.isInteger(v) && v >= 0 && v <= 12);
  if (!emailOk || !werteOk) return { statusCode: 400, headers: CORS, body: "Ungueltige Daten" };

  const site = process.env.URL || process.env.SITE_URL || "";
  const ergUrl = site + "/ergebnis.html?werte=" + werte.join("-") + (vorname ? "&name=" + encodeURIComponent(vorname) : "");
  const hebel = hebelNamen(werte);

  const body = {
    locationId,
    email,
    firstName: vorname || undefined,
    name: vorname || undefined,
    source: "Gelaende-Quiz",
    tags: ["gelaende-quiz", ...hebelTags(werte)],
    customFields: [
      { id: FIELD_HEBEL, value: hebel },
      { id: FIELD_URL, value: ergUrl }
    ]
  };

  try {
    const r = await fetch(GHL + "/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    });
    const txt = await r.text();
    if (!r.ok) return { statusCode: 502, headers: CORS, body: "Devine-Fehler: " + r.status + " " + txt.slice(0, 300) };
    return { statusCode: 200, headers: { ...CORS, "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 502, headers: CORS, body: "Fetch-Fehler: " + err.message };
  }
};
