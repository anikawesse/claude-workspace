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
            model: 'claude-haiku-4-5-20251001',
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
                        text: `Dies ist eine Heuanalyse (z. B. Lufa-Laborbericht). Extrahiere folgende Werte und antworte NUR mit einem JSON-Objekt, ohne Erklärungen:
{
  "zucker": <Gesamtzucker in % oder null>,
  "rohprotein": <Rohprotein in g/kg oder null>,
  "calcium": <Calcium in g/kg oder null>,
  "phosphor": <Phosphor in g/kg oder null>,
  "magnesium": <Magnesium in g/kg oder null>,
  "zink": <Zink in mg/kg oder null>,
  "kupfer": <Kupfer in mg/kg oder null>,
  "selen": <Selen in mg/kg oder null>
}
Wenn ein Wert nicht erkennbar ist: null. Nur JSON, keine weiteren Texte.`
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
