import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErgast } from '@/hooks/useErgast';

export const HeroBanner = () => {
  const { fetchSchedule } = useErgast();
  const [nextRace, setNextRace] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    fetchSchedule('current').then(races => {
      const now = new Date();
      const upcoming = races.find(race => {
        const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
        return raceDate > now;
      });
      if (upcoming) setNextRace(upcoming);
    });
  }, [fetchSchedule]);

  useEffect(() => {
    if (!nextRace) return;
    const targetDate = new Date(`${nextRace.date}T${nextRace.time || '00:00:00Z'}`);

    const calcTime = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60)
        });
      }
    };
    calcTime();
    const timer = setInterval(calcTime, 1000);
    return () => clearInterval(timer);
  }, [nextRace]);

  return (
    <section className="relative w-[100vw] h-[100vh] overflow-hidden" role="banner">
      <style>{`
        @keyframes f1TvPulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* 1. Animated GIF Background (z-index: 0) */}
      <img 
        src="https://mir-s3-cdn-cf.behance.net/project_modules/source/7f67a5245443887.69ae60f0cc982.gif"
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, backgroundColor: '#000000' }}
        loading="eager"
        fetchpriority="high"
        aria-hidden="true"
        alt="Animated Formula 1 Background"
      />

      {/* 2. Dark Overlay Gradients (z-index: 1) */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%),
            linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 50%),
            linear-gradient(to top, #000000 0%, transparent 35%)
          `
        }}
      />

      {/* 4. Next Race Countdown Widget (z-index: 10) */}
      <motion.div 
        className="relative md:absolute bottom-[20px] md:bottom-[40px] left-[20px] md:left-[40px] z-[10] w-[calc(100%-40px)] md:w-[310px] rounded-[24px] p-5 flex flex-col mx-auto md:mx-0 mt-[80vh] md:mt-0"
        style={{ 
          background: 'rgba(255,255,255,0.03)', 
          backdropFilter: 'blur(30px) saturate(1.8)', 
          WebkitBackdropFilter: 'blur(30px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          transform: 'translateZ(0)'
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase tracking-wide text-white/50 font-semibold">Next Race</span>
          <div className="w-2 h-2 rounded-full bg-[#E8002D]" style={{ animation: 'f1TvPulse 1.8s infinite' }} />
        </div>
        <div>
          <h2 className="text-[26px] font-[800] text-white leading-tight font-heading truncate drop-shadow-md">
            {nextRace ? nextRace.raceName : 'TBA'}
          </h2>
          <p className="text-[12px] text-white/60 mt-1 font-mono font-medium shadow-black">
            {nextRace ? `${nextRace.Circuit.Location.locality}, ${nextRace.Circuit.Location.country}` : 'Loading...'}
          </p>
        </div>
        
        <div className="h-[1px] w-full bg-white/[0.15] my-[12px]" />

        <div className="flex w-full justify-between">
          <div className="flex flex-col items-center w-1/3">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.days} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.days).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">DAYS</span>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.hours} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.hours).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">HOURS</span>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.mins} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.mins).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">MINS</span>
          </div>
        </div>
      </motion.div>

      {/* 5. Telemetry / Track Status Card (z-index: 10) */}
      <motion.div
        className="relative md:absolute bottom-[20px] md:bottom-[40px] right-[20px] md:right-[40px] z-[10] w-[calc(100%-40px)] md:w-[330px] rounded-[24px] p-[16px] flex items-center gap-[14px] mx-auto md:mx-0 mt-4 md:mt-0"
        style={{ 
          background: 'rgba(255,255,255,0.03)', 
          backdropFilter: 'blur(30px) saturate(1.8)', 
          WebkitBackdropFilter: 'blur(30px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          transform: 'translateZ(0)'
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-[78px] h-[78px] rounded-[10px] bg-black/50 border border-white/10 flex flex-col items-center justify-center shrink-0">
          <span className="text-[28px] font-[800] text-[#E8002D] font-mono leading-none">32°</span>
          <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Track</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#E8002D] font-[700] mb-[5px]">LIVE TELEMETRY</span>
          <div className="flex justify-between items-center w-full mb-1">
             <span className="text-[12px] font-mono text-white/70">Air Temp</span>
             <span className="text-[12px] font-mono text-white font-bold">24°C</span>
          </div>
          <div className="flex justify-between items-center w-full mb-1">
             <span className="text-[12px] font-mono text-white/70">Humidity</span>
             <span className="text-[12px] font-mono text-white font-bold">42%</span>
          </div>
          <div className="flex justify-between items-center w-full">
             <span className="text-[12px] font-mono text-white/70">Wind</span>
             <span className="text-[12px] font-mono text-white font-bold">12 km/h</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
