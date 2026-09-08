// Netlify-Funktion: liefert der Content-Maschine die letzten Instagram-Beitraege
// samt Zahlen + Permalink. Der Token bleibt serverseitig (Netlify-Umgebungsvariable
// META_IG_TOKEN) und wird NIE an den Browser ausgeliefert.
// Aufruf aus der App: fetch('/.netlify/functions/instagram')

exports.handler = async (event) => {
  const tok = process.env.META_IG_TOKEN;
  if (!tok) return json(500, { error: 'META_IG_TOKEN fehlt in den Netlify-Umgebungsvariablen.' });

  const V = 'v21.0';
  const g = async (p) => {
    const url = `https://graph.facebook.com/${V}/${p}${p.includes('?') ? '&' : '?'}access_token=${tok}`;
    const r = await fetch(url);
    return r.json();
  };

  const limit = Math.min(Number((event && event.queryStringParameters && event.queryStringParameters.limit) || 50), 100);

  try {
    // Instagram-Konto ueber die Seite aufloesen (oder feste ID via META_IG_ID)
    let ig = process.env.META_IG_ID;
    if (!ig) {
      const acc = await g('me/accounts?fields=id');
      const page = acc.data && acc.data[0];
      if (!page) return json(502, { error: 'Keine Facebook-Seite gefunden.', detail: acc.error || null });
      const pg = await g(`${page.id}?fields=instagram_business_account`);
      ig = pg.instagram_business_account && pg.instagram_business_account.id;
      if (!ig) return json(502, { error: 'Kein verknuepftes Instagram-Konto gefunden.' });
    }

    const media = await g(`${ig}/media?limit=${limit}&fields=id,caption,permalink,timestamp,media_product_type,like_count,comments_count,insights.metric(reach,views,saved,shares,total_interactions)`);
    if (media.error) return json(502, { error: 'Graph-API-Fehler', detail: media.error });

    const items = (media.data || []).map((m) => {
      const ins = {};
      ((m.insights && m.insights.data) || []).forEach((i) => { ins[i.name] = (i.values && i.values[0]) ? i.values[0].value : 0; });
      return {
        id: m.id,
        date: (m.timestamp || '').slice(0, 10),
        type: m.media_product_type || '',
        caption: m.caption || '',
        hook: (m.caption || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        reach: ins.reach || 0,
        views: ins.views || 0,
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
        saved: ins.saved || 0,
        shares: ins.shares || 0,
        url: m.permalink || ''
      };
    });

    return json(200, { updated: Date.now(), count: items.length, items });
  } catch (e) {
    return json(500, { error: String(e && e.message ? e.message : e) });
  }
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(obj)
  };
}
