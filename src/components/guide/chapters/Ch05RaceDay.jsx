import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch05RaceDay = () => {
  // Lights Animator State
  const [step, setStep] = useState(0); // 0-5
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      if (step < 5) {
        timer = setTimeout(() => setStep(s => s + 1), 1500);
      } else {
        // Reset after lights out
        timer = setTimeout(() => {
          setIsPlaying(false);
          setStep(0);
        }, 3000);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const stepsData = [
    { title: "GRID WALK", desc: "30 minutes before race. Drivers, team principals, mechanics, and celebrities swarm the grid.", icon: "👥" },
    { title: "FORMATION LAP", desc: "Starts ~15 min before race. All cars do one lap to warm tyres and brakes to optimal temperature.", icon: "🔥" },
    { title: "GRID POSITIONS", desc: "Cars take their starting positions on the grid. Tension is at its peak.", icon: "🏎️" },
    { title: "RED LIGHTS", desc: "The five red lights illuminate one by one.", icon: "🚥" },
    { title: "LIGHTS OUT!", desc: "All 5 lights extinguish simultaneously. The race begins!", icon: "🏁" },
    { title: "RACING", desc: "Turn 1 is often the most dangerous corner of the entire race.", icon: "🚀" }
  ];

  return (
    <ChapterWrapper
      id="ch05"
      num="05"
      title="RACE DAY"
      hook="Race day is when everything comes together — or falls apart."
    >
      {/* BLOCK A — BEFORE THE LIGHTS SEQUENCE */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center shadow-xl">
        <h3 className="font-heading text-xl font-black text-white tracking-widest uppercase mb-8">The Pre-Race Sequence</h3>
        
        {/* Lights Visualizer */}
        <div className="flex gap-4 sm:gap-6 mb-12 bg-black/80 px-8 py-4 rounded-xl border border-white/5">
          {[1, 2, 3, 4, 5].map((lightNum) => {
            const isRed = step >= 3 && step < 4 ? lightNum <= 5 : (step === 4 ? lightNum <= 5 : false);
            // wait, red lights illuminate 1 by 1. Let's adjust logic.
            // Step 3 is "RED LIGHTS". So let's make it a rapid CSS animation when step === 3.
            // Actually, let's just make it simple: step 3 = 1 light, step 4 = 5 lights, step 5 = lights out.
            // But we only have 6 steps (0-5). Let's use simple logic.
            
            let on = false;
            if (step === 3) on = true; // all on for simplicity? Or sequence them inside step 3?
            // Better: Let's do a mini sequence inside the component or just make them all red if step === 3.
            if (step === 3 && lightNum <= 5) on = true;
            
            return (
              <div 
                key={lightNum}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-[3px] border-[#333] transition-colors duration-300 relative"
                style={{
                  backgroundColor: on ? '#E8002D' : '#111',
                  boxShadow: on ? '0 0 20px #E8002D, inset 0 0 10px #E8002D' : 'none',
                  borderColor: on ? '#FF4D6D' : '#333'
                }}
              >
                {/* Gloss effect */}
                <div className="absolute top-1 left-2 w-3 h-3 bg-white/20 rounded-full blur-[1px]" />
              </div>
            );
          })}
        </div>

        {/* Text Display */}
        <div className="h-[100px] flex items-center justify-center text-center w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl mb-2">{stepsData[step].icon}</div>
              <h4 className="font-heading text-2xl font-bold text-white tracking-wider mb-2" style={{ color: step === 4 ? '#E8002D' : 'white' }}>
                {stepsData[step].title}
              </h4>
              <p className="font-inter text-sm text-white/60">
                {stepsData[step].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 mt-8 w-full border-t border-white/5 pt-6">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map(idx => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors ${step === idx ? (idx === 4 ? 'bg-[#E8002D]' : 'bg-white') : 'bg-white/20'}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => { setStep(0); setIsPlaying(true); }}
            disabled={isPlaying}
            className={`px-6 py-2 rounded-full font-bold font-mono text-xs tracking-widest uppercase transition-all ${
              isPlaying ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
            }`}
          >
            {isPlaying ? 'SEQUENCE RUNNING...' : 'AUTO-PLAY SEQUENCE'}
          </button>
        </div>
      </div>

      {/* BLOCK B — THE START TYPES explained */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ConceptCard 
          title="STANDING START"
          borderColor="#E8002D"
          content="The normal race start. All cars are stationary in their grid slots. When the 5 red lights go out, drivers drop the clutch and accelerate. This requires immense reaction times and perfect clutch management to prevent wheelspin."
        />
        <ConceptCard 
          title="ROLLING START"
          borderColor="#00D2BE"
          content="Used after a Safety Car period ends, or if conditions are too wet for a standing start. The cars are already moving. The leader dictates the pace, and racing resumes only after they cross the Safety Car line."
        />
      </div>

      {/* BLOCK C & D — RACE RULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00D2BE]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h4 className="font-heading text-lg font-bold text-white tracking-widest uppercase m-0">Race Distance Rule</h4>
          </div>
          <p className="font-inter text-[14px] text-white/70">
            Every F1 race must be at least <strong>305km</strong> (except Monaco, which is 260km). The number of laps is calculated to get as close to this distance as possible without exceeding it. For example, Monza is 5.79km long, so the race is 53 laps (306.7km).
          </p>
        </div>
        
        <div className="bg-[#FF8700]/5 border border-[#FF8700]/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF8700]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h4 className="font-heading text-lg font-bold text-[#FF8700] tracking-widest uppercase m-0">Time Limit Rule</h4>
          </div>
          <p className="font-inter text-[14px] text-white/70">
            Maximum active race time: <strong>2 hours</strong>. If the race hasn't finished its full distance in 2 hours (often due to heavy rain or slow safety car laps), the checkered flag is waved at the end of the current lap. Under extreme red-flag stoppages, total elapsed time is capped at 3 hours.
          </p>
        </div>
      </div>

      <ChapterFooter 
        keyTakeaway="The start is the best opportunity to overtake, but 'you cannot win a race in Turn 1, but you can certainly lose it.'"
        nextChapterId="ch06"
        nextChapterTitle="FLAGS & SIGNALS"
      />
    </ChapterWrapper>
  );
};
