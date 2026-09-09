// Netlify-Funktion: liefert der Content-Maschine die letzten Instagram-Beitraege
// samt Zahlen, Feed-Kennzeichen und Permalink. Der Token bleibt serverseitig
// (Netlify-Umgebungsvariable META_IG_TOKEN) und wird NIE an den Browser ausgeliefert.
// Aufruf aus der App: fetch('/.netlify/functions/instagram?days=120')

exports.handler = async (event) => {
  const tok = process.env.META_IG_TOKEN;
  if (!tok) return json(500, { error: 'META_IG_TOKEN fehlt in den Netlify-Umgebungsvariablen.' });

  const V = 'v21.0';
  const g = async (url) => { const r = await fetch(url); return r.json(); };

  const q = (event && event.queryStringParameters) || {};
  const days = Math.min(Number(q.days) || 120, 400);
  const since = q.since || new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  try {
    let ig = process.env.META_IG_ID;
    if (!ig) {
      const acc = await g(`https://graph.facebook.com/${V}/me/accounts?fields=id&access_token=${tok}`);
      const page = acc.data && acc.data[0];
      if (!page) return json(502, { error: 'Keine Facebook-Seite gefunden.', detail: acc.error || null });
      const pg = await g(`https://graph.facebook.com/${V}/${page.id}?fields=instagram_business_account&access_token=${tok}`);
      ig = pg.instagram_business_account && pg.instagram_business_account.id;
      if (!ig) return json(502, { error: 'Kein verknuepftes Instagram-Konto gefunden.' });
    }

    let url = `https://graph.facebook.com/${V}/${ig}/media?limit=50&fields=id,caption,permalink,timestamp,media_product_type,is_shared_to_feed,like_count,comments_count,thumbnail_url,media_url,insights.metric(reach,views,saved,shares,total_interactions)&access_token=${tok}`;
    const items = [];
    let pages = 0, stop = false;
    while (url && !stop && pages < 8) {
      const j = await g(url);
      if (j.error) return json(502, { error: 'Graph-API-Fehler', detail: j.error });
      for (const m of (j.data || [])) {
        if ((m.timestamp || '').slice(0, 10) < since) { stop = true; break; }
        const ins = {};
        ((m.insights && m.insights.data) || []).forEach((i) => { ins[i.name] = (i.values && i.values[0]) ? i.values[0].value : 0; });
        const isReel = m.media_product_type === 'REELS';
        items.push({
          id: m.id,
          date: (m.timestamp || '').slice(0, 10),
          type: m.media_product_type || '',
          feed: (!isReel) || m.is_shared_to_feed === true,
          caption: m.caption || '',
          hook: (m.caption || '').replace(/\s+/g, ' ').trim().slice(0, 80),
          reach: ins.reach || 0,
          views: ins.views || 0,
          likes: m.like_count || 0,
          comments: m.comments_count || 0,
          saved: ins.saved || 0,
          shares: ins.shares || 0,
          url: m.permalink || '',
          thumb: m.thumbnail_url || m.media_url || ''
        });
      }
      url = (!stop && j.paging && j.paging.next) ? j.paging.next : null;
      pages++;
    }

    return json(200, { updated: Date.now(), since, count: items.length, items });
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
