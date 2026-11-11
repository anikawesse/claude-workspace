# Wissen der Stelle (aus der Memory umgezogen am 06.11.2026)

Diese Einträge standen vorher einzeln in der Memory. Inhalt 1:1 übernommen. Neue Learnings für diesen Bereich hier unten ergänzen, nicht mehr in der Memory.

---

## Lexware-Buchhaltung (Projekt)

Neues Projekt (Start 2026-07-24): ThriveCart-Umsätze automatisiert in Lexware Office verbuchen. Workflow: pro Bestellung Kontakt anlegen/finden → Einnahme-**Beleg** buchen (NICHT neue Rechnung, ThriveCart stellt Rechnung schon aus → sonst doppelte Rechnungsnr.) → ThriveCart-Rechnungs-PDF anhängen.

**3 Steuerfälle** (Logik steckt schon in [[project_ads_auswertung]]-Umfeld / scripts/thrivecart-buchungsexport.ps1, das nach Land+USt-Satz gruppiert):
- **DE**: 19% USt
- **EU-Ausland (OSS)**: Zielland-Satz; API-Feld `taxSubType: "electronicServices"` (digitale Kurse) + `distanceSalesPrinciple=DESTINATION`. Satz kommt fertig von ThriveCart, wird nur durchgereicht.
- **Drittland**: steuerfrei, API-Typ `thirdPartyCountryService` (0%).

**API-Machbarkeit (recherchiert 2026-07-24, developers.lexware.io):** Kontakte ✅, Belege ✅, PDF-Anhang via Files-Endpoint + `documentFileId` ✅, OSS/Drittland ✅. ThriveCart schon angebunden (`THRIVECART_API_KEY` in scripts/.env).

**⚠️ Tarif-Hürde:** Öffentliche API gibt es NUR in Lexware Office **Tarif XL** (32,90 €/Mon), Anika hat aktuell **Tarif L** (21,90 €/Mon). Mehrkosten 11 €/Mon = 132 €/Jahr. Anika upgradet, WENN sich Automatisierung lohnt (Volumen-abhängig). Entscheidung offen (Stand 2026-07-24).

**Offene Entscheidungen:** (1) Upgrade ja/nein (ggf. ThriveCart-Bestellvolumen als ROI-Zahl ziehen). (2) Einzelbuchung je Kunde vs. monatliche Sammelbuchung pro Land/USt-Satz — am besten mit Steuerberaterin abstimmen.

**Vorgehen nach Upgrade:** Erst je 1 echte Testbuchung pro Fall (DE/EU/Drittland) mit echtem API-Key, in Lexware prüfen, DANN erst voll automatisieren.

### Umsetzungs-Stand (2026-07-24, XL-Upgrade erledigt, API-Key in scripts/.env als LEXWARE_API_KEY)
- **API-Basis:** `https://api.lexware.io/v1/` · Auth `Bearer $LEXWARE_API_KEY` · curl unter Windows mit `--ssl-no-revoke`.
- **Profil bestätigt:** orgId 3f747da7-…, `distanceSalesPrinciple=DESTINATION`, `smallBusiness=false`, `taxType=gross`.
- **Buchungsart ENTSCHIEDEN:** Einzelbuchung, jeder Kontakt einzeln (Anika bestätigt lt. Erklärvideos). KEINE Sammelbuchung.
- **Endpunkt = `/v1/vouchers`** (Belege, `type:"salesinvoice"`), NICHT `/v1/invoices` (das würde neue Rechnungsnr. erzeugen). Vorher Kontakt via `/v1/contacts` (roles.customer). voucherNumber = "TC-<invoice_id>" als Referenz.
- **⚠️ Feldname:** Item-Feld heißt `taxRatePercent` (NICHT taxRatePercentage → sonst HTTP 406). Bei taxType `gross`: item `amount`=Brutto, `taxAmount`=USt.
- **Kategorie-IDs (posting-categories):**
  - DE 19%: „Einnahmen" `8f8664a1-fd86-11e1-a21f-0800200c9a66`
  - EU-OSS (digitale Kurse): „Elektronische Dienstleistung in EU-Land steuerpflichtig" `7ecea006-844c-4c98-a02d-aa3142640dd5`, taxRatePercent = Zielland-Satz von ThriveCart
  - **Drittland: „Einnahmen" `8f8664a1…` mit 0% Steuer** ⚠️ NICHT „Dienstleistungen an Drittländer" (nur für B2B/Geschäftskontakte mit USt-ID; Anikas Käufer sind Privat) — Korrektur von Anika.
- **ThriveCart-Felder** (`/api/external/transactions`, Bearer): pro charge `customer.{first name,last name,email,address{line 1,city,zip,state,country}}`, `amount_str`(Brutto), `tax_paid_str`(USt), `tax`(Satz z.B. 0.19), `tax_type`(de/at/…/leer=Drittland), `tax_reverse_charge`, `invoice_id`, `order_id`, `item_name`, `date`. Beträge inclusive/gross.
- **Testbuchungen:** DE Order 42584340 (Monique Möller) → Beleg `6800357d-a340-4260-b2fa-42511db7f38e` ✅ korrekt (27€/4,31€/19%). Kontakt `436e8cc2-a46b-41aa-ba76-8f506a0d6e1a`.
### ⚠️ Workflow-Korrektur (Anikas echter Ablauf, 2026-07-24)
Anikas realer Prozess: Der **Beleg = die ThriveCart-Rechnung als PDF** (herunterladen, NICHT neu erstellen). Sie geht in **Finanzen → Umsätze → Umsätze zuordnen**, sucht die Zahlung, ordnet ihr die PDF-Rechnung zu und legt dabei den Kontakt an. → Mein erster Ansatz (strukturierten salesinvoice-Voucher erzeugen) war NICHT ihr Workflow; Test-Beleg TC-157 wurde von Anika manuell gelöscht (API-DELETE auf offene Belege geht nicht → HTTP 404).

**Harte API-Grenzen (2026-07-24 getestet):**
- Lexware-API hat KEINEN Zugriff auf Bank-Umsätze / „Umsätze zuordnen" (`/v1/transactions`, `/v1/payments`, `/v1/financial-accounts` etc. alle 404). → Das finale Zahlung↔Beleg-Zuordnen bleibt Anikas manueller 1-Klick-Schritt, NICHT automatisierbar.
- ThriveCart-API liefert KEINEN Rechnungs-PDF-Link (Transaktion hat nur `invoice_id`, keine url/pdf/download-Felder).

**Realistischer Automatisierungs-Umfang:** pro Bestellung Beleg (ThriveCart-PDF) in Lexware hochladen (`/v1/files`) + Kontakt anlegen + Kategorie/Steuer setzen → Lexware schlägt den Beleg beim Zuordnen als Treffer vor, Anika bestätigt mit 1 Klick.

### PDF-Quelle GELÖST + Skript gebaut (2026-07-24)
- **PDF-Quelle:** Anika exportiert manuell in ThriveCart: Transactions → Invoices → Zeitraum wählen → unten links Download → ThriveCart mailt Download-Link → ZIP mit PDFs. Dateien heißen `anikas-pferdeakademie_invoice_000000126.pdf` (volltext-lesbar, KEIN Scan; enthalten Kundin/Adresse/Land/Datum/Netto/USt/Brutto/Produkt). Bulk-Download bleibt Anikas manueller Schritt (ThriveCart-API gibt PDFs nicht her).
- **Join-Key BESTÄTIGT:** PDF-Nummer (ohne Nullen) == API `invoice_id`. Also `..._invoice_000000126.pdf` → 126 → ThriveCart-Transaktion(en) mit invoice_id 126. Eine invoice_id kann MEHRERE Positionen haben (Produkt + Bump, gleiche transaction_id) → als mehrere voucherItems zusammenfassen (Skript macht das, Beispiel Nr.106 = 54€ 2 Positionen).
- **Skript:** `scripts/lexware-import.js` (Node, global fetch/FormData). Aufruf: `node scripts/lexware-import.js "<PDF-Ordner>" 126 106 109` oder `--all`. Pro Rechnung: Kontakt anlegen → Beleg (salesinvoice, Kategorie/Satz je Fall) → PDF anhängen via `POST /v1/vouchers/{id}/files` (multipart, feld `file`, `type=voucher`). Beträge `taxType:gross`, item `amount`=Brutto/`taxAmount`=USt/`taxRatePercent`. EU-Länderliste im Skript.
- **3 Testbuchungen live & korrekt (Status open):** TC-126 DE 27€/4,31€/19%→Einnahmen (Beleg 8bb39b11-…), TC-106 NL-OSS 54€/9,38€/21%→Elektr.DL EU-OSS (cd64f7c5-…), TC-109 CH 27€/0€/0%→Einnahmen (795a10c0-…). PDF hängt jeweils. OSS mit 21% von Lexware akzeptiert → OSS-Sorge endgültig erledigt.
### KONZEPT BEWIESEN + Produktions-Skript fertig (2026-07-24)
- **In Lexware verifiziert (Anika):** Alle 3 Test-Belege korrekt zugeordnet, PDFs dran. Unter „Umsätze zuordnen": Marion (DE/PayPal) + Tanja (CH/PayPal) wurden AUTOMATISCH als Vorschlag angezeigt. Stefanie (NL/Stripe, 54€ exakt) kam NICHT als Auto-Vorschlag (kein Betrags-/Gebührenproblem — Stripe wird bei Anika auch einzeln gebucht), war aber im Beleg-Auswahl-Dialog auffindbar → Anika hat sie schnell manuell verbunden. ⇒ Auto-Vorschlag = Timing/Sortier-Zufall, KEIN Blocker; Nutzen (fertige kategorisierte Belege + PDF, kein Tippen/Umbenennen) greift immer. Beobachten ob Stripe-Muster.
- **3 Test-Belege sind ECHTE gültige Buchungen** (reale Bestellungen) → bleiben, nicht löschen. TC-106 schon zugeordnet.
- **Produktions-Skript `scripts/lexware-import.js` FERTIG.** Aufruf: `node scripts/lexware-import.js "<PDF-Ordner>" --all` (real) / `--all --dry-run` (Vorschau) / einzelne Nummern statt --all. Features: Doppelbuchungs-Schutz (lädt bestehende salesinvoice-Belege via `/voucherlist?voucherType=salesinvoice&voucherStatus=open,paid,voided,transferred&size=250` paginiert; normalisiert voucherNumber `TC-126` UND manuell `000000099` → int; skippt schon gebuchte); Kontakt-Dedup per E-Mail (`GET /contacts?email=`); Mehr-Positionen/Bumps korrekt; refunds ausgeschlossen (nur charges). ⚠️ Bug gefixt: ungültiger voucherStatus-Wert „overdue" ließ Dedup-Query leer laufen → nur geprüfte Status verwenden.
- **Anikas laufender Workflow:** 1) ThriveCart Rechnungs-Export ziehen, 2) einen node-Befehl ausführen, 3) in Lexware Zuordnungen bestätigen.
### Export „Rechnungen letzte Woche" (104–126) KOMPLETT gebucht (2026-07-24)
- Alle 20 restlichen scharf gebucht, 0 Fehler, keine Doppel-Kontakte (E-Mail-Dedup verifiziert an Julia Bergmann → 1 Kontakt).
- **⚠️ Lexware Rate-Limit ~2 req/s** → 1. Lauf lief in HTTP 429. FIX im Skript: Drossel `gate()` 600ms zwischen Lexware-Calls + Auto-Retry bei 429 (bis 5×, backoff 1500ms×attempt). Gilt für lx() und attachPdf().
- **Weitere Skript-Schutzregeln ergänzt:** (1) Test-/0€-Bestellungen überspringen (Coupon `TESTCODE` ODER totalGross<=0) — z.B. Anikas eigene Testkäufe Nr. 86/87 (anikawesse@outlook.de). (2) Fehlender Kundenname → E-Mail als lastName-Notlösung + Warn-Markierung im Namen (Einnahme wird trotzdem gebucht, Name manuell nachziehbar) — z.B. Nr. 130 (info@wosslick.de).

**Juli KOMPLETT gebucht (2026-07-24):** Voller Juli-Export lag in `Desktop/Buchungen Juli` (73 PDFs, Nr. 083–157, Rohformat `anikas-pferdeakademie_invoice_000000157.pdf`; Test-Rechnungen 86/87 gar nicht im Export). Lauf `--all`: **34 gebucht, 39 übersprungen (schon gebucht), 0 Fehler**, alle PDFs dran. Lauf >120s (Drossel) → lief im Hintergrund. ⚠️ Offener Rest: Nr. 130 ohne Namen gebucht (Kontakt = E-Mail `info@wosslick.de`) → Anika trägt echten Namen manuell nach. Nächster laufender Betrieb: Monatsende Export ziehen → `node scripts/lexware-import.js "<Ordner>" --all` → in Lexware „Umsätze zuordnen" bestätigen.
- **Später ggf.:** Rückerstattungen/refunds als Gutschrift (salescreditnote) automatisieren (aktuell nur charges); beobachten ob Stripe-Auto-Vorschlag beim Zuordnen ein Muster ist.

### Erstattungen/Refunds richtig buchen (2026-07-24, an echten Fällen gelöst)
Lexware bietet bei „Umsätze zuordnen" für einen Umsatz nur Kategorien der PASSENDEN Richtung an (Ausgang→nur Ausgabe-Kat., Eingang→nur Einnahme-Kat.) und bei „Beleg zuordnen" nur OFFENE Belege. Eine Erstattung eines schon bezahlten/abgeschlossenen Belegs lässt sich daher NICHT per Kategorie buchen → man braucht einen **Gutschrift-Beleg**, den Lexware als offenen Beleg anzeigt und dem man die Erstattungs-Zahlung zuordnet.
- **Kunden-Erstattung (Verkauf zurück, Geld RAUS):** `type:"salescreditnote"` per API anlegen (gleiche Felder wie salesinvoice, Kategorie/Satz wie Originalverkauf). Beispiele: TC-152-GS (Stephanie, Gelände-Schlüssel 27€/19% DE, Doppelbuchung); TC-94-GS (Brigitte Averdung, Traumteam 125€/20% FR-OSS, Kategorie 7ecea006). Danach: −Betrag → „Beleg zuordnen" → Gutschrift.
- **Lieferanten-Erstattung (Einkauf zurück, Geld REIN):** `type:"purchasecreditnote"`, Kontakt mit `roles.vendor`, Ausgabe-Kategorie. Beispiel LOESDAU-ERST-799 (7,99€/19%, Kategorie „Material/Waren" `efa82f42-fd85-11e1-a21f-0800200c9a66`). Danach: +Betrag → „Beleg zuordnen".
- **Zurückerstattete PayPal-Gebühr (kleiner +Betrag):** Lexware bietet auf Einnahmenseite keine Gebühren-/Ausgabe-Kat. → pragmatisch als **„Sonstige Einnahmen" 0%** buchen (Kleinstbetrag).
- **⚠️ posting-categories-Typen:** Einnahmen = `income`, **Ausgaben = `outgo`** (NICHT „expense"!). Beim Suchen nach Ausgabe-Kategorien auf `outgo` filtern.
- **Split-Zahlung (1 Rechnung, 2 PayPal-Zahlungen, z.B. Upsell):** beide Zahlungen einzeln per „Manuell zuordnen" demselben Beleg als Teilzahlung zuordnen (erste = Teilzahlung, Rest bleibt offen, zweite schließt ab).
- **⚠️ Bei mehreren API-Calls hintereinander Rate-Limit (429)** — im Skript gedrosselt, bei Einzel-Calls ggf. kurz warten/wiederholen.

### Routine (2026-07-24)
- ⚠️ Cloud-Routinen (/schedule) laufen in Anthropics Cloud OHNE Zugriff auf lokale PDFs, `scripts/.env` oder Desktop → können das Buchen NICHT ausführen. Für diesen lokalen Job untauglich; höchstens als Nudge (aber ohne Connector nur claude.ai-Routinen-Seite). Anika hat Auswahl (Kalender-Reminder / Cloud-Nudge / E-Mail-Connector) offen gelassen.
- **Stattdessen umgesetzt:** Monats-Runbook `scripts/lexware-buchhaltung-anleitung.md` (Export→Skript→Zuordnen) + fertiger Kalender-Erinnerungstext an Anika gegeben.
- **Cloud-Routine ANGELEGT (auf Anikas Wunsch als sichtbarer Anker „oben"):** ID `trig_01DLVAQwuAeguRmttSt7ofsn`, monatlich `0 6 1 * *` (1. des Monats ~8:00 Berlin/CEST), model sonnet-5, KEINE Git-Quelle (GitHub-Konto nicht verbunden → mit Repo-Source scheiterte create mit 401; ohne sources klappt es), allowed_tools nur Read. Gibt reinen Erinnerungstext aus (führt NICHTS aus). Erste Ausführung 2026-08-01. Verwalten/ändern: https://claude.ai/code/routines/trig_01DLVAQwuAeguRmttSt7ofsn
- **⚠️ Sichtbarkeit:** Cloud-Routinen erscheinen NUR im Browser unter https://claude.ai/code/routines (mit claude.ai-Konto eingeloggt), NICHT in der Claude-Code-App/Terminal. Anika suchte sie mehrfach vergeblich → immer auf die Browser-URL verweisen.
- **⚠️ Anikas „Routinen" links in Claude Code = LOKALE geplante Aufgaben** (mcp__scheduled-tasks__, gespeichert in C:\Users\Olive\.claude\scheduled-tasks\), NICHT die Cloud-Routinen! Bestehend: `ads-auswertung-gelaende` (täglich). Diese lokalen Tasks können das Skript wirklich ausführen (Cloud kann es nicht).
- **LOKALE Aufgabe angelegt (2026-07-24):** `buchhaltung-thrivecart-lexware` (manuell startbar, kein Zeitplan) — findet neuesten Export-Ordner am Desktop, dry-run, bucht scharf via lexware-import.js, hilft bei Erstattungen. DAS ist was Anika wollte (anklickbar in der Sidebar). SKILL.md unter .claude/scheduled-tasks/buchhaltung-thrivecart-lexware/. Cloud-Routine damit redundant (nur noch Monats-Erinnerung) — Anika gefragt, ob deaktivieren.
- **Erstattungs-Teil ergänzt (2026-07-24):** Routine-Prompt UND `scripts/lexware-buchhaltung-anleitung.md` enthalten jetzt zusätzlich den Abschnitt Rückzahlungen/Erstattungen (sales-/purchasecreditnote, PayPal-Gebühr→Sonstige Einnahmen 0%, Split-Zahlung als Teilzahlung).

### Zwei Routinen zu einer zusammengelegt (2026-07-31)
Anika fragte, warum es zwei "Buchhaltung ThriveCart"-Routinen gibt. Fund: (1) Cloud-Routine `trig_01DLVAQwuAeguRmttSt7ofsn` (claude.ai/code/routines, monatlich, nur Text-Erinnerung, kein Datei-/API-Zugriff) UND (2) lokale Aufgabe `buchhaltung-thrivecart-lexware` (nur manuell, bucht wirklich) — beide seit dem Bau am 24.07. parallel, wie in diesem Memory oben schon vermerkt.
- **Zusammengelegt:** Lokale Aufgabe hat jetzt selbst einen Zeitplan (`0 6 1 * *`, monatlich 1. um 6 Uhr) UND prüft in Schritt 0 selbst, ob ein Export-Ordner auf dem Desktop liegt — wenn ja, bucht sie; wenn nein, gibt sie dieselbe Erinnerung aus, die vorher die Cloud-Routine lieferte. SKILL.md unter `.claude/scheduled-tasks/buchhaltung-thrivecart-lexware/` entsprechend erweitert.
- **Cloud-Routine deaktiviert** (nicht gelöscht, `enabled:false` via RemoteTrigger — vollständiges Löschen geht nur über die claude.ai/code/routines-Seite selbst).
- **Zweiter Fund dabei:** Es gab außerdem noch ein zweites, unabhängiges Skript `scripts/thrivecart-buchungsexport.ps1` (05.07., vor dem API-Umstieg) — CSV-basierte Handbuchungs-Vorbereitung MIT Land/USt-Satz-Zusammenfassung als OSS-Meldungs-Basis (die Lexware selbst nicht liefert). Ungenutzt seit dem API-Umstieg (keine passende Export-CSV mehr auf dem Desktop gefunden). Die Zusammenfassungs-Funktion wurde in `lexware-import.js` integriert (schreibt jetzt automatisch `OSS-Zusammenfassung <Ordner>.csv` auf den Desktop, aus denselben ThriveCart-API-Daten, kein manueller CSV-Export mehr nötig) und das alte Skript entfernt (`git rm`, noch nicht committed).

### Stand 05.10.2026
- ⚠️ `lexware-import.js` bucht nur `charge`, KEINE `rebill` (Folgeraten bei Teilzahlungen, z.B. Gelände-Programm 4 × 165 €). Folgeraten haben in ThriveCart dieselbe invoice_id wie die erste Rate und fallen deshalb durch den Doppelbuchungs-Schutz. Jeden Monat die Rebills aus der TC-API separat prüfen und einzeln als Beleg vorschlagen (Anika hat Miriam Reusches 2. Rate von Hand als 4KTEVAST-0002 angelegt).
- Offene Bankumsätze sind über die API nicht abrufbar, nur offene Belege (`voucherStatus=open`; `overdue` nicht mit anderen Status kombinierbar). Der eingebaute Browser ist bei Lexware nicht eingeloggt.
- Gutschrift TC-307-GS (Jelena Gottwald, 27 €, Stripe-Erstattung 08.09.) am 05.10. angelegt.
- Lexware-Oberfläche ist über Anikas Chrome (Claude in Chrome) erreichbar: Finanzen → Umsätze zeigt die offenen Bankumsätze (lesen geht). ⚠️ Das Bestätigen/Zuordnen von Umsätzen in der Oberfläche blockt die Auto-Mode-Sicherheitsprüfung → Belege per API anlegen, Lexware schlägt sie dann unter „Vorschläge prüfen" vor, Anika klickt „Alle annehmen".
- PayPal zahlt oft unter anderem Namen als die Käuferin (Ehepartner, Geburtsname): Ralf Mönch = Annette Mönch, Frank Dorssers = Sarah Gelath-Dorssers, Stefan Kissling = Yvonne Kissling, Pia Susanna Korora = Kaakinen, Nikita Holdermans = Nikita Paters. Deshalb kommt für diese kein Auto-Vorschlag.
- Feste Zuordnungen laut Historie: Stripe „ThriveCart application fee" → Nebenkosten des Geldverkehrs (keine Steuer); Überweisung an PayPal und deren Rücküberweisung → Geldtransit; Petra Schröders Doppelzahlung 2.500 € (09.08.) → Durchlaufende Posten.
- 05.10.: TC-306-R2 (Nicola Sperling, 2. Rate 165 €) und Oktober-Rechnungen TC-395 bis TC-400 angelegt.
- ⚠️ Teilzahlungen, zwei Fälle (Stand 05.10.2026): **ThrivePay/Stripe-Raten** (z.B. Miriam Reusche, Gelände-Programm 4 × 165 €, Raten am 27. des Monats) legt „Stripe Invoicing" in Lexware AUTOMATISCH als Beleg mit PDF an (Nummern 4KTEVAST-0001, -0002 …). Dafür KEINE eigenen Belege anlegen. Weil `lexware-import.js` die erste Zahlung zusätzlich als TC-Nummer bucht, entsteht bei Rate 1 eine Dublette: Der Stripe-Beleg der 1. Rate bleibt offen und muss gelöscht werden (4KTEVAST-0001 von Anika am 05.10. gelöscht, TC-317 bleibt). **PayPal-Raten** (z.B. Nicola Sperling) kommen nicht automatisch → Folgeraten von Hand als `TC-<Nr>-R2`, `-R3` … anlegen.
- Belege endgültig löschen macht Anika selbst (Papierkorb im Beleg). Claude öffnet ihr den Beleg per `https://app.lexware.de/permalink/vouchers/view/<id>` in Chrome.
- Zweiter Fall derselben Dublette: Melanie Romberg, „Gelände sicher meistern" Teilzahlung 2 × 59 € über Stripe (1. Rate 19.09., 2. Rate ~19.10.). Stripe-Beleg 2UP9DH37-0001 ist bezahlt/zugeordnet, Skript-Beleg TC-365 war die offene Dublette (05.10. Anika zum Löschen geöffnet). Regel: Bei Stripe-Teilzahlungen den Beleg behalten, an dem die Zahlung hängt, den anderen löschen. ⏭️ Skript-Verbesserung offen: ThrivePay-Teilzahlungen (item_pricing_option_name enthält „Teilzahlung", processor thrivepay) beim Import überspringen.
- ✅ 05.10.2026 eingebaut: `lexware-import.js` überspringt Stripe-Teilzahlungen (`processor thrivepay` + `related_to_recur` + `subscription_id` beginnt mit `sub_`), zählt sie aber weiter in der OSS-Zusammenfassung. TC-365 von Anika gelöscht. ⏰ PayPal-Folgeraten im Blick behalten: Nicola Sperling (Rate 3 ~24.10., Rate 4 ~24.11.), Jasmin Heller Longentraining 6 × 49 € (Rechnung 340, Rate 2 ~08.10.).

### Stand 02.11.2026 (Oktober gebucht + wichtige PDF-Grenze entdeckt)
- ⚠️⚠️ **PDF lässt sich NICHT nachträglich an einen schon zugeordneten Beleg hängen.** `POST /vouchers/{id}/files` liefert dann **HTTP 406** `action_forbidden_business_transactions_banktransaction`. Sobald die Bankzahlung einem Beleg zugeordnet ist (Status „paid"/`openAmount 0`), ist der Beleg gesperrt. → **Konsequenz: IMMER mit PDF-Ordner buchen (nicht `--month` ohne PDFs), BEVOR die Zahlung zugeordnet wird.** Prüfen ob ein Beleg schon ein PDF hat: `GET /vouchers/{id}` → Feld `files` (leer = keins; es gibt KEIN `GET /vouchers/{id}/files`, das ist 404).
- **September-Problem (ungelöst):** September wurde am 01.10. über den Notweg `--month` OHNE PDFs gebucht und die Zahlungen schon zugeordnet. Die 62 Original-PDFs (ThriveCart schickte sie erst Ende Okt., liegen in `Desktop\September`) lassen sich per API NICHT mehr dranhängen (alle 406). Bleiben nur: in Lexware-Oberfläche von Hand anhängen (62×, mühsam) ODER September-Ordner als Archiv behalten (Anika soll mit Steuerberaterin klären). Anika zur Kenntnis gegeben, Entscheidung offen.
- **Oktober KOMPLETT gebucht (02.11.):** Lose PDFs vom Desktop in `Desktop\Oktober` einsortiert (29 Stück, Nr. 306/317/340/365 Folgeraten + 393–418). `node scripts/lexware-import.js "C:\Users\Olive\Desktop\Oktober" --all`: **17 neu gebucht (TC-401…418), alle mit PDF ✓, 0 Fehler.** 395–400 waren schon gebucht (Routine 01.11.), ohne PDF, aber schon zugeordnet → PDF nicht nachrüstbar (406).
- **PayPal-Folgeraten Oktober von Hand gebucht (02.11.):** `TC-306-R3` (Nicola Sperling, Gelände-Programm Rate 3, 165 € DE 19%, 24.10.) und `TC-340-R2` (Jasmin Heller, Longentraining Rate 2, 49 € DE 19%, 08.10.), beide mit PDF ✓. TC-306-R2 existierte schon. 317 (Miriam Reusche) ist **thrivepay/Stripe** → Rate 2+3 kommen automatisch über Stripe Invoicing, NICHT selbst buchen.
- ⏰ Noch offen/kommend: Nicola Sperling Gelände Rate 4 (~24.11., PayPal, als `TC-306-R4` buchen), Jasmin Heller Longentraining Raten 3–6 (~08. jeden Monats, je 49 €, als `TC-340-R3…` buchen). Stripe-Raten (Miriam Reusche, Melanie Romberg) laufen automatisch.
- **Helfer-Skripte dieser Session** (im Session-Scratchpad, nicht dauerhaft): `attach-pdfs.js` (hängt PDFs an bestehende, NOCH NICHT zugeordnete Belege; prüft `files`-Feld gegen Dubletten) und `book-rebills.js` (bucht fehlende PayPal-Folgeraten als TC-<inv>-R<n>). Bei Bedarf in `scripts/` übernehmen.

---

## Ausgabenbelege → Lexware

Anikas Ausgabenbelege liegen als PDF in `C:\Users\Olive\Documents\Anika\steuer\Belege` (lose Dateien = laufendes Jahr, Unterordner `Belege <Jahr>` = Archiv). Sie bucht daraus monatlich Eingangsrechnungen in Lexware, normalerweise 20 bis 35 pro Monat. Seit 01.09.2026 kann Claude das übernehmen: Kategorie und Steuerfall NIE raten, sondern aus einem früheren Beleg desselben Lieferanten übernehmen (`/voucherlist` nach `contactName` filtern, dann `GET /vouchers/{id}`).

⚠️ **Digistore24 ist eine EINNAHME, keine Ausgabe.** Die „Zahlungsübersicht #NNNNN" ist ein Auszahlungsbeleg für Anikas eigene Verkäufe und wird als `salesinvoice` gebucht, Sammelkontakt „Digistore24 GmbH", Belegnummer = Nummer der Zahlungsübersicht, 19 %, Kategorie Einnahmen.

⚠️ Manche Lieferanten laufen über `useCollectiveContact: true` + `contactName` (Anthropic, Kenzie, Digistore), andere über eine echte `contactId` (Meta, United Media, Raiffeisen). Vor dem Buchen am Referenzbeleg prüfen, sonst schlägt es fehl.

⚠️ Digistore-Belege können bei der USt 1 bis 2 Cent von Lexwares Berechnung (brutto/1,19) abweichen, weil sie Summen vieler Einzelposten sind. Lexware lehnt das mit `invalid_taxamount` ab. Anikas Entscheidung vom 01.09.2026: mit Lexwares berechnetem Wert buchen und die Abweichung im `remark` festhalten. Nicht jedes Mal neu nachfragen.

Meta-Rechnungen ohne Rechnungsnummer im PDF: Transaktions-ID als Belegnummer verwenden (Anikas Vorgabe).

Kategorien laut Historie: Meta → Anzeigen Print- und Online (0 %), Anthropic → Lizenzen und Konzessionen (19 %), Kenzie Dysli → Fortbildung, United Media → Marketing, Raiffeisen → Material/Waren, Susanne (Freelancerin) → Freelancer/Freie Mitarbeiter (0 %, Kleinunternehmerin).

Siehe [[project_lexware_buchhaltung]].

### Stand 01.10.2026

Die am 01.09. offenen Belege (Megatape, Zoom, Slack, Meta August 8, Hufe August = Pferdetherapie Kettlitz 1955) sind inzwischen alle in Lexware. Am 01.10. von Claude gebucht (mit PDF): Digistore #100893/#104306/#106176, Kenzie INV2602262, Moroselia LLC 202537-06 (650 €, letzte Teilrechnung), United Media 288697, Susanne 09/26-01, Namotto 111-81309-2-0000708 (Sophies Salesmail-Vorlagen → Fortbildung 19 %).

Nach Anikas Ok ebenfalls am 01.10. gebucht: Raiffeisen RE798604 (57,39 €, 7 %), VOSS Heuvlies 2026-30768828, Krämer VIP 419701067, HorSense LH-2400983. Der Belege-Ordner ist damit bis 30.09.2026 komplett in Lexware.

Anikas Entscheidungen (nicht neu nachfragen): Raiffeisen-Rechnungen komplett als Material/Waren buchen, auch wenn Süßigkeiten drauf sind. Heuvlies/Stallbedarf von Voss → Material/Waren. Krämer VIP-Service → Sonstige Ausgaben. Gekaufte Online-Kurse (HorSense/Linenhof) → Fortbildung 19 %. Namotto → Fortbildung (19 %), Moroselia → Fortbildung (0 %).

Claude kann per API nur Belege anlegen und PDFs anhängen. Die Verknüpfung Beleg ↔ Bankumsatz bestätigt Anika selbst in Lexware (Umsätze zuordnen).

### Stand 02.11.2026
- ⚠️⚠️ **Ausgabenbelege sind voucherType `purchaseinvoice`** (NICHT `purchasevoucher` → liefert 0 Treffer!). Dubletten-Check + Lieferanten-Vorlage immer über `/voucherlist?voucherType=purchaseinvoice&voucherStatus=open,paid,voided,transferred&size=250` (paginiert), Match per `voucherNumber` (= Rechnungsnummer).
- ⚠️ **Dateidatum ≠ gebucht.** Von 11 seit dem 01.10. in den Belege-Ordner dazugekommenen Dateien waren 9 schon gebucht (eine Session zwischen 01.10. und 02.11. hat weiter gebucht): Meta Sep 1–4 + „Okt 1" (alle FBADS-257-106432738/…442013/…477275/…527661/…579669, 0 % RC), Claude Sep (9BF0758D-7183630), United Media Nov (291681), Amazon Laubsack (DE688YT3KAEUD, 7 %), Digistore #107942. IMMER per voucherNumber gegen Lexware prüfen, nie nach Dateidatum buchen.
- **Nur 2 offen, am 02.11. gebucht (purchaseinvoice, useCollectiveContact:true + contactName, mit PDF):** Kenzie Oktober `INV2602519` 65 € (10,38 € USt 19 %, Fortbildung) und All-inkl 3 / „Neue Medien Münnich" `2261757107` 23,85 € (3,81 € USt 19 %, Webhosting).
- **Sammelkontakt-Buchungs-Body** (bestätigt an Kenzie/Münnich): `{type:"purchaseinvoice", voucherNumber, voucherDate:"YYYY-MM-DD", totalGrossAmount, totalTaxAmount, taxType:"gross", useCollectiveContact:true, contactName, remark, voucherItems:[{amount,taxAmount,taxRatePercent,categoryId}]}`. Kein contactId.
- **Kategorie-IDs bestätigt 02.11.:** Kenzie Dysli → Fortbildung `5bc9acec-85af-48dd-a4c3-9ccc4ea6ac80` (19 %); Neue Medien Münnich/all-inkl + Anthropic → `b49aae5f-4121-4262-b8bd-f49278b66423` (19 %, Lizenzen/Hosting, Sammelkontakt); Meta → `d22989b0-fd89-11e1-a21f-0800200c9a66` (0 %, echter contactId 5e48022b-…, Belegnr = Rechnungsnummer FBADS-… aus dem PDF); United Media → `d22989b3-fd89-11e1-a21f-0800200c9a66` (19 %, contactId 90393b19-…); Amazon → `16d04a29-fd91-11e1-a21f-0800200c9a66` (7 %, contactId ba99f07e-…); Digistore (Einnahme/salesinvoice) → `8f8664a1-…` (19 %, Sammelkontakt).
- Helfer dieser Session im Scratchpad: `extract-belege.js` (PDF-Text via pdf-parse), `ref-lieferanten.js` (Lieferanten-Vorlage + Dubletten), `book-expenses.js` (bucht purchaseinvoice + PDF). Bei Bedarf nach `scripts/` übernehmen.

### Offen, Stand 01.09.2026 (Feierabend, überholt)

Noch NICHT gebucht, liegen fertig im Belege-Ordner: Megatape-Reitshop Rechnung 40302015 vom 31.08. (18,85 € brutto, 3,01 € USt, 19 %), Zoom INV366927855 vom 20.08. (46,50 €, Reverse Charge, 0 % USt, neuer Lieferant ohne Vorlage), Slack August SBIE-12613507 vom 25.08. (9,82 €, 1,57 € USt), Meta August 8 vom 24.08. (419,78 €, 0 %, Rechnungsnummer noch nicht geprüft) sowie `Hufe August.jpg` (noch nicht ausgelesen).

Zwei Lexware-Umsätze ohne Beleg: **FFA GmbH 38,91 € vom 20.08.** (völlig unbekannt, kein Treffer in 1.178 Eingangsrechnungen, Anika wollte in PayPal nachsehen) und ein **Digistore-Einkauf 20,23 € vom 17.08.** (Rechnung über die E-Mail-Suche nicht auffindbar). Ohne Beleg nicht buchen.

Die Zuordnung der Umsätze hat Anika am 01.09.2026 selbst komplett erledigt, da ist nichts mehr offen. ⚠️ Für kommende Monate trotzdem wichtig: Lexwares automatische Vorschläge raten bei den vielen gleich hohen 27-€-Belegen fast immer falsch, der Name muss geprüft werden. Hilfsmittel dafür war `Desktop\Zuordnung August 2026.html` (Suche nach Name oder Stripe-ID → TC-Nummer), so eine Liste lässt sich jederzeit neu erzeugen.

Offene Kleinigkeit: Kontakt „Petra Tier" (thier59@web.de, Belege TC-253/TC-254) heißt laut Rechnung 254 eigentlich „Thier", Korrektur angeboten und noch nicht entschieden.

---

## Banking-Routine

Anika baut eine **Banking-Routine** (Mehr-Konten-/Envelope-System, Idee "goldene Gans" aus Bodo Schäfers "Ein Hund namens Money"): Einnahmen aufteilen, Überblick über monatlichen Bedarf vs. Überschuss, Überschuss in Fonds (Gans) + Schuldenabbau + Träume.

**Datengrundlage (gelesen, April–Juni 2026):** 4 Konten in `C:\Users\Olive\Documents\Kontoauszüge\Konto 2026\`:
- Qonto = Geschäftskonto 1 = **Einnahmen-Zentrale** (Digistore24 + PayPal-Auszahlungen + Kundenrechnungen)
- Wespa (Weser-Elbe Sparkasse) = Geschäftskonto 2, chronisch im Minus (zeitw. −9.200 €, Kreditlimit 10.000 @ ~10,5% Zinsen); trägt Hof-/Immobilien-Darlehen (~164k Saldo, ~1.843/Mon) + Meta-Ads (~782 €/Buchung)
- DKB Privat (Giro 1056507666) = ihr Privatkonto
- DKB Gemeinschaft (Giro 1059727246) = Haushalt mit Ehemann Oliver (Oliver zahlt regelmäßig mit ein)
- **PayPal = faktisch 5. (Schatten-)Konto** — Einnahmen/Ads laufen teils dort; Routine: regelmäßig auf Qonto leeren

**Ihre Kostenaufstellung** (`C:\Users\Olive\Documents\Anika\Gewerbe\Businesscoaching\Kostenberechnungen\Kostenaufstellung.xlsx`): teilt in **Privat / Online Business / Hof**. Fixkosten/Monat: Privat ~2.220, Business ~3.232 (inkl. Werbung 2.000), Hof ~1.929. Ihr berechneter Mindest-Nettoumsatz 8.147 € (9.695 € brutto), 17% Steuerrücklage, 6 Wo. Urlaubs-/Krankheitspuffer. Zahlt sich ~3.000 € Gehalt.

**Kernbefunde:** Ø Business-Einnahmen ~8.440 €/Mon (interne Umbuchungen "Geldtransit"/"Privatentnahme" + Kredite rausgerechnet); feste Auszahlungen ~8.160 €/Mon → im Normalmonat nur ~280 € Luft vor Steuer, Überschuss v.a. in Launch-Monaten (Juni-Launch). Juni mit Bankdarlehen 17.750 € + Geld von Oliver überbrückt. **Fehlt: echtes Steuer-Konto** (USt läuft direkt ab, Finanzkasse Wesermünde). 2 Business-Konten mit viel Geld-Hin-und-Her.

**Entscheidungen der Userin:**
- **Hof ist KEIN eigenes Business mehr** → läuft übers Online-Business; Pferde = Darsteller für Lehrvideos/Marketing → Hof-Kosten geschäftlich absetzbar (senkt Steuer). Hof = Kostenblock des Business.
- **Überschuss parallel:** Schuldenabbau (v.a. teurer Wespa-Dispo, ~10,5%) UND Gans gleichzeitig.

**Vorgeschlagene Routine** (Deliverable: `outputs/banking-routine/banking-routine.html`, Erdtöne/Montserrat): Alle Einnahmen → Qonto; am Zahltag feste Reihenfolge: 1) PayPal leeren 2) Steuer ~20% weg 3) Gehalt fix (3.000) → DKB Privat 4) Haushalt → DKB Gemeinschaft 5) Business+Werbung 6) Hof-Budget 7) Rücklagen (Jahreszahlungen: Heu 1.900 etc.) 8) Rest = Überschuss → Startsplit 40% Schulden / 40% Gans / 20% Träume.

**Korrekturen/Klärungen (Session 2026-07-29):** Steuer-Unterkonto existiert BEREITS (nicht mehr „fehlt"). Wespa-Dispo ist AUSGEGLICHEN (teurer ~10,5%-Dispo weg). PayPal + Stripe zahlen JEDEN MONTAG automatisch auf Qonto aus → kein manuelles „PayPal leeren" nötig, Qonto ist echtes Sammelkonto. Maren = letzte unregelmäßige Reitschülerin = Business-Dienstleistung (NICHT Hof-Einnahme); keine Einsteller mehr. Wespa trägt bewusst nur: 2 Kreditraten (groß 1.246 + klein 597,50 GB AG), Meta-Ads, Hufbearbeiterin (Kettlitz per Karte, steckt in „Pferde Schmied/Futter 330").

**Kostenaufstellung durch Auszüge verifiziert & aktualisiert (Deliverable outputs/banking-routine/banking-routine.html, Blöcke jetzt monatlich-oben/jährlich-unten sortiert):**
- Privat ~2.120 €/M. Lexware Office L→**XL 32,90€ netto** (upgrade erledigt, [[project_lexware_buchhaltung]]). Spotify 12,99 + Audible 9,95 (getrennt). Autokredit=Bank11 400,81.
- Business ~3.670 €/M. Neu/korrigiert: auxmoney-Kredit 406=„Fortbildung"; Julia Trost 84€/M (Fortbildung 12 Mon ab 04/2026, befristet); Kenzie Dysli 65€/M (Fortbildung bis Jahresende, befristet); Laura Guvener 97€/M = „Devine Funnels" (war fälschlich jährlich→ist monatlich); Thrivecart Learn ~200€/J; ManyChat 25 USD ~21,50€; Claude Pro 21,42€; Steuerberater hochgezogen auf 3.000€/J (letzte Erklärung kostete 3.000); Werbung 2.000€ = Ø/Obergrenze (schwankt, real eher 1.300-1.700 Meta); STRATO fällt weg. Business-/Hof-Puffer-Zeilen raus (echter großer Puffer wird separater Rücklagen-Topf).
- Hof ~2.565 €/M. Darlehen real **1.843€** (597,50+1.246, inkl ~103€ USt durchlaufend; ihre 1.740 war netto). Einstreu 120→200€/J. Betriebshaftpflicht 298→556€/J. Vereinsbeiträge (Stotel/LAG) raus. Uelzener 4,70€/M = Rechtsschutz Pferd (neu). Hof komplett geschäftlich absetzbar.
- ⚠️ Deka-Sparplan: in KEINEM Auszug (Apr-Jul) auffindbar → läuft evtl. über Deka-Depot direkt; Betrag/Konto noch offen.

**Web-Tool „Geld-Töpfe" gebaut (outputs/banking-tool/index.html, für Netlify wie Futterrechner):** Single-Page-App, Erdtöne/Montserrat, responsive, localStorage. Wasserfall-Prinzip: Einnahmen füllen Kostentöpfe in Reihenfolge Privat/Gehalt (3.000) → Business (3.670) → Hof (2.565); Break-even 9.235 netto; darüber Gewinn → Steuer (30% auf Gewinn, Startwert) → Rest split Schulden/Gans/Träume (40/40/20). Features: wöchentliche Eingabe mit Datum, Monats-Blättern, „Was steckt drin?" pro Topf (echte Posten), einstellbare Beträge/%. NEU: Rubrik „Weitere Ausgaben" (variabel, mindern verfügbar vor den Töpfen). NEU: Einnahme-Status „eingegangen" vs „erwartet" → Töpfe zählen nur Eingegangenes, Erwartetes läuft in helle Prognose-Zeile („wenn das kommt, hättest du X verfügbar + Y Gans"), Button „ist da" macht erwartet→eingegangen. Anika mag es sehr. Tech: kein Backend nötig; JS-Syntax + Wasserfall-Logik per Node `new Function()` + isolierter Nachrechnung getestet (lokale file:// rendert in Preview nur statisch → im echten Browser via `start` testen). ⚠️ USt bewusst draußen (durchlaufend), Umsatz NETTO eintragen.
USt-Handling im Tool: Tool rechnet intern NETTO (Kosten netto, Break-even netto). Einnahmen sind IMMER brutto (Digistore/Stripe/PayPal zahlen alle brutto aus) → automatisch brutto 19%, keine Auswahl nötig, USt wird rausgerechnet (netAmount = betrag/1,19). Ausgaben: pro Eintrag Satz wählbar brutto 19% / brutto 7% / netto (z.B. Kfz-Steuer=netto/keine USt, Bücher=7%). Jeder Eintrag (Einnahme+Ausgabe) hat Inline-Dropdown zum nachträglichen Ändern + Bulk-Buttons „alle Einnahmen/Ausgaben → brutto 19%". USt-Zahlung ans Finanzamt wird NICHT als Ausgabe eingetragen (durchlaufend, läuft übers Steuer-Konto). **Anika = Einzelunternehmen** → Steuer-Reihenfolge im Tool korrigiert: Einkommensteuer wird auf den Gewinn VOR Privatentnahme gerechnet (Netto-Umsatz − Business − Hof − zusätzl. Ausgaben), NICHT nach Gehaltsabzug (Privatentnahme ist keine Betriebsausgabe). Oben: Eingegangen − Fixkosten (Business+Hof+Gehalt) − zusätzl. Ausgaben − Steuer-Rücklage = frei verfügbar; Abschnitt 2 verteilt nur noch das „frei" auf Schulden/Gans/Träume (40/40/20). ⚠️ Folge: echte Gewinnschwelle liegt ÜBER den 9.344 € Fixkosten (bei 9.344 Umsatz fällt ~900 € Steuer auf den Gewinn=Gehaltsanteil an → Tool zeigt „Steuer-Rücklage fehlt noch" rot). Brutto-Umsatz-Ziel (klein unter Fixkosten) bezieht sich bewusst NUR auf Fixkosten (costTotal×1,19 ≈ 11.119). Steuersatz 30% = Startwert, mit Steuerberaterin klären. Kostentöpfe steuerlich geklärt: Privat/Gehalt=Cash-Entnahme (brutto, keine Vorsteuer, korrekt ohne Umrechnung); Business=netto (Vorsteuer kommt zurück); Hof=netto; ⚠️ OFFEN: Hof-Darlehen steht brutto 1.843 (inkl ~103 USt) — auf Netto-Basis müsste 1.740 sein, falls USt Vorsteuer ist (mit Steuerberaterin klären). ⚠️ Ich kann Anikas eingetragene Daten NICHT von hier ändern (liegen in ihrem Browser-localStorage) → dafür Inline-Dropdowns + Bulk-Buttons gebaut, sie korrigiert selbst. Sichern/Laden-Button (JSON-Export/Import) eingebaut, WICHTIG weil localStorage an file://-Origin hängt und beim Umzug auf Netlify NICHT mitkommt.
Überschuss-Logik GEÄNDERT (statt %-Split 40/40/20): jetzt kumulative **Treppe Olli → Puffer → Gans**. Anikas Wunsch: erst Olli 1.500 € zurückzahlen (letzte Schuld, Dispo ist schon weg), dann Puffer/Notgroschen bis 10.000 € aufbauen (schützt die Gans, kein Dispo mehr), DANN erst Gans füttern. Tool summiert `frei` (max,0) über alle Monate = totalFrei, füllt Olli(1500)→Puffer(10000)→Gans(rest) mit Fortschrittsbalken; Beträge in Einstellungen konfigurierbar (cfg.olli, cfg.puffer). Träume rausgenommen. Mitwachsende-Gans-Idee ist damit erledigt (Gans wächst kumulativ als letzter Topf).
Offene Tool-Ausbaustufe: Abbuchungs-Kalender (wann im Monat welche Rate runtergeht) — noch offen. Monats-Tracker als Excel (outputs/banking-routine/monats-tracker.xlsx) existiert auch, aber Tool ist der bevorzugte Weg (Excel „nicht sexy").

**Offen / nächste Schritte:** Deka-Sparplan-Betrag+Konto klären; Top-KPIs im HTML auf finale Zahlen aktualisieren (Ø-Einnahmen ~8.440, „fehlender Topf Steuer" ist überholt); Überschuss-Verteiler ggf. neu gewichten (Dispo weg → mehr Gans); Steuersatz mit Steuerberater fixieren; Gans-Instrument wählen; **Monats-Tracker-Tabelle bauen** (1 Zahl eintippen → Verteilung). ⚠️ KEINE Anlage-/Steuerberatung (nur Struktur/Organisation). Tools: kein Python → PDF via Node `pdf-parse` (PDFParse-Klasse), xlsx via SheetJS (scratchpad). Siehe [[user_profile]], [[project_lexware_buchhaltung]], [[project_thrivecart]].

---

## Finanzauswertung 2025 (alle Konten)

Am 09.10.2026 alle Kontoauszüge 2025 ausgewertet (Privat DKB, Gemeinschaftskonto DKB, Qonto inkl. Unterkonten, Wespa Giro Business).

**Ablage (bewusst NICHT im Workspace, weil der ins Git-Backup läuft):**
`C:\Users\Olive\Documents\Kontoauszüge\Konten 2025\_Auswertung\` mit `skripte/` (Node-Parser + Report-Generatoren), `daten/` (geparste Buchungen als JSON) und den 3 PDFs. Kopien der PDFs auf dem Desktop. Kein Python auf dem Rechner: Text via `pdftotext -raw`, Auswertung mit Node, PDF via Edge headless.

**Anikas Zuordnungsregeln:**
- Businessposten auf dem Privatkonto raus (Facebook Ads, ManyChat, Slack, JotURL, Digistore24).
- Steuererstattungen sind keine Einzahlung/Ausgabe, getrennt halten.
- Bargeldabhebungen vom Wespa-Konto zählen zu den Privatausgaben.
- Rossmann zählt zu Lebensmitteln; Uelzener = Tierversicherung; „Darlehen GB AG" = grenke Bank (siehe [[project-mikrokredit-grenke]]).
- Dr. Werth = Anikas privater Zahnarzt (auch wenn vom Geschäftskonto bezahlt → privat); Dr. Hohenhaus = Tierärztin; Pferdetherapie Kettlitz = Hufbearbeitung.
- PDFs nur bis einschließlich „Ausgaben pro Monat", keine Einzelbuchungen.

**Ergebnisse 2025:**
- Privat 35.249 € (2.937 €/Monat), darin 15.355 € Einzahlungen aufs Gemeinschaftskonto, 2.850 € Bargeld und 504 € Zahnarzt vom Geschäftskonto.
- Gemeinschaftskonto 40.590 € Ausgaben.
- Business: 143.250 € Einnahmen, 81.017 € Betriebsausgaben, 26.869 € Kreditraten, übrig nach USt und Krediten 17.859 €; Privatentnahmen inkl. Bargeld und Zahnarzt 38.938 €. Lücke gedeckt durch auxmoney-Kredit und ESt-Erstattungen.

**Planung (Stand 09.10.2026):**
- Ziel: 3.000 €/Monat privat entnehmen können. Bedarf 2027 mit abbezahltem Kleinwagen rund 2.908 €, mit jetzigem Auto rund 3.318 €.
- Anika plant, das Auto (Bank11-Kredit, 400,81 €/Monat) zu verkaufen und einen abbezahlten Kleinwagen zu fahren.
- Anika plant, auxmoney + grenke + großes Wespa-Darlehen zu EINEM Geschäftsdarlehen mit 1.452 €/Monat zusammenzufassen (2025: zusammen rund 2.240 €/Monat).
- United Media AG (629,51 €/Monat) läuft bis Mai 2027.

**Why:** Anika will wissen, was sie privat braucht und ob das Business das trägt. **How to apply:** Bei Folgefragen auf diesen Zahlen aufbauen, Skripte im _Auswertung-Ordner wiederverwenden statt neu zu parsen. Keine Anlage- oder Steuerberatung geben (siehe [[project-banking-routine]]).

**2026 (Jan–Sep, ausgewertet 09.10.2026, Daten in `_Auswertung/daten-2026/`):**
- Business-Einnahmen 75.877 € (2025 gleicher Zeitraum 123.555 €, also −39 %); Schnitt 8.431 €/Monat.
- Betriebsausgaben 42.248 €, USt netto 7.798 €, Kreditraten 20.598 €; übrig 5.234 € (582 €/Monat). Privat entnommen rund 22.100 €; Lücke gedeckt durch grenke-Mikrokredit (17.750 € Auszahlung 04.06.2026).
- Privat 25.328 € (2.814 €/Monat). PDFs: *-2026-Jan-Sep.pdf auf Desktop und in Konto 2026. Gemeinschaftskonto 32.810 € Ausgaben.
- Anika: macht vorerst kein Coaching mehr (2025: 31.231 €), überlegt 2 Großpferde zu verkaufen (rund 450 €/Monat); hat 3 Großpferde + 1 Shetty. Schwelle für 3.000 € privat in 2027: rund 116.000 € Jahresumsatz.

**Plan 2027 (Einseiter `Plan-2027-Bedarf-und-Luecke.pdf`, Quelle `_Auswertung/Plan-2027-Bedarf-und-Luecke.html`, Stand 09.10.2026), alles pro Monat auf Basis Schnitt Jan–Sep 2026:**
- Bedarf privat 2.814 €, Business liefert 582 €, Lücke −2.233 €.
- Feste Schritte: kein Coaching +698 (Julia Trost = Coaching, 84 €/Monat bis ca. März 2027; Moroselia abbezahlt), Freelancerin/Setterin +200, Auto → Kleinwagen +392, Putzfrau (aus Bargeld) +140, United Media bis Mai 2027 +309, Umschuldung auf 1.452 € +837 → Puffer +343 €. Ohne Umschuldung −575 €.
- Optionen: 1 Großpferd + Shetty verkaufen +340 (inkl. Pferdezahnarzt, Pflegemittel); Unterricht vor Ort 2 Std./Woche (95 € eigenes Pferd, 85 € fremdes) +655 nach USt.
- Meta Ads (rund 1.620 €/Monat) unverändert eingerechnet; Anika will sie reduzieren und mit organischem Instagram-Content auffangen, Zielbetrag offen.
- Weitere Zuordnungen: Hermes und Partner = Steuerberater (Gemeinschaftskonto); Agrarhof Schween = Heu; Anne Ehlers = Steuerberatung; Barnery = Kundenpräsente; Dammann = Trecker-Reparatur; MC Handelsgesellschaft = Pferdefutter; CUX EO 134 / EE 579 = Trecker und Pferdeanhänger.
- Offene Datei-Hinweise: Auf dem Desktop sind teils die Dateien mit „-neu" die aktuellen (Geschaeftskonten-2025, Plan-2027), weil die Originale beim Überschreiben geöffnet waren.

**Plan 2027, Neufassung 12.10.2026 (ersetzt die Schritte/Optionen oben):**
- Feste Schritte: Coaching +698, Freelancerin +200, Auto +392, Putzfrau +140, Shetty verkaufen +190 (Anikas Fixkosten-Angabe), Unterricht vor Ort 4 Plätze/Woche (3×85 + 1×95 brutto; abzüglich bisheriger Lastschrift-Unterricht 198 €/Monat und USt) +1.108, 2 ZUSÄTZLICHE Tiergespräche/Monat à 150 brutto (zum 1 aus dem Schnitt 2026) +252, United Media +309, Umschuldung +837 → Puffer +1.893 €; ohne Umschuldung +975 €.
- 5. Unterrichtsplatz = Ausfallpuffer, nicht eingerechnet.
- Notfalloptionen: Trecker verkaufen (rund 20.000 € brutto, einmalig), Stute Mari verkaufen (+200 €/Monat Fixkosten).
- PDF wurde mit Chrome headless gedruckt (Edge schrieb an dem Tag keine Datei); eigenes --user-data-dir angeben.
- Für den Bankberater (Umschuldung): Einseiter Plan-2027 neutral formuliert (kein du/ich) + `Planzahlen-2027.pdf` (Querformat: Ist 2025 / Hochrechnung 2026 / Plan 2027 + Monatsplan; Skript `skripte/planzahlen.js`). Planzahlen: Einnahmen 120.580, Betriebsausgaben 38.152, USt 14.335, Kredite 17.424, privater Bedarf 27.390, Überdeckung 23.279 (1.940/Monat; Einseiter zeigt 1.893, Differenz = United Media dort als Durchschnitt gerechnet).

**Stand 13.10.2026:**
- Beide Bank-Blätter final formuliert (neutral, Kachel „Nach allen geplanten Schritten", Abschnitt „Mögliche Szenarien", Hinweis „bewusst konservativ" beim Online-Umsatz, Unterricht: „früher gut 10 bis 12 Einheiten pro Woche" = Anikas Angabe). Einseiter-Puffer +1.893 €/Monat, ohne Umschuldung +975 €. Auto wird getauscht (kein Kaufpreis), Shetty bringt kaum Erlös.
- Offen aus meiner Sicht: Heukauf (2025: 1.960 € im November) fehlt in der Jan–Sep-Basis; Q4 2025 war umsatzschwach; Einseiter (1.893) und Planzahlen (1.940) weichen wegen United Media leicht ab.
- Neue Anfrage: Züchterin/Stallbetreiberin (40 Min. Anfahrt, Halle) möchte Jungpferdetraining; Anika würde selbst mit den Pferden arbeiten, Preis noch nicht besprochen. Mein Vorschlag: fester Vormittag, 450 bis 500 € netto Pauschale inkl. Anfahrt, Laufzeit + Kündigungsfrist, Versicherung fürs Anreiten fremder Pferde prüfen. Angebotstext angeboten, noch nicht geschrieben.

---

## Drucker HP DeskJet 2700

HP DeskJet 2700 series im WLAN, IP **192.168.178.40**, Port RAW 9100 (Port „192.168.178.40" bleibt in Windows bestehen).

**Problem, das wiederkehrt (Juni + Sept. 2026):** Druckerwarteschlange verschwindet aus Windows, Standard springt auf PDF24. Fix in 1 Min.:
`Add-Printer -Name "HP DeskJet 2700" -DriverName "HP DJ 2700 series PCL-3" -PortName "192.168.178.40"`, dann als Standard setzen. Danach Acrobat **neu starten** (sonst kommen Aufträge nicht an).

**Wartung ohne Web-Oberfläche** (EWS-HTTPS wird im Browser-Pane wegen Zertifikat geblockt): POST an `http://192.168.178.40/DevMgmt/InternalPrintDyn.xml` mit `<ipdyn:JobType>…</ipdyn:JobType>` (Namespace internalprintdyn/2008/03/21). Typen: `cleaningPage` (druckt nichts), `cleaningPageLevel2`, `pqDiagnosticsPage` (Qualitätsbericht). Tintenstand: GET `/DevMgmt/ConsumableConfigDyn.xml`.

**Scannen, wenn PDF24 keinen Scanner zeigt (01.10.2026):** WIA listet 0 Geräte, stisvc-Neustart braucht Adminrechte (habe ich nicht) → PC-Neustart empfehlen. Sofort-Lösung: direkt per eSCL scannen. POST ScanSettings-XML (Platen, Grayscale8, 300 dpi, A4 2480×3508, application/pdf) an `http://192.168.178.40/eSCL/ScanJobs`, dann GET `<Location>/NextDocument`. Seiten einzeln (Anika legt auf, schreibt „weiter"), zusammenfügen mit `pdf24-DocTool.exe -join -profile default/best -outputFile <ziel> <seiten…>` (ohne `-profile` entsteht keine Datei). Ergebnis auf den Desktop. Kein Python auf dem PC.

**Stand 30.09.2026:** weiße Streifen (Schwarz + Farbe) trotz neuer Schwarzpatrone; 1× Stufe 1 + 2× Stufe 2 → deutlich besser, noch nicht perfekt. Empfehlung: über Nacht ruhen lassen, Textseiten drucken; sonst Patronensitz/Kontakte prüfen, Schwarz reklamieren. Farbe bei 20 % → bald neu. Druckkopf sitzt in der Patrone (HP 305).

---

## Devine API-Zugang

Devine Funnels läuft auf GoHighLevel, White-Label unter `app.devinefunnels.de`. Private Integration Token via Einstellungen → Private Integrations.

⚠️ **Token laufen ab / werden regeneriert.** Der 07/2026-Token war am 12.08.2026 tot (401 „Invalid Private Integration token" an ALLEN Endpunkten). Bei 401 nicht Header debuggen → neuen PIT in Devine erstellen (Scope mind. „View Contacts"). GHL zeigt den `pit-…`-Wert nur EINMAL bei Erstellung, nie wieder auslesbar → es gibt immer nur den in `.env`. Aktueller Token (12.08.2026): `pit-95e27d11-…` in `scripts/.env`.

**Zugang:** `scripts/.env` → `DEVINE_TOKEN`, `DEVINE_LOCATION_ID=YTcO1DtAeZWVMFTPktEB`, `DEVINE_FUNNEL_ID=YP50R9ThSMOKNHmWJ0pr` (Gelände-Schlüssel). Datei ist gitignored.

**Aufruf:** `https://services.leadconnectorhq.com<pfad>` mit Headern `Authorization: Bearer <token>` **und `Version: 2021-07-28`** (ohne Version-Header schlägt es fehl).

**Getestet ✅:** `GET /funnels/funnel/list?locationId=<loc>` → listet alle 12 Funnel mit `_id`. Anikas Funnels: Webinar Traumteamprogramm `o4IC9dOoVQsHisrd8Kg1`, Geländeschlüssel `YP50R9ThSMOKNHmWJ0pr`, Webinar BBP `n4O9NRv5C72FvKDauxqf`, Futter Fahrplan `2eAxDNbE2ETALE13NABK`, Energetik `izPecQP7ksBwXBdUMKh3`, Schluss mit Kopfkino `G6SlgWLlfQHS4MRsdfMw`, Offenstall `D3XfcQiJUfiKLX7Cy4m4`, Gespensterecke `ag5MlvdVwLNgpGB8MCGr`, Quiz Beziehungscheck `cThnoz5Rt1V64Uh9HNOL`, Facebookgruppe `b5dWgKyDRyUtMfTeOAZC`, Test `13a1TCHR91id9f9hpMoS`, Evergreen Code Creator `Bm9DVRxvhzUsNPkckvIm`.

**Getestet ❌ (17.07.2026, nicht raten — gemessen):**
- `/stats/?funnelId=…&fromDate=…&toDate=…` (der interne Endpunkt hinter der Statistik-Seite) → **401** mit dem PIT, auf `services.` UND `backend.leadconnectorhq.com`, auch mit `token-id`-Header oder `channel`/`source`/`version` wie die App sie sendet. **Der interne Abruf akzeptiert nur echte Browser-Sitzungen.** → Besucherzahlen NUR über den eingeloggten Chrome, siehe [[project-ads-auswertung]] und `scripts/devine-besucher.js`.
- `/funnels/page/list` → 401 (vermutlich Scope `funnels/page.readonly` nicht angehakt — Anika hat nicht alle durchgeklickt).
- `/funnels/funnel/statistics`, `/funnels/analytics` → 401 (existieren vermutlich gar nicht).

**Merke:** Die öffentliche GHL-API hat **keinen** Analytics-/Seitenaufruf-Endpunkt. Bei Fragen nach Devine-Statistiken nicht suchen — es gibt ihn nicht.

**Wofür der Token nützlich ist:** Kontakte, Tags, Workflows, Opportunities, Kalender — also Anikas Launch-Listen und Segmentierungen (siehe [[reference-devine-segmentierung]], [[reference-launch-listen-management]]).

**Getestet ✅ (12.08.2026) — Ad/Organisch-Trennung über Kontakt-Attribution:**
- `POST /contacts/search` `{locationId, pageLimit:100, sort:[{field:"dateAdded",direction:"desc"}], searchAfter:<letztes searchAfter>}` → paginiert alle Kontakte. Response-Kontakt hat `source`, `tags`, `dateAdded`, `searchAfter` (für nächste Seite).
- `GET /contacts/{id}` → liefert **`attributionSource`** (ERSTKONTAKT) und `lastAttributionSource` (LETZTE Interaktion). Jeweils mit `url`, `fbclid`, `referrer`, `mediumId` (=Form-ID).
- **Echte Herkunft = `attributionSource.url` (Erstkontakt = Landingpage).** NICHT `lastAttributionSource` (fast immer ein E-Mail-Klick `link.devinefunnels.de/r/2/…`, überschreibt die Herkunft). Klassifikation STRIKT nach Landingpage-URL (`webinar-ads-gelaende`=Ad, `webinar-gelaende`=organisch). Generischen `fbclid` NICHT als Ad werten → bei Bestandskontakten ist das ein alter Erstkontakt von vor Monaten. Bestandskontakte (Erstkontakt = keine Webinar-Seite) nur über Tag zuordnen.
- Skript: `scripts/devine-webinar-split.js` (→ `outputs/webinar-gelaende/webinar-anmelder-split.csv`). Damit am 12.08. den Formular-Bug (Ad-Form auf organischer Seite seit 10.08.) ausgewertet: 75 Anmelder, ~60 Ad / ~15 organisch, 4 fehlattributierte organische umgetaggt.
- **Tags setzen/entfernen:** `POST /contacts/{id}/tags {tags:[…]}` fügt hinzu (funktioniert). ⚠️ `DELETE /contacts/{id}/tags` matcht Tags mit Umlaut NICHT (Unicode NFC/NFD, `tagsRemoved:[]`, oder 422). **Zum Entfernen `PUT /contacts/{id} {tags:[…]}`** mit der von der API gelieferten Tag-Liste (byte-genau) minus dem Ziel-Tag. Skript: `scripts/devine-retag-fix.js`.

**Getestet ✅ (31.08.2026) — Kalender:** `GET /calendars/{id}` (Version `2021-04-15`) liefert die volle Konfiguration inkl. `teamMembers[].locationConfigurations` (`kind: zoom_conference`, `zoomOauthId`). Kalender „Einzelgespräch" = `9icjHh1kdy3f52BZX8hh` (Slug `einzelg`, Anika userId `tcgGHoPvcd84uwGaI3wQ`).

**⚠️ Zoom-Verbindung läuft ab:** Wenn Buchungen keinen Zoom-Link mehr erzeugen → in Devine **Einstellungen → Kalender → Verbindungen → Videokonferenzen** prüfen; dort erscheint dann „Erneut verbinden" (rote Warnung). Zoom-Konto: info@anikas-pferdeakademie.de. So geschehen + behoben am 31.08.2026. Die Kalender-Liste selbst steckt in einem Cross-Origin-iframe (`calendar-app.leadconnectorhq.com`) → Chrome-MCP-Klicks/A11y kommen dort nicht rein; Konfiguration stattdessen per API auslesen.

---

## Devine DND-Verlauf rekonstruieren

Der Kontakt selbst speichert nur den aktuellen DND-Status (`dndSettings.Email.status` + `message`, z. B. „Updated from workflow_<id>"). Der alte Zustand ist dort überschrieben, Devine-Filter helfen nicht.

**Verlauf steht in den Konversationen** (Version-Header `2021-04-15`): `GET /conversations/search?locationId=…&contactId=…` → `GET /conversations/{id}/messages?limit=100`. Nachrichten mit `messageType = TYPE_ACTIVITY_CONTACT` tragen `activity.type`: `contact_dnd_enabled` (Abmeldung, auch manuell), `user_dnd_enabled`, `contact_dnd_enabled_from_workflow`, `contact_dnd_disabled_from_workflow`, `contact_dnd_disabled`; Kanal in `activity.data.channel`.

**DND wieder setzen:** `PUT /contacts/{id}` (Version `2021-07-28`) mit `{dndSettings:{Email:{status:"active",message:"…"}}}` — Tags und übrige Felder bleiben unberührt (getestet 08.10.2026). Body als UTF-8-Bytes senden.

**Kontext:** Am 07.10.2026 hob der Backend-Start-Workflow bei 1.607 abgemeldeten Kontakten das DND auf; am 08.10. wiederhergestellt, Schritt von Anika entfernt. Listen in `outputs/devine-dnd-wiederherstellung/`.

**Versand und Öffnungsrate:** Devine überspringt DND- und ungültige Adressen beim Versand („Übersprungen" in den E-Mail-Details) und rechnet die Öffnungsrate ohne sie (von Anika am 08.10.2026 in der Statistik geprüft). Stand 08.10.2026: 5.290 Kontakte, rund 1.700 mit E-Mail-DND; Tag `newsletter` haben nur Kontakte mit DOI-Tag.

**Tag-Historie:** Devine speichert Tags in Vergabe-Reihenfolge → wer einen Tag erst durch einen bestimmten Workflow bekam, ist an der Position hinter dessen Start-Tag erkennbar. Tags: `POST /contacts/{id}/tags` fügt hinzu, `DELETE` entfernt (ohne Umlaut ok). Nach Aufräumen 08.10.2026: aktive Newsletter-Liste rund 3.030; Ablauf in `outputs/devine-dnd-wiederherstellung/README.md` (CSV-Listen nur lokal, gitignored). Kontakte endgültig löschen macht Anika selbst über Tag `loeschkandidat`; Tags, die leer oder klein sind, will sie behalten.

⚠️ DND-Aufhebung in Kauf- und Freebie-Workflows ist **gewollt** (wer kauft oder ein Freebie anfordert, soll wieder Mails bekommen) → nicht als Fehler melden. Siehe [[reference-devine-api]].

---

## Devine-Tag bestandskunden

Der Tag heißt exakt `bestandskunden` (klein). Bis 31.05.2026 aus der Digistore-Zeit gesetzt, seit ThriveCart (Juni 2026) vergab ihn KEIN Workflow mehr → 303 Lücken.

**24.10.2026:** 302 Kurs-Käuferinnen per `POST /contacts/{id}/tags` nachgetaggt (fügt nur hinzu, andere Tags bleiben). Stand danach: 774 mit Tag, 775 Käuferinnen; einzige Ausnahme absichtlich = Testkontakt `648456@test-ds24.com`. Liste: `outputs/bestandskunden-abgleich/`.

Als Kauf-Tags gezählt: alle Kurs-/Programm-/Bump-/Upsell-Tags (gelände-schlüssel, gelände sicher meistern, gelände-programm, audio hoftor, videoreihe ruhig bleiben, notfall-paket, traumteam-*, handarbeitskurs*, longenkurs*, offenstallplaner, finanzplaner, futter-*, energetik-programm/-selbstlerner/-erledigt, gespensterecke, kopfkino, fragerunde*, mitgliedschaft u. a.). **Auch VIP-Pakete (9 €) zählen** (Anikas Entscheidung 24.10.: einheitlich): 101 VIP-Käuferinnen ebenfalls nachgetaggt → 875 von 876 Käuferinnen haben den Tag. Nicht gezählt: „online training 1/2/3“ (unklar ob Kauf).

Dauerlösung ✅ (24.10.2026 von Anika gebaut): im Workflow „Verbindung zu Thrive Cart“ direkt nach „Kontakt erstellen“ die Aktion „Tag hinzufügen: bestandskunden“ → jede neue Käuferin (auch VIP) bekommt ihn automatisch.

Überschneidung mit Gelände-Webinar 10.26 (Stand 24.10.): 24 Bestandskundinnen (21 organisch, 3 Ads). Zusammenfassung + Namen: `outputs/bestandskunden-abgleich/2026-10-24-bestandskunden-abgleich.md`.

⚠️ `/contacts/search` hinkt nach Tag-Änderungen ein paar Sekunden/Minuten hinterher → Nachkontrolle direkt nach dem Taggen per `GET /contacts/{id}`, nicht über die Suche. Siehe [[project-thrivecart]], [[reference-devine-api]].

---

## Devine Segmentierung

Regeln für Segment-/Empfänger-Filter in Devine Funnels (GHL-basiert):

**Grundregel:** Positive Treffer (wer soll rein) = ODER (einer reicht). Ausschlüsse (wer soll raus) = immer UND + „Ist nicht". Gemischtes ODER/UND in einer flachen Liste ist gefährlich: ohne Gruppierung kann das System AND vor OR auswerten, sodass Ausschlüsse nur für die letzte ODER-Zeile gelten. Lösung: positive Treffer in eine eigene Bedingungsgruppe.

**Smarte/dynamische Listen lassen sich NICHT negieren.** „Ist in Liste" geht, „Ist nicht in Liste" wird bei intelligenten Listen nicht angeboten. Workarounds:
1. De-Morgan: „nicht in Liste X" = jedes zugrundeliegende Tag einzeln mit „Ist nicht" + UND ausschließen. NICHT(A ODER B ODER C) = NICHT A UND NICHT B UND NICHT C.
2. Sammel-Tag: beim Eintritt in eine Sequenz allen Empfängern denselben Tag setzen (z.B. `energetik-prelaunch`), dann später nur diesen einen Tag mit „Ist nicht" ausschließen. Tags sind negierbar, Listen nicht.

**Konkreter Fall Energetik-Launch (Juni 26):** Bestandskunden-Liste = wer eins von traumteam-programm/traumteam erledigt/handarbeitskurs/longenkurs/futter-fahrplan/gelände-schlüssel hat. Energetik-Ausschluss-Tags: energetik-programm, energetik-selbstlerner, energetik-erledigt. Warteliste: energetik warteliste. Drei parallele Sequenzen: Bestandskunden, Warteliste, kalte Hauptliste (jeweils gegenseitig ausschließen).

Siehe [[reference-launch-listen-management]].

---

## ManyChat → Devine Anbindung

ManyChat (Pro, Account fb2157153) hat keine fertige Devine/GHL-Integration. Verbindung läuft über „Make External Request" im Flow Builder direkt an die Devine-API (siehe [[reference-devine-api]]). Quick Automations können das nicht, dafür muss die Automation im Flow Builder neu gebaut werden.

**⚠️ Gemessen am 05.10.2026:** `POST /contacts/upsert` mit `tags` im Body ÜBERSCHREIBT alle vorhandenen Tags des Kontakts. Deshalb immer zwei Anfragen:
1. `POST /contacts/upsert` nur mit `{locationId, email}` → Antwort `$.new` (true/false) und `$.contact.id`
2. `POST /contacts/{id}/tags` mit `{"tags":["…"]}` (fügt hinzu, löscht nichts)

Header je Anfrage: `Authorization: Bearer <PIT>` und `Version: 2021-07-28`. Den Token trägt Anika selbst ein (ich darf keine Tokens in fremde Felder tippen); im Entwurf steht der Platzhalter `HIER-DEVINE-SCHLUESSEL-EINFUEGEN`.

**ManyChat-Felder (User Fields):** `devine_neu` (Text, aus `$.new`), `devine_contact_id` (Text, aus `$.contact.id`).

**Ablauf-Muster:** DM mit Button → Condition „Email is unknown" → ja: Data Collection (Reply Type Email, in System-Feld speichern, „Set Email Opt-In" aus) → Anfrage 1 → Anfrage 2 → Condition `devine_neu is true` → DM neu / DM bekannt, jeweils mit Link-Button. Devine-Workflow startet auf den Tag und schickt die Mail.

**Entscheidungen von Anika (05.10.2026, für den Piloten):** Link kommt im DM UND per Mail; Bestandskontakte bekommen einen anderen DM-Text; Einwilligung über Hinweissatz im DM, kein Double-Opt-in.

**Pilot:** Entwurf „Gras-Videoanleitung mit E-Mail (Entwurf)" im Ordner Videos, Tag `mc-grasvideo` (von Anika so benannt; `mc-gras-video` ist ein verwaister Test-Tag). Die Live-Automation „Gras-Videoanleitung" (Codewort Gras) blieb unangetastet.

**Stand 05.10.2026 abends:** Neue Automation ist LIVE (Auslöser Kommentar „Gras" auf allen Posts/Reels), alte Quick Automation „Gras-Videoanleitung" von Anika gestoppt. Devine-Workflow veröffentlicht, hängt zusätzlich Tag `doi` an (Wunsch Anika), dann Mail „Auslieferung" (von Anika im Smart Builder geschrieben). Geprüft: Devine-Hälfte per API-Simulation (Mail kam an), neuer ManyChat-Schlüssel wird akzeptiert (Test Request → 422 „email must be an email" = Auth ok). ⏭️ NICHT geprüft: echte Übergabe von vorname/E-Mail aus ManyChat und Weiche `devine_neu is true` → Anikas Mann kommentiert als Test, danach in Devine Kontakt + Tags + Vorname kontrollieren. Anika hat kein privates Instagram-Konto und will keins anlegen (ManyChat-Test per QR-Code geht bei ihr nicht). Testkontakte in Devine: anikawesse+mctest@ und +grastest@gmail.com; verwaiste Test-Tags mc-test-a, mc-test-b, mc-gras-video löscht Anika selbst.

**ManyChat-Status „Stopped" trotz Veröffentlichung** heißt: kein aktiver Auslöser. Live schalten = Auslöser links eintragen, dann oben rechts „Set Live"/„Update".

**Weitere Freebies = Gras-Automation duplizieren** (Zeilenmenü ⋮ → Duplicate): Ablauf und Devine-Schlüssel kommen mit, nur Name, Texte, Link-Buttons, Tag im Body von „Actions #1" und Codewörter anpassen. Arbeitsteilung seit 07.10.2026: ich baue ManyChat, Anika baut den Devine-Workflow selbst und gibt den Tag-Namen vor.
⚠️ Beim Speichern eines Auslösers („Save" in Step 3) schaltet ManyChat ihn von selbst EIN und die Automation geht LIVE, auch mit unveröffentlichten Inhalten. Sofort den Schalter unten links wieder ausstellen. Live-Gang in dieser Reihenfolge: alte Quick Automation stoppen → in der neuen „Update" (veröffentlicht nur die Inhalte) → Auslöser-Schalter im „When…"-Schritt einschalten. Nie nur den Schalter ohne „Update", sonst laufen die alten kopierten Inhalte. Klicks auf „Stop"/„Update" per frischem Screenshot zielen, die Fenstergröße springt.

**Stand 07.10.2026:** „Podcast Gebiss mit E-Mail" (Ordner Videos) ist LIVE mit Anikas Ok; Tag `mc-gebisspodcast`, Codewörter kappzaum/kapzaum, Link letscast-Folge 7. Alte Quick Automation „Podcast Gebiss" gestoppt. Devine-Workflow dazu baut Anika (Auslieferungsmail fertig). Gras-Echttest steht weiter aus (0 Durchläufe), damit sind Namens-/Adress-Übergabe und Weiche in beiden Automationen ungeprüft.

**Mail-Aufbau pro Freebie (Anika, Okt. 2026):** 3 Mails im Devine-Workflow: „Auslieferung" (Tag 0), „Nachfragen" mit Erinnerung + echter Rückmeldung (Tag 1), „Überleitung" als Brücke zum Gelände mit Antwort-Einladung (Tag 3), danach Aufwärmsequenz ([[project-aufwaermphase-gelaende]]). Anika schreibt Mail 1+2 selbst, für die Überleitung will sie einen ausgearbeiteten Entwurf (nicht nur einen Brückensatz) und setzt dann eigene Bilder ein. Freigegebener Gebiss-Text + Muster: `outputs/freebie-mails/gebisspodcast-ueberleitung.md`. Pro Freebie andere Gelände-Szenen nehmen (Gras: Trecker, bellender Hund; Gebiss: Reh, Heimweg).

**Facebook (seit 26.10.2026):** FB-Seite „Anika Wesse" ist im Pro-Konto als Messenger-Kanal verbunden (erst landete sie versehentlich in einem neuen Free-Konto „Anika Wesse", Seite dort gelöst, Konto löscht Anika). Abo blieb 15 $ / 63 von 500. IG-Automationen springen auf FB-Kommentare NICHT an → je Automation eine FB-Version: Zeilenmenü ⋮ → „Convert channels" → Facebook („Duplicate And Convert" legt selbst eine Kopie an, nimmt nur die VERÖFFENTLICHTE Version, Original bleibt). Danach: Auslöser „Facebook Comments" → „any post" (Crossposting klappt) → „comment contains specific words" (Auswahlfeld per form_input setzen) → Codewörter; erste Nachricht von „Within messaging window" auf **„As private reply"** stellen, sonst blockiert „Set Live". „Public auto-response in Feed" ging erst nach FB-Freigabe durch Anika (Settings → Facebook → „Refresh Permissions"), jetzt überall an mit den 3 Standard-Antworten (IG „DMs" → FB „Nachrichten"). Beim Einschalten legt ManyChat EIN leeres Feld an → zuerst dort tippen, dann „+ New Response", sonst geht ein leeres Feld mit.
Quick Automations (Gelände-Schlüssel, Webinar, Quiz, TTP, Masterclass) haben KEIN „Convert channels" → als Messenger-Flow neu gebaut (New Automation → Facebook Send Message, „As private reply", DM1 + Button „Ja, das ist richtig." → Send Message #1 mit DM2 + Link-Button). TTP-FB-Link mit utm_source=fb.
**Erinnerung „nicht geklickt" (FB, seit 26.10.2026 in 7 Automationen: Gelände-Schlüssel, Webinar, Quiz, TTP, Masterclass, Offenstall, Paddocktrail):** Link-Button → „Additional actions" an → Aktion Add Tag `fb-klick-<name>` (ManyChat-Tag, nicht Devine). Link-Nachricht „Next Step" → Smart Delay **4 Stunden** (Wahl von mir, ManyChat zeigt die Quick-Automation-Zeit nicht) → Condition „Tag isn't fb-klick-<name>" → Messenger-Nachricht mit dem IG-Erinnerungstext. Paddocktrail: beide Link-Buttons setzen denselben Tag. Neue Schritte über das blaue Plus anlegen, dann verbinden (Next-Step-Punkt klicken, dann Zielschritt); „Auto Arrange" entwirrt überlappende Schritte. Veröffentlichen per „Update". ⚠️ Der Tag bleibt dauerhaft: wer früher schon geklickt hat, bekommt beim erneuten Kommentar keine Erinnerung.
**Seit 26.10.2026 abends (Anika: „überall Erinnerungen, auch bei Insta"): ALLE Kommentar-Automationen haben eine Erinnerung.** Nachgerüstet: FB Offenstallplaner/Gras/Gebiss (Tags `fb-klick-offenstallplaner`, `fb-klick-gras`, `fb-klick-gebiss`), IG-Flows Gras/Gebiss (Tags `ig-klick-gras`, `ig-klick-gebiss`, Schritt „Instagram" statt Messenger), IG-Quick-Automations Offenstallplaner + Tiergespräch (Edit → Haken „a follow up DM if they don't click the link" → Text per form_input setzen, `type` verschluckt dort Buchstaben → Update). Bei Gras/Gebiss führen beide End-Nachrichten (neu/bekannt) in dieselbe Wartezeit. Freigegebene Erinnerungstexte: Gras „…Videoanleitung… beim nächsten Spaziergang… auch in deinem E-Mail-Postfach", Gebiss „…Podcastfolge… Wahl der richtigen Zäumung… E-Mail-Postfach", Offenstallplaner „…Infoseite… für deinen Offenstall", Tiergespräch „…wie so ein Tiergespräch abläuft und was es kostet". Ohne Erinnerung möglich: nur „Story Energetik Webinar" (Story-Trigger bietet keine). Noch ohne FB-Version: Tiergespräch, Futter-Fahrplan, Webinar Energetik, Höflichkeitsvideo, alleine ausreiten, Ute Erfolgsinterview, respektloses Verhalten. ⚠️ Chrome-Tab friert im Editor öfter ein → neuen Tab im selben Gruppen-Kontext öffnen, alten Tab NICHT schließen (sonst verschwindet die Tab-Gruppe).
**Stand 26.10.2026 LIVE auf FB (10):** Gras-Videoanleitung mit E-Mail, Podcast Gebiss mit E-Mail (beide Ordner Videos), Gelände-Schlüssel, Gelände-Webinar, Gelände-Quiz, TTP - Videotraining, Masterclass, Offenstall, Offenstallplaner (Button „Ja, Link schicken🐴!"), Youtube Video Paddocktrail-Führung (Hauptordner), jeweils „(Facebook)". Damit haben alle IG-Kommentar-Automationen eine FB-Version. ⚠️ FB-Buttons max. 20 Zeichen (Offenstall: „Für ja, hier klicken" ohne Punkt). Übrig: gestoppte IG-Kopie „Gras-Videoanleitung mit E-Mail copy" (kann weg). FB-Echttest (Anikas Mann) offen.

**Erster Echtlauf 26.10.2026 geprüft:** Gebiss-Automation 2 Durchläufe; eine Bestandskontaktin kam in Devine mit Vorname, Tag `mc-gebisspodcast` und ALLEN alten Tags an und lief in die Aufwärmsequenz. Damit ist die 2-Anfragen-Bauweise bestätigt. Gras weiter 0 Durchläufe.

**Devine-Seite:** Workflows für ManyChat-Freebies liegen im Ordner „Freebies" (Automatisierung → Arbeitsabläufe). Pilot-Workflow „ManyChat Gras-Videoanleitung" (ID 7d34096f-5c2c-4f36-a5db-6587ab10980a): Trigger Kontakt-Tag „Tag hinzugefügt = mc-grasvideo" → E-Mail senden. Der Workflow-Builder lässt sich per Chrome normal bedienen. Namensschema für weitere: Tag `mc-<freebie>`, Workflow „ManyChat <Freebie>".

**Vorname (Wunsch Anika 05.10.2026):** immer ERST Vornamen abfragen, DANN E-Mail („machen andere auch so"). Bei Instagram ist „Save First name to System Field" gesperrt → Reply Type Text und in User Field `vorname` speichern; Anfrage 1 schickt `"firstName":"{vorname}"`. Achtung: überschreibt den Vornamen eines Bestandskontakts in Devine mit der Chat-Eingabe; ist `vorname` leer (E-Mail in ManyChat schon bekannt, Name nie abgefragt), geht ein leerer Name raus.

**Anika editiert DM-Texte selbst im Entwurf** (hat den Einwilligungssatz aus der E-Mail-Frage gestrichen). Texte vor Änderungen neu auslesen, nicht aus dem Gedächtnis überschreiben.

**Bedien-Tricks Flow Builder per Browser:** Schritte verbinden per Klick auf den „Next Step"-Punkt, dann Zielschritt anklicken (Ziehen greift nicht). Zahlen in Header-Wertfeldern einzeln als Tasten senden, `type` kommt dort nicht an. Testkontakt in Devine: anikawesse+mctest@gmail.com.

---

## ManyChat Automationen

ManyChat-Automationen von Anika — Codewort in Kommentaren löst jeweilige Automation aus.

**Why:** CTAs auf Karussell-Posts sollen immer thematisch zum Inhalt passen und das richtige Codewort triggern.

**How to apply:** Beim Erstellen von Karussell-Posts das inhaltlich passende Codewort wählen und im letzten Slide als CTA einbauen: "Schreib XYZ in die Kommentare"

| Angebot | Preis | Codewort |
|---|---|---|
| Offenstall-Planer | 47 € | Konzept |
| Info-Guide: 10 größte Fehler Offenstallhaltung | 0 € | Offenstall |
| Beziehungs-Check | 0 € | Check |
| Masterclass | 0 € | Masterclass / Muskeln |
| Futter-Fahrplan | 47 € | Futterplan |
| Videotraining | 0 € | Videotraining / Verlasspferd |
| Facebook-Gruppe | 0 € | Gruppe |
| Notfall-Paket | 27 € | Gelände |
| Energetik-Webinar | 0 € | Webinar / Magie |
| Gelände-Schlüssel Kurs (direkt) | 27 € (EB) | Schlüssel |

**Abo/Kosten (Stand 24.10.2026):** Pro-Stufe richtet sich nach abgerechneten Kontakten (nur Status „Subscribed“, Visitors zählen nicht). 24.10.26 aufgeräumt: Subscribed + Last Interaction vor ~Anfang Okt. gelöscht → 52/500, 15 $/Monat statt 25 $ (Stufe bis 2.500). Bei Annäherung an 500 wieder so aufräumen; Filter nie „Subscribed before“ (= Erstkontakt), sondern „Last Interaction“. Beim Aufräumen kein E-Mail-Filter gesetzt; danach (24.10.26) nur **1 Kontakt mit E-Mail** in ManyChat. Früher wurde die Mail nicht abgefragt, die E-Mail-Liste liegt in Devine (siehe [[reference-manychat-devine-anbindung]]).

**Automation „Willkommen Follower“ (Follow-to-DM, Beta, Opening-DM → Gelände-Quiz):** 121 Sends gesamt, aber seit ca. Anfang Okt. 2026 keine Sends mehr trotz neuer Follower → Meta hat Account vermutlich aus der Beta genommen (26.10.26). Bleibt live stehen. Anika will Instagram NICHT trennen/neu verbinden (Risiko für Codewort-Automationen). Alternative: Quiz über eigenes Codewort (z. B. QUIZ) bewerben.

Thematische Zuordnung (Logik):
- Fütterung, Ernährung, Gewicht → Futterplan
- Offenstall, Haltung, Paddock → Offenstall oder Konzept
- Angst, Unsicherheit, Ausritt, Vertrauen → Verlasspferd
- Training, Muskelaufbau, Bodenarbeit → Muskeln / Masterclass
- Beziehung, Partnerschaft, Kommunikation → Check
- Gelände, Ausritt, Notfall → Gelände
- Community, Austausch → Gruppe
- Energetik, Pferdekommunikation, energetisches Sprechen → Webinar (sachlich) oder Magie (emotional, Big-Idea-konform)

---

## ThriveCart Setup

### ThriveCart Setup

### Account
- **Tarif:** ThriveCart **Pro+** (Abo) — bezahlt 30.05.2026, Invoice 000078255, €808,01 inkl. MwSt via PayPal. €679 jetzt, danach €249/Jahr ab 30.05.2027.
- **Account-E-Mail:** info@anikas-pferdeakademie.de
- **Frühere Stufe:** war "ThriveCart Lifetime" (Standard)
- ThriveCart hat Tarife umbenannt: nur noch **Standard** + **Pro+** (früher Standard + Pro).

### Aktivierungs-Problem (30.05.2026 — GELÖST)
- Nach Pro+-Kauf war Pro+ technisch NICHT freigeschaltet → Account lief weiter als Standard.
- Symptome: "Unlock More Power with Pro+!"-Banner, Product Tags gesperrt, kein 2. Order Bump, Learn (LMS) fehlte.
- Cache leeren half nicht (war serverseitige Freigabe).
- **Lösung:** ThriveCart Support (Chat unten rechts / support@thrivecart.com) hat Pro+ manuell aktiviert. Alles läuft jetzt.
- **Lehre:** Bei ThriveCart sind Kauf und Aktivierung von Pro+ zwei Schritte; wenn nach Kauf alle Pro+-Features gleichzeitig gesperrt sind → Support kontaktieren, Rechnung anhängen.

### Pro+ Features (vs. Standard)
- Pro+: Product Tags, Multiple Order Bumps, Learn (LMS), Pro Sales/Reporting, Crypto Payments, Tax Inclusive Pricing, Sales Tax Automation, QR Codes, Coupons Analytics, UTM Tracking, Subscription Upgrades/Downgrades & Dunning, Affiliate Center.

### Checkout-Seite (Gelände-Schlüssel)
- **Wunsch:** eigene Salespage oben + ThriveCart-Checkout-Box drunter.
- **Wichtig:** ThriveCart-Checkout ist KEIN freies HTML-Feld (block-/template-basiert). "Custom HTML"-Block nur für Schnipsel — komplette Salespage (325 KB) reinpacken kollidiert mit ThriveCart-CSS. → Anikas Frust kommt daher.
- **Richtiger Weg = umgekehrt: ThriveCart-Checkout EMBED in die eigene Seite:**
  1. Produkt → Tab Checkout / "Sharing & URLs" → "Embeddable / Embed checkout" → Embed-Code (`<div>`+`<script>`) holen.
  2. Code unten in bestehende `outputs/gelaendeschluessel/landingpage.html` einbauen.
  3. Seite auf Netlify hosten (nutzt Anika schon) → eigene URL.
- **Entscheidung (01.06.2026):** Alles bei ThriveCart hosten (eine Auswertungs-Quelle), NICHT Netlify. Methode der Mentorin = standalone ThriveCart-Checkout-Seite (hat eigene URL, Slug "gelnde-schlssel") + Custom-HTML-Element OBERHALB der Cart mit der Salespage. Embeddable-Typ ist dafür falsch.
- **Problem gelöst:** Original `landingpage.html` ist 1,5 MB, weil 6 Bilder als Base64 eingebacken (Hero-Mockup, 4 Testimonial-Avatare, Abschlussbild). Zu groß fürs HTML-Feld. Über-mich-Foto ist bereits eine URL (GHL-CDN filesafe.space).
- **Gebaut:** `outputs/gelaendeschluessel/salespage-thrivecart.html` (29 KB) — CSS gekapselt unter `.gs-lp` (läuft nicht in ThriveCart-Checkout aus), ohne `<html>/<head>`-Rahmen, Montserrat via @import, 4 Digistore-Buttons → Scroll zur Checkout-Box (`#gs-checkout`-Anker am Ende). 6 Bild-Platzhalter: `__URL_HERO__ __URL_AMIR__ __URL_MELLI__ __URL_MANNI__ __URL_LEONARDO__ __URL_FINAL__`. Build-Skript: `_build-thrivecart.ps1`. Extrahierte Bilder in `tc-bilder/`. Vorschau (mit Bildern): `salespage-thrivecart-preview.html`.
- **Checkout-URL:** https://anikas-pferdeakademie.thrivecart.com/gs/ (neue standalone Checkout-Vorlage, embeddable verworfen).
- **Anika-Entscheidung:** Bilder NICHT neu hosten — Originalbilder (Base64) aus altem Code 1:1 behalten. Nur Buttons → Scroll zur Checkout-Box, Footer raus (Impressum/Datenschutz baut sie selbst unter die Cart).
- **FINALE Datei gebaut:** `outputs/gelaendeschluessel/salespage-thrivecart-FINAL.html` (~1,5 MB, Bilder eingebettet) — kommt ins Custom-HTML-Element der Checkout-Seite. Vorschau: `salespage-thrivecart-preview.html`.
- **1,5-MB-Version war zu groß** → ThriveCart-Editor hing/blieb weiß. Gelöst durch Bild-Optimierung.
- **Bild-Optimierung (`_optimize.ps1`):** Hero 988→53 KB (auf Beige #f5ede2 geflattet + JPEG, da auf beigem Hero-Abschnitt → optisch gleich), Avatare auf 120px, Abschlussbild auf 520px. **FINAL jetzt 170 KB** (eingebettet, kein Hosting nötig). `salespage-thrivecart-FINAL.html` neu gebaut + in Zwischenablage. Anzeigegrößen: Hero max 860px, Avatar 52px, Abschluss max 400px.
- **Einbau:** Editor neu laden (F5) → Custom-HTML-Element alten Inhalt löschen → 170-KB-Version einfügen → speichern.
- **FALLS 170 KB immer noch zickt:** Bilder hosten (tc-bilder/ oder optimierte Versionen) → schlanke `salespage-thrivecart.html` (29 KB, Platzhalter __URL_*__) befüllen via `_build`-Logik.

### Zahlungsmethoden (Stripe) — gelöst
- Klarna/Amazon Pay/Google Pay etc. laufen über **Stripe Connect+ / Payment Element** (Link + SEPA sichtbar = Connect+ aktiv).
- Aktivierung NICHT in ThriveCart, sondern **Stripe-Dashboard → Einstellungen → Zahlungsmethoden**.
- ⚠️ WICHTIG: Es gibt 3 Konfigurationen. Checkout liest die mit Typ **"ThriveCart Konto"** (NICHT "Ihr Konto"). Methoden dort aktivieren.
- ⚠️ Test- vs Live-Modus getrennt; manche Methoden erst LIVE sichtbar. Klarna ggf. nicht bei 27 € (Mindestbetrag).
- Status: Anika hatte Methoden aktiviert, tauchten erst nicht auf → vermutlich falsche Konfig/Test-Modus. "Jetzt klappts" gesagt.

### Stand Ende 01.06.2026 — OFFEN / festgefahren
- **Kernproblem:** ThriveCart Checkout-Editor friert bei schwerem Inhalt ein; Checkout-SEITE (öffentlich /gs/) lädt ewig wegen der alten 1,5-MB-Version, die im HTML-Element festhängt. Zusätzlich: auf neuem Produkt lässt sich das **Custom-HTML-Feld gar nicht befüllen** (Klick reagiert nicht) — derselbe Bug wie ganz am Anfang.
- **Anika ist sehr frustriert** (mehrfach "ich dreh durch"); Vergleich: bei Devine Funnels lief das sofort (= vollwertiger Page-Builder).
- **Mehrere Produkte angelegt** (altes kaputtes mit /gs/ + ein neues leeres). Will NICHT nochmal neu bauen.
- **Empfehlung an Anika:** ThriveCart-Support-Chat (hat heute Pro+ schnell gelöst) → festhängenden HTML-Inhalt serverseitig räumen + zeigen, wie Custom-HTML-Feld in ihrem Account korrekt befüllt wird.
- **PLAN B (noch nicht besprochen/entschieden):** Verkaufsseite dort bauen, wo es reibungslos geht (Devine Funnels o.ä.), CTA-Buttons → ThriveCart-Checkout-URL `/gs/`. ThriveCart trackt trotzdem alle Verkäufe/Conversion (Sales-Page-Hosting egal für Checkout-Analytics). Beendet das Editor-Drama.
- **Fertige Datei liegt bereit:** `salespage-thrivecart-FINAL.html` (170 KB, optimierte Bilder eingebettet) — nur noch 1× ins HTML-Feld einfügen, sobald der Editor-Bug weg ist.

### Auslieferung ohne Kauf — GELÖST (Klarna-Abbruch)
- **Problem:** Kurszugang per Mail ausgeliefert, obwohl kein Kauf. Ursache: Kundin brach Klarna ab → ThriveCart sendet `cart.abandoned`, aber Devine-Workflow feuerte bei JEDEM Webhook → lieferte aus.
- **ThriveCart sendet immer ALLE Events** mit Feld `event` (`order.success` = bezahlt, `cart.abandoned` = abgebrochen). In ThriveCart NICHT filterbar → Filter muss in Devine sein.
- **Fix (Devine-Verteiler-Workflow "Verbindung zu Thrive Cart"):** Bedingung direkt nach Inbound-Webhook: Branch `event` ist `order.success` → Kontakt erstellen/Kurse/Routing; None-Zweig → ENDE. ⚠️ Achtung Tippfehler-Falle: exakt `order.success` (doppeltes s). Workflow muss VERÖFFENTLICHT sein.
- **ToDo Anika:** 2 Kundinnen ohne Zahlung den Kurszugang entziehen; Fix testen (Kauf vs. Abbruch).

### Integrationen — GoHighLevel / Devine Funnels (✅ EINGERICHTET 03.06.2026)
- **Devine Funnels läuft auf GoHighLevel.** Kein nativer ThriveCart-Connector → Verbindung über **Webhook**.
- **WICHTIGE KORREKTUR zur früheren Notiz "pro Produkt":** Der ThriveCart-Webhook unter **Settings → API & Webhooks** ist **kontoweit** — er feuert automatisch bei JEDEM Kauf JEDES Produkts (auch zukünftiger). **EIN einziger Webhook reicht für das ganze Sortiment.** Limit 5 Webhooks ist also kein Problem. Der Name ist nur ein Label, keine Einschränkung.
- ⚠️ Per-Produkt-Automation (Produkt → Tab "Automation", When/use) bietet im "use"-Dropdown NUR "Custom HTML" — KEIN Webhook. Webhooks gehen NICHT dort, sondern in Settings → API & Webhooks. (Hat Anika anfangs verwirrt.)
- **Webhook eingerichtet:** Name "Devine Funnel", URL = `https://services.leadconnectorhq.com/hooks/...` (GHL inbound). "Receive results as JSON?" = NICHT ankreuzen.
- **Architektur = EIN Verteiler-Workflow in Devine** (heißt "Verbindung zu Thrive Cart"):
  1. Eingehender Webhook (empfängt ALLE Käufe)
  2. **Kontakt erstellen** — Felder mappen (s.u.)
  3. **Bedingung "Kurse abfragen"** (If/Else): pro Produkt ein Zweig, Filter `base_product_name` **Enthält** "Produktname" (exakt, ohne Leerzeichen am Ende! ⚠️ **Bindestrich vs. Leerzeichen ist KRITISCH** — Bug 08.06.26: Devine-Filter "Energetik-Programm" matcht NICHT "Energetik Programm". TC sendet immer den Produktnamen wie er im TC-Product-Name-Feld steht — Leerzeichen, Großbuchstaben, Sonderzeichen 1:1 übernehmen.)
  4. Pro Zweig: **Add Tag** (z.B. "VIP Paket")
  5. Tag = Startschuss für separaten Mail-Workflow (Trigger "Contact Tag")
- ⚠️ **FELD-MAPPING (häufigster Fehler!):** ThriveCart verschachtelt Kundendaten unter `customer`. Richtig: `{{inboundWebhookRequest.customer.email}}`, `.customer.first_name`, `.customer.last_name` — NICHT `.email`/`.first_name` direkt. Falsches Mapping → leerer "Geist-Kontakt" (Name = nur eine ID), kein Tag, keine Mail. Immer per 🏷️-Picker den echten Wert wählen, nicht tippen.
- `base_product_name` = Top-Level-Feld mit Produkt-Klartextnamen → ideal für die Condition.
- **Testen ohne Sandbox:** ThriveCart hat KEINEN Test-/Sandbox-Button. Trick: **100%-Gutschein** anlegen → echten (kostenlosen) Checkout durchführen → Webhook feuert mit echter Payload-Struktur. In Devine dann "Prüfen Sie, ob neue Anfragen vorliegen" → Referenznutzlast wählen → Trigger speichern.
- ⚠️ Workflow muss **veröffentlicht** sein (nicht "Entwurf"), sonst läuft bei echten Käufern nichts.
- **Pro NEUEM Produkt nötig:** (1) Devine-Verteiler: neuer Zweig + Tag; (2) Mail-Automation mit Trigger Tag; (3) bei Kursen: ThriveCart Fulfillment → "Add them to my membership site" (TC-Learn-Zugang). Webhook selbst = nichts mehr tun.
- ⚠️ Vergisst man den Zweig für ein neues Produkt → Kauf landet im "None"-Zweig → nichts passiert.
- **OFFEN:** Devine-Funnels-Workflow für Gelände-Schlüssel + andere Kurse noch zu bauen (Zweig + Tag + Mail-Automation). VIP Paket Pferdesprache ist fertig.

### Order-Bumps taggen (Problem + Lösung, 19.07.2026)
- **Problem:** Kauft jemand einen Order-Bump dazu, bekommt er in Devine nur den Haupt-Tag (z.B. Gelände-Schlüssel), aber KEINEN Bump-Tag → zweigt nicht in die Bump-Mail-Automation ab. Ursache: Verteiler-Workflow routet nur über `base_product_name` (= Hauptprodukt); Bump-Feld wird nicht ausgelesen.
- **ThriveCart-Webhook liefert Bumps NICHT als eigenes Top-Level-Feld**, sondern in: `purchases` (Array der Namen: Front-End+Bump+Upsell), `purchase_map` (Array wie `product-12, bump-16, upsell-2`), **`purchase_map_flat` (String, ideal!)**. Bump erscheint als `bump-<ID>`. (Quelle: support.thrivecart.com/help/using-webhook-notifications/)
- **Gelände-Schlüssel (#12) hat 2 Bumps:** Videoreihe (#16), Audiotraining Hoftor (#17).
- **EXAKTE TOKENS bestätigt (echte Payload 19.07.2026):** In `purchase_map_flat` (Top-Level-STRING, kommagetrennt, z.B. `"bump-1781676338937,bump-1781676360065,product-12"`) steht: Videoreihe = **`bump-1781676338937`**, Audiotraining Hoftor = **`bump-1781676360065`**, Gelände-Schlüssel = `product-12`. (Bumps auch im `charges`-Array mit `item_type:"bump"` + `item_identifier:"bump_<id>"` und in `purchases`-Array als Namen — aber Array = unpraktisch für Bedingung, daher `purchase_map_flat` nutzen.)
- **Lösung:** Im Verteiler-Workflow ZWEI zusätzliche, EIGENSTÄNDIGE If/Else-Blöcke NACH dem Base-Router (nicht als dessen Zweige, sonst feuert nur einer): `purchase_map_flat` **Enthält** `bump-1781676338937` → Tag `orderbump-videoreihe`; `purchase_map_flat` **Enthält** `bump-1781676360065` → Tag `orderbump-audiotraining`. So feuern Haupt- + Bump-Tags zusammen. Danach je ein Mail-Workflow mit Trigger „Contact Tag".
- Webhook-Endpoint (Devine/GHL): `services.leadconnectorhq.com/hooks/YTcO1DtAeZWVMFTPktEB/webhook-trigger/2f52db43-06f4-453b-8ee0-36cac9776ca6`; „Receive results as JSON?" = AUS.
- ⚠️ Chrome-MCP darf Devine-Domain (app.devinefunnels.de) NICHT bedienen (Sicherheitssperre) → Aufbau muss Anika selbst machen, Claude leitet Schritt für Schritt an.
- **STATUS Bumps:** Tokens bestätigt; Anika hat beide Bump-Blöcke im Gelände-Schlüssel-Zweig gebaut (Videoreihe-Zweig→Tag→Audiotraining-Check→Tag; None-Zweig→Audiotraining-Check→Tag = deckt alle 4 Fälle). Noch offen: Token-Kontrolle (beide Audiotraining-Conditions = `bump-1781676360065`), Speichern + Veröffentlichen, Testkauf.

### Upsell „Gelände sicher meistern" taggen (19.07.2026)
- **Anders als Bumps!** Der Upsell (One-Click, NACH Haupt-Checkout angenommen) ist NICHT in der `purchase_map_flat` der Basis-Bestellung (Anika hat's geprüft: kein Upsell-Wert in der Bestellung). Er feuert einen **EIGENEN Webhook** mit `base_product_name = "Gelände sicher meistern"` (= Fall B).
- **KORREKTUR/AUFLÖSUNG (Screenshots von Anika):** Devine-Workflow hat ZWEI verkettete Verteiler in Reihe: „Kurse abfragen" (Router1) → None → „weitere Kurse abfragen" (Router2) → None → ENDE. Router2 enthält BEREITS einen Zweig `base_product_name enthält "Gelände sicher meistern"` → Add Tag → ENDE (ebenso eigene Zweige für Audiotraining Hoftor / Videoreihe als STANDALONE-Käufe). D.h. Upsell-Tagging ist SCHON abgedeckt, wenn Upsell eigenen Webhook feuert. NICHTS zu bauen.
- **Fulfillment des Upsell-Produkts** („Gelände sicher meistern") ist korrekt gesetzt (Add to membership site → TC Learn Kurs „Gelände sicher meistern" + TC-Tag „gelaende sicher meistern"), war von Anfang an so.
- **Der eine Käufer ohne Kurszugang = Einzel-Ausrutscher** ohne erkennbare Ursache (Transaktion sauber, alle Produkte auf Rechnung: Gelände-Schlüssel + beide Bumps + Upsell; alles andere freigeschaltet). Anika hat manuell freigeschaltet. Kein Setup-Fix nötig.
- **AUFGELÖST (2. Fall + echte Nutzlast 19.07.2026):** Upsell reist DOCH im Haupt-Webhook mit! `base_product_name = "Gelände-Schlüssel"`, `order_id` gleich, im `charges`-Array: `name:"Gelände sicher meistern", item_type:"upsell", item_identifier:"upsell_1", amount:9900` (=99,00€). → In `purchase_map_flat` als **`upsell-1`**. Der bestehende „Gelände sicher meistern"-Zweig (Router2, base_product_name) greift NIE, weil base ja „Gelände-Schlüssel" ist.
  - **FIX Devine-Tag = ✅ GEBAUT (19.07.2026):** `purchase_map_flat` = `"product-12,upsell-1"` → Token **`upsell-1`**. Anika hat den Check (`purchase_map_flat` enthält `upsell-1` → Add Tag „Gelände sicher meistern") an ALLE 4 ENDE-Leaves des Gelände-Schlüssel-Asts eingefügt (wegen Bump-Verschachtelung; Upsell mit/ohne Bumps kombinierbar). Noch offen: Token-Kontrolle, Speichern + Veröffentlichen, Testkauf.
  - **FIX Kurszugang — Ursache NICHT 99€/149€ (Theorie verworfen): BEIDE „Gelände sicher meistern"-Versionen haben Fulfillment gesetzt.** Entscheidende Eingrenzung: Basis-Kurs + Bumps werden AUTOMATISCH in TC Learn freigeschaltet, NUR der Upsell nicht. → Klassisches ThriveCart-Verhalten: „Add to membership site" zündet beim **One-Click-Upsell (Nachkauf-Pfad)** oft NICHT automatisch, obwohl konfiguriert. Kein Setup-Fehler. → **Empfehlung: ThriveCart-Support** (Support-Text von Claude angeboten). Anika schaltet betroffene Käuferinnen bis dahin manuell frei.
  - Beispiel-Order: paypal_v2, order_id 42519973/invoice 000000128, Käuferin Jasmin Heller, Upsell 99€.

### SKALIERBARE Tagger-Architektur (Bumps+Upsells, ab 19.07.2026) — ersetzt Verschachtelung
Problem: verschachteltes Wenn/Dann im Hauptworkflow explodiert bei mehreren Add-ons pro Produkt. Neue schlanke Architektur:
- **Baustein 1 (im Hauptworkflow „Verbindung zu Thrive Cart", ZWISCHEN „Kontakt erstellen" und „Kurse abfragen"):** Aktion „Kontaktfeld aktualisieren" → eigenes Feld **`TC Kaufliste`** (Custom Field, einzeiliger Text; in Devine unter Einstellungen→Benutzerdefinierte Felder anlegen) = `{{inboundWebhookRequest.purchase_map_flat}}`. ✅ GEBAUT. Füllt bei JEDEM Kauf die Kaufliste (z.B. `product-12,upsell-1`).
- **Baustein 2 (pro Add-on ein eigener Mini-Workflow „Tagger"):** Trigger **„Kontakt geändert"** → Feld `TC Kaufliste` → „Wurde geändert" (Trigger kann KEIN „enthält"!). Dann 1 Schritt **Wenn/Sonst**: `TC Kaufliste` enthält `product-<parentID>` UND enthält `<token>` → Ja: Add Tag. Kein Nesting.
  - ⚠️ Upsell-Token `upsell-1`/`upsell-2` sind NUR pro Funnel eindeutig (nicht global!) → bei Upsells IMMER auf `product-<parent>` UND `upsell-N` filtern. Bumps haben eindeutige lange IDs → Token allein reicht (aber `product-12` mitfiltern schadet nicht, hält's einheitlich).
  - Naming mit Funnel-Präfix zum Gruppieren: `Gelände – Upsell GSM`, `Gelände – Bump Videoreihe`, `Gelände – Bump Audiotraining`.
  - Neuer Add-on = Tagger duplizieren, Token+Tag+Name ändern. Fertig.
- **STAND 19.07.2026:** ✅ Feld TC Kaufliste + Tagger „Tagvergabe Gelände sicher meistern" (Filter product-12 + upsell-1) gebaut. Bumps bleiben vorerst im verschachtelten Hauptworkflow (später auf Tagger migrieren + Nesting entfernen). ⚠️ NOCH TUN: GSM-Tag im Add-Tag-Schritt eintragen; BEIDE Workflows (Haupt + Tagger) auf „Veröffentlichen"; sonst läuft Tagger ins Leere.

### Upsell-Kurszugang: WAHRSCHEINLICHE URSACHE gefunden (19.07.2026)
- Der alte Upsell „Gelände sicher meistern" war in ThriveCart auf **„über eigene Seite anzeigen"** eingestellt — diese Seite existiert aber NICHT → Upsell-Annahme/Auslieferung lief ins Leere → keine automatische Kursfreischaltung (erklärt beide Ausfälle). Anika hat den Upsell **komplett neu über ThriveCart aufgesetzt** (hosted).
- ⚠️ Wegen Neuaufbau kann sich das Upsell-Token geändert haben → per Testkauf `purchase_map_flat` prüfen, ob noch `upsell-1`; falls anders, Tagger-Zahl anpassen. Auch Fulfillment des rebuilt Produkts prüfen.
- **OFFEN nächste Session: TESTKAUF (100%-Gutschein + GSM-Upsell)** → prüfen: (1) Kurs jetzt auto-freigeschaltet? (2) TC Kaufliste gefüllt? (3) Upsell-Token in Nutzlast? (4) GSM-Tag gesetzt? Beide Workflows müssen veröffentlicht sein.
- ⚠️ Produkt #12 (Gelände-Schlüssel) Checkout-Editor hängt weiter in Speichern-Schleife (bekannter Bug) → ThriveCart-SPA warf Claude beim Navigieren immer dorthin zurück. NICHTS gespeichert (immer Exit without saving).

### ⚠️ Upsell-Quote seit 02.08.2026 eingebrochen — Verdacht auf defekten Upsell-Pfad (Stand 31.08.2026)

Auswertung aller ThriveCart-Transaktionen seit 01.06.2026 nach `item_type` (Skript im Scratchpad, Endpunkt `/transactions`, `transactionType=charge`):

| Produkt (item_type) | Juni | Juli | August | Letzter Verkauf |
|---|---|---|---|---|
| Gelände-Schlüssel (product) | 20 | 100 | 79 | 31.08.26 |
| Videoreihe (bump) | 3 | 16 | 11 | 28.08.26 |
| Audiotraining Hoftor (bump) | 1 | 7 | **1** | **04.08.26** |
| Gelände sicher meistern (**upsell**) | 3 | 4 | **1** | **02.08.26** |
| Schluss mit Kopfkino (upsell) | 0 | 1 | 0 | 27.07.26 |
| Futterrechner (upsell) | 0 | 1 | 0 | 01.07.26 |

- **One-Click-Upsell-Quote: Juni 15 %, Juli 6 %, August 1,3 %.** Seit dem 02.08. haben rund 70 Käuferinnen den Mini-Kurs gekauft und **kein einziger** hat den Upsell genommen. Bei der Juli-Quote wären etwa 4 zu erwarten gewesen.
- **Bump-Quote: Juli 23 %, August 15 %.** Auffällig ist die Aufspaltung: Videoreihe läuft normal weiter (11 im August), **Audiotraining Hoftor hat seit 04.08. genau einmal verkauft** (Juli: 7). Der Checkout als Ganzes ist also NICHT tot, es trifft gezielt einzelne Add-ons.
- ⚠️ **KORREKTUR durch Anika (31.08.2026): NICHTS war kaputt.** Claude hatte aus der Juli-Notiz („über eigene Seite anzeigen" zeigte ins Leere) einen Defekt abgeleitet. Anikas Richtigstellung: die Upsell-Seite lag damals nur auf der **Devine-Seite** und sie hat sie danach **komplett zu ThriveCart geholt**. Kein Fehler, eine Umstellung. Defekt-These ist vom Tisch.
- ⚠️ **ZWEITE KORREKTUR (31.08.2026): auch „die neue ThriveCart-Seite konvertiert schlechter" ist FALSCH.** Anikas Erinnerung („war schon im Juli eingerichtet") stimmt und die Einzeldaten geben ihr recht. Die TC-Seite ist ab 19.07. live und war das **beste** Fenster überhaupt:

| Fenster | Gelände-Schlüssel-Käufe | bezahlte Upsells | Quote | Bump Audiotraining | Quote |
|---|---|---|---|---|---|
| 01.–30.06. | 20 | 0 | 0 % | 0 | 0 % |
| 01.–18.07. | 29 | 1 | 3,4 % | 3 | 10,3 % |
| **19.07.–02.08. (neue TC-Seite)** | 80 | **5** | **6,3 %** | 4 | 5,0 % |
| **03.–31.08.** | 70 | **0** | **0 %** | 1 | 1,4 % |

- ⚠️ Die 3 Upsells vom 17.06. waren **0,00-€-Testkäufe** (100 %-Gutschein), ebenso Futterrechner 01.07. Nie als echte Quote zählen. Claudes erste Rechnung („Juni 15 %") war dadurch falsch.
- **Der Bruch liegt am 03.08., nicht bei der ThriveCart-Umstellung.** Und er ist kein Rauschen: bei 6,3 % wären aus 70 Käufen rund 4,4 Upsells zu erwarten, gekommen sind 0. Wahrscheinlichkeit dafür bei unveränderter Lage etwa **1 %**.
- **Entscheidender Hinweis auf die Ursache:** der Bruch trifft **Upsell UND Bump „Audiotraining Hoftor"** (10,3 % → 5,0 % → 1,4 %), aber **NICHT den Bump „Videoreihe"** (im August normal weiter, 11 Verkäufe). Zwei Add-ons desselben Checkouts verhalten sich unterschiedlich → spricht für eine **Einstellung pro Add-on**, nicht für Seitendesign oder Traffic-Qualität. Zuerst prüfen: wird der Audiotraining-Bump am Checkout überhaupt noch angezeigt (2. Bump-Slot ist ein **Pro+**-Feature, siehe oben) und steht der Upsell noch in der Produktkette.
- Was Anfang August sonst passierte und als Auslöser in Frage kommt: Start des Webinar-Funnels (VIP Paket Gelände 35 Käufe, Gelände-Programm 8 Käufe, alle erstmals im August).
- **Beleg für die Mobil-These: 97,2 % von Anikas Ads-Klicks kommen vom Smartphone** (Meta-Aufschlüsselung `impression_device`, 01.–30.08.2026: Android 49,6 %, iPhone 47,6 %, Desktop nur 0,6 %). Plattform: Instagram 50,1 %, Facebook 48,6 %. Wie die Upsell-Seite am Handy aussieht, ist damit praktisch die einzige Ansicht, die zählt.
- **Anikas eigentliches Problem (ihre Worte):** sie kann die Upsell-Seiten in ThriveCart **nie im mobilen Format prüfen**. Deckt sich mit der Einschränkung im Abschnitt „Seiten-Vorschau" (24.07.): kein teilbarer Vorschau-Link, Upsell-Seiten existieren nur INNERHALB des Kaufprozesses. Einziger echter Weg bleibt der Testkauf mit 100 %-Gutschein.
- ⚠️ **URL-Korrektur (31.08.2026):** `https://anikas-pferdeakademie.thrivecart.com/gs/` existiert NICHT mehr („page does not exist"). Aktuell gilt: Salespage der Ads = **`https://aw.anikas-pferdeakademie.de/gs-ads`** (Devine/GHL-gehostet, rendert am Handy sauber, von Claude geprüft), Checkout = **`https://anikas-pferdeakademie.thrivecart.com/gs-ads/`**. Ziel-URL stammt aus der Meta-Ads-API (`/ads?fields=creative{object_story_spec}`), alle 7 aktiven Anzeigen zeigen dorthin.
- **Wert der Reparatur, grob:** Upsell zurück auf 6 % bei ~79 Käufen/Monat = ~4,7 × 99 € ≈ **+370 €/Monat**; Bumps zurück auf 23 % ≈ +6 Bumps × ~24 € ≈ **+145 €/Monat**. Zusammen rund 500 € im Monat, also in derselben Größenordnung wie eine deutliche Conversion-Steigerung der Salespage.
- ⚠️ Der Upsell „Gelände sicher meistern" ist der **einzige, der je nennenswert lief** (7 Käufe Juni+Juli). Kopfkino, Futterrechner je 1, Handarbeit und Offenstall-Planer als Upsell **nie**. Passt zur Gelände-Positionierung: Käuferinnen wollen den nächsten Gelände-Schritt, keine themenfremden Kurse.

### Produkte
- **VIP Paket Pferdesprache** (Produkt-ID 5, €9): Upsell/Ergänzung zum Webinar "Mit Pferden sprechen". Inhalt: Webinar-Aufzeichnung + VIP-Workbook + exklusive VIP-Live-Fragerunde. **KEIN Kurs/TC Learn — reine Mail-Auslieferung über Devine.** Fulfillment = "Display their total/invoice". Webhook→Devine→Tag "VIP Paket"→Mail-Automation. ✅ Setup fertig 03.06.2026.

### Produkt-IDs (Dashboard-Dropdown `stats-product`, Stand 15.09.2026)
- product-44 = **Gelände-Programm** (549 €, Webinar-Hauptprodukt) · product-42 = VIP Paket Gelände (9 €) · product-48 = Gelände-Paket (Downsell) · product-49 = Einzelgespräch · product-12 = Gelände-Schlüssel (Mini-Kurs Ads) · product-45 = Tiergespräch · product-41 = Handarbeits-Programm · product-40 = Energetische Futtertestung · product-39 = Dünnes Pferd.
- **Checkout-Aufrufe je Produkt/Zeitraum abrufen:** `scripts/thrivecart-checkout.js` funktioniert für JEDES Produkt — nur `product-12` gegen die gewünschte ID tauschen (z.B. `product-44` fürs Programm). Braucht Anikas eingeloggtes Chrome; Dashboard-XHR `plugin/call` abhören, product-Vorlage fangen, mit eigenen `ranges[]` je Tag nachspielen → `{checkout_view, unique_order}`. ⚠️ Rohantwort (enthält Query-String/Token) NICHT ins Chat zurückgeben — nur die reinen Zahlen extrahieren, sonst blockt die Chrome-Bridge.
- **⭐ Launch-Auswertung liegt jetzt in der CLOUD (Master, ab 15.09.2026):** native Google-Tabelle „Launch-Auswertung Gelände-Webinar" in Drive-Ordner „6. Auswertungen" (Datei-ID `1yYrqSAP8Ol65ZXCgMmz9e8RtFCGsKfitzb7D2afRDV0`). Keine Desktop-Datei mehr nötig (Anika will es in der Cloud, PC-Ausfall-Risiko).
- **✅ SCHREIBZUGRIFF via Apps-Script-Webapp (wie bei der Ads-Auswertung):** `scripts/launch-auswertung-webapp.gs` (Anika deployt einmalig in die Tabelle → URL in `.env` als `LAUNCH_SHEET_WEBAPP_URL`) + `scripts/launch-auswertung-push.ps1 -Launch "Sep 2026" -WerteDatei outputs/webinar-gelaende/launch-werte-<launch>.json`. Layout = 1 Launch = 1 SPALTE (anders als die Tages-Auswertung mit Spalte=Tag). Webapp findet die Zeile per exakter Beschriftung in Spalte A, schreibt Handeingabe-Werte, überspringt Formelzeilen (beige) und zusammengeführte Notiz-/Überschriftzeilen. Neue Launch-Spalte: Webapp kopiert die Formeln der ersten Launch-Spalte (B) per R1C1 mit → beige Zeilen rechnen automatisch. ⚠️ Push-Skript MUSS UTF-8 **mit BOM** gespeichert sein (PS 5.1 liest sonst ANSI → Parser-Fehler); Body als UTF-8-Bytes senden (sonst Umlaute kaputt, Zeile wird still übersprungen). Vorlage/Testdatei: `launch-werte-aug-2026.json` (Push davon = schreibt Aug-Werte in bestehende Aug-Spalte zurück, ungefährlicher Ersttest). NUR reine LESEN geht auch ohne Webapp über den Drive-Connector (`read_file_content`).
- **Workflow pro Launch:** Zahlen sammeln (ThriveCart-Checkout via Chrome + Devine + Ad-Spend), in `launch-werte-<launch>.json` schreiben, `launch-auswertung-push.ps1` laufen lassen → landet direkt in der Cloud-Tabelle. Umwandlung xlsx→Google-Tabelle (falls je nötig) macht Anika per Drive-Einstellung „Uploads konvertieren" oder 2 Klicks. Siehe [[feedback_einfachen_weg_zuerst]].
- **Launch-Auswertung Checkout-Block (15.09.2026):** `outputs/webinar-gelaende/launch-auswertung-gelaende.xlsx` (Arbeits-/Backup-Kopie im Repo) hat Abschnitt „CHECKOUT (ThriveCart)" (Aufrufe/Bestellungen/Conversion). Aug-2026-Launch (product-44, 23.–27.08.): 37 Aufrufe → 7 Bestellungen = 18,9 %; die 7 decken sich exakt mit den 7 Programm-Käufen. ⚠️ exceljs `spliceRows` verschiebt Zell-Inhalte, aber NICHT das interne `this._merges`-Dict → nach dem Einfügen Merge-Zone per `cell.unmerge()` + `delete ws._merges[key]` zurücksetzen und frisch mergen, sonst mergt die Datei die falschen Zeilen.

### TC Learn — Auslieferung & Zugangsmail
- **Fulfillment für Kurse:** Produkt → Fulfillment → "Add them to my membership site" → richtigen TC-Learn-Kurs zuweisen. TC legt dann automatisch Konto an + schickt "complete your account setup"-Mail mit Registrierungslink.
- **Mehrere Kurse mit EINEM Produkt freischalten (Bonus-Kurse) — GELÖST 26.08.2026:** TC-Fulfillment lässt nur EINEN Kurs auswählen. Lösung = in TC Learn ein **Bundle** anlegen (Sammel-Hülle mit mehreren Kursen), dann im Produkt-Fulfillment das Bundle statt des Einzelkurses wählen. **Produkt + Checkout-Seite bleiben unverändert**, nur die Auslieferung zeigt aufs Bundle. Konkret: Gelände-Programm schaltet jetzt per Bundle den Hauptkurs + die 2 Anti-Schreck-Kurse (Bonus) automatisch frei, kein manuelles Zuweisen mehr. ⚠️ Bereits-Käuferinnen (vorher manuell) brauchen das Bundle/Bonus-Paket ggf. einmalig nachträglich.
- ⚠️ **TC-Learn-Zugangsmails sind NICHT anpassbar** (fest eingebaute System-Mail) — offiziell in ThriveCart-Doku bestätigt (support.thrivecart.com/help/how-do-students-access-my-courses). Anpassbar sind NUR Registrierungs- & Login-SEITE (Course options → "Customize registration/login page", Page-Builder).
- **Lösung für schöne Begrüßung:** TC schickt die nüchterne Zugangsmail, **Devine** schickt die warme Willkommensmail (voller Stil-Kontrolle). In Devine-Mail Satz ergänzen: "Deine Zugangsdaten hast du in einer separaten Mail bekommen". Registrierungs-Seite wenigstens in Erdtönen gestalten.

### Manueller Mitglieder-Import (TC Learn)
- **Format:** CSV mit genau 2 Spalten: `name` und `email` (Kleinschreibung!), Komma als Trennzeichen
- Beispiel: `Andrea Levenig,andreagutzeit147@gmail.com`
- Datei auf Desktop ablegen, dann in TC Learn importieren
- ⚠️ Kein Semikolon, kein "Namen"/"E-Mail" — exakt `name,email`

### Mitglieder-Abgleich Digibiz → TC Learn (✅ ABGESCHLOSSEN 16.06.2026)
- **Grund:** TC-Webhook erst ab 03.06.2026 → alle älteren Digibiz-Käufer nie in TC Learn provisioniert.
- **Methode:** TC-Export-CSV (Desktop) vs. Digibiz-Screenshots → fehlende = Import-CSV erstellt.
- **Import-Dateien auf Desktop (alle fertig importiert):**

| Kurs | Datei | Fehlende |
|------|-------|---------|
| Longentraining | import-longentraining-fehlende.csv | 9 |
| Handarbeit | import-handarbeit-fehlende.csv | 47 |
| Gelände-Schlüssel | import-gelaendeschluessel-fehlende.csv | 40 |
| Traumteam | import-traumteam-fehlende.csv | 13 |
| Videoreihe | import-videoreihe-fehlende.csv | 2 |
| Gespensterecke | import-gespensterecke-fehlende.csv | 7 |
| Monatliche Fragerunde | import-fragerunde-fehlende.csv | 6 |
| Energetik-Programm | import-energetik-fehlende.csv | 2 |
| Gelände sicher meistern | import-gsm-fehlende.csv | 4 |

- **Offenstall-Planer:** bereits vollständig (365 Digibiz = alle in TC)
- **Gespensterecke:** alle Digibiz-Mitglieder waren schon in TC → kein Import nötig (war schon korrekt)
- **Energetisch testen und behandeln:** kein separater TC-Export vorhanden; Kurs heißt in TC ggf. "Energetische Futtertestung"

### Meta Pixel Tracking — Doppelzählung vermeiden
- **Regel:** Kein manueller `Purchase`-Pixel-Code auf Danke-Seiten oder Upsells, wenn ThriveCart's eingebautes Pixel-Tracking aktiv ist.
- ThriveCart feuert `Purchase` via Browser-Pixel + CAPI mit "Combine purchase events" → dedupliziert automatisch (gleiche event_id).
- Manueller Code zusätzlich = zweiter `Purchase` ohne passende event_id → Meta zählt doppelt.
- **Upsells:** Nicht separat tracken. ThriveCart-Hauptprodukt-Tracking reicht für Meta-Optimierung. Upsell-Käufe in ThriveCart-Transaktionen sichtbar.
- **Problem war:** Manueller Purchase-Code beim Upsell → nach Entfernen ist das Tracking sauber.

### Coupons
- ThriveCart-Coupon-Codes sind **privat** — nur wer den Code kennt, kann ihn nutzen. Codes für bestimmte Personen sind sicher; **kein Löschen aus Sicherheitsgründen nötig**.
- Vorausgefüllter Code im eigenen Checkout = nur Browser-Session/Cookie vom eigenen Test; normale Besucher sehen leeres Feld (Inkognito-Test beweist es).
- Pro Code einstellbar: **Nutzungslimit + Ablaufdatum** (Coupon-Einstellungen). Testcode am besten kryptisch + limitiert.

### Buchhaltung: Stripe/PayPal-Einnahmen verbuchen (OFFEN, Stand 01.07.2026)
- **Problem:** Bei Digistore24 kam eine gesammelte Auszahlung; bei ThriveCart+Stripe/PayPal kommen Auszahlungen gesammelt über mehrere Einzelverkäufe (teils andere EU-Länder, andere USt-Sätze) → aus der Bank-Auszahlung allein nicht mehr nach Steuersatz aufdröselbar.
- **Lösung (konzeptionell, noch nicht mit StB final abgestimmt):** Stripe/PayPal je als eigenes Verrechnungskonto (wie Kasse) buchen; jeder Einzelverkauf mit eigenem Erlös+USt-Satz gegen dieses Konto; Auszahlung aufs Bankkonto = reine Umbuchung; Gebühren separat als Aufwand.
- **Steuerberaterin hat abgewunken** ("frag die Tool-Anbieter") — das ist aber eindeutig Steuerberatungs-Aufgabe, kein Tool-Support-Thema. Verdacht: StB kennt sich mit Stripe/PayPal-Direktabrechnung + OSS nicht aus.
- **Kernfrage offen: OSS-Registrierung (One-Stop-Shop)** — bei digitalen Kursen an EU-Privatkunden gilt Bestimmungslandprinzip ab 10.000€ EU-weiter Bagatellgrenze; unklar ob Anika registriert ist. Muss geklärt werden.
- **Nächster Schritt:** Anika hat strukturierte Mail mit 5 konkreten Fragen an StB bekommen (Verrechnungskonto-Einrichtung, Beleg-Grundlage aus TC-CSV-Export, OSS-Status, SKR03/04-Konten, Gebühren-Buchung). Falls StB wieder ausweicht → Empfehlung: Steuerbüro mit Erfahrung in Online-Business/Infoprodukten suchen.

### Seiten-Vorschau (Checkout/Upsell) — Einschränkung (24.07.2026)
- ⚠️ **ThriveCart hat KEINEN teilbaren Vorschau-Link für Upsell-/Checkout-Seiten** (anders als Devine/GHL, wo jede Page eine eigene aufrufbare URL hatte). Upsell-Seiten existieren nur INNERHALB des Kaufprozesses (werden erst nach dem Front-End-Kauf ausgespielt).
- **Einzige Vorschau-Wege:** (1) Handy-Umschalter im Editor (Handy-Icon oben — klein, im Browser, Größen NICHT verschiebbar); (2) echter Testdurchlauf mit **100%-Gutschein** am Handy (Checkout-Link als Lesezeichen, Name/Mail eintippen → „kaufen" → Upsell erscheint). Ganzen Kaufprozess umgehen geht NICHT (Upsell ist technisch an vorausgegangenen Kauf gekoppelt).
- ⚠️ Solange der **Kauf-Button des Front-End-Produkts kaputt ist** (Stand 24.07.2026, Support kontaktiert), funktioniert auch die 100%-Gutschein-Vorschau nicht.
- **Anikas Frust an ThriveCart:** Mobile-Version verschiebt Textblöcke unschön + keine Größenkontrolle. Workaround für Textblöcke = als BILD einbauen (2x gerendert = auch runterskaliert lesbar). Bild-Rendering-Methode: HTML → Headless-Chrome `--screenshot --force-device-scale-factor=2` → PowerShell System.Drawing Autocrop (kein ImageMagick/Python auf dem System). Beispiel: `outputs/gelaendeschluessel/upsell-header.png` (Upsell-Header „Kauf erfolgreich abgeschlossen", helles Rosé #dfa3b0, Montserrat).

### Mobile / Benachrichtigungen
- **KEINE native ThriveCart-App** (anders als Digistore). Dashboard nur im Browser. Tipp: Seite "Zum Startbildschirm hinzufügen" → app-ähnliches Icon.
- **Verkaufs-Push aufs Handy** (Cha-Ching): Empfehlung = über Devine/GHL-App (LeadConnector) — Push-Aktion im bestehenden Workflow, nutzt vorhandenen Webhook. Alternativen: Slack (hat Anika), Pushover/"Push by Zapier" (via Zapier/Make). NICHT umgesetzt, nur besprochen.

---

## Countdown-Timer

### Countdown-Timer (automatehero.io)

### Was es ist
Anika erstellt ihre **Countdown-Timer auf automatehero.io** und bettet sie in nahezu
**alle ihre Salespages** ein (bestätigt: Traumteam-Programm). Die Timer sind den
Angeboten "vorgeschaltet" und erzeugen Verkaufs-Dringlichkeit.

### ⚠️ Single Point of Failure
Wenn automatehero.io ausfällt, laden die Timer auf den Salespages nicht mehr →
Anika kann ihre Programme faktisch nicht verkaufen (fast alle Seiten betroffen).

- Domain löst auf AWS London auf: `automatehero.io` → `18.132.7.181` (eu-west-2)
- **Ausfall am 2026-05-29**: Server komplett unerreichbar (Ping/HTTP/HTTPS Timeout).
  Nach ~1 Std von selbst wieder online (HTTP 200). War ein Anbieter-Ausfall, nicht Anikas Seite.

### Zweiter Vorfall: 2026-06-21 (Webhook-Bug)

Anika entdeckte, dass Countdown-Timer in mehreren Funnels (Longe, Cart-Open) für viele Kontakte nicht ausgelöst werden.

**Diagnose-Ergebnis:**
- Devine feuert Webhooks für **alle** Kontakte erfolgreich ab (in Devine-Log bestätigt)
- Nur ein Teil der Kontakte erscheint in Automate Hero's Kontaktliste
- Kontakte die NICHT in Automate Hero sind → kein Timer → sehen sofort "abgelaufen"
- **Ursache: Bug auf Automate Hero-Server** — Webhooks kommen an aber werden nicht verarbeitet
- Nächster Schritt: Support-Ticket an Automate Hero mit konkreten Kontakt-Beispielen + Devine-Log-Nachweis

### Devine Funnel nativer Timer — wichtige Erkenntnis (2026-07-31)

Devine Funnels hat einen **eigenen nativen Countdown-Timer**, der direkt in der Mail eingebettet wird — unabhängig von Automate Hero.

**⚠️ Kritische Regel:** Der Timer-Block muss in JEDER Mail vorhanden sein, die auf eine Timer-Salespage verlinkt. Ohne Timer-Block in der Mail kennt Devine keinen aktiven Countdown für diese Person → Kontakt landet sofort auf der "abgelaufen"-Seite, auch wenn der Link korrekt ist.

Der Timer-Block in der Mail ist also nicht nur Dekoration — er registriert die Person bei Devine mit einer Deadline.

### Entscheidung 14.09.2026: Weg von Automate Hero

Anika will Automate Hero **nicht mehr nutzen** (Timer-Ausfälle + Support unerreichbar).
Für das neue Backend-Mail-System ([[project-backend-verkaufsmails]]) fällt die Wahl auf den
**nativen Devine-Timer** (Evergreen, 3 Tage pro Kontakt). Anika kennt ihn von früher —
er hatte damals auch Fehler, die laut Anbieter inzwischen behoben sein sollen.
→ **Vor Produktivnutzung Mini-Testfunnel** (Testseite + Testmail, Start/Weiterlauf/Ablauf prüfen).
Der eigene Claude-Timer (unten) bleibt Plan B, falls der Test enttäuscht.

### ⚠️ ENTSCHEIDUNG 23.09.2026: Salespage-Timer läuft über THRIVECART, nicht Devine

Der Devine-Seiten-Test schlug fehl: Klick aus der Soft-Mail → sofort „abgelaufen"-Seite, weil beim Erstbesuch noch kein mail-gestarteter Countdown existiert (Salesmail 1 wird erst NACH dem Klick versendet — Logik-Lücke, nicht behebbar). Lösung: **Salespage wird in ThriveCart neu gebaut** (Long-Form + Embedded Checkout, Mentoren-Modell). ThriveCart-Evergreen-Timer startet pro Besucherin beim ERSTEN Seitenaufruf (cache-basiert) und kann bei Ablauf den **Cart ersetzen/redirecten** = echte Durchsetzung. Anikas Vorgabe: Timer nicht am Seitenkopf, erst ab Preisblock. Devine-Timer bleiben nur als ANZEIGE in den 4 Salesmails. Struktur-Entwurf: `outputs/gelaendeschluessel/salespage-v2-struktur.md`.

### ✅ GEKLÄRT 22.09.2026: Devine-Timer ist MAIL-gebunden (Screenshot des Timer-Builders)

Devine-Countdown-Builder (Marketing → Countdown-Timer, Timer „Gelände Schlüssel Backend"): Typen **Fest / Wiederkehrend / Dynamisch**. Beim Dynamisch-Timer sind die Start-Auslöser AUSSCHLIESSLICH Mail-/WhatsApp-Events: „Der Benutzer öffnet die E-Mail" / „**Email wurde gesendet**" / WhatsApp gesendet/zugestellt. **Es gibt KEIN „Seite wurde besucht"** → ein Timer nur auf der Salespage startet nie; die alte Juli-Regel „Timer-Block muss in die Mails" beschreibt das echte Verhalten. (Meine Annahme vom 21.09. „Seiten-Timer reicht" stammte aus der generischen HighLevel-Doku und ist für Devine FALSCH.)

**Setup Gelände-Schlüssel-Backend (Anikas finale Bauweise, 22.09.2026):**
- **Salespage:** der vollumfängliche Timer „Gelände Schlüssel Backend" (Dynamisch, 72h, Start „Email wurde gesendet") als „Code kopieren"-Embed
- **Pro Salesmail ein EIGENER Timer** mit passender Rest-Stundenzahl (Mail 1: 72h, absteigend passend zur Mail-Aussage, z.B. 24h für Mail 3, 8h für Mail 4), Start jeweils „Email wurde gesendet" der eigenen Mail; **keine Timer in den Soft-Mails**
- **Salesmail-Links = „Link kopieren" aus dem jeweiligen Timer**, NICHT die nackte Salespage-URL (Soft-Mails nutzen weiterhin den Devine-Auslöser-Link für den Workflow-Trigger)
- Eingebaute Sicherheit: Mail-Timer starten beim Versand ihrer Mail und laufen damit früher ab als der Seiten-Timer → eine Mail verspricht nie mehr Zeit als die Seite noch hat
- Ablauf-Redirect auf Regulärpreis-Variante einstellen (pro Timer prüfen)
- ⚠️ Timer erzwingt den **ThriveCart-Preis nicht** — nur Anzeige + Redirect; alter Checkout-Link liefe nach Ablauf weiter (akzeptiertes Restrisiko)
- ⚠️ Juni-Bug war genau dieser Mechanismus (Kontakte ohne registrierten Timer sahen sofort „abgelaufen") → **Mini-Test vor Scharfschaltung**: Testkontakt durch Funnel, Salesmail 1 auslösen, Timer in Mail + auf Seite prüfen, Zweitgerät-Check, Ablauf-Redirect testen

### Offenes Angebot (jetzt Plan B)
Claude kann einen **eigenen, ausfallsicheren Countdown-Timer** (reines HTML/JS, ohne
externen Dienst) bauen, den Anika selbst einbettet → keine Abhängigkeit von automatehero.
Offene Klärungsfragen vor dem Bau:
1. Timer-Typ: **Evergreen** (pro Besucher, startet bei erstem Besuch, via Cookie/localStorage)
   oder **feste Deadline** (gleicher Endzeitpunkt für alle)?
2. Plattform / Einbettung der Traumteam-Salespage (vermutlich Devine Funnels)?
3. Idealerweise alten automatehero-Embed-Code zum optischen Nachbauen.

### Technik-Notiz (Windows)
Bei Status-Checks mit curl unter Windows kann der Fehler
`CRYPT_E_NO_REVOCATION_CHECK` (schannel) auftreten — das ist eine lokale
Zertifikats-Sperrprüfung, NICHT der Server. Mit `--ssl-no-revoke` umgehen, um den
echten HTTP-Status zu sehen.

---

## Launch-Listen-Management

### Regel

Bei jedem neuen Webinar-Launch gilt: **neues Anmeldeformular + neue Liste**. Alte Anmelder werden NICHT automatisch in die Sales-Sequenz übernommen.

### Warum

- **DSGVO:** Einwilligung war für spezifisches Webinar mit spezifischem Versprechen, nicht für unbegrenzte Sales-Mails
- **Mail-Reputation:** Spam-Beschwerden alter Anmelder killen Deliverability ALLER zukünftigen Mails
- **Saubere Zahlen:** Conversion-Rate nur aussagekräftig wenn nur Neuanmelder im Funnel
- **Verschiedene Frames:** "Pferdesprache 2.0" ist anderes Versprechen als alter Webinar-Titel

### Wie alte Liste trotzdem nutzen

1. Neue Anmeldeseite + neues Formular für aktuellen Launch
2. Einmalige Re-Engagement-Mail an alte Liste ("Ich mache wieder ein Webinar, magst du dabei sein?")
3. Wer klickt, landet auf der neuen Anmeldeseite und trägt sich aktiv neu ein
4. Wer nicht klickt, bleibt unbehelligt

### Setup in WebinarKit/Devine

Neuer Event/Funnel pro Launch mit eigener:
- Anmeldungsliste
- Bestätigungs-Mail-Sequenz
- Erinnerungs-Mails
- Sales-Sequenz nach Webinar

**Why:** Anika fragte beim 3. Launch (Pferdesprache 2.0, 12.06.26) ob alte Liste reicht. Saubere Trennung ist Pflicht.
**How to apply:** Bei JEDEM zukünftigen Webinar-Launch diese Logik anwenden.

### Traumteam-Videotraining Tag-Logik (06.11.2026)
- WebinarKit setzt `everg_web_traumteam_verpasst` bei 25/50 % geschaut UND (verzögert, ~5 Std.) bei Raum geöffnet mit 0 %. Live: `webttt-webinarkit-live` (startet Sales-Automation, wird nach 1. Sales-Mail entfernt); `everg_web_traumteam_live_final` kommt erst ganz am Ende der Sales-Mails (Technikhilfe, nicht anfassen).
- Verpasst-Automation: Wait 2 Std. → If/Else „Verpasst-Tag noch da?" (Sales-Automation entfernt ihn bei Live) → ja: Feld „Webinar verpasst" + Mails. Live-Tags sind nach 2 Std. nicht verlässlich.
- Sales-Automation: erster Schritt „Remove from Workflow: Verpasst".
- Alte Verpasst-Tags aus früheren Runden blockieren den Neustart (Tag-Trigger feuert nicht) → Anmelde-Workflow (Trigger `everg_web_traumteam_reg`) entfernt den Verpasst-Tag. 06.11. bei Anja Schuster, Hella Peperkorn, Simone Limbach per API entfernt.
- Anmelde-Workflow „Tags entfernen bei Anmeldung Videotraining" (Trigger `everg_web_traumteam_reg`, Wiedereintritt an): Remove Tag `everg_web_traumteam_verpasst` + `web_ttp_webinarkit_live` → Internal Notification an Anika (Benutzerdefinierte E-Mail) mit Name, Mail, Termin `{{contact.webinar_date__time}}`. ⏭️ 07.11. Hella + Simone prüfen, ob die Logik an echten Fällen greift.
- 07.11.: Verpasst-Frauen verloren den Anmelde-Tag beim Start der Verpasst-Mails → bekamen weiter Einladungs-Loop-Mails („Schlaumeier Gabi"). Lösung: Anmelde-Tag NICHT entfernen (Replay-Room-Automation bereinigt, Anika); Loop „5. Videotraining" nimmt ihn bei Rundenstart eh weg. ⚠️ NICHT über Verpasst-Tag in „Anmeldung abfragen" lösen (alte Verpasst-Tags würden Nicht-Angemeldete aussortieren). Bei 8 Kontakten Anmelde-Tag per API wieder gesetzt. Test: Andrea Hamm (hamm.a@gmx.de) muss nach ihrer Verpasst-Mail den Anmelde-Tag noch haben.
- ⚠️ Anmelde-Tag von Hand neu setzen startet den Anmelde-Workflow → entfernt den Verpasst-Tag. Verpasst-Tag neu setzen startet die Replay-Room-Strecke von vorn. Bei den 8 vom 07.11. bewusst NICHT wieder angehängt (Anika); Feld „Webinar verpasst" ist bei ihnen noch gesetzt.
- 08.11.: Lücke „Raum geöffnet, 0 % geschaut": WebinarKit zählt das als Attended (kein No-Show) und erreicht nie 25 % → kein Verpasst-Tag (Julia Marchewski, per API nachgetaggt). Empfehlung an Anika: in der WebinarKit-Integration beim Ereignis „Attended" zusätzlich `everg_web_traumteam_verpasst` vergeben (2-Std.-Abfrage fängt Live-Schauerinnen ab). Anika prüft. Test 08.11. sonst sauber: Andrea behielt Anmelde-Tag nach Verpasst-Mail, keine Einladungen mehr.
- 09.11.: Replay-Raum-Mails verlinkten den ALLGEMEINEN Replay-Link (webinarkit.com/replay/6a021a453b8c186ffb29d627) → WebinarKit kann Klickerinnen nicht zuordnen, „Viewed Replay" bleibt bei allen No (5 Klickerinnen, 0 Replays). Richtig: Button-Ziel `{{contact.webinar_replay_link}}` (persönlich, mit r=-Parameter). Replay 3 Tage verfügbar, danach „Angebot abgelaufen".

## Kostenaufstellung und Monatskontrolle (11.11.2026)

- **Kostenaufstellung:** `Desktop\Kostenaufstellung-neu.xlsx` ist Anikas Arbeitsdatei (die alte `Kostenaufstellung.xlsx` gibt es nicht mehr). Drei Blätter: Kosten privat (brutto), Kosten geschäftlich (netto), Hofausgaben (netto). Nur regelmäßige Abbuchungen, keine Puffer oder Urlaub. Spalte C rechnet aus Betrag und Turnus. Mindest-Nettoumsatz enthält seit 11.11. auch die Hofausgaben.
- ⚠️ **Nicht mit exceljs speichern:** exceljs verliert beim Speichern die Dropdowns (x14-Datenüberprüfung) und den Tabellenstil. Änderungen direkt im XML machen (`_Auswertung\skripte\editxlsx.js`, packen mit `pack.js` über jszip). Compress-Archive nicht nutzen (Backslashes in den Pfaden).
- ⚠️ Vor dem Ändern immer prüfen, welche Datei Anika gerade benutzt, und ihre Excel-Fassung als Grundlage nehmen (sie ändert selbst mit).
- **Stand 11.11.:** fest im Monat privat 2.136 €, geschäftlich 2.851 € (davon Meta 1.620 €), Hof 2.155 €. Neue Kreditrate nach Umschuldung 1.425 €. Claude regulär 18 € netto (21,42 € brutto), nur einzelne Upgrade-Monate. ThriveCart Pro+ Jahresgebühr 249 € netto ab 30.05.2027, Learn+ war einmalig.
- **Monatskontrolle:** `Desktop\Monatskontrolle.xlsx` (Skript `_Auswertung\skripte\monatskontrolle.js`). Drei Eingaben pro Monat: Einnahmen netto, Meta Ads, Unvorhergesehenes. Ohne Steuer- und Krankheitsrücklage (Anikas Wunsch: es geht ums monatliche Auskommen). United Media fällt ab Juni 2027 automatisch raus, Julia Trost ab April 2027, Autokredit ab dem Datum im Blatt „Basis". Ziele: 10.000 € netto Umsatz, 5.000 € Rücklage.
- **Monatsziel und Mindestbedarf (11.11.):** feste Kosten ohne Meta 5.523 € im Monat, nach Autotausch, United Media und Julia Trost rund 4.509 €. Anikas Ziel: mindestens 10.000 € netto Umsatz im Monat. Unterricht vor Ort aktuell rund 600 € brutto im Monat geplant. Dazu ab Dezember 2026 Jungpferdetraining bei der Züchterin: 1× pro Woche 3 Std. für 490 € brutto, rund 1.780 € netto Umsatz im Monat (in der Monatskontrolle unter Einnahmen netto mitzählen).
