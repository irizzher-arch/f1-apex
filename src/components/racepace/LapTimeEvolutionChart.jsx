import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useRaceControlData, useDriverData, useErgastResults, useStintData } from '@/hooks/useRacePaceQueries';
import { filterCleanLaps, computeRollingAvg } from '@/utils/lapTimeUtils';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { teamColors } from '@/utils/teamColors';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine, Scatter } from 'recharts';

const CustomTooltip = ({ active, payload, label, drivers }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // all drivers data at this lap
    return (
      <div className="bg-[#111118] border border-white/10 rounded-xl p-4 min-w-[200px] shadow-2xl backdrop-blur-md">
        <div className="font-heading font-bold text-white mb-2 pb-2 border-b border-white/10">LAP {label}</div>
        {payload.map((entry, index) => {
          if (!entry.value) return null;
          // Filter out rolling average lines from tooltip if needed, or format them differently
          if (entry.dataKey.includes('_rolling')) return null;
          
          const driverNum = entry.dataKey;
          const driver = drivers?.find(d => d.driver_number === parseInt(driverNum));
          const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#fff');
          
          const timeFormatted = `${Math.floor(entry.value / 60)}:${(entry.value % 60).toFixed(3).padStart(6, '0')}`;
          
          return (
            <div key={index} className="flex justify-between items-center gap-4 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tColor }}></span>
                <span className="font-mono font-bold text-xs" style={{ color: tColor }}>{driver?.name_acronym || driverNum}</span>
              </div>
              <span className="font-mono text-white text-sm">{timeFormatted}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const LapTimeEvolutionChart = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers, showOutlierLaps, rollingAvg, year, round } = racePace;
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: raceControl } = useRaceControlData(sessionKey);
  const { data: drivers } = useDriverData(sessionKey);
  const { data: results } = useErgastResults(year, round);
  const { data: stints } = useStintData(sessionKey);

  const chartData = useMemo(() => {
    if (!laps || !drivers) return null;
    
    // 1. SC/VSC Mapping
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    
    // 2. Filter Laps & Process
    const filteredLaps = filterCleanLaps(laps, scVscRanges, showOutlierLaps);
    
    // 3. Group by Lap Number to create Recharts format array
    // [{ lap: 1, '1': 92.5, '16': 93.1, '1_rolling': null ... }, { lap: 2, ... }]
    const lapMap = {};
    const maxLap = Math.max(...filteredLaps.map(l => l.lap_number));
    
    for (let i = 1; i <= maxLap; i++) {
      lapMap[i] = { lap: i };
    }
    
    selectedDrivers.forEach(driverNum => {
      const dLaps = filteredLaps.filter(l => l.driver_number === driverNum).sort((a,b) => a.lap_number - b.lap_number);
      const withRolling = computeRollingAvg(dLaps, 3);
      
      withRolling.forEach(l => {
        if (lapMap[l.lap_number]) {
          lapMap[l.lap_number][driverNum] = l.lap_duration;
          if (rollingAvg) {
            lapMap[l.lap_number][`${driverNum}_rolling`] = l.rollingTime;
          }
          if (l.is_pit_out_lap) {
             lapMap[l.lap_number][`${driverNum}_pitOut`] = l.lap_duration;
          }
        }
      });
    });
    
    return { data: Object.values(lapMap), scVscRanges };
  }, [laps, raceControl, drivers, selectedDrivers, showOutlierLaps, rollingAvg]);

  if (!chartData || chartData.data.length === 0) {
    return <div className="w-full h-[420px] flex items-center justify-center font-mono text-white/30 border border-white/5 rounded-xl bg-white/[0.02]">Awaiting Lap Data...</div>;
  }

  // Find fastest overall lap for reference line
  const fastestLapObj = results?.Results?.find(r => r.FastestLap?.rank === "1");
  const fastestLapTimeStr = fastestLapObj?.FastestLap?.Time?.time;
  let fastestLapSeconds = null;
  if (fastestLapTimeStr) {
    const [min, sec] = fastestLapTimeStr.split(':');
    fastestLapSeconds = parseInt(min) * 60 + parseFloat(sec);
  }

  return (
    <div className="w-full h-[420px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group">
      <h3 className="absolute top-4 left-6 text-xs font-heading font-bold tracking-widest uppercase text-white/50">Lap Time Evolution</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData.data} margin={{ top: 30, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          
          <XAxis 
            dataKey="lap" 
            type="number" 
            domain={['dataMin', 'dataMax']} 
            tickCount={10}
            stroke="rgba(255,255,255,0.1)" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            tickLine={false}
          />
          
          <YAxis 
            type="number"
            domain={['auto', 'auto']}
            stroke="rgba(255,255,255,0.0)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(val) => `${Math.floor(val/60)}:${(val%60).toFixed(1).padStart(4,'0')}`}
            width={60}
          />
          
          <Tooltip content={<CustomTooltip drivers={drivers} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          {/* SC/VSC Areas */}
          {chartData.scVscRanges.map((range, idx) => {
            const fill = range.type === 'SC' ? 'rgba(255,135,0,0.08)' : range.type === 'VSC' ? 'rgba(255,200,0,0.06)' : 'rgba(232,0,45,0.06)';
            return (
              <ReferenceArea key={idx} x1={range.startLap} x2={range.endLap || chartData.data.length} fill={fill} strokeOpacity={0} />
            )
          })}
          
          {/* Fastest Lap Reference Line */}
          {fastestLapSeconds && (
            <ReferenceLine y={fastestLapSeconds} stroke="#9B59B6" strokeDasharray="8 4" strokeOpacity={0.4}>
            </ReferenceLine>
          )}

          {/* Lines per driver */}
          {selectedDrivers.map(driverNum => {
            const driver = drivers?.find(d => d.driver_number === driverNum);
            const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#ffffff');
            
            return (
              <React.Fragment key={driverNum}>
                {/* Main Pace Line */}
                <Line 
                  type="monotone" 
                  dataKey={String(driverNum)} 
                  stroke={tColor} 
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 5, fill: tColor, stroke: '#fff', strokeWidth: 1, style: { filter: `drop-shadow(0 0 6px ${tColor})` } }}
                  connectNulls={false}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
                
                {/* Rolling Average Overlay */}
                {rollingAvg && (
                  <Line 
                    type="monotone" 
                    dataKey={`${driverNum}_rolling`} 
                    stroke={tColor} 
                    strokeWidth={1}
                    strokeDasharray="6 3"
                    strokeOpacity={0.6}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                )}
                
                {/* Pit Out Laps (Scatter points to show they exist but aren't filled) */}
                <Scatter 
                  dataKey={`${driverNum}_pitOut`} 
                  fill="transparent" 
                  stroke={tColor} 
                  strokeWidth={1.5}
                  shape="circle" 
                  isAnimationActive={false} 
                />
              </React.Fragment>
            )
          })}
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
