# Gelände-Schlüssel Salespage V2 — Struktur (ThriveCart, Embedded Checkout)

Stand: 2026-09-23. Entwurf, wartet auf Anikas Hero-Entscheidung. Grundlage: Money-Pages-Zonen + Buchungsfüller-Checkliste (`reference/salespage-positivbeispiel-buchungsfueller.md`) + bestehendes Material (`salespage-thrivecart-FINAL.html`, `tc-bilder/`, Soft-/Salesmail-Bausteine).

**Anlass:** Devine-Timer kann keinen Seitenbesuch-Start (Soft-Mail-Klick landete auf „abgelaufen"). ThriveCart-Evergreen-Timer startet pro Besucherin beim ersten Seitenaufruf und kann bei Ablauf den Cart ERSETZEN (echte Durchsetzung). Zugleich Conversion-Umbau (alte Seite schwach).

**Anikas Vorgaben:** Timer NICHT oben am Seitenkopf, erst ab Preisblock. Checkout eingebettet unten (Mentoren-Modell).

## Struktur (18 Sektionen in 3 Zonen)

**Zone EMOTION**
1. Hero: Headline (Optionen A/B/C, siehe Chat 23.09.; Empfehlung C = Stell-dir-vor + Christine-Zitat) + CTA 1 (Ich-Form)
2. Social Proof sofort: „über 130 Freizeitreiterinnen" + Sarina-Ergebnis-Zitat
3. Problem als Szene: Freitagnachmittag-Szene aus Soft-Mail 1.1 (Stallgruppe, Bodenarbeit-Ausrede, Feldweg)
4. Sonnen-Ausblick: Feierabendrunde im Wald (aus Soft-Mail 1.3)
5. Versprechen + Einwand-Radierer („sogar wenn dein Pferd seit Jahren klebt…", Extremfall-Winkel aus Salesmail 3)
6. Produktvorstellung + Hero-Mockup (tc-bilder/1-hero-mockup.png) + CTA 2

**Zone RATIO**
7. Testimonials in Ergebnissen (Sarina, Christine, Katrin, Henriette; Fotos tc-bilder/2-5)
8. Mechanismus-Kette (3 Zeilen): Pferd lesen → Stress runterfahren, bevor er kippt → Hof verlassen wird Routine; Annäherungs- und Rückzugsstrategie namentlich (löst Mail-Open-Loop ein)
9. Produkttour Modul 0-4 + Abschluss, JEDES Modul mit „Ergebnis:"-Zeile (wichtigster Buchungsfüller-Punkt, fehlt bisher)
10. Workbook + Boni (Stresssignal-Checkliste, 2-Wochen-Plan)
11. Preisblock 27€ statt 197€, Einführungspreis-Framing, TIMER startet hier sichtbar
12. Über mich, kurz + beweisgetrieben (500+ Teams; tc-bilder/6-ueber-mich.jpeg)
13. Qualifizierung: perfekt wenn… / nicht das Richtige wenn… (ehrlicher Ausschluss)

**Zone DRINGLICHKEIT**
14. Recap als Vision („Stell dir vor, in 2 Wochen…")
15. Garantie: 14-Tage-Geld-zurück als Vertrauens-Element gestapelt
16. FAQ: Zeit pro Tag / Extremfall / losreißen (→ Order Bump 1) / Pferde-Alter / Technik-Einfachheit / Zugriff
17. Finale Preisbox + Timer + letzter CTA
18. **Embedded Checkout:** E-Mail → Zahlung 27€, Order Bump 1 „Ruhig bleiben" 27€, Order Bump 2 „Hoftor" 17€, Bestellübersicht. Timer-Ablauf: Cart durch Nachricht ersetzen + Link Regulärpreis-Seite

## Conversion-Hebel vs. alte Seite

1. Embedded Checkout statt Extra-Klick (größter Hebel)
2. „Ergebnis:"-Zeile pro Modul
3. Timer mit echter Durchsetzung (Cart verschwindet) statt Anzeige
4. Schlanke Seite (alte landingpage-ads.html = 1,4 MB → mobile Ladezeit)

## Technik-Notizen

- ThriveCart erfasst UTMs nativ → Durchreiche-Script der Devine-Seite entfällt
- Meta-Pixel als Custom-Code in die ThriveCart-Seite (Codes in `meta-pixel-codes.md`); CAPI-Setup unverändert
- Devine-Auslöser-Link (Soft-Mails) + Salesmail-Links zeigen auf die neue ThriveCart-URL; Devine-Mail-Timer bleiben als Anzeige in den Salesmails
- CTA-Buttons in Ich-Form, variiert („Ja, ich will entspannt vom Hof!" u.a., Optionen folgen mit den Texten)

## Nächste Schritte

1. ⏭️ Anika wählt Hero-Option (A: bewährte H1 / B: Selbst-wenn-Formel / C: Stell-dir-vor + Christine-Zitat, Empfehlung C)
2. Claude schreibt komplette Sektionstexte mit Formulierungs-Optionen
3. Anika baut in ThriveCart, Timer-Einstellungen: Evergreen, 3 Tage, Ablauf = Cart ersetzen
4. Test: Timer-Start beim Erstbesuch, Ablauf-Verhalten, Order Bumps, Pixel
5. Devine-Links umziehen, alte Seite erst nach erfolgreichem Test stilllegen
