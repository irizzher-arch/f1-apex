import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch09DRS = () => {
  const [drsOpen, setDrsOpen] = useState(false);

  return (
    <ChapterWrapper
      id="ch09"
      num="09"
      title="DRS SYSTEM"
      hook="DRS is F1's built-in overtaking aid — controversial, powerful, and visually spectacular."
    >
      {/* BLOCK A — WHAT IS DRS? (Toggle Animation) */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 md:p-10 text-center shadow-xl mb-6">
        <h3 className="font-heading text-2xl font-black text-white uppercase tracking-widest mb-2">Drag Reduction System</h3>
        <p className="font-inter text-sm text-white/50 mb-10 max-w-xl mx-auto">
          When activated, a flap on the rear wing opens, dumping aerodynamic drag and instantly increasing top speed by 10-15 km/h on straights.
        </p>

        {/* CSS Wing Illustration */}
        <div className="relative w-full max-w-sm mx-auto h-[160px] flex justify-center items-center mb-8">
          {/* Main Wing Profile (Side View) */}
          <div className="relative w-48 h-32">
            {/* Endplate */}
            <div className="absolute top-0 bottom-0 left-0 w-4 bg-[#222] rounded-l-xl border border-white/10 z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]" />
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-[#222] rounded-r-xl border border-white/10 z-20" />
            
            {/* Main Plane (Fixed) */}
            <div className="absolute bottom-4 left-4 right-4 h-6 bg-gradient-to-b from-[#444] to-[#111] rounded-full border border-white/10 z-10" />
            
            {/* DRS Flap (Movable) */}
            <motion.div 
              className="absolute top-4 left-4 right-4 h-6 bg-gradient-to-b from-f1-red to-[#600] border-t border-f1-red/50 z-10 origin-bottom-right"
              animate={{ 
                rotateX: drsOpen ? -70 : 0,
                translateY: drsOpen ? 6 : 0
              }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Flap details */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay" />
            </motion.div>

            {/* Airflow Lines */}
            <AnimatePresence>
              {!drsOpen ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-0 pointer-events-none"
                >
                  {/* High Drag Airflow */}
                  <motion.div 
                    className="absolute top-6 -left-16 w-32 h-1 bg-white/20 rounded-full blur-[1px]" 
                    animate={{ x: [0, 40], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}
                  />
                  <motion.div 
                    className="absolute top-8 -left-20 w-40 h-1 bg-white/20 rounded-full blur-[1px]" 
                    animate={{ x: [0, 50], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  />
                  <div className="absolute -right-24 top-0 text-[10px] font-mono text-f1-red font-bold tracking-widest bg-f1-red/10 px-2 py-1 rounded border border-f1-red/30">
                    HIGH DRAG<br/>SLOW STRAIGHT
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-0 pointer-events-none"
                >
                  {/* Low Drag Airflow passing straight through */}
                  <motion.div 
                    className="absolute top-5 -left-32 w-64 h-1 bg-[#00D2BE]/40 rounded-full blur-[1px]" 
                    animate={{ x: [0, 100], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                  <motion.div 
                    className="absolute top-10 -left-32 w-64 h-1 bg-[#00D2BE]/40 rounded-full blur-[1px]" 
                    animate={{ x: [0, 100], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                  />
                  <div className="absolute -right-24 top-0 text-[10px] font-mono text-[#00D2BE] font-bold tracking-widest bg-[#00D2BE]/10 px-2 py-1 rounded border border-[#00D2BE]/30">
                    LOW DRAG<br/>+15 KM/H SPEED
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={() => setDrsOpen(!drsOpen)}
          className={`px-10 py-4 rounded-full font-bold font-heading text-lg tracking-widest uppercase transition-all shadow-xl ${
            drsOpen 
              ? 'bg-[#00D2BE] text-black shadow-[0_0_30px_rgba(0,210,190,0.4)]' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {drsOpen ? 'CLOSE DRS' : 'OPEN DRS'}
        </button>
      </div>

      {/* BLOCK B — HOW DRS IS ACTIVATED */}
      <h4 className="font-heading text-xl font-bold uppercase text-white mt-8 mb-4 tracking-widest">How It Works</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { num: "01", title: "1 SECOND GAP", desc: "You must be less than 1.000s behind the car ahead." },
          { num: "02", title: "DETECTION LINE", desc: "The gap is measured at a specific 'Detection Point' on track." },
          { num: "03", title: "ACTIVATION ZONE", desc: "If you were within 1 second, you can press the DRS button in the designated zone." },
          { num: "04", title: "BRAKING", desc: "DRS automatically closes the moment the driver touches the brake pedal." }
        ].map((step, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 relative">
            <div className="font-mono text-[32px] font-black text-white/10 absolute top-2 right-4">{step.num}</div>
            <h5 className="font-heading text-md font-bold text-f1-red uppercase tracking-wider mb-2 relative z-10">{step.title}</h5>
            <p className="font-inter text-[13px] text-white/60 relative z-10">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* BLOCK C — DRS RULES & CONTROVERSY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConceptCard title="DRS RULES" borderColor="#FFFFFF">
          <ul className="font-inter text-sm text-white/70 space-y-3 mt-2 list-disc pl-4">
            <li><strong>Lap 2:</strong> DRS is disabled on lap 1 to allow the pack to sort itself out safely.</li>
            <li><strong>Wet Weather:</strong> Race Control disables DRS if the track is wet, as opening the wing in rain is too dangerous (lack of downforce).</li>
            <li><strong>Qualifying:</strong> Drivers can use DRS in the zones on every single flying lap to maximize top speed.</li>
          </ul>
        </ConceptCard>

        <ConceptCard title="THE DEBATE" borderColor="#FF8700" bgTint>
          <p className="font-inter text-[14px] text-white/80 leading-relaxed">
            DRS was introduced in 2011 to combat the "dirty air" problem—modern F1 cars generate so much turbulent wake that following closely is incredibly difficult. 
            <br/><br/>
            Some purists hate DRS, calling it "artificial overtaking" or "Mario Kart boosting." However, data shows that without DRS, overtaking at many circuits would be mathematically impossible. It remains a necessary evil in modern aerodynamics.
          </p>
        </ConceptCard>
      </div>

      <ChapterFooter 
        keyTakeaway="DRS is the ultimate overtaking weapon, but a clever defending driver will strategically ensure they cross the detection line just behind a lapped car to get DRS for themselves."
        nextChapterId="ch10"
        nextChapterTitle="PIT STOPS"
      />
    </ChapterWrapper>
  );
};
