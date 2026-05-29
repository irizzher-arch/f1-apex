import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const LegalHeroBanner = ({ pageName, titleWord1, titleWord2, sections }) => {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full h-[320px] bg-[#000000] overflow-hidden flex flex-col justify-end border-b border-f1-red/40 shrink-0">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} 
      />

      {/* Diagonal Red Slashes */}
      <motion.div 
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 -translate-y-1/2 w-[4px] h-[180%] bg-f1-red md:left-[18%] left-[92%] -rotate-12 transform origin-center z-0"
      />
      <motion.div 
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute top-1/2 -translate-y-1/2 w-[1.5px] h-[180%] bg-f1-red/35 md:left-[20%] left-[95%] -rotate-12 transform origin-center z-0"
      />

      {/* Hexagonal Grid SVG Pattern (Top Right) */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.07] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 10v20L20 40 0 30V10z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom left, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom left, black 0%, transparent 100%)'
        }}
      />

      <div className="relative z-10 w-full md:px-[80px] px-[24px] pb-[16px] mx-auto max-w-7xl">
        {/* Row 1: Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[11px] text-white/35 uppercase tracking-[0.2em]">APEX</span>
          <ChevronRight size={12} className="text-f1-red" />
          <span className="font-mono text-[11px] text-white/35 uppercase tracking-[0.2em]">{pageName}</span>
        </div>

        {/* Row 2: Page Title */}
        <h1 className="font-heading font-[800] md:text-[72px] text-[38px] uppercase tracking-[-0.01em] leading-none mb-6">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-white inline-block mr-3"
          >
            {titleWord1}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.03 }}
            className="text-f1-red inline-block"
          >
            {titleWord2}
          </motion.span>
        </h1>

        {/* Row 3: Meta Strip */}
        <div className="flex flex-row flex-wrap gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-mono text-[11px] text-white bg-white/5 border border-white/10 rounded-full px-[14px] py-[5px]">
            LAST UPDATED: NOV 2025
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="font-mono text-[11px] text-white bg-white/5 border border-white/10 rounded-full px-[14px] py-[5px]">
            VERSION 1.0
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className="font-mono text-[11px] text-f1-red/90 bg-white/5 border border-f1-red/40 rounded-full px-[14px] py-[5px]">
            UNOFFICIAL FAN PROJECT
          </motion.div>
        </div>

        {/* Row 4: TOC Teaser */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => handleScrollTo(section.id)}
              className="text-[11px] uppercase tracking-wide text-white/50 bg-transparent border-b border-white/15 py-[6px] mr-[24px] hover:text-f1-red hover:border-f1-red transition-all duration-200 outline-none"
            >
              {String(idx + 1).padStart(2, '0')}. {section.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
