import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export const CompletionScreen = ({ onClose }) => {
  const badgeRef = useRef(null);

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    
    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: '#000000',
        scale: 2
      });
      
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement('a');
      link.download = 'f1-super-license.jpg';
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Failed to generate badge:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 relative flex flex-col items-center shadow-[0_0_50px_rgba(232,0,45,0.2)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h3 className="font-heading text-2xl font-black text-white uppercase tracking-widest mb-6 text-center">
          Congratulations
        </h3>

        {/* The Badge (Target for html2canvas) */}
        <div 
          ref={badgeRef}
          className="w-full aspect-[3/4] bg-gradient-to-b from-[#111] to-black rounded-xl border-2 border-white/10 p-6 flex flex-col relative overflow-hidden shadow-inner mb-6"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] mix-blend-overlay opacity-30" />
          
          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4 relative z-10">
            <div>
              <div className="font-heading text-2xl font-black text-f1-red uppercase tracking-widest leading-none">APEX</div>
              <div className="font-mono text-[8px] text-white/50 tracking-widest mt-1">FAN DASHBOARD</div>
            </div>
            <div className="w-10 h-10 border border-[#00D2BE] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#00D2BE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <h4 className="font-heading text-3xl font-black text-white uppercase tracking-widest text-center leading-tight mb-2">
              CERTIFIED<br/>F1 EXPERT
            </h4>
            <div className="text-[10px] font-mono bg-white/10 text-white/70 px-3 py-1 rounded-full uppercase tracking-widest">
              SUPER LICENSE ISSUED
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end relative z-10">
            <div className="font-mono text-[9px] text-white/40">
              ISSUED: {new Date().toLocaleDateString()}<br/>
              STATUS: RACE READY
            </div>
            <div className="font-mono font-bold text-white/20 text-lg transform -rotate-12">
              APEX-94
            </div>
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-full font-bold font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          SAVE BADGE
        </button>
      </motion.div>
    </div>
  );
};
