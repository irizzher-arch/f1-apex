export const mapPositionsToLaps = (positions, laps) => {
  if (!positions || !laps) return [];
  
  // Group laps by driver to build a time-to-lap index
  const driverLaps = {};
  laps.forEach(lap => {
    if (!driverLaps[lap.driver_number]) {
      driverLaps[lap.driver_number] = [];
    }
    driverLaps[lap.driver_number].push(lap);
  });
  
  // Sort laps by date_start to ensure sequential matching
  Object.keys(driverLaps).forEach(driver => {
    driverLaps[driver].sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
  });

  return positions.map(pos => {
    const dLaps = driverLaps[pos.driver_number];
    if (!dLaps) return { ...pos, lap_number: null };
    
    const posDate = new Date(pos.date);
    let matchedLap = null;
    
    // Find the lap that this position update belongs to
    // Typically the position update timestamp should fall within the lap duration
    for (let i = 0; i < dLaps.length; i++) {
      const currentLapStart = new Date(dLaps[i].date_start);
      const nextLapStart = i < dLaps.length - 1 ? new Date(dLaps[i+1].date_start) : new Date(currentLapStart.getTime() + dLaps[i].lap_duration * 1000);
      
      if (posDate >= currentLapStart && posDate <= nextLapStart) {
        matchedLap = dLaps[i].lap_number;
        break;
      }
    }
    
    return { ...pos, lap_number: matchedLap };
  }).filter(p => p.lap_number !== null); // Keep only successfully mapped positions
};
