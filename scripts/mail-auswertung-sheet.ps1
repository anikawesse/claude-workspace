<#
Traegt die monatliche Mail-Auswertung des Workflows "Gelände-Schlüssel" in das
Blatt "Mails" der Google-Tabelle "Auswertung Gelände-Schlüssel 2026" ein.

WARUM ES DAS GIBT: Diese Zahlen sind bei Devine/GoHighLevel NICHT abrufbar —
weder ueber die API (Token wird fuer E-Mail-Statistik mit 401 abgelehnt) noch
ueber den Browser (Statistik laeuft in einem Cross-Origin-iframe). Anika liest
sie per Screenshot ab, Claude traegt sie in die Markdown-Datei ein, und dieses
Skript schiebt sie von dort in die Google-Tabelle.

QUELLE DER WAHRHEIT ist deshalb die Markdown-Datei:
  outputs\mail-auswertung\gelaende-schluessel-mail-auswertung.md
Dieses Skript liest sie nur aus und rechnet nichts selbst.

WICHTIG: Devine zeigt immer "all time". Die Werte hier sind also KUMULIERT.
Die Monatswerte rechnet die Tabelle selbst als Differenz zum vorherigen Stand
(Formeln in den Spalten K bis O, gesetzt von google-sheet-webapp.gs).

Verwendung:
  .\mail-auswertung-sheet.ps1 -NurZeigen
    -> liest die Datei, zeigt was gesendet wuerde, schickt NICHTS

  .\mail-auswertung-sheet.ps1
    -> sendet den JUENGSTEN Stand-Block aus der Datei

  .\mail-auswertung-sheet.ps1 -Stand 03.08.2026
    -> sendet gezielt diesen Stand

Ein bereits vorhandener Stand wird in der Tabelle ueberschrieben, nicht doppelt
angehaengt. Ein zweiter Lauf mit korrigierten Zahlen ist also gefahrlos.
#>

param(
    [string]$Stand,
    [switch]$NurZeigen,
    [string]$EnvDatei = "$PSScriptRoot\.env",
    [string]$MdDatei  = "$PSScriptRoot\..\outputs\mail-auswertung\gelaende-schluessel-mail-auswertung.md"
)

$ErrorActionPreference = 'Stop'

# ------------------------------------------------------------ .env einlesen
$env_ = @{}
if (Test-Path $EnvDatei) {
    foreach ($zeile in Get-Content $EnvDatei -Encoding UTF8) {
        if ($zeile -match '^\s*([A-Z_]+)\s*=\s*(.*)$') { $env_[$Matches[1]] = $Matches[2].Trim() }
    }
}

# ------------------------------------------------------------ Helfer
# "78,70 %" -> 0.787 (Google erwartet den Bruchwert, das % macht die Formatierung)
function ProzentAlsBruch([string]$text) {
    $t = ($text -replace '[%\s]', '') -replace ',', '.'
    if ($t -eq '' -or $t -eq '-' -or $t -eq [char]0x2014) { return $null }
    $n = 0.0
    if ([double]::TryParse($t, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$n)) {
        return [math]::Round($n / 100, 6)
    }
    return $null
}

function GanzeZahl([string]$text) {
    $t = ($text -replace '[^\d]', '')
    if ($t -eq '') { return $null }
    return [int]$t
}

# ------------------------------------------------------------ Markdown lesen
if (-not (Test-Path $MdDatei)) { throw "Datei nicht gefunden: $MdDatei" }
$inhalt = Get-Content $MdDatei -Encoding UTF8

# Alle Stand-Ueberschriften finden, z.B. "## Basis-Stand 03.08.2026 (kumuliert, all time)"
$staende = @()
for ($i = 0; $i -lt $inhalt.Count; $i++) {
    if ($inhalt[$i] -match '^##\s+.*Stand\s+(\d{2}\.\d{2}\.\d{4})') {
        $staende += [pscustomobject]@{ Datum = $Matches[1]; Zeile = $i }
    }
}
if (-not $staende) { throw "In $MdDatei wurde keine Ueberschrift der Form '## ... Stand TT.MM.JJJJ' gefunden." }

if ($Stand) {
    $ziel = $staende | Where-Object { $_.Datum -eq $Stand } | Select-Object -First 1
} else {
    $ziel = $staende | Select-Object -Last 1
}
if (-not $ziel) {
    throw "Stand '$Stand' nicht gefunden. Vorhanden: $(($staende.Datum) -join ', ')"
}

# Ab der Ueberschrift bis zur naechsten Ueberschrift die Tabellenzeilen einsammeln
$zeilen = @()
for ($i = $ziel.Zeile + 1; $i -lt $inhalt.Count; $i++) {
    if ($inhalt[$i] -match '^##\s') { break }
    if ($inhalt[$i] -notmatch '^\|\s*Tag\s+\d+\s*\|') { continue }

    $f = $inhalt[$i].Split('|') | ForEach-Object { $_.Trim() }
    # f[0] ist leer (Zeile beginnt mit |). Reihenfolge laut Tabellenkopf:
    # Mail | Thema | Zweck | Empfänger | Geöffnet | Geklickt | Klicks abs. | Käufe
    if ($f.Count -lt 9) {
        Write-Warning "Zeile $($i+1) hat nur $($f.Count) Spalten und wird uebersprungen: $($inhalt[$i])"
        continue
    }

    # Kaeufe-Zelle sieht so aus: "**1** (27 €)" oder "0" oder "—" oder leer
    $kaufZelle = $f[8] -replace '\*', ''
    $kaeufe = $null; $umsatz = $null
    if ($kaufZelle -match '^\s*(\d+)') { $kaeufe = [int]$Matches[1] }
    if ($kaufZelle -match '\(\s*([\d.,]+)\s*€') {
        $u = $Matches[1] -replace '\.', '' -replace ',', '.'
        $umsatz = [double]::Parse($u, [Globalization.CultureInfo]::InvariantCulture)
    }

    $zeilen += [pscustomobject]@{
        mail       = $f[1]
        thema      = $f[2]
        zweck      = $f[3]
        empfaenger = (GanzeZahl $f[4])
        geoeffnet  = (ProzentAlsBruch $f[5])
        geklickt   = (ProzentAlsBruch $f[6])
        kaeufe     = $kaeufe
        umsatz     = $umsatz
    }
}

if ($zeilen.Count -ne 15) {
    Write-Warning "Erwartet werden 15 Mail-Zeilen (Tag 1 bis Tag 15), gefunden: $($zeilen.Count)."
    Write-Warning "Die Monatsdifferenz in der Tabelle rechnet mit 15er-Bloecken — bitte pruefen."
}

# ------------------------------------------------------------ Anzeigen
Write-Host ""
Write-Host "Stand $($ziel.Datum) — $($zeilen.Count) Mails aus $(Split-Path $MdDatei -Leaf)" -ForegroundColor Cyan
$zeilen | Format-Table @{L='Mail';E={$_.mail}},
                       @{L='Empf.';E={$_.empfaenger}},
                       @{L='Geöffnet';E={ if ($null -ne $_.geoeffnet) { '{0:P2}' -f $_.geoeffnet } }},
                       @{L='Geklickt';E={ if ($null -ne $_.geklickt)  { '{0:P2}' -f $_.geklickt  } }},
                       @{L='Käufe';E={$_.kaeufe}},
                       @{L='Umsatz';E={ if ($null -ne $_.umsatz) { '{0:N2} €' -f $_.umsatz } }} -AutoSize

if ($NurZeigen) {
    Write-Host "-NurZeigen gesetzt — es wurde nichts gesendet." -ForegroundColor DarkGray
    return
}

# ------------------------------------------------------------ Senden
if (-not $env_['SHEET_WEBAPP_URL'] -or $env_['SHEET_WEBAPP_URL'] -eq 'HIER_EINFUEGEN') {
    throw "SHEET_WEBAPP_URL fehlt in $EnvDatei — ohne die Web-App-URL kann nichts geschrieben werden."
}

$nutzlast = @{ mails = @{ stand = $ziel.Datum; zeilen = $zeilen } }

# PowerShell 5.1 kodiert einen String-Body ohne charset als ASCII — aus "Geöffnet"
# wuerde unterwegs "Ge?ffnet". Deshalb ausdruecklich als UTF-8-Bytes senden.
# (Genau dieser Fehler hat im Juli 2026 die Umlaut-Zeilen der Tagesauswertung
# still leer gelassen.)
$koerper = [Text.Encoding]::UTF8.GetBytes(($nutzlast | ConvertTo-Json -Depth 6 -Compress))

try {
    # Apps Script antwortet mit 302 auf googleusercontent.com -> Redirect folgen lassen
    $antwort = Invoke-RestMethod -Uri $env_['SHEET_WEBAPP_URL'] -Method POST `
        -Body $koerper -ContentType 'application/json; charset=utf-8' -MaximumRedirection 5

    if ($antwort.ok) {
        Write-Host ""
        Write-Host "Eingetragen in Blatt '$($antwort.blatt)', ab Zeile $($antwort.ab_zeile) ($($antwort.modus))." -ForegroundColor Green
        Write-Host "Monatswerte: $($antwort.monatswerte)" -ForegroundColor Green
        if ($antwort.dubletten_entfernt -gt 0) {
            Write-Host "Doppelte Zeilen entfernt: $($antwort.dubletten_entfernt)" -ForegroundColor Green
        }
        if ($antwort.formelfehler -gt 0) {
            Write-Warning "  $($antwort.formelfehler) Formelzelle(n) stehen auf #ERROR — Webapp neu bereitgestellt?"
        }
    } else {
        Write-Warning "Die Tabelle meldet: $($antwort.fehler)"
    }
} catch {
    Write-Warning "Senden fehlgeschlagen: $($_.Exception.Message)"
    Write-Host "Haeufigste Ursache: Die Apps-Script-Webapp wurde nach der Code-Aenderung nicht neu bereitgestellt." -ForegroundColor DarkGray
}
