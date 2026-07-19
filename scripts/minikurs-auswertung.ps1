<#
Baut die Tagesauswertung fuer den Gelaende-Schluessel-Funnel im Layout der
Google-Tabelle "Auswertung Gelände-Schlüssel 2026":
Spalten = Tage, Zeilen = Kennzahlen. Ergebnis laesst sich direkt in die
Tabelle einfuegen.

Quellen:
  Verkaeufe      -> ThriveCart API (/api/external/transactions)
  Werbeausgaben  -> Meta Marketing API (Insights, time_increment=1)
  Besucher       -> Meta landing_page_view (nur Ads-Traffic!)
                    Devine/GoHighLevel hat KEINEN Analytics-Endpunkt —
                    die Devine-Zahl muss manuell drueber, wenn organischer
                    Traffic mitzaehlen soll.

Zugaenge aus scripts\.env (steht in .gitignore):
  THRIVECART_API_KEY=...
  META_ACCESS_TOKEN=...
  META_AD_ACCOUNT_ID=act_123456789

Verwendung:
  .\minikurs-auswertung.ps1 -FelderZeigen
    -> ERSTER SCHRITT. Prueft beide Zugaenge, zeigt welche Felder ThriveCart
       liefert und wie die Produkte dort wirklich heissen. Schreibt nichts.

  .\minikurs-auswertung.ps1 -Von 2026-07-10 -Bis 2026-07-17
#>

param(
    [string]$Von,
    [string]$Bis,
    [string]$KampagnenFilter = 'Gelände',   # nur Kampagnen, deren Name das enthaelt
    [switch]$FelderZeigen,
    [switch]$NichtSenden,                   # Google-Tabelle NICHT beschreiben (nur CSV)
    [string]$EnvDatei = "$PSScriptRoot\.env",
    [string]$BesucherDatei = "$PSScriptRoot\..\outputs\ads-auswertung\besucher-devine.csv"
)

$ErrorActionPreference = 'Stop'
$MetaApiVersion = 'v21.0'

# ============================================================ KONFIGURATION
# ⚠️ MUSS NACH DEM ERSTEN -FelderZeigen-LAUF GEPRUEFT WERDEN.

# Zeile in der Tabelle -> ThriveCart-Produkt (Name + item_type).
# Namen am 17.07.2026 aus der API verifiziert.
# item_type ist wichtig: "Gelände sicher meistern" gibt es als 'upsell' (aus
# diesem Funnel) UND als 'product' (eigene Salespage) — nur der Upsell zaehlt hier.
$ProduktZeilen = [ordered]@{
    'Gelände-Schlüssel 27€'    = @{ Name = 'Gelände-Schlüssel';        Typ = 'product' }
    'Audiotraining 17€'        = @{ Name = 'Audiotraining Hoftor';     Typ = 'bump'    }
    'Videoreihe 27€'           = @{ Name = 'Videoreihe';               Typ = 'bump'    }
    'Upsell Gelände s.m. 99€'  = @{ Name = 'Gelände sicher meistern';  Typ = 'upsell'  }
}

# Welche Zeile ist das Hauptprodukt? Warenkorb, CPA und Conversion rechnen darauf.
$HauptproduktZeile = 'Gelände-Schlüssel 27€'

# Ab diesem Datum zaehlen NUR noch Ads-Verkaeufe (customer.passthrough.utm_medium=paid).
# Grund: Die UTM-Uebermittlung an ThriveCart ist erst am 14.07.2026 live gegangen —
# davor trug KEIN Verkauf eine Markierung (geprueft: bis 12.07. 0% getaggt, ab 14.07.
# 100% paid). Wuerde man rueckwirkend filtern, faelen echte Ad-Verkaeufe der Fruehzeit
# faelschlich auf 0 und wuerden bereits eingetragene Tabellenwerte mit Nullen ueberschrieben.
# Vor dem Stichtag daher weiter "blended" (alle Funnel-Verkaeufe).
$PaidTrackingAb = [datetime]'2026-07-14'

# Gebuehren fuer die Zeile "Verdienst".
# ThriveCart liefert die Gebuehren NICHT mit (17.07.2026 geprueft) -> nachgerechnet
# aus echten Belegen, die Anika herausgesucht hat.
#
# ⚠️ WICHTIG: Die Gebuehr faellt PRO BESTELLUNG an, nicht pro Position!
#    ThriveCart legt jede Position als eigene Transaktion ab (Bestellung 42442389:
#    Gelaende-Schluessel 27 + Videoreihe 27 = eine Zahlung ueber 54 EUR).
#    Deshalb unten Gruppierung nach order_id — sonst wird der Fixbetrag mehrfach
#    abgezogen. Im Juli 2026: 18 Bestellungen mit 1, vier mit 2, eine mit 4 Positionen.
#
# stripe/thrivepay (Karte) — aus 2 Belegen exakt hergeleitet, kein Raten mehr:
#     27,00 EUR -> 0,85 EUR   |   544,00 EUR -> 11,19 EUR
#     Steigung (11,19-0,85)/(544-27) = 2,0 % ; Fix = 0,85 - 0,54 = 0,31
#     Gegenprobe 544 * 2% + 0,31 = 11,19 ✓
# paypal/paypal_v2 — von Anika bestaetigt: 27,00 EUR -> 1,20 EUR
#     Gegenprobe 27 * 2,99% + 0,39 = 1,197 ✓ (nur EIN Beleg, Aufteilung plausibel)
#
# ⚠️ KLARNA weicht ab und ist NICHT erkennbar: Beleg 54,00 EUR -> 2,23 EUR
#    (Kartenformel gaebe 1,39). ThriveCart liefert die Zahlungsart nicht mit —
#    'processor' sagt nur 'thrivepay'. Klarna-Bestellungen werden daher im
#    Verdienst leicht zu hoch ausgewiesen (~0,84 EUR pro Bestellung).
$Gebuehren = @{
    stripe     = @{ Prozent = 2.0;  Fix = 0.31 }
    thrivepay  = @{ Prozent = 2.0;  Fix = 0.31 }   # = Stripe, so nennt es die API
    paypal     = @{ Prozent = 2.99; Fix = 0.39 }
    paypal_v2  = @{ Prozent = 2.99; Fix = 0.39 }   # so nennt ThriveCart PayPal
    standard   = @{ Prozent = 2.0;  Fix = 0.31 }   # falls Anbieter unbekannt
}

# ============================================================ Zugaenge laden

function Import-EnvDatei($pfad) {
    if (-not (Test-Path $pfad)) {
        Write-Error @"
Keine .env gefunden unter: $pfad

Lege die Datei selbst an (Keys gehoeren nicht in den Chat):

  THRIVECART_API_KEY=dein_thrivecart_key
  META_ACCESS_TOKEN=dein_meta_token
  META_AD_ACCOUNT_ID=act_123456789

ThriveCart-Key:  Settings -> API & Webhooks -> API key
Meta-Token:      Business Manager -> Einstellungen -> Benutzer -> Systembenutzer
                 -> Token generieren (Berechtigung: ads_read)
Ad-Account-ID:   Werbeanzeigenmanager, Format act_123456789
"@
        exit 1
    }
    $werte = @{}
    Get-Content $pfad | ForEach-Object {
        $zeile = $_.Trim()
        if ($zeile -and -not $zeile.StartsWith('#') -and $zeile.Contains('=')) {
            $i = $zeile.IndexOf('=')
            $werte[$zeile.Substring(0, $i).Trim()] = $zeile.Substring($i + 1).Trim().Trim('"')
        }
    }
    if (-not $werte['THRIVECART_API_KEY'] -or $werte['THRIVECART_API_KEY'] -eq 'HIER_EINFUEGEN') {
        Write-Error "In der .env fehlt der THRIVECART_API_KEY."; exit 1
    }
    if ($werte['META_AD_ACCOUNT_ID'] -and $werte['META_AD_ACCOUNT_ID'] -ne 'HIER_EINFUEGEN' -and
        -not $werte['META_AD_ACCOUNT_ID'].StartsWith('act_')) {
        $werte['META_AD_ACCOUNT_ID'] = 'act_' + $werte['META_AD_ACCOUNT_ID']
    }
    return $werte
}

$env_ = Import-EnvDatei $EnvDatei

# Meta ist optional — ohne Token laufen die Verkaufszeilen trotzdem durch,
# Adspend/ROAS/CPA/Besucher bleiben dann leer.
$MetaAktiv = ($env_['META_ACCESS_TOKEN'] -and $env_['META_ACCESS_TOKEN'] -ne 'HIER_EINFUEGEN' -and
              $env_['META_AD_ACCOUNT_ID'] -and $env_['META_AD_ACCOUNT_ID'] -ne 'HIER_EINFUEGEN')

# ============================================================ ThriveCart

function Invoke-ThriveCart($pfad, $query = @{}) {
    $qs = ($query.GetEnumerator() | ForEach-Object {
        "$([uri]::EscapeDataString($_.Key))=$([uri]::EscapeDataString([string]$_.Value))"
    }) -join '&'
    $url = "https://thrivecart.com/api/external$pfad"
    if ($qs) { $url += "?$qs" }
    Invoke-RestMethod -Uri $url -Headers @{
        Authorization = "Bearer $($env_['THRIVECART_API_KEY'])"
        Accept        = 'application/json'
    } -Method GET
}

# ThriveCart benennt Datumsfelder je nach Endpunkt unterschiedlich.
function Get-TransaktionsDatum($t) {
    foreach ($feld in @('date', 'order_date', 'created_at', 'timestamp', 'processed_at')) {
        $v = $t.$feld
        if ($v) {
            if ($v -is [int] -or $v -match '^\d{9,10}$') {
                return [DateTimeOffset]::FromUnixTimeSeconds([int64]$v).LocalDateTime
            }
            try { return [datetime]$v } catch { }
        }
    }
    return $null
}

function Get-ErstesFeld($obj, [string[]]$felder) {
    foreach ($f in $felder) { if ($null -ne $obj.$f -and $obj.$f -ne '') { return $obj.$f } }
    return $null
}

# ThriveCart liefert Betraege in Cent (amount=2700) UND als String (amount_str="27.00").
# Immer die *_str-Felder nehmen — sonst wird aus 9,00 EUR schnell 900 EUR.
function ConvertTo-Euro($wert) {
    if ($null -eq $wert -or $wert -eq '') { return $null }
    return [decimal]::Parse([string]$wert, [Globalization.CultureInfo]::InvariantCulture)
}

# /transactions kann NICHT nach Datum filtern (nur query/transactionType/perPage/page)
# -> alle Seiten holen und lokal filtern. Rate-Limit: 60 Requests/Minute.
function Get-ThriveCartTransaktionen($vonDatum) {
    $alle = @()
    $seite = 1
    while ($true) {
        $antwort = Invoke-ThriveCart '/transactions' @{
            transactionType = 'charge'
            perPage         = 100
            page            = $seite
        }
        $batch = @(Get-ErstesFeld $antwort @('transactions', 'data', 'results'))
        if (-not $batch -or $batch.Count -eq 0) { break }
        $alle += $batch
        Write-Host "  Seite $seite ($($alle.Count) Transaktionen)..." -ForegroundColor DarkGray

        # Abbrechen, sobald die ganze Seite aelter als der Zeitraum ist.
        # Setzt voraus: neueste zuerst. Der Pruefmodus zeigt die Reihenfolge.
        $juengstes = $batch | ForEach-Object { Get-TransaktionsDatum $_ } |
            Where-Object { $_ } | Sort-Object -Descending | Select-Object -First 1
        if ($juengstes -and $juengstes -lt $vonDatum) { break }

        if ($batch.Count -lt 100) { break }
        $seite++
        if ($seite -gt 200) { Write-Warning "Abbruch bei 200 Seiten (Sicherheitsgrenze)."; break }
        Start-Sleep -Milliseconds 1100
    }
    return $alle
}

# ============================================================ Meta Ads

function Get-MetaTage($vonDatum, $bisDatum) {
    $zeitraum = @{
        since = $vonDatum.ToString('yyyy-MM-dd')
        until = $bisDatum.ToString('yyyy-MM-dd')
    } | ConvertTo-Json -Compress

    $url = "https://graph.facebook.com/$MetaApiVersion/$($env_['META_AD_ACCOUNT_ID'])/insights" +
           "?level=campaign&time_increment=1" +
           "&fields=campaign_name,spend,actions,inline_link_clicks,impressions" +
           "&time_range=$([uri]::EscapeDataString($zeitraum))" +
           "&limit=500" +
           "&access_token=$([uri]::EscapeDataString($env_['META_ACCESS_TOKEN']))"

    $zeilen = @()
    while ($url) {
        $antwort = Invoke-RestMethod -Uri $url -Method GET
        $zeilen += @($antwort.data)
        $url = $antwort.paging.next
    }
    return $zeilen
}

function Get-LandingPageViews($zeile) {
    $treffer = $zeile.actions | Where-Object { $_.action_type -eq 'landing_page_view' }
    if ($treffer) { return [int]$treffer[0].value }
    return 0
}

# ============================================================ Pruefmodus

if ($FelderZeigen) {
    Write-Host "`n=== 1. ThriveCart-Zugang ===" -ForegroundColor Cyan
    try {
        $null = Invoke-ThriveCart '/ping'
        Write-Host "OK — API-Key funktioniert." -ForegroundColor Green
    } catch {
        Write-Host "FEHLER: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Pruefe THRIVECART_API_KEY in der .env." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "`n=== 2. Felder einer Transaktion ===" -ForegroundColor Cyan
    $probe  = Invoke-ThriveCart '/transactions' @{ perPage = 100; page = 1 }
    $liste  = @(Get-ErstesFeld $probe @('transactions', 'data', 'results'))
    $erste  = $liste[0]
    if (-not $erste) {
        Write-Host "Keine Transaktionen gefunden." -ForegroundColor Yellow
    } else {
        $erste.PSObject.Properties.Name | Sort-Object | ForEach-Object { Write-Host "  $_" }

        Write-Host "`n--- Liefert ThriveCart den Steuerbetrag? (fuer 'Verdienst') ---" -ForegroundColor Cyan
        $steuer = $erste.PSObject.Properties.Name | Where-Object { $_ -match 'tax|vat|ust' }
        if ($steuer) { $steuer | ForEach-Object { Write-Host "  $_ = $($erste.$_)" -ForegroundColor Green } }
        else { Write-Host "  Nein -> Skript rechnet mit Fallback $UstFallback%." -ForegroundColor Yellow }

        Write-Host "`n--- Liefert ThriveCart die Gebuehren? ---" -ForegroundColor Cyan
        $geb = $erste.PSObject.Properties.Name | Where-Object { $_ -match 'fee|net|payout|processor' }
        if ($geb) { $geb | ForEach-Object { Write-Host "  $_ = $($erste.$_)" -ForegroundColor Green } }
        else { Write-Host "  Nein -> Skript rechnet mit den Saetzen aus `$Gebuehren." -ForegroundColor Yellow }

        Write-Host "`n--- Wie heissen die Produkte wirklich? (fuer `$ProduktZeilen) ---" -ForegroundColor Cyan
        $liste | ForEach-Object {
            Get-ErstesFeld $_ @('product_name', 'base_product_name', 'relevant_item_name', 'item_name')
        } | Where-Object { $_ } | Group-Object | Sort-Object Count -Descending |
            ForEach-Object { Write-Host ("  {0,4}x  {1}" -f $_.Count, $_.Name) }

        Write-Host "`n--- Reihenfolge (neueste zuerst?) ---" -ForegroundColor Cyan
        $liste | Select-Object -First 5 | ForEach-Object { Write-Host "  $(Get-TransaktionsDatum $_)" }

        Write-Host "`n--- Rohdaten der ersten Transaktion ---" -ForegroundColor Cyan
        $erste | ConvertTo-Json -Depth 6
    }

    Write-Host "`n=== 3. Meta-Zugang ===" -ForegroundColor Cyan
    try {
        $test = Get-MetaTage (Get-Date).AddDays(-7) (Get-Date)
        Write-Host "OK — $($test.Count) Tageszeile(n) in den letzten 7 Tagen." -ForegroundColor Green
        $test | Group-Object campaign_name | ForEach-Object {
            $summe = ($_.Group | ForEach-Object { [decimal]$_.spend } | Measure-Object -Sum).Sum
            $lpv   = ($_.Group | ForEach-Object { Get-LandingPageViews $_ } | Measure-Object -Sum).Sum
            $passt = if ($_.Name -like "*$KampagnenFilter*") { 'JA ' } else { 'nein' }
            Write-Host ("  [Filter: {0}] {1} — {2:N2} EUR, {3} Landing Page Views" -f $passt, $_.Name, $summe, $lpv)
        }
        Write-Host "`n  (Filter aktuell: '$KampagnenFilter' — nur 'JA' fliesst in die Auswertung.)" -ForegroundColor DarkGray
    } catch {
        Write-Host "FEHLER: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Pruefe META_ACCESS_TOKEN (ads_read) und META_AD_ACCOUNT_ID." -ForegroundColor Yellow
    }

    Write-Host "`nFertig — nichts geschrieben. Bitte Ausgabe pruefen, dann `$ProduktZeilen und `$Gebuehren oben anpassen.`n"
    exit 0
}

# ============================================================ Auswertung

if (-not $Von) { $Von = (Get-Date).AddDays(-14).ToString('yyyy-MM-dd') }
if (-not $Bis) { $Bis = (Get-Date).ToString('yyyy-MM-dd') }
$vonDatum = ([datetime]$Von).Date
$bisDatum = ([datetime]$Bis).Date

Write-Host "`nZeitraum: $($vonDatum.ToString('dd.MM.yyyy')) bis $($bisDatum.ToString('dd.MM.yyyy'))" -ForegroundColor Cyan
Write-Host "Kampagnen-Filter: '$KampagnenFilter'`n" -ForegroundColor Cyan

Write-Host "Hole Verkaeufe von ThriveCart..." -ForegroundColor Cyan
$transaktionen = Get-ThriveCartTransaktionen $vonDatum

$verkaeufe = $transaktionen | ForEach-Object {
    $datum = Get-TransaktionsDatum $_
    if (-not $datum -or $datum.Date -lt $vonDatum -or $datum.Date -gt $bisDatum) { return }

    $name   = $_.item_name
    $brutto = ConvertTo-Euro (Get-ErstesFeld $_ @('amount_gross_str', 'amount_str'))
    if ($null -eq $brutto) { return }

    # ThriveCart liefert die echte MwSt pro Verkauf (tax_paid_str), inkl. Landessatz.
    # Achtung: 'tax' ist die RATE (0.19), nicht der Betrag.
    $ust = ConvertTo-Euro $_.tax_paid_str
    if ($null -eq $ust) { $ust = 0 }

    # Zeile in der Tabelle bestimmen (Name UND item_type muessen passen)
    $zeile = $null
    foreach ($k in $ProduktZeilen.Keys) {
        if ($name -eq $ProduktZeilen[$k].Name -and $_.item_type -eq $ProduktZeilen[$k].Typ) { $zeile = $k; break }
    }

    [PSCustomObject]@{
        Tag      = $datum.Date
        Bestellung = [string]$_.order_id
        Anbieter = ([string]$_.processor).ToLower()
        Produkt  = $name
        Typ      = $_.item_type
        Zeile    = $zeile
        Brutto   = $brutto
        Ust      = $ust
        Bezahlt  = ($_.customer.passthrough.utm_medium -eq 'paid')
    }
}

$fremd = @($verkaeufe | Where-Object { -not $_.Zeile })
$verkaeufe = @($verkaeufe | Where-Object { $_.Zeile })   # nur der Gelände-Funnel

# Ab Tracking-Start nur Ads-Verkaeufe; davor blended (s.o. bei $PaidTrackingAb).
$organischRaus = @($verkaeufe | Where-Object { $_.Tag -ge $PaidTrackingAb -and -not $_.Bezahlt })
$verkaeufe = @($verkaeufe | Where-Object { $_.Tag -lt $PaidTrackingAb -or $_.Bezahlt })

Write-Host "  $($verkaeufe.Count) Verkauf/Verkaeufe aus dem Gelände-Funnel im Zeitraum." -ForegroundColor Green
if ($organischRaus.Count -gt 0) {
    Write-Host "  $($organischRaus.Count) organische(r) Verkauf/Verkaeufe (ohne paid-Markierung) ab $($PaidTrackingAb.ToString('dd.MM.')) ausgeschlossen." -ForegroundColor DarkGray
}
if ($vonDatum -lt $PaidTrackingAb) {
    Write-Host "  Hinweis: Tage vor dem $($PaidTrackingAb.ToString('dd.MM.yyyy')) zaehlen ALLE Verkaeufe (UTM-Tracking war noch nicht aktiv)." -ForegroundColor DarkGray
}
if ($fremd.Count -gt 0) {
    Write-Host "  $($fremd.Count) Verkauf/Verkaeufe aus anderen Funnels ignoriert:" -ForegroundColor DarkGray
    $fremd | Group-Object Produkt | Sort-Object Count -Descending |
        ForEach-Object { Write-Host "    $($_.Count)x  $($_.Name)" -ForegroundColor DarkGray }
}

$meta = @()
if (-not $MetaAktiv) {
    Write-Host "`nMeta-Token fehlt in der .env -> Adspend, ROAS, CPA und Besucher bleiben leer." -ForegroundColor Yellow
} else {
    Write-Host "`nHole Werbeausgaben von Meta..." -ForegroundColor Cyan
    $metaRoh = Get-MetaTage $vonDatum $bisDatum
    $meta = $metaRoh | Where-Object { $_.campaign_name -like "*$KampagnenFilter*" }
    $ignoriert = $metaRoh | Where-Object { $_.campaign_name -notlike "*$KampagnenFilter*" } |
        Select-Object -ExpandProperty campaign_name -Unique
    if ($ignoriert) {
        Write-Host "  Nicht mitgezaehlt (Filter '$KampagnenFilter'): $($ignoriert -join ', ')" -ForegroundColor DarkGray
    }
    Write-Host "  $($meta.Count) Tageszeile(n)." -ForegroundColor Green
}

# ------------------------------------------------------------ Zeilen bauen

$tage = @()
for ($d = $vonDatum; $d -le $bisDatum; $d = $d.AddDays(1)) { $tage += $d }

function Fmt($v, $stellen = 2) {
    if ($null -eq $v) { return '' }
    [math]::Round([decimal]$v, $stellen).ToString("F$stellen", [Globalization.CultureInfo]::GetCultureInfo('de-DE'))
}

$ausgabe = [ordered]@{}
$ausgabe['Datum'] = $tage | ForEach-Object { $_.ToString('dd.MM.yy') }

foreach ($zeile in $ProduktZeilen.Keys) {
    $ausgabe[$zeile] = $tage | ForEach-Object {
        $tag = $_
        $n = @($verkaeufe | Where-Object { $_.Tag -eq $tag -and $_.Zeile -eq $zeile }).Count
        if ($n -gt 0) { $n } else { '' }
    }
}

$bruttoProTag    = @{}
$verdienstProTag = @{}
$adspendProTag   = @{}
$besucherProTag  = @{}
$hauptProTag     = @{}

# Gebuehr PRO BESTELLUNG berechnen (nicht pro Position — s.o. bei $Gebuehren).
$gebuehrProTag = @{}
foreach ($tag in $tage) { $gebuehrProTag[$tag] = [decimal]0 }
$verkaeufe | Group-Object Bestellung | ForEach-Object {
    $pos       = $_.Group
    $summe     = ($pos | Measure-Object Brutto -Sum).Sum
    $anbieter  = $pos[0].Anbieter
    $satz      = if ($Gebuehren.ContainsKey($anbieter)) { $Gebuehren[$anbieter] } else { $Gebuehren['standard'] }
    $gebuehr   = ($summe * $satz.Prozent / 100) + $satz.Fix
    $gebuehrProTag[$pos[0].Tag] += $gebuehr
}

foreach ($tag in $tage) {
    $tagesVerkauf = $verkaeufe | Where-Object { $_.Tag -eq $tag }
    $bruttoProTag[$tag]    = ($tagesVerkauf | Measure-Object Brutto -Sum).Sum
    $nettoTag              = ($tagesVerkauf | Measure-Object Brutto -Sum).Sum - ($tagesVerkauf | Measure-Object Ust -Sum).Sum
    $verdienstProTag[$tag] = $nettoTag - $gebuehrProTag[$tag]
    $hauptProTag[$tag]     = @($tagesVerkauf | Where-Object { $_.Zeile -eq $HauptproduktZeile }).Count

    $tagesMeta = $meta | Where-Object { $_.date_start -eq $tag.ToString('yyyy-MM-dd') }
    $adspendProTag[$tag]  = ($tagesMeta | ForEach-Object { [decimal]$_.spend } | Measure-Object -Sum).Sum
    $besucherProTag[$tag] = ($tagesMeta | ForEach-Object { Get-LandingPageViews $_ } | Measure-Object -Sum).Sum
}

$ausgabe['Bruttoumsatz']            = $tage | ForEach-Object { if ($bruttoProTag[$_] -gt 0) { Fmt $bruttoProTag[$_] } else { '' } }
$ausgabe['Verdienst']               = $tage | ForEach-Object { if ($bruttoProTag[$_] -gt 0) { Fmt $verdienstProTag[$_] } else { '' } }
$ausgabe['(netto abzgl. Gebühren)'] = $tage | ForEach-Object { '' }
$ausgabe['Adspend']                 = $tage | ForEach-Object { if ($MetaAktiv) { Fmt $adspendProTag[$_] } else { '' } }

$ausgabe['ROAS'] = $tage | ForEach-Object {
    if ($adspendProTag[$_] -gt 0) { Fmt ($bruttoProTag[$_] / $adspendProTag[$_]) } else { '' }
}
$ausgabe['Warenkorb brutto'] = $tage | ForEach-Object {
    if ($hauptProTag[$_] -gt 0) { Fmt ($bruttoProTag[$_] / $hauptProTag[$_]) } else { '' }
}
$ausgabe['Einkaufspreis (CPA)'] = $tage | ForEach-Object {
    if ($MetaAktiv -and $hauptProTag[$_] -gt 0) { Fmt ($adspendProTag[$_] / $hauptProTag[$_]) } else { '' }
}
$ausgabe['Gewinn'] = $tage | ForEach-Object {
    if ($bruttoProTag[$_] -gt 0 -or $adspendProTag[$_] -gt 0) {
        Fmt ($verdienstProTag[$_] - $adspendProTag[$_])
    } else { '' }
}
# Besucher: Devine ist die Wahrheit (eigene Ads-Salespage), Meta nur Kontrollzahl.
# Devine/GoHighLevel hat keinen Analytics-Endpunkt -> Zahlen kommen aus besucher-devine.csv.
# Vergleich 12.07.2026: Meta 56 vs. Devine 77 — Abweichung ~27%, deshalb NICHT austauschbar.
$devine = @{}
if (Test-Path $BesucherDatei) {
    Import-Csv -Path $BesucherDatei -Delimiter ';' -Encoding UTF8 | ForEach-Object {
        if ($_.Datum -and $_.Besucher) {
            try { $devine[([datetime]::ParseExact($_.Datum, 'dd.MM.yy', $null)).Date] = [int]$_.Besucher } catch { }
        }
    }
}

# Break-even-CPA = Verdienst je Hauptprodukt-Verkauf. Liegt der tatsaechliche
# Einkaufspreis (CPA) darunter -> Gewinn, darueber -> Verlust.
$ausgabe['Breakeven (CPA)'] = $tage | ForEach-Object {
    if ($hauptProTag[$_] -gt 0) { Fmt ($verdienstProTag[$_] / $hauptProTag[$_]) } else { '' }
}
$ausgabe['Salespage Besucher'] = $tage | ForEach-Object {
    if ($devine.ContainsKey($_)) { $devine[$_] } else { '' }
}
$ausgabe['Salespage Conversion'] = $tage | ForEach-Object {
    if ($devine.ContainsKey($_) -and $devine[$_] -gt 0) {
        (Fmt (100 * $hauptProTag[$_] / $devine[$_])) + '%'
    } else { '' }
}
$ausgabe['  (Kontrolle: Meta LPV)'] = $tage | ForEach-Object {
    if ($besucherProTag[$_] -gt 0) { $besucherProTag[$_] } else { '' }
}

# ------------------------------------------------------------ Ausgabe

Write-Host "`n=== Tagesauswertung ===" -ForegroundColor Cyan
$breite = 30
foreach ($k in $ausgabe.Keys) {
    $zellen = ($ausgabe[$k] | ForEach-Object { "{0,10}" -f $_ }) -join ''
    Write-Host ("{0,-$breite}{1}" -f $k, $zellen)
}

$gesamtBrutto    = ($bruttoProTag.Values    | Measure-Object -Sum).Sum
$gesamtVerdienst = ($verdienstProTag.Values | Measure-Object -Sum).Sum
$gesamtAdspend   = ($adspendProTag.Values   | Measure-Object -Sum).Sum

Write-Host "`n=== Summe Zeitraum ===" -ForegroundColor Cyan
Write-Host ("  Bruttoumsatz:  {0} EUR" -f (Fmt $gesamtBrutto))
Write-Host ("  Verdienst:     {0} EUR" -f (Fmt $gesamtVerdienst))
Write-Host ("  Adspend:       {0} EUR" -f (Fmt $gesamtAdspend))
Write-Host ("  Gewinn:        {0} EUR" -f (Fmt ($gesamtVerdienst - $gesamtAdspend)))
if ($gesamtAdspend -gt 0) {
    Write-Host ("  ROAS:          {0}" -f (Fmt ($gesamtBrutto / $gesamtAdspend)))
}

$fehlend = @($tage | Where-Object { -not $devine.ContainsKey($_) })
Write-Host "`n  Hinweise:" -ForegroundColor DarkGray
if ($fehlend.Count -gt 0) {
    Write-Host "  - Besucher fehlen fuer $($fehlend.Count) Tag(e) -> aus Devine (Ads-Salespage) nachtragen in:" -ForegroundColor DarkGray
    Write-Host "    $BesucherDatei" -ForegroundColor DarkGray
    Write-Host "    Ohne die Zahl bleibt auch die Conversion leer. Meta LPV ist nur Kontrolle" -ForegroundColor DarkGray
    Write-Host "    und zaehlt zu niedrig (12.07.: Meta 56 vs. Devine 77)." -ForegroundColor DarkGray
}
Write-Host "  - 'Verdienst' = netto abzgl. Gebuehr, Gebuehr pro BESTELLUNG gerechnet." -ForegroundColor DarkGray
Write-Host "    Karte (Stripe) 2% + 0,31 und PayPal 2,99% + 0,39 sind an echten Belegen geprueft." -ForegroundColor DarkGray
Write-Host "    ⚠️ Klarna kostet mehr (54 EUR -> 2,23 statt 1,39), ist in den Daten aber nicht" -ForegroundColor DarkGray
Write-Host "    erkennbar -> Verdienst bei Klarna-Bestellungen etwas zu hoch." -ForegroundColor DarkGray

# CSV im Tabellen-Layout (Zeilen = Kennzahlen, Spalten = Tage) zum Einfuegen
# ------------------------------------------------------------ Google-Tabelle

# Schreibt in die Tabelle "Auswertung Gelände-Schlüssel 2026" ueber die
# Apps-Script-Webapp (scripts\google-sheet-webapp.gs). Nur die Zeilen, die wir
# liefern — Anikas eigene Notizen bleiben unangetastet.
# Leere Werte werden bewusst NICHT gesendet, damit sie nichts ueberschreiben.
if (-not $NichtSenden -and $env_['SHEET_WEBAPP_URL'] -and $env_['SHEET_WEBAPP_URL'] -ne 'HIER_EINFUEGEN') {
    Write-Host "`nSchreibe in die Google-Tabelle..." -ForegroundColor Cyan

    # Es werden ROHE ZAHLEN gesendet, keine formatierten Texte — die Webapp setzt
    # das Anzeigeformat (€ / % / blanke Zahl). Sonst waeren die Zellen Text und
    # Anika koennte nicht mehr damit rechnen.
    # Conversion als Bruch (0,0519), weil Google daraus 5,19% macht.
    function Rund($v) { if ($null -eq $v) { return $null }; [math]::Round([decimal]$v, 2) }

    $nutzlast = @{
        secret = $env_['SHEET_SECRET']
        tage   = @(
            foreach ($tag in $tage) {
                $werte = @{}
                $haupt = $hauptProTag[$tag]

                # Stueckzahlen — Schluessel muessen exakt denen in der Webapp entsprechen
                foreach ($paar in @(
                    @{ K = 'Gelände-Schlüssel'; Z = 'Gelände-Schlüssel 27€' },
                    @{ K = 'Audiotraining';     Z = 'Audiotraining 17€' },
                    @{ K = 'Videoreihe';        Z = 'Videoreihe 27€' },
                    @{ K = 'Upsell';            Z = 'Upsell Gelände s.m. 99€' }
                )) {
                    $n = @($verkaeufe | Where-Object { $_.Tag -eq $tag -and $_.Zeile -eq $paar.Z }).Count
                    if ($n -gt 0) { $werte[$paar.K] = $n }
                }

                if ($bruttoProTag[$tag] -gt 0) {
                    $werte['Bruttoumsatz'] = Rund $bruttoProTag[$tag]
                    $werte['Verdienst']    = Rund $verdienstProTag[$tag]
                }
                if ($MetaAktiv) {
                    $werte['Adspend'] = Rund $adspendProTag[$tag]
                    if ($adspendProTag[$tag] -gt 0) { $werte['ROAS'] = Rund ($bruttoProTag[$tag] / $adspendProTag[$tag]) }
                    if ($haupt -gt 0) { $werte['Einkaufspreis (CPA)'] = Rund ($adspendProTag[$tag] / $haupt) }
                }
                if ($haupt -gt 0) {
                    $werte['Warenkorb brutto'] = Rund ($bruttoProTag[$tag] / $haupt)
                    $werte['Breakeven (CPA)']  = Rund ($verdienstProTag[$tag] / $haupt)
                }
                if ($bruttoProTag[$tag] -gt 0 -or $adspendProTag[$tag] -gt 0) {
                    $werte['Gewinn'] = Rund ($verdienstProTag[$tag] - $adspendProTag[$tag])
                }
                if ($devine.ContainsKey($tag) -and $devine[$tag] -gt 0) {
                    $werte['Salespage Besucher']   = [int]$devine[$tag]
                    $werte['Salespage Conversion'] = [math]::Round($haupt / $devine[$tag], 4)
                }

                # Ampel fuer die Break-even-Zeile: Verhaeltnis Adspend zu Verdienst
                # (= tatsaechlicher CPA zu Break-even-CPA, die Stueckzahl kuerzt sich raus).
                # <=0,8 gruen (>=20% Puffer) | <=1,0 gelb (knapp Gewinn) | >1,0 rot (Verlust).
                $farben = @{}
                if ($MetaAktiv -and $haupt -gt 0 -and $verdienstProTag[$tag] -gt 0 -and $adspendProTag[$tag] -gt 0) {
                    $r = $adspendProTag[$tag] / $verdienstProTag[$tag]
                    $farben['Breakeven (CPA)'] = if ($r -le 0.8) { '#d9ead3' } elseif ($r -le 1.0) { '#fff2cc' } else { '#f4cccc' }
                }

                if ($werte.Count -gt 0) {
                    @{ datum = $tag.ToString('dd.MM.yy'); werte = $werte; farben = $farben }
                }
            }
        )
    }

    try {
        # Apps Script antwortet mit 302 auf googleusercontent.com -> Redirect folgen lassen
        $antwort = Invoke-RestMethod -Uri $env_['SHEET_WEBAPP_URL'] -Method POST `
            -Body ($nutzlast | ConvertTo-Json -Depth 5 -Compress) `
            -ContentType 'application/json' -MaximumRedirection 5

        if ($antwort.ok) {
            Write-Host "  Eingetragen: $($antwort.geschrieben -join ', ')" -ForegroundColor Green
            if ($antwort.datum_nicht_gefunden) {
                Write-Warning "  Diese Tage haben keine Spalte in der Tabelle: $($antwort.datum_nicht_gefunden -join ', ')"
                Write-Host "  -> In der Tabelle fehlt die Spalte. Entweder anlegen oder ignorieren." -ForegroundColor DarkGray
            }
        } else {
            Write-Warning "  Die Tabelle meldet: $($antwort.fehler)"
        }
    } catch {
        Write-Warning "  Senden fehlgeschlagen: $($_.Exception.Message)"
        Write-Host "  Die CSV unten ist trotzdem geschrieben." -ForegroundColor DarkGray
    }
} elseif (-not $NichtSenden) {
    Write-Host "`nSHEET_WEBAPP_URL fehlt in der .env -> Google-Tabelle wird nicht beschrieben." -ForegroundColor DarkGray
}

# ------------------------------------------------------------ CSV

$zeilenCsv = $ausgabe.Keys | ForEach-Object { (@($_) + $ausgabe[$_]) -join ';' }

# Archiv-Kopie im Workspace
$ordner = Join-Path $PSScriptRoot '..\outputs\ads-auswertung'
if (-not (Test-Path $ordner)) { New-Item -ItemType Directory -Path $ordner -Force | Out-Null }
$ziel = Join-Path $ordner "auswertung_${Von}_bis_${Bis}.csv"
[IO.File]::WriteAllLines($ziel, $zeilenCsv, [Text.UTF8Encoding]::new($true))

Write-Host "`nGespeichert:" -ForegroundColor Green
Write-Host "  Archiv: $ziel" -ForegroundColor DarkGray
Write-Host "(Zeilen = Kennzahlen, Spalten = Tage — passt zum Layout deiner Google-Tabelle.)`n" -ForegroundColor DarkGray
