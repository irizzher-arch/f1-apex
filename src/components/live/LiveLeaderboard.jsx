import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { LeaderboardRow } from './LeaderboardRow';
import { motion } from 'framer-motion';

export const LiveLeaderboard = () => {
  const drivers = useStore(state => state.liveTiming.drivers);
  const positions = useStore(state => state.liveTiming.positions);
  const columnVisibility = useStore(state => state.liveTiming.columnVisibility);
  const compactMode = useStore(state => state.liveTiming.compactMode);
  
  // Convert state into a sorted array based on live position
  const sortedDrivers = useMemo(() => {
    return Object.values(drivers)
      .filter(d => positions[d.driver_number]) // Only show drivers we have positions for
      .sort((a, b) => {
        const posA = positions[a.driver_number]?.position || 99;
        const posB = positions[b.driver_number]?.position || 99;
        return posA - posB;
      });
  }, [drivers, positions]);

  if (sortedDrivers.length === 0) {
    return (
      <div className="w-full h-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex items-center justify-center">
        <span className="font-mono text-white/40">Waiting for leaderboard data...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col h-full overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#E8002D] via-white/20 to-[#E8002D]" />
      
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#0A0A0F] sticky top-0 z-20">
        <div className="w-8 shrink-0 text-[10px] font-mono text-white/40 font-bold">POS</div>
        <div className="w-8 shrink-0 text-[10px] font-mono text-white/40 font-bold text-center">+/-</div>
        <div className="flex-1 min-w-[120px] text-[10px] font-mono text-white/40 font-bold pl-2">DRIVER</div>
        
        {columnVisibility.gap && <div className="w-20 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">GAP</div>}
        {columnVisibility.interval && <div className="w-20 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">INT</div>}
        {columnVisibility.lastLap && <div className="w-20 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">LAST LAP</div>}
        {columnVisibility.s1 && <div className="w-14 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">S1</div>}
        {columnVisibility.s2 && <div className="w-14 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">S2</div>}
        {columnVisibility.s3 && <div className="w-14 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">S3</div>}
        {columnVisibility.tyre && <div className="w-16 shrink-0 text-[10px] font-mono text-white/40 font-bold text-center">TYRE</div>}
        {columnVisibility.pits && <div className="w-10 shrink-0 text-[10px] font-mono text-white/40 font-bold text-center">PITS</div>}
        {columnVisibility.speed && <div className="w-16 shrink-0 text-[10px] font-mono text-white/40 font-bold text-right">SPEED</div>}
        {columnVisibility.drs && <div className="w-10 shrink-0 text-[10px] font-mono text-white/40 font-bold text-center">DRS</div>}
      </div>

      {/* Rows Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative p-2">
        <div className="flex flex-col gap-1 relative w-full h-full">
          {sortedDrivers.map((driver) => (
            <LeaderboardRow 
              key={driver.driver_number} 
              driver={driver} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
