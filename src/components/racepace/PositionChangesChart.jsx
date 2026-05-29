import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { usePositionData, useLapData, useRaceControlData, useDriverData } from '@/hooks/useRacePaceQueries';
import { mapPositionsToLaps } from '@/utils/positionMapper';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { teamColors } from '@/utils/teamColors';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';

const PositionTooltip = ({ active, payload, label, drivers }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111118] border border-white/10 rounded-xl p-4 min-w-[150px] shadow-2xl backdrop-blur-md">
        <div className="font-heading font-bold text-white mb-2 pb-2 border-b border-white/10">LAP {label}</div>
        {payload.sort((a,b) => a.value - b.value).map((entry, index) => {
          if (!entry.value) return null;
          const driverNum = entry.dataKey;
          const driver = drivers?.find(d => d.driver_number === parseInt(driverNum));
          const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#fff');
          
          return (
            <div key={index} className="flex justify-between items-center gap-6 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tColor }}></span>
                <span className="font-mono font-bold text-xs text-white">{driver?.name_acronym || driverNum}</span>
              </div>
              <span className="font-mono font-bold text-sm" style={{ color: tColor }}>P{entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const PositionChangesChart = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers } = racePace;
  
  const { data: positions } = usePositionData(sessionKey, racePace.isLive);
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: raceControl } = useRaceControlData(sessionKey);
  const { data: drivers } = useDriverData(sessionKey);

  const chartData = useMemo(() => {
    if (!positions || !laps || !drivers) return null;
    
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    const mappedPositions = mapPositionsToLaps(positions, laps);
    
    const lapMap = {};
    const maxLap = Math.max(...laps.map(l => l.lap_number));
    
    for (let i = 1; i <= maxLap; i++) {
      lapMap[i] = { lap: i };
    }
    
    selectedDrivers.forEach(driverNum => {
      const dPos = mappedPositions.filter(p => p.driver_number === driverNum);
      
      dPos.forEach(p => {
        if (lapMap[p.lap_number]) {
          lapMap[p.lap_number][driverNum] = p.position;
        }
      });
      
      // Fill forward for missing laps in position data
      let lastPos = null;
      for (let i = 1; i <= maxLap; i++) {
        if (lapMap[i][driverNum]) {
          lastPos = lapMap[i][driverNum];
        } else if (lastPos) {
          lapMap[i][driverNum] = lastPos;
        }
      }
    });
    
    return { data: Object.values(lapMap), scVscRanges };
  }, [positions, laps, raceControl, drivers, selectedDrivers]);

  if (!chartData || chartData.data.length === 0) {
    return <div className="w-full h-[340px] flex items-center justify-center font-mono text-white/30 border border-white/5 rounded-xl bg-white/[0.02]">Awaiting Position Data...</div>;
  }

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4">
      <h3 className="absolute top-4 left-6 text-xs font-heading font-bold tracking-widest uppercase text-white/50 z-10">Race Position By Lap</h3>
      
      <div className="h-[340px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            
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
              reversed={true}
              type="number"
              domain={[1, 20]}
              tickCount={20}
              stroke="rgba(255,255,255,0.0)"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(val) => `P${val}`}
              width={40}
            />
            
            <ReferenceLine y={1} stroke="rgba(255,215,0,0.12)" strokeWidth={2} />
            <ReferenceLine y={3} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
            <ReferenceLine y={10} stroke="rgba(0,210,190,0.08)" strokeWidth={1} />
            
            <Tooltip content={<PositionTooltip drivers={drivers} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            
            {/* SC/VSC Areas */}
            {chartData.scVscRanges.map((range, idx) => {
              const fill = range.type === 'SC' ? 'rgba(255,135,0,0.08)' : range.type === 'VSC' ? 'rgba(255,200,0,0.06)' : 'rgba(232,0,45,0.06)';
              return <ReferenceArea key={idx} x1={range.startLap} x2={range.endLap || chartData.data.length} fill={fill} strokeOpacity={0} />
            })}

            {/* Driver Lines */}
            {selectedDrivers.map(driverNum => {
              const driver = drivers?.find(d => d.driver_number === driverNum);
              const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#ffffff');
              
              return (
                <Line 
                  key={driverNum}
                  type="stepAfter" 
                  dataKey={String(driverNum)} 
                  stroke={tColor} 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: tColor, stroke: '#fff', strokeWidth: 1 }}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
