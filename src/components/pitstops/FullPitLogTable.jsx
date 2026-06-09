import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { getTeamLogoSlug } from '@/utils/teamSlugMap';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';
import pitStopVideos from '@/data/pitStopVideos.json';

export const FullPitLogTable = ({ allStops, schedule, drivers, isLoading }) => {
  const { pitStops, setPitStopsState } = useStore();
  const { year, selectedRound, selectedTeam, showCleanStopsOnly } = pitStops;
  const [sortConfig, setSortConfig] = useState({ key: 'durationMs', direction: 'asc' });
  const [displayCount, setDisplayCount] = useState(30);

  const processedData = useMemo(() => {
    if (!allStops || !drivers || !schedule) return [];
    
    let filtered = allStops;
    
    if (selectedRound !== 'ALL') {
      filtered = filtered.filter(s => String(s.round) === String(selectedRound));
    }
    
    if (showCleanStopsOnly) {
      filtered = filtered.filter(s => (s.durationMs / 1000) <= 4.0);
    }

    const mapped = filtered.map(stop => {
      const drv = stop.driverObj;
      const race = schedule.find(r => String(r.round) === String(stop.round));
      const constructorId = stop.constructorId || 'unknown';
      const videoKey = `${year}-${stop.round}-${stop.driverId}-${stop.lap}`;
      
      return {
        ...stop,
        driverObj: drv,
        raceObj: race,
        constructorId,
        hasVideo: !!pitStopVideos[videoKey],
        videoKey,
      };
    });

    if (selectedTeam !== 'ALL') {
      return mapped.filter(s => s.constructorId === selectedTeam);
    }

    mapped.sort((a, b) => {
      if (sortConfig.key === 'durationMs') {
        return sortConfig.direction === 'asc' ? a.durationMs - b.durationMs : b.durationMs - a.durationMs;
      }
      if (sortConfig.key === 'round') {
        return sortConfig.direction === 'asc' ? a.round - b.round : b.round - a.round;
      }
      if (sortConfig.key === 'lap') {
        return sortConfig.direction === 'asc' ? parseInt(a.lap) - parseInt(b.lap) : parseInt(b.lap) - parseInt(a.lap);
      }
      return 0;
    });

    return mapped;
  }, [allStops, drivers, schedule, selectedRound, selectedTeam, showCleanStopsOnly, sortConfig, year]);

  const displayData = processedData.slice(0, displayCount);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getDurationColor = (dur) => {
    if (dur < 2.5) return 'text-[#b138ff]'; // purple
    if (dur <= 3.0) return 'text-[#00D2BE]'; // green
    if (dur <= 4.0) return 'text-[#FFD700]'; // yellow
    return 'text-[#FF8700]'; // orange/warning
  };

  if (isLoading) return <div className="w-full h-[600px] bg-white/5 rounded-xl animate-pulse"></div>;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative flex flex-col mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-sm font-heading font-bold tracking-widest uppercase text-white/50">FULL PIT STOP LOG</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${showCleanStopsOnly ? 'bg-[#E8002D]' : 'bg-white/10'}`}>
              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showCleanStopsOnly ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="font-mono text-[10px] text-white/50 font-bold uppercase tracking-widest">CLEAN STOPS ONLY</span>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={showCleanStopsOnly} 
              onChange={() => setPitStopsState({ showCleanStopsOnly: !showCleanStopsOnly })} 
            />
          </label>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('round')}>ROUND</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">GP</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lap')}>LAP</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">DRIVER</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">TEAM</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider text-center">STOP #</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider cursor-pointer text-right" onClick={() => handleSort('durationMs')}>DURATION</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider text-center">VIDEO</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((stop, index) => {
              const drv = stop.driverObj;
              const race = stop.raceObj;
              const durSec = stop.durationMs / 1000;

              return (
                <tr 
                  key={`${stop.round}-${stop.driverId}-${stop.lap}-${index}`}
                  className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <span className="font-mono text-xs text-white/50">Rd {stop.round}</span>
                  </td>
                  <td className="py-2.5 px-4">
                     <div className="flex items-center gap-2">
                       <img 
                         src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=20,height=12,fit=crop,format=auto,dpr=1/flags/${getCountryFlagSlug(race?.Circuit?.Location?.country || '')}-flag.png`}
                         className="w-5 h-3 rounded-[1px] object-cover"
                         alt="Flag"
                         onError={(e) => e.target.style.display = 'none'}
                       />
                       <span className="font-mono text-xs text-white/80">{race?.Circuit?.Location?.country}</span>
                     </div>
                  </td>
                  <td className="py-2.5 px-4">
                     <span className="font-mono text-xs text-white/70">L{stop.lap}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex gap-1.5 items-center font-heading text-sm">
                      {drv?.first_name ? (
                        <>
                          <span className="font-normal text-white/70">{drv.first_name}</span>
                          <span className="font-bold text-white uppercase">{drv.last_name}</span>
                        </>
                      ) : (
                        <span className="font-bold text-white">{stop.driverId}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <img 
                      src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=40,height=24,fit=contain,format=auto,dpr=1/team-logos/${getTeamLogoSlug(stop.constructorId)}-normalized-logo.png`}
                      className="w-10 h-6 object-contain"
                      alt="Team"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </td>
                  <td className="py-2.5 px-4 text-center">
                     <span className="font-mono text-xs text-white/40">{stop.stop}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                     <span className={`font-mono font-bold text-sm ${getDurationColor(durSec)}`}>
                       {durSec.toFixed(3)}s
                     </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                     {stop.hasVideo ? (
                       <button 
                         onClick={() => setPitStopsState({ activeVideo: stop.videoKey })}
                         className="w-7 h-7 rounded-full bg-[#E8002D]/10 hover:bg-[#E8002D]/20 flex items-center justify-center transition-colors mx-auto group/btn"
                       >
                         <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-[#E8002D] border-b-[3px] border-b-transparent ml-0.5" />
                       </button>
                     ) : (
                       <span className="text-white/20 font-mono">—</span>
                     )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {processedData.length > displayCount && (
        <div className="w-full flex justify-center mt-6">
          <button 
            onClick={() => setDisplayCount(prev => prev + 30)}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-mono text-[10px] font-bold text-white tracking-widest transition-colors"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </div>
  );
};
