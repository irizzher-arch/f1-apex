import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';

(async () => {
  const chromePath = chromeLauncher.Launcher.getInstallations()[0];
  if (!chromePath) {
    console.error('No Chrome installation found.');
    return;
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
  });

  const page = await browser.newPage();
  await page.goto('https://app.formula1dashboard.com', { waitUntil: 'networkidle2' });

  // Wait for the stats to load, they might be custom elements like <number-flow-react>
  await page.waitForSelector('number-flow-react', { timeout: 10000 }).catch(() => {});

  const html = await page.content();
  console.log(html.substring(0, 1000));
  
  // Try to find the specific stats blocks
  const numberFlows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('number-flow-react')).map(el => {
      let text = el.value || el.getAttribute('value');
      if (!text && el.shadowRoot) text = el.shadowRoot.textContent;
      return text || el.innerText || el.textContent;
    });
  });
  console.log('Number Flows:', numberFlows);

  await browser.close();
})();
