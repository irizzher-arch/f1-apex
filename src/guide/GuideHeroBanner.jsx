import React from 'react';
import { motion } from 'framer-motion';

export const GuideHeroBanner = () => {
  return (
    <div className="w-full h-[300px] relative overflow-hidden bg-black flex flex-col justify-center px-10 border-b border-f1-red/40">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0'
        }}
      />
      {/* Diagonal red slash blade element */}
      <div className="absolute -top-1/2 left-[60%] w-[1px] h-[200%] bg-white/5 transform rotate-[25deg] z-0" />
      <div className="absolute -top-1/2 left-[62%] w-[4px] h-[200%] bg-f1-red/20 transform rotate-[25deg] z-0" />
      <div className="absolute -top-1/2 left-[65%] w-[1px] h-[200%] bg-f1-red/10 transform rotate-[25deg] z-0" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative z-10 w-full">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="font-mono text-[11px] text-white/30 tracking-widest mb-1">
            APEX / LEARN F1
          </div>
          <h1 className="text-[64px] font-heading font-black leading-none uppercase text-white drop-shadow-md">
            YOUR F1<br/>
            <span className="text-f1-red">STARTER PACK</span>
          </h1>
          <p className="font-inter text-[16px] text-white/60 leading-[1.6] max-w-[520px] mt-2">
            Everything you need to watch, understand, and love Formula 1 from your very first race.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex flex-col gap-4 mt-8 lg:mt-0 items-end">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-end"
          >
            <div className="font-mono text-[28px] text-white font-bold leading-none">15</div>
            <div className="font-mono text-[10px] text-f1-red tracking-widest uppercase mt-1">CHAPTERS</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-end"
          >
            <div className="font-mono text-[28px] text-white font-bold leading-none">50+</div>
            <div className="font-mono text-[10px] text-[#00D2BE] tracking-widest uppercase mt-1">CONCEPTS</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-end"
          >
            <div className="font-mono text-[28px] text-white font-bold leading-none">1</div>
            <div className="font-mono text-[10px] text-[#FF8700] tracking-widest uppercase mt-1">SPORT TO RULE THEM ALL</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
