import React, { useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const getCategoryIcon = (category, flag) => {
  switch (category) {
    case 'Flag':
      let color = 'text-white';
      if (flag === 'GREEN' || flag === 'CLEAR') color = 'text-[#00C853]';
      if (flag === 'YELLOW' || flag === 'DOUBLE YELLOW') color = 'text-[#FFD700]';
      if (flag === 'RED') color = 'text-[#E8002D]';
      if (flag === 'BLUE') color = 'text-[#0080FF]';
      return <svg className={`w-4 h-4 ${color}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4 2v20h2v-8h14l-2.5-4 2.5-4H6V2H4z"/></svg>;
    case 'SafetyCar':
      return <svg className="w-4 h-4 text-[#FF8700]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" /></svg>;
    case 'Drs':
      return <svg className="w-4 h-4 text-[#00D2BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18" /></svg>;
    case 'Incident':
      return <svg className="w-4 h-4 text-[#E8002D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    default:
      return <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
};

const getRowStyle = (msg) => {
  if (msg.message.includes('SAFETY CAR DEPLOYED') || msg.message.includes('VIRTUAL SAFETY CAR')) {
    return 'bg-[#FF8700]/10 border-l-[#FF8700] border-l-4 shadow-[inset_0_0_10px_rgba(255,135,0,0.2)] animate-pulse-slow';
  }
  if (msg.flag === 'RED') {
    return 'bg-[#E8002D]/10 border-l-[#E8002D] border-l-4 shadow-[inset_0_0_10px_rgba(232,0,45,0.2)] animate-pulse-slow';
  }
  if (msg.flag === 'GREEN' || msg.flag === 'CLEAR') return 'border-l-[#00C853] border-l-4 bg-white/[0.02]';
  if (msg.flag === 'YELLOW') return 'border-l-[#FFD700] border-l-4 bg-white/[0.02]';
  if (msg.category === 'Drs') return 'border-l-[#00D2BE] border-l-4 bg-white/[0.02]';
  if (msg.category === 'Incident' || msg.message.includes('PENALTY')) return 'border-l-[#E8002D] border-l-4 bg-white/[0.02]';
  
  return 'border-l-white/10 border-l-[1px] bg-white/[0.02]';
};

export const RaceControlFeed = () => {
  const messages = useStore(state => state.liveTiming.raceControl);
  const drivers = useStore(state => state.liveTiming.drivers);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="w-full h-[280px] bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs tracking-widest text-white/50">RACE CONTROL</h3>
        <div className="flex gap-2">
           <span className="text-[10px] uppercase font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded">ALL</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
        {messages.length === 0 ? (
           <div className="flex-1 flex items-center justify-center text-white/30 text-xs font-mono">NO MESSAGES</div>
        ) : (
          messages.map((msg, idx) => {
            const timeStr = new Date(msg.date).toLocaleTimeString([], { hour12: false });
            const driver = msg.driver_number ? drivers[msg.driver_number] : null;
            
            return (
              <motion.div 
                key={`${msg.date}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full p-2.5 rounded-r text-sm flex gap-3 ${getRowStyle(msg)}`}
              >
                <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                  {getCategoryIcon(msg.category, msg.flag)}
                  <span className="font-mono text-[9px] text-white/40">{timeStr}</span>
                </div>
                
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-white/90 leading-tight">
                    {msg.message}
                  </div>
                  
                  <div className="flex gap-2 items-center flex-wrap">
                    {msg.lap_number && (
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/60">LAP {msg.lap_number}</span>
                    )}
                    {msg.sector && (
                      <span className="px-1.5 py-0.5 rounded bg-[#FFD700]/20 text-[9px] font-mono text-[#FFD700]">SECTOR {msg.sector}</span>
                    )}
                    {driver && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: `#${driver.team_colour}40`, color: `#${driver.team_colour}` }}>
                        {driver.name_acronym}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
