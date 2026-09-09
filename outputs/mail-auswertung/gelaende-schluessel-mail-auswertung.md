# Mail-Auswertung — Funnel „Gelände-Schlüssel"

Monatliche Übersicht der 15 Workflow-Mails (Tag 1 … Tag 15): Empfänger, Öffnungsrate, Klickrate.

**So läuft's:** Am Monatsanfang erinnert dich Claude automatisch. Du machst pro Mail einen Screenshot des Statistik-Panels (Reiter „Statistiken": *Gesamt* / *Geöffnet %* / *Geklickt %*) oder liest die Zahlen durch. Claude trägt sie hier ein und rechnet den Monatswert aus.

> Hinweis: Ein vollautomatischer Abruf ist bei Devine nicht möglich (Statistiken nur im eingeloggten Browser, kein API-Zugang, Oberfläche in Fremd-Fenstern). Daher der kurze Screenshot-Schritt. Alles danach übernimmt Claude.

---

## Wichtig: Devine zeigt immer „all time"

Devine hat keinen Zeitraum-Filter für die Statistik einer Workflow-Mail. Die angezeigten Zahlen sind also immer **kumuliert seit Start des Funnels**, nicht die des letzten Monats.

Deshalb werden hier pro Monat zwei Dinge festgehalten:

1. **Stand (kumuliert)** = das, was im Screenshot steht. Genau so wie abgelesen.
2. **Monatswert (berechnet)** = die Differenz zum Vormonats-Stand. Das ist die Zahl, die zeigt, wie die Mail in diesem Monat wirklich gelaufen ist.

So rechnet Claude:

```
Öffnungen kumuliert = Empfänger kumuliert × Geöffnet %
Klicks kumuliert    = Empfänger kumuliert × Geklickt %

Neu im Monat   = Empfänger kum. (jetzt) − Empfänger kum. (Vormonat)
Öffnungen Monat = Öffnungen kum. (jetzt) − Öffnungen kum. (Vormonat)
Klicks Monat    = Klicks kum. (jetzt)    − Klicks kum. (Vormonat)

Öffnungsrate Monat = Öffnungen Monat / Neu im Monat
Klickrate Monat    = Klicks Monat    / Neu im Monat
```

Zwei Einschränkungen, die du kennen solltest:

Wenn jemand eine Mail aus dem Vormonat erst jetzt öffnet, landet diese Öffnung im aktuellen Monat, obwohl die Person schon vorher Empfängerin war. Der Monatswert kann dadurch leicht zu hoch wirken. Bei sehr wenigen neuen Empfängerinnen in einem Monat kann die berechnete Rate sogar über 100 % rutschen. Falls das passiert, markiert Claude die Zeile mit ⚠️, statt eine unsinnige Zahl hinzuschreiben.

Und weil Devine die Prozente gerundet anzeigt, sind die absoluten Öffnungs- und Klickzahlen auf ein bis zwei Kontakte genau, nicht exakt. Für den Trend reicht das völlig.

---

## Strukturänderung 18.08.2026: Mail 2 gelöscht, Nummerierung angepasst

Mail 2 (Umsetzungsdeal gesehen? + OB) wurde aus dem Funnel gelöscht. Mail 1 bleibt unverändert mit ihren ursprünglichen Statistiken. Alle folgenden Mails rücken um einen Tag vor. Der Funnel hat damit jetzt **14 statt 15 Mails**.

---

## Basis-Stand 03.08.2026 (kumuliert, all time) — Nummerierung ab 18.08.2026

Erster Snapshot. Hier gibt es noch keinen Monatswert, weil der Vergleichswert fehlt. Ab der nächsten Erhebung rechnet Claude die Monatswerte aus.

| Mail | Thema | Zweck | Empfänger kum. | Geöffnet % kum. | Geklickt % kum. | Klicks abs. | Käufe |
|------|-------|-------|----------------|-----------------|-----------------|-------------|-------|
| Tag 1 | Kurszugang + Videotraining | Zugang / Service | 108 | 78,70 % | 41,67 % | 45 | — |
| Tag 2 | Aha Moment mitgeben + OB | Mehrwert + Order Bump (Audiotraining 17 €) | 87 | 49,43 % | 9,20 % | 8 | 0 |
| Tag 3 | Losreißen, Sicherheit geben + OB | Mehrwert + Order Bump (Videoreihe 27 €) | 84 | 53,57 % | 8,33 % | 7 | **1** (27 €) |
| Tag 4 | Vorankommen + Upsell | Upsell „sicher meistern" 72h | 97 | 49,48 % | 2,06 % | 2 | **1** (99 €) |
| Tag 5 | Geschichte + Upsell | Upsell „sicher meistern" 48h | 75 | 44,00 % | 0,00 % | 0 | 0 |
| Tag 6 | Geschichte + Upsell | Upsell „sicher meistern" 24h | 71 | 42,25 % | 4,23 % | 3 | 0 |
| Tag 7 | Kopfkino 1 (Testimonial + Details) | Upsell „Kopfkino" 72h | 69 | 46,38 % | 0,00 % | 0 | 0 |
| Tag 8 | Kopfkino 2 (Testimonial + Erinnerung) | Upsell „Kopfkino" 48h | 61 | 47,54 % | 0,00 % | 0 | 0 |
| Tag 9 | Kopfkino 3 (Mehrwert + Erinnerung) | Upsell „Kopfkino" 24h | 50 | 48,00 % | 2,00 % | 1 | 0 |
| Tag 10 | Video Trageerschöpfung | Mehrwert / Überleitung | 43 | 53,49 % | 9,30 % | 4 | — |
| Tag 11 | Umsetzungsdeal | Hinweis (kein Verkauf) | 61 | 52,46 % | 16,39 % | 10 | — |
| Tag 12 | Geschichte + Handarbeit | Upsell „Handarbeit" 72h | 30 | 46,67 % | 6,67 % | 2 | **1** (197 €) |
| Tag 13 | Testimonial + Handarbeit | Upsell „Handarbeit" 48h | 17 | 64,71 % | 0,00 % | 0 | 0 |
| Tag 14 | FAQ + Handarbeit | Upsell „Handarbeit" 24h | 11 | 36,36 % | 0,00 % | 0 | 0 |

*(Käufe von Anika gemeldet (03.08.2026): Tag 3, Tag 4 und Tag 12. Tag 3 und Tag 4 war dieselbe Person, Tag 12 eine zweite. Also 3 Käufe von 2 Käuferinnen.)*

> **Ergänzung September 2026 — Traumteam-Attribution über Funnel:**
> Katrin Stephens (Tag-12-Käuferin, Handarbeit 197€) kam am 28.08.2026 über den Webinar-Link aus der Gelände-Schlüssel-Willkommens-Sequenz (UTM: `utm_campaign=gelaendeschluessel-welcome`) ins Traumteam-Webinar, sah es zu 80 %, klickte das Webinar-Angebot und kaufte Traumteam (697€) am 29.08.2026. Der Funnel hat also über die Handarbeit-Mail (Tag 12) hinaus eine größere Folgeinvestition ausgelöst.
> Annette Ziutelis (Käuferin aus ThriveCart 14.08.) kam ohne UTM direkt über die Anmeldungsseite — kein Funnel-Zusammenhang.

**Zur sinkenden Empfängerzahl:** Die Zahlen werden von Tag 1 nach hinten kleiner, weil Anika die Mails nach und nach in den Workflow gebaut hat. Die späteren Mails sind also schlicht kürzer im Einsatz. Das ist kein Ausstieg von Kontakten und kein Fehler. Wichtig für die Auswertung: Die Empfängerzahlen der einzelnen Tage sind untereinander nicht direkt vergleichbar. Die Öffnungs- und Klickraten dagegen schon, weil die sich jeweils auf die eigene Empfängerzahl beziehen.

---

## Beobachtungen zum Basis-Stand (03.08.2026)

**Die Öffnungsraten sind durchweg stark.** Tag 1 liegt bei 78,70 %, was für eine Zugangsmail zu erwarten ist. Ab Tag 2 pendelt sich alles zwischen 42 % und 54 % ein und bleibt über die kompletten zwei Wochen dort. Kein schleichender Abfall, keine Ermüdung. Die Leute lesen bis zum Schluss mit.

**Zu den fünf Nullen bei den Klicks (Tag 6, 8, 9, 14, 15): kein Tracking-Problem.** Erste Einschätzung war, das könne keine Zufallsschwankung mehr sein. Das war falsch gerechnet. Wenn die wahre Klickrate einer Upsell-Mail bei 1 bis 2 % liegt (was die Nachbarmails zeigen: Tag 10 = 2,00 %, Tag 5 = 2,06 %), dann ist eine glatte Null bei 60 bis 75 Empfängern völlig normal. Bei 69 Empfängern und 1,5 % wahrer Rate liegt die Wahrscheinlichkeit für null Klicks bei rund 35 %. Anika hat außerdem bestätigt, dass Links und Tracking überall aktiv sind und sie durchgehend Buttons mit darunterliegendem Timer verwendet. Die Nullen sind also echt, nicht kaputt. Sie sagen nichts über Technik und alles über die Nachfrage.

**Klickraten nur innerhalb gleicher Mail-Zwecke vergleichen.** Tag 12 „Umsetzungsdeal" hat mit 16,39 % die höchste Klickrate nach Tag 1, verkauft dort aber nichts, sondern weist nur auf etwas hin (Anika, 03.08.2026). Ein Hinweis-Link hat naturgemäß weniger Hürde als ein Angebots-Link. Tag 12 taugt deshalb nicht als Maßstab für die Verkaufsmails.

**Nur die Angebots-Mails gegeneinander gestellt:**

| Mail | Angebot | Geklickt |
|------|---------|----------|
| Tag 2 | Order Bump | 9,20 % |
| Tag 3 | Order Bump | 8,33 % |
| Tag 6 | Upsell | 4,23 % |
| Tag 4 | Upsell | 2,06 % |
| Tag 5 | Upsell | 0,00 % |

Die Order-Bump-Mails liegen geschlossen zwischen 8 und 9 %, die Upsell-Mails deutlich darunter.

**Die drei Upsell-Strecken im Vergleich:**

| Strecke | Angebot | Sendungen | Klicks | Käufe | Klick → Kauf | Umsatz |
|---------|---------|-----------|--------|-------|--------------|--------|
| Tag 2–3 | Order Bumps (17 / 27 €) | 171 | 15 | 1 | 7 % | 27 € |
| Tag 4–6 | Gelände sicher meistern (99 €) | 243 | 5 | 1 | 20 % | 99 € |
| Tag 7–9 | Schluss mit Kopfkino (97 €) | 180 | 1 | 0 | 0 % | 0 € |
| Tag 12–14 | Handarbeit (197 €) | 58 | 2 | 1 | 50 % | 197 € |

**Gesamt: 3 Käufe von 2 verschiedenen Personen, 323 € Umsatz** (Anika, 03.08.2026):

- **Käuferin A:** Videoreihe 27 € (Tag 3) **und** Gelände sicher meistern 99 € (Tag 4) = 126 €
- **Käuferin B:** Handarbeit 197 € (Tag 12)

Bezogen auf die rund 108 Käuferinnen des Gelände-Schlüssels haben also nur etwa 1,9 % über die Mailstrecke noch etwas nachgekauft. Die Reichweite der Sequenz ist damit schmaler als die reine Kaufzahl vermuten lässt.

**Käuferin A ist der interessante Fall:** Sie hat an Tag 4 für 27 € gekauft und direkt an Tag 5 für 99 € nachgelegt. Der kleine Kauf hat den größeren nicht ersetzt, sondern ihm den Weg gebahnt. Das ist die Wertleiter, wie sie funktionieren soll, und es spricht dafür, den günstigen Order Bump vor dem teuren Upsell zu belassen. Ein einzelner Fall ist allerdings kein Beleg, sondern nur ein Hinweis, den die nächsten Monate bestätigen müssen.

**Die Klickrate misst Neugier, nicht Kaufabsicht.** Die Order-Bump-Mails haben mit 6 bis 9 % die mit Abstand besten Klickraten, aber nur einer von 21 Klicks wurde ein Kauf. Bei den teuren Upsells ist es genau umgekehrt: kaum jemand klickt, aber wer klickt, kauft auffällig oft (Tag 13: 2 Klicks, 1 Kauf). Ein 17-Euro-Angebot lädt zum neugierigen Klicken ein, ein 197-Euro-Angebot klickt nur an, wer es ernst meint. Deshalb taugt die Klickrate nicht als Erfolgsmaß der Sequenz und Klickraten verschiedener Preisklassen dürfen nicht gegeneinander gestellt werden.

**Die Kopfkino-Strecke ist die schwächste.** Drei Mails (jetzt Tag 7–9), 180 Sendungen, insgesamt ein einziger Klick und kein Kauf. Die Mails werden dabei mit 46 bis 48 % ganz normal geöffnet. Gelesen wird also, nur das Thema zündet an dieser Stelle nicht. Zum Vergleich: Die Handarbeit-Strecke hat bei nur 58 Sendungen schon einen Kauf erzielt, obwohl sie mit 197 € doppelt so teuer ist.

**Zur Einordnung der Handarbeit-Strecke:** Tag 12 bis 14 (früher Tag 13–15) haben mit 30, 17 und 11 Empfängern noch sehr kleine Fallzahlen. Der eine Kauf ist ein gutes Zeichen, aber noch kein belastbarer Trend. Das klärt sich in den nächsten Monaten.

**Kleine Fallzahlen beachten:** Tag 12 (30), Tag 13 (17) und Tag 14 (11) haben so wenige Empfänger, dass ein einzelner Klick die Prozentzahl stark bewegt. Diese drei Zeilen werden erst in den kommenden Monaten aussagekräftig.

---

## Wie diese Zahlen zu bewerten sind

**Es gibt keine verlässliche externe Benchmark** für eine Upsell-Mailstrecke an Käuferinnen eines günstigen Mini-Kurses im deutschen Pferdemarkt. Grobe Orientierung aus allgemeinen Mustern: solche Nachfass-Strecken liegen meist im niedrigen einstelligen Prozentbereich, etwa 1 bis 3 % Kaufrate. Das ist eine Hausnummer, keine Messung, und taugt nicht als Entscheidungsgrundlage.

**Die maßgebliche Kennzahl ist der Umsatz pro eingetretener Person, nicht die Klickrate.** Sie lässt sich direkt gegen die Anzeigenkosten rechnen (aktueller Champion: rund 12,38 € pro Kauf).

| Strecke | Eingetreten | Käufe | Kaufrate | Umsatz pro Person |
|---------|-------------|-------|----------|-------------------|
| Handarbeit / Tag 12–14 (197 €) | 30 | 1 | 3,3 % | 6,57 € |
| Gelände sicher meistern / Tag 4–6 (99 €) | 97 | 1 | 1,0 % | 1,02 € |
| Order Bumps / Tag 2–3 (17 / 27 €) | 87 | 1 | 1,1 % | 0,31 € |
| Schluss mit Kopfkino / Tag 7–9 (97 €) | 69 | 0 | 0 % | 0 € |

**Gesamt über alle Strecken: 323 € Zusatzumsatz bei rund 108 Käuferinnen, also etwa 3 € pro Käuferin.** Gegen einen Anzeigenpreis von rund 12,38 € pro Kauf gerechnet trägt die Mailstrecke damit schon jetzt rund ein Viertel der Akquisekosten mit.

*(„Eingetreten" = Empfängerzahl der jeweils ersten Mail der Strecke. Käufe, die direkt auf der Checkout-Upsell-Seite passiert sind, sind hier nicht enthalten.)*

**Nicht auf monatliche Schwankungen reagieren.** Bei 30 bis 97 Personen pro Strecke ist eine Kaufrate von 1 % statistisch nicht von 3 % zu unterscheiden. Ein einziger zusätzlicher Kauf verschiebt die Zahl um mehrere Punkte. Mails umzuschreiben, weil eine Rate gefallen ist, heißt Rauschen hinterherlaufen (gleiche Logik wie beim vermeintlichen „Abschmieren" der Anzeigen). Erst wenn eine Strecke einige hundert Personen gesehen hat, wird die Kaufrate belastbar.

**Was schon jetzt aussagekräftig ist, ist die Größenordnung zwischen den Strecken.** Kopfkino: 180 Sendungen, 1 Klick, 0 Käufe. Handarbeit: 58 Sendungen, 2 Klicks, 1 Kauf. Das ist kein Feinschliff-Unterschied.

---

## August 2026 — Monatswerte (CSV-Auswertung, 01.–31.08.2026)

> Methodik: Jede Mail wurde als CSV exportiert (Kontakt-Export aus Devine Funnels). Gefiltert nach „Updated At" im August 2026. Anika-Testadresse (anikawesse@...) ausgeschlossen. „Empfänger" = alle Kontakte mit Aktivität in August (Zugestellt + Geöffnet + Geklickt + Abmeldung). „Geöffnet" schließt Geklickt ein (wer geklickt hat, hat auch geöffnet).

| Mail | Thema | Empfänger | Geöffnet abs. | Geöffnet % | Geklickt abs. | Geklickt % | Käufe |
|------|-------|-----------|---------------|------------|---------------|------------|-------|
| Tag 1 | Kurszugang + Deal | 63 | 41 | 65,1 % | 20 | 31,7 % | — |
| Tag 2 | Aha Moment + OB | 65 | 34 | 52,3 % | 11 | 16,9 % | — |
| Tag 3 | Losreißen + OB | 67 | 33 | 49,3 % | 10 | 14,9 % | — |
| Tag 4 | Vorankommen + Upsell | 71 | 30 | 42,3 % | 4 | 5,6 % | **1** (99 €) |
| Tag 5 | Geschichte + Upsell | 67 | 24 | 35,8 % | 2 | 3,0 % | — |
| Tag 6 | Geschichte + Upsell | 65 | 29 | 44,6 % | 2 | 3,1 % | — |
| Tag 7 | Kopfkino 1 | 65 | 28 | 43,1 % | 2 | 3,1 % | **1** (97 €) |
| Tag 8 | Kopfkino 2 | 66 | 25 | 37,9 % | 0 | 0 % | — |
| Tag 9 | Kopfkino 3 | 71 | 36 | 50,7 % | 0 | 0 % | — |
| Tag 10 | Video Trageerschöpfung | 77 | 29 | 37,7 % | 3 | 3,9 % | — |
| Tag 11 | Umsetzungsdeal | 83 | 33 | 39,8 % | 7 | 8,4 % | — |
| Tag 12 | Geschichte + Handarbeit | 85 | 31 | 36,5 % | 3 | 3,5 % | — |
| Tag 13 | Testimonial + Handarbeit | 89 | 33 | 37,1 % | 2 | 2,2 % | — |
| Tag 14 | FAQ + Handarbeit | 99 | 34 | 34,3 % | 0 | 0 % | — |
| Tag 15 | Webinareinladung | 86 | 31 | 36,0 % | 9 | 10,5 % | **1** (697 €) |

---

## September 2026 — Snapshot (all-time, Startwert für Oktober-Delta)

> All-time kumulierte Zahlen aus den Devine-Screenshots (Stand ~04.09.2026). Diese Zahlen dienen als Baseline: Im Oktober wird der neue Snapshot gemacht und die Differenz ergibt die September-Monatswerte.

| Mail | Thema | Zugestellt | Geöffnet abs. | Geöffnet % | Geklickt abs. | Geklickt % |
|------|-------|-----------|--------------|------------|--------------|------------|
| Tag 1 | Kurszugang + Deal | 64 | 46 | 71,9 % | 24 | 37,5 % |
| Tag 2 | Aha Moment + OB | 66 | 35 | 53,0 % | 11 | 16,7 % |
| Tag 3 | Losreißen + OB | 69 | 35 | 50,7 % | 11 | 15,9 % |
| Tag 4 | Vorankommen + Upsell | 73 | 36 | 49,3 % | 4 | 5,5 % |
| Tag 5 | Geschichte + Upsell | 74 | 30 | 40,5 % | 2 | 2,7 % |
| Tag 6 | Geschichte + Upsell | 74 | 35 | 47,3 % | 3 | 4,1 % |
| Tag 7 | Kopfkino 1 | 78 | 34 | 43,6 % | 3 | 3,8 % |
| Tag 8 | Kopfkino 2 | 78 | 29 | 37,2 % | 1 | 1,3 % |
| Tag 9 | Kopfkino 3 | 80 | 43 | 53,8 % | 1 | 1,3 % |
| Tag 10 | Video Trageerschöpfung | 83 | 31 | 37,3 % | 3 | 3,6 % |
| Tag 11 | Umsetzungsdeal | 88 | 37 | 42,0 % | 10 | 11,4 % |
| Tag 12 | Geschichte + Handarbeit | 89 | 34 | 38,2 % | 4 | 4,5 % |
| Tag 13 | Testimonial + Handarbeit | 95 | 37 | 38,9 % | 3 | 3,2 % |
| Tag 14 | FAQ + Handarbeit | 105 | 39 | 37,1 % | 1 | 1,0 % |
| Tag 15 | Webinareinladung | 93 | 35 | 37,6 % | 10 | 10,8 % |

### Käufe August 2026 — aus ThriveCart (Funnel-Attribution)

**Neue GS-Käufer im August (= neue Funnel-Eintritte):** 79 Käufe, 2.133 €

**Tag 4–6 (Gelände sicher meistern 99 €):**
- vinurfarm@gmail.com (02.08.) → Upsell-Typ, direkt aus Funnel ✓

**Tag 7–9 (Schluss mit Kopfkino 97 €):**
- t.tomczak@gmx.de (05.08.) → GS-Kauf 29.07. = Tag 7 danach, Timing exakt ✓
- karin.loeschenberger@gmx.net (26.08.) → GS-Kauf 20.07. = Tag 37 danach → nicht Funnel

**Tag 12–14 (Handarbeit 197 €): 0 Käufe**

**Tag 15 (Webinareinladung → Traumteam 697 €):**
- Katrin Stephens (29.08.) → UTM `utm_campaign=gelaendeschluessel-welcome` bestätigt, 80 % Webinar gesehen, Angebot geklickt → Funnel-Attribution gesichert ✓

**Gesamt attributierbare Funnel-Käufe August: 3 Käufe, 893 € Umsatz**

| Strecke | Kauf | Umsatz |
|---------|------|--------|
| Tag 4–6 Gelände sicher meistern | 1 | 99 € |
| Tag 7–9 Schluss mit Kopfkino | 1 | 97 € |
| Tag 15 Traumteam via Webinar-Link | 1 | 697 € |

### Beobachtungen August 2026

**Öffnungsraten stabil.** Tag 1 bei 71,9 % (von 78,7 % im Basis-Stand — etwas schwächer, aber noch kein Trend bei kleinen Fallzahlen). Die Mittelmails pendeln zwischen 37 % und 54 %, Tag 9 mit 53,8 % auffällig stark. Keine erkennbare Ermüdung bis Tag 14.

**Tag 15 (Webinareinladung) performt wie Tag 11 (Umsetzungsdeal).** Beide haben ~11 % Klickrate, beide sind Content/Hinweis-Mails ohne direktes Produktangebot. Der Webinar-Link zieht — und hat im August einen 697-€-Kauf ausgelöst, den ohne Funnel-Mail keiner mitbekommt.

**Kopfkino bleibt das schwächste Segment.** Tag 7–9: je 3, 1, 1 Klicks bei 78–80 Zugestellten. Einer dieser 5 Klicks führte zu einem Kauf (t.tomczak) — das ist eine Konvertierung von 20 %, aber bei nur 5 Klicks statisch nicht belastbar.

**Handarbeit-Strecke (Tag 12–14): 0 Käufe im August.** Die Strecke erreicht weiterhin die spätesten (ältesten) Käuferinnen und hat kleine absolute Klickzahlen (4, 3, 1). Noch kein Trend ableitbar.

**Order-Bump-Mails (Tag 2–3) mit 15,9–16,7 % Klickrate** weiterhin deutlich über den Upsell-Mails — passt zum Basis-Stand-Muster.

---

## Stand 04.09.2026 (kumuliert, all time)

*(Maschinenlesbarer Block für das Google-Sheet-Script. Menschenlesbare August-Monatswerte stehen im Abschnitt darüber.)*

| Mail | Thema | Zweck | Empfänger kum. | Geöffnet % kum. | Geklickt % kum. | Klicks abs. | Käufe |
|------|-------|-------|----------------|-----------------|-----------------|-------------|-------|
| Tag 1 | Kurszugang + Deal | Zugang / Service | 64 | 71,90 % | 37,50 % | 24 | — |
| Tag 2 | Aha Moment + OB | Mehrwert + Order Bump | 67 | 53,00 % | 16,70 % | 11 | — |
| Tag 3 | Losreißen + OB | Mehrwert + Order Bump | 69 | 50,70 % | 15,90 % | 11 | **1** (27 €) |
| Tag 4 | Vorankommen + Upsell | Upsell sicher meistern 72h | 73 | 49,30 % | 5,50 % | 4 | **1** (99 €) |
| Tag 5 | Geschichte + Upsell | Upsell sicher meistern 48h | 74 | 40,50 % | 2,70 % | 2 | — |
| Tag 6 | Geschichte + Upsell | Upsell sicher meistern 24h | 74 | 47,30 % | 4,10 % | 3 | — |
| Tag 7 | Kopfkino 1 | Upsell Kopfkino 72h | 78 | 43,60 % | 3,80 % | 3 | **1** (97 €) |
| Tag 8 | Kopfkino 2 | Upsell Kopfkino 48h | 78 | 37,20 % | 1,30 % | 1 | — |
| Tag 9 | Kopfkino 3 | Upsell Kopfkino 24h | 80 | 53,80 % | 1,30 % | 1 | — |
| Tag 10 | Video Trageerschöpfung | Mehrwert / Überleitung | 83 | 37,30 % | 3,60 % | 3 | — |
| Tag 11 | Umsetzungsdeal | Hinweis (kein Verkauf) | 88 | 42,00 % | 11,40 % | 10 | — |
| Tag 12 | Geschichte + Handarbeit | Upsell Handarbeit 72h | 89 | 38,20 % | 4,50 % | 4 | **1** (197 €) |
| Tag 13 | Testimonial + Handarbeit | Upsell Handarbeit 48h | 95 | 38,90 % | 3,20 % | 3 | — |
| Tag 14 | FAQ + Handarbeit | Upsell Handarbeit 24h | 105 | 37,10 % | 1,00 % | 1 | — |
| Tag 15 | Webinareinladung | Webinar / Traumteam | 93 | 37,60 % | 10,80 % | 10 | **1** (697 €) |

---

## Trend-Notizen

*(Ab der nächsten Erhebung im September trägt Claude hier ein, welche Mails sich verbessern oder verschlechtern, jeweils auf Basis der berechneten Monatswerte.)*
