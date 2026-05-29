import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';
import { DRIVER_IMAGES } from '@/utils/assets';

export const DriverDuelBanner = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season, comparisonMode } = h2h;
  
  const { data: standings } = useDriverStandings(season);

  // Find driver stats from standings
  const d1Stats = standings?.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings?.find(s => s.Driver.driverId === driver2Id);

  const getDriverCard = (stats, side) => {
    if (!stats) return <div className="flex-1 animate-pulse bg-white/5 rounded-2xl h-[220px]" />;

    const driver = stats.Driver;
    const team = stats.Constructors[0];
    const teamId = team?.constructorId || 'f1';
    const tColor = teamColors[teamId] || '#E8002D';
    const photoUrl = DRIVER_IMAGES[driver.driverId] || "https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1/common/f1/2026/fallbackdriverright.webp";

    const isLeft = side === 'left';

    return (
      <motion.div 
        initial={{ x: isLeft ? -60 : 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 relative rounded-[16px] h-[220px] overflow-hidden flex items-end"
        style={{ backgroundColor: `${tColor}14`, border: `1px solid ${tColor}40` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ backgroundColor: tColor }} />
        
        {/* Ghost Number */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 font-mono text-[180px] font-black leading-none pointer-events-none select-none z-0 ${isLeft ? 'right-4' : 'left-4'}`}
          style={{ color: `${tColor}33` }}
        >
          {driver.permanentNumber || '--'}
        </div>

        <div className={`relative z-10 flex w-full h-full p-6 items-end ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Photo */}
          <div className="w-[140px] h-[180px] shrink-0 relative flex items-end">
             <img src={photoUrl} alt={driver.familyName} className={`max-h-[160px] w-auto object-contain ${isLeft ? 'origin-bottom-left' : 'origin-bottom-right scale-x-[-1]'}`} />
          </div>

          {/* Info */}
          <div className={`flex flex-col mb-2 ${isLeft ? 'ml-6 items-start' : 'mr-6 items-end'}`}>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-black font-mono text-[14px] font-bold tracking-wider uppercase" style={{ backgroundColor: tColor }}>
                {driver.code || driver.familyName.substring(0,3).toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5 opacity-60">
                {/* Flag fallback */}
                <span className="text-[12px] font-mono tracking-widest uppercase">{driver.nationality}</span>
              </div>
            </div>
            
            <h2 className="text-[32px] font-heading font-black text-white uppercase leading-none tracking-wide mb-1 flex gap-2">
              <span className="opacity-80">{driver.givenName}</span>
              <span>{driver.familyName}</span>
            </h2>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tColor }} />
              <span className="text-[11px] uppercase text-white/40 tracking-widest font-bold">{team?.name || 'Unknown Team'}</span>
            </div>

            <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
              <div className="text-[#E8002D] font-mono text-xl font-bold tracking-tight">P{stats.position}</div>
              <div className="text-[9px] uppercase text-white/30 tracking-widest">In Championship</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full flex items-center justify-between gap-6 max-w-[1400px] mx-auto pt-8">
      {getDriverCard(d1Stats, 'left')}

      {/* CENTER VS BLOCK */}
      <div className="w-[160px] shrink-0 flex flex-col items-center justify-center relative z-20">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-4 w-12 h-1 bg-white -rotate-12 rounded-full opacity-30" />
          <h1 className="text-[64px] font-heading font-black text-white leading-none tracking-tighter drop-shadow-lg relative z-10">
            VS
          </h1>
          <div className="absolute -bottom-2 w-12 h-1 bg-white -rotate-12 rounded-full opacity-30" />
        </div>
        
        <div className="font-mono text-[16px] text-white/60 mt-6 tracking-[0.2em] font-bold z-10 uppercase">{season}</div>
        <div className="mt-3 px-4 py-1.5 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-white/70 border border-white/10 z-10 text-center leading-tight whitespace-nowrap">
          {comparisonMode === 'TEAMMATES' ? 'Teammate Duel' : 'Cross-Team Duel'}
        </div>
      </div>

      {getDriverCard(d2Stats, 'right')}
    </div>
  );
};
