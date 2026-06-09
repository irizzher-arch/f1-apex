import React from 'react';
import { TRACK_IMAGES } from '@/utils/assets';

export const CircuitMap = ({ circuitId }) => {
  // Use the official scraped image if it exists, otherwise fallback
  const imageSrc = TRACK_IMAGES[circuitId];

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-[#000000] border border-white/[0.02] rounded-lg p-8 group">
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={`Circuit map for ${circuitId}`}
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          style={{
            filter: 'invert(1) drop-shadow(0 0 10px rgba(232, 0, 45, 0.8)) hue-rotate(140deg)',
            opacity: 0.9
          }}
        />
      ) : (
        <div className="font-mono text-white/30 text-sm tracking-widest">TRACK MAP UNAVAILABLE</div>
      )}
      
      {/* Start / Finish Line Overlay (Approximate decorative element) */}
      <div className="absolute bottom-8 left-8 flex items-center gap-2 opacity-50">
        <div className="w-8 h-8 rounded-full border border-f1-red flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-f1-red rounded-full" />
        </div>
        <span className="font-mono text-[10px] text-white uppercase tracking-widest">Start / Finish</span>
      </div>
    </div>
  );
};
