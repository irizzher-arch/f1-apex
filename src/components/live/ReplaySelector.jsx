import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';

export const ReplaySelector = () => {
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const setLiveSession = useStore(state => state.setLiveSession);
  const resetLiveTimingState = useStore(state => state.resetLiveTimingState);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const year = new Date().getFullYear();
        const res = await fetch(`https://api.openf1.org/v1/sessions?year=${year}`);
        const data = await res.json();
        
        // Filter only past sessions
        const now = new Date();
        const past = data.filter(s => new Date(s.date_end) < now).reverse();
        setSessions(past);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [isOpen]);

  const handleSelect = (session) => {
    resetLiveTimingState();
    setLiveSession(session.session_key, 'playback', session);
    setIsOpen(false);
  };

  return (
    <div className="relative mt-8">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white font-heading font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-[#E8002D]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Watch Past Replays
        </button>
      ) : (
        <div className="w-full max-w-xl bg-[#0A0A0F] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <h3 className="font-heading font-bold text-[#E8002D] uppercase tracking-widest">Select Session to Replay</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            {isLoading ? (
              <div className="p-8 text-center text-white/40 font-mono text-sm">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-white/40 font-mono text-sm">No past sessions found.</div>
            ) : (
              sessions.map(s => (
                <button 
                  key={s.session_key}
                  onClick={() => handleSelect(s)}
                  className="w-full p-3 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-white/10 flex items-center justify-between group transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://cdn.formula1dashboard.com/cdn-cgi/image/width=32,height=20,fit=crop,format=auto,dpr=1/flags/${getCountryFlagSlug(s.country_name || '')}-flag.png`}
                      className="w-8 h-auto rounded border border-white/20"
                      alt=""
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-white uppercase text-sm tracking-wide">{s.circuit_short_name}</span>
                      <span className="font-mono text-[10px] text-white/50">{s.session_name} • {new Date(s.date_start).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-[#E8002D] translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
