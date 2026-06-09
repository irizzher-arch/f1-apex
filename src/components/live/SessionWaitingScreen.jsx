import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';
import { ReplaySelector } from './ReplaySelector';

export const SessionWaitingScreen = () => {
  const sessionMeta = useStore(state => state.liveTiming.sessionMeta);
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!sessionMeta?.date_start) return;
    const target = new Date(sessionMeta.date_start).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) return;

      setCountdown({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        s: Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sessionMeta?.date_start]);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-[#050508]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E8002D] to-transparent opacity-50" />
        
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
            <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="font-heading text-sm font-bold tracking-widest text-[#E8002D] mb-4 uppercase">Next Live Session</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=32,height=20,fit=crop,format=auto,dpr=1/flags/${getCountryFlagSlug(sessionMeta?.country_name || '')}-flag.png`}
              className="w-8 h-auto border border-white/20 rounded shadow-md"
              alt="Flag"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h1 className="font-heading font-black text-5xl text-white uppercase tracking-tight">
              {sessionMeta?.circuit_short_name || 'UNKNOWN EVENT'}
            </h1>
          </div>
          
          <div className="px-4 py-1.5 bg-white/10 border border-white/5 rounded-full text-sm font-bold uppercase tracking-wider text-white/80 mb-12">
            {sessionMeta?.session_name || 'SESSION'}
          </div>

          <div className="flex items-center gap-6">
            {Object.entries(countdown).map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-20 h-24 bg-[#0A0A0F] border border-white/10 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
                  <span className="font-mono text-4xl font-bold text-white">{value}</span>
                </div>
                <span className="mt-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">{
                  label === 'd' ? 'Days' : label === 'h' ? 'Hours' : label === 'm' ? 'Minutes' : 'Seconds'
                }</span>
              </div>
            ))}
          </div>

          {/* Replay Selector integration */}
          <ReplaySelector />
          
        </div>
      </motion.div>
    </div>
  );
};
