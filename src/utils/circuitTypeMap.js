export const circuitTypeMap = {
  // Street Circuits
  monaco: 'Street Circuit',
  baku: 'Street Circuit',
  marina_bay: 'Street Circuit',
  jeddah: 'Street Circuit',
  miami: 'Street Circuit',
  vegas: 'Street Circuit',
  albert_park: 'Street Circuit',

  // High Speed
  monza: 'High Speed',
  spa: 'High Speed',
  silverstone: 'High Speed',
  jeddah: 'High Speed', // often overlaps but classified based on nature
  red_bull_ring: 'High Speed',

  // Technical
  hungaroring: 'Technical',
  zandvoort: 'Technical',
  suzuka: 'Technical',
  catalunya: 'Technical',
  
  // Mixed
  bahrain: 'Mixed',
  shanghai: 'Mixed',
  imola: 'Mixed',
  villeneuve: 'Mixed',
  cota: 'Mixed',
  rodriguez: 'Mixed',
  interlagos: 'Mixed',
  yas_marina: 'Mixed',
  losail: 'Mixed'
};

export function getCircuitType(circuitId) {
  return circuitTypeMap[circuitId] || 'Mixed';
}
