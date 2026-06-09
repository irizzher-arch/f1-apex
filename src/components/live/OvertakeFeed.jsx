import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const OvertakeFeed = () => {
  const overtakes = useStore(state => state.liveTiming.overtakes);
  const drivers = useStore(state => state.liveTiming.drivers);
  const [activeToasts, setActiveToasts] = useState([]);

  // When a new overtake is added to the store, we pop it into the toast ticker
  useEffect(() => {
    if (!overtakes || overtakes.length === 0) return;
    
    // We only want to show toasts for new overtakes added in real time,
    // not dump the whole history. We can assume the last 1-3 added are new if they arrived together.
    // For simplicity, let's just take the last overtake if its date is very recent.
    const last = overtakes[overtakes.length - 1];
    
    // Safety check if it's new (within last 10 seconds)
    const isNew = (Date.now() - new Date(last.date).getTime()) < 10000;
    
    if (isNew) {
      setActiveToasts(prev => {
        // Prevent exact duplicates
        if (prev.find(t => t.date === last.date && t.driver_number_overtaking === last.driver_number_overtaking)) return prev;
        
        const newToast = { ...last, id: Date.now() + Math.random() };
        // Keep max 3
        return [...prev.slice(-2), newToast];
      });
    }
  }, [overtakes]);

  // Auto-dismiss
  useEffect(() => {
    if (activeToasts.length === 0) return;
    const timer = setTimeout(() => {
      setActiveToasts(prev => prev.slice(1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeToasts]);

  return (
    <div className="absolute top-0 right-4 flex flex-col gap-2 pointer-events-none z-50">
      <AnimatePresence>
        {activeToasts.map((toast) => {
          const overtaking = drivers[toast.driver_number_overtaking];
          const overtaken = drivers[toast.driver_number_overtaken];
          if (!overtaking || !overtaken) return null;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-[#050508]/90 backdrop-blur-xl border border-white/20 rounded-full py-1.5 px-3 flex items-center gap-3 shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `#${overtaking.team_colour}` }} />
                <span className="font-mono font-bold text-white text-[11px]">{overtaking.name_acronym}</span>
              </div>
              
              <svg className="w-3 h-3 text-[#E8002D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white/50 text-[11px]">{overtaken.name_acronym}</span>
                <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: `#${overtaken.team_colour}` }} />
              </div>
              
              {toast.lap_number && (
                <div className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[9px] text-white/50 ml-1">
                  L{toast.lap_number}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
