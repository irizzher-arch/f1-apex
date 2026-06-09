import React from 'react';
import { useDHLPoints } from '@/hooks/useDHLPoints';
import { getTeamLogoSlug } from '@/utils/teamSlugMap';
import { motion, AnimatePresence } from 'framer-motion';

export const DriverDHLPoints = ({ allStops, schedule, drivers, isLoading }) => {
  const { driverStandings } = useDHLPoints(allStops, drivers, schedule);

  if (isLoading) return <div className="w-full h-[500px] bg-white/5 rounded-xl animate-pulse"></div>;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex flex-col h-full max-h-[800px] overflow-hidden">
      <div className="flex flex-col mb-6 shrink-0">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50 mb-3">DRIVER DHL FASTEST PIT STOP POINTS</h3>
        <div className="px-4 py-3 border-l-2 border-[#00D2BE] bg-white/[0.02] rounded-r-md">
          <p className="font-mono text-[10px] text-white/50 leading-relaxed">
            The DHL Fastest Pit Stop Award was established in 2015 to recognise outstanding pit crew performance. Points are awarded to the constructor with the fastest stop at each Grand Prix, following the standard F1 points structure (25–18–15–12–10–8–6–4–2–1). Drivers below are credited for their crew's points.
          </p>
        </div>
      </div>
      
      <div className="overflow-y-auto w-full flex-1 pr-2 no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#050508]/90 backdrop-blur-md z-10 border-b border-white/10">
            <tr>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">RNK</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">DRIVER</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-right">POINTS</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-center w-16">WINS</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">ROUND-BY-ROUND</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {driverStandings.map((row, index) => {
                const pos = index + 1;
                const drv = row.driverObj;
                const constructorId = drv?.team_name?.replace(/\s/g, '').toLowerCase() || drv?.constructorId || 'unknown';

                return (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold text-sm ${pos === 1 ? 'text-[#FFD700]' : 'text-white/40'}`}>{pos}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=20,height=12,fit=contain,format=auto,dpr=1/team-logos/${getTeamLogoSlug(constructorId)}-normalized-logo.png`}
                          className="w-5 h-3 object-contain opacity-60"
                          alt="Team"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="flex gap-1.5 items-center font-heading text-sm">
                          {drv?.first_name ? (
                            <>
                              <span className="font-normal text-white/70">{drv.first_name}</span>
                              <span className="font-bold text-white uppercase">{drv.last_name}</span>
                            </>
                          ) : (
                            <span className="font-bold text-white">{row.id}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                       <span className={`font-mono font-bold text-lg leading-none ${pos === 1 ? 'text-[#E8002D]' : 'text-white'}`}>{row.total}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                       {row.wins > 0 ? (
                         <div className="flex items-center justify-center gap-1 opacity-80">
                           <span className="font-mono text-xs font-bold text-[#FFD700]">{row.wins}</span>
                           <span className="text-[10px]">🏆</span>
                         </div>
                       ) : <span className="font-mono text-xs text-white/20">-</span>}
                    </td>
                    <td className="py-3 px-3">
                       <div className="flex items-center gap-0.5 flex-wrap">
                         {schedule?.map(r => {
                           const pts = row.byRound[r.round] || 0;
                           // Calculate opacity based on points (25 = 1, 0 = 0.1)
                           const op = pts === 0 ? 0.05 : (pts / 25) * 0.8 + 0.2;
                           return (
                             <div 
                               key={r.round} 
                               className="w-2.5 h-3.5 rounded-sm bg-[#E8002D] relative group/tile cursor-default"
                               style={{ opacity: op }}
                             >
                               {pts > 0 && (
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/tile:block z-50 bg-[#111118] border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-white whitespace-nowrap shadow-xl">
                                   Rd {r.round}: {pts} pts
                                 </div>
                               )}
                             </div>
                           )
                         })}
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
