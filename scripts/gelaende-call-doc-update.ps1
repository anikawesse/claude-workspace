<#
Schickt die Master-Datei der Gelaende-Call-Notizen ins Google Doc
"Gelaende-Programm - Call-Notizen Kundinnen".

ABLAUF: Liest outputs\gelaende-calls\kundinnen-uebersicht.md, macht aus dem
Markdown einfache Bloecke (Ueberschriften, Text, Bullets) und schickt sie an
das Apps-Script-Webapp im Doc (scripts\google-doc-call-notizen.gs). Das Doc
wird dabei KOMPLETT ersetzt - die Master-Datei ist die Quelle der Wahrheit.
Deshalb VOR dem Lauf das Doc lesen und Anikas eigene Aenderungen zuerst in
die Master-Datei uebernehmen (macht der Command /gelaende-call automatisch).

MARKDOWN-REGELN (Untermenge):
  "# ..."   -> Titel        "## ..."  -> Ueberschrift 1
  "### ..." -> Ueberschrift 2          "- ..."   -> Bullet
  "---"     -> Trennlinie              **fett**  -> fett im Doc
  Leerzeilen und <!-- Kommentare --> werden uebersprungen, Rest = normaler Text.

Zugaenge aus scripts\.env (steht in .gitignore):
  GELAENDE_DOC_WEBAPP_URL=https://script.google.com/macros/s/.../exec
#>
param(
    [string]$MasterDatei = "$PSScriptRoot\..\outputs\gelaende-calls\kundinnen-uebersicht.md",
    [string]$EnvDatei    = "$PSScriptRoot\.env",
    [switch]$NurZeigen                     # Bloecke nur anzeigen, nichts senden
)

$ErrorActionPreference = 'Stop'

# --- .env lesen (gleiches Muster wie minikurs-auswertung.ps1) -----------------
if (-not (Test-Path $EnvDatei)) { Write-Error "Keine .env gefunden unter: $EnvDatei"; exit 1 }
$envWerte = @{}
foreach ($zeile in (Get-Content $EnvDatei -Encoding UTF8)) {
    $zeile = $zeile.Trim()
    if (-not $zeile -or $zeile.StartsWith('#')) { continue }
    $i = $zeile.IndexOf('=')
    if ($i -gt 0) { $envWerte[$zeile.Substring(0, $i).Trim()] = $zeile.Substring($i + 1).Trim().Trim('"') }
}
$url = $envWerte['GELAENDE_DOC_WEBAPP_URL']
if (-not $url -and -not $NurZeigen) {
    Write-Error ("In der .env fehlt GELAENDE_DOC_WEBAPP_URL. Erst das Apps-Script " +
                 "(scripts\google-doc-call-notizen.gs) im Google Doc bereitstellen, " +
                 "dann die Web-App-URL eintragen.")
    exit 1
}

# --- Master-Datei -> Bloecke ---------------------------------------------------
if (-not (Test-Path $MasterDatei)) { Write-Error "Master-Datei fehlt: $MasterDatei"; exit 1 }
$bloecke = @()
$imKommentar = $false
foreach ($zeile in (Get-Content $MasterDatei -Encoding UTF8)) {
    $t = $zeile.TrimEnd()
    # HTML-Kommentare (z.B. die Kundinnen-Vorlage) gehoeren nicht ins Doc
    if ($t.Trim().StartsWith('<!--')) { $imKommentar = $true }
    if ($imKommentar) {
        if ($t.Trim().EndsWith('-->')) { $imKommentar = $false }
        continue
    }
    if (-not $t.Trim())                { continue }
    elseif ($t -match '^###\s+(.*)')   { $bloecke += @{ typ = 'h2';     text = $Matches[1] } }
    elseif ($t -match '^##\s+(.*)')    { $bloecke += @{ typ = 'h1';     text = $Matches[1] } }
    elseif ($t -match '^#\s+(.*)')     { $bloecke += @{ typ = 'titel';  text = $Matches[1] } }
    elseif ($t.Trim() -eq '---')       { $bloecke += @{ typ = 'linie';  text = '' } }
    elseif ($t -match '^\s*-\s+(.*)')  { $bloecke += @{ typ = 'bullet'; text = $Matches[1] } }
    else                               { $bloecke += @{ typ = 'text';   text = $t.Trim() } }
}
if (-not $bloecke.Count) { Write-Error "Master-Datei ist leer - nichts zu senden."; exit 1 }

Write-Host ("{0} Bloecke aus {1}" -f $bloecke.Count, (Split-Path $MasterDatei -Leaf))
if ($NurZeigen) {
    $bloecke | ForEach-Object { Write-Host ("  [{0}] {1}" -f $_.typ, $_.text) }
    exit 0
}

# --- Senden --------------------------------------------------------------------
# UTF-8-Bytes senden, sonst kommen Umlaute im Doc kaputt an.
$json  = @{ bloecke = $bloecke } | ConvertTo-Json -Depth 4 -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$antwort = Invoke-RestMethod -Method Post -Uri $url -Body $bytes -ContentType 'application/json; charset=utf-8'

if ($antwort.ok) {
    Write-Host ("OK - {0} Absaetze in '{1}' geschrieben." -f $antwort.absaetze, $antwort.dokument)
} else {
    Write-Error ("Webapp meldet Fehler: {0}" -f $antwort.fehler)
    exit 1
}
