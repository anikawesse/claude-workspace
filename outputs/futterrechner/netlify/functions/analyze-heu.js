const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API-Key nicht konfiguriert' })
        };
    }

    try {
        const { image, mediaType } = JSON.parse(event.body);

        if (!image) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Kein Bild übermittelt' }) };
        }

        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const message = await client.messages.create({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 300,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: mediaType || 'image/jpeg',
                            data: image
                        }
                    },
                    {
                        type: 'text',
                        text: `Dies ist eine Heuanalyse (LUFA-Laborbericht). Lies NUR die Spalte "Berechnet auf die Trockensubstanz". Antworte NUR mit diesem JSON, ohne Erklärungen:
{
  "me": <ME-Pferd in MJ/kg oder null>,
  "zucker": <Gesamtzucker in % oder null>,
  "pcvxp": <pcv XP in % oder null>,
  "calcium": <Calcium in % oder null>,
  "phosphor": <Phosphor in % oder null>,
  "magnesium": <Magnesium in % oder null>,
  "natrium": <Natrium in % oder null>,
  "kalium": <Kalium in % oder null>,
  "schwefel": <Schwefel in % oder null>,
  "kupfer": <Kupfer in mg/kg oder null>,
  "zink": <Zink in mg/kg oder null>,
  "mangan": <Mangan in mg/kg oder null>,
  "eisen": <Eisen in mg/kg oder null>,
  "selen": <Selen in mg/kg oder null>
}
Wichtig: Mengenelemente (Ca, P, Mg, Na, K, S) in %, Spurenelemente in mg/kg. Nur JSON, keine weiteren Texte.`
                    }
                ]
            }]
        });

        const jsonText = message.content[0].text.trim();
        const data = JSON.parse(jsonText);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('analyze-heu error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Analyse fehlgeschlagen' })
        };
    }
};
