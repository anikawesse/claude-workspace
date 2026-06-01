$src = "C:\Users\Olive\Desktop\claude-workspace\outputs\gelaendeschluessel\landingpage.html"
$dst = "C:\Users\Olive\Desktop\claude-workspace\outputs\gelaendeschluessel\salespage-thrivecart.html"

$html = [IO.File]::ReadAllText($src, [Text.Encoding]::UTF8)

# --- 1) STYLE extrahieren ---
$styleMatch = [regex]::Match($html, '(?s)<style>(.*?)</style>')
$css = $styleMatch.Groups[1].Value

# Kommentare entfernen
$css = [regex]::Replace($css, '(?s)/\*.*?\*/', '')

# Funktion: jede Regel in einem flachen CSS-Block mit .gs-lp prefixen
$prefixRules = {
  param($cssBlock)
  [regex]::Replace($cssBlock, '([^{}]+)\{([^{}]*)\}', {
    param($m)
    $sels = $m.Groups[1].Value
    $body = $m.Groups[2].Value
    $parts = $sels -split ','
    $new = foreach ($p in $parts) {
      $sel = $p.Trim()
      if ($sel -eq '') { continue }
      elseif ($sel -eq ':root') { ':root' }
      elseif ($sel -eq '*') { '.gs-lp *' }
      elseif ($sel -eq 'body') { '.gs-lp' }
      elseif ($sel.StartsWith('.gs-lp')) { $sel }
      else { '.gs-lp ' + $sel }
    }
    ($new -join ',') + '{' + $body + '}'
  })
}

# --- 2) @media-Block isolieren (flache Regeln innen) ---
$mediaRx = [regex]'(?s)@media[^{]*\{((?:[^{}]+\{[^{}]*\}\s*)*)\}'
$mediaM = $mediaRx.Match($css)
$mediaOut = ''
if ($mediaM.Success) {
  $inner = $mediaM.Groups[1].Value
  $innerPrefixed = & $prefixRules $inner
  $mediaOut = '@media(max-width:640px){' + $innerPrefixed + '}'
  $css = $css.Remove($mediaM.Index, $mediaM.Length)
}

# --- 3) Top-Level-Regeln prefixen, Media-Block ans Ende ---
$cssScoped = & $prefixRules $css
$cssScoped = $cssScoped + "`n" + $mediaOut

# Montserrat per @import (statt <link>)
$cssScoped = "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');`n" + $cssScoped

# --- 4) BODY extrahieren ---
$bodyMatch = [regex]::Match($html, '(?s)<body>(.*?)</body>')
$body = $bodyMatch.Groups[1].Value

# Footer (Impressum/Datenschutz) entfernen - baut Anika selbst unter die Checkout-Box
$body = [regex]::Replace($body, '(?s)<footer class="site-footer">.*?</footer>', '')

# Base64-Bilder -> Platzhalter-URLs (Reihenfolge: hero, amir, melli, manni, leonardo, final)
$tokens = @('__URL_HERO__','__URL_AMIR__','__URL_MELLI__','__URL_MANNI__','__URL_LEONARDO__','__URL_FINAL__')
$ti = 0
$body = [regex]::Replace($body, 'data:image/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+', { param($mm) $t = $tokens[$script:ti]; $script:ti++; $t })

# Digistore-Buttons -> Scroll zur Checkout-Box
$body = $body.Replace('href="https://www.digistore24.com/product/687927" target="_blank" rel="noopener"', 'href="#gs-checkout" onclick="var e=document.getElementById(''gs-checkout'');if(e){e.scrollIntoView({behavior:''smooth''});}return false;"')

# Wrappen
$wrapped = '<div class="gs-lp">' + $body + '<div id="gs-checkout" style="height:1px"></div></div>'

# --- 5) Zusammenbauen ---
$final = "<style>`n" + $cssScoped + "`n</style>`n" + $wrapped

$enc = New-Object Text.UTF8Encoding($false)
[IO.File]::WriteAllText($dst, $final, $enc)

"FERTIG. Datei: $dst"
"Groesse: $([math]::Round(((Get-Item $dst).Length/1KB),1)) KB"
"Platzhalter im File:"
$tokens | ForEach-Object { $c = ([regex]::Matches($final, [regex]::Escape($_))).Count; "  $_  -> $c x" }
"Scroll-Buttons: $((([regex]::Matches($final,'#gs-checkout')).Count))"