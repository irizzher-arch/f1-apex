export const mapRaceControlToLaps = (messages, laps) => {
  if (!messages || !laps || laps.length === 0) return [];
  
  const scVscEvents = messages.filter(m => 
    m.category === 'SafetyCar' || m.message?.includes('SAFETY CAR') || m.message?.includes('VSC') || m.category === 'RedFlag'
  );
  
  const ranges = [];
  let currentEvent = null;
  
  // Get all unique lap start times sorted to map timestamps to laps globally
  const allLapStarts = laps.map(l => ({ lap: l.lap_number, time: new Date(l.date_start) }))
    .sort((a,b) => a.time - b.time);
    
  const getLapByTime = (dateObj) => {
    for (let i = 0; i < allLapStarts.length; i++) {
      if (dateObj < allLapStarts[i].time) {
        return i > 0 ? allLapStarts[i-1].lap : 1;
      }
    }
    return allLapStarts[allLapStarts.length - 1]?.lap || 1;
  };

  scVscEvents.forEach(msg => {
    const msgTime = new Date(msg.date);
    const lapNum = getLapByTime(msgTime);
    
    if (msg.message?.includes('DEPLOYED') || msg.flag === 'YELLOW' || msg.category === 'RedFlag') {
      if (!currentEvent) {
        let type = 'SC';
        if (msg.message?.includes('VSC')) type = 'VSC';
        if (msg.category === 'RedFlag') type = 'RED';
        currentEvent = { type, startLap: lapNum, startTime: msgTime };
      }
    } else if (msg.message?.includes('IN THIS LAP') || msg.message?.includes('ENDING') || msg.flag === 'GREEN') {
      if (currentEvent) {
        currentEvent.endLap = lapNum;
        currentEvent.endTime = msgTime;
        ranges.push(currentEvent);
        currentEvent = null;
      }
    }
  });
  
  // Close any open event at the end of the race
  if (currentEvent) {
    currentEvent.endLap = getLapByTime(new Date()); // roughly up to current lap
    ranges.push(currentEvent);
  }
  
  return ranges;
};
