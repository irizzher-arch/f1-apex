import React, { useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { MiniSectorStrip } from './MiniSectorStrip';

const formatTime = (seconds) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3);
  return m > 0 ? `${m}:${s.padStart(6, '0')}` : s;
};

const getTyreColor = (compound) => {
  switch (compound?.toUpperCase()) {
    case 'SOFT': return '#E8002D';
    case 'MEDIUM': return '#FFD700';
    case 'HARD': return '#FFFFFF';
    case 'INTERMEDIATE': return '#00AA44';
    case 'WET': return '#0080FF';
    default: return '#555555';
  }
};

export const LeaderboardRow = ({ driver }) => {
  const num = driver.driver_number;
  
  // Select only the slices of state this driver needs to prevent full re-renders
  const posData = useStore(state => state.liveTiming.positions[num]);
  const intData = useStore(state => state.liveTiming.intervals[num]);
  const laps = useStore(state => state.liveTiming.laps[num]);
  const stints = useStore(state => state.liveTiming.stints[num]);
  const pits = useStore(state => state.liveTiming.pits[num]);
  const carData = useStore(state => state.liveTiming.carData[num]);
  
  const currentGlobalLap = useStore(state => state.liveTiming.currentLap);
  const columnVis = useStore(state => state.liveTiming.columnVisibility);
  const compactMode = useStore(state => state.liveTiming.compactMode);
  const selectedDriver = useStore(state => state.liveTiming.selectedDriverNumber);
  const setSelectedDriver = useStore(state => state.setLiveSelectedDriver);
  
  const isSelected = selectedDriver === num;
  
  const prevPosRef = useRef(posData?.position);
  const rowRef = useRef(null);

  // Derived Data
  const lastLap = useMemo(() => laps && laps.length > 0 ? laps[laps.length - 1] : null, [laps]);
  const currentStint = useMemo(() => stints && stints.length > 0 ? stints[stints.length - 1] : null, [stints]);
  const latestCar = useMemo(() => carData && carData.length > 0 ? carData[carData.length - 1] : null, [carData]);
  
  // Tyre Age computation
  const tyreAge = useMemo(() => {
    if (!currentStint) return 0;
    const startLaps = currentStint.tyre_age_at_start || 0;
    const stintLaps = currentGlobalLap - currentStint.lap_start;
    return Math.max(startLaps + stintLaps, 0);
  }, [currentStint, currentGlobalLap]);

  // Flash animation trigger
  useEffect(() => {
    if (posData?.position && prevPosRef.current && prevPosRef.current !== posData.position) {
      const movedUp = posData.position < prevPosRef.current;
      if (rowRef.current) {
        rowRef.current.classList.add(movedUp ? 'border-l-[#00C853]' : 'border-l-[#E8002D]');
        rowRef.current.classList.add('border-l-4');
        rowRef.current.classList.remove('border-l-transparent', 'border-l');
        setTimeout(() => {
          if (rowRef.current) {
            rowRef.current.classList.remove('border-l-[#00C853]', 'border-l-[#E8002D]', 'border-l-4');
            rowRef.current.classList.add('border-l-transparent', 'border-l');
          }
        }, 500);
      }
    }
    prevPosRef.current = posData?.position;
  }, [posData?.position]);

  return (
    <motion.div
      ref={rowRef}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={() => setSelectedDriver(isSelected ? null : num)}
      className={`
        relative w-full flex flex-col justify-center rounded border transition-colors cursor-pointer
        ${compactMode ? 'min-h-[36px] py-1' : 'min-h-[44px] py-2'}
        ${isSelected ? 'bg-white/[0.08] border-white/20' : 'bg-[#0A0A0F]/50 border-transparent hover:bg-white/[0.04]'}
      `}
    >
      <div className="flex items-center px-4">
        {/* POS */}
        <div className="w-8 shrink-0 font-mono font-bold text-sm text-white">{posData?.position || '-'}</div>
        
        {/* CHANGE (Mock starting grid logic for now) */}
        <div className="w-8 shrink-0 font-mono text-xs text-white/40 text-center">-</div>
        
        {/* DRIVER */}
        <div className="flex-1 min-w-[120px] flex items-center gap-2 pl-2">
          <div className="w-[3px] h-[14px] rounded-full" style={{ backgroundColor: `#${driver.team_colour}` }} />
          <div className="flex flex-col">
            <span className="font-mono font-bold text-white text-sm leading-tight">{driver.name_acronym}</span>
            {!compactMode && <span className="font-heading text-[10px] text-white/50 uppercase leading-none">{driver.last_name}</span>}
          </div>
        </div>

        {/* GAP */}
        {columnVis.gap && (
          <div className={`w-20 shrink-0 text-right font-mono text-xs font-bold ${posData?.position === 1 ? 'text-[#E8002D]' : 'text-white'}`}>
            {posData?.position === 1 ? 'LEADER' : intData?.gap_to_leader ? `+${intData.gap_to_leader.toFixed(3)}` : '-'}
          </div>
        )}

        {/* INTERVAL */}
        {columnVis.interval && (
          <div className={`w-20 shrink-0 text-right font-mono text-[11px] ${intData?.interval < 1 ? 'text-[#FF8700] font-bold' : 'text-white/70'}`}>
            {intData?.interval ? `+${intData.interval.toFixed(3)}` : '-'}
          </div>
        )}

        {/* LAST LAP */}
        {columnVis.lastLap && (
          <div className="w-20 shrink-0 text-right font-mono text-xs text-white/90">
            {lastLap?.is_pit_out_lap ? <span className="px-1 bg-[#FF8700]/20 text-[#FF8700] rounded text-[9px]">OUT</span> : formatTime(lastLap?.lap_duration)}
          </div>
        )}

        {/* SECTORS */}
        {columnVis.s1 && <div className="w-14 shrink-0 text-right font-mono text-[11px] text-white/60">{lastLap?.duration_sector_1 ? lastLap.duration_sector_1.toFixed(3) : '-'}</div>}
        {columnVis.s2 && <div className="w-14 shrink-0 text-right font-mono text-[11px] text-white/60">{lastLap?.duration_sector_2 ? lastLap.duration_sector_2.toFixed(3) : '-'}</div>}
        {columnVis.s3 && <div className="w-14 shrink-0 text-right font-mono text-[11px] text-white/60">{lastLap?.duration_sector_3 ? lastLap.duration_sector_3.toFixed(3) : '-'}</div>}

        {/* TYRE */}
        {columnVis.tyre && (
          <div className="w-16 shrink-0 flex flex-col items-center justify-center">
            <div className="w-4 h-4 rounded-full border-[2px] flex items-center justify-center relative shadow-[inset_0_0_2px_rgba(0,0,0,0.5)] bg-[#1A1A1A]" style={{ borderColor: getTyreColor(currentStint?.compound) }}>
              {currentStint?.compound === 'HARD' && <span className="text-[6px] font-bold text-white absolute">H</span>}
              {currentStint?.compound === 'MEDIUM' && <span className="text-[6px] font-bold text-[#FFD700] absolute">M</span>}
              {currentStint?.compound === 'SOFT' && <span className="text-[6px] font-bold text-[#E8002D] absolute">S</span>}
              {currentStint?.compound === 'INTERMEDIATE' && <span className="text-[6px] font-bold text-[#00AA44] absolute">I</span>}
              {currentStint?.compound === 'WET' && <span className="text-[6px] font-bold text-[#0080FF] absolute">W</span>}
            </div>
            {!compactMode && <span className="text-[9px] font-mono text-white/40 mt-0.5">{tyreAge} L</span>}
          </div>
        )}

        {/* PITS */}
        {columnVis.pits && (
          <div className="w-10 shrink-0 text-center font-mono text-xs text-white/50">
            {pits?.length || 0}
          </div>
        )}

        {/* SPEED */}
        {columnVis.speed && (
          <div className="w-16 shrink-0 text-right font-mono text-[11px] text-white/70">
            {latestCar?.speed ? `${latestCar.speed}` : '-'}
          </div>
        )}

        {/* DRS */}
        {columnVis.drs && (
          <div className="w-10 shrink-0 flex justify-center">
             <div className={`w-6 h-1.5 rounded-full ${latestCar?.drs === 14 ? 'bg-[#00C853] shadow-[0_0_5px_#00C853]' : 'bg-white/10'}`} />
          </div>
        )}
      </div>

      {/* Mini Sectors (Collapsible) */}
      {columnVis.miniSectors && !compactMode && (
        <div className="px-16 pb-1">
          <MiniSectorStrip lap={lastLap} />
        </div>
      )}
    </motion.div>
  );
};
