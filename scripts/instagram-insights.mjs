// Instagram-Auswertung: letzte Reels/Posts nach Hook gruppiert, mit Zahlen + Direktlink.
// Nutzung:  node scripts/instagram-insights.mjs [anzahl]
// Liest META_IG_TOKEN aus scripts/.env. Token wird nie ausgegeben.
import fs from 'fs';

const envPath = new URL('./.env', import.meta.url);
const env = fs.readFileSync(envPath, 'utf8');
const tok = (env.match(/^META_IG_TOKEN=(.*)$/m) || [])[1]?.trim();
if (!tok) { console.error('❌ META_IG_TOKEN fehlt in scripts/.env'); process.exit(1); }

const V = 'v21.0';
const g = async (p) => {
  const url = `https://graph.facebook.com/${V}/${p}${p.includes('?') ? '&' : '?'}access_token=${tok}`;
  const r = await fetch(url);
  return r.json();
};

// 1) Instagram-Konto über die Seite auflösen
const acc = await g('me/accounts?fields=id,name');
const page = acc.data?.[0];
if (!page) { console.error('❌ Keine Facebook-Seite gefunden.', acc.error || acc); process.exit(1); }
const pg = await g(`${page.id}?fields=instagram_business_account`);
const ig = pg.instagram_business_account?.id;
if (!ig) { console.error('❌ Kein verknüpftes Instagram-Konto gefunden.', pg.error || pg); process.exit(1); }

const prof = await g(`${ig}?fields=username,followers_count,media_count`);
console.log(`\nInstagram: @${prof.username} · ${prof.followers_count} Follower · ${prof.media_count} Beiträge`);

// 2) Letzte Medien inkl. Insights (eine Abfrage per Feld-Erweiterung)
const limit = Number(process.argv[2]) || 50;
const media = await g(`${ig}/media?limit=${limit}&fields=id,caption,permalink,timestamp,media_product_type,like_count,comments_count,insights.metric(reach,views,saved,shares,total_interactions)`);
if (media.error) { console.error('❌ Fehler beim Abruf der Medien:', media.error); process.exit(1); }

const items = (media.data || []).map(m => {
  const ins = {};
  (m.insights?.data || []).forEach(i => { ins[i.name] = i.values?.[0]?.value ?? 0; });
  return {
    date: (m.timestamp || '').slice(0, 10),
    type: m.media_product_type,
    hook: (m.caption || '(ohne Caption)').replace(/\s+/g, ' ').trim().slice(0, 60),
    reach: ins.reach || 0,
    views: ins.views || 0,
    likes: m.like_count || 0,
    comments: m.comments_count || 0,
    saved: ins.saved || 0,
    shares: ins.shares || 0,
    url: m.permalink || ''
  };
});

// 3) Nach Hook (erste Caption-Zeile) gruppieren, beste Variante nach Aufrufen markieren
const groups = {};
items.forEach(it => { (groups[it.hook] = groups[it.hook] || []).push(it); });

const pad = (v, n) => String(v).padStart(n);
for (const [hook, arr] of Object.entries(groups)) {
  arr.sort((a, b) => b.views - a.views);
  console.log(`\n=== HOOK: ${hook}  (${arr.length} ${arr.length === 1 ? 'Beitrag' : 'Varianten'}) ===`);
  arr.forEach((it, i) => {
    const mark = i === 0 && arr.length > 1 ? '🏆' : '  ';
    console.log(`${mark} ${it.date} | views ${pad(it.views,6)} | reach ${pad(it.reach,6)} | likes ${pad(it.likes,4)} | komm ${pad(it.comments,3)} | saved ${pad(it.saved,4)} | shares ${pad(it.shares,3)} | ${it.url}`);
  });
}
console.log('');
