# Digibiz JSON Export → eine CSV pro Produkt-ID
# Ausgabe: outputs/digibiz-import/<produktId>.csv

$jsonPath = "$PSScriptRoot\..\outputs\digibiz-import\export.json"
$outputDir = "$PSScriptRoot\..\outputs\digibiz-import"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "JSON wird gelesen..." -ForegroundColor Cyan
$json = Get-Content -Path $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$members = $json.businesses[0].members
Write-Host "$($members.Count) Mitglieder gefunden." -ForegroundColor Green

# Alle Produkt-IDs sammeln
$produktMap = @{}

foreach ($member in $members) {
    if ($member.status -ne "ACTIVE") { continue }

    $produktIds = @()

    # Aus abgeschlossenen Bestellungen
    foreach ($order in $member.orders) {
        if ($order.billingStatus -eq "completed" -or $order.billingStatus -eq "active") {
            foreach ($id in $order.dsProductIds) {
                $produktIds += [string]$id
            }
        }
    }

    # Manuell hinzugefügte Kurse (keine Produkt-ID → courseUuid als Kennung)
    foreach ($course in $member.manuallyAddedCourses) {
        $produktIds += "manuell_$($course.courseUuid)"
    }

    $produktIds = $produktIds | Sort-Object -Unique

    foreach ($id in $produktIds) {
        if (-not $produktMap.ContainsKey($id)) {
            $produktMap[$id] = [System.Collections.Generic.List[PSCustomObject]]::new()
        }
        $produktMap[$id].Add([PSCustomObject]@{
            Email      = $member.email
            First_Name = $member.firstName
            Last_Name  = $member.lastName
        })
    }
}

# CSV pro Produkt-ID schreiben
foreach ($produktId in $produktMap.Keys) {
    $safeName = $produktId -replace '[^\w\-]', '_'
    $dateiname = "$outputDir\$safeName.csv"
    $produktMap[$produktId] | Export-Csv -Path $dateiname -NoTypeInformation -Encoding UTF8
    Write-Host "Erstellt: $safeName.csv  ($($produktMap[$produktId].Count) Mitglieder)" -ForegroundColor Green
}

Write-Host "`nFertig! CSVs gespeichert in:" -ForegroundColor Cyan
Write-Host "  $((Resolve-Path $outputDir).Path)" -ForegroundColor Cyan

Write-Host "`nProdukt-IDs Ubersicht (zum Abgleich mit Digistore):" -ForegroundColor Yellow
foreach ($id in ($produktMap.Keys | Sort-Object)) {
    Write-Host "  $id  ->  $($produktMap[$id].Count) Mitglieder"
}
