// Netlify-Funktion: Double-Opt-in-Bestaetigung.
// Wird von ergebnis.html aufgerufen, wenn der Bestaetigungs-Link aus der Mail geklickt wurde (?bestaetigen=<contactId>).
// Setzt beim Kontakt den quiz-eigenen Bestaetigungs-Tag "gelaende-quiz-doi".
// Bewusst NICHT der allgemeine "doi": nur dieser quiz-eigene Tag darf die Auslieferung ausloesen,
// und er kommt bei JEDEM neu dazu (auch bei Kontakten, die schon "doi" haben) -> loest zuverlaessig aus.

const GHL = "https://services.leadconnectorhq.com";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: CORS, body: "Method Not Allowed" };

  const token = process.env.DEVINE_TOKEN;
  if (!token) return { statusCode: 500, headers: CORS, body: "Missing DEVINE_TOKEN" };

  let data;
  try { data = JSON.parse(event.body || "{}"); } catch (e) { return { statusCode: 400, headers: CORS, body: "Bad JSON" }; }

  const id = (data.id || "").toString().trim();
  if (!/^[A-Za-z0-9]{10,40}$/.test(id)) return { statusCode: 400, headers: CORS, body: "Ungueltige ID" };

  try {
    const r = await fetch(GHL + "/contacts/" + id + "/tags", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ tags: ["gelaende-quiz-doi"] })
    });
    const txt = await r.text();
    if (!r.ok) return { statusCode: 502, headers: CORS, body: "Devine-Fehler: " + r.status + " " + txt.slice(0, 200) };
    return { statusCode: 200, headers: { ...CORS, "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 502, headers: CORS, body: "Fetch-Fehler: " + err.message };
  }
};
