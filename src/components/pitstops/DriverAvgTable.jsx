import React, { useMemo } from 'react';
import { calculateMean, calculateConsistencyScore } from '@/utils/pitStopCalculations';
import { getTeamLogoSlug } from '@/utils/teamSlugMap';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';
import { motion, AnimatePresence } from 'framer-motion';

export const DriverAvgTable = ({ allStops, drivers, isLoading }) => {
  const data = useMemo(() => {
    if (!allStops || !drivers) return [];
    
    const driverMap = {};
    allStops.forEach(stop => {
      const dur = stop.durationMs / 1000;
      if (!driverMap[stop.driverId]) {
        driverMap[stop.driverId] = { durations: [], best: dur, bestRound: stop.round, count: 0, driverObj: stop.driverObj, constructorId: stop.constructorId };
      }
      driverMap[stop.driverId].durations.push(dur);
      driverMap[stop.driverId].count++;
      if (dur < driverMap[stop.driverId].best) {
        driverMap[stop.driverId].best = dur;
        driverMap[stop.driverId].bestRound = stop.round;
      }
    });

    return Object.keys(driverMap).map(dId => {
      const data = driverMap[dId];
      const avg = calculateMean(data.durations);
      const cons = calculateConsistencyScore(data.durations);
      return {
        driverId: dId,
        driverObj: data.driverObj,
        constructorId: data.constructorId,
        avg,
        best: data.best,
        bestRound: data.bestRound,
        count: data.count,
        consistency: cons
      };
    }).sort((a, b) => a.avg - b.avg);

  }, [allStops, drivers]);

  if (isLoading) return <div className="w-full h-[500px] bg-white/5 rounded-xl animate-pulse"></div>;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex flex-col h-full max-h-[800px] overflow-hidden">
      <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50 mb-6 shrink-0">DRIVERS AVERAGE PIT STOP TIME</h3>
      
      <div className="overflow-y-auto w-full flex-1 pr-2 no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#050508]/90 backdrop-blur-md z-10 border-b border-white/10">
            <tr>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">RNK</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">DRIVER / TEAM</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-right">AVG TIME</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-right">FASTEST</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-center">STOPS</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider w-[120px]">CONSISTENCY</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((row, index) => {
                const pos = index + 1;
                const drv = row.driverObj;
                const constructorId = row.constructorId || 'unknown';

                return (
                  <motion.tr 
                    key={row.driverId}
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold text-sm ${pos === 1 ? 'text-[#FFD700]' : pos === 2 ? 'text-[#C0C0C0]' : pos === 3 ? 'text-[#CD7F32]' : 'text-white/40'}`}>{pos}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=30,height=18,fit=contain,format=auto,dpr=1/team-logos/${getTeamLogoSlug(constructorId)}-normalized-logo.png`}
                          className="w-8 h-5 object-contain"
                          alt="Team"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="flex flex-col">
                          <div className="flex gap-1.5 items-center font-heading text-sm leading-tight">
                            {drv?.first_name ? (
                              <>
                                <span className="font-normal text-white/70">{drv.first_name}</span>
                                <span className="font-bold text-white uppercase">{drv.last_name}</span>
                              </>
                            ) : (
                              <span className="font-bold text-white">{row.driverId}</span>
                            )}
                          </div>
                          <span className="font-mono text-[9px] text-white/40 uppercase mt-0.5">{constructorId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                       <span className={`font-mono font-bold text-sm ${pos === 1 ? 'text-[#E8002D]' : 'text-white'}`}>{row.avg.toFixed(3)}s</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                       <div className="flex flex-col items-end">
                         <span className="font-mono font-bold text-xs text-white/90">{row.best.toFixed(3)}s</span>
                         <span className="font-mono text-[9px] text-white/40">Rd {row.bestRound}</span>
                       </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                       <span className="font-mono text-xs text-white/60">{row.count}</span>
                    </td>
                    <td className="py-3 px-3">
                       <div className="w-full flex flex-col gap-1">
                         <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-[#00D2BE] rounded-full" style={{ width: `${row.consistency}%` }} />
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-[8px] font-mono text-white/30 font-bold">{row.consistency > 80 ? 'LOW VAR' : row.consistency < 50 ? 'HIGH VAR' : ''}</span>
                           <span className="font-mono text-[9px] text-white/50">{Math.round(row.consistency)}/100</span>
                         </div>
                       </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
