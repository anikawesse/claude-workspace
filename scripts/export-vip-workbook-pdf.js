const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('file:///C:/Users/Olive/Desktop/claude-workspace/outputs/energetik/vip-workbook.html', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  const outPath = 'C:/Users/Olive/Desktop/VIP-Workbook Energetik.pdf';
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  const fs = require('fs');
  console.log(`PDF saved: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
})();
