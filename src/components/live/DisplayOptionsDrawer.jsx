import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const DisplayOptionsDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const columnVis = useStore(state => state.liveTiming.columnVisibility);
  const setColumnVis = useStore(state => state.setLiveColumnVisibility);
  const compactMode = useStore(state => state.liveTiming.compactMode);
  const setCompactMode = useStore(state => state.setLiveCompactMode);
  const displayDelay = useStore(state => state.liveTiming.displayDelay);
  const setDisplayDelay = useStore(state => state.setLiveDisplayDelay);

  const columns = [
    { key: 'gap', label: 'GAP' },
    { key: 'interval', label: 'INTERVAL' },
    { key: 'lastLap', label: 'LAST LAP' },
    { key: 's1', label: 'SECTOR 1' },
    { key: 's2', label: 'SECTOR 2' },
    { key: 's3', label: 'SECTOR 3' },
    { key: 'tyre', label: 'TYRE' },
    { key: 'pits', label: 'PITS' },
    { key: 'speed', label: 'SPEED TRAP' },
    { key: 'drs', label: 'DRS' },
    { key: 'miniSectors', label: 'MINI SECTORS' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#E8002D] hover:bg-[#FF1E46] shadow-[0_0_15px_rgba(232,0,45,0.4)] flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-sm bg-[#050508] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-heading font-bold text-lg tracking-widest uppercase text-white">Display Options</h2>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                
                {/* Compact Mode */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Layout</h3>
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded bg-white/[0.02] hover:bg-white/[0.04] border border-white/5">
                    <span className="text-sm font-bold text-white">Compact Leaderboard</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${compactMode ? 'bg-[#E8002D]' : 'bg-white/20'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${compactMode ? 'left-[22px]' : 'left-[2px]'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={compactMode} onChange={() => setCompactMode(!compactMode)} />
                  </label>
                </div>

                {/* Columns */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center justify-between">
                    <span>Columns</span>
                    <span className="text-[9px] text-[#E8002D]">POS, CHANGE, DRIVER ARE FIXED</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {columns.map(col => (
                      <label key={col.key} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/[0.04]">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${columnVis[col.key] ? 'bg-[#E8002D] border-[#E8002D]' : 'bg-transparent border-white/30'}`}>
                          {columnVis[col.key] && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-xs font-bold text-white/80">{col.label}</span>
                        <input type="checkbox" className="hidden" checked={columnVis[col.key]} onChange={() => setColumnVis(col.key, !columnVis[col.key])} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delay Slider */}
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Broadcast Delay</h3>
                    <span className="font-mono text-[#E8002D] text-sm">{displayDelay}s</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Synchronise live timing data with your broadcast feed by adding an artificial delay. 
                  </p>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    step="1" 
                    value={displayDelay} 
                    onChange={(e) => setDisplayDelay(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none outline-none accent-[#E8002D]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-white/30">
                    <span>LIVE</span>
                    <span>60s DELAY</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
