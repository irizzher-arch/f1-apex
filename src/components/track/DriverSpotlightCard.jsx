import React from 'react';
import { TEAM_COLORS } from '@/utils/constants';

export const DriverSpotlightCard = ({ driverName, team, stats }) => {
  const teamColor = TEAM_COLORS[team?.toLowerCase()] || '#E8002D';
  
  // Use a generic placeholder image if no specific URL is provided
  // In a real app we'd fetch this from OpenF1 or another media CDN
  const imgUrl = `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png`;

  return (
    <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-[14px] overflow-hidden flex flex-col group min-w-[280px] lg:min-w-0 flex-1">
      
      {/* Top Team Color Bar */}
      <div className="w-full h-[4px]" style={{ backgroundColor: teamColor }} />
      
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-[80px] h-[80px] rounded-full border-[2px] overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
            style={{ borderColor: teamColor }}
          >
            <img src={imgUrl} alt={driverName} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-[22px] text-white uppercase leading-none m-0 mb-1">
              {driverName}
            </h4>
            <span className="font-body text-[12px] text-white/60">{team}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 mt-auto">
          <div className="flex flex-col">
            <span className="font-heading text-[9px] uppercase text-white/40 tracking-wide mb-1">Starts</span>
            <span className="font-mono text-[14px] text-white">{stats.starts}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[9px] uppercase text-white/40 tracking-wide mb-1">Wins</span>
            <span className="font-mono text-[14px] text-white">{stats.wins}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[9px] uppercase text-white/40 tracking-wide mb-1">Podiums</span>
            <span className="font-mono text-[14px] text-white">{stats.podiums}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[9px] uppercase text-white/40 tracking-wide mb-1">Poles</span>
            <span className="font-mono text-[14px] text-white">{stats.poles}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[9px] uppercase text-white/40 tracking-wide mb-1">Fastest Laps</span>
            <span className="font-mono text-[14px] text-white">{stats.fastestLaps}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[9px] uppercase text-white/40 tracking-wide mb-1">Total Laps</span>
            <span className="font-mono text-[14px] text-white">{stats.totalLaps}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-auto">
          <span className="font-heading text-[9px] text-f1-red uppercase tracking-widest block mb-1">Personal Best</span>
          <span className="font-mono text-[20px] text-white">{stats.personalBest}</span>
        </div>
      </div>
    </div>
  );
};
