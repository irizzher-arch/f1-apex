import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CircuitMap = ({ speedAnnotations }) => {
  // A realistic proxy path for the track layout. 
  // We use this because we don't have exact vector coordinate paths for all 24 tracks.
  const pathD = "M 200,50 C 400,50 450,150 450,250 C 450,350 300,350 200,300 C 100,250 50,350 50,250 C 50,150 100,50 200,50 Z";

  const [hoverTurn, setHoverTurn] = useState(null);

  // Map speed annotations to approximate locations on the path
  // In a real app with exact paths, we'd use getPointAtLength()
  const annotationPoints = speedAnnotations ? speedAnnotations.slice(0, 4).map((ann, i) => {
    const points = [
      { x: 300, y: 50 },
      { x: 450, y: 200 },
      { x: 250, y: 325 },
      { x: 50, y: 200 }
    ];
    return { ...ann, ...points[i] };
  }) : [];

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-[#000000] border border-white/[0.02] rounded-lg overflow-hidden group">
      <svg 
        viewBox="0 0 500 400" 
        className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
      >
        {/* Track Outline Background */}
        <path 
          d={pathD}
          fill="none" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Track Core Line */}
        <path 
          id="circuit-path"
          d={pathD}
          fill="none" 
          stroke="rgba(255,255,255,0.85)" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Start / Finish Line */}
        <line x1="190" y1="40" x2="190" y2="60" stroke="white" strokeWidth="2" strokeDasharray="2 2" />
        <text x="190" y="30" fill="white" fontSize="9" fontFamily="monospace" textAnchor="middle">START / FINISH</text>

        {/* Sector Dividers */}
        <line x1="440" y1="200" x2="460" y2="200" stroke="#00D2BE" strokeWidth="2" />
        <text x="470" y="205" fill="#00D2BE" fontSize="10" fontFamily="monospace">SECTOR 2</text>

        <line x1="120" y1="280" x2="110" y2="300" stroke="#FF8700" strokeWidth="2" />
        <text x="90" y="310" fill="#FF8700" fontSize="10" fontFamily="monospace">SECTOR 3</text>

        {/* Speed Annotations */}
        {annotationPoints.map((ann, i) => (
          <g 
            key={i} 
            className="cursor-pointer" 
            onMouseEnter={() => setHoverTurn(ann)}
            onMouseLeave={() => setHoverTurn(null)}
          >
            {/* Connector Line */}
            <line x1={ann.x} y1={ann.y} x2={ann.x + 30} y2={ann.y - 30} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
            
            {/* Turn Number Circle */}
            <circle cx={ann.x} cy={ann.y} r="9" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x={ann.x} y={ann.y + 3} fill="white" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {ann.turn.replace('T', '')}
            </text>

            {/* Pill */}
            <rect x={ann.x + 30} y={ann.y - 40} width="85" height="20" rx="6" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x={ann.x + 40} y={ann.y - 26} fill="white" fontSize="10" fontFamily="monospace">
              {ann.speed} KPH | G{ann.gear}
            </text>
          </g>
        ))}

        {/* Animated Car Dot */}
        <circle r="4" fill="#E8002D" filter="drop-shadow(0 0 6px #E8002D)">
          <animateMotion 
            dur="15s" 
            repeatCount="indefinite" 
            path={pathD} 
          />
        </circle>
      </svg>

      {/* Interactive Tooltip */}
      <AnimatePresence>
        {hoverTurn && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-4 right-4 bg-black/95 border border-f1-red rounded-[10px] p-4 shadow-xl z-20 pointer-events-none"
          >
            <h4 className="font-heading font-bold text-white text-lg uppercase m-0 border-b border-white/10 pb-2 mb-2">
              {hoverTurn.turn} Profile
            </h4>
            <div className="flex flex-col gap-1 font-mono text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-white/50">ENTRY SPEED</span>
                <span className="text-white">{hoverTurn.speed} KPH</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/50">GEAR</span>
                <span className="text-white">{hoverTurn.gear}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
