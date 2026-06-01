Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\Olive\Desktop\claude-workspace\outputs\gelaendeschluessel\tc-bilder"

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

function Optimize-Img {
  param($file, $targetW, $quality, $bgHex)
  $src = [System.Drawing.Image]::FromFile($file)
  $w = $src.Width; $h = $src.Height
  if ($w -gt $targetW) { $nw = $targetW; $nh = [int][math]::Round($h * $targetW / $w) } else { $nw = $w; $nh = $h }
  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  if ($bgHex) { $g.Clear([System.Drawing.ColorTranslator]::FromHtml($bgHex)) }
  $g.DrawImage($src, 0, 0, $nw, $nh)
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  $ms = New-Object IO.MemoryStream
  $bmp.Save($ms, $jpegCodec, $ep)
  $bytes = $ms.ToArray()
  $g.Dispose(); $bmp.Dispose(); $src.Dispose(); $ms.Dispose()
  return @{ b64 = [Convert]::ToBase64String($bytes); kb = [math]::Round($bytes.Length/1KB,0); dim = "$nw x $nh" }
}

# Token -> (Datei, Zielbreite, Qualitaet, Hintergrund fuers Flatten)
$map = [ordered]@{
  '__URL_HERO__'      = @('1-hero-mockup.png', 900, 82, '#f5ede2')
  '__URL_AMIR__'      = @('2-amir.jpeg',       120, 82, $null)
  '__URL_MELLI__'     = @('3-melli.jpeg',      120, 82, $null)
  '__URL_MANNI__'     = @('4-manni.jpeg',      120, 82, $null)
  '__URL_LEONARDO__'  = @('5-leonardo.jpeg',   120, 82, $null)
  '__URL_FINAL__'     = @('6-ueber-mich.jpeg', 520, 82, $null)
}

$tc = [IO.File]::ReadAllText("C:\Users\Olive\Desktop\claude-workspace\outputs\gelaendeschluessel\salespage-thrivecart.html", [Text.Encoding]::UTF8)
foreach ($tok in $map.Keys) {
  $cfg = $map[$tok]
  $r = Optimize-Img (Join-Path $dir $cfg[0]) $cfg[1] $cfg[2] $cfg[3]
  "{0,-20} -> {1,-10} {2} KB" -f $tok, $r.dim, $r.kb
  $tc = $tc.Replace($tok, "data:image/jpeg;base64," + $r.b64)
}

$enc = New-Object Text.UTF8Encoding($false)
$out = "C:\Users\Olive\Desktop\claude-workspace\outputs\gelaendeschluessel\salespage-thrivecart-FINAL.html"
[IO.File]::WriteAllText($out, $tc, $enc)
"---"
"FINAL (optimiert) Groesse: $([math]::Round(((Get-Item $out).Length/1KB),0)) KB"

# Vorschau mit charset
$preview = "<!DOCTYPE html><html lang=""de""><head><meta charset=""utf-8""><meta name=""viewport"" content=""width=device-width, initial-scale=1.0""></head><body style=""margin:0;background:#ddd;padding:20px 0"">" + $tc + "</body></html>"
$pv = "C:\Users\Olive\Desktop\claude-workspace\outputs\gelaendeschluessel\salespage-thrivecart-preview.html"
[IO.File]::WriteAllText($pv, $preview, $enc)

# in Zwischenablage
$tc | Set-Clipboard
"Code liegt in der Zwischenablage."
Start-Process $pv