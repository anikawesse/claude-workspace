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

## Basis-Stand 03.08.2026 (kumuliert, all time)

Erster Snapshot. Hier gibt es noch keinen Monatswert, weil der Vergleichswert fehlt. Ab der nächsten Erhebung im September rechnet Claude die Monatswerte aus.

| Mail | Thema | Zweck | Empfänger kum. | Geöffnet % kum. | Geklickt % kum. | Klicks abs. | Käufe |
|------|-------|-------|----------------|-----------------|-----------------|-------------|-------|
| Tag 1 | Kurszugang + Videotraining | Zugang / Service | 108 | 78,70 % | 41,67 % | 45 | — |
| Tag 2 | Umsetzungsdeal gesehen? + OB | Mehrwert + Order Bump | 93 | 50,54 % | 6,45 % | 6 | 0 |
| Tag 3 | Aha Moment mitgeben + OB | Mehrwert + Order Bump (Audiotraining 17 €) | 87 | 49,43 % | 9,20 % | 8 | 0 |
| Tag 4 | Losreißen, Sicherheit geben + OB | Mehrwert + Order Bump (Videoreihe 27 €) | 84 | 53,57 % | 8,33 % | 7 | **1** (27 €) |
| Tag 5 | Vorankommen + Upsell | Upsell „sicher meistern" 72h | 97 | 49,48 % | 2,06 % | 2 | **1** (99 €) |
| Tag 6 | Geschichte + Upsell | Upsell „sicher meistern" 48h | 75 | 44,00 % | 0,00 % | 0 | 0 |
| Tag 7 | Geschichte + Upsell | Upsell „sicher meistern" 24h | 71 | 42,25 % | 4,23 % | 3 | 0 |
| Tag 8 | Kopfkino 1 (Testimonial + Details) | Upsell „Kopfkino" 72h | 69 | 46,38 % | 0,00 % | 0 | 0 |
| Tag 9 | Kopfkino 2 (Testimonial + Erinnerung) | Upsell „Kopfkino" 48h | 61 | 47,54 % | 0,00 % | 0 | 0 |
| Tag 10 | Kopfkino 3 (Mehrwert + Erinnerung) | Upsell „Kopfkino" 24h | 50 | 48,00 % | 2,00 % | 1 | 0 |
| Tag 11 | Video Trageerschöpfung | Mehrwert / Überleitung | 43 | 53,49 % | 9,30 % | 4 | — |
| Tag 12 | Umsetzungsdeal | Hinweis (kein Verkauf) | 61 | 52,46 % | 16,39 % | 10 | — |
| Tag 13 | Geschichte + Handarbeit | Upsell „Handarbeit" 72h | 30 | 46,67 % | 6,67 % | 2 | **1** (197 €) |
| Tag 14 | Testimonial + Handarbeit | Upsell „Handarbeit" 48h | 17 | 64,71 % | 0,00 % | 0 | 0 |
| Tag 15 | FAQ + Handarbeit | Upsell „Handarbeit" 24h | 11 | 36,36 % | 0,00 % | 0 | 0 |

*(Spalte „Zweck" abgeleitet aus den Mail-Entwürfen in `outputs/gelaendeschluessel/` (post-purchase-mails.md, upsell-sicher-meistern-mails.md, upsell-kopfkino-mails.md, upsell-handarbeit-mails.md). Von Anika noch zu bestätigen. Spalte „Klicks abs." = Empfänger × Klickrate, wegen Rundung auf ±1 genau. Käufe von Anika gemeldet (03.08.2026): Tag 4, Tag 5 und Tag 13 je 1 Kauf. Tag 4 und Tag 5 war dieselbe Person, Tag 13 eine zweite. Also 3 Käufe von 2 Käuferinnen.)*

*(Vollständig erfasst am 03.08.2026 aus Anikas Screenshots. Der frühere Wert vom 31.07.2026, der als Tag 14 abgelegt war (100 Empfänger, 76 % geöffnet, 40 % geklickt), gehörte tatsächlich zu Tag 1. Tag 14 hat nur 17 Empfänger und kann diese Zahlen nicht gehabt haben, während Tag 1 mit 108 / 78,70 % / 41,67 % genau dazu passt. Korrigiert.)*

**Zur sinkenden Empfängerzahl:** Die Zahlen werden von Tag 1 nach hinten kleiner, weil Anika die Mails nach und nach in den Workflow gebaut hat. Die späteren Mails sind also schlicht kürzer im Einsatz. Das ist kein Ausstieg von Kontakten und kein Fehler. Wichtig für die Auswertung: Die Empfängerzahlen der einzelnen Tage sind untereinander nicht direkt vergleichbar. Die Öffnungs- und Klickraten dagegen schon, weil die sich jeweils auf die eigene Empfängerzahl beziehen.

---

## Beobachtungen zum Basis-Stand (03.08.2026)

**Die Öffnungsraten sind durchweg stark.** Tag 1 liegt bei 78,70 %, was für eine Zugangsmail zu erwarten ist. Ab Tag 2 pendelt sich alles zwischen 42 % und 54 % ein und bleibt über die kompletten zwei Wochen dort. Kein schleichender Abfall, keine Ermüdung. Die Leute lesen bis zum Schluss mit.

**Zu den fünf Nullen bei den Klicks (Tag 6, 8, 9, 14, 15): kein Tracking-Problem.** Erste Einschätzung war, das könne keine Zufallsschwankung mehr sein. Das war falsch gerechnet. Wenn die wahre Klickrate einer Upsell-Mail bei 1 bis 2 % liegt (was die Nachbarmails zeigen: Tag 10 = 2,00 %, Tag 5 = 2,06 %), dann ist eine glatte Null bei 60 bis 75 Empfängern völlig normal. Bei 69 Empfängern und 1,5 % wahrer Rate liegt die Wahrscheinlichkeit für null Klicks bei rund 35 %. Anika hat außerdem bestätigt, dass Links und Tracking überall aktiv sind und sie durchgehend Buttons mit darunterliegendem Timer verwendet. Die Nullen sind also echt, nicht kaputt. Sie sagen nichts über Technik und alles über die Nachfrage.

**Klickraten nur innerhalb gleicher Mail-Zwecke vergleichen.** Tag 12 „Umsetzungsdeal" hat mit 16,39 % die höchste Klickrate nach Tag 1, verkauft dort aber nichts, sondern weist nur auf etwas hin (Anika, 03.08.2026). Ein Hinweis-Link hat naturgemäß weniger Hürde als ein Angebots-Link. Tag 12 taugt deshalb nicht als Maßstab für die Verkaufsmails.

**Nur die Angebots-Mails gegeneinander gestellt:**

| Mail | Angebot | Geklickt |
|------|---------|----------|
| Tag 3 | Order Bump | 9,20 % |
| Tag 4 | Order Bump | 8,33 % |
| Tag 2 | Order Bump | 6,45 % |
| Tag 7 | Upsell | 4,23 % |
| Tag 5 | Upsell | 2,06 % |
| Tag 6 | Upsell | 0,00 % |

Die drei Order-Bump-Mails liegen geschlossen zwischen 6 und 9 %, die Upsell-Mails deutlich darunter.

**Die drei Upsell-Strecken im Vergleich:**

| Strecke | Angebot | Sendungen | Klicks | Käufe | Klick → Kauf | Umsatz |
|---------|---------|-----------|--------|-------|--------------|--------|
| Tag 2–4 | Order Bumps (17 / 27 €) | 264 | 21 | 1 | 5 % | 27 € |
| Tag 5–7 | Gelände sicher meistern (99 €) | 243 | 5 | 1 | 20 % | 99 € |
| Tag 8–10 | Schluss mit Kopfkino (97 €) | 180 | 1 | 0 | 0 % | 0 € |
| Tag 13–15 | Handarbeit (197 €) | 58 | 2 | 1 | 50 % | 197 € |

**Gesamt: 3 Käufe von 2 verschiedenen Personen, 323 € Umsatz** (Anika, 03.08.2026):

- **Käuferin A:** Videoreihe 27 € (Tag 4) **und** Gelände sicher meistern 99 € (Tag 5) = 126 €
- **Käuferin B:** Handarbeit 197 € (Tag 13)

Bezogen auf die rund 108 Käuferinnen des Gelände-Schlüssels haben also nur etwa 1,9 % über die Mailstrecke noch etwas nachgekauft. Die Reichweite der Sequenz ist damit schmaler als die reine Kaufzahl vermuten lässt.

**Käuferin A ist der interessante Fall:** Sie hat an Tag 4 für 27 € gekauft und direkt an Tag 5 für 99 € nachgelegt. Der kleine Kauf hat den größeren nicht ersetzt, sondern ihm den Weg gebahnt. Das ist die Wertleiter, wie sie funktionieren soll, und es spricht dafür, den günstigen Order Bump vor dem teuren Upsell zu belassen. Ein einzelner Fall ist allerdings kein Beleg, sondern nur ein Hinweis, den die nächsten Monate bestätigen müssen.

**Die Klickrate misst Neugier, nicht Kaufabsicht.** Die Order-Bump-Mails haben mit 6 bis 9 % die mit Abstand besten Klickraten, aber nur einer von 21 Klicks wurde ein Kauf. Bei den teuren Upsells ist es genau umgekehrt: kaum jemand klickt, aber wer klickt, kauft auffällig oft (Tag 13: 2 Klicks, 1 Kauf). Ein 17-Euro-Angebot lädt zum neugierigen Klicken ein, ein 197-Euro-Angebot klickt nur an, wer es ernst meint. Deshalb taugt die Klickrate nicht als Erfolgsmaß der Sequenz und Klickraten verschiedener Preisklassen dürfen nicht gegeneinander gestellt werden.

**Die Kopfkino-Strecke ist die schwächste.** Drei Mails, 180 Sendungen, insgesamt ein einziger Klick und kein Kauf. Die Mails werden dabei mit 46 bis 48 % ganz normal geöffnet. Gelesen wird also, nur das Thema zündet an dieser Stelle nicht. Zum Vergleich: Die Handarbeit-Strecke hat bei nur 58 Sendungen schon einen Kauf erzielt, obwohl sie mit 197 € doppelt so teuer ist.

**Zur Einordnung der Handarbeit-Strecke:** Tag 13 bis 15 haben mit 30, 17 und 11 Empfängern noch sehr kleine Fallzahlen. Der eine Kauf ist ein gutes Zeichen, aber noch kein belastbarer Trend. Das klärt sich in den nächsten Monaten.

**Kleine Fallzahlen beachten:** Tag 13 (30), Tag 14 (17) und Tag 15 (11) haben so wenige Empfänger, dass ein einzelner Klick die Prozentzahl stark bewegt. Diese drei Zeilen werden erst in den kommenden Monaten aussagekräftig.

---

## Wie diese Zahlen zu bewerten sind

**Es gibt keine verlässliche externe Benchmark** für eine Upsell-Mailstrecke an Käuferinnen eines günstigen Mini-Kurses im deutschen Pferdemarkt. Grobe Orientierung aus allgemeinen Mustern: solche Nachfass-Strecken liegen meist im niedrigen einstelligen Prozentbereich, etwa 1 bis 3 % Kaufrate. Das ist eine Hausnummer, keine Messung, und taugt nicht als Entscheidungsgrundlage.

**Die maßgebliche Kennzahl ist der Umsatz pro eingetretener Person, nicht die Klickrate.** Sie lässt sich direkt gegen die Anzeigenkosten rechnen (aktueller Champion: rund 12,38 € pro Kauf).

| Strecke | Eingetreten | Käufe | Kaufrate | Umsatz pro Person |
|---------|-------------|-------|----------|-------------------|
| Handarbeit (197 €) | 30 | 1 | 3,3 % | 6,57 € |
| Gelände sicher meistern (99 €) | 97 | 1 | 1,0 % | 1,02 € |
| Order Bumps (17 / 27 €) | 93 | 1 | 1,1 % | 0,29 € |
| Schluss mit Kopfkino (97 €) | 69 | 0 | 0 % | 0 € |

**Gesamt über alle Strecken: 323 € Zusatzumsatz bei rund 108 Käuferinnen, also etwa 3 € pro Käuferin.** Gegen einen Anzeigenpreis von rund 12,38 € pro Kauf gerechnet trägt die Mailstrecke damit schon jetzt rund ein Viertel der Akquisekosten mit.

*(„Eingetreten" = Empfängerzahl der jeweils ersten Mail der Strecke. Käufe, die direkt auf der Checkout-Upsell-Seite passiert sind, sind hier nicht enthalten.)*

**Nicht auf monatliche Schwankungen reagieren.** Bei 30 bis 97 Personen pro Strecke ist eine Kaufrate von 1 % statistisch nicht von 3 % zu unterscheiden. Ein einziger zusätzlicher Kauf verschiebt die Zahl um mehrere Punkte. Mails umzuschreiben, weil eine Rate gefallen ist, heißt Rauschen hinterherlaufen (gleiche Logik wie beim vermeintlichen „Abschmieren" der Anzeigen). Erst wenn eine Strecke einige hundert Personen gesehen hat, wird die Kaufrate belastbar.

**Was schon jetzt aussagekräftig ist, ist die Größenordnung zwischen den Strecken.** Kopfkino: 180 Sendungen, 1 Klick, 0 Käufe. Handarbeit: 58 Sendungen, 2 Klicks, 1 Kauf. Das ist kein Feinschliff-Unterschied.

---

## Trend-Notizen

*(Ab der nächsten Erhebung im September trägt Claude hier ein, welche Mails sich verbessern oder verschlechtern, jeweils auf Basis der berechneten Monatswerte.)*
