import React from 'react';
import { motion, useInView } from 'framer-motion';

export const CarSetupSliders = ({ stats }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!stats) return null;

  const sliders = [
    { label: 'DOWNFORCE', value: stats.downforce, color: '#E8002D' },
    { label: 'BRAKE WEAR', value: stats.brakeWear, color: '#FF8700' },
    { label: 'TYRE WEAR', value: stats.tyreWear, color: '#00D2BE' }
  ];

  return (
    <div ref={ref} className="w-full flex flex-col gap-6">
      
      {/* Car Silhouette Mock (using CSS/SVG shapes for a minimalist F1 side profile) */}
      <div className="hidden md:flex justify-center mb-2 w-full h-[60px] opacity-60">
        <svg viewBox="0 0 300 80" className="w-[240px] h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          {/* Very basic F1 side profile proxy using paths */}
          <path d="M40 60 L60 45 L100 45 L140 30 L170 30 L190 40 L240 40 L260 25 L280 25 L280 60 Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Wheels */}
          <circle cx="80" cy="60" r="15" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="230" cy="60" r="15" fill="none" stroke="white" strokeWidth="2" />
          {/* Rear Wing */}
          <line x1="40" y1="60" x2="40" y2="35" stroke="white" strokeWidth="1.5" />
          <line x1="30" y1="35" x2="50" y2="35" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="flex flex-col gap-4">
        {sliders.map((slider, i) => {
          // Map 1-10 level to percentage 0-100%
          const percentage = (slider.value / 10) * 100;
          
          return (
            <div key={i} className="flex flex-col gap-1">
              <span className="font-heading text-[10px] uppercase text-white/45 tracking-wider">
                {slider.label}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-white/35">LOW</span>
                
                <div className="flex-1 h-[4px] bg-white/[0.08] rounded-full relative flex items-center">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    className="h-full rounded-full absolute left-0"
                    style={{ backgroundColor: slider.color }}
                  />
                  {/* Indicator Dot */}
                  <motion.div 
                    initial={{ left: 0, opacity: 0 }}
                    animate={isInView ? { left: `calc(${percentage}% - 5px)`, opacity: 1 } : { left: 0, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    className="absolute w-[10px] h-[10px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                </div>
                
                <span className="font-mono text-[9px] text-white/35">HIGH</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
