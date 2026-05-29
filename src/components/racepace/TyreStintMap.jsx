import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useStintData, useLapData, useDriverData } from '@/hooks/useRacePaceQueries';
import { teamColors } from '@/utils/teamColors';

const COMPOUND_COLORS = {
  SOFT: '#E8002D',
  MEDIUM: '#FFD700',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#00AA44',
  WET: '#0080FF',
  UNKNOWN: '#555555'
};

export const TyreStintMap = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers } = racePace;
  
  const { data: stints } = useStintData(sessionKey);
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: drivers } = useDriverData(sessionKey);

  const { totalLaps, mappedStints } = useMemo(() => {
    if (!stints || !laps || !drivers) return { totalLaps: 0, mappedStints: [] };
    
    const maxLap = Math.max(...laps.map(l => l.lap_number));
    
    const dStints = selectedDrivers.map(driverNum => {
      const driverStints = stints.filter(s => s.driver_number === driverNum).sort((a,b) => a.lap_start - b.lap_start);
      return { driverNum, stints: driverStints };
    });
    
    return { totalLaps: maxLap, mappedStints: dStints };
  }, [stints, laps, drivers, selectedDrivers]);

  if (!mappedStints || mappedStints.length === 0) return null;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group overflow-hidden">
      <h3 className="absolute top-4 left-6 text-xs font-heading font-bold tracking-widest uppercase text-white/50">Stint Strategy</h3>
      
      <div className="mt-8 flex flex-col gap-2 relative">
        
        {/* X-Axis Laps Scale */}
        <div className="flex ml-[60px] h-4 relative border-b border-white/10 mb-2">
           {[...Array(Math.floor(totalLaps / 5) + 1)].map((_, i) => (
             <div key={i} className="absolute font-mono text-[9px] text-white/30 transform -translate-x-1/2" style={{ left: `${(i*5 / totalLaps) * 100}%` }}>
               {i * 5}
             </div>
           ))}
        </div>

        {mappedStints.map(({ driverNum, stints }) => {
          const driver = drivers?.find(d => d.driver_number === driverNum);
          
          return (
            <div key={driverNum} className="flex items-center gap-4 h-6 w-full relative">
              <div className="w-[44px] font-mono font-bold text-xs text-white uppercase text-right shrink-0">
                {driver?.name_acronym || driverNum}
              </div>
              
              <div className="flex-1 h-full bg-white/5 rounded-sm relative overflow-hidden flex">
                {stints.map((s, idx) => {
                  const sLaps = s.lap_end - s.lap_start;
                  const widthPct = (sLaps / totalLaps) * 100;
                  const cColor = COMPOUND_COLORS[s.compound] || COMPOUND_COLORS.UNKNOWN;
                  
                  return (
                    <div 
                      key={idx} 
                      className="h-full relative group/stint border-r border-black/80 flex items-center justify-center overflow-hidden transition-opacity hover:opacity-80"
                      style={{ width: `${widthPct}%`, backgroundColor: cColor }}
                    >
                      <span className={`font-mono text-[8px] font-black ${s.compound === 'HARD' || s.compound === 'MEDIUM' ? 'text-black' : 'text-white'}`}>
                        {sLaps > 2 ? `${sLaps}L` : ''}
                      </span>
                      
                      {/* Stint Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover/stint:block z-20 bg-black border border-white/20 p-2 rounded text-[9px] font-mono text-white whitespace-nowrap shadow-xl">
                        {s.compound} — {sLaps} LAPS<br/>
                        (Lap {s.lap_start} to {s.lap_end})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
