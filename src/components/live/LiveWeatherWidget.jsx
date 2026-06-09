import React from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveWeatherWidget = ({ className = '' }) => {
  const weather = useStore(state => state.liveTiming.weather);

  if (!weather) return null;

  const isRaining = weather.rainfall > 0;

  return (
    <div className={`w-[240px] bg-[#050508]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <AnimatePresence>
        {isRaining && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-[#00D2BE]/20 border-b border-[#00D2BE]/30 px-3 py-1.5 flex items-center justify-center gap-2"
          >
            <svg className="w-3 h-3 text-[#00D2BE]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>
            <span className="text-[#00D2BE] text-[9px] font-bold tracking-widest uppercase">Rain Detected</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 flex flex-col gap-4">
        {/* Temperatures */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Track</span>
            <span className="font-mono text-2xl font-bold text-white leading-none">{weather.track_temperature}<span className="text-sm text-white/40">°C</span></span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Air</span>
            <span className="font-mono text-2xl font-bold text-white leading-none">{weather.air_temperature}<span className="text-sm text-white/40">°C</span></span>
          </div>
        </div>

        {/* Other metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Wind Speed</span>
            <span className="font-mono text-sm text-white">{weather.wind_speed} <span className="text-[10px] text-white/40">m/s</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Wind Dir</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm text-white">{weather.wind_direction}°</span>
              <svg className="w-3 h-3 text-white/40" style={{ transform: `rotate(${weather.wind_direction}deg)` }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Humidity</span>
            <span className="font-mono text-sm text-white">{weather.humidity} <span className="text-[10px] text-white/40">%</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Pressure</span>
            <span className="font-mono text-sm text-white">{weather.pressure} <span className="text-[10px] text-white/40">mbar</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
