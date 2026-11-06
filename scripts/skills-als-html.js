// Wandelt die Stellenbeschreibungen (SKILL.md) und das Wissen (wissen.md) der KI-Team-Skills
// in lesbare HTML-Seiten um: outputs/ki-team/stellenbeschreibungen/
// Aufruf: node scripts/skills-als-html.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const skillsDir = path.join(root, ".claude", "skills");
const outDir = path.join(root, "outputs", "ki-team", "stellenbeschreibungen");
fs.mkdirSync(outDir, { recursive: true });

const TEAM = ["assistenz", "mail-texterin", "salespage-texterin", "content-redaktion", "ads-team",
  "kundinnen-support", "produkt-werkstatt", "backoffice"];

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/~~([^~]+)~~/g, "<del>$1</del>")
  .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

function md2html(md) {
  md = md.replace(/\r/g, "");
  let meta = "";
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    const d = fm[1].match(/^description:\s*(.*)$/m);
    if (d) meta = `<p class="meta"><strong>Wann sie gerufen wird:</strong> ${inline(d[1])}</p>`;
    md = md.slice(fm[0].length);
  }
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(esc(lines[i++]));
      out.push(`<pre>${buf.join("\n")}</pre>`); i++; continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      let html = "<table><thead><tr>" + cells(rows[0]).map(c => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>";
      rows.slice(2).forEach(r => html += "<tr>" + cells(r).map(c => `<td>${inline(c)}</td>`).join("") + "</tr>");
      out.push(html + "</tbody></table>"); continue;
    }
    if (/^\s*([-*]|\d+[.)])\s+/.test(l)) {
      const ordered = /^\s*\d/.test(l);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+[.)])\s+/.test(lines[i])) {
        const indent = /^\s{2,}/.test(lines[i]);
        items.push(`<li${indent ? ' class="sub"' : ""}>${inline(lines[i].replace(/^\s*([-*]|\d+[.)])\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.join("")}</${ordered ? "ol" : "ul"}>`); continue;
    }
    if (/^>\s?/.test(l)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(inline(lines[i++].replace(/^>\s?/, "")));
      out.push(`<blockquote>${buf.join("<br>")}</blockquote>`); continue;
    }
    if (/^---+$/.test(l)) { out.push("<hr>"); i++; continue; }
    if (!l.trim()) { i++; continue; }
    const buf = [inline(lines[i++])];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\||```|>|\s*([-*]|\d+[.)])\s)/.test(lines[i])) buf.push(inline(lines[i++]));
    out.push(`<p>${buf.join("<br>")}</p>`);
  }
  return meta + out.join("\n");
}

const css = `body{font-family:"Source Sans 3",Segoe UI,sans-serif;background:#f7f3ec;color:#2e2a24;margin:0;line-height:1.6}
main{max-width:860px;margin:0 auto;padding:32px 20px 80px}
h1,h2,h3{font-family:Georgia,serif;color:#5b4632;line-height:1.25}
h1{font-size:2rem;margin-top:0}h2{margin-top:2.2em;border-bottom:2px solid #e2d6c3;padding-bottom:4px}
.meta{background:#fff;border-left:4px solid #b88a5a;padding:12px 16px;border-radius:6px;font-size:.95rem}
nav{background:#5b4632;padding:10px 20px;display:flex;flex-wrap:wrap;gap:6px 16px;font-size:.9rem}
nav a{color:#f7f3ec;text-decoration:none}nav a.on{font-weight:700;text-decoration:underline}
.tabs{margin:8px 0 24px}.tabs a{display:inline-block;padding:6px 14px;border-radius:20px;background:#e2d6c3;color:#5b4632;text-decoration:none;margin-right:6px}
.tabs a.on{background:#5b4632;color:#fff}
table{border-collapse:collapse;width:100%;background:#fff;font-size:.95rem}th,td{border:1px solid #e2d6c3;padding:6px 10px;text-align:left;vertical-align:top}th{background:#efe6d8}
code{background:#efe6d8;padding:1px 5px;border-radius:4px;font-size:.88em}pre{background:#fff;padding:12px;overflow:auto;border-radius:6px}
li.sub{margin-left:1.5em;list-style:circle}blockquote{border-left:3px solid #b88a5a;margin:0;padding-left:14px;color:#5b4632}
@media(max-width:600px){main{padding:20px 16px 60px}}`;

TEAM.forEach(name => {
  ["SKILL", "wissen"].forEach(kind => {
    const src = path.join(skillsDir, name, kind + ".md");
    if (!fs.existsSync(src)) return;
    const nav = TEAM.map(n => `<a href="${n}.html"${n === name ? ' class="on"' : ""}>${n}</a>`).join("");
    const tabs = `<div class="tabs"><a href="${name}.html"${kind === "SKILL" ? ' class="on"' : ""}>Stellenbeschreibung</a><a href="${name}-wissen.html"${kind === "wissen" ? ' class="on"' : ""}>Wissen</a></div>`;
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} ${kind === "SKILL" ? "Stellenbeschreibung" : "Wissen"}</title><style>${css}</style></head><body><nav>${nav}</nav><main>${tabs}${md2html(fs.readFileSync(src, "utf8"))}</main></body></html>`;
    fs.writeFileSync(path.join(outDir, name + (kind === "wissen" ? "-wissen" : "") + ".html"), html);
  });
});
console.log("Fertig:", outDir);
