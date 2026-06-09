import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch14Strategy = () => {
  // Strategy Simulator State
  const [gameState, setGameState] = useState('idle'); // idle, playing, over
  const [lap, setLap] = useState(1);
  const maxLaps = 20;
  
  // You = Player. Rival = AI.
  const [playerTyres, setPlayerTyres] = useState({ type: 'Medium', age: 0, life: 100 });
  const [rivalTyres, setRivalTyres] = useState({ type: 'Medium', age: 0, life: 100 });
  const [gap, setGap] = useState(2.0); // positive means player is ahead.
  
  // Game Log
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const resetGame = () => {
    setGameState('playing');
    setLap(1);
    setPlayerTyres({ type: 'Medium', age: 0, life: 100 });
    setRivalTyres({ type: 'Medium', age: 0, life: 100 });
    setGap(2.0);
    setLogs(['Race Started! You are P1, 2.0s ahead of P2.']);
  };

  const getTyrePace = (tyres) => {
    // Base pace + penalty for age.
    let base = 0;
    let wearRate = 0;
    if (tyres.type === 'Soft') { base = 1.5; wearRate = 7; }
    if (tyres.type === 'Medium') { base = 1.0; wearRate = 4; }
    if (tyres.type === 'Hard') { base = 0.5; wearRate = 2; }
    
    const lifeMultiplier = tyres.life / 100;
    // Speed decreases as life decreases.
    return base * lifeMultiplier;
  };

  const processLap = (playerAction) => {
    if (gameState !== 'playing') return;

    let pGapChange = 0;
    let pNewTyres = { ...playerTyres };
    let rNewTyres = { ...rivalTyres };

    // AI Logic (Rival pits if life < 20 or lap === 10)
    let rivalPits = false;
    if (lap > 5 && (rNewTyres.life < 20 || lap === 10) && rNewTyres.type !== 'Hard') {
      rivalPits = true;
    }

    // Process Player
    if (playerAction === 'pit') {
      pNewTyres = { type: 'Hard', age: 0, life: 100 };
      pGapChange -= 22; // Pit stop time loss
      addLog(`Lap ${lap}: You pitted for Hard tyres. Lost 22s.`);
    } else {
      pNewTyres.age += 1;
      pNewTyres.life = Math.max(0, pNewTyres.life - (pNewTyres.type === 'Medium' ? 5 : (pNewTyres.type === 'Hard' ? 2 : 8)));
    }

    // Process Rival
    if (rivalPits) {
      rNewTyres = { type: 'Hard', age: 0, life: 100 };
      pGapChange += 22; // Rival loses 22s
      addLog(`Lap ${lap}: Rival pitted for Hard tyres!`);
    } else {
      rNewTyres.age += 1;
      rNewTyres.life = Math.max(0, rNewTyres.life - (rNewTyres.type === 'Medium' ? 5 : (rNewTyres.type === 'Hard' ? 2 : 8)));
    }

    // Calculate pace diff if both are running
    const pPace = getTyrePace(pNewTyres);
    const rPace = getTyrePace(rNewTyres);
    
    // Pace diff applied to gap (if player pace > rival pace, gap increases)
    const paceDiff = pPace - rPace;
    pGapChange += paceDiff;

    const newGap = gap + pGapChange;
    
    setPlayerTyres(pNewTyres);
    setRivalTyres(rNewTyres);
    setGap(newGap);
    setLap(l => l + 1);

    if (lap + 1 > maxLaps) {
      setGameState('over');
      addLog(`RACE FINISHED! You finished ${newGap > 0 ? 'AHEAD' : 'BEHIND'} by ${Math.abs(newGap).toFixed(1)}s.`);
    } else {
      if (playerAction !== 'pit' && !rivalPits) {
        addLog(`Lap ${lap}: Gap ${newGap > gap ? 'grew' : 'shrank'} to ${newGap.toFixed(1)}s.`);
      }
    }
  };

  return (
    <ChapterWrapper
      id="ch14"
      num="14"
      title="RACE STRATEGY"
      hook="Speed isn't everything. A slow car with a genius strategy will often beat a fast car with a foolish one."
    >
      {/* BLOCK A — TRACK POSITION VS TYRE LIFE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ConceptCard title="TRACK POSITION" borderColor="#00C853">
          <p className="font-inter text-[14px] text-white/70 mb-3">
            The fundamental currency of F1. Being ahead of your rival on the physical track.
          </p>
          <div className="font-mono text-[11px] text-[#00C853] bg-[#00C853]/10 p-2 rounded">
            "Track position is king. It's better to be in front on old tyres than behind on new ones, because passing is difficult."
          </div>
        </ConceptCard>

        <ConceptCard title="TYRE ADVANTAGE (TYRE DELTA)" borderColor="#FF8700">
          <p className="font-inter text-[14px] text-white/70 mb-3">
            The pace difference between fresh tyres and old tyres.
          </p>
          <div className="font-mono text-[11px] text-[#FF8700] bg-[#FF8700]/10 p-2 rounded">
            "If your tyre delta is huge (e.g. 2+ seconds a lap faster), you will catch and pass the leader regardless of track position."
          </div>
        </ConceptCard>
      </div>

      {/* BLOCK C — DIRTY AIR EXPLAINED */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 lg:p-8 mb-8 relative overflow-hidden">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-2 tracking-widest">The "Dirty Air" Problem</h4>
        <p className="font-inter text-sm text-white/70 mb-6 max-w-2xl">
          F1 cars generate massive downforce by pushing air upwards. This leaves a wake of turbulent, messy air behind them. If you follow closely, your car loses 30-40% of its aerodynamic grip. This makes following through corners incredibly difficult and ruins your tyres.
        </p>

        {/* CSS Visual */}
        <div className="relative w-full h-24 flex items-center bg-black/40 rounded-lg border border-white/10 overflow-hidden px-4">
          {/* Car 1 */}
          <div className="absolute left-8 flex items-center">
            <div className="w-16 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">P1</div>
            {/* Turbulent wake lines */}
            <motion.div 
              className="absolute left-12 w-64 h-8 flex flex-col justify-between opacity-50"
              animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <div className="w-full h-[2px] bg-gradient-to-r from-f1-red to-transparent transform rotate-2" />
              <div className="w-full h-[2px] bg-gradient-to-r from-f1-red to-transparent transform -rotate-2" />
              <div className="w-full h-[2px] bg-gradient-to-r from-f1-red to-transparent transform rotate-1 mt-2" />
            </motion.div>
          </div>
          
          {/* Car 2 */}
          <div className="absolute left-48 flex items-center">
            <div className="w-16 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-black border-2 border-f1-red shadow-[0_0_15px_rgba(232,0,45,0.5)] z-10">P2</div>
          </div>

          <div className="absolute top-2 right-4 text-[10px] font-mono font-bold text-f1-red tracking-widest">SLIDING & OVERHEATING</div>
        </div>
      </div>

      {/* BLOCK B — INTERACTIVE STRATEGY SIMULATOR */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#00D2BE]/10 text-[#00D2BE] font-bold font-mono text-[10px] px-3 py-1 rounded-bl-xl border-b border-l border-[#00D2BE]/30">INTERACTIVE</div>
        
        <h4 className="font-heading text-xl font-bold text-white uppercase tracking-widest mb-2 text-center">The Pit Wall Simulator</h4>
        <p className="font-inter text-sm text-white/50 mb-8 text-center max-w-xl mx-auto">
          You are P1. The rival is chasing you. Tyres lose grip over time. Decide when to pit for fresh Hard tyres. 
          Will you get undercut, or hold them off?
        </p>

        {gameState === 'idle' && (
          <div className="flex justify-center mb-8">
            <button 
              onClick={resetGame}
              className="bg-f1-red hover:bg-f1-red/90 text-white px-8 py-3 rounded-full font-bold font-mono text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(232,0,45,0.4)]"
            >
              START 20-LAP RACE
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'over') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Status Panel */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Top Bar */}
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="font-mono text-2xl font-black text-white">LAP {lap}/{maxLaps}</div>
                <div className="flex flex-col items-end">
                  <div className="font-mono text-[10px] text-white/50">GAP TO RIVAL</div>
                  <div className={`font-mono text-xl font-black ${gap > 0 ? 'text-[#00C853]' : 'text-[#E8002D]'}`}>
                    {gap > 0 ? `+${gap.toFixed(1)}s AHEAD` : `${gap.toFixed(1)}s BEHIND`}
                  </div>
                </div>
              </div>

              {/* Cars Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="font-heading font-bold text-white uppercase mb-4">YOU (P{gap > 0 ? '1' : '2'})</div>
                  <div className="font-mono text-[10px] text-white/50 mb-1">TYRES</div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${playerTyres.type === 'Medium' ? 'bg-[#FFD700]' : 'bg-white'}`} />
                    <span className="font-mono text-sm font-bold">{playerTyres.type} ({playerTyres.age} Laps)</span>
                  </div>
                  <div className="font-mono text-[10px] text-white/50 mb-1">TYRE LIFE</div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00C853]" style={{ width: `${playerTyres.life}%`, backgroundColor: playerTyres.life < 30 ? '#E8002D' : '#00C853' }} />
                  </div>
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <div className="font-heading font-bold text-white/50 uppercase mb-4">RIVAL (P{gap < 0 ? '1' : '2'})</div>
                  <div className="font-mono text-[10px] text-white/50 mb-1">TYRES</div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${rivalTyres.type === 'Medium' ? 'bg-[#FFD700]' : 'bg-white'}`} />
                    <span className="font-mono text-sm font-bold text-white/80">{rivalTyres.type} ({rivalTyres.age} Laps)</span>
                  </div>
                  <div className="font-mono text-[10px] text-white/50 mb-1">TYRE LIFE</div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30" style={{ width: `${rivalTyres.life}%` }} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              {gameState === 'playing' ? (
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => processLap('continue')}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold font-mono text-sm tracking-widest uppercase transition-colors"
                  >
                    CONTINUE NEXT LAP
                  </button>
                  <button 
                    onClick={() => processLap('pit')}
                    disabled={playerTyres.type === 'Hard'}
                    className={`flex-1 py-4 rounded-xl font-bold font-mono text-sm tracking-widest uppercase transition-colors ${
                      playerTyres.type === 'Hard' ? 'bg-white/5 text-white/20' : 'bg-[#00D2BE] text-black shadow-[0_0_20px_rgba(0,210,190,0.3)] hover:bg-[#00D2BE]/90'
                    }`}
                  >
                    {playerTyres.type === 'Hard' ? 'ALREADY PITTED' : 'BOX FOR HARDS'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 mt-4 bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                  <h4 className="font-heading text-2xl font-black text-white uppercase tracking-widest">
                    {gap > 0 ? '🏆 YOU WON!' : '❌ YOU LOST!'}
                  </h4>
                  <p className="font-inter text-sm text-white/70">
                    {gap > 0 ? 'Masterclass strategy on the pit wall.' : 'You lost track position and could not recover.'}
                  </p>
                  <button onClick={resetGame} className="mt-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-bold font-mono text-xs uppercase">
                    TRY AGAIN
                  </button>
                </div>
              )}
            </div>

            {/* Log Panel */}
            <div className="bg-black border border-white/10 rounded-xl p-4 flex flex-col font-mono text-xs">
              <div className="text-white/50 border-b border-white/10 pb-2 mb-2 font-bold tracking-widest">RACE ENGINEER LOG</div>
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className={`p-2 rounded ${i === 0 ? 'bg-white/10 text-white border-l-2 border-[#00D2BE]' : 'text-white/40'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <ChapterFooter 
        keyTakeaway="An undercut is powerful, but if you pit too early, your fresh tyres will degrade at the end of the race, leaving you vulnerable to an attack."
        nextChapterId="ch15"
        nextChapterTitle="F1 GLOSSARY"
      />
    </ChapterWrapper>
  );
};
