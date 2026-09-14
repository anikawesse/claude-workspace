/* Gemeinsame Ergebnis-Logik fuer quiz.html und ergebnis.html.
   Single Source of Truth fuer Meilenstein-Namen, Erklaer-Texte und den Profil-Aufbau. */

const MEILEN = [
  {nr:1, title:"Fundament am Boden", sub:"Vertrauen und Kommunikation"},
  {nr:2, title:"Souveräne Führungsperson", sub:"Kopfkino im Griff"},
  {nr:3, title:"Entspannt vom Hof", sub:"auch ohne Pferdekumpel"},
  {nr:4, title:"Souverän draußen unterwegs", sub:"Notfallstrategien und Kontrolle"}
];

/* Was macht der Bereich aus und warum ist er wichtig */
const ERKLAER = {
  1:"<p>Wie der Name schon sagt, wird hier die absolute Basis für eine vertrauensvolle Beziehung gelegt.</p><p>Du und dein Pferd entwickelt eine gemeinsame Sprache und verfeinert eure Kommunikation, damit in Zukunft keine Missverständnisse mehr entstehen.</p><p>Ich empfehle dir, dich mit der Art und Weise zu beschäftigen, wie Pferde energetisch und mit ihrer Körpersprache kommunizieren.</p><p>Das kannst du dann in Form von Führübungen und vor allem Freiarbeit mit deinem Pferd üben.</p><p>Wenn du dich jetzt fragst, wie das gehen soll, keine Sorge, das ist mein täglicher Job. Ich helfe dir, halte einfach nur die Augen in deinem E-Mail-Postfach offen.</p>",
  2:"<p>Du bist der Dreh- und Angelpunkt, damit ihr tiefes, gegenseitiges Vertrauen aufbauen könnt.</p><p>Wenn du unsicher bist, überträgt sich deine Anspannung auf dein Pferd. Das wollen wir verhindern.</p><p>Der Schlüssel dazu ist, sein eigenes Kopfkino in den Griff zu bekommen und damit deine Emotionen unter Kontrolle zu bringen.</p><p>So nimmt dich auch dein Pferd immer mehr als Sicherheitsanker wahr.</p><p>Wenn du dich jetzt fragst, wie das gehen soll, keine Sorge, das ist mein täglicher Job. Ich helfe dir, halte einfach nur die Augen in deinem E-Mail-Postfach offen.</p>",
  3:"<p>Wenn du erst gar nicht mit deinem Liebling ins Gelände kommst, weil dein Pferd steht wie der Fels in der Brandung oder total hektisch wird, ist das wirklich frustrierend.</p><p>Hier gilt es jetzt eine gezielte Strategie zu entwickeln, mit der du sanft und sicher, ohne Pferdekumpel, vom Hof kommst.</p><p>Ich empfehle dir dafür mit Annäherung und Rückzug zu arbeiten.</p><p>Damit bekommt die ganze Situation etwas spielerisches und schon bald hast du die Freiheit, unabhängig von jemand anderem, den Hof zu verlassen.</p><p>Wenn du dich jetzt fragst, wie das gehen soll, keine Sorge, das ist mein täglicher Job. Ich helfe dir, halte einfach nur die Augen in deinem E-Mail-Postfach offen.</p>",
  4:"<p>Hurra, ihr könnt schon mal alleine ins Gelände gehen.</p><p>Jetzt gilt es, die auftretenden Situationen zu meistern, damit ihr euren Ausflug genießt und wohlbehalten wieder zu Hause ankommt.</p><p>Leider sind wir im Gelände den Umweltreizen ausgesetzt und haben keinen Einfluss darauf. Das heißt, wir müssen damit klarkommen, wenn die Kuhherde neben uns losrennt oder der Trecker um die Ecke schießt.</p><p>Zum Glück gibt es dafür ganz viele Strategien, um immer wieder „das Ventil zu öffnen“ und Druck rauszulassen, bevor dein Pferd explodiert.</p><p>Wenn du dich jetzt fragst, wie das gehen soll, keine Sorge, das ist mein täglicher Job. Ich helfe dir, halte einfach nur die Augen in deinem E-Mail-Postfach offen.</p>"
};

function level(v){ if(v<=3) return {label:"Schon stark",kl:"lv-gut"}; if(v<=8) return {label:"Ausbaufähig",kl:"lv-mittel"}; return {label:"Großer Hebel",kl:"lv-hoch"}; }
function topAreas(s){ const max=Math.max(s[1],s[2],s[3],s[4]); const arr=[]; for(let m=1;m<=4;m++){ if(s[m]===max) arr.push(m); } return arr; }
function namen(arr){ const t=arr.map(m=>MEILEN[m-1].title); return t.length===1 ? t[0] : t.slice(0,-1).join(", ")+" und "+t[t.length-1]; }

function bereicheHTML(s){
  return MEILEN.map(m=>{
    const v=s[m.nr], lv=level(v), pct=Math.max(4,Math.round((12-v)/12*100));
    return `<div class="bereich">
      <div class="bereich-kopf"><span class="bereich-title">${m.nr} · ${m.title}</span><span class="bereich-level ${lv.kl}">${lv.label}</span></div>
      <div class="bereich-sub">${m.sub}</div>
      <div class="bar"><div class="bar-fill ${lv.kl}" style="width:${pct}%"></div></div>
    </div>`;
  }).join("");
}

/* Baut das komplette Ergebnis-Profil. s = {1,2,3,4} mit je 0..12.
   Rueckgabe: {intro, bereiche, titel, text, tops} als HTML-Strings. */
function buildProfil(s){
  const max=Math.max(s[1],s[2],s[3],s[4]);
  const tops=topAreas(s);
  const bereiche=bereicheHTML(s);
  let intro,titel,text;
  if(max<=3){
    intro="So sieht dein aktueller Stand in den vier Bereichen aus. Je länger und grüner ein Balken, desto runder läuft dieser Bereich schon.";
    titel="Dein Fazit";
    text="<p>Das ist richtig stark. Genieße eure Gelände-Ausflüge und bleib dran.</p><p>Feile einfach dort weiter, wo noch ein bisschen Luft ist.</p><p>Du bekommst in den nächsten Tagen noch Tipps von mir für die einzelnen Bereiche. Halte einfach dafür dein E-Mail-Postfach im Auge.</p>";
  } else {
    intro="So sieht dein aktueller Stand in den vier Bereichen aus. Je kürzer und roter ein Balken, desto größer ist dort gerade dein <b>Hebel</b>.";
    const mehrere=tops.length>1;
    titel=mehrere?"Deine größten Hebel":"Dein größter Hebel";
    const satz=mehrere
      ? `<p>Am meisten Potential holst du gerade in diesen Bereichen heraus: <b>${namen(tops)}</b>. Genau dort sollten deine nächsten Schritte liegen.</p>`
      : `<p>Am meisten Potential holst du gerade im Bereich <b>${namen(tops)}</b> heraus. Genau dort sollte dein nächster Schritt liegen.</p>`;
    text=satz+tops.map(m=>(mehrere?`<h4 class="bereich-head">${MEILEN[m-1].title}</h4>`:"")+ERKLAER[m]).join("");
  }
  return {intro, bereiche, titel, text, tops};
}
