# Futterrechner — Deployment auf Netlify

## Dateien vorbereiten

1. `logo.png` in diesen Ordner legen (gleiche Ebene wie `index.html`)
2. Fertig — alle anderen Dateien sind bereits vorhanden

## Netlify hochladen (einmalig)

1. Auf [netlify.com](https://netlify.com) einloggen (kostenloser Account reicht)
2. **"Add new site" → "Deploy manually"**
3. Den gesamten `futterrechner`-Ordner per Drag & Drop auf Netlify ziehen
4. Netlify vergibt automatisch eine URL (z. B. `https://dein-name.netlify.app`)

## Claude API Key einrichten (für Screenshot-Analyse)

Damit die Heuanalyse per Foto funktioniert:

1. In Netlify: **Site settings → Environment variables**
2. Neue Variable anlegen:
   - Key: `ANTHROPIC_API_KEY`
   - Value: dein API-Key von [console.anthropic.com](https://console.anthropic.com)
3. **Save** — fertig

> Ohne API Key funktioniert alles außer der Screenshot-Analyse. Die Lufa-Werte und manuelle Eingabe laufen immer.

## In Kurs einbetten (iframe)

Den Netlify-Link als iframe in deine Kursplattform einfügen:

```html
<iframe
  src="https://DEINE-URL.netlify.app"
  width="100%"
  height="800"
  frameborder="0"
  style="border-radius: 12px;">
</iframe>
```

Breite 100% passt sich dem Kursbereich an. Höhe ggf. auf 900px erhöhen.

## Lufa-Werte jährlich aktualisieren

Wenn neue Lufa-Daten vorliegen, einfach kurz Bescheid geben — ich aktualisiere die Werte in `index.html` in 2 Minuten (Zeile mit `const LUFA = {...}`).

## Updates einspielen

Neue Version von `index.html` einfach wieder per Drag & Drop in Netlify hochladen. Die URL bleibt gleich.
