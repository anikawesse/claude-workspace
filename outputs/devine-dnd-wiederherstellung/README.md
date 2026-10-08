# Devine: DND-Wiederherstellung und Listen-Aufräumen (08.10.2026)

## Was passiert war

Am 07.10.2026 hat der Backend-Start-Workflow bei allen durchgeschickten Kontakten das E-Mail-DND aufgehoben und den Tag `newsletter` vergeben. Betroffen waren 1.607 abgemeldete Kontakte und 1.712 Kontakte, die den Newsletter-Tag vorher nicht hatten.

## Was am 08.10.2026 gemacht wurde

| Schritt | Kontakte | Datei |
|---|---|---|
| E-Mail-DND wieder gesetzt | 1.607 | `dnd-aufgehoben-2026-10-07.csv`, `dnd-wiederherstellung-protokoll.csv` |
| Früher per Workflow freigeschaltet (gewollt, nicht angefasst) | 43 | `dnd-aufgehoben-frueher.csv` |
| `newsletter` entfernt (kein DOI-Tag) | 1.306 | `newsletter-tag-korrektur-protokoll.csv` |
| `newsletter` behalten oder zurückgegeben (DOI-Tag) | 406 | `newsletter-tag-korrektur-protokoll.csv` |
| `doi` + `newsletter` nachgetaggt (Webinaris, Bestandskunden, Offenstallplaner) | 585 | `doi-newsletter-nachgetaggt-2026-10-08.csv` |
| Adressen mit Domain-Tippfehler korrigiert | 4 | – |
| Gelöscht von Anika: Tippfehler-Dubletten und Fantasie-Adressen | 35 | `loeschkandidaten-ungueltige-adressen.csv` |
| Gelöscht von Anika: Anmeldungen ohne DOI (91) und ungültige Adressen (38) | 127 | `loeschkandidaten-runde-2.csv` |
| Call-Tags auf Unterstrich-Schreibweise zusammengeführt | 6 | – |
| Leere Test-Tags gelöscht (`claude-testlauf`, `testnurtering`) | – | – |

## Stand vor dem letzten Löschen (127 Kontakte)

- 5.254 Kontakte, 4.546 mit `newsletter`, davon 1.493 mit E-Mail-DND
- Aktive Newsletter-Liste: rund 3.030 Kontakte
- `newsletter` tragen nur Kontakte mit einem DOI-Tag

## Methode

Der frühere DND-Status steht nur im Aktivitätsverlauf der Konversationen (`contact_dnd_enabled` → `contact_dnd_disabled_from_workflow`). Wer `newsletter` erst am 07.10. bekam, ließ sich an der Tag-Reihenfolge erkennen: Devine speichert Tags in Vergabe-Reihenfolge, der Tag stand hinter `start backend`.

## Hinweis

Die CSV-Dateien enthalten Kontaktdaten und liegen nur lokal. Sie sind per `.gitignore` vom Backup ausgenommen.
