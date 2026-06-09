import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statsFilePath = path.resolve(__dirname, '../../public/api/season-stats.json');

(async () => {
  console.log('Starting automated F1 stats scraper...');
  
  let chromePath = '';
  try {
    chromePath = chromeLauncher.Launcher.getInstallations()[0];
    if (!chromePath) throw new Error('Chrome not found');
  } catch (err) {
    console.error('Failed to find Chrome installation. Please ensure Chrome is installed.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    console.log('Navigating to dashboard...');
    await page.goto('https://app.formula1dashboard.com', { waitUntil: 'networkidle2', timeout: 60000 });

    // Give time for custom elements like <number-flow-react> to mount and render
    await new Promise(resolve => setTimeout(resolve, 3000));

    const html = await page.content();
    
    // Read current stats so we don't overwrite with nulls if scraping fails
    const currentStats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));

    let newCrashDamageSinceLast = 0;
    let newUsedElements = 0;
    let newUsedElementsPct = 0;
    let newTechUpgrades = 0;
    let newTechUpgradesPct = 0;

    // 1. Crash Damage
    const crashDamageMatch = html.match(/\$([0-9,]+)[\s\S]{0,200}since last race/);
    if (crashDamageMatch) {
      const val = parseInt(crashDamageMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(val)) newCrashDamageSinceLast = val;
    }

    // 2. Used Elements and Tech Upgrades
    // Find all matches of a number followed by a (+X.XX%) and 'since last race'
    const allStatsMatches = [...html.matchAll(/([0-9]+)[\s\S]{0,200}\(\+([0-9.]+)%\)[\s\S]{0,50}since last race/g)];
    if (allStatsMatches.length >= 1) {
      newUsedElements = parseInt(allStatsMatches[0][1], 10);
      newUsedElementsPct = parseFloat(allStatsMatches[0][2]);
    }
    if (allStatsMatches.length >= 2) {
      newTechUpgrades = parseInt(allStatsMatches[1][1], 10);
      newTechUpgradesPct = parseFloat(allStatsMatches[1][2]);
    }

    // Prepare updated stats payload
    // We update the 'since last race' and 'total' where it makes sense.
    
    if (newCrashDamageSinceLast > 0 && newCrashDamageSinceLast !== currentStats.crashDamage.sinceLastRace) {
      currentStats.crashDamage.sinceLastRace = newCrashDamageSinceLast;
      currentStats.crashDamage.total += newCrashDamageSinceLast; 
    }

    if (newUsedElements > 0 && newUsedElements !== currentStats.usedElements.sinceLastRace) {
      currentStats.usedElements.sinceLastRace = newUsedElements;
      currentStats.usedElements.total += newUsedElements;
      if (newUsedElementsPct > 0) currentStats.usedElements.percentageChange = newUsedElementsPct;
    }

    if (newTechUpgrades > 0 && newTechUpgrades !== currentStats.techUpgrades.sinceLastRace) {
      currentStats.techUpgrades.sinceLastRace = newTechUpgrades;
      currentStats.techUpgrades.total += newTechUpgrades;
      if (newTechUpgradesPct > 0) currentStats.techUpgrades.percentageChange = newTechUpgradesPct;
    }

    fs.writeFileSync(statsFilePath, JSON.stringify(currentStats, null, 2));
    console.log('Successfully updated season-stats.json!');
    console.log('Updated Stats:', JSON.stringify(currentStats, null, 2));

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await browser.close();
  }
})();
