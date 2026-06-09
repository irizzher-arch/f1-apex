import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

const VARIANTS = {
  A: { 
    id: 'A', 
    cssBg: '#0A0A0F', 
    accent: '#E8002D', 
    lanyard: '#E8002D', 
    isDark: true,
    gradient: 'radial-gradient(ellipse at 50% 110%, rgba(232,0,45,0.35) 0%, transparent 65%)'
  },
  B: { 
    id: 'B', 
    cssBg: '#E8002D', 
    accent: '#FFFFFF', 
    lanyard: '#C20026', 
    isDark: false,
    gradient: 'none'
  },
  C: { 
    id: 'C', 
    cssBg: '#0B1240', 
    accent: '#E8002D', 
    lanyard: '#1A2880', 
    isDark: true,
    gradient: 'linear-gradient(160deg, #0B1240 0%, #111B5E 100%)'
  }
};

export const CompletionCredential = ({ onClose }) => {
  const [variant, setVariant] = useState(VARIANTS.A);
  const [credNo, setCredNo] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0, mouseX: 50, mouseY: 50 });
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const cardRef = useRef(null);
  const fullWrapperRef = useRef(null);

  useEffect(() => {
    setCredNo(Math.floor(Math.random() * 9000 + 1000).toString());
    
    // Check mobile
    setIsMobile(window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window));

    // Confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.1 },
        colors: ['#E8002D', '#FFFFFF', '#FFD700', '#00D2BE', '#FF8700'],
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.1 },
        colors: ['#E8002D', '#FFFFFF', '#FFD700', '#00D2BE', '#FF8700'],
        disableForReducedMotion: true
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    setTimeout(() => {
      frame();
    }, 400);

    // Escape listener
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile || !fullWrapperRef.current) return;
    const rect = fullWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((x - centerX) / centerX) * 12; // max 12 deg
    const tiltY = ((y - centerY) / centerY) * -12; // inverted Y axis
    
    const mouseX = (x / rect.width) * 100;
    const mouseY = (y / rect.height) * 100;

    setTilt({ x: tiltX, y: tiltY, mouseX, mouseY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, mouseX: 50, mouseY: 50 });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `apex-f1-credential-${new Date().getFullYear()}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Failed to generate credential:", err);
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent("I just completed the APEX F1 Beginner's Guide and got my Race Ready credential 🏎️ #F1 #Formula1 #APEXF1");
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 400);
  };

  const textColor = variant.isDark ? '#FFFFFF' : '#000000';
  const subTextColor = variant.isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)';
  const borderCol = variant.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="F1 Race Ready Credential Card"
    >
      {/* Color Picker */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? -20 : 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="mb-8 flex flex-col items-center gap-3 z-20"
      >
        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Pick Your Pass</span>
        <div className="flex gap-4">
          {Object.values(VARIANTS).map(v => (
            <button
              key={v.id}
              onClick={() => setVariant(v)}
              className="w-6 h-6 rounded-full relative"
              style={{ backgroundColor: v.id === 'B' ? '#E8002D' : v.cssBg }}
            >
              {variant.id === v.id && (
                <div className="absolute -inset-[5px] border-2 border-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3D Wrapper */}
      <div 
        ref={fullWrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative perspective-[800px] flex flex-col items-center"
      >
        <motion.div
          initial={{ y: -120, rotateX: 15, opacity: 0 }}
          animate={{ y: isClosing ? -100 : 0, rotateX: isClosing ? 20 : 0, opacity: isClosing ? 0 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s linear',
            transformStyle: 'preserve-3d'
          }}
          className={`flex flex-col items-center ${isMobile ? 'scale-[0.85] origin-top' : ''}`}
        >
          {/* Lanyard Strap */}
          <div 
            className="w-[28px] h-[180px] absolute -top-[160px] z-0"
            style={{ 
              backgroundColor: variant.lanyard,
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 6px)',
              backgroundSize: '6px 6px',
              boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.3), inset -1px 0 0 rgba(0,0,0,0.3)',
              transform: `rotateZ(${tilt.x * 0.3}deg)`,
              transformOrigin: 'top center',
              transition: 'background-color 0.4s ease, transform 0.1s linear'
            }}
          />

          {/* Lanyard Clip */}
          <div className="w-[36px] h-[44px] absolute -top-[22px] z-20 rounded-md border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#111]">
             {/* F1 Speed Mark SVG */}
             <svg className="h-[18px] text-white/60" viewBox="0 0 54 36" fill="currentColor">
                <path d="M43.95 0H14.15l-3.23 9.47h29.8L43.95 0zm-8.8 9.47H5.35L2.12 18.95h29.8L35.15 9.47zm-8.8 9.48H0l-3.23 9.47h29.8L26.35 18.95z"/>
             </svg>
          </div>

          {/* Card Bezel + Inner Card */}
          <motion.div 
            initial={{ rotateZ: -3 }}
            animate={{ rotateZ: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[320px] h-[520px] rounded-[18px] bg-[#1a1a1a] shadow-[0_32px_80px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden z-10"
          >
            {/* Bezel inner highlight */}
            <div className="absolute inset-0 rounded-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] pointer-events-none" />
            
            {/* Clip Hole */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[14px] h-[8px] bg-black rounded-[4px] z-30" />

            {/* The Actual Downloadable Card */}
            <div 
              ref={cardRef}
              className="absolute inset-[6px] rounded-[14px] overflow-hidden flex flex-col"
              style={{ 
                backgroundColor: variant.cssBg,
                backgroundImage: variant.gradient,
                transition: 'background-color 0.4s ease, background-image 0.4s ease'
              }}
            >
              {/* Specular Highlight Overlay */}
              {!isMobile && (
                <div 
                  className="absolute inset-0 z-50 pointer-events-none rounded-inherit"
                  style={{ 
                    background: `radial-gradient(circle at ${tilt.mouseX}% ${tilt.mouseY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
                  }}
                />
              )}
              {isMobile && (
                <div className="absolute inset-0 z-50 pointer-events-none rounded-inherit bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent animate-[shine_6s_infinite_linear]" />
              )}

              {/* ZONE 1 - Header */}
              <div className="h-[90px] w-full px-4 pt-5 pb-3 flex justify-between relative border-b" style={{ borderColor: borderCol }}>
                <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: variant.accent }} />
                <div className="flex flex-col pt-2">
                  <div className="font-heading font-black text-2xl tracking-widest leading-none mb-1" style={{ color: textColor }}>APEX</div>
                  <div className="font-heading font-bold text-[8px] uppercase tracking-[0.15em]" style={{ color: textColor }}>F1 Beginners Guide</div>
                  <div className="font-heading font-bold text-[7px] uppercase tracking-[0.1em] mt-[1px]" style={{ color: subTextColor }}>World Championship</div>
                </div>
                <div className="flex flex-col items-end text-right border rounded-[4px] px-2 py-1 h-min mt-1" style={{ borderColor: borderCol }}>
                  <span className="font-sans font-[800] text-[9px] uppercase" style={{ color: textColor }}>APEX</span>
                  <span className="font-sans font-[700] text-[8px] uppercase" style={{ color: variant.isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>F1 GUIDE</span>
                  <span className="font-sans font-[600] text-[7px] uppercase mb-0.5" style={{ color: variant.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>COMPLETION</span>
                  <span className="font-sans font-[800] text-[9px]" style={{ color: textColor }}>{new Date().getFullYear()}</span>
                </div>
              </div>

              {/* ZONE 2 - Title */}
              <div className="h-[160px] w-full px-[18px] pt-5 flex flex-col z-10">
                <h1 
                  className="font-heading font-black text-[48px] leading-[1.05] tracking-[-0.01em] m-0"
                  style={{ color: textColor }}
                >
                  F1<br/>RACE<br/>READY
                </h1>
                <div className="w-[40px] h-[2px] mt-2" style={{ backgroundColor: variant.accent }} />
              </div>

              {/* ZONE 3 - Details */}
              <div className="h-[80px] w-full px-[18px] flex flex-col justify-center z-10">
                <div className="font-sans font-bold text-[11px]" style={{ color: textColor }}>
                  Credential No. {credNo}
                </div>
                <div className="font-sans font-medium text-[11px] mt-0.5" style={{ color: variant.isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)' }}>
                  For {new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                </div>
                <div className="font-sans text-[11px] mt-0.5" style={{ color: variant.isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)' }}>
                  Certified by APEX Dashboard
                </div>
              </div>

              {/* ZONE 4 - F1 Logo */}
              <div className="absolute top-[280px] left-0 w-full flex justify-center pointer-events-none z-0">
                <motion.div 
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: variant.isDark ? 0.85 : 0.7 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                  className="relative drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                   {/* Full F1 Logo SVG */}
                   <svg width="140" viewBox="0 0 160 40" fill={variant.isDark ? '#FFF' : '#000'} xmlns="http://www.w3.org/2000/svg">
                      <path d="M49.63 0H0L-5.32 15.6H25.8L18.42 38.6h17.14L49.63 0z"/>
                      <path d="M79.25 0H63.92L58.59 15.6h15.33L79.25 0z"/>
                      <path d="M91.88 0h-5.94l-5.33 15.6h5.94L91.88 0z"/>
                      <path d="M110.15 0H94.49L81.33 38.6h17.14L110.15 0z"/>
                      <path d="M129.28 0h-17.14l-5.33 15.6h17.14L129.28 0z"/>
                   </svg>
                   <span className="absolute -top-1 -right-3 text-[10px] font-sans font-bold" style={{ color: variant.isDark ? '#FFF' : '#000' }}>®</span>
                </motion.div>
              </div>

              {/* ZONE 5 - Disclaimer */}
              <div className="mt-auto h-[44px] w-full px-[18px] z-10 flex items-center">
                <p className="font-sans italic text-[8.5px] leading-[1.5] m-0" style={{ color: variant.isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)' }}>
                  This credential is non-transferable, valid for the holder only. Completion of the APEX F1 Beginner's Guide certifies basic Formula 1 knowledge.
                </p>
              </div>

              {/* ZONE 6 - Footer */}
              <div className="h-[44px] w-full bg-black/50 border-t flex items-center justify-between px-4 relative z-10" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="font-mono font-bold text-[11px] text-white uppercase">
                  {new Date().toLocaleDateString('en-GB', { month:'short', day:'2-digit' }).replace(' ', ' ')}
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-15">
                  <div className="w-[30px] h-[1px] bg-white transform rotate-[-45deg]" />
                  <div className="w-[30px] h-[1px] bg-white transform rotate-[-45deg]" />
                  <div className="w-[30px] h-[1px] bg-white transform rotate-[-45deg]" />
                </div>

                <div className="font-mono font-bold text-[11px] flex items-center gap-1 uppercase" style={{ color: variant.isDark ? variant.accent : '#FFF' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Certified
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="mt-7 flex gap-2.5 z-20">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 10 : 0 }}
          transition={{ delay: 1.0, duration: 0.3 }}
          onClick={handleDownload}
          className="bg-[#E8002D] text-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,0,45,0.5)] transition-all px-5 py-[11px] rounded-lg flex items-center gap-2 font-heading text-[12px] font-bold tracking-[0.1em] uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Pass
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 10 : 0 }}
          transition={{ delay: 1.08, duration: 0.3 }}
          onClick={handleShare}
          className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/50 transition-all px-5 py-[11px] rounded-lg flex items-center gap-2 font-heading text-[12px] font-bold tracking-[0.1em] uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z"/></svg>
          Share
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 10 : 0 }}
          transition={{ delay: 1.16, duration: 0.3 }}
          onClick={handleClose}
          className="bg-transparent text-white/40 hover:text-white/80 transition-colors px-4 py-[11px] rounded-lg flex items-center gap-1.5 font-heading text-[12px] font-bold tracking-[0.1em] uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Close
        </motion.button>
      </div>

      <style>{`
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};
