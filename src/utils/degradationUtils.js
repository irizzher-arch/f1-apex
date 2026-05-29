// Calculate linear regression (y = mx + b)
export const calculateLinearRegression = (data) => {
  if (!data || data.length < 2) return null;
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = data.length;
  
  data.forEach(point => {
    sumX += point.x;
    sumY += point.y;
    sumXY += (point.x * point.y);
    sumX2 += (point.x * point.x);
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
};

export const processDegradationData = (laps, stints) => {
  if (!laps || !stints) return [];
  
  return laps.map(lap => {
    // Find matching stint
    const stint = stints.find(s => 
      s.driver_number === lap.driver_number && 
      lap.lap_number >= s.lap_start && 
      lap.lap_number <= s.lap_end
    );
    
    if (!stint) return null;
    
    const tyreAge = (lap.lap_number - stint.lap_start) + (stint.tyre_age_at_start || 0);
    
    return {
      ...lap,
      compound: stint.compound,
      tyreAge,
      stintNumber: stint.stint_number
    };
  }).filter(Boolean);
};
