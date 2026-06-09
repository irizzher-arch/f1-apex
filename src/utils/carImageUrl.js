import { TEAM_CARS } from './assets';

export const getCarImageUrl = (year, constructorId) => {
  if (!constructorId) return null;
  
  // Normalize constructorId mapping for our assets
  const map = {
    'kick_sauber': 'sauber',
    'kicksauber': 'sauber',
    'racing_bulls': 'rb'
  };
  
  const normalizedId = map[constructorId] || constructorId;
  const url = TEAM_CARS[normalizedId];
  
  if (!url) return null;
  
  // Transform the 2026 F1 media URL to 2024 to get the actual beautiful car renders
  // because the F1 Dashboard CDN is returning 403 Forbidden
  return url
    .replace(/d_common:f1:2026:fallback:car:2026fallbackcarright\.webp\//g, '')
    .replace(/2026/g, '2024');
};
