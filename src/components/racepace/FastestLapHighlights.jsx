import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useDriverData, useErgastResults, useStintData } from '@/hooks/useRacePaceQueries';
import { teamColors } from '@/utils/teamColors';

export const FastestLapHighlights = () => {
  const { racePace } = useStore();
  const { sessionKey, year, round } = racePace;
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: drivers } = useDriverData(sessionKey);
  const { data: results } = useErgastResults(year, round);
  const { data: stints } = useStintData(sessionKey);

  const { overallFastest, personalBests } = useMemo(() => {
    if (!laps || !drivers) return { overallFastest: null, personalBests: [] };
    
    let overall = null;
    let minGlobalDuration = Infinity;
    const pbs = [];
    
    drivers.forEach(driver => {
      const dLaps = laps.filter(l => l.driver_number === driver.driver_number && l.lap_duration > 0);
      if (dLaps.length === 0) return;
      
      let driverBest = dLaps[0];
      for (const lap of dLaps) {
        if (lap.lap_duration < driverBest.lap_duration) {
          driverBest = lap;
        }
      }
      
      if (driverBest.lap_duration < minGlobalDuration) {
        minGlobalDuration = driverBest.lap_duration;
        overall = { ...driverBest, driverInfo: driver };
      }
      
      const stint = stints?.find(s => s.driver_number === driver.driver_number && driverBest.lap_number >= s.lap_start && driverBest.lap_number <= s.lap_end);
      
      pbs.push({
        ...driverBest,
        driverInfo: driver,
        compound: stint?.compound || 'UNKNOWN',
        tyreAge: stint ? (driverBest.lap_number - stint.lap_start + (stint.tyre_age_at_start||0)) : 0
      });
    });
    
    pbs.sort((a,b) => a.lap_duration - b.lap_duration);
    return { overallFastest: overall, personalBests: pbs };
  }, [laps, drivers, stints]);

  // Use Ergast official fastest lap if available (more reliable for the left card)
  const officialFastestObj = results?.Results?.find(r => r.FastestLap?.rank === "1");
  const leftCardData = officialFastestObj ? {
    time: officialFastestObj.FastestLap.Time.time,
    lap: officialFastestObj.FastestLap.lap,
    speed: officialFastestObj.FastestLap.AverageSpeed ? (officialFastestObj.FastestLap.AverageSpeed.speed + ' ' + officialFastestObj.FastestLap.AverageSpeed.units) : 'N/A',
    driver: officialFastestObj.Driver,
    constructor: officialFastestObj.Constructor,
    img: `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1/common/f1/2024/fallbackdriverright.webp`
  } : null;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mt-8">
      
      {/* LEFT COLUMN: Fastest Lap of Race Card */}
      <div className="w-full md:w-2/5">
        <div className="bg-[#9B59B6]/[0.06] border border-[#9B59B6]/25 rounded-2xl p-7 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(155,89,182,0.15)] h-full min-h-[380px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9B59B6] opacity-10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#9B59B6]"></span>
            <h3 className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#9B59B6]">Fastest Lap</h3>
          </div>
          
          {leftCardData ? (
            <>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full border-4 overflow-hidden bg-black/50" style={{ borderColor: teamColors[leftCardData.constructor.constructorId.replace(/_/g, '')] || '#9B59B6' }}>
                  <img src={leftCardData.img} className="w-full h-full object-cover object-top" alt="Driver" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-4xl text-[#9B59B6]">{leftCardData.driver.code}</span>
                  <span className="font-mono text-sm text-white mt-1">{leftCardData.driver.givenName} {leftCardData.driver.familyName}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="font-mono font-bold text-[#9B59B6] text-6xl tracking-tighter drop-shadow-md mb-6">{leftCardData.time}</div>
                
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-md bg-black/30 border border-white/10 font-mono text-xs text-white/70 uppercase">LAP {leftCardData.lap}</div>
                  <div className="px-3 py-1.5 rounded-md bg-black/30 border border-white/10 font-mono text-xs text-white/70 uppercase">{leftCardData.constructor.name}</div>
                  <div className="px-3 py-1.5 rounded-md bg-black/30 border border-white/10 font-mono text-xs text-white/70 uppercase">AVG: {leftCardData.speed}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center font-mono text-white/30">Loading Fastest Lap...</div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Personal Best Leaderboard */}
      <div className="w-full md:w-3/5 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col h-full max-h-[500px]">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">Personal Best Highlights</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="grid grid-cols-[40px_1fr_100px_100px_120px] p-3 border-b border-white/5 bg-white/5 font-mono text-[10px] text-text-secondary uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
            <div className="text-center">Rnk</div>
            <div>Driver</div>
            <div className="text-right">Time</div>
            <div className="text-right">Gap</div>
            <div className="text-right pr-4">Lap (Age)</div>
          </div>
          
          {personalBests.map((pb, idx) => {
            const isFastest = idx === 0;
            const tColor = pb.driverInfo?.team_colour ? `#${pb.driverInfo.team_colour}` : (teamColors[pb.driverInfo?.team_name?.replace(/\s/g, '').toLowerCase()] || '#fff');
            const gap = isFastest ? 0 : pb.lap_duration - personalBests[0].lap_duration;
            const timeFormatted = `${Math.floor(pb.lap_duration / 60)}:${(pb.lap_duration % 60).toFixed(3).padStart(6, '0')}`;
            
            return (
              <div key={pb.driver_number} className={`grid grid-cols-[40px_1fr_100px_100px_120px] p-3 items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors relative ${isFastest ? 'bg-[#9B59B6]/[0.08]' : ''}`}>
                {isFastest && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#9B59B6]" />}
                
                <div className={`text-center font-mono font-bold ${isFastest ? 'text-[#9B59B6]' : 'text-white/40'}`}>{idx + 1}</div>
                
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tColor }}></span>
                  <span className="font-heading font-bold text-sm text-white uppercase">{pb.driverInfo?.name_acronym || pb.driver_number}</span>
                  <span className="font-mono text-[9px] text-white/30 truncate ml-1">{pb.driverInfo?.team_name}</span>
                </div>
                
                <div className={`text-right font-mono font-bold text-sm ${isFastest ? 'text-[#9B59B6]' : 'text-white'}`}>{timeFormatted}</div>
                
                <div className="text-right">
                  {isFastest ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#9B59B6]/20 text-[#9B59B6]">FASTEST</span>
                  ) : (
                    <span className="font-mono text-xs text-white/50">+{gap.toFixed(3)}s</span>
                  )}
                </div>
                
                <div className="text-right pr-4 flex flex-col items-end">
                  <span className="font-mono text-xs text-white">L{pb.lap_number}</span>
                  <span className="font-mono text-[9px] text-white/40">{pb.compound} ({pb.tyreAge})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};
