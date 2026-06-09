import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamLogoSlug } from '@/utils/teamSlugMap';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';
import pitStopVideos from '@/data/pitStopVideos.json';

export const FastestStopsTable = ({ allStops, schedule, drivers, isLoading }) => {
  const { pitStops, setPitStopsState } = useStore();
  const { selectedRound, year } = pitStops;
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'durationMs', direction: 'asc' });

  const processedData = useMemo(() => {
    if (!allStops || !drivers || !schedule) return [];
    
    let filtered = allStops;
    if (selectedRound !== 'ALL') {
      filtered = filtered.filter(s => String(s.round) === String(selectedRound));
    }

    // Map necessary fields
    const mapped = filtered.map(stop => {
      // stop already has driverObj and driverNumber from the hook
      const drv = drivers.find(d => String(d.driver_number) === String(stop.driverNumber)) || stop.driverObj;
      const race = schedule.find(r => String(r.round) === String(stop.round));
      const constructorId = drv?.team_name?.replace(/\s/g, '').toLowerCase() || drv?.constructorId || stop.constructorId || 'unknown';
      const videoKey = `${year}-${stop.round}-${stop.driverId || stop.driverNumber}-${stop.lap}`;
      
      return {
        ...stop,
        driverObj: drv,
        raceObj: race,
        constructorId,
        hasVideo: !!pitStopVideos[videoKey],
        videoKey,
      };
    });

    // Sort
    mapped.sort((a, b) => {
      if (sortConfig.key === 'durationMs') {
        return sortConfig.direction === 'asc' ? a.durationMs - b.durationMs : b.durationMs - a.durationMs;
      }
      if (sortConfig.key === 'round') {
        return sortConfig.direction === 'asc' ? a.round - b.round : b.round - a.round;
      }
      return 0;
    });

    return mapped;
  }, [allStops, drivers, schedule, selectedRound, sortConfig, year]);

  const displayData = showAll ? processedData : processedData.slice(0, 20);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (isLoading) {
    return <div className="w-full h-64 bg-white/5 rounded-xl animate-pulse"></div>;
  }

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden">
      <h2 className="text-sm font-heading font-bold tracking-widest uppercase text-white/50 mb-6">{year} FASTEST PIT STOPS</h2>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('durationMs')}>POS</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">DRIVER</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">TEAM</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('round')}>GP</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider cursor-pointer text-right" onClick={() => handleSort('durationMs')}>TIME (SEC)</th>
              <th className="py-3 px-4 text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider text-center">VIDEO</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayData.map((stop, index) => {
                const pos = index + 1;
                const drv = stop.driverObj;
                const race = stop.raceObj;
                const isFastest = pos === 1 && sortConfig.key === 'durationMs' && sortConfig.direction === 'asc';

                return (
                  <motion.tr 
                    key={`${stop.round}-${stop.driverId}-${stop.lap}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold text-sm ${pos === 1 ? 'text-[#FFD700]' : pos === 2 ? 'text-[#C0C0C0]' : pos === 3 ? 'text-[#CD7F32]' : 'text-white/60'}`}>
                        {pos}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <img 
                        src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=40,height=24,fit=contain,format=auto,dpr=1/team-logos/${getTeamLogoSlug(stop.constructorId)}-normalized-logo.png`}
                        className="w-10 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        alt="Team"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </td>
                    <td className="py-3 px-4">
                       <div className="flex items-center gap-2">
                         <img 
                           src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=24,height=15,fit=crop,format=auto,dpr=1/flags/${getCountryFlagSlug(race?.Circuit?.Location?.country || '')}-flag.png`}
                           className="w-6 h-4 rounded-sm object-cover"
                           alt="Flag"
                           onError={(e) => e.target.style.display = 'none'}
                         />
                         <span className="font-mono text-xs text-white/70">{race?.Circuit?.Location?.country || `Rd ${stop.round}`}</span>
                       </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                       <span className={`font-mono font-bold text-sm ${isFastest ? 'text-[#E8002D]' : 'text-white'}`}>
                         {(stop.durationMs / 1000).toFixed(2)}
                       </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                       {stop.hasVideo ? (
                         <button 
                           onClick={() => setPitStopsState({ activeVideo: stop.videoKey })}
                           className="w-8 h-8 rounded-full bg-[#E8002D]/10 hover:bg-[#E8002D]/20 border border-[#E8002D]/30 flex items-center justify-center transition-colors mx-auto group/btn"
                         >
                           <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-[#E8002D] border-b-[4px] border-b-transparent ml-0.5 group-hover/btn:scale-110 transition-transform" />
                         </button>
                       ) : (
                         <span className="text-white/20 font-mono">—</span>
                       )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {!showAll && processedData.length > 20 && (
        <div className="w-full flex justify-center mt-6">
          <button 
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-mono text-[10px] font-bold text-white tracking-widest transition-colors"
          >
            SHOW MORE
          </button>
        </div>
      )}
    </div>
  );
};
