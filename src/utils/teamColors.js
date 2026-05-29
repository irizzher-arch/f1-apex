export const teamColors = {
  mercedes: '#00D2BE',
  redbull: '#3671C6',
  red_bull_racing: '#3671C6',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  astonmartin: '#358C75',
  aston_martin: '#358C75',
  alpine: '#FF87BC',
  williams: '#64C4FF',
  rb: '#6692FF',
  haas: '#B6BABD',
  haas_f1_team: '#B6BABD',
  sauber: '#52E252',
  kick_sauber: '#52E252',
};

export const getTeamColor = (teamName) => {
  if (!teamName) return '#FFFFFF';
  const normalizedId = teamName.toLowerCase().replace(/[^a-z]/g, '');
  
  for (const [key, color] of Object.entries(teamColors)) {
    if (normalizedId.includes(key.replace(/_/g, ''))) return color;
  }
  return '#FFFFFF';
};
