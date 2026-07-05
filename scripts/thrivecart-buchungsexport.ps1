<#
Bereitet einen ThriveCart-Transaktionsexport fuer die Buchhaltung (Lexware/Steuerberaterin) auf:
- entfernt eigene Test-Bestellungen (Coupon "TESTCODE")
- rechnet Netto nach, wo ThriveCart es leer laesst (z.B. bei Rueckerstattungen)
- formatiert deutsch (Semikolon-getrennt, Komma-Dezimal), sortiert nach Land/Datum
- gibt eine Zusammenfassung nach Land/USt-Satz aus (Basis fuer OSS-Meldung)

Verwendung:
  .\thrivecart-buchungsexport.ps1
    -> nimmt automatisch die neueste "ThriveCart Customer Export *.csv" auf dem Desktop

  .\thrivecart-buchungsexport.ps1 -InputCsv "C:\Pfad\zur\Datei.csv" -Monat "September 2026"
#>

param(
    [string]$InputCsv,
    [string]$Monat
)

if (-not $InputCsv) {
    $InputCsv = Get-ChildItem "$HOME\Desktop\ThriveCart Customer Export *.csv" |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1 -ExpandProperty FullName
    if (-not $InputCsv) {
        Write-Error "Keine 'ThriveCart Customer Export *.csv' auf dem Desktop gefunden. Bitte -InputCsv angeben."
        exit 1
    }
    Write-Output "Verwende neueste Datei: $InputCsv"
}

$rows = Import-Csv -Path $InputCsv -Encoding UTF8
$real = $rows | Where-Object { $_.coupon -ne 'TESTCODE' }

function ToDec($v) { if ($v -eq '-' -or [string]::IsNullOrWhiteSpace($v)) { return $null } else { return [decimal]$v } }
function Fmt($v) { if ($null -eq $v) { return '' }; $v.ToString('F2', [System.Globalization.CultureInfo]::InvariantCulture) -replace '\.', ',' }

$refundWarnings = @()

$clean = $real | ForEach-Object {
    $brutto = ToDec $_.total
    $ust    = ToDec $_.sales_tax
    $netto  = ToDec $_.product_price

    if ($null -eq $netto -and $null -ne $brutto -and $null -ne $ust) {
        $netto = $brutto - $ust
    }

    $typ = $(if ($_.event -eq 'refund') { 'Rueckerstattung' } else { 'Zahlung' })
    if ($typ -eq 'Rueckerstattung') {
        $refundWarnings += "  Bestell-Nr $($_.order_id) | $($_.full_name) | $($_.relevant_item_name) | Export zeigt: $($_.total) EUR (Datum im Export = urspruengliches Bestelldatum, NICHT das tatsaechliche Erstattungsdatum!)"
    }

    [PSCustomObject]@{
        Datum             = $_.order_date
        Uhrzeit           = $_.order_time
        Typ               = $typ
        'Bestell-Nr'      = $_.order_id
        'Transaktions-ID' = $_.transaction_id
        Zahlungsanbieter  = $_.processor
        Produkt           = $_.relevant_item_name
        Kundin            = $_.full_name
        Land              = $_.address_country
        'Netto (EUR)'     = Fmt $netto
        'USt-Satz (%)'    = $(if ($_.sales_tax_rate -eq '-') { '0' } else { $_.sales_tax_rate })
        'USt-Betrag (EUR)'= Fmt $ust
        'Brutto (EUR)'    = Fmt $brutto
    }
} | Sort-Object Land, { [datetime]$_.Datum }, Uhrzeit

if (-not $Monat) {
    $Monat = ($real | Select-Object -First 1 -ExpandProperty order_date) -replace '(\d{4})-(\d{2})-\d{2}', '$2-$1'
}
$outPath = "$HOME\Desktop\ThriveCart Buchungsexport $Monat (bereinigt).csv"
$clean | Export-Csv -Path $outPath -Delimiter ';' -NoTypeInformation -Encoding UTF8

Write-Output "`n$($clean.Count) Zeilen (Test-Bestellungen entfernt), sortiert nach Land."
Write-Output "Gespeichert: $outPath`n"

if ($refundWarnings.Count -gt 0) {
    Write-Output "!! ACHTUNG - $($refundWarnings.Count) Rueckerstattung(en) gefunden. Betrag im Export vor dem Verbuchen mit dem tatsaechlichen PayPal/Stripe-Payout abgleichen (bei Teil-Rueckerstattungen weicht der Export-Wert oft ab!):"
    $refundWarnings | ForEach-Object { Write-Output $_ }
    Write-Output ""
}

# Zusammenfassung nach Land/USt-Satz (Basis fuer Lexware-Sammelbuchung bzw. OSS-Meldung)
function ToDecOrZero($v) { if ($v -eq '-' -or [string]::IsNullOrWhiteSpace($v)) { return 0 } else { return [decimal]$v } }
$data = $real | ForEach-Object {
    $brutto = ToDecOrZero $_.total
    $ust    = ToDecOrZero $_.sales_tax
    $netto  = ToDec $_.product_price
    if ($null -eq $netto) { $netto = $brutto - $ust }
    [PSCustomObject]@{
        Land = $_.address_country
        Satz = $(if ($_.sales_tax_rate -eq '-') { '0' } else { $_.sales_tax_rate })
        Netto = $netto; USt = $ust; Brutto = $brutto
    }
}
$summary = $data | Group-Object Land, Satz | ForEach-Object {
    [PSCustomObject]@{
        Land = $_.Group[0].Land
        'USt-Satz' = "$($_.Group[0].Satz)%"
        Anzahl = $_.Count
        'Summe Netto' = ('{0:N2}' -f (($_.Group | Measure-Object Netto -Sum).Sum))
        'Summe USt' = ('{0:N2}' -f (($_.Group | Measure-Object USt -Sum).Sum))
        'Summe Brutto' = ('{0:N2}' -f (($_.Group | Measure-Object Brutto -Sum).Sum))
    }
} | Sort-Object Land, 'USt-Satz'

$summary | Format-Table -AutoSize
$gesamt = $data | Measure-Object Brutto -Sum
Write-Output "Gesamt Brutto: $('{0:N2}' -f $gesamt.Sum) EUR"
Write-Output "`nHinweis: Rueckerstattungsbetraege oben ggf. noch manuell korrigieren (siehe Warnung), dann Zusammenfassung erneut pruefen."
