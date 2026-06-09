import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch11Points = () => {
  // Championship Math State
  const [driverA, setDriverA] = useState(330);
  const [driverB, setDriverB] = useState(280);
  const [racesLeft, setRacesLeft] = useState(3);

  const maxPointsAvailable = racesLeft * 26; // Ignoring sprints for simplicity in this basic calc
  const gap = driverA - driverB;
  const canWin = gap <= maxPointsAvailable;

  return (
    <ChapterWrapper
      id="ch11"
      num="11"
      title="POINTS SYSTEM"
      hook="25 points for a win, 1 for P10 — every single position matters."
    >
      {/* BLOCK A — THE POINTS TABLE VISUAL */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl mb-6">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-6 tracking-widest text-center">Grand Prix Points Distribution</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { p: 'P1', pts: 25, color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
            { p: 'P2', pts: 18, color: '#C0C0C0', bg: 'rgba(192,192,192,0.1)' },
            { p: 'P3', pts: 15, color: '#CD7F32', bg: 'rgba(205,127,50,0.1)' },
            { p: 'P4', pts: 12, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
            { p: 'P5', pts: 10, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
            { p: 'P6', pts: 8, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
            { p: 'P7', pts: 6, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
            { p: 'P8', pts: 4, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
            { p: 'P9', pts: 2, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
            { p: 'P10', pts: 1, color: '#FFFFFF', bg: 'rgba(255,255,255,0.05)' },
          ].map((pos, idx) => (
            <motion.div 
              key={pos.p}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center p-4 rounded-xl border border-white/10"
              style={{ backgroundColor: pos.bg, borderTop: `2px solid ${pos.color}` }}
            >
              <div className="font-heading text-lg font-bold" style={{ color: pos.color }}>{pos.p}</div>
              <div className="font-mono text-2xl font-black mt-1" style={{ color: pos.color }}>{pos.pts}</div>
            </motion.div>
          ))}
        </div>

        {/* P11-P20 Note */}
        <div className="text-center font-mono text-[11px] text-white/40 tracking-widest mb-8 border-b border-white/10 pb-8">
          P11 THROUGH P20 SCORE 0 POINTS
        </div>

        {/* Fastest Lap Bonus */}
        <div className="flex items-start md:items-center gap-4 bg-[#9B59B6]/10 border border-[#9B59B6]/30 p-4 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-[#9B59B6] shrink-0 flex items-center justify-center text-black font-bold font-mono text-xs">FL</div>
          <div>
            <div className="font-heading font-bold text-[#9B59B6] tracking-widest uppercase mb-1">FASTEST LAP BONUS: +1 POINT</div>
            <div className="font-inter text-[13px] text-white/70">Awarded to the driver who sets the fastest lap of the race, <strong className="text-white">BUT only if they finish in the top 10.</strong></div>
          </div>
        </div>
      </div>

      {/* BLOCK B — TOTAL AVAILABLE POINTS CARD */}
      <div className="bg-white/[0.03] border-y border-r border-white/[0.07] border-l-4 border-[#00D2BE] rounded-lg p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00D2BE] opacity-5 pointer-events-none" />
        <h4 className="font-heading text-lg font-bold uppercase text-[#00D2BE] tracking-widest mb-4">The Maximum Math</h4>
        <div className="font-mono text-sm space-y-3">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/60">Max Points Per Standard Race</span>
            <span className="text-white font-bold">26 (25 + 1)</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-white/60">Max Points Per Sprint Race</span>
            <span className="text-white font-bold">8</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-white/60">Max Points Per Season (24 Races)</span>
            <span className="text-[#00D2BE] font-bold text-xl">~672</span>
          </div>
        </div>
      </div>

      {/* BLOCK C — CHAMPIONSHIP MATH INTERACTIVE */}
      <div className="bg-black border border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#FF8700]/10 text-[#FF8700] font-bold font-mono text-[10px] px-3 py-1 rounded-bl-xl border-b border-l border-[#FF8700]/30">INTERACTIVE</div>
        
        <h4 className="font-heading text-xl font-bold text-white uppercase tracking-widest mb-6">Championship Calculator</h4>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between font-mono text-xs text-white/70 mb-2">
              <span>DRIVER A (Leader) Points</span>
              <span className="text-white font-bold">{driverA}</span>
            </div>
            <input 
              type="range" min="0" max="600" value={driverA} 
              onChange={(e) => setDriverA(parseInt(e.target.value))}
              className="w-full accent-[#00D2BE]" 
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs text-white/70 mb-2">
              <span>DRIVER B (Challenger) Points</span>
              <span className="text-white font-bold">{driverB}</span>
            </div>
            <input 
              type="range" min="0" max="600" value={driverB} 
              onChange={(e) => setDriverB(parseInt(e.target.value))}
              className="w-full accent-f1-red" 
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs text-white/70 mb-2">
              <span>RACES REMAINING</span>
              <span className="text-white font-bold">{racesLeft}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={racesLeft} 
              onChange={(e) => setRacesLeft(parseInt(e.target.value))}
              className="w-full accent-white" 
            />
          </div>
        </div>

        <div className={`mt-8 p-6 rounded-xl border ${driverA < driverB ? 'bg-white/5 border-white/10' : (canWin ? 'bg-[#00C853]/10 border-[#00C853]/30' : 'bg-[#E8002D]/10 border-[#E8002D]/30')}`}>
          {driverA < driverB ? (
            <div className="text-center font-mono font-bold text-white">DRIVER B IS LEADING</div>
          ) : (
            <div className="text-center">
              <div className="font-heading text-2xl font-black mb-2 uppercase tracking-widest" style={{ color: canWin ? '#00C853' : '#E8002D' }}>
                {canWin ? 'YES — THE FIGHT IS ON' : 'MATHEMATICALLY ELIMINATED'}
              </div>
              <div className="font-inter text-sm text-white/70">
                {canWin 
                  ? `Driver B is ${gap} points behind. With ${maxPointsAvailable} points still available, they can still win the championship.` 
                  : `Driver B is ${gap} points behind, but only ${maxPointsAvailable} points are left in the season. Driver A is the World Champion!`}
              </div>
            </div>
          )}
        </div>
      </div>

      <ChapterFooter 
        keyTakeaway="Consistency wins championships. A driver who finishes P2 every race will often beat a driver who wins 5 races but crashes out of 5 others."
        nextChapterId="ch12"
        nextChapterTitle="THE TEAMS & CARS"
      />
    </ChapterWrapper>
  );
};
