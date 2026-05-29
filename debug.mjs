import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log("Navigation timeout or error"));
  
  await browser.close();
  await chrome.kill();
})();
