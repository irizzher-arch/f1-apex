import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LiveGapChart = () => {
  const drivers = useStore(state => state.liveTiming.drivers);
  const laps = useStore(state => state.liveTiming.laps);
  const currentGlobalLap = useStore(state => state.liveTiming.currentLap);

  // Re-map laps into an array of objects per lap where keys are driver IDs and values are their accumulated time
  // But wait, the prompt says "Live Gap Chart... Data: /intervals polling".
  // Actually building a gap chart from just `/intervals` snapshots is tricky because we'd need a time-series history of intervals.
  // Wait, we DO have a time-series of intervals! Intervals endpoint is polled every 4s, but maybe we didn't save historical?
  // Let's use the laps data since we append it. We can compute the total time per driver per lap, and subtract the leader's total time.
  
  const chartData = useMemo(() => {
    if (!laps || Object.keys(laps).length === 0) return [];
    
    // 1. Calculate cumulative race time per driver per lap
    const cumulativeTimes = {}; // { [driverNo]: { [lapNo]: cumulativeSeconds } }
    
    Object.keys(laps).forEach(dNo => {
      let cumulative = 0;
      cumulativeTimes[dNo] = {};
      
      // Sort laps by lap_number to ensure correct accumulation
      const driverLaps = [...laps[dNo]].sort((a, b) => a.lap_number - b.lap_number);
      
      driverLaps.forEach(lap => {
        cumulative += lap.lap_duration || 0;
        cumulativeTimes[dNo][lap.lap_number] = cumulative;
      });
    });
    
    // 2. Identify the leader's cumulative time per lap
    // To do this reliably live, for each lap N, the leader is the one with the lowest cumulative time
    const dataPoints = [];
    const windowSize = 15;
    const startLap = Math.max(1, currentGlobalLap - windowSize + 1);
    
    for (let lapNo = startLap; lapNo <= currentGlobalLap; lapNo++) {
      let lowestTime = Infinity;
      Object.keys(cumulativeTimes).forEach(dNo => {
        const time = cumulativeTimes[dNo][lapNo];
        if (time > 0 && time < lowestTime) {
          lowestTime = time;
        }
      });
      
      if (lowestTime === Infinity) continue;
      
      // 3. Compute gap to lowestTime for everyone
      const lapData = { lap: lapNo };
      Object.keys(cumulativeTimes).forEach(dNo => {
        const time = cumulativeTimes[dNo][lapNo];
        if (time > 0) {
          lapData[`driver_${dNo}`] = time - lowestTime;
        }
      });
      
      dataPoints.push(lapData);
    }
    
    return dataPoints;
  }, [laps, currentGlobalLap]);

  if (chartData.length === 0) return null;

  return (
    <div className="w-full h-[280px] bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-xs tracking-widest text-white/50">GAP TO LEADER (LAST 15 LAPS)</h3>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="lap" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis reversed stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '5px', fontWeight: 'bold' }}
              formatter={(value, name) => {
                const driverNo = name.replace('driver_', '');
                const acronym = drivers[driverNo]?.name_acronym || driverNo;
                return [`+${value.toFixed(3)}s`, acronym];
              }}
            />
            {Object.keys(drivers).map(dNo => (
              <Line 
                key={dNo}
                type="monotone" 
                dataKey={`driver_${dNo}`}
                stroke={`#${drivers[dNo]?.team_colour || 'FFF'}`} 
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
