import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch07SafetyCar = () => {
  const [showSC, setShowSC] = useState(false);

  return (
    <ChapterWrapper
      id="ch07"
      num="07"
      title="SAFETY CAR & VSC"
      hook="The Safety Car can completely reshape a race — here's why it causes so much drama."
    >
      {/* BLOCK A — THREE NEUTRALISATION TYPES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SAFETY CAR */}
        <div className="bg-white/[0.03] border-y border-r border-white/[0.07] rounded-lg p-5 border-l-4 border-[#FF8700] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#FF8700] opacity-5 pointer-events-none" />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF8700] mb-3"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11H2v5h2m16 0a2 2 0 0 0-2 2 2 2 0 0 1-4 0 2 2 0 0 0-2-2m-6 0a2 2 0 0 0-2 2 2 2 0 0 1-4 0 2 2 0 0 0-2-2"/></svg>
          <h3 className="font-heading text-xl font-bold text-[#FF8700] uppercase tracking-widest mb-3">Safety Car</h3>
          <p className="font-inter text-[13px] text-white/70 mb-3">
            Triggered by serious incidents or debris. The SC exits the pit lane and leads the field at reduced pace. All cars bunch up behind it.
          </p>
          <div className="text-[11px] font-mono bg-[#FF8700]/20 text-[#FF8700] p-2 rounded">
            <strong>DRAMA:</strong> The gap between P1 and P2 is erased. Every SC period completely resets the race order.
          </div>
        </div>

        {/* VIRTUAL SAFETY CAR */}
        <div className="bg-white/[0.03] border-y border-r border-white/[0.07] rounded-lg p-5 border-l-4 border-[#FFD700] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#FFD700] opacity-5 pointer-events-none" />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFD700] mb-3"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <h3 className="font-heading text-xl font-bold text-[#FFD700] uppercase tracking-widest mb-3">Virtual Safety Car</h3>
          <p className="font-inter text-[13px] text-white/70 mb-3">
            Triggered by less serious incidents. NO physical car. A minimum lap time is enforced electronically. Drivers must slow down immediately.
          </p>
          <div className="text-[11px] font-mono bg-[#FFD700]/10 text-[#FFD700] p-2 rounded">
            <strong>DIFFERENCE:</strong> The VSC preserves the exact time gaps between cars. Less dramatic, more surgical.
          </div>
        </div>

        {/* RED FLAG */}
        <div className="bg-white/[0.03] border-y border-r border-white/[0.07] rounded-lg p-5 border-l-4 border-[#E8002D] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#E8002D] opacity-5 pointer-events-none" />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E8002D] mb-3 animate-pulse"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          <h3 className="font-heading text-xl font-bold text-[#E8002D] uppercase tracking-widest mb-3">Red Flag</h3>
          <p className="font-inter text-[13px] text-white/70 mb-3">
            Session suspended due to extreme danger. Cars return to the pit lane.
          </p>
          <div className="text-[11px] font-mono bg-[#E8002D]/20 text-[#E8002D] p-2 rounded shadow-[0_0_10px_rgba(232,0,45,0.4)]">
            <strong>STRATEGY WILDCARD:</strong> Teams can change tyres for FREE during the suspension, destroying all planned strategies.
          </div>
        </div>
      </div>

      {/* BLOCK B — SC STRATEGY IMPACT VISUAL */}
      <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-6 text-center">The Safety Car Effect</h4>
        
        <div className="relative h-20 mb-8 border-b border-white/20">
          {/* P1 Car */}
          <motion.div 
            className="absolute bottom-2 h-8 flex items-center gap-2"
            animate={{ left: showSC ? '80%' : '90%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <div className="w-12 h-6 bg-[#00D2BE] rounded-sm flex items-center justify-center text-[10px] font-bold text-black">P1</div>
          </motion.div>
          
          {/* P2 Car */}
          <motion.div 
            className="absolute bottom-2 h-8 flex items-center gap-2"
            animate={{ left: showSC ? '65%' : '10%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <div className="w-12 h-6 bg-f1-red rounded-sm flex items-center justify-center text-[10px] font-bold text-white">P2</div>
          </motion.div>

          {/* Gap Indicator */}
          <motion.div 
            className="absolute bottom-12 h-1 bg-white/30"
            initial={{ left: '15%', right: '15%' }}
            animate={{ 
              left: showSC ? '72%' : '15%', 
              right: showSC ? '15%' : '15%',
              opacity: showSC ? 0 : 1
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/70 whitespace-nowrap">
              15.0 SECOND GAP
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <p className="font-inter text-sm text-white/60 mb-6 h-10">
            {showSC 
              ? "The SC forces everyone to bunch up. P1's hard-earned 15-second lead is completely erased in an instant." 
              : "P1 has built a comfortable 15-second lead over P2 through 40 laps of hard racing."}
          </p>
          <button 
            onClick={() => setShowSC(!showSC)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2 rounded-full font-bold font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {showSC ? 'RESET RACE' : 'DEPLOY SAFETY CAR'}
          </button>
        </div>
      </div>

      {/* BLOCK C — "SAFETY CAR WINDOW" EXPLAINER */}
      <div className="mt-8">
        <ConceptCard 
          title="THE 'CHEAP' PIT STOP"
          borderColor="#00C853"
        >
          <p className="font-inter text-sm text-white/80 leading-relaxed">
            Normally, pitting costs you ~22 seconds compared to cars racing at full speed on track. 
            However, when a Safety Car is deployed, all cars on track must drive at a severely reduced speed. 
            Because they are driving so slowly, the time you lose by driving through the pit lane is cut in half (e.g., losing only 11 seconds). 
            <br/><br/>
            This is known as a <strong>"Cheap Pit Stop"</strong>. Pitting under the SC is the ultimate strategic gift—if you haven't pitted yet when the SC comes out, you gain a massive advantage over those who pitted under normal racing conditions.
          </p>
        </ConceptCard>
      </div>

      <ChapterFooter 
        keyTakeaway="A poorly timed Safety Car can ruin a perfect race, while a perfectly timed one can gift an unlikely victory."
        nextChapterId="ch08"
        nextChapterTitle="TYRE COMPOUNDS"
      />
    </ChapterWrapper>
  );
};
