import React from 'react';
import { motion, useInView } from 'framer-motion';
import { CloudRain } from 'lucide-react';

export const StrategyCards = ({ stats }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!stats) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" }
    })
  };

  const poleWinPercent = Math.round((stats.poleWins.wins / stats.poleWins.total) * 100);
  
  // Calculate stroke dasharray for the SC arc gauge
  // SVG circle circumference for r=16 is ~100
  const scOffset = 100 - stats.safetyCarProb; 

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      
      {/* Card A: Safety Car Probability */}
      <motion.div custom={0} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants} className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col relative overflow-hidden group">
        <span className="font-heading text-[10px] uppercase text-white/45 mb-2">Safety Car Probability</span>
        <span className="font-mono text-[42px] text-white leading-none mb-4">{stats.safetyCarProb}%</span>
        
        {/* Arc Gauge Background */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:opacity-40 transition-opacity">
          <svg width="120" height="120" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#FF8700" strokeWidth="2" strokeDasharray="100" strokeDashoffset={isInView ? scOffset : 100} style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
          </svg>
        </div>

        <span className="font-mono text-[10px] text-white/50 mt-auto z-10">
          {stats.safetyCarAvgLaps} LAPS BEHIND SAFETY CAR (HISTORICAL AVG)
        </span>
      </motion.div>

      {/* Card B: Pit Lane Data */}
      <motion.div custom={1} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants} className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col justify-between">
        <div className="flex flex-col mb-4">
          <span className="font-mono text-[24px] text-white leading-none">{stats.pitLaneLength}</span>
          <span className="font-heading text-[10px] uppercase text-white/45">Pit Lane Length</span>
        </div>
        <div className="flex flex-col border-t border-white/10 pt-4 mt-auto">
          <span className="font-mono text-[24px] text-white leading-none">{stats.fastestPit.time}</span>
          <span className="font-heading text-[10px] uppercase text-white/45">Fastest Pit Stop Duration <span className="text-f1-red">({stats.fastestPit.year})</span></span>
        </div>
      </motion.div>

      {/* Card C: Pole to Win */}
      <motion.div custom={2} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants} className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col">
        <span className="font-heading text-[10px] uppercase text-white/45 mb-2">Winners From Pole</span>
        <span className="font-mono text-[42px] text-white leading-none mb-6">{stats.poleWins.wins}</span>
        
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex justify-between font-mono text-[10px] text-white/50">
            <span>POLE ({poleWinPercent}%)</span>
            <span>OTHER</span>
          </div>
          <div className="w-full h-[8px] bg-white/[0.05] rounded-full overflow-hidden flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={isInView ? { width: `${poleWinPercent}%` } : { width: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-f1-red rounded-full shadow-[0_0_8px_rgba(232,0,45,0.6)]" 
            />
          </div>
        </div>
      </motion.div>

      {/* Card D: Wet Race Probability */}
      <motion.div custom={3} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants} className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="font-heading text-[10px] uppercase text-white/45">Wet Race Probability</span>
          <CloudRain size={20} className="text-[#00D2BE]" />
        </div>
        <span className="font-mono text-[42px] text-white leading-none mb-4">{stats.wetRaceProb}%</span>
        
        {/* Sparkline visualization of rain instances */}
        <div className="mt-auto flex items-end justify-between h-[20px] opacity-60">
          {[0, 1, 0, 0, 1, 1, 0, 0, 0, 1].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={isInView ? { height: val ? 15 : 4 } : { height: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + (i * 0.05) }}
              className={`w-[4px] rounded-t-sm ${val ? 'bg-[#00D2BE]' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </motion.div>

    </div>
  );
};
