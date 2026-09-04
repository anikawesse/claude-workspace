# gs-mail-auswertung.ps1
# Wertet alle 15 CSV-Exporte aus dem Gelände-Schlüssel-Funnel aus.
#
# So benutzen:
#   .\gs-mail-auswertung.ps1 -CsvOrdner "C:\Users\Olive\Desktop\GS-Exporte" -Monat 9 -Jahr 2026
#
# Jede CSV ist ein Kontakt-Export aus Devine Funnels für eine Workflow-Aktion.
# Spalten: Contact Id, Contact Name, Email, Status, Updated At
# Status-Werte: Zugestellt, Geöffnet, Geklickt, Abmeldung, Beantwortet
# Updated At = Datum der letzten Statusänderung (bei Zugestellt = Versanddatum)

param(
    [Parameter(Mandatory=$true)]
    [string]$CsvOrdner,

    [Parameter(Mandatory=$true)]
    [int]$Monat,

    [Parameter(Mandatory=$true)]
    [int]$Jahr
)

# Mail-Definitionen: Dateiname-Pattern → Thema
# Benenne deine CSVs z.B. Tag01.csv, Tag02.csv ... Tag15.csv
# Oder beliebig — das Script sortiert sie alphabetisch
$mailThemen = @(
    "Kurszugang + Deal",
    "Aha Moment + OB",
    "Losreißen + OB",
    "Vorankommen + Upsell",
    "Geschichte + Upsell",
    "Geschichte + Upsell",
    "Kopfkino 1",
    "Kopfkino 2",
    "Kopfkino 3",
    "Video Trageerschöpfung",
    "Umsetzungsdeal",
    "Geschichte + Handarbeit",
    "Testimonial + Handarbeit",
    "FAQ + Handarbeit",
    "Webinareinladung"
)

function Get-Monatsnummer([string]$str) {
    if ($str -match 'Sept') { return 9 }
    if ($str -match 'Aug')  { return 8 }
    if ($str -match 'Juli') { return 7 }
    if ($str -match 'Juni') { return 6 }
    if ($str -match 'Mai')  { return 5 }
    if ($str -match 'Apr')  { return 4 }
    if ($str -match 'Mrz' -or $str -match 'März') { return 3 }
    if ($str -match 'Feb')  { return 2 }
    if ($str -match 'Jan')  { return 1 }
    if ($str -match 'Okt')  { return 10 }
    if ($str -match 'Nov')  { return 11 }
    if ($str -match 'Dez')  { return 12 }
    return 0
}

function Parse-GHLDatum([string]$datumStr) {
    # Format: "Aug. 31, 2026 01:14 pm" oder "Sept. 1, 2026 10:00 am"
    if ($datumStr -match '([A-Za-zä]+\.?\s*)(\d+),\s*(\d{4})') {
        $monat = Get-Monatsnummer $Matches[1]
        $tag   = [int]$Matches[2]
        $jahr  = [int]$Matches[3]
        if ($monat -gt 0) { return [datetime]::new($jahr, $monat, $tag) }
    }
    return $null
}

# CSVs einlesen
if (-not (Test-Path $CsvOrdner)) {
    Write-Error "Ordner nicht gefunden: $CsvOrdner"
    exit 1
}

$csvDateien = Get-ChildItem -Path $CsvOrdner -Filter "*.csv" | Sort-Object Name

if ($csvDateien.Count -eq 0) {
    Write-Error "Keine CSV-Dateien in $CsvOrdner gefunden."
    exit 1
}

if ($csvDateien.Count -ne 15) {
    Write-Warning "Erwartet: 15 CSVs — gefunden: $($csvDateien.Count). Prüfe den Ordner."
}

$monatName = [System.Globalization.CultureInfo]::GetCultureInfo("de-DE").DateTimeFormat.GetMonthName($Monat)
Write-Host ""
Write-Host "=== Gelände-Schlüssel Mail-Auswertung — $monatName $Jahr ===" -ForegroundColor Cyan
Write-Host ""

# Tabellen-Header
$tabellenzeilen = @()
$tabellenzeilen += "| Mail | Thema | Zugestellt | Geöffnet abs. | Geöffnet % | Geklickt abs. | Geklickt % |"
$tabellenzeilen += "|------|-------|-----------|---------------|------------|---------------|------------|"

for ($i = 0; $i -lt $csvDateien.Count; $i++) {
    $datei = $csvDateien[$i]
    $tagNr = $i + 1
    $thema = if ($i -lt $mailThemen.Count) { $mailThemen[$i] } else { "Mail $tagNr" }

    try {
        $csv = Import-Csv -Path $datei.FullName -Encoding UTF8
    } catch {
        # Fallback auf Default-Encoding
        $csv = Import-Csv -Path $datei.FullName
    }

    # Testadresse rausfiltern
    $csv = $csv | Where-Object { $_.'Email' -ne "anikawesse@outlook.de" -and $_.'Email' -ne "anikawesse@gmail.com" }

    # Nach Monat filtern
    $imMonat = $csv | Where-Object {
        $d = Parse-GHLDatum ($_.'Updated At')
        $d -and $d.Month -eq $Monat -and $d.Year -eq $Jahr
    }

    $zugestellt = ($imMonat | Where-Object { $_.'Status' -eq 'Zugestellt' }).Count
    $geoeffnet  = ($imMonat | Where-Object { $_.'Status' -eq 'Geöffnet' -or $_.'Status' -like '*ffnet*' }).Count
    $geklickt   = ($imMonat | Where-Object { $_.'Status' -eq 'Geklickt' }).Count
    $abmeldung  = ($imMonat | Where-Object { $_.'Status' -eq 'Abmeldung' }).Count

    # Gesamtempfänger = alle die im Monat irgendeine Aktion hatten
    $gesamt = $zugestellt + $geoeffnet + $geklickt + $abmeldung

    # Öffnungsrate: Geöffnet / (Geöffnet + Zugestellt) * 100
    # Geklickt zählt als "auch geöffnet" → Basis = alle die die Mail empfangen haben
    $basis = $gesamt
    $oeffnungsrate = if ($basis -gt 0) { [math]::Round(($geoeffnet + $geklickt) / $basis * 100, 1) } else { 0 }
    $klickrate     = if ($basis -gt 0) { [math]::Round($geklickt / $basis * 100, 1) } else { 0 }

    $zeile = "| Tag $tagNr | $thema | $gesamt | $($geoeffnet + $geklickt) | $oeffnungsrate % | $geklickt | $klickrate % |"
    $tabellenzeilen += $zeile

    Write-Host "Tag $tagNr ($thema): $gesamt gesamt | $($geoeffnet + $geklickt) geöffnet ($oeffnungsrate%) | $geklickt geklickt ($klickrate%)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Markdown-Tabelle (zum Einfügen in die Auswertung) ===" -ForegroundColor Yellow
Write-Host ""
$tabellenzeilen | ForEach-Object { Write-Host $_ }

# Optional: Tabelle als Datei speichern
$ausgabeDatei = Join-Path $CsvOrdner "auswertung-$monatName-$Jahr.md"
$tabellenzeilen | Out-File -FilePath $ausgabeDatei -Encoding UTF8
Write-Host ""
Write-Host "Tabelle gespeichert: $ausgabeDatei" -ForegroundColor Cyan
