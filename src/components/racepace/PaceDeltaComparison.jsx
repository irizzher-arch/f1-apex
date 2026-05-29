import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useDriverData, useRaceControlData } from '@/hooks/useRacePaceQueries';
import { filterCleanLaps } from '@/utils/lapTimeUtils';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { teamColors } from '@/utils/teamColors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export const PaceDeltaComparison = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers } = racePace;
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: drivers } = useDriverData(sessionKey);
  const { data: raceControl } = useRaceControlData(sessionKey);

  const chartData = useMemo(() => {
    // Only compare if exactly 2 drivers are selected
    if (!laps || !drivers || selectedDrivers.length !== 2) return null;
    
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    const cleanLaps = filterCleanLaps(laps, scVscRanges, false);
    
    const [d1, d2] = selectedDrivers;
    const driver1 = drivers.find(d => d.driver_number === d1);
    const driver2 = drivers.find(d => d.driver_number === d2);
    
    const d1Color = driver1?.team_colour ? `#${driver1.team_colour}` : (teamColors[driver1?.team_name?.replace(/\s/g, '').toLowerCase()] || '#fff');
    const d2Color = driver2?.team_colour ? `#${driver2.team_colour}` : (teamColors[driver2?.team_name?.replace(/\s/g, '').toLowerCase()] || '#aaa');
    
    const maxLap = Math.max(...cleanLaps.map(l => l.lap_number));
    
    const data = [];
    let avgDelta = 0;
    let count = 0;
    
    for (let i = 1; i <= maxLap; i++) {
      const l1 = cleanLaps.find(l => l.driver_number === d1 && l.lap_number === i);
      const l2 = cleanLaps.find(l => l.driver_number === d2 && l.lap_number === i);
      
      if (l1 && l2 && l1.lap_duration > 0 && l2.lap_duration > 0) {
        // Delta = D1 - D2. If negative, D1 is faster. If positive, D2 is faster.
        const delta = l1.lap_duration - l2.lap_duration;
        // Cap extreme outliers
        if (Math.abs(delta) < 5) {
          data.push({ lap: i, delta });
          avgDelta += delta;
          count++;
        }
      }
    }
    
    return { 
      data, 
      d1Info: { ...driver1, color: d1Color }, 
      d2Info: { ...driver2, color: d2Color },
      avgDelta: count > 0 ? (avgDelta / count) : 0
    };
  }, [laps, drivers, raceControl, selectedDrivers]);

  if (!chartData) {
    if (selectedDrivers.length !== 2) {
      return (
        <div className="w-full h-[200px] bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-center mt-6">
          <span className="font-mono text-xs text-white/30 uppercase tracking-widest">Select exactly 2 drivers for H2H Delta Comparison</span>
        </div>
      );
    }
    return null;
  }

  const { d1Info, d2Info, avgDelta, data } = chartData;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4 mt-6">
      <div className="flex justify-between items-center z-10 relative">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">H2H Pace Delta</h3>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d1Info.color }}></span>
            <span className="font-mono text-[10px] font-bold text-white">{d1Info.name_acronym} Faster (Below)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d2Info.color }}></span>
            <span className="font-mono text-[10px] font-bold text-white">{d2Info.name_acronym} Faster (Above)</span>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded border border-white/10 ml-4">
            <span className="font-mono text-[10px] font-bold text-white">
              AVG DIFF: <span style={{ color: avgDelta < 0 ? d1Info.color : d2Info.color }}>
                {Math.abs(avgDelta).toFixed(3)}s
              </span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="lap" type="number" domain={['dataMin', 'dataMax']} stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="transparent" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
              tickFormatter={(val) => `${val > 0 ? '+' : ''}${val.toFixed(1)}s`} 
              width={50} 
            />
            
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              formatter={(value) => {
                const faster = value < 0 ? d1Info : d2Info;
                return [ `<span style="color:${faster.color}">${faster.name_acronym} faster by ${Math.abs(value).toFixed(3)}s</span>` ];
              }}
            />

            <ReferenceLine y={0} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
            
            <Bar dataKey="delta" isAnimationActive={true}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.delta < 0 ? d1Info.color : d2Info.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
