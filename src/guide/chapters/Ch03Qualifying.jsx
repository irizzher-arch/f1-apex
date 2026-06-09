import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch03Qualifying = () => {
  // Qualifying Simulator State
  const [gameState, setGameState] = useState('idle'); // idle, playing, result
  const [markerPos, setMarkerPos] = useState(0);
  const [result, setResult] = useState(null);
  const requestRef = useRef();
  const directionRef = useRef(1); // 1 = right, -1 = left
  
  // Game loop
  const animate = () => {
    setMarkerPos((prev) => {
      let nextPos = prev + (directionRef.current * 1.5);
      if (nextPos >= 100) {
        nextPos = 100;
        directionRef.current = -1;
      } else if (nextPos <= 0) {
        nextPos = 0;
        directionRef.current = 1;
      }
      return nextPos;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  const startGame = () => {
    setGameState('playing');
    setResult(null);
    setMarkerPos(0);
    directionRef.current = 1;
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopGame = () => {
    cancelAnimationFrame(requestRef.current);
    setGameState('result');
    
    // Evaluate result
    // Perfect window is between 75 and 85
    if (markerPos >= 75 && markerPos <= 85) {
      setResult({ type: 'perfect', text: 'Purple sector! 1:21.8 — POLE POSITION!', color: '#9B59B6', time: '1:21.824' });
    } else if (markerPos < 75) {
      setResult({ type: 'early', text: 'Too cautious on the brakes.', color: '#FF8700', time: '1:23.412' });
    } else {
      setResult({ type: 'late', text: 'Overcommitted and ran wide.', color: '#E8002D', time: '1:24.953' });
    }
  };

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <ChapterWrapper
      id="ch03"
      num="03"
      title="QUALIFYING EXPLAINED"
      hook="Qualifying is pure speed — one lap, maximum attack, nothing held back."
    >
      {/* BLOCK A — THE THREE KNOCKOUT ROUNDS VISUAL */}
      <div className="flex flex-col items-center py-4 w-full max-w-2xl mx-auto">
        
        {/* Q1 Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-center relative overflow-hidden"
          style={{ borderLeft: '4px solid #00C853' }}
        >
          <div className="absolute top-0 right-0 bg-[#00C853] text-black font-bold font-mono text-[10px] px-2 py-1 rounded-bl-md">18 MINS</div>
          <h3 className="text-xl font-heading font-black text-white mb-1 tracking-wider">Q1 (ALL 20 DRIVERS)</h3>
          <p className="text-sm font-inter text-white/60 mb-3">All 20 drivers set their fastest lap. Bottom 5 are eliminated.</p>
          <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_,i) => <div key={i} className="w-8 h-2 bg-white/20 rounded-full" />)}
            </div>
            <div className="text-[10px] font-mono text-white/40">P16–P20 START HERE (ELIMINATED)</div>
          </div>
          <div className="text-sm font-bold text-[#00C853] mt-3">↓ 15 DRIVERS ADVANCE ↓</div>
        </motion.div>

        {/* Funnel Arrow */}
        <div className="w-20 h-6 border-x-2 border-b-2 border-[#00C853]/30 rounded-b-xl my-2 shrink-0" />

        {/* Q2 Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-11/12 bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-center relative overflow-hidden"
          style={{ borderLeft: '4px solid #FFD700' }}
        >
          <div className="absolute top-0 right-0 bg-[#FFD700] text-black font-bold font-mono text-[10px] px-2 py-1 rounded-bl-md">15 MINS</div>
          <h3 className="text-xl font-heading font-black text-white mb-1 tracking-wider">Q2 (15 DRIVERS)</h3>
          <p className="text-sm font-inter text-white/60 mb-3">15 drivers battle. Bottom 5 eliminated again.</p>
          <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_,i) => <div key={i} className="w-8 h-2 bg-white/20 rounded-full" />)}
            </div>
            <div className="text-[10px] font-mono text-white/40">P11–P15 START HERE (ELIMINATED)</div>
          </div>
          <div className="text-sm font-bold text-[#FFD700] mt-3">↓ 10 DRIVERS ADVANCE ↓</div>
        </motion.div>

        {/* Funnel Arrow */}
        <div className="w-16 h-6 border-x-2 border-b-2 border-[#FFD700]/30 rounded-b-xl my-2 shrink-0" />

        {/* Q3 Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-5/6 bg-[#E8002D]/5 border border-white/[0.07] rounded-xl p-5 text-center relative overflow-hidden shadow-[0_0_30px_rgba(232,0,45,0.1)]"
          style={{ borderLeft: '4px solid #E8002D' }}
        >
          <div className="absolute top-0 right-0 bg-[#E8002D] text-white font-bold font-mono text-[10px] px-2 py-1 rounded-bl-md">12 MINS</div>
          <div className="absolute top-0 left-0 bg-[#E8002D] text-white font-bold font-mono text-[10px] px-2 py-1 rounded-br-md animate-pulse">POLE POSITION</div>
          <h3 className="text-xl font-heading font-black text-white mb-1 tracking-wider mt-3">Q3 (TOP 10 SHOOTOUT)</h3>
          <p className="text-sm font-inter text-white/60">The final 10 fight for pole. Best lap gets P1 on the grid.</p>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* BLOCK B — WHAT IS POLE POSITION? */}
        <ConceptCard 
          borderColor="#FFD700"
          content="The driver who sets the fastest time in Q3 starts the race from 'Pole Position' — the very front of the grid, on the side of the track with the cleanest racing line. At narrow tracks like Monaco, Pole Position almost guarantees a race win."
        >
          <div className="flex items-center gap-4 mt-4">
            <div className="font-mono text-[64px] font-bold text-[#FFD700] leading-none drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">P1</div>
            <div className="flex-1 font-inter text-sm text-white/50">
              Statistically, over 40% of all modern F1 races are won by the driver starting from Pole Position.
            </div>
          </div>
        </ConceptCard>

        {/* BLOCK C — QUALIFYING STRATEGY NOTE */}
        <ConceptCard 
          title="TYRE STRATEGY"
          borderColor="#00D2BE"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="22" y1="12" x2="16" y2="12"/><line x1="8" y1="12" x2="2" y2="12"/></svg>}
          content="Drivers only get a limited number of the fastest 'Soft' tyres for the weekend. A top driver might try to get through Q1 using only one set of soft tyres, saving the rest for Q3. If a driver struggles and has to use multiple sets early on, they'll have a disadvantage in the final Q3 shootout."
        />
      </div>

      {/* BLOCK D — INTERACTIVE QUALIFYING SIMULATOR */}
      <div className="mt-8 bg-white/[0.02] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#9B59B6]/10 text-[#9B59B6] font-bold font-mono text-[10px] px-3 py-1 rounded-bl-xl border-b border-l border-[#9B59B6]/30">INTERACTIVE</div>
        
        <h3 className="font-heading text-2xl font-black text-white uppercase tracking-widest mb-2">Simulate Your Qualifying Lap</h3>
        <p className="font-inter text-sm text-white/50 mb-8 max-w-xl">
          Hit the brakes at the exact right moment to hit the apex. Stop the marker in the <span className="text-[#9B59B6] font-bold">purple zone</span> (75%-85%) to secure Pole Position.
        </p>

        {/* Game Area */}
        <div className="relative w-full h-12 bg-black rounded-full border border-white/20 mb-8 overflow-hidden">
          {/* Target Zone */}
          <div className="absolute top-0 bottom-0 left-[75%] right-[15%] bg-[#9B59B6]/30 border-x border-[#9B59B6]" />
          
          {/* Moving Marker */}
          <div 
            className="absolute top-1 bottom-1 w-2 bg-white rounded-full shadow-[0_0_10px_white]"
            style={{ left: `calc(${markerPos}% - 4px)` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button 
            onClick={gameState === 'playing' ? stopGame : startGame}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-bold font-mono text-sm tracking-widest uppercase transition-all ${
              gameState === 'playing' 
                ? 'bg-f1-red text-white hover:bg-f1-red/90 shadow-[0_0_20px_rgba(232,0,45,0.4)] scale-105' 
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {gameState === 'playing' ? 'BRAKE NOW!' : (gameState === 'result' ? 'TRY AGAIN' : 'START LAP')}
          </button>

          <AnimatePresence mode="wait">
            {gameState === 'result' && result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 bg-black/50 border border-white/10 px-6 py-3 rounded-xl"
              >
                <div className="font-mono text-2xl font-black" style={{ color: result.color }}>
                  {result.time}
                </div>
                <div className="font-inter text-sm font-medium text-white/80 border-l border-white/10 pl-4">
                  {result.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ChapterFooter 
        keyTakeaway="Qualifying is all about pushing the car to the absolute limit for a single lap. One mistake costs you grid positions for Sunday."
        nextChapterId="ch04"
        nextChapterTitle="THE SPRINT WEEKEND"
      />
    </ChapterWrapper>
  );
};
