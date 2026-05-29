import fs from 'fs';
import https from 'https';
import path from 'path';

// Function to fetch HTML from a URL
const fetchHTML = async (url) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  return await res.text();
};

// Maps for our assets
const driverImages = {};
const teamLogos = {};
const trackImages = {};

const runScraper = async () => {
  console.log('🏎️ Scraping official Formula 1 assets...');

  try {
    // 1. Scrape Drivers & Teams
    console.log('Fetching drivers page...');
    const driversHTML = await fetchHTML('https://www.formula1.com/en/drivers.html');
    
    // The URLs often look like:
    // https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01right.webp
    // Let's capture all media.formula1.com URLs
    const mediaUrls = driversHTML.match(/https:\/\/media\.formula1\.com\/image\/upload\/[^"'\s]+/g) || [];
    
    // Parse Driver Images
    mediaUrls.forEach(url => {
      // Find driver images (they end with 'right.webp' usually and have a driver ID in the path)
      if (url.includes('/common/f1/') && url.includes('right.webp') && !url.includes('carright')) {
        // Cloudinary puts fallback in the URL, make sure the actual file isn't JUST the fallback
        if (!url.endsWith('fallbackdriverright.webp')) {
          const parts = url.split('/');
          // Extract team and driver ID from the path segments
          // e.g., .../2026/redbullracing/maxver01/...
          const driverIdIdx = parts.findIndex(p => p === '2026' || p === '2025' || p === '2024') + 2;
          if (parts[driverIdIdx]) {
             let driverId = parts[driverIdIdx].replace(/[0-9]+/, ''); // e.g. maxver01 -> maxver
             driverImages[driverId] = url;
          }
        }
      }

      // Parse Team Logos (e.g. 2026redbullracinglogowhite.webp)
      if (url.includes('logowhite.webp') && url.includes('/common/f1/')) {
        const parts = url.split('/');
        const teamIdIdx = parts.findIndex(p => p === '2026' || p === '2025' || p === '2024') + 1;
        if (parts[teamIdIdx]) {
           teamLogos[parts[teamIdIdx]] = url;
        }
      }
    });

    // Map F1 CDN tracks to Ergast circuit IDs for compatibility
    const ergastTrackMap = {
      "bahrain": "Bahrain",
      "jeddah": "Saudi-arabia",
      "albert_park": "Australia",
      "suzuka": "Japan",
      "shanghai": "China",
      "miami": "Miami",
      "imola": "Emilia-romagna",
      "monaco": "Monaco",
      "villeneuve": "Canada",
      "catalunya": "Spain",
      "red_bull_ring": "Austria",
      "silverstone": "Great-britain",
      "hungaroring": "Hungary",
      "spa": "Belgium",
      "zandvoort": "Netherlands",
      "monza": "Italy",
      "baku": "Azerbaijan",
      "marina_bay": "Singapore",
      "americas": "Usa",
      "rodriguez": "Mexico",
      "interlagos": "Brazil",
      "vegas": "Las-vegas",
      "losail": "Qatar",
      "yas_marina": "Abu-dhabi"
    };
    
    Object.entries(ergastTrackMap).forEach(([ergastId, f1Name]) => {
      // Official F1 CDN pattern for track maps
      trackImages[ergastId] = `https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${f1Name}_Circuit.png.transform/8col/image.png`;
    });

    // We will augment with Ergast-compatible IDs since formula1.com uses slightly different ones
    const mappedDrivers = {
       "max_verstappen": driverImages["maxver"] || "",
       "perez": driverImages["serper"] || "",
       "leclerc": driverImages["chalec"] || "",
       "sainz": driverImages["carsai"] || "",
       "norris": driverImages["lannor"] || "",
       "piastri": driverImages["oscpia"] || "",
       "russell": driverImages["georus"] || "",
       "hamilton": driverImages["lewham"] || "",
       "alonso": driverImages["feralo"] || "",
       "stroll": driverImages["lanstr"] || "",
       "tsunoda": driverImages["yuktsu"] || "",
       "ricciardo": driverImages["danric"] || "",
       "lawson": driverImages["lialaw"] || "",
       "hulkenberg": driverImages["nichul"] || "",
       "kevin_magnussen": driverImages["kevmag"] || "",
       "albon": driverImages["alealb"] || "",
       "colapinto": driverImages["fracol"] || "",
       "bottas": driverImages["valbot"] || "",
       "zhou": driverImages["guazho"] || "",
       "ocon": driverImages["estoco"] || "",
       "gasly": driverImages["piegas"] || "",
       "bearman": driverImages["olibea"] || "",
       "antonelli": driverImages["andant"] || "",
       "hadjar": driverImages["isahad"] || "",
       "bortoleto": driverImages["gabbor"] || ""
    };

    const mappedTeams = {
       "red_bull": teamLogos["redbullracing"] || "",
       "ferrari": teamLogos["ferrari"] || "",
       "mclaren": teamLogos["mclaren"] || "",
       "mercedes": teamLogos["mercedes"] || "",
       "aston_martin": teamLogos["astonmartin"] || "",
       "rb": teamLogos["racingbulls"] || teamLogos["rb"] || "",
       "haas": teamLogos["haasf1team"] || "",
       "williams": teamLogos["williams"] || "",
       "sauber": teamLogos["sauber"] || teamLogos["kicksauber"] || "",
       "alpine": teamLogos["alpine"] || "",
       "audi": teamLogos["audi"] || "",
       "cadillac": teamLogos["cadillac"] || ""
    };

    // Output to assets.js
    let outContent = `// AUTO-GENERATED ASSETS FILE\n// Scraped from formula1.com\n\n`;
    outContent += `export const DRIVER_IMAGES = ${JSON.stringify(mappedDrivers, null, 2)};\n\n`;
    outContent += `export const TEAM_LOGOS = ${JSON.stringify(mappedTeams, null, 2)};\n\n`;
    outContent += `export const TRACK_IMAGES = ${JSON.stringify(trackImages, null, 2)};\n`;

    fs.writeFileSync(path.resolve('./src/utils/assets.js'), outContent);
    console.log('✅ Successfully scraped and generated src/utils/assets.js!');
    console.log(`Extracted: ${Object.values(mappedDrivers).filter(Boolean).length} Drivers, ${Object.values(mappedTeams).filter(Boolean).length} Teams, ${Object.keys(trackImages).length} Tracks`);
    
  } catch (err) {
    console.error('Error during scraping:', err);
  }
};

runScraper();
