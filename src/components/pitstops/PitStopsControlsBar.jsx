import React from 'react';
import { useStore } from '@/store/useStore';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';

export const PitStopsControlsBar = ({ schedule }) => {
  const { pitStops, setPitStopsState } = useStore();
  const { year, selectedRound } = pitStops;
  
  const years = Array.from({ length: 9 }, (_, i) => 2026 - i); // 2018-2026

  return (
    <div className="sticky top-[72px] w-full min-h-[68px] py-3 bg-black/95 backdrop-blur-[20px] border-b border-t border-white/10 z-[90] flex items-center">
      <div className="w-full max-w-[1400px] mx-auto px-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
      
        {/* LEFT: Session Selector */}
        <div className="flex items-center gap-4 min-w-fit">
          <select 
            value={year}
            onChange={(e) => setPitStopsState({ year: e.target.value, selectedRound: 'ALL' })}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white font-heading font-bold outline-none hover:bg-white/10 transition-colors cursor-pointer"
          >
            {years.map(y => <option key={y} value={y} className="bg-background-base">{y}</option>)}
          </select>
        </div>

        {/* CENTER: Page Title */}
        <div className="flex-1 flex items-center justify-center min-w-[300px]">
          <h1 className="text-xl font-heading font-bold uppercase tracking-widest text-white flex items-center gap-3">
            PIT STOP ANALYSIS
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E8002D]/20 text-[#E8002D] border border-[#E8002D]/30">
              {year} SEASON
            </span>
          </h1>
        </div>

        {/* RIGHT: Round Filter */}
        <div className="flex items-center gap-4 min-w-fit justify-end">
          <select
            value={selectedRound}
            onChange={(e) => setPitStopsState({ selectedRound: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white font-mono text-xs font-bold outline-none hover:bg-white/10 transition-colors cursor-pointer"
          >
            <option value="ALL" className="bg-background-base">ALL ROUNDS</option>
            {schedule?.map(r => {
               const flag = getCountryFlagSlug(r.Circuit.Location.country);
               return (
                 <option key={r.round} value={r.round} className="bg-background-base">
                   Rd {r.round} · {r.Circuit.Location.country.toUpperCase()}
                 </option>
               );
            })}
          </select>
        </div>

      </div>
    </div>
  );
};
