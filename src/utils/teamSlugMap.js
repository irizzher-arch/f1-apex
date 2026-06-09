export const getTeamLogoSlug = (constructorId) => {
  const map = {
    'red_bull': 'red-bull-racing',
    'ferrari': 'ferrari',
    'mclaren': 'mclaren',
    'mercedes': 'mercedes',
    'aston_martin': 'aston-martin',
    'rb': 'racing-bulls',
    'haas': 'haas',
    'williams': 'williams',
    'sauber': 'kick-sauber',
    'alpine': 'alpine',
    'audi': 'audi',
    'cadillac': 'cadillac'
  };
  return map[constructorId] || constructorId;
};
