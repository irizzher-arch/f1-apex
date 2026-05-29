import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--window-size=1920,1080'] });
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  console.log('Navigating...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log('Screenshot saved to screenshot.png');
  
  await browser.close();
  await chrome.kill();
})();
