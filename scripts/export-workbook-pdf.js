const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Navigate and wait for fonts + images
  await page.goto('file:///C:/Users/Olive/Desktop/claude-workspace/outputs/gelaendeschluessel/workbook.html', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Give extra time for Google Fonts to render
  await new Promise(r => setTimeout(r, 2000));

  const outPath = 'C:/Users/Olive/Desktop/workbook-gelaendeschluessel.pdf';

  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();

  const fs = require('fs');
  const size = fs.statSync(outPath).size;
  console.log(`PDF saved: ${outPath} (${(size / 1024).toFixed(0)} KB)`);
})();
