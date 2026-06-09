import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioAudioPlayer } from './RadioAudioPlayer';

export const TeamRadioFeed = () => {
  const messages = useStore(state => state.liveTiming.teamRadio);
  const drivers = useStore(state => state.liveTiming.drivers);
  const [playingId, setPlayingId] = useState(null);

  // Fallback state if radio is empty
  if (!messages || messages.length === 0) {
    return (
      <div className="w-full h-[280px] bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </div>
        <h3 className="text-white font-bold mb-2">No Team Radio Available</h3>
        <p className="text-white/40 text-sm max-w-sm">
          Due to 2026 broadcasting restrictions, public access to live team radio feeds has been significantly reduced for this session.
        </p>
      </div>
    );
  }

  // Reverse chronological
  const displayMsgs = [...messages].reverse();

  return (
    <div className="w-full h-[280px] bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs tracking-widest text-white/50">TEAM RADIO FEED</h3>
        <div className="w-2 h-2 rounded-full bg-[#E8002D] animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-2">
        <AnimatePresence>
          {displayMsgs.map((msg, idx) => {
            const timeStr = new Date(msg.date).toLocaleTimeString([], { hour12: false });
            const driver = drivers[msg.driver_number];
            if (!driver) return null;
            const isPlaying = playingId === msg.date; // Use date as ID

            return (
              <motion.div 
                key={msg.date}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={driver.headshot_url || '/placeholder-driver.png'} 
                      alt={driver.name_acronym}
                      className="w-10 h-10 rounded-full border-2 object-cover object-top"
                      style={{ borderColor: `#${driver.team_colour}` }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white leading-tight">{driver.full_name}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wide">{driver.team_name}</span>
                      <span className="font-mono text-[9px] text-white/30 mt-0.5">{timeStr}</span>
                    </div>
                  </div>

                  {msg.recording_url && !isPlaying ? (
                    <button 
                      onClick={() => setPlayingId(msg.date)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <svg className="w-3 h-3 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  ) : !msg.recording_url ? (
                    <span className="text-white/20 font-mono text-sm">—</span>
                  ) : null}
                </div>

                {isPlaying && msg.recording_url && (
                  <RadioAudioPlayer 
                    src={msg.recording_url} 
                    onEnded={() => setPlayingId(null)}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
