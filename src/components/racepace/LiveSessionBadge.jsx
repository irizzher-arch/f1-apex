import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useOpenF1Session } from '@/hooks/useRacePaceQueries';
import { motion } from 'framer-motion';

export const LiveSessionBadge = () => {
  const { racePace, setRacePaceState } = useStore();
  const { year, round } = racePace;
  
  const { data: session } = useOpenF1Session(year, round);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (session) {
      // Very basic live check: session is recent and less than 3 hours old
      const sessionDate = new Date(session.date_start);
      const now = new Date();
      const diffHours = (now - sessionDate) / (1000 * 60 * 60);
      
      const liveStatus = diffHours >= 0 && diffHours <= 3; // roughly live
      setIsLive(liveStatus);
      setRacePaceState({ isLive: liveStatus });
    }
  }, [session, setRacePaceState]);

  if (!isLive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-f1-red/10 border border-f1-red/30 px-4 py-2 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(232,0,45,0.2)]">
      <motion.div 
        animate={{ opacity: [1, 0.4, 1] }} 
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2.5 h-2.5 rounded-full bg-f1-red shadow-[0_0_8px_#e8002d]" 
      />
      <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">LIVE POLLING ACTIVE</span>
    </div>
  );
};
