import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';

export const LiveStatusBar = () => {
  const sessionMode = useStore(state => state.liveTiming.sessionMode);
  const sessionMeta = useStore(state => state.liveTiming.sessionMeta);
  const trackStatus = useStore(state => state.liveTiming.trackStatus);
  const drsEnabled = useStore(state => state.liveTiming.drsEnabled);
  const weather = useStore(state => state.liveTiming.weather);
  const totalLaps = useStore(state => state.liveTiming.totalLaps);
  const currentLap = useStore(state => state.liveTiming.currentLap);
  
  const [sessionClock, setSessionClock] = useState('00:00:00');

  useEffect(() => {
    if (!sessionMeta?.date_start) return;
    
    const start = new Date(sessionMeta.date_start);
    
    const updateClock = () => {
      const now = new Date();
      if (now < start) {
        setSessionClock('00:00:00');
        return;
      }
      
      const diffMs = now - start;
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      
      setSessionClock(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, [sessionMeta?.date_start]);

  if (!sessionMeta && sessionMode === 'waiting') {
    return null; // Will show Waiting Screen instead
  }

  const renderTrackStatus = () => {
    switch (trackStatus) {
      case 'red':
        return <div className="px-3 py-1 bg-[#E8002D]/20 border border-[#E8002D]/50 text-[#E8002D] text-[10px] font-bold tracking-wider rounded-full flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-[#E8002D]" />RED FLAG</div>;
      case 'sc':
        return <div className="px-3 py-1 bg-[#FF8700]/20 border border-[#FF8700]/50 text-[#FF8700] text-[10px] font-bold tracking-wider rounded-full flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-[#FF8700]" />SAFETY CAR</div>;
      case 'vsc':
        return <div className="px-3 py-1 bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] text-[10px] font-bold tracking-wider rounded-full flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-[#FFD700]" />VIRTUAL SC</div>;
      case 'yellow':
        return <div className="px-3 py-1 bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] text-[10px] font-bold tracking-wider rounded-full flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FFD700]" />YELLOW FLAG</div>;
      default:
        return <div className="px-3 py-1 bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853] text-[10px] font-bold tracking-wider rounded-full flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00C853]" />TRACK CLEAR</div>;
    }
  };

  return (
    <div className="w-full bg-[#050508]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      {sessionMode === 'live' && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E8002D] to-transparent animate-pulse opacity-50" />
      )}
      
      <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=24,height=15,fit=crop,format=auto,dpr=1/flags/${getCountryFlagSlug(sessionMeta?.country_name || '')}-flag.png`}
              className="w-6 h-auto border border-white/20 rounded-sm"
              alt="Flag"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h1 className="font-heading font-bold text-white uppercase text-lg tracking-wide">
              {sessionMeta?.circuit_short_name || 'UNKNOWN'}
            </h1>
          </div>
          
          <div className="h-4 w-px bg-white/20" />
          
          <div className="px-2.5 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white/80">
            {sessionMeta?.session_name || 'SESSION'}
          </div>
          
          <span className="font-mono text-xs text-white/40">RD {(sessionMeta?.meeting_key || 0).toString().slice(-2)}</span>
        </div>

        {/* Center: Session State */}
        <div className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {sessionMode === 'live' ? (
            <>
              <div className="flex items-center gap-2 text-[#E8002D] font-bold text-xs tracking-wider">
                <div className="w-2 h-2 rounded-full bg-[#E8002D] animate-ping" />
                LIVE
              </div>
              <div className="font-mono text-lg text-white font-bold tracking-widest w-[100px] text-center">
                {sessionClock}
              </div>
              {sessionMeta?.session_type === 'Race' && (
                <div className="font-mono text-xs text-white/60">
                  LAP <span className="text-white font-bold">{currentLap}</span> {totalLaps > 0 ? `/ ${totalLaps}` : ''}
                </div>
              )}
            </>
          ) : sessionMode === 'replay' ? (
            <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white/60">
                SESSION ENDED
              </div>
              <div className="font-mono text-xs text-white/40">FINAL RESULTS</div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white/60">
                WAITING
              </div>
            </div>
          )}
        </div>

        {/* Right: Track Status & Weather */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[10px] font-mono text-white/60 border-r border-white/10 pr-4">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              {weather ? `${weather.track_temperature}°C` : '--°C'}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              {weather ? `${weather.air_temperature}°C` : '--°C'}
            </span>
          </div>

          <div className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${drsEnabled ? 'bg-[#00D2BE]/10 border-[#00D2BE]/30 text-[#00D2BE]' : 'bg-white/5 border-white/10 text-white/40'}`}>
            DRS {drsEnabled ? 'ENABLED' : 'DISABLED'}
          </div>

          {renderTrackStatus()}
        </div>
      </div>
    </div>
  );
};
