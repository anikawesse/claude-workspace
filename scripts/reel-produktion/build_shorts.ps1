# Erzeugt Overlay-PNGs (1080x1920) fuer B-Roll Shorts "Situation + 2 falsche Ansaetze".
# Aufruf: powershell -NoProfile -ExecutionPolicy Bypass -File build_shorts.ps1 -Jobs <jobs.json> -Out <ordner>
# jobs.json: [{ "n":1, "sit":"Wenn dein Pferd ...", "f1":"Versuche nicht: ...", "f2":"Versuche nicht: ..." }]
# Zusaetzlich einmal sondern.png: Box "Sondern" + Emoji unten (Unterkante 1574), erscheint zum Schluss.
# Pro Job: s<n>_top.png (Situation oben), s<n>_bot.png (Situation unten), s<n>_f1.png, s<n>_f2.png
# Layout-Regel (Anika): Situation NIE mittig. Oben ab y=220 oder unten mit Unterkante 1574.
param([string]$Jobs, [string]$Out)
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $Out | Out-Null

$fc = New-Object System.Drawing.Text.PrivateFontCollection
$fc.AddFontFile((Join-Path $PSScriptRoot "Poppins-Medium.ttf"))
$fam = $fc.Families[0]

$W = 1080; $CANVAS_H = 1920
$FONT_SIZE = 50.0; $LINE_H = 70.0; $PAD_X = 45.0; $PAD_Y = 38.0; $RADIUS = 10.0
$MAX_TEXT_W = 860.0
$TOP_Y = 220.0; $GAP = 26.0; $GAP_SIT = 90.0  # mehr Luft nach der Situation (Anika 06.11.)
$BOTTOM_ANCHOR = 1574.0
$ICON = 44.0

function Measure-Text($g, $text, $font) {
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  # ohne Breitenlimit messen, sonst bricht GDI+ intern um und meldet zu kleine Breiten
  return $g.MeasureString($text, $font, (New-Object System.Drawing.PointF 0, 0), $fmt).Width
}
function Wrap-Text($g, $text, $font, $maxW, $firstIndent) {
  $lines = @(); $line = ''; $limit = $maxW - $firstIndent
  foreach ($w in $text.Split(' ')) {
    $probe = if ($line) { "$line $w" } else { $w }
    if ((Measure-Text $g $probe $font) -gt $limit -and $line) { $lines += $line; $line = $w; $limit = $maxW }
    else { $line = $probe }
  }
  if ($line) { $lines += $line }
  return ,$lines
}
function Add-RoundRect($path, $x, $y, $w, $h, $r) {
  $d = 2 * $r
  $path.AddArc($x, $y, $d, $d, 180, 90); $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90); $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}
function Block-Height($lines) { return $lines.Count * $script:LINE_H + 2 * $script:PAD_Y }
function Draw-Block($g, $lines, $font, $boxTop, $withX) {
  $indent = if ($withX) { $script:ICON + 14 } else { 0 }
  $maxW = 0.0
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $lw = (Measure-Text $g $lines[$i] $font) + $(if ($i -eq 0) { $indent } else { 0 })
    if ($lw -gt $maxW) { $maxW = $lw }
  }
  $boxW = $maxW + 2 * $script:PAD_X; $boxH = Block-Height $lines; $boxX = ($script:W - $boxW) / 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  Add-RoundRect $path $boxX $boxTop $boxW $boxH $script:RADIUS
  $g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)), $path)
  $black = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 17, 17, 17))
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $lw = Measure-Text $g $lines[$i] $font
    $ind = if ($i -eq 0) { $indent } else { 0 }
    $x = ($script:W - $lw - $ind) / 2
    $lineTop = $boxTop + $script:PAD_Y + $i * $script:LINE_H
    $textY = $lineTop + ($script:LINE_H - $font.GetHeight($g)) / 2
    if ($i -eq 0 -and $withX) {
      # rotes X (wie Emoji), gezeichnet
      $ix = $x; $iy = $lineTop + ($script:LINE_H - $script:ICON) / 2
      $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 222, 41, 41)), 11
      $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round; $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
      $m = 6
      $g.DrawLine($pen, [single]($ix + $m), [single]($iy + $m), [single]($ix + $script:ICON - $m), [single]($iy + $script:ICON - $m))
      $g.DrawLine($pen, [single]($ix + $script:ICON - $m), [single]($iy + $m), [single]($ix + $m), [single]($iy + $script:ICON - $m))
    }
    $g.DrawString($lines[$i], $font, $black, [single]($x + $ind), [single]$textY, $fmt)
  }
}
function New-Canvas() {
  $bmp = New-Object System.Drawing.Bitmap ([int]$script:W), ([int]$script:CANVAS_H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear([System.Drawing.Color]::Transparent)
  return @($bmp, $g)
}

$emoji = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot "emoji_1f447_512.png"))
$font = New-Object System.Drawing.Font($fam, [single]$FONT_SIZE, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$list = Get-Content -Raw -Encoding UTF8 $Jobs | ConvertFrom-Json
$probeBmp = New-Object System.Drawing.Bitmap 10, 10; $pg = [System.Drawing.Graphics]::FromImage($probeBmp)

# Sondern-Box mit Emoji (einmal fuer alle)
$c = New-Canvas; $g = $c[1]
$txt = "Sondern"; $tw = Measure-Text $g $txt $font; $ew = $LINE_H * 0.82
$bw = $tw + 10 + $ew + 2 * $PAD_X; $bh = $LINE_H + 2 * $PAD_Y; $bx = ($W - $bw) / 2; $by = $BOTTOM_ANCHOR - $bh
$path = New-Object System.Drawing.Drawing2D.GraphicsPath; Add-RoundRect $path $bx $by $bw $bh $RADIUS
$g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)), $path)
$ty = $by + $PAD_Y + ($LINE_H - $font.GetHeight($g)) / 2
$g.DrawString($txt, $font, (New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 17, 17, 17))), [single]($bx + $PAD_X), [single]$ty, [System.Drawing.StringFormat]::GenericTypographic)
$g.DrawImage($emoji, [single]($bx + $PAD_X + $tw + 10), [single]($by + $PAD_Y + ($LINE_H - $ew) / 2), [single]$ew, [single]$ew)
$c[0].Save((Join-Path $Out "sondern.png"), [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $c[0].Dispose()

foreach ($j in $list) {
  $sit = Wrap-Text $pg $j.sit $font $MAX_TEXT_W 0
  $f1 = Wrap-Text $pg $j.f1 $font $MAX_TEXT_W ($ICON + 14)
  $f2 = Wrap-Text $pg $j.f2 $font $MAX_TEXT_W ($ICON + 14)
  $hS = Block-Height $sit; $h1 = Block-Height $f1
  $y1 = $TOP_Y + $hS + $GAP_SIT; $y2 = $y1 + $h1 + $GAP
  foreach ($v in @(@('top', $TOP_Y), @('bot', ($BOTTOM_ANCHOR - $hS)))) {
    $c = New-Canvas; Draw-Block $c[1] $sit $font $v[1] $false
    $c[0].Save((Join-Path $Out "s$($j.n)_$($v[0]).png"), [System.Drawing.Imaging.ImageFormat]::Png); $c[1].Dispose(); $c[0].Dispose()
  }
  $c = New-Canvas; Draw-Block $c[1] $f1 $font $y1 $true
  $c[0].Save((Join-Path $Out "s$($j.n)_f1.png"), [System.Drawing.Imaging.ImageFormat]::Png); $c[1].Dispose(); $c[0].Dispose()
  $c = New-Canvas; Draw-Block $c[1] $f2 $font $y2 $true
  $c[0].Save((Join-Path $Out "s$($j.n)_f2.png"), [System.Drawing.Imaging.ImageFormat]::Png); $c[1].Dispose(); $c[0].Dispose()
  Write-Output ("s$($j.n): Situation $($sit.Count) Zeilen, X1 $($f1.Count), X2 $($f2.Count), Unterkante " + [int]($y2 + (Block-Height $f2)))
}
