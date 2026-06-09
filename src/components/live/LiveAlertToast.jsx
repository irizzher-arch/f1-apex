import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveAlertToast = () => {
  const toasts = useStore(state => state.liveTiming.toasts);
  const removeToast = useStore(state => state.removeLiveToast);
  const addToast = useStore(state => state.addLiveToast);
  
  // Example listener: we can listen to trackStatus changes to spawn a toast
  const trackStatus = useStore(state => state.liveTiming.trackStatus);
  const prevTrackStatus = useRef(trackStatus);

  useEffect(() => {
    if (trackStatus !== prevTrackStatus.current) {
      if (trackStatus === 'red') {
        addToast({ type: 'red_flag', message: 'RED FLAG — SESSION SUSPENDED', persistent: true });
      } else if (trackStatus === 'sc') {
        addToast({ type: 'sc', message: 'SAFETY CAR DEPLOYED', duration: 10000 });
      } else if (trackStatus === 'vsc') {
        addToast({ type: 'vsc', message: 'VIRTUAL SAFETY CAR', duration: 10000 });
      } else if (trackStatus === 'green' && prevTrackStatus.current !== 'green') {
        addToast({ type: 'green', message: 'TRACK CLEAR', duration: 5000 });
      }
      prevTrackStatus.current = trackStatus;
    }
  }, [trackStatus, addToast]);

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let style = 'bg-[#050508]/90 border-white/20 text-white';
          if (toast.type === 'red_flag') style = 'bg-[#E8002D]/90 border-[#E8002D] text-white shadow-[0_0_20px_rgba(232,0,45,0.5)] animate-pulse-slow';
          if (toast.type === 'sc') style = 'bg-[#FF8700]/90 border-[#FF8700] text-white shadow-[0_0_20px_rgba(255,135,0,0.5)]';
          if (toast.type === 'vsc') style = 'bg-[#FFD700]/90 border-[#FFD700] text-black font-bold shadow-[0_0_20px_rgba(255,215,0,0.5)]';
          if (toast.type === 'green') style = 'bg-[#00C853]/90 border-[#00C853] text-white';

          // Auto remove logic
          useEffect(() => {
            if (!toast.persistent) {
              const id = setTimeout(() => removeToast(toast.id), toast.duration || 5000);
              return () => clearTimeout(id);
            }
          }, []);

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`backdrop-blur-xl border-l-4 rounded py-3 px-5 shadow-2xl pointer-events-auto flex items-center gap-3 min-w-[250px] ${style}`}
            >
               {toast.type === 'red_flag' && <svg className="w-5 h-5 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm1 16h-2v-2h2v2zm0-4h-2V9h2v5z"/></svg>}
               <span className="font-heading font-bold uppercase tracking-widest">{toast.message}</span>
               {!toast.persistent && (
                 <button onClick={() => removeToast(toast.id)} className="ml-auto opacity-50 hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
