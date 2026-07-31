# Monatsroutine: ThriveCart-Rechnungen → Lexware Office

**Zweck:** Alle ThriveCart-Verkäufe eines Monats als fertige Belege (Kontakt + Steuerfall + PDF) in Lexware anlegen. Danach in Lexware nur noch die Zahlungen bestätigen.

**Aufwand:** ca. 2 Minuten deiner Zeit + ein Skript-Lauf.

**Automatisch:** Die lokale Aufgabe "buchhaltung-thrivecart-lexware" läuft jeden 1. des Monats von selbst — findet sie schon einen Export-Ordner auf dem Desktop, bucht sie direkt; findet sie keinen, erinnert sie dich an Schritt 1. Du kannst sie jederzeit auch manuell starten. (Die frühere separate Cloud-Erinnerung wurde deaktiviert, da redundant.)

---

## Schritt 1 — ThriveCart-Rechnungen exportieren
1. ThriveCart öffnen → **Transactions** → oben auf **Invoices**
2. Zeitraum auf den gewünschten Monat stellen → unten links **Download**
3. ThriveCart schickt eine E-Mail → Download-Link klicken → ZIP entpacken
4. Den entpackten Ordner auf den **Desktop** legen (z.B. `Buchungen August`)

## Schritt 2 — Skript laufen lassen
Erst risikolose Vorschau (bucht nichts):
```bash
node scripts/lexware-import.js "C:/Users/Olive/Desktop/Buchungen August" --all --dry-run
```
Wenn die Vorschau passt, scharf buchen:
```bash
node scripts/lexware-import.js "C:/Users/Olive/Desktop/Buchungen August" --all
```
(Ordnernamen jeweils anpassen.)

## Schritt 3 — In Lexware bestätigen
**Finanzen → Umsätze → Umsätze zuordnen:** Die Belege werden dir als Vorschlag zu den Zahlungen angezeigt → bestätigen.

---

## Was das Skript automatisch richtig macht
- **Doppelbuchungs-Schutz:** schon gebuchte Rechnungen (auch früher manuell gebuchte) werden übersprungen. Überschneidungen im Zeitraum sind also unkritisch.
- **Steuerfälle:** DE 19% · EU-Ausland OSS (Zielland-Satz) · Drittland 0% — automatisch anhand des Käuferlandes.
- **Mehr-Positionen-Rechnungen** (inkl. Order Bumps) werden korrekt zusammengefasst.
- **Test-/0-€-Käufe** (eigene Testbestellungen mit Coupon TESTCODE) werden übersprungen.
- **Kontakte** werden per E-Mail wiederverwendet (keine Dubletten).

## Rückzahlungen / Erstattungen (falls im Monat welche offen sind)
Lexware bietet bei „Umsätze zuordnen" nur Kategorien der passenden Richtung an und bei „Beleg zuordnen" nur **offene** Belege. Erstattungen eines schon abgeschlossenen Belegs brauchen daher einen **Gutschrift-Beleg**:

- **Kunden-Erstattung** (Verkauf zurück, Geld raus): Claude bitten, eine **Gutschrift (salescreditnote)** mit dem Steuerfall des Originalverkaufs anzulegen → dann die Minus-Zahlung per **„Beleg zuordnen"** zuweisen.
- **Lieferanten-Erstattung** (Einkauf/Rücksendung, Geld rein): Claude bitten, eine **Lieferanten-Gutschrift (purchasecreditnote)** mit der ursprünglichen Ausgabe-Kategorie anzulegen → dann die Plus-Zahlung per „Beleg zuordnen" zuweisen.
- **Zurückerstattete PayPal-Gebühr** (kleiner Plus-Betrag): als **„Sonstige Einnahmen", 0 %** buchen.
- **Split-Zahlung** (1 Rechnung, 2 PayPal-Zahlungen, z.B. Upsell): beide Zahlungen einzeln als **Teilzahlung** demselben Beleg zuordnen (erste = Teilzahlung, zweite schließt ab).

## Worauf du achten solltest
- **Fehlender Kundenname:** Steht in den ThriveCart-Daten kein Name, wird der Kontakt nach der E-Mail benannt und im Skript-Log mit „⚠ Name fehlt" markiert. → Namen in Lexware nachtragen.
- **Rückerstattungen** werden (noch) nicht automatisch als Gutschrift gebucht — die musst du separat behandeln.

## OSS-Zusammenfassung
Lexware bucht nur pro Beleg und liefert keine eigene OSS-Meldung. Deshalb schreibt `lexware-import.js` bei jedem Lauf zusätzlich eine Datei `OSS-Zusammenfassung <Ordnername>.csv` auf den Desktop — Summen nach Land/USt-Satz (Netto/USt/Brutto), Basis für deine externe OSS-Meldung. Ersetzt das frühere separate Skript `thrivecart-buchungsexport.ps1` (entfernt, 2026-07-31), das dafür noch einen manuellen CSV-Export brauchte.

## Voraussetzungen
- `scripts/.env` mit `THRIVECART_API_KEY` und `LEXWARE_API_KEY` (liegt lokal, gitignored)
- Lexware Office Tarif **XL** (Public API)
