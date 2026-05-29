import React from 'react';
import { motion, useInView } from 'framer-motion';

export const SessionTimeline = ({ schedule }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!schedule) return null;

  // Derive mock session dates/times based on schedule date
  // Since Ergast doesn't provide precise times for all historical sessions, we'll mock them
  const raceDate = new Date(`${schedule.date}T${schedule.time || '15:00:00Z'}`);
  const qualiDate = new Date(raceDate); qualiDate.setDate(qualiDate.getDate() - 1); qualiDate.setHours(qualiDate.getHours() + 1);
  const fp3Date = new Date(qualiDate); fp3Date.setHours(qualiDate.getHours() - 3);
  const fp2Date = new Date(raceDate); fp2Date.setDate(fp2Date.getDate() - 2); fp2Date.setHours(fp2Date.getHours() + 2);
  const fp1Date = new Date(fp2Date); fp1Date.setHours(fp2Date.getHours() - 3);

  const sessions = [
    { id: 'fp1', name: 'FREE PRACTICE 1', date: fp1Date },
    { id: 'fp2', name: 'FREE PRACTICE 2', date: fp2Date },
    { id: 'fp3', name: 'FREE PRACTICE 3', date: fp3Date },
    { id: 'quali', name: 'QUALIFYING', date: qualiDate },
    { id: 'race', name: 'RACE', date: raceDate }
  ];

  const now = new Date();

  return (
    <div ref={ref} className="w-full mt-8 mb-16 relative">
      <div className="absolute top-[60px] left-0 w-full h-[1px] border-t border-dashed border-white/10 z-0 hidden md:block" />
      
      <div className="flex flex-row overflow-x-auto gap-4 md:gap-6 pb-6 pt-4 px-2 w-full snap-x" style={{ WebkitOverflowScrolling: 'touch' }}>
        {sessions.map((session, i) => {
          
          // Determine status
          const sessionEnd = new Date(session.date);
          sessionEnd.setHours(sessionEnd.getHours() + 1.5); // approximate session length
          
          let status = 'UPCOMING';
          if (now > sessionEnd) status = 'COMPLETED';
          else if (now >= session.date && now <= sessionEnd) status = 'LIVE';

          const isActive = status === 'LIVE' || (status === 'UPCOMING' && (i === 0 || now > sessions[i-1].date));

          return (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className={`
                relative z-10 flex flex-col bg-[#050508] border rounded-[12px] p-5 shrink-0 w-[240px] snap-center transition-all duration-300
                ${isActive 
                  ? 'border-f1-red/40 scale-[1.02] shadow-[0_0_20px_rgba(232,0,45,0.15)]' 
                  : 'border-white/[0.08] hover:border-white/20'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-heading text-[10px] text-f1-red uppercase tracking-widest">
                  {session.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                
                {status === 'UPCOMING' && (
                  <span className="bg-white/[0.06] text-white/50 px-2 py-[2px] rounded-[4px] font-mono text-[9px] uppercase tracking-wider">
                    Upcoming
                  </span>
                )}
                {status === 'LIVE' && (
                  <span className="bg-f1-red/15 text-f1-red px-2 py-[2px] rounded-[4px] font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-f1-red" /> LIVE
                  </span>
                )}
                {status === 'COMPLETED' && (
                  <span className="bg-[#00D2BE]/10 text-[#00D2BE] px-2 py-[2px] rounded-[4px] font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                    ✓ Completed
                  </span>
                )}
              </div>

              <h4 className="font-heading font-bold text-[13px] text-white uppercase mb-2 line-clamp-1">
                {session.name}
              </h4>
              
              <div className="flex items-end gap-2 mt-auto">
                <span className="font-mono text-[16px] text-white">
                  {session.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-mono text-[9px] text-white/40 mb-1">LOCAL TIME</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
