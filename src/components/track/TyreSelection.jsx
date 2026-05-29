import React from 'react';
import { motion, useInView } from 'framer-motion';

export const TyreSelection = ({ selectedTyres }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const compounds = [
    { id: 'C1', name: 'HARD', color: '#FFFFFF' },
    { id: 'C2', name: 'MEDIUM HARD', color: '#EEEEEE' },
    { id: 'C3', name: 'MEDIUM', color: '#FFD700' },
    { id: 'C4', name: 'SOFT', color: '#E8002D' },
    { id: 'C5', name: 'SUPERSOFT', color: '#FF1E4B' },
    { id: 'I', name: 'INTER', color: '#00AA44' },
    { id: 'W', name: 'WET', color: '#0080FF' }
  ];

  return (
    <div ref={ref} className="w-full mb-12">
      <span className="font-heading text-[10px] uppercase text-white/40 tracking-widest block mb-6">
        Tyre Selection for this Circuit
      </span>
      
      <div className="flex flex-row flex-wrap items-end gap-6 md:gap-8">
        {compounds.map((compound, i) => {
          const isSelected = selectedTyres?.includes(compound.id);
          // Standard size 64px, selected 68px
          const size = isSelected ? 68 : 64;
          
          return (
            <motion.div 
              key={compound.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className={`flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-25 grayscale'}`}
            >
              <div 
                className="relative flex items-center justify-center rounded-full border-[3px]"
                style={{ 
                  width: size, 
                  height: size, 
                  borderColor: compound.color,
                  boxShadow: isSelected ? `0 0 12px ${compound.color}66` : 'none',
                  backgroundColor: 'rgba(0,0,0,0.5)'
                }}
              >
                {/* Pirelli P Mock Icon */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[8px] h-[8px] opacity-80">
                  <svg viewBox="0 0 24 24" fill="none" stroke={compound.color} strokeWidth="3">
                    <path d="M6 2h8a6 6 0 0 1 0 12H6z M6 2v20" />
                  </svg>
                </div>
                
                {/* Center Ring (for hard/soft visual cues - just generic styling here) */}
                <div className="w-[85%] h-[85%] rounded-full border-[1.5px]" style={{ borderColor: compound.color }} />
                
                <span 
                  className="absolute font-mono text-[16px] font-bold z-10"
                  style={{ color: compound.color }}
                >
                  {compound.id}
                </span>
              </div>
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">
                {compound.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
