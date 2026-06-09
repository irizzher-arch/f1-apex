import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErgast } from '@/hooks/useErgast';

export const HeroBanner = () => {
  const { fetchSchedule } = useErgast();
  const [nextRace, setNextRace] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    fetchSchedule('current').then(races => {
      const now = new Date();
      let targetRace = null;
      let nextSessionDate = null;
      let nextSessionName = '';

      for (const race of races) {
        const sessionDates = [];
        
        if (race.FirstPractice) sessionDates.push({ name: 'Practice 1', date: new Date(`${race.FirstPractice.date}T${race.FirstPractice.time || '00:00:00Z'}`) });
        if (race.SecondPractice) sessionDates.push({ name: 'Practice 2', date: new Date(`${race.SecondPractice.date}T${race.SecondPractice.time || '00:00:00Z'}`) });
        if (race.ThirdPractice) sessionDates.push({ name: 'Practice 3', date: new Date(`${race.ThirdPractice.date}T${race.ThirdPractice.time || '00:00:00Z'}`) });
        if (race.SprintQualifying) sessionDates.push({ name: 'Sprint Shootout', date: new Date(`${race.SprintQualifying.date}T${race.SprintQualifying.time || '00:00:00Z'}`) });
        if (race.Sprint) sessionDates.push({ name: 'Sprint', date: new Date(`${race.Sprint.date}T${race.Sprint.time || '00:00:00Z'}`) });
        if (race.Qualifying) sessionDates.push({ name: 'Qualifying', date: new Date(`${race.Qualifying.date}T${race.Qualifying.time || '00:00:00Z'}`) });
        sessionDates.push({ name: 'Race', date: new Date(`${race.date}T${race.time || '00:00:00Z'}`) });

        sessionDates.sort((a, b) => a.date - b.date);
        
        const upcomingSession = sessionDates.find(s => s.date > now);
        if (upcomingSession) {
          targetRace = race;
          nextSessionDate = upcomingSession.date;
          nextSessionName = upcomingSession.name;
          break;
        }
      }

      if (targetRace) {
        setNextRace({ ...targetRace, nextSessionDate, nextSessionName });
      }
    });
  }, [fetchSchedule]);

  useEffect(() => {
    if (!nextRace || !nextRace.nextSessionDate) return;
    const targetDate = nextRace.nextSessionDate;

    const calcTime = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60),
          secs: Math.floor((diff / 1000) % 60)
        });
      }
    };
    calcTime();
    const timer = setInterval(calcTime, 1000);
    return () => clearInterval(timer);
  }, [nextRace]);

  useEffect(() => {
    if (!nextRace) return;
    const { lat, long } = nextRace.Circuit.Location;
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setTelemetry({
            airTemp: Math.round(data.current.temperature_2m),
            trackTemp: Math.round(data.current.temperature_2m + 8), // approximate track temp from air temp
            humidity: Math.round(data.current.relative_humidity_2m),
            wind: Math.round(data.current.wind_speed_10m)
          });
        }
      })
      .catch(console.error);
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
        className="relative md:absolute bottom-[20px] md:bottom-[40px] left-[20px] md:left-[40px] z-[10] w-[calc(100%-40px)] md:w-[380px] rounded-[24px] p-5 flex flex-col mx-auto md:mx-0 mt-[80vh] md:mt-0"
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
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wide text-white/50 font-semibold">UPCOMING SESSION</span>
            {nextRace && (
              <span className="px-2 py-0.5 rounded-[4px] bg-[#E8002D]/20 text-[#E8002D] text-[10px] uppercase font-[800] tracking-wider border border-[#E8002D]/30 shadow-[0_0_10px_rgba(232,0,45,0.2)]">
                {nextRace.nextSessionName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-bold">LIVE COUNTDOWN</span>
            <div className="w-2 h-2 rounded-full bg-[#E8002D]" style={{ animation: 'f1TvPulse 1.8s infinite' }} />
          </div>
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
          <div className="flex flex-col items-center w-1/4">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.days} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.days).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">DAYS</span>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.hours} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.hours).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">HOURS</span>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.mins} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.mins).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">MINS</span>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <AnimatePresence mode="popLayout">
              <motion.span key={timeLeft.secs} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className="text-[38px] font-[900] text-white font-mono leading-none drop-shadow-md">
                {String(timeLeft.secs).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-widest text-[#E8002D] font-[700] mt-1 drop-shadow-sm">SECS</span>
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
          <span className="text-[28px] font-[800] text-[#E8002D] font-mono leading-none">{telemetry ? telemetry.trackTemp : '--'}°</span>
          <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Track</span>
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#E8002D] font-[800] mb-[2px] truncate w-full" title={nextRace ? nextRace.Circuit.circuitName : ''}>
            {nextRace ? nextRace.Circuit.circuitName.toUpperCase() : 'TRACK CONDITIONS'}
          </span>
          <span className="text-[9px] uppercase tracking-[0.1em] text-white/40 font-[600] mb-[6px]">CURRENT WEATHER</span>
          
          <div className="flex justify-between items-center w-full mb-1">
             <span className="text-[12px] font-mono text-white/70">Air Temp</span>
             <span className="text-[12px] font-mono text-white font-bold">{telemetry ? telemetry.airTemp : '--'}°C</span>
          </div>
          <div className="flex justify-between items-center w-full mb-1">
             <span className="text-[12px] font-mono text-white/70">Humidity</span>
             <span className="text-[12px] font-mono text-white font-bold">{telemetry ? telemetry.humidity : '--'}%</span>
          </div>
          <div className="flex justify-between items-center w-full">
             <span className="text-[12px] font-mono text-white/70">Wind</span>
             <span className="text-[12px] font-mono text-white font-bold">{telemetry ? telemetry.wind : '--'} km/h</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
