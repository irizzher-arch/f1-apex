import React, { useMemo } from 'react';
import { useDHLPoints } from '@/hooks/useDHLPoints';
import { getTeamLogoSlug } from '@/utils/teamSlugMap';
import { teamColors } from '@/utils/teamColors';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export const ConstructorDHLStandings = ({ allStops, schedule, drivers, isLoading }) => {
  const { constructorStandings } = useDHLPoints(allStops, drivers, schedule);

  const progressionData = useMemo(() => {
    if (!constructorStandings.length || !schedule) return [];
    
    let chartData = [];
    let runningTotals = {};
    constructorStandings.forEach(c => runningTotals[c.id] = 0);

    schedule.forEach(r => {
      const dp = { round: r.round, name: `Rd ${r.round}` };
      constructorStandings.forEach(c => {
        runningTotals[c.id] += (c.byRound[r.round] || 0);
        dp[c.id] = runningTotals[c.id];
      });
      chartData.push(dp);
    });
    return chartData;
  }, [constructorStandings, schedule]);

  if (isLoading) return <div className="w-full h-[500px] bg-white/5 rounded-xl animate-pulse"></div>;

  const leaderPoints = constructorStandings[0]?.total || 0;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex flex-col h-full max-h-[800px] overflow-hidden">
      <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50 mb-6 shrink-0">CONSTRUCTOR DHL FASTEST PIT STOP STANDINGS</h3>
      
      <div className="overflow-y-auto w-full flex-1 pr-2 no-scrollbar mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#050508]/90 backdrop-blur-md z-10 border-b border-white/10">
            <tr>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">RNK</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">CONSTRUCTOR</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-right">TOTAL POINTS</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider text-center w-16">WINS</th>
              <th className="py-2 px-3 text-[9px] font-mono text-white/40 font-bold uppercase tracking-wider">ROUND-BY-ROUND</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {constructorStandings.map((row, index) => {
                const pos = index + 1;
                const tColor = teamColors[row.id] || '#ffffff';
                const gap = leaderPoints - row.total;

                return (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold text-sm ${pos === 1 ? 'text-[#FFD700]' : 'text-white/40'}`}>{pos}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=30,height=18,fit=contain,format=auto,dpr=1/team-logos/${getTeamLogoSlug(row.id)}-normalized-logo.png`}
                          className="w-8 h-5 object-contain"
                          alt="Team"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <span className="font-heading font-bold text-white text-sm uppercase">{row.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                       <div className="flex flex-col items-end">
                         <span className={`font-mono font-bold text-lg leading-none ${pos === 1 ? 'text-[#E8002D]' : 'text-white'}`}>{row.total}</span>
                         {pos > 1 && <span className="font-mono text-[9px] text-white/30">-{gap} pts</span>}
                       </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                       {row.wins > 0 ? (
                         <div className="flex items-center justify-center gap-1 opacity-80" style={{ color: tColor }}>
                           <span className="font-mono text-xs font-bold">{row.wins}</span>
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                             <path d="M19 3H5C3.89 3 3 3.9 3 5V9C3 12.08 5.25 14.65 8.16 15.11C8.71 17.51 10.66 19.56 13 19.92V21H9V23H15V21H11V19.92C13.34 19.56 15.29 17.51 15.84 15.11C18.75 14.65 21 12.08 21 9V5C21 3.9 20.11 3 19 3ZM5 9V5H7V13C5.9 13 5 12.11 5 9ZM19 9C19 12.11 18.1 13 17 13V5H19V9Z"/>
                           </svg>
                         </div>
                       ) : <span className="font-mono text-xs text-white/20">-</span>}
                    </td>
                    <td className="py-3 px-3">
                       <div className="flex items-center gap-0.5 flex-wrap">
                         {schedule?.map(r => {
                           const pts = row.byRound[r.round] || 0;
                           const op = pts === 0 ? 0.05 : (pts / 25) * 0.8 + 0.2;
                           return (
                             <div 
                               key={r.round} 
                               className="w-2.5 h-3.5 rounded-sm relative group/tile cursor-default"
                               style={{ backgroundColor: tColor, opacity: op }}
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

      {/* Progression Chart */}
      <div className="w-full h-32 shrink-0 border-t border-white/10 pt-4 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
            {constructorStandings.map(c => (
              <Line 
                key={c.id} 
                type="monotone" 
                dataKey={c.id} 
                stroke={teamColors[c.id] || '#ffffff'} 
                strokeWidth={c.id === constructorStandings[0]?.id ? 2 : 1}
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
