export const getCountryFlagSlug = (countryName) => {
  const map = {
    'Bahrain': 'bahrain',
    'Saudi Arabia': 'saudi-arabia',
    'Australia': 'australia',
    'Japan': 'japan',
    'China': 'china',
    'USA': 'usa',
    'Italy': 'italy',
    'Monaco': 'monaco',
    'Canada': 'canada',
    'Spain': 'spain',
    'Austria': 'austria',
    'UK': 'great-britain',
    'Hungary': 'hungary',
    'Belgium': 'belgium',
    'Netherlands': 'netherlands',
    'Azerbaijan': 'azerbaijan',
    'Singapore': 'singapore',
    'Mexico': 'mexico',
    'Brazil': 'brazil',
    'Qatar': 'qatar',
    'UAE': 'abu-dhabi'
  };
  return map[countryName] || countryName.toLowerCase().replace(/\s+/g, '-');
};
