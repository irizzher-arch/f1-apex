export const formatLapTime = (durationSeconds) => {
  if (!durationSeconds) return '';
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = (durationSeconds % 60).toFixed(3);
  return `${minutes}:${seconds.padStart(6, '0')}`;
};

export const computeRollingAvg = (laps, windowSize = 3) => {
  return laps.map((lap, index, arr) => {
    if (index < windowSize - 1) return { ...lap, rollingTime: null };
    const windowLaps = arr.slice(index - windowSize + 1, index + 1);
    const validLaps = windowLaps.filter(l => l.lap_duration != null);
    if (validLaps.length < windowSize) return { ...lap, rollingTime: null };
    
    const sum = validLaps.reduce((acc, curr) => acc + curr.lap_duration, 0);
    return { ...lap, rollingTime: sum / windowSize };
  });
};

export const filterCleanLaps = (laps, scVscRanges, showOutliers) => {
  if (!Array.isArray(laps)) return [];
  if (showOutliers) return laps; // Return all if showing outliers
  
  return laps.filter(lap => {
    if (lap.is_pit_out_lap) return false;
    
    // Check if lap falls in SC/VSC window
    const inCautionZone = scVscRanges?.some(range => 
      lap.lap_number >= range.startLap && lap.lap_number <= range.endLap
    ) || false;
    
    return !inCautionZone;
  });
};
