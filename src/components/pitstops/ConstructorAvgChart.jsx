import React, { useMemo } from 'react';
import { calculateMean } from '@/utils/pitStopCalculations';
import { teamColors } from '@/utils/teamColors';
import { getTeamLogoSlug } from '@/utils/teamSlugMap';
import { motion } from 'framer-motion';

export const ConstructorAvgChart = ({ allStops, drivers, isLoading }) => {
  const chartData = useMemo(() => {
    if (!allStops || !drivers) return [];
    
    const teamMap = {};
    
    allStops.forEach(stop => {
      const drv = stop.driverObj;
      const constructorId = stop.constructorId || 'unknown';
      const color = drv?.team_colour ? `#${drv.team_colour}` : (teamColors[constructorId] || '#ffffff');
      const dur = stop.durationMs / 1000;

      if (!teamMap[constructorId]) {
        teamMap[constructorId] = { id: constructorId, color, durations: [], name: constructorId.toUpperCase(), best: dur, worst: dur };
      }
      teamMap[constructorId].durations.push(dur);
      if (dur < teamMap[constructorId].best) teamMap[constructorId].best = dur;
      if (dur > teamMap[constructorId].worst) teamMap[constructorId].worst = dur;
    });

    const results = Object.values(teamMap).map(t => {
      const avg = calculateMean(t.durations);
      return {
        ...t,
        avg,
        count: t.durations.length,
        range: t.worst - t.best
      };
    }).sort((a, b) => a.avg - b.avg);

    return results;
  }, [allStops, drivers]);

  if (isLoading) return <div className="w-full h-[500px] bg-white/5 rounded-xl animate-pulse"></div>;

  const maxAvg = Math.max(...chartData.map(d => d.avg), 5.0);

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative flex flex-col h-full max-h-[800px] overflow-hidden">
      <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50 mb-6 shrink-0">CONSTRUCTORS AVERAGE PIT STOP TIME</h3>
      
      <div className="w-full flex-1 overflow-y-auto pr-2 no-scrollbar flex flex-col gap-5">
        {chartData.map((team, index) => {
          const barWidth = Math.min(100, (team.avg / maxAvg) * 100);
          const isFastest = index === 0;

          return (
            <div key={team.id} className="w-full flex flex-col group relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-[120px] shrink-0 flex items-center gap-3">
                  <img 
                    src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=30,height=18,fit=contain,format=auto,dpr=1/team-logos/${getTeamLogoSlug(team.id)}-normalized-logo.png`}
                    className="w-8 h-5 object-contain"
                    alt="Team"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <span className="font-heading font-bold text-white text-sm truncate">{team.name}</span>
                </div>
                
                <div className="flex-1 h-3 bg-white/5 rounded-r flex items-center relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${barWidth}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                    className="h-full rounded-r"
                    style={{ 
                      backgroundColor: team.color,
                      boxShadow: isFastest ? `0 0 12px ${team.color}80` : 'none'
                    }}
                  />
                  {/* Tooltip Overlay area inside bar */}
                </div>
                
                <div className="w-[80px] shrink-0 flex flex-col items-end">
                  <span className={`font-mono font-bold text-sm leading-none ${isFastest ? 'text-white' : 'text-white/80'}`}>{team.avg.toFixed(3)}s</span>
                  <span className="font-mono text-[9px] text-white/40">({team.count} stops)</span>
                </div>
              </div>
              
              <div className="flex pl-[136px] gap-6">
                <div className="flex gap-1 items-center">
                  <span className="text-[9px] font-mono text-white/30">BEST:</span>
                  <span className="text-[10px] font-mono text-white/60 font-bold">{team.best.toFixed(3)}s</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-[9px] font-mono text-white/30">WORST:</span>
                  <span className="text-[10px] font-mono text-white/60">{team.worst.toFixed(3)}s</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-[9px] font-mono text-white/30">RANGE:</span>
                  <span className="text-[10px] font-mono text-white/60">{team.range.toFixed(3)}s</span>
                </div>
              </div>

              {/* Hover Tooltip implementation could go here via a hidden div revealed on group hover if needed */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
