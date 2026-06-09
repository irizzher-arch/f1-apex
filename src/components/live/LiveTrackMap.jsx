import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

export const LiveTrackMap = () => {
  const sessionMeta = useStore(state => state.liveTiming.sessionMeta);
  const locations = useStore(state => state.liveTiming.locations);
  const drivers = useStore(state => state.liveTiming.drivers);
  const selectedDriver = useStore(state => state.liveTiming.selectedDriverNumber);
  
  const [svgPath, setSvgPath] = useState(null);

  // Load the circuit SVG dynamically based on circuit_key
  useEffect(() => {
    if (!sessionMeta?.circuit_key) return;
    
    // In a real app, this would fetch from /public/circuits/${circuit_key}.svg
    // Since we don't have all 24 SVGs here, we'll draw a generic or placeholder shape 
    // unless it's available. We can use a simple loop as placeholder.
    fetch(`/circuits/${sessionMeta.circuit_key}.svg`)
      .then(r => r.text())
      .then(text => {
        if (text.includes('<svg')) {
           setSvgPath(text);
        } else {
           setSvgPath('fallback');
        }
      })
      .catch(() => setSvgPath('fallback'));
  }, [sessionMeta?.circuit_key]);

  // Compute bounding box to normalize coordinates
  const bbox = useMemo(() => {
    const locs = Object.values(locations);
    if (locs.length < 5) return { minX: -10000, maxX: 10000, minY: -10000, maxY: 10000 };
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    locs.forEach(l => {
      if (l.x < minX) minX = l.x;
      if (l.x > maxX) maxX = l.x;
      if (l.y < minY) minY = l.y;
      if (l.y > maxY) maxY = l.y;
    });
    
    // Add 10% padding
    const w = maxX - minX;
    const h = maxY - minY;
    return {
      minX: minX - w*0.1,
      maxX: maxX + w*0.1,
      minY: minY - h*0.1,
      maxY: maxY + h*0.1
    };
  }, [locations]);

  // Map coordinate to SVG 100x100 space
  const normalize = (val, min, max, svgMax) => {
    if (max === min) return svgMax / 2;
    return ((val - min) / (max - min)) * svgMax;
  };

  return (
    <div className="w-full bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 flex flex-col shadow-lg relative min-h-[400px]">
      <div className="flex items-center justify-between mb-2 absolute top-4 left-4 z-10 w-[calc(100%-2rem)] pointer-events-none">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">LIVE TRACK MAP</h3>
        <div className="flex gap-2 pointer-events-auto">
          <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
          <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
        </div>
      </div>

      <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 1000 1000" className="w-full h-full max-h-[500px]" preserveAspectRatio="xMidYMid meet">
          {/* Track SVG Path Placeholder or Rendered string */}
          {svgPath === 'fallback' ? (
            <path d="M200,500 C200,200 800,200 800,500 C800,800 200,800 200,500" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
          ) : svgPath ? (
             <g dangerouslySetInnerHTML={{ __html: svgPath.replace(/<svg[^>]*>|<\/svg>/g, '') }} />
          ) : (
             <circle cx="500" cy="500" r="300" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
          )}

          {/* Render Cars */}
          {Object.entries(locations).map(([numStr, loc]) => {
            const num = parseInt(numStr);
            const drv = drivers[num];
            if (!drv) return null;
            
            const isSel = selectedDriver === num;
            const cx = normalize(loc.x, bbox.minX, bbox.maxX, 1000);
            const cy = normalize(loc.y, bbox.minY, bbox.maxY, 1000); // Y might be inverted depending on circuit mapping

            return (
              <g key={num}>
                <motion.circle
                  initial={{ cx, cy }}
                  animate={{ cx, cy }}
                  transition={{ duration: 1, ease: "linear" }}
                  r={isSel ? 12 : 8}
                  fill={`#${drv.team_colour || 'FFF'}`}
                  className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                />
                <motion.text
                  initial={{ x: cx + 15, y: cy + 4 }}
                  animate={{ x: cx + 15, y: cy + 4 }}
                  transition={{ duration: 1, ease: "linear" }}
                  fill={`#${drv.team_colour || 'FFF'}`}
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {drv.name_acronym}
                </motion.text>
                {isSel && (
                  <motion.circle
                    initial={{ cx, cy }}
                    animate={{ cx, cy }}
                    transition={{ duration: 1, ease: "linear" }}
                    r={18}
                    fill="none"
                    stroke={`#${drv.team_colour || 'FFF'}`}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-spin-slow"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
