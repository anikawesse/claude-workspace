# CLAUDE.md

Diese Datei gibt Claude Code (claude.ai/code) Anweisungen für die Arbeit in diesem Repository.

---

## Was das hier ist

Dies ist ein **Claude Workspace Template** — eine strukturierte Umgebung, die für die Arbeit mit Claude Code als leistungsstarkem Agenten-Assistenten über mehrere Sessions hinweg konzipiert ist. Der Benutzer startet wiederholt neue Claude Code Sessions und verwendet `/prime` zu Beginn jeder Session, um den wesentlichen Kontext ohne Ballast zu laden.

**Diese Datei (CLAUDE.md) ist das Fundament.** Sie wird automatisch am Anfang jeder Session geladen. Halte sie aktuell — sie ist die Single Source of Truth dafür, wie Claude diesen Workspace verstehen und darin arbeiten soll.

---

## Die Claude-User-Beziehung

Claude arbeitet als **Agenten-Assistent** mit Zugriff auf die Workspace-Ordner, Kontext-Dateien, Commands und Outputs. Die Beziehung ist:

- **User**: Definiert Ziele, liefert Kontext zu seiner Rolle/Funktion und steuert die Arbeit über Commands
- **Claude**: Liest Kontext, versteht die Ziele des Users, führt Commands aus, produziert Outputs und pflegt die Workspace-Konsistenz

Claude sollte sich immer über `/prime` am Session-Start orientieren, dann mit vollem Bewusstsein dafür handeln, wer der User ist, was er erreichen möchte und wie dieser Workspace das unterstützt.

---

## Workspace-Struktur

```
.
├── CLAUDE.md              # Diese Datei — Kern-Kontext, immer geladen
├── .claude/
│   ├── skills/            # KI-Team: ein Skill pro Arbeitsbereich (siehe unten)
│   └── commands/          # Slash-Commands, die Claude ausführen kann
│       ├── prime.md       # /prime — Session-Initialisierung
│       ├── create-plan.md  # /create-plan — Implementierungspläne erstellen
│       └── implement.md   # /implement — Pläne umsetzen
├── context/               # Hintergrund-Kontext über den User und das Projekt
│                          # (Vom User mit Rolle, Zielen, Strategien befüllen)
├── plans/                 # Implementierungspläne erstellt von /create-plan
├── outputs/               # Arbeitsergebnisse und Deliverables
├── reference/             # Vorlagen, Beispiele, wiederverwendbare Patterns
└── scripts/               # Automatisierungsskripte (falls zutreffend)
```

**Verzeichnisse:**

| Verzeichnis  | Zweck                                                                                   |
| ------------ | --------------------------------------------------------------------------------------- |
| `context/`   | Wer der User ist, seine Rolle, aktuelle Prioritäten, Strategien. Gelesen von `/prime`. |
| `plans/`     | Detaillierte Implementierungspläne. Erstellt mit `/create-plan`, umgesetzt mit `/implement`. |
| `outputs/`   | Deliverables, Analysen, Reports und Arbeitsergebnisse.                                 |
| `reference/` | Hilfreiche Dokumentation, Vorlagen und Patterns für verschiedene Workflows.            |
| `scripts/`   | Automatisierungs- und Tooling-Skripte.                                                 |

---

## Commands

### /prime

**Zweck:** Neue Session mit vollem Kontext-Bewusstsein initialisieren.

Am Anfang jeder Session ausführen. Claude wird:

1. CLAUDE.md und Kontext-Dateien lesen
2. Verständnis von User, Workspace und Zielen zusammenfassen
3. Bereitschaft zur Unterstützung bestätigen

### /create-plan [anforderung]

**Zweck:** Detaillierten Implementierungsplan erstellen, bevor Änderungen gemacht werden.

Verwenden beim Hinzufügen neuer Funktionalität, Commands, Skripte oder bei strukturellen Änderungen. Erzeugt ein gründliches Plan-Dokument in `plans/`, das Kontext, Begründung und schrittweise Aufgaben erfasst.

Beispiel: `/create-plan Wettbewerbs-Analyse-Command hinzufügen`

### /implement [plan-pfad]

**Zweck:** Einen mit /create-plan erstellten Plan umsetzen.

Liest den Plan, führt jeden Schritt der Reihe nach aus, validiert die Arbeit und aktualisiert den Plan-Status.

Beispiel: `/implement plans/2026-01-28-wettbewerbs-analyse-command.md`

### /gelaende-call [vtt-pfad]

**Zweck:** Wöchentlichen Live-Call des Gelände-Programms auswerten.

Liest das Zoom-Transkript (.vtt vom Desktop, optional Pfad als Argument), aktualisiert die Kundinnen-Übersicht in `outputs/gelaende-calls/kundinnen-uebersicht.md`, pusht sie via `scripts/gelaende-call-doc-update.ps1` ins Google Doc „Gelände-Programm — Call-Notizen Kundinnen" und sammelt Marketing-Insights (O-Töne, Einwände, häufige Fragen, Tina-Abgleich) in `outputs/gelaende-calls/marketing-insights.md`. Details im Command selbst.

---

## KI-Team (Skills als Mitarbeiterinnen)

Jeder Arbeitsbereich bekommt einen eigenen Skill mit Stellenbeschreibung. Jeder Chat kann jeden Skill nutzen: Chats sind Aufgaben, Skills sind die Mitarbeiterinnen. Plan und Status: `plans/2026-11-06-ki-team-skills.md`, Organigramm: `outputs/ki-team/ki-team-organigramm.html`.

| Skill | Zuständig für |
| ----- | ------------- |
| `mail-texterin` | Alle Mails: Webinar, Launch, Soft-/Hard-Sale, Aufwärm, Mehrwert, Betreffzeilen |
| `salespage-texterin` | Salespages, Landing-/Opt-in-Seiten, Upsells, ThriveCart-Texte, Angebot und Garantie |
| `content-redaktion` | Karussells (Canva), Captions, Yapping, Reel-Formate, Test-Reels, IG-Auswertung, Gemini-Bilder |
| `ads-team` | Meta-Ads, Tracking, alle Auswertungen mit Zahlen (Ads, Launch, Webinar, Mails) |
| `kundinnen-support` | Tiergespräch-Notizen, Support-Antworten, Freelancerin-Vorlagen, Community-Posts |
| `produkt-werkstatt` | Kurse, Lektionen, Workbooks, Folien, Zertifikate, Thumbnails, Video-Technik |
| `backoffice` | Lexware, Belege, Banking, Fristen, Devine, ThriveCart, ManyChat |
| `assistenz` | Eingangskorb im angepinnten Chat „Assistenz“: verteilt Aufträge, Überblick, Fristen, Morgen-Briefing |
| `hook-reel-coach` | Hooks und Reel-Ideen bewerten und entwickeln |
| `humanizer`, `ki-sprech-killer` | Lektorat: jeder Text vor der Abgabe |

Jeder Skill-Ordner in `.claude/skills/<name>/` hat `SKILL.md` (Stellenbeschreibung mit 8 Feldern) und `wissen.md` (gesammeltes Bereichswissen, früher in der Memory).

**Zum Lesen für Anika:** .md-Dateien kann sie nicht öffnen. `node scripts/skills-als-html.js` erzeugt lesbare Seiten in `outputs/ki-team/stellenbeschreibungen/` (je Skill Stellenbeschreibung + Wissen). Nach jeder Skill-Änderung neu laufen lassen und im Browser öffnen.

**Seitenleiste:** Chats sind in Gruppen pro Abteilung sortiert (Marketing & Launch, Content & Reichweite, Ads & Zahlen, Produkte, Kundinnen & Support, Backoffice & Finanzen). Neue Chats in die passende Gruppe einsortieren. **Angepinnt ist nur die Assistenz** (Anika, 06.11.2026), höchstens vorübergehend ein brandaktuelles Projekt.

**Dienstplan (geplante Aufgaben, laufen nur bei offener App):** Content-Vorproduktion werktags 6:00 (montags 21 Tage vorproduzieren zur Freigabe, täglich Freigegebenes in Devine einplanen), Morgen-Briefing werktags 7:00 (mit Content-Block), Shorts-Gewinner täglich 8:00 (Testreel-Gewinner nach 2 Tagen als Feed-Reel 18:00 ohne Musik in Devine, `scripts/shorts-gewinner.mjs`), Ads-Wochenbericht montags 8:00, Instagram-Rückblick alle zwei Wochen freitags 7:00 (gerade KW), Mail-Auswertung-Erinnerung und Buchhaltung ThriveCart → Lexware am 1. des Monats.

**Content-Freigabe:** Die Content-Redaktion legt vorproduzierte Posts mit Freigabe-Status „Wartet auf Freigabe“ in die Content-Maschine, Anika nickt im Kasten oben in der Übersicht ab. Skripte: `scripts/content-maschine-db.mjs` (Content-Maschine lesen/schreiben, braucht `SUPABASE_SECRET_KEY`), `scripts/devine-social-post.mjs` (Post in Devine planen, IG + FB, 07:00).

**Regel:** Neue Regeln und Learnings, die nur einen Bereich betreffen, unten in die `wissen.md` des passenden Skills schreiben, nicht in die Memory. In der Memory bleiben nur übergreifende Regeln, Positionierung, Projektstände und Fristen.

---

## Kritische Anweisung: Diese Datei pflegen

**Wann immer Claude Änderungen am Workspace macht, MUSS Claude prüfen, ob CLAUDE.md aktualisiert werden muss.**

Nach jeder Änderung — ob Commands, Skripte, Workflows oder Strukturänderungen — frage:

1. Fügt diese Änderung neue Funktionalität hinzu, die Benutzer kennen müssen?
2. Ändert sie die oben dokumentierte Workspace-Struktur?
3. Sollte ein neuer Command aufgelistet werden?
4. Braucht context/ neue Dateien dafür?

Falls ja, aktualisiere die entsprechenden Abschnitte. Diese Datei muss immer den aktuellen Zustand des Workspace widerspiegeln, damit zukünftige Sessions genauen Kontext haben.

**Beispiele für Änderungen, die CLAUDE.md-Updates erfordern:**

- Neuen Slash-Command hinzufügen → im Commands-Abschnitt ergänzen
- Neuen Output-Typ erstellen → in Workspace-Struktur dokumentieren oder Abschnitt erstellen
- Skript hinzufügen → Zweck und Verwendung dokumentieren
- Workflow-Patterns ändern → entsprechende Dokumentation aktualisieren

---

## Für Benutzer, die dieses Template herunterladen

Um diesen Workspace an deine eigenen Bedürfnisse anzupassen, fülle deine Kontext-Dokumente in `context/` aus und passe sie nach Bedarf an. Verwende dann `/create-plan` zum Planen und `/implement` zum Umsetzen struktureller Änderungen. So bleibt alles synchron — besonders CLAUDE.md, die immer den aktuellen Zustand des Workspace widerspiegeln muss.

---

## Session-Workflow

1. **Start**: `/prime` ausführen, um Kontext zu laden
2. **Arbeiten**: Commands verwenden oder Claude direkt mit Aufgaben beauftragen
3. **Änderungen planen**: `/create-plan` vor größeren Ergänzungen verwenden
4. **Umsetzen**: `/implement` zum Ausführen von Plänen verwenden
5. **Pflegen**: Claude aktualisiert CLAUDE.md und context/ während sich der Workspace weiterentwickelt

---

## Notizen

- Kontext minimal aber ausreichend halten — kein Bloat
- Pläne in `plans/` mit datierten Dateinamen für die Historie
- Outputs nach Typ/Zweck in `outputs/` organisiert
- Referenzmaterialien in `reference/` zur Wiederverwendung
