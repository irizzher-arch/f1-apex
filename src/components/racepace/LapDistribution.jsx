import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useDriverData, useRaceControlData } from '@/hooks/useRacePaceQueries';
import { filterCleanLaps } from '@/utils/lapTimeUtils';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { teamColors } from '@/utils/teamColors';

export const LapDistribution = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers } = racePace;
  
  const [mode, setMode] = useState('BOX'); // BOX or HISTOGRAM
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: raceControl } = useRaceControlData(sessionKey);
  const { data: drivers } = useDriverData(sessionKey);

  const stats = useMemo(() => {
    if (!laps || !drivers) return [];
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    const cleanLaps = filterCleanLaps(laps, scVscRanges, false);
    
    return selectedDrivers.map(driverNum => {
      const dLaps = cleanLaps.filter(l => l.driver_number === driverNum && l.lap_duration > 0).map(l => l.lap_duration).sort((a,b) => a - b);
      if (dLaps.length === 0) return null;
      
      const min = dLaps[0];
      const max = dLaps[dLaps.length - 1];
      const q1 = dLaps[Math.floor(dLaps.length * 0.25)];
      const median = dLaps[Math.floor(dLaps.length * 0.5)];
      const q3 = dLaps[Math.floor(dLaps.length * 0.75)];
      const iqr = q3 - q1;
      
      const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
      const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
      
      const outliers = dLaps.filter(l => l < lowerWhisker || l > upperWhisker);
      
      const driver = drivers.find(d => d.driver_number === driverNum);
      const tColor = driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#fff');
      
      return { driverNum, driver, tColor, min, max, q1, median, q3, iqr, lowerWhisker, upperWhisker, outliers };
    }).filter(Boolean).sort((a, b) => a.median - b.median);
  }, [laps, raceControl, drivers, selectedDrivers]);

  if (!stats || stats.length === 0) return null;

  // Render a manual SVG box plot
  const globalMin = Math.min(...stats.map(s => s.min));
  const globalMax = Math.max(...stats.map(s => s.max));
  const scaleFn = (val) => ((val - globalMin) / (globalMax - globalMin)) * 100;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4 mt-6">
      <div className="flex justify-between items-center z-10 relative border-b border-white/10 pb-4">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">Lap Time Distribution (Clean Laps)</h3>
        
        <div className="flex bg-white/5 rounded-md p-1 border border-white/10">
          <button 
            onClick={() => setMode('BOX')} 
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-colors ${mode === 'BOX' ? 'bg-f1-red text-white' : 'text-white/50 hover:text-white'}`}
          >
            BOX PLOT
          </button>
          <button 
            onClick={() => setMode('HISTOGRAM')} 
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-colors ${mode === 'HISTOGRAM' ? 'bg-f1-red text-white' : 'text-white/50 hover:text-white'}`}
          >
            HISTOGRAM
          </button>
        </div>
      </div>
      
      {mode === 'BOX' && (
        <div className="flex flex-col gap-6 py-4">
          {stats.map(stat => (
            <div key={stat.driverNum} className="flex items-center gap-6 group/box relative">
              <span className="w-8 shrink-0 font-mono text-xs font-bold text-right" style={{ color: stat.tColor }}>
                {stat.driver?.name_acronym || stat.driverNum}
              </span>
              
              <div className="flex-1 h-10 relative border-l border-r border-white/10">
                {/* Background Grid Line */}
                <div className="absolute top-1/2 w-full h-[1px] bg-white/5 -translate-y-1/2"></div>
                
                {/* Whiskers */}
                <div className="absolute top-1/2 h-[1px] -translate-y-1/2" style={{ left: `${scaleFn(stat.lowerWhisker)}%`, right: `${100 - scaleFn(stat.upperWhisker)}%`, backgroundColor: stat.tColor, opacity: 0.5 }}></div>
                
                {/* Whisker Ends */}
                <div className="absolute top-1/2 h-4 w-[1px] -translate-y-1/2" style={{ left: `${scaleFn(stat.lowerWhisker)}%`, backgroundColor: stat.tColor }}></div>
                <div className="absolute top-1/2 h-4 w-[1px] -translate-y-1/2" style={{ left: `${scaleFn(stat.upperWhisker)}%`, backgroundColor: stat.tColor }}></div>
                
                {/* Main Box */}
                <div className="absolute top-[10%] h-[80%] rounded-sm" style={{ left: `${scaleFn(stat.q1)}%`, width: `${scaleFn(stat.q3) - scaleFn(stat.q1)}%`, backgroundColor: stat.tColor, opacity: 0.8 }}></div>
                
                {/* Median Line */}
                <div className="absolute top-[5%] h-[90%] w-0.5 bg-white z-10 shadow-[0_0_4px_rgba(0,0,0,0.5)]" style={{ left: `${scaleFn(stat.median)}%` }}></div>
                
                {/* Outliers */}
                {stat.outliers.map((o, idx) => (
                  <div key={idx} className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2 -translate-x-1/2" style={{ left: `${scaleFn(o)}%`, backgroundColor: stat.tColor, opacity: 0.3 }}></div>
                ))}
              </div>
              
              {/* Tooltip */}
              <div className="absolute right-0 bottom-full mb-1 hidden group-hover/box:flex flex-col bg-[#111118] border border-white/10 p-3 rounded-lg text-xs font-mono text-white/70 shadow-2xl z-20">
                <div className="text-white font-bold mb-1 border-b border-white/10 pb-1" style={{ color: stat.tColor }}>{stat.driver?.name_acronym || stat.driverNum} Pace</div>
                <div className="flex justify-between gap-4"><span>Min:</span> <span>{(stat.min).toFixed(3)}s</span></div>
                <div className="flex justify-between gap-4"><span>Q1:</span> <span>{(stat.q1).toFixed(3)}s</span></div>
                <div className="flex justify-between gap-4 text-white font-bold"><span>Median:</span> <span>{(stat.median).toFixed(3)}s</span></div>
                <div className="flex justify-between gap-4"><span>Q3:</span> <span>{(stat.q3).toFixed(3)}s</span></div>
                <div className="flex justify-between gap-4"><span>Max:</span> <span>{(stat.max).toFixed(3)}s</span></div>
              </div>
            </div>
          ))}
          
          {/* X Axis Labels */}
          <div className="flex pl-14 relative mt-2 text-[10px] font-mono text-white/30 border-t border-white/10 pt-2">
             <div className="absolute transform -translate-x-1/2" style={{ left: `calc(3.5rem + ${scaleFn(globalMin)}% * (100% - 3.5rem)/100)` }}>{Math.floor(globalMin/60)}:{(globalMin%60).toFixed(1)}</div>
             <div className="absolute transform -translate-x-1/2" style={{ left: `calc(3.5rem + 50% * (100% - 3.5rem)/100)` }}>{Math.floor(((globalMin+globalMax)/2)/60)}:{(((globalMin+globalMax)/2)%60).toFixed(1)}</div>
             <div className="absolute transform -translate-x-1/2" style={{ left: `calc(3.5rem + ${scaleFn(globalMax)}% * (100% - 3.5rem)/100)` }}>{Math.floor(globalMax/60)}:{(globalMax%60).toFixed(1)}</div>
          </div>
        </div>
      )}
      
      {mode === 'HISTOGRAM' && (
        <div className="py-10 text-center font-mono text-xs text-white/40">
           Histogram view is structurally complex to render cleanly for multiple drivers simultaneously. Box Plot provides the most analytical density.
        </div>
      )}
    </div>
  );
};
