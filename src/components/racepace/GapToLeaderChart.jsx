import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useIntervalData, useLapData, useDriverData, useRaceControlData } from '@/hooks/useRacePaceQueries';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { teamColors } from '@/utils/teamColors';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';

export const GapToLeaderChart = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers } = racePace;
  
  const { data: intervals } = useIntervalData(sessionKey, racePace.isLive);
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: drivers } = useDriverData(sessionKey);
  const { data: raceControl } = useRaceControlData(sessionKey);

  const chartData = useMemo(() => {
    if (!laps || !drivers) return null;
    
    // We calculate gap based on cumulative lap time differences to P1 if intervals API doesn't provide lap-by-lap history easily
    // Actually, OpenF1 /intervals gives gap_to_leader, but mapping to laps is tricky. 
    // It's safer to compute cumulative lap times and subtract leader cumulative.
    
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    
    const lapMap = {};
    const cumulativeTimes = {}; // { driver_number: total_duration }
    
    const maxLap = Math.max(...laps.map(l => l.lap_number));
    
    for (let i = 1; i <= maxLap; i++) {
      lapMap[i] = { lap: i };
      
      const lapsThisRound = laps.filter(l => l.lap_number === i && l.lap_duration > 0);
      
      lapsThisRound.forEach(l => {
        cumulativeTimes[l.driver_number] = (cumulativeTimes[l.driver_number] || 0) + l.lap_duration;
      });
      
      // Find leader at this lap
      let minCumulative = Infinity;
      Object.values(cumulativeTimes).forEach(val => {
        if (val < minCumulative) minCumulative = val;
      });
      
      selectedDrivers.forEach(driverNum => {
        if (cumulativeTimes[driverNum] !== undefined) {
          lapMap[i][driverNum] = cumulativeTimes[driverNum] - minCumulative;
        }
      });
    }
    
    return { data: Object.values(lapMap), scVscRanges };
  }, [laps, intervals, drivers, selectedDrivers, raceControl]);

  if (!chartData || chartData.data?.length === 0) return null;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4 mt-6">
      <h3 className="absolute top-4 left-6 text-xs font-heading font-bold tracking-widest uppercase text-white/50 z-10">Gap To Race Leader</h3>
      
      <div className="h-[320px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="lap" type="number" domain={['dataMin', 'dataMax']} stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <YAxis 
              domain={[0, 'auto']} 
              stroke="transparent" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
              tickFormatter={(val) => `+${val.toFixed(1)}s`} 
              width={60} 
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              formatter={(value) => `+${value.toFixed(3)}s`}
            />

            <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" />
            
            {/* SC/VSC Areas */}
            {chartData.scVscRanges.map((range, idx) => {
              const fill = range.type === 'SC' ? 'rgba(255,135,0,0.08)' : range.type === 'VSC' ? 'rgba(255,200,0,0.06)' : 'rgba(232,0,45,0.06)';
              return <ReferenceArea key={idx} x1={range.startLap} x2={range.endLap || chartData.data.length} fill={fill} strokeOpacity={0} />
            })}

            {selectedDrivers.map(driverNum => {
              const driver = drivers?.find(d => d.driver_number === driverNum);
              const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#ffffff');
              
              return (
                <Area 
                  key={driverNum}
                  type="monotone" 
                  dataKey={String(driverNum)} 
                  stroke={tColor} 
                  strokeWidth={1.5}
                  fill={tColor}
                  fillOpacity={0.08}
                  isAnimationActive={true}
                  name={driver?.name_acronym || String(driverNum)}
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
