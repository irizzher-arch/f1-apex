import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch10PitStops = () => {
  const [activeRole, setActiveRole] = useState(null);

  const pitCrewRoles = [
    { id: 'fj', x: '50%', y: '10%', name: 'FRONT JACK', desc: 'Lifts the front of the car the moment it stops.' },
    { id: 'rj', x: '50%', y: '90%', name: 'REAR JACK', desc: 'Lifts the rear of the car.' },
    // Front Left
    { id: 'fl-g', x: '25%', y: '25%', name: 'FL GUN', desc: 'Operates the pneumatic wheel gun for Front Left tyre.' },
    { id: 'fl-o', x: '15%', y: '25%', name: 'FL TYRE OFF', desc: 'Removes the hot, used Front Left tyre.' },
    { id: 'fl-n', x: '35%', y: '15%', name: 'FL TYRE ON', desc: 'Fits the fresh Front Left tyre.' },
    // Front Right
    { id: 'fr-g', x: '75%', y: '25%', name: 'FR GUN', desc: 'Operates the wheel gun for Front Right tyre.' },
    { id: 'fr-o', x: '85%', y: '25%', name: 'FR TYRE OFF', desc: 'Removes the hot Front Right tyre.' },
    { id: 'fr-n', x: '65%', y: '15%', name: 'FR TYRE ON', desc: 'Fits the fresh Front Right tyre.' },
    // Rear Left
    { id: 'rl-g', x: '25%', y: '75%', name: 'RL GUN', desc: 'Operates the wheel gun for Rear Left tyre.' },
    { id: 'rl-o', x: '15%', y: '75%', name: 'RL TYRE OFF', desc: 'Removes the hot Rear Left tyre.' },
    { id: 'rl-n', x: '35%', y: '85%', name: 'RL TYRE ON', desc: 'Fits the fresh Rear Left tyre.' },
    // Rear Right
    { id: 'rr-g', x: '75%', y: '75%', name: 'RR GUN', desc: 'Operates the wheel gun for Rear Right tyre.' },
    { id: 'rr-o', x: '85%', y: '75%', name: 'RR TYRE OFF', desc: 'Removes the hot Rear Right tyre.' },
    { id: 'rr-n', x: '65%', y: '85%', name: 'RR TYRE ON', desc: 'Fits the fresh Rear Right tyre.' },
    // Others
    { id: 'fw-1', x: '30%', y: '5%', name: 'FRONT WING ADJ', desc: 'Adjusts front wing flap angle (if requested).' },
    { id: 'fw-2', x: '70%', y: '5%', name: 'FRONT WING ADJ', desc: 'Adjusts front wing flap angle (if requested).' },
    { id: 'lol', x: '80%', y: '50%', name: 'LOLLIPOP/TRAFFIC', desc: 'Monitors pit lane traffic and releases the car.' },
    { id: 'fire', x: '20%', y: '50%', name: 'FIRE EXTINGUISHER', desc: 'Standing by for safety in case of fire.' },
    { id: 'stb1', x: '90%', y: '10%', name: 'STABILIZER', desc: 'Holds the car steady while on the jacks.' },
    { id: 'stb2', x: '10%', y: '10%', name: 'STABILIZER', desc: 'Holds the car steady while on the jacks.' }
  ];

  return (
    <ChapterWrapper
      id="ch10"
      num="10"
      title="PIT STOPS"
      hook="A great pit stop takes under 2 seconds — it's the most intense 2 seconds in motorsport."
    >
      {/* BLOCK A — THE PIT STOP ANATOMY */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 lg:p-10 relative overflow-hidden shadow-xl mb-6">
        <h3 className="font-heading text-2xl font-black text-white uppercase tracking-widest mb-2 text-center">The 20-Person Ballet</h3>
        <p className="font-inter text-sm text-white/50 mb-8 text-center max-w-xl mx-auto">
          Hover or tap on the dots to explore the roles of the 20 mechanics involved in a standard pit stop.
        </p>

        <div className="relative w-full max-w-[400px] h-[500px] mx-auto border border-white/5 rounded-xl bg-white/[0.02] flex items-center justify-center">
          {/* Track/Pitbox guidelines */}
          <div className="absolute inset-0 border-x border-white/10 w-2/3 mx-auto" />
          <div className="absolute top-[20%] w-3/4 h-[2px] bg-white/20" />
          
          {/* F1 Car Top-Down Silhouette */}
          <div className="absolute w-16 h-64 bg-[#222] rounded-full border border-white/20 shadow-xl flex items-center justify-center z-0">
            <div className="w-10 h-16 bg-[#111] rounded-t-full absolute top-8" /> {/* Cockpit */}
            <div className="w-24 h-2 bg-[#E8002D] absolute top-2 rounded-full" /> {/* Front Wing */}
            <div className="w-20 h-4 bg-[#E8002D] absolute bottom-2 rounded-full" /> {/* Rear Wing */}
            {/* Wheels */}
            <div className="w-4 h-10 bg-[#111] absolute -left-5 top-10 rounded" />
            <div className="w-4 h-10 bg-[#111] absolute -right-5 top-10 rounded" />
            <div className="w-5 h-12 bg-[#111] absolute -left-6 bottom-10 rounded" />
            <div className="w-5 h-12 bg-[#111] absolute -right-6 bottom-10 rounded" />
          </div>

          {/* Crew Members (Dots) */}
          {pitCrewRoles.map((role) => (
            <div 
              key={role.id}
              className="absolute w-6 h-6 -ml-3 -mt-3 z-10 cursor-pointer"
              style={{ left: role.x, top: role.y }}
              onMouseEnter={() => setActiveRole(role)}
              onMouseLeave={() => setActiveRole(null)}
              onClick={() => setActiveRole(activeRole?.id === role.id ? null : role)}
            >
              <div className={`w-full h-full rounded-full transition-all flex items-center justify-center text-[8px] font-bold ${
                activeRole?.id === role.id 
                  ? 'bg-f1-red text-white scale-125 shadow-[0_0_15px_rgba(232,0,45,0.8)]' 
                  : 'bg-white text-black hover:bg-f1-red hover:text-white hover:scale-110 shadow-md'
              }`}>
                {role.name.charAt(0)}
              </div>
            </div>
          ))}

          {/* Tooltip Overlay */}
          <AnimatePresence>
            {activeRole && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-6 left-6 right-6 bg-black/90 border border-white/20 backdrop-blur-md p-4 rounded-xl z-20 shadow-2xl pointer-events-none"
              >
                <div className="font-heading font-bold text-f1-red tracking-widest uppercase mb-1">{activeRole.name}</div>
                <div className="font-inter text-sm text-white/80">{activeRole.desc}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BLOCK B — PIT STOP TIME RECORDS VISUAL */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 lg:p-8 mb-6">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-6">The Stopwatch</h4>
        
        <div className="flex flex-col gap-5 relative">
          <div className="flex items-center gap-4">
            <div className="w-24 shrink-0 font-mono text-[10px] text-white/50 tracking-widest">WORLD RECORD</div>
            <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden relative">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '18.2%' }} viewport={{ once: true }} transition={{ duration: 1 }} className="absolute top-0 bottom-0 left-0 bg-[#FFD700]" />
            </div>
            <div className="w-16 font-mono font-bold text-[#FFD700]">1.80s</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-24 shrink-0 font-mono text-[10px] text-white/50 tracking-widest">AVERAGE</div>
            <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden relative">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '25%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-0 bottom-0 left-0 bg-[#00D2BE]" />
            </div>
            <div className="w-16 font-mono font-bold text-[#00D2BE]">~2.5s</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 shrink-0 font-mono text-[10px] text-white/50 tracking-widest">SLOW (ISSUE)</div>
            <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden relative">
              <motion.div initial={{ width: 0 }} whileInView={{ width: '50%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="absolute top-0 bottom-0 left-0 bg-[#FF8700]" />
            </div>
            <div className="w-16 font-mono font-bold text-[#FF8700]">5.0s+</div>
          </div>
        </div>

        <p className="font-inter text-xs text-white/40 mt-6 pt-4 border-t border-white/5">
          *Time includes only the stationary phase: Car stopped → Tyres changed → Car released. It does NOT include the ~20 seconds lost driving down the pit lane at the speed limit.
        </p>
      </div>

      {/* BLOCK C — UNDERCUT vs OVERCUT EXPLAINER */}
      <h4 className="font-heading text-xl font-bold uppercase text-white mt-8 mb-4 tracking-widest">Pit Stop Strategies</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ConceptCard title="THE UNDERCUT" borderColor="#00C853" bgTint>
          <div className="font-inter text-[14px] text-white/70 space-y-2">
            <p><strong>Pit BEFORE your rival.</strong></p>
            <p>You lose track position temporarily, but you immediately gain speed from fresh tyres.</p>
            <p>If your pace increase on the fresh tyres is greater than the time spent in pit lane, when your rival finally pits, you will emerge AHEAD of them.</p>
            <p className="text-[#00C853] font-bold mt-2 text-xs uppercase tracking-widest">Most common overtake method</p>
          </div>
        </ConceptCard>

        <ConceptCard title="THE OVERCUT" borderColor="#FF8700" bgTint>
          <div className="font-inter text-[14px] text-white/70 space-y-2">
            <p><strong>Stay OUT when your rival pits.</strong></p>
            <p>You use the clean air to push hard on your older tyres. If your rival struggles to warm up their fresh hard tyres, you build a gap.</p>
            <p>Works best at tracks where tyre warm-up is difficult or overtaking is hard (like Monaco).</p>
            <p className="text-[#FF8700] font-bold mt-2 text-xs uppercase tracking-widest">Rare but spectacular</p>
          </div>
        </ConceptCard>
      </div>

      {/* BLOCK D — QUICK PIT STOP MATH CARD */}
      <div className="bg-black border border-white/20 rounded-xl p-6 font-mono">
        <div className="text-[10px] text-[#00D2BE] tracking-widest mb-4 font-bold">PIT STOP MATHEMATICS</div>
        <div className="space-y-4 text-sm text-white/80">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span>Time lost driving through pit lane:</span>
            <span className="font-bold text-f1-red">~22 seconds</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span>Pace advantage of new tyres:</span>
            <span className="font-bold text-[#00C853]">~1.5s per lap</span>
          </div>
          <div className="pt-2 text-xs text-white/50 leading-relaxed">
            <strong>THEREFORE:</strong> If you are 20 seconds ahead of P2, you CANNOT pit without losing the lead. You need at least a 22+ second gap to make a "free pit stop". Otherwise, you must rely on the pace advantage to pass them back on track.
          </div>
        </div>
      </div>

      <ChapterFooter 
        keyTakeaway="A pit stop is rarely just about changing worn tyres—it's the primary weapon used to leapfrog competitors without having to overtake them on track."
        nextChapterId="ch11"
        nextChapterTitle="POINTS SYSTEM"
      />
    </ChapterWrapper>
  );
};
