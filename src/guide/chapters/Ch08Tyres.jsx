import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';
import { TyreCircle } from '../shared/TyreCircle';

export const Ch08Tyres = () => {
  // Quiz State
  const compounds = ['Hard', 'Medium', 'Soft', 'Inter', 'Wet'];
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const questions = [
    { target: 'Soft', options: ['Hard', 'Medium', 'Soft'], text: "Which dry compound provides the most grip but wears out the fastest?" },
    { target: 'Inter', options: ['Wet', 'Inter', 'Medium'], text: "Which compound is used for a damp or drying track?" },
    { target: 'Hard', options: ['Hard', 'C5', 'Soft'], text: "Which tyre is capable of running the longest stint (e.g. 40+ laps)?" },
    { target: 'C5', options: ['C1', 'C3', 'C5'], text: "Trick Question: In Pirelli's C1 to C5 range, which compound is the SOFTEST?" }
  ];

  const currentQ = questions[quizIdx];

  const handleGuess = (guess) => {
    if (feedback) return;
    const isCorrect = guess === currentQ.target;
    if (isCorrect) setScore(s => s + 1);
    
    setFeedback({
      correct: isCorrect,
      text: isCorrect ? 'Correct!' : `Wrong! It was ${currentQ.target}`
    });

    setTimeout(() => {
      if (quizIdx + 1 < questions.length) {
        setQuizIdx(i => i + 1);
        setFeedback(null);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  return (
    <ChapterWrapper
      id="ch08"
      num="08"
      title="TYRE COMPOUNDS"
      hook="The tyres are the most important variable in any race — everything is a tyre conversation."
    >
      {/* BLOCK A — THE COMPOUND SPECTRUM */}
      <div className="bg-black/50 border border-white/10 rounded-2xl p-8 mb-4 overflow-hidden">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-8 text-center tracking-widest">The Pirelli Compound Spectrum</h4>
        
        <div className="relative w-full max-w-3xl mx-auto mb-16 px-4">
          {/* Gradient Bar */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-white via-[#FFD700] to-[#E8002D] mb-8" />
          <div className="flex justify-between absolute top-4 left-4 right-4 text-[10px] font-mono font-bold text-white/50">
            <span>HARDEST (SLOW/DURABLE)</span>
            <span>SOFTEST (FAST/FRAGILE)</span>
          </div>

          <div className="flex justify-between mt-8 relative z-10">
            <TyreCircle type="C1" size="lg" />
            <TyreCircle type="C2" size="lg" />
            <TyreCircle type="C3" size="lg" />
            <TyreCircle type="C4" size="lg" />
            <TyreCircle type="C5" size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-5 rounded-xl border-l-4 border-white">
            <h5 className="font-heading font-bold text-white mb-2">DRY CONDITIONS</h5>
            <p className="font-inter text-[13px] text-white/70">
              For each race, Pirelli selects 3 dry compounds from the C1-C5 range depending on track roughness. They are labeled <strong className="text-white">HARD (White)</strong>, <strong className="text-[#FFD700]">MEDIUM (Yellow)</strong>, and <strong className="text-[#E8002D]">SOFT (Red)</strong> for the broadcast, regardless of their actual 'C' number.
            </p>
          </div>
          <div className="bg-[#0080FF]/10 p-5 rounded-xl border-l-4 border-[#00C853] flex flex-col gap-3">
            <h5 className="font-heading font-bold text-white mb-1">WET CONDITIONS</h5>
            <div className="flex items-center gap-4">
              <TyreCircle type="Inter" size="sm" />
              <p className="font-inter text-[12px] text-white/70"><strong>INTERMEDIATE (Green):</strong> Used for damp/drying tracks.</p>
            </div>
            <div className="flex items-center gap-4">
              <TyreCircle type="Wet" size="sm" />
              <p className="font-inter text-[12px] text-white/70"><strong>FULL WET (Blue):</strong> Used in heavy rain. Displaces 65L of water per second.</p>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK B — THE MANDATORY PIT STOP RULE */}
      <div className="bg-[#E8002D]/10 border border-[#E8002D]/40 rounded-xl p-6 shadow-[0_0_20px_rgba(232,0,45,0.1)] mb-4">
        <h4 className="font-heading text-lg font-bold uppercase text-[#E8002D] mb-2 tracking-widest flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          MANDATORY PIT STOP RULE
        </h4>
        <p className="font-inter text-[14px] text-white/80">
          Every driver MUST use at least <strong>2 different dry tyre compounds</strong> during a dry race. This rule explicitly forces at least one pit stop (introducing strategy) and prevents teams from simply starting on the Hard tyre and driving to the end without stopping.
        </p>
      </div>

      {/* BLOCK C — TYRE DEGRADATION VISUAL */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 md:p-8">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-2">The Cliff (Tyre Degradation)</h4>
        <p className="font-inter text-sm text-white/50 mb-8 max-w-2xl">
          Tyres lose grip as they are driven. The "cliff" is the moment a tyre abruptly loses its remaining grip, causing lap times to plummet.
        </p>
        
        {/* CSS Chart */}
        <div className="relative w-full h-[250px] border-l border-b border-white/20 pl-4 pb-4">
          {/* Y Axis Label */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-white/40 tracking-widest">PACE (FAST → SLOW)</div>
          <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/40 tracking-widest">LAPS (0 → 40)</div>

          {/* Grid lines */}
          <div className="absolute inset-0 pl-4 border-t border-white/5 top-[25%]" />
          <div className="absolute inset-0 pl-4 border-t border-white/5 top-[50%]" />
          <div className="absolute inset-0 pl-4 border-t border-white/5 top-[75%]" />

          {/* Lines container using SVG to easily draw paths that can animate via CSS stroke-dasharray if desired, or just static nice curves */}
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Hard Line */}
            <motion.path 
              d="M 0,90 Q 200,100 400,130 T 800,200" 
              fill="none" stroke="#FFFFFF" strokeWidth="3" 
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Medium Line */}
            <motion.path 
              d="M 0,50 Q 200,60 400,120 T 600,250" 
              fill="none" stroke="#FFD700" strokeWidth="3"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Soft Line */}
            <motion.path 
              d="M 0,10 Q 150,20 250,90 T 350,250" 
              fill="none" stroke="#E8002D" strokeWidth="3"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>

          {/* Labels */}
          <div className="absolute left-[360px] top-[235px] text-[10px] font-bold font-mono text-[#E8002D] bg-black px-1">SOFT CLIFF</div>
          <div className="absolute right-[20%] top-[235px] text-[10px] font-bold font-mono text-[#FFD700] bg-black px-1 hidden md:block">MEDIUM CLIFF</div>
          <div className="absolute right-0 top-[190px] text-[10px] font-bold font-mono text-white bg-black px-1 hidden md:block">HARD (STILL GOING)</div>
        </div>
      </div>

      {/* BLOCK D — INTERACTIVE TYRE IDENTIFIER QUIZ */}
      <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto w-full text-center">
        <h3 className="font-heading text-xl font-black text-white uppercase tracking-widest mb-1">Tyre Strategy Quiz</h3>
        
        {!quizFinished ? (
          <div className="flex flex-col items-center">
            <p className="font-inter text-[15px] text-white/80 mb-6 h-12 flex items-center justify-center">
              {currentQ.text}
            </p>
            
            <div className="flex gap-4 w-full justify-center mb-6">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleGuess(opt)}
                  disabled={!!feedback}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    feedback 
                      ? (opt === currentQ.target ? 'bg-white/20 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'opacity-30')
                      : 'hover:bg-white/10'
                  }`}
                >
                  <TyreCircle type={opt} size="md" />
                  <span className="font-mono text-xs font-bold text-white/70">{opt}</span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`font-bold font-mono text-sm tracking-widest ${feedback.correct ? 'text-[#00C853]' : 'text-[#E8002D]'}`}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h4 className="font-heading text-3xl font-black text-[#00C853] uppercase mb-2">
              {score} / {questions.length} CORRECT
            </h4>
            <p className="font-inter text-white/60 mb-6">You're ready for the pit wall.</p>
            <button 
              onClick={() => { setQuizIdx(0); setScore(0); setQuizFinished(false); setFeedback(null); }}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold font-mono text-xs"
            >
              RESTART
            </button>
          </motion.div>
        )}
      </div>

      <ChapterFooter 
        keyTakeaway="Softer tyres = more speed but less lifespan. Harder tyres = less speed but extreme durability. F1 strategy is entirely about balancing these two extremes."
        nextChapterId="ch09"
        nextChapterTitle="DRS SYSTEM"
      />
    </ChapterWrapper>
  );
};
