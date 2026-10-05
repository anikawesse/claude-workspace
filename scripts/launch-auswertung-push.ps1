<#
Schreibt die Kennzahlen UND die Sales-Mail-Tabelle EINES Launches in die
Google-Tabelle "Launch-Auswertung Gelände-Webinar" (Cloud, Ordner "6. Auswertungen").

Schreibt ueber die Apps-Script-Webapp (scripts\launch-auswertung-webapp.gs).
Ein Launch = eine Spalte im Blatt "Launch-Auswertung". Die Mail-Tabelle landet als
eigener Block pro Launch im Blatt "Sales-Mails". Gibt es die Launch-Spalte noch
nicht, legt die Webapp sie an und kopiert die Formeln der ersten Launch-Spalte
hinein. Nur weisse Handeingabe-Zeilen werden gesetzt; Formelzeilen bleiben.

NEU:
  - Eingebauter RETRY: Die Apps-Script-Webapp antwortet ueber einen Redirect auf
    googleusercontent.com und liefert sporadisch 404/leer. Das Skript versucht es
    daher bis zu 5x, bis die Tabelle ok meldet.
  - -MailDatei: JSON-Liste der Sales-Mails -> wird als Mail-Block mitgeschrieben.
  - RUECKLESE: nach dem Schreiben wird die Spalte per doGet live zurueckgelesen
    und angezeigt (Kontrolle, dass die Zahlen wirklich in der Tabelle stehen).

Zugang aus scripts\.env (steht in .gitignore):
  LAUNCH_SHEET_WEBAPP_URL=https://script.google.com/macros/s/.../exec

VERWENDUNG:
  .\launch-auswertung-push.ps1 -Launch "Sep 2026" `
      -WerteDatei ..\outputs\webinar-gelaende\launch-werte-sep-2026-komplett.json `
      -MailDatei  ..\outputs\webinar-gelaende\launch-mails-sep-2026.json

  -WerteDatei = JSON { "Beschriftung exakt wie in Spalte A": Wert, ... }
                Zahlen als echte Zahlen (Punkt als Dezimaltrenner). Prozent-/
                Summenzeilen NICHT liefern (sind Formeln). Optional, wenn nur
                die Mail-Tabelle geschrieben werden soll.
  -MailDatei  = JSON-Liste [ { mail, betreff, versand, empfaenger, oeffner,
                klicks, abmeldungen, kaeufe }, ... ]. Optional.
  -NurZeigen  = schickt nichts, zeigt nur, was gesendet wuerde.
#>

param(
    [Parameter(Mandatory = $true)][string]$Launch,
    [string]$WerteDatei,
    [string]$MailDatei,
    [string]$SoftOptOut,
    [string]$EnvDatei,
    [switch]$NurZeigen
)

$ErrorActionPreference = 'Stop'

# Skriptordner robust bestimmen (auch wenn $PSScriptRoot mal leer ist).
$skriptOrdner = $PSScriptRoot
if (-not $skriptOrdner) { $skriptOrdner = Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $EnvDatei) { $EnvDatei = Join-Path $skriptOrdner '.env' }

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
$werteHash = [ordered]@{}
if ($WerteDatei) {
    if (-not (Test-Path $WerteDatei)) { Write-Error "Werte-Datei nicht gefunden: $WerteDatei"; exit 1 }
    $roh = Get-Content -Path $WerteDatei -Raw -Encoding UTF8
    try { $werte = $roh | ConvertFrom-Json } catch { Write-Error "Werte-Datei ist kein gueltiges JSON: $($_.Exception.Message)"; exit 1 }
    $werte.PSObject.Properties | ForEach-Object { $werteHash[$_.Name] = $_.Value }
}

# ---------------------------------------------------------------- Mails lesen
$mails = @()
if ($MailDatei) {
    if (-not (Test-Path $MailDatei)) { Write-Error "Mail-Datei nicht gefunden: $MailDatei"; exit 1 }
    $rohM = Get-Content -Path $MailDatei -Raw -Encoding UTF8
    try { $parsedM = $rohM | ConvertFrom-Json } catch { Write-Error "Mail-Datei ist kein gueltiges JSON: $($_.Exception.Message)"; exit 1 }
    foreach ($m in $parsedM) { $mails += $m }   # einzeln anhaengen (sonst fasst @() das Array als 1 Element)
}

if ($werteHash.Count -eq 0 -and $mails.Count -eq 0) {
    Write-Error "Weder Werte noch Mails uebergeben (mindestens -WerteDatei oder -MailDatei noetig)."; exit 1
}

Write-Host "`nLaunch: $Launch" -ForegroundColor Cyan
if ($werteHash.Count) {
    Write-Host "Kennzahlen ($($werteHash.Count)):" -ForegroundColor Cyan
    $werteHash.GetEnumerator() | ForEach-Object { Write-Host ("  {0,-42} {1}" -f $_.Key, $_.Value) }
}
if ($mails.Count) {
    Write-Host "Sales-Mails ($($mails.Count)):" -ForegroundColor Cyan
    $mails | ForEach-Object { Write-Host ("  {0,-22} Zugestellt {1,-5} Öffner {2,-5} Klicks {3}" -f $_.mail, $_.empfaenger, $_.oeffner, $_.klicks) }
}

if ($NurZeigen) { Write-Host "`n-NurZeigen: nichts gesendet.`n" -ForegroundColor DarkGray; exit 0 }

if (-not $url -or $url -eq 'HIER_EINFUEGEN') {
    Write-Error "In der .env fehlt LAUNCH_SHEET_WEBAPP_URL."
    exit 1
}

# ---------------------------------------------------------------- senden (mit Retry)
# ⚠️ Body als UTF-8-BYTES (PS 5.1 kodiert String-Body sonst als ASCII -> Umlaute kaputt).
$nutzlast = @{ launch = $Launch; werte = $werteHash; mails = $mails }
if ($SoftOptOut -ne '' -and $null -ne $SoftOptOut) { $nutzlast.softOptOut = [int]$SoftOptOut }
$koerper = [Text.Encoding]::UTF8.GetBytes(($nutzlast | ConvertTo-Json -Depth 6 -Compress))

Write-Host "`nSchreibe in die Google-Tabelle..." -ForegroundColor Cyan
$antwort = $null
for ($versuch = 1; $versuch -le 5; $versuch++) {
    # Apps Script antwortet mit 302 auf googleusercontent.com -> Redirect folgen lassen.
    try {
        $r = Invoke-WebRequest -Uri $url -Method POST -Body $koerper -ContentType 'application/json; charset=utf-8' -MaximumRedirection 5 -UseBasicParsing
        $antwort = $r.Content | ConvertFrom-Json
        if ($antwort.ok) { break }
        Write-Host ("  Versuch {0}: Tabelle meldet kein ok, neuer Versuch..." -f $versuch) -ForegroundColor DarkYellow
    }
    catch {
        Write-Host ("  Versuch {0}: {1} - neuer Versuch..." -f $versuch, $_.Exception.Message) -ForegroundColor DarkYellow
    }
    $antwort = $null
    Start-Sleep -Seconds 2
}

if (-not $antwort -or -not $antwort.ok) {
    Write-Warning "  Nach 5 Versuchen kein Erfolg. (Redirect-Problem der Webapp?) Spaeter erneut versuchen."
    exit 1
}

$spInfo = if ($antwort.spalte_neu_angelegt) { "$($antwort.spalte) (NEU angelegt, Formeln kopiert)" } else { "$($antwort.spalte)" }
Write-Host "  OK — Spalte $spInfo" -ForegroundColor Green
if ($antwort.geschrieben.Count) {
    Write-Host "  Kennzahlen eingetragen ($($antwort.geschrieben.Count)): $($antwort.geschrieben -join ', ')" -ForegroundColor Green
}
if ($antwort.nicht_gefunden -and $antwort.nicht_gefunden.Count -gt 0) {
    Write-Warning "  Keine Tabellenzeile fuer: $($antwort.nicht_gefunden -join ', ')"
}
if ($antwort.formel_zeile_uebersprungen -and $antwort.formel_zeile_uebersprungen.Count -gt 0) {
    Write-Host "  Als Formelzeile erkannt und NICHT ueberschrieben: $($antwort.formel_zeile_uebersprungen -join ', ')" -ForegroundColor DarkGray
}
if ($antwort.mails) {
    Write-Host "  Mail-Tabelle: $($antwort.mails.zeilen) Mails im Block '$($antwort.mails.titel)' (Blatt $($antwort.mails.blatt), ab Zeile $($antwort.mails.ab_zeile))" -ForegroundColor Green
}

# ---------------------------------------------------------------- Ruecklese (Kontrolle)
Write-Host "`nRuecklese der Spalte aus der Tabelle (Kontrolle)..." -ForegroundColor Cyan
try {
    $getUrl = $url + '?launch=' + [uri]::EscapeDataString($Launch)
    $rg = Invoke-WebRequest -Uri $getUrl -Method GET -MaximumRedirection 5 -UseBasicParsing
    $g = $rg.Content | ConvertFrom-Json
    if ($g.ok) {
        Write-Host "  Spalte $($g.spalte) ($($g.launch)) enthaelt jetzt:" -ForegroundColor Green
        $g.werte.PSObject.Properties | ForEach-Object { Write-Host ("    {0,-42} {1}" -f $_.Name, $_.Value) }
    } else {
        Write-Warning "  Ruecklese meldete: $($g.fehler)"
    }
} catch {
    Write-Host "  Ruecklese uebersprungen (doGet evtl. noch nicht deployt): $($_.Exception.Message)" -ForegroundColor DarkGray
}
Write-Host ""
