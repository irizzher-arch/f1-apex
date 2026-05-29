import React from 'react';

export const ApiStatusCard = () => {
  return (
    <div className="mb-12">
      <span className="font-mono text-[10px] text-f1-red tracking-widest uppercase mb-4 inline-block">
        Live Data Sources
      </span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Ergast */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[12px] p-[20px] flex flex-col">
          <h3 className="font-mono text-[12px] text-white m-0 mb-3">ERGAST API</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF64]" />
            <span className="font-mono text-[11px] text-[#00FF64]/80 uppercase">Historical Data</span>
          </div>
          <span className="font-mono text-[11px] text-f1-red uppercase tracking-wide mb-1">
            1950 - 2024 SEASONS
          </span>
          <span className="font-body text-[11px] text-white/50">
            Race results, standings, circuits
          </span>
        </div>

        {/* Card 2 - OpenF1 */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[12px] p-[20px] flex flex-col">
          <h3 className="font-mono text-[12px] text-white m-0 mb-3">OPENF1 API</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-f1-red animate-pulse" />
            <span className="font-mono text-[11px] text-f1-red uppercase">Live + Near-Live</span>
          </div>
          <span className="font-mono text-[11px] text-f1-red uppercase tracking-wide mb-1">
            2023 - PRESENT
          </span>
          <span className="font-body text-[11px] text-white/50">
            Telemetry, intervals, car data
          </span>
        </div>

        {/* Card 3 - Accuracy Notice */}
        <div className="bg-white/[0.03] border border-[#FF8700]/30 rounded-[12px] p-[20px] flex flex-col">
          <h3 className="font-mono text-[12px] text-white m-0 mb-3">DATA ACCURACY</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8700]" />
            <span className="font-mono text-[11px] text-[#FF8700] uppercase">Best Effort</span>
          </div>
          <span className="font-mono text-[11px] text-[#FF8700] uppercase tracking-wide mb-1">
            NOT GUARANTEED
          </span>
          <span className="font-body text-[11px] text-white/50">
            Always verify with official F1 sources
          </span>
        </div>
      </div>
    </div>
  );
};
