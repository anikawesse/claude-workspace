<#
Schreibt die Kennzahlen EINES Launches in die Google-Tabelle
"Launch-Auswertung Gelände-Webinar" (Cloud, Ordner "6. Auswertungen").

Schreibt ueber die Apps-Script-Webapp (scripts\launch-auswertung-webapp.gs).
Ein Launch = eine Spalte. Gibt es die Spalte fuer den Launch noch nicht, legt die
Webapp sie an und kopiert die Formeln der ersten Launch-Spalte hinein — die beigen
Zeilen (Conversion, ROAS ...) rechnen dann automatisch. Nur die weissen
Handeingabe-Zeilen werden gesetzt; Formelzeilen und Notizen bleiben unangetastet.

Zugang aus scripts\.env (steht in .gitignore):
  LAUNCH_SHEET_WEBAPP_URL=https://script.google.com/macros/s/.../exec

VERWENDUNG:
  .\launch-auswertung-push.ps1 -Launch "Sep 2026" -WerteDatei ..\outputs\webinar-gelaende\launch-werte-sep-2026.json

  -WerteDatei = JSON mit { "Beschriftung exakt wie in Spalte A": Wert, ... }
    Beispiel:
      {
        "Anmeldungen organisch": 200,
        "Anmeldungen Ads": 210,
        "Ad-Spend Webinar (€)": 1180.50,
        "Checkout-Aufrufe (Bezahlseite)": 41,
        "Bestellungen über Checkout": 8
      }
    Zahlen als echte Zahlen (kein Tausenderpunkt, Punkt als Dezimaltrenner).
    Text-Zeilen (Webinar-Datum usw.) als String. Prozent-/Summenzeilen NICHT
    liefern — die sind Formeln und rechnen sich selbst.

  -NurZeigen   schickt nichts, zeigt nur, was gesendet wuerde.
#>

param(
    [Parameter(Mandatory = $true)][string]$Launch,
    [Parameter(Mandatory = $true)][string]$WerteDatei,
    [string]$EnvDatei = "$PSScriptRoot\.env",
    [switch]$NurZeigen
)

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------- .env lesen
if (-not (Test-Path $EnvDatei)) {
    Write-Error "Keine .env gefunden unter: $EnvDatei`nTrage dort LAUNCH_SHEET_WEBAPP_URL=... ein (URL nicht in den Chat)."
    exit 1
}
$env_ = @{}
Get-Content $EnvDatei | ForEach-Object {
    $z = $_.Trim()
    if ($z -and -not $z.StartsWith('#') -and $z.Contains('=')) {
        $i = $z.IndexOf('=')
        $env_[$z.Substring(0, $i).Trim()] = $z.Substring($i + 1).Trim().Trim('"')
    }
}
$url = $env_['LAUNCH_SHEET_WEBAPP_URL']

# ---------------------------------------------------------------- Werte lesen
if (-not (Test-Path $WerteDatei)) { Write-Error "Werte-Datei nicht gefunden: $WerteDatei"; exit 1 }
$roh = Get-Content -Path $WerteDatei -Raw -Encoding UTF8
try { $werte = $roh | ConvertFrom-Json } catch { Write-Error "Werte-Datei ist kein gueltiges JSON: $($_.Exception.Message)"; exit 1 }

# ConvertFrom-Json liefert ein PSCustomObject -> in geordnetes Hashtable wandeln
$werteHash = [ordered]@{}
$werte.PSObject.Properties | ForEach-Object { $werteHash[$_.Name] = $_.Value }

if ($werteHash.Count -eq 0) { Write-Error "Keine Werte in $WerteDatei."; exit 1 }

Write-Host "`nLaunch: $Launch" -ForegroundColor Cyan
Write-Host "Werte ($($werteHash.Count)):" -ForegroundColor Cyan
$werteHash.GetEnumerator() | ForEach-Object { Write-Host ("  {0,-40} {1}" -f $_.Key, $_.Value) }

if ($NurZeigen) { Write-Host "`n-NurZeigen: nichts gesendet.`n" -ForegroundColor DarkGray; exit 0 }

if (-not $url -or $url -eq 'HIER_EINFUEGEN') {
    Write-Error @"
In der .env fehlt LAUNCH_SHEET_WEBAPP_URL.

So kommst du dran (einmalig):
  1. Google-Tabelle "Launch-Auswertung Gelände-Webinar" oeffnen
  2. Erweiterungen -> Apps Script -> Inhalt aus scripts\launch-auswertung-webapp.gs einfuegen
  3. Bereitstellen -> Neue Bereitstellung -> Web-App (Ausfuehren als: Ich, Zugriff: Jeder)
  4. Web-App-URL kopieren -> in scripts\.env: LAUNCH_SHEET_WEBAPP_URL=...
"@
    exit 1
}

# ---------------------------------------------------------------- senden
$nutzlast = @{ launch = $Launch; werte = $werteHash }

# ⚠️ Body als UTF-8-BYTES, nicht als String. PowerShell 5.1 kodiert einen
# String-Body sonst als ASCII -> aus "Bestellungen über Checkout" wird
# "Bestellungen ?ber Checkout", die Webapp findet die Zeile nicht und ueberspringt
# sie STILL. (Genau dieser Fehler ist bei der Tages-Auswertung passiert.)
$koerper = [Text.Encoding]::UTF8.GetBytes(($nutzlast | ConvertTo-Json -Depth 5 -Compress))

Write-Host "`nSchreibe in die Google-Tabelle..." -ForegroundColor Cyan
try {
    # Apps Script antwortet mit 302 auf googleusercontent.com -> Redirect folgen lassen
    $antwort = Invoke-RestMethod -Uri $url -Method POST `
        -Body $koerper -ContentType 'application/json; charset=utf-8' -MaximumRedirection 5

    if ($antwort.ok) {
        $spInfo = if ($antwort.spalte_neu_angelegt) { "$($antwort.spalte) (NEU angelegt, Formeln kopiert)" } else { "$($antwort.spalte)" }
        Write-Host "  OK — Spalte $spInfo" -ForegroundColor Green
        Write-Host "  Eingetragen ($($antwort.geschrieben.Count)): $($antwort.geschrieben -join ', ')" -ForegroundColor Green
        if ($antwort.nicht_gefunden -and $antwort.nicht_gefunden.Count -gt 0) {
            Write-Warning "  Keine Tabellenzeile fuer: $($antwort.nicht_gefunden -join ', ')"
            Write-Host "  -> Beschriftung exakt wie in Spalte A schreiben (inkl. Sonderzeichen)." -ForegroundColor DarkGray
        }
        if ($antwort.formel_zeile_uebersprungen -and $antwort.formel_zeile_uebersprungen.Count -gt 0) {
            Write-Host "  Als Formelzeile erkannt und NICHT ueberschrieben: $($antwort.formel_zeile_uebersprungen -join ', ')" -ForegroundColor DarkGray
        }
    } else {
        Write-Warning "  Die Tabelle meldet: $($antwort.fehler)"
    }
} catch {
    Write-Warning "  Senden fehlgeschlagen: $($_.Exception.Message)"
}
Write-Host ""
