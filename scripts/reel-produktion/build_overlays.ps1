# Erzeugt Text-Overlay-PNGs (1080x1920) im Look der Vorlage.mp4 via GDI+
Add-Type -AssemblyName System.Drawing

$SP = "C:\Users\Olive\AppData\Local\Temp\claude\C--Users-Olive-Desktop-claude-workspace\623f7d3a-a492-4519-b5ba-047967f0377f\scratchpad"
New-Item -ItemType Directory -Force "$SP\overlays" | Out-Null

$fc = New-Object System.Drawing.Text.PrivateFontCollection
$fc.AddFontFile("$SP\Poppins-Medium.ttf")
$fam = $fc.Families[0]
Write-Output ("Font geladen: " + $fam.Name)

$W = 1080; $CANVAS_H = 1920
$FONT_SIZE = 50.0; $LINE_H = 70.0; $PAD_X = 45.0; $PAD_Y = 38.0; $RADIUS = 10.0
$MAX_TEXT_W = 700.0; $MAX_TEXT_W_BOTTOM = 650.0
$TOP_Y = 220.0
$BOTTOM_ANCHOR = 1574.0

$hooks = @(
  @{ n=1; top='Es gibt 5 Dinge, die du über dein Pferd verstehen musst, bevor es ALLEINE mit dir ins Gelände geht.'; bottom='Hier sind sie.' },
  @{ n=2; top='Ich bin seit 20 Jahren Pferdetrainerin.'; bottom='Diese 5 Dinge schaue ich mir als Erstes an, wenn ein Pferd nicht ALLEINE vom Hof gehen will.' },
  @{ n=3; top='Dein Pferd ist nicht stur, wenn es am Hoftor keinen Meter mehr geht. Es hat Angst.'; bottom='Das geht in seinem Kopf vor.' },
  @{ n=4; top='Es macht mich traurig, wenn ein Pferd als stur abgestempelt wird, obwohl es einfach nur Angst hat, ALLEINE vom Hof zu gehen.'; bottom='Das steckt wirklich dahinter.' },
  @{ n=5; top='Ein Pferd, das wie angewurzelt am Hoftor steht, hat oft genauso viel Angst wie eines, das steigt.'; bottom='So erkennst du es.' }
)

$emojiPath = "$SP\emoji_1f447_512.png"
$emoji = $null
try { $emoji = [System.Drawing.Image]::FromFile($emojiPath) } catch { Write-Output "Emoji nicht ladbar, ohne Pfeil." }

function Measure-Text($g, $text, $font) {
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  return $g.MeasureString($text, $font, [int]$script:W, $fmt).Width
}

function Wrap-Text($g, $text, $font, $maxW) {
  $lines = @(); $line = ''
  foreach ($w in $text.Split(' ')) {
    $probe = if ($line) { "$line $w" } else { $w }
    if ((Measure-Text $g $probe $font) -gt $maxW -and $line) { $lines += $line; $line = $w }
    else { $line = $probe }
  }
  if ($line) { $lines += $line }
  return ,$lines
}

function Add-RoundRect($path, $x, $y, $w, $h, $r) {
  $d = 2 * $r
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

function Draw-Block($g, $lines, $font, $boxTop, $withEmoji) {
  $emojiW = if ($withEmoji -and $script:emoji) { $script:LINE_H * 0.82 } else { 0 }
  $maxW = 0.0
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $lw = Measure-Text $g $lines[$i] $font
    if ($withEmoji -and $script:emoji -and $i -eq $lines.Count - 1) { $lw += $emojiW + 6 }
    if ($lw -gt $maxW) { $maxW = $lw }
  }
  $boxW = $maxW + 2 * $script:PAD_X
  $boxH = $lines.Count * $script:LINE_H + 2 * $script:PAD_Y
  $boxX = ($script:W - $boxW) / 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  Add-RoundRect $path $boxX $boxTop $boxW $boxH $script:RADIUS
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $g.FillPath($white, $path)
  $black = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 17, 17, 17))
  $fmt = [System.Drawing.StringFormat]::GenericTypographic
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $lw = Measure-Text $g $lines[$i] $font
    $extra = if ($withEmoji -and $script:emoji -and $i -eq $lines.Count - 1) { $emojiW + 6 } else { 0 }
    $x = ($script:W - $lw - $extra) / 2
    $lineTop = $boxTop + $script:PAD_Y + $i * $script:LINE_H
    $textY = $lineTop + ($script:LINE_H - $font.GetHeight($g)) / 2
    $g.DrawString($lines[$i], $font, $black, [single]$x, [single]$textY, $fmt)
    if ($withEmoji -and $script:emoji -and $i -eq $lines.Count - 1) {
      $ey = $lineTop + ($script:LINE_H - $emojiW) / 2
      $g.DrawImage($script:emoji, [single]($x + $lw + 6), [single]$ey, [single]$emojiW, [single]$emojiW)
    }
  }
}

$font = New-Object System.Drawing.Font($fam, [single]$FONT_SIZE, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

foreach ($h in $hooks) {
  $bmp = New-Object System.Drawing.Bitmap ([int]$W), ([int]$CANVAS_H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear([System.Drawing.Color]::Transparent)

  $topLines = Wrap-Text $g $h.top $font $MAX_TEXT_W
  Draw-Block $g $topLines $font $TOP_Y $false

  $bottomLines = Wrap-Text $g $h.bottom $font $MAX_TEXT_W_BOTTOM
  $bottomH = $bottomLines.Count * $LINE_H + 2 * $PAD_Y
  Draw-Block $g $bottomLines $font ($BOTTOM_ANCHOR - $bottomH) $true

  $out = "$SP\overlays\hook$($h.n).png"
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output ("hook$($h.n).png: oben $($topLines.Count) Zeilen, unten $($bottomLines.Count) Zeilen")
}


