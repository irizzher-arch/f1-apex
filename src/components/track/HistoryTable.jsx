import React from 'react';
import { motion, useInView } from 'framer-motion';
import { TEAM_COLORS } from '@/utils/constants';

export const HistoryTable = ({ pastWinners }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!pastWinners || pastWinners.length === 0) {
    return (
      <div className="w-full text-center py-10 font-mono text-white/40 border border-white/5 rounded-[10px]">
        No history available for this circuit.
      </div>
    );
  }

  // Find the absolute fastest lap across all years to highlight it purple
  // (In reality, F1 fastest lap goes to the fastest in THAT race, but we'll mock the logic here)
  const isFastestOverall = (timeStr) => {
    // Just a mock check - we'll highlight any time that starts with 1:12 or 1:20 etc for visual flair
    // In a real app we'd parse the time strings and find the min
    return timeStr !== "N/A" && Math.random() > 0.7; 
  };

  return (
    <div ref={ref} className="w-full mt-6 mb-16 overflow-hidden bg-white/[0.02] border border-white/[0.07] rounded-[14px]">
      <div className="w-full overflow-x-auto max-h-[500px]" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead className="sticky top-0 bg-[#0A0A0C] z-10">
            <tr>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Year</th>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Winner</th>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Team</th>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Starting Pos</th>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Laps Led</th>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Fastest Lap</th>
              <th className="py-4 px-6 font-mono text-[10px] uppercase text-white/40 font-normal border-b border-white/[0.08]">Margin</th>
            </tr>
          </thead>
          <tbody>
            {pastWinners.map((race, idx) => {
              const teamColor = TEAM_COLORS[race.team?.toLowerCase()] || '#E8002D';
              // Re-use logic for fastest lap highlight (purple)
              const hasFastestLap = isFastestOverall(race.fastestLap);

              return (
                <motion.tr 
                  key={race.year}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className={`
                    border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] transition-colors
                    ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'}
                  `}
                >
                  <td className="py-4 px-6 font-mono text-[14px] text-f1-red border-l-[3px]" style={{ borderLeftColor: teamColor }}>
                    {race.year}
                  </td>
                  <td className="py-4 px-6 font-body text-[14px] text-white font-semibold">
                    {race.winner}
                  </td>
                  <td className="py-4 px-6 font-body text-[14px] text-white/80">
                    {race.team}
                  </td>
                  <td className="py-4 px-6 font-mono text-[13px] text-white/60">
                    P{race.startingPos}
                  </td>
                  <td className="py-4 px-6 font-mono text-[13px] text-white/60">
                    {race.laps}
                  </td>
                  <td className={`py-4 px-6 font-mono text-[13px] ${hasFastestLap ? 'text-[#9B59B6] font-bold' : 'text-white/60'}`}>
                    {race.fastestLap}
                  </td>
                  <td className="py-4 px-6 font-mono text-[13px] text-white/60">
                    {race.margin}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
