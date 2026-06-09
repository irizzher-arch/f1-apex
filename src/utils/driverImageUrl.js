import { DRIVER_IMAGES } from './assets';

export const getDriverImageUrl = (year, familyName) => {
  if (!familyName) return null;
  
  const lower = familyName.toLowerCase();
  
  // Handle some common Ergast family names
  let searchName = lower;
  if (lower === 'zhou') searchName = 'guanyu';
  if (lower === 'pérez') searchName = 'perez';
  if (lower === 'hülkenberg') searchName = 'hulkenberg';

  // Find matching driver in DRIVER_IMAGES
  const matchedKey = Object.keys(DRIVER_IMAGES).find(key => key.includes(searchName));
  if (!matchedKey || !DRIVER_IMAGES[matchedKey]) return null;

  const url = DRIVER_IMAGES[matchedKey];
  
  // Transform the 2026 F1 media URL to 2024 to get the actual populated portrait
  // because the F1 Dashboard CDN is returning 403 Forbidden
  return url
    .replace(/d_common:f1:2026:fallback:driver:2026fallbackdriverright\.webp\//g, '')
    .replace(/2026/g, '2024');
};
