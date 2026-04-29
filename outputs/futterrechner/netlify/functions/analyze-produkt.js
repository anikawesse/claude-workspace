const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: 'API-Key nicht konfiguriert' }) };
    }

    try {
        const { image, mediaType } = JSON.parse(event.body);
        if (!image) return { statusCode: 400, body: JSON.stringify({ error: 'Kein Bild' }) };

        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const message = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 200,
            messages: [{
                role: 'user',
                content: [
                    { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
                    { type: 'text', text: `Dies ist ein Foto einer Pferde-Futtermittel-Verpackung. Extrahiere den Produktnamen und die empfohlene Tagesdosis. Antworte NUR mit JSON:
{"name": "vollständiger Produktname", "menge": "50", "einheit": "g"}
Einheit muss eines sein: g, ml, kg, Stück, Messerspitze. Wenn kein Wert erkennbar: null. Nur JSON, keine Erklärung.` }
                ]
            }]
        });

        const data = JSON.parse(message.content[0].text.trim());
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Analyse fehlgeschlagen' }) };
    }
};
