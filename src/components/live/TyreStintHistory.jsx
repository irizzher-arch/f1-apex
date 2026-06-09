import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const getTyreColor = (compound) => {
  switch (compound?.toUpperCase()) {
    case 'SOFT': return '#E8002D';
    case 'MEDIUM': return '#FFD700';
    case 'HARD': return '#FFFFFF';
    case 'INTERMEDIATE': return '#00AA44';
    case 'WET': return '#0080FF';
    default: return '#555555';
  }
};

export const TyreStintHistory = () => {
  const drivers = useStore(state => state.liveTiming.drivers);
  const stints = useStore(state => state.liveTiming.stints);
  const positions = useStore(state => state.liveTiming.positions);
  const currentGlobalLap = useStore(state => state.liveTiming.currentLap) || 1;
  const totalLaps = useStore(state => state.liveTiming.totalLaps) || Math.max(currentGlobalLap, 50); // Default to 50 if unknown

  const sortedDrivers = useMemo(() => {
    return Object.values(drivers)
      .filter(d => positions[d.driver_number])
      .sort((a, b) => (positions[a.driver_number]?.position || 99) - (positions[b.driver_number]?.position || 99));
  }, [drivers, positions]);

  if (sortedDrivers.length === 0) return null;

  return (
    <div className="w-full bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs tracking-widest text-white/50">TYRE STINT HISTORY</h3>
        <span className="text-[10px] uppercase font-bold text-white/30 font-mono">LAP {currentGlobalLap}</span>
      </div>

      <div className="p-4 flex flex-col gap-[1px]">
        {sortedDrivers.map(driver => {
          const num = driver.driver_number;
          const driverStints = stints[num] || [];
          
          return (
            <div key={num} className="flex items-center group h-8 bg-white/[0.01] hover:bg-white/[0.03] rounded pr-2">
              <div className="w-12 shrink-0 font-mono font-bold text-xs pl-2" style={{ color: `#${driver.team_colour}` }}>
                {driver.name_acronym}
              </div>
              
              <div className="flex-1 h-4 bg-black/20 rounded-full overflow-hidden flex relative mx-2">
                {driverStints.map((stint, idx) => {
                  const isCurrent = idx === driverStints.length - 1;
                  const endLap = stint.lap_end || currentGlobalLap;
                  const startLap = stint.lap_start || 0;
                  const lapsInStint = Math.max(endLap - startLap, 0);
                  const widthPercent = (lapsInStint / totalLaps) * 100;
                  const age = (stint.tyre_age_at_start || 0) + lapsInStint;
                  
                  return (
                    <motion.div 
                      key={idx}
                      className="h-full border-r-2 border-[#050508] relative flex items-center justify-center overflow-hidden"
                      style={{ 
                        width: `${widthPercent}%`,
                        backgroundColor: getTyreColor(stint.compound),
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ duration: 1 }}
                    >
                      {widthPercent > 2 && (
                        <span className={`text-[8px] font-mono font-bold ${stint.compound === 'HARD' || stint.compound === 'MEDIUM' ? 'text-black' : 'text-white'}`}>
                          {age}
                        </span>
                      )}
                      {isCurrent && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-white/50 animate-pulse" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="w-16 shrink-0 flex justify-end">
                {driverStints.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-white/40">
                      {(driverStints[driverStints.length - 1].tyre_age_at_start || 0) + Math.max(currentGlobalLap - (driverStints[driverStints.length - 1].lap_start || 0), 0)} L
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full border-[1.5px] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)] bg-[#1A1A1A]" 
                         style={{ borderColor: getTyreColor(driverStints[driverStints.length - 1].compound) }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
