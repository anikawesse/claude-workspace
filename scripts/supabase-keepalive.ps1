# Keep-Alive-Ping fuer das Supabase-Projekt der Content-Maschine (cmeusofrxqzewhtbpszw).
# Verhindert das automatische Pausieren im Free-Tier (Pause nach 7 Tagen ohne API-Aktivitaet).
# Laeuft taeglich ueber die Windows-Aufgabenplanung (Task: "Supabase KeepAlive Content-Maschine").
# Der Key ist der oeffentliche Publishable-Key aus der App selbst (outputs/content-maschine/index.html) - kein Geheimnis.

$url = 'https://cmeusofrxqzewhtbpszw.supabase.co/rest/v1/content_store?select=user_id&limit=1'
$key = 'sb_publishable_NMRqZrismuTZD-b8ieYGxA_Q9zwG3Jj'
$log = Join-Path $PSScriptRoot 'supabase-keepalive.log'

try {
    $resp = Invoke-WebRequest -Uri $url -Headers @{ apikey = $key; Authorization = "Bearer $key" } -UseBasicParsing -TimeoutSec 30
    $line = "{0}  OK  HTTP {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $resp.StatusCode
} catch {
    $line = "{0}  FEHLER  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $_.Exception.Message
}
Add-Content -Path $log -Value $line

# Log klein halten (nur die letzten 60 Zeilen behalten)
$tail = Get-Content $log -Tail 60
Set-Content -Path $log -Value $tail
