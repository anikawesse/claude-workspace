---
name: humanizer
description: Verwende diesen Skill, wenn der Nutzer einen KI-generierten Text menschlicher klingen lassen möchte. Trigger-Phrasen sind „humanisieren", „menschlicher machen", „klingt zu KI", „klingt robotisch", „natürlicher umschreiben", „KI-Muster entfernen", „humanize", „make it sound human" oder ähnliches. Auch verwenden, wenn der Nutzer einen Text einreicht und sagt „klingt noch nicht nach mir", „das klingt generiert" oder „mach das authentischer".
---

# Humanizer

## Übersicht

Dieser Skill verwandelt KI-generierte Texte in authentisch klingende, menschliche Texte. Er arbeitet intern in drei Schritten, liefert dem Nutzer aber nur das Endergebnis. Die Sprache des Outputs richtet sich nach der Sprache des Inputs.

## Wann verwenden

- Der Nutzer hat einen Text, der „zu KI" klingt
- Der Nutzer möchte einen generierten Text natürlicher machen
- Der Nutzer sagt „humanisieren", „menschlicher", „authentischer", „klingt robotisch"
- Der Nutzer reicht einen Text ein mit dem Wunsch, KI-Muster zu entfernen

## Die Methode

Arbeite den Text intern durch drei Schritte. Zeige dem Nutzer keine Zwischenergebnisse – nur den fertigen Text am Ende.

### Schritt 1: Säubern

Prüfe den Text gegen die Blacklists und eliminiere alle Treffer.

**Verbotene Übergangs- und Betonungswörter** (komplett vermeiden oder max. 1× pro Dokument):
Zusätzlich, Zudem, Darüber hinaus, Des Weiteren, Anschließend, In der Folge, Währenddessen, Unterdessen, Essenziell, Entscheidend, Zentral, Ausschlaggebend, Schlüssel- (als Adjektiv), Vital, Unverzichtbar, Signifikant, Erheblich, Additionally, Moreover, Furthermore, Subsequently, Meanwhile, Crucial, Pivotal, Key (als Adjektiv), Vital, Significant

**Verbotene abstrakte Nomen:**
Landschaft (abstrakt), Geflecht, Teppich (metaphorisch), Zeugnis (metaphorisch), Wechselspiel, Zusammenspiel, Feinheiten, Komplexitäten, Einblicke (vage), Synergien, Paradigma, Tapestry, Testament (metaphorisch), Interplay, Intricacies, Insights (vage)

**Verbotene Verben:**
Eintauchen, Unterstreichen, Hervorheben, Beleuchten, Präsentieren, Zur Schau stellen, Besticht durch, Ernten (metaphorisch), Fördern, Vorantreiben, Pflegen, Kultivieren (übertragen), Stärken, Untermauern, Optimieren, Abstimmen auf, Im Einklang mit, Resonieren mit, Anklang finden, Heben, Bereichern, Revolutionieren, Neu denken, Neu definieren, Nutzen/Mobilisieren (im Buzzword-Sinne), Entfesseln, Ausschöpfen, Delve, Underscore, Highlight (als Verb), Showcase, Boasts, Garner, Fostering, Cultivating (übertragen), Bolstered, Enhance, Align with, Resonate with, Elevate, Revolutionize, Reimagine, Leverage, Unleash, Harness

**Verbotene Adjektive:**
Vibrant, Rich (übertragen), Profound, Groundbreaking (lose), Renowned, Meticulous/meticulously, Enduring, Diverse array, Intricate, Tiefgreifend, Wegweisend (lose), Bahnbrechend (lose)

**Verbotene Phrasen und Muster:**
- „Dient als" / „Fungiert als" / „Serves as" / „Stands as"
- „Ist ein Beweis für" / „Is a testament to"
- „Spielt eine zentrale/wichtige/entscheidende Rolle" / „Plays a vital/significant role"
- „Prägt die Zukunft" / „Setzt neue Maßstäbe"
- „Abschließend lässt sich festhalten" / „Zusammenfassend kann man sagen"
- „Nicht nur X, sondern auch Y" (wenn rein rhetorisch)
- „Es lässt sich nicht leugnen" / „There's no denying"
- „In der heutigen Zeit" / „In der modernen Welt"
- Alle „-ing/-end"-Anhängsel am Satzende, die nur Bedeutung vortäuschen (z.B. „...was die Bedeutung unterstreicht", „...highlighting its importance")
- Formelhafte Abschnitte: „Herausforderungen und Ausblick", „Warum das wichtig ist", „Fazit"
- Einleitungssätze, die die Frage wiederholen, bevor sie beantwortet wird
- Schlusssätze, die alles nochmal zusammenfassen, ohne neue Info zu liefern

**Ersetzungsregel:** Ersetze nie ein verbotenes Wort durch ein anderes von der Liste. Verwende stattdessen einfache, direkte Formulierungen. Wenn ein Satz nur aus Bedeutungs-Behauptung besteht („Dies unterstreicht die wachsende Bedeutung von X"), lösche ihn komplett.

### Schritt 2: Rhythmus & Stimme

**Satzlängen variieren:**
- Streue bewusst kurze Sätze ein (3–8 Wörter). Mindestens 2 pro Absatz.
- Splitte Sätze über 20 Wörter in zwei oder drei kürzere.
- Ziel: Durchschnittliche Satzlänge 10–15 Wörter.
- Vermeide, dass drei aufeinanderfolgende Sätze ähnliche Länge haben.

**Einschübe reduzieren:**
- Entferne Relativsatz-Kaskaden. Wenn der Satz ohne den Einschub funktioniert und der Einschub keine echte Info liefert: raus damit.
- Maximal ein Einschub pro Satz.

**Sprachniveau: 5. Klasse, aber für Erwachsene angemessen.**
- Verwende einfache, alltägliche Wörter. Wenn ein Wort ein einfacheres Synonym hat, nimm das einfachere.
- Keine Fachbegriffe, es sei denn, sie sind im Kontext unersetzlich. Dann kurz erklären.
- Kurze Sätze bevorzugen. Ein Gedanke pro Satz.
- Kein akademischer Satzbau, keine verschachtelten Konstruktionen.
- Aber: Nicht herablassend schreiben. Der Leser ist ein kluger Erwachsener, der klare Sprache schätzt – kein Kind.

**Ton natürlicher machen:**
- Schreibe, als würdest du einem Freund bei einem Kaffee etwas erklären.
- Ersetze Nominalisierungen durch Verben (z.B. „die Übernahme von Datenanalysen" → „wenn KI Daten analysiert").
- Ersetze abstrakte Aussagen durch konkrete Szenarien, wo möglich.
- Keine Gedankenstriche (—) zur Emphase. Punkte, Kommas oder Semikolons verwenden.
- Keine Emojis.

**Absatzstruktur aufbrechen:**
- Absätze dürfen unterschiedlich lang sein.
- Nicht jeder Absatz braucht den gleichen Aufbau.

### Schritt 3: Finaler Check

Lies den gesamten Text nochmal und prüfe:

1. **Blacklist-Nachkontrolle:** Sind durch Schritt 2 neue verbotene Wörter reingerutscht?
2. **Laut-Vorlesen-Test:** Klingt ein Satz holprig oder unnatürlich? → Umschreiben.
3. **Monotonie-Check:** Gibt es noch drei oder mehr aufeinanderfolgende Sätze mit ähnlicher Länge? → Variieren.
4. **Bedeutungs-Behauptungs-Check:** Gibt es noch Sätze, die dem Leser sagen, wie wichtig etwas ist, statt es zu zeigen? → Streichen oder durch konkretes Beispiel ersetzen.
5. **Struktur-Check:** Hat der Text noch formelhafte Abschnitte (Einleitung, die die Frage wiederholt; Fazit, das alles nochmal sagt)? → Entfernen oder in echte Aussagen umwandeln.

## Output

Liefere nur den fertigen Text. Keine Erklärungen, keine Änderungslogs, keine Kommentare. Einfach den umgeschriebenen Text.

## Häufige Fehler

**Verbotenes Wort durch Synonym von der gleichen Liste ersetzen.** „Fungiert als" wird zu „dient als" – beides verboten. Stattdessen den Satz komplett neu formulieren.

**Sätze kürzen, aber Rhythmus nicht variieren.** Alle Sätze auf 12–15 Wörter zu trimmen erzeugt eine neue Art von Monotonie. Das Ziel ist Abwechslung: kurz, lang, mittel, kurz.

**Tonalität überkompensieren.** Der Text soll natürlich klingen, nicht wie ein Blogpost mit „Hey, Leute!" und Ausrufezeichen. Sachlich und klar, aber warm und direkt.

**Inhalt verändern.** Der Skill ändert Stil und Struktur, nicht den Inhalt. Keine Fakten hinzufügen, keine Aussagen entfernen, keine Meinungen einbauen, die nicht im Original stehen.

**Zu viel kürzen.** Das Ziel ist nicht „kürzer", sondern „menschlicher". Manchmal braucht ein Gedanke mehr Worte, um natürlich zu klingen – nicht weniger.
