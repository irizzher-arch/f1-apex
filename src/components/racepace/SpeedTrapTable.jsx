import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useDriverData } from '@/hooks/useRacePaceQueries';
import { teamColors } from '@/utils/teamColors';
import { motion } from 'framer-motion';

const SpeedColumn = ({ title, trapKey, laps, drivers }) => {
  const data = useMemo(() => {
    if (!laps || !drivers) return [];
    
    const maxSpeeds = [];
    drivers.forEach(driver => {
      const dLaps = laps.filter(l => l.driver_number === driver.driver_number);
      let maxSpd = 0;
      dLaps.forEach(l => {
        if (l[trapKey] && l[trapKey] > maxSpd) maxSpd = l[trapKey];
      });
      if (maxSpd > 0) {
        maxSpeeds.push({
          driver,
          speed: maxSpd,
          tColor: driver?.team_colour ? `#${driver.team_colour}` : (teamColors[driver?.team_name?.replace(/\s/g, '').toLowerCase()] || '#ffffff')
        });
      }
    });
    
    return maxSpeeds.sort((a,b) => b.speed - a.speed);
  }, [laps, drivers, trapKey]);

  if (data.length === 0) return (
    <div className="flex-1 min-w-[280px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col h-[400px]">
      <h3 className="font-heading font-bold text-f1-red text-xs tracking-widest uppercase border-b border-white/10 pb-2 mb-4">{title}</h3>
      <div className="flex-1 flex items-center justify-center font-mono text-white/30 text-xs uppercase">No Data Available</div>
    </div>
  );

  const maxOverall = data[0].speed;
  const minOverall = data[data.length-1].speed;
  const avgOverall = data.reduce((a, b) => a + b.speed, 0) / data.length;

  return (
    <div className="flex-1 min-w-[280px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col h-[480px] overflow-hidden">
      <h3 className="font-heading font-bold text-f1-red text-xs tracking-widest uppercase border-b border-white/10 pb-2 mb-4">{title}</h3>
      
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2">
        {data.map((item, idx) => {
          const widthPct = ((item.speed - (minOverall - 10)) / (maxOverall - (minOverall - 10))) * 100;
          const isFastest = idx === 0;
          
          return (
            <div key={item.driver_number} className="flex items-center gap-3">
              <span className="w-8 shrink-0 font-mono text-[10px] font-bold text-right" style={{ color: item.tColor }}>
                {item.driver?.name_acronym || item.driver?.driver_number || item.driver_number}
              </span>
              
              <div className="flex-1 h-5 bg-white/5 rounded-sm relative flex items-center">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(widthPct, 5)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.03, ease: "easeOut" }}
                  className="h-full rounded-sm"
                  style={{ 
                    backgroundColor: item.tColor,
                    boxShadow: isFastest ? `0 0 12px ${item.tColor}80` : 'none',
                    opacity: idx > 15 ? 0.5 : (isFastest ? 1 : 0.8)
                  }}
                />
                <span className="absolute left-full ml-2 font-mono text-[10px] text-white whitespace-nowrap hidden sm:block">
                  {item.speed.toFixed(1)} <span className="text-white/40">KM/H</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1">
        <div className="font-mono text-[10px] text-f1-red uppercase font-bold">PEAK: {maxOverall.toFixed(1)} KM/H — {data[0]?.driver?.name_acronym || data[0]?.driver_number}</div>
        <div className="font-mono text-[10px] text-white/40 uppercase">AVG FIELD: {avgOverall.toFixed(1)} KM/H</div>
      </div>
    </div>
  );
};

export const SpeedTrapTable = () => {
  const { racePace } = useStore();
  const { sessionKey } = racePace;
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: drivers } = useDriverData(sessionKey);

  return (
    <div className="w-full mt-8">
      <h2 className="text-sm font-heading font-bold tracking-widest uppercase text-white/50 mb-4">Top Speed Trap Data</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <SpeedColumn title="Speed Trap 1 (I1)" trapKey="i1_speed" laps={laps} drivers={drivers} />
        <SpeedColumn title="Speed Trap 2 (I2)" trapKey="i2_speed" laps={laps} drivers={drivers} />
        <SpeedColumn title="Finish Straight (ST)" trapKey="st_speed" laps={laps} drivers={drivers} />
      </div>
    </div>
  );
};
