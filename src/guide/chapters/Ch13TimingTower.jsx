import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch13TimingTower = () => {
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const annotations = [
    { id: 'pos', title: 'POSITION', desc: 'Current race position (1st to 20th).' },
    { id: 'chg', title: 'POSITION CHANGE', desc: '▲ gained positions, ▼ lost, = no change since race start.' },
    { id: 'name', title: 'DRIVER CODE', desc: '3-letter abbreviation (VER = Verstappen).' },
    { id: 'team', title: 'TEAM COLOR', desc: 'Constructor identifier color strip.' },
    { id: 'time', title: 'TIME / STATUS', desc: 'Shows gap to leader, interval to car ahead, or current lap time depending on broadcast mode.' },
    { id: 'gap', title: 'GAP', desc: 'Time behind the leader (+0.000 for P1).' },
    { id: 'tyre', title: 'TYRE COMPOUND', desc: 'S=Soft, M=Medium, H=Hard. Sometimes includes tyre age (number of laps on that set).' }
  ];

  return (
    <ChapterWrapper
      id="ch13"
      num="13"
      title="READING THE TIMING TOWER"
      hook="The timing tower on your screen is packed with information — here's every pixel decoded."
    >
      {/* BLOCK A — ANNOTATED TIMING TOWER REPLICA */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl mb-6 overflow-hidden flex flex-col md:flex-row gap-8 items-start relative">
        {/* The Tower */}
        <div className="w-full md:w-[280px] shrink-0 bg-[#111] border border-white/5 rounded-md overflow-hidden font-mono shadow-2xl relative">
          
          {/* Header */}
          <div className="bg-[#222] text-white/50 text-[10px] flex justify-between px-2 py-1 border-b border-white/10 font-bold">
            <span>POS</span>
            <span>LAP 24/53</span>
            <span>GAP</span>
          </div>
          
          {/* Rows */}
          {[
            { p: '1', dir: '=', code: 'ANT', color: '#27F4D2', time: '1:20.456', gap: 'LAP 24', tyre: 'S', tyBg: '#E8002D' },
            { p: '2', dir: '▲', code: 'RUS', color: '#27F4D2', time: '1:20.891', gap: '+1.435', tyre: 'M', tyBg: '#FFD700', tyColor: '#000' },
            { p: '3', dir: '▼', code: 'VER', color: '#3671C6', time: '1:21.234', gap: '+2.778', tyre: 'H', tyBg: '#FFF', tyColor: '#000' },
            { p: '4', dir: '▲', code: 'NOR', color: '#FF8000', time: '1:21.567', gap: '+4.111', tyre: 'S', tyBg: '#E8002D' },
            { p: '5', dir: '=', code: 'HAM', color: '#E8002D', time: '1:21.890', gap: '+5.434', tyre: 'M', tyBg: '#FFD700', tyColor: '#000' }
          ].map((row, i) => (
            <div key={i} className="flex items-center text-sm border-b border-white/5 h-8 relative">
              <div className="w-6 text-center text-white/70 bg-white/5 h-full flex items-center justify-center text-xs">{row.p}</div>
              <div className={`w-4 text-center text-[10px] ${row.dir === '▲' ? 'text-[#00C853]' : (row.dir === '▼' ? 'text-[#E8002D]' : 'text-white/30')}`}>{row.dir}</div>
              <div className="w-[3px] h-full" style={{ backgroundColor: row.color }} />
              <div className="w-10 pl-2 font-bold text-white text-xs">{row.code}</div>
              <div className="flex-1 text-right pr-2 text-white/80 text-xs">{row.gap}</div>
              <div className="w-6 h-full border-l border-white/10 flex items-center justify-center p-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: row.tyBg, color: row.tyColor || '#FFF' }}>
                  {row.tyre}
                </div>
              </div>
            </div>
          ))}

          {/* Interactive Overlays for hover effects */}
          <div className="absolute top-0 bottom-0 left-0 w-6 hover:bg-white/20 cursor-pointer z-10 transition-colors" onMouseEnter={() => setActiveAnnotation('pos')} onMouseLeave={() => setActiveAnnotation(null)} />
          <div className="absolute top-0 bottom-0 left-6 w-4 hover:bg-white/20 cursor-pointer z-10 transition-colors" onMouseEnter={() => setActiveAnnotation('chg')} onMouseLeave={() => setActiveAnnotation(null)} />
          <div className="absolute top-0 bottom-0 left-[40px] w-[50px] hover:bg-white/20 cursor-pointer z-10 transition-colors" onMouseEnter={() => setActiveAnnotation('name')} onMouseLeave={() => setActiveAnnotation(null)} />
          <div className="absolute top-0 bottom-0 right-6 left-[90px] hover:bg-white/20 cursor-pointer z-10 transition-colors" onMouseEnter={() => setActiveAnnotation('time')} onMouseLeave={() => setActiveAnnotation(null)} />
          <div className="absolute top-0 bottom-0 right-0 w-6 hover:bg-white/20 cursor-pointer z-10 transition-colors" onMouseEnter={() => setActiveAnnotation('tyre')} onMouseLeave={() => setActiveAnnotation(null)} />
        </div>

        {/* Legend / Explanations */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {annotations.map((ann, i) => (
            <div 
              key={ann.id}
              className={`p-3 rounded-lg border transition-all ${
                activeAnnotation === ann.id 
                  ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'bg-white/[0.02] border-white/5'
              }`}
              onMouseEnter={() => setActiveAnnotation(ann.id)}
              onMouseLeave={() => setActiveAnnotation(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-f1-red text-white flex items-center justify-center font-mono text-[9px] font-bold">{i+1}</span>
                <span className="font-heading text-sm font-bold text-white uppercase tracking-widest">{ann.title}</span>
              </div>
              <p className="font-inter text-xs text-white/60 pl-6">{ann.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCK B — COLOUR CODES ON TIMING */}
      <h4 className="font-heading text-lg font-bold uppercase text-white mb-4 tracking-widest">Timing Colour Codes</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <ConceptCard borderColor="#9B59B6" bgTint>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#9B59B6] animate-pulse" />
            <span className="font-heading font-bold text-[#9B59B6] tracking-widest uppercase">PURPLE</span>
          </div>
          <p className="font-inter text-sm text-white/70">
            Absolute fastest time set by ANY driver in the entire session. "Best of the best."
          </p>
        </ConceptCard>
        
        <ConceptCard borderColor="#00C853" bgTint>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#00C853]" />
            <span className="font-heading font-bold text-[#00C853] tracking-widest uppercase">GREEN</span>
          </div>
          <p className="font-inter text-sm text-white/70">
            A personal best time for THAT specific driver, but not the fastest overall.
          </p>
        </ConceptCard>

        <ConceptCard borderColor="#FFD700" bgTint>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
            <span className="font-heading font-bold text-[#FFD700] tracking-widest uppercase">YELLOW</span>
          </div>
          <p className="font-inter text-sm text-white/70">
            A timed lap that is slower than the driver's own personal best time.
          </p>
        </ConceptCard>

        <ConceptCard borderColor="#FFFFFF" bgTint>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-white" />
            <span className="font-heading font-bold text-white tracking-widest uppercase">WHITE</span>
          </div>
          <p className="font-inter text-sm text-white/70">
            Standard text color. A normal timed lap with no special significance.
          </p>
        </ConceptCard>
      </div>

      {/* BLOCK C — THE INTERVAL vs GAP EXPLAINED */}
      <div className="bg-[#00D2BE]/10 border-l-4 border-[#00D2BE] rounded-r-xl p-6 mb-4">
        <h4 className="font-heading text-lg font-bold uppercase text-[#00D2BE] mb-2 tracking-widest">Interval vs Gap To Leader</h4>
        <div className="space-y-4 font-inter text-sm text-white/80">
          <p>The broadcast frequently switches between two modes for the timing tower:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>INTERVAL:</strong> The gap to the car <em>directly ahead</em> of you. (e.g., P3 is 2.5s behind P2). Crucial for knowing if a car is in DRS range (under 1.0s).</li>
            <li><strong>GAP TO LEADER:</strong> The total accumulated time behind P1. (e.g., P3 is 4.0s behind P1). Crucial for overall race strategy.</li>
          </ul>
        </div>
      </div>

      <ChapterFooter 
        keyTakeaway="Purple means overall fastest. Green means personal fastest. Memorize those two colors and qualifying becomes 10x more exciting to watch."
        nextChapterId="ch14"
        nextChapterTitle="RACE STRATEGY"
      />
    </ChapterWrapper>
  );
};
