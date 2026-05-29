import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useRaceControlData, useDriverData, usePositionData } from '@/hooks/useRacePaceQueries';
import { filterCleanLaps } from '@/utils/lapTimeUtils';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { mapPositionsToLaps } from '@/utils/positionMapper';
import { teamColors } from '@/utils/teamColors';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const PaceEvolutionChart = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers, showOutlierLaps } = racePace;
  
  const [tab, setTab] = useState('ABSOLUTE'); // ABSOLUTE or RELATIVE
  const [showTrackEvo, setShowTrackEvo] = useState(false);
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: raceControl } = useRaceControlData(sessionKey);
  const { data: drivers } = useDriverData(sessionKey);
  const { data: positions } = usePositionData(sessionKey, racePace.isLive);

  const chartData = useMemo(() => {
    if (!laps || !drivers) return [];
    
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    const filteredLaps = filterCleanLaps(laps, scVscRanges, showOutlierLaps);
    const mappedPositions = positions ? mapPositionsToLaps(positions, laps) : [];
    
    const lapMap = {};
    const maxLap = Math.max(...filteredLaps.map(l => l.lap_number));
    
    // For RELATIVE calculation
    const leaderPaceMap = {};
    if (tab === 'RELATIVE') {
      for (let i = 1; i <= maxLap; i++) {
        const lapPos = mappedPositions.filter(p => p.lap_number === i);
        const leader = lapPos.find(p => p.position === 1);
        if (leader) {
          const leaderLap = filteredLaps.find(l => l.lap_number === i && l.driver_number === leader.driver_number);
          if (leaderLap) leaderPaceMap[i] = leaderLap.lap_duration;
        }
      }
    }
    
    // For Track Evolution
    let currentBest = Infinity;

    for (let i = 1; i <= maxLap; i++) {
      lapMap[i] = { lap: i };
      
      const allLapsThisNum = filteredLaps.filter(l => l.lap_number === i);
      const minThisLap = Math.min(...allLapsThisNum.map(l => l.lap_duration).filter(v => v > 0));
      if (minThisLap < currentBest) currentBest = minThisLap;
      
      if (showTrackEvo && currentBest !== Infinity) {
        lapMap[i].trackEvo = tab === 'RELATIVE' ? (leaderPaceMap[i] ? currentBest - leaderPaceMap[i] : 0) : currentBest;
      }
    }
    
    selectedDrivers.forEach(driverNum => {
      const dLaps = filteredLaps.filter(l => l.driver_number === driverNum);
      
      dLaps.forEach(l => {
        if (lapMap[l.lap_number]) {
          if (tab === 'ABSOLUTE') {
             lapMap[l.lap_number][driverNum] = l.lap_duration;
          } else {
             const leaderTime = leaderPaceMap[l.lap_number];
             if (leaderTime) {
               lapMap[l.lap_number][driverNum] = l.lap_duration - leaderTime;
             }
          }
        }
      });
    });
    
    return Object.values(lapMap);
  }, [laps, raceControl, positions, drivers, selectedDrivers, showOutlierLaps, tab, showTrackEvo]);

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4">
      <div className="flex justify-between items-center z-10 relative">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">Pace Evolution</h3>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-md p-1 border border-white/10">
            <button 
              onClick={() => setTab('ABSOLUTE')} 
              className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-colors ${tab === 'ABSOLUTE' ? 'bg-f1-red text-white' : 'text-white/50 hover:text-white'}`}
            >
              ABSOLUTE PACE
            </button>
            <button 
              onClick={() => setTab('RELATIVE')} 
              className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-colors ${tab === 'RELATIVE' ? 'bg-f1-red text-white' : 'text-white/50 hover:text-white'}`}
            >
              RELATIVE TO LEADER
            </button>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={showTrackEvo} onChange={(e) => setShowTrackEvo(e.target.checked)} />
              <div className={`block w-8 h-4 rounded-full transition-colors ${showTrackEvo ? 'bg-f1-red' : 'bg-white/10'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${showTrackEvo ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="text-[10px] font-mono font-bold text-text-secondary group-hover:text-white transition-colors uppercase">Track Evo</span>
          </label>
        </div>
      </div>
      
      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="lap" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <YAxis 
              domain={tab === 'RELATIVE' ? ['auto', 'auto'] : ['auto', 'auto']}
              stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(val) => tab === 'RELATIVE' ? `+${val.toFixed(1)}s` : `${Math.floor(val/60)}:${(val%60).toFixed(1).padStart(4,'0')}`}
              width={60}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              formatter={(val) => tab === 'RELATIVE' ? `+${val.toFixed(3)}s` : `${Math.floor(val/60)}:${(val%60).toFixed(3).padStart(6,'0')}`}
            />
            
            {tab === 'RELATIVE' && <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" />}
            
            {showTrackEvo && (
              <Line type="monotone" dataKey="trackEvo" stroke="#fff" strokeWidth={1} strokeDasharray="10 5" strokeOpacity={0.25} dot={false} activeDot={false} name="Track Evolution" />
            )}

            {selectedDrivers.map(driverNum => {
              const driver = drivers?.find(d => d.driver_number === driverNum);
              const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#ffffff');
              
              return (
                <Line 
                  key={driverNum}
                  type="monotone" 
                  dataKey={String(driverNum)} 
                  stroke={tColor} 
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, fill: tColor, stroke: '#fff', strokeWidth: 1 }}
                  connectNulls={false}
                  name={driver?.name_acronym || String(driverNum)}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
