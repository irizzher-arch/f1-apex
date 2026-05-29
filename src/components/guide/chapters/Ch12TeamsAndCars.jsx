import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch12TeamsAndCars = () => {
  const [activeCarPart, setActiveCarPart] = useState(null);
  const [activeOrgNode, setActiveOrgNode] = useState(null);

  const carAnnotations = [
    { id: 'fw', x: '10%', y: '60%', name: 'FRONT WING', desc: 'Generates ~25% of total downforce. Adjustable to manage aero balance.' },
    { id: 'halo', x: '45%', y: '40%', name: 'HALO', desc: 'Titanium safety device. Withstands force of a double-decker bus. Saved multiple lives.' },
    { id: 'sp', x: '55%', y: '60%', name: 'SIDEPODS', desc: 'House radiators and cooling. Aerodynamic design varies hugely between teams.' },
    { id: 'eng', x: '65%', y: '35%', name: 'POWER UNIT', desc: '1.6L V6 Turbo Hybrid. 15,000 RPM max. ~1000 horsepower total.' },
    { id: 'rw', x: '90%', y: '45%', name: 'REAR WING', desc: 'Generates downforce + houses DRS. High downforce vs low drag tradeoff.' },
    { id: 'fl', x: '60%', y: '85%', name: 'FLOOR', desc: 'Ground effect era. The underbody floor generates ~40–50% of total downforce.' },
    { id: 'ty', x: '80%', y: '75%', name: 'TYRES', desc: 'Only contact with track. 4 tyres × 800kg car at 300km/h — extraordinary engineering.' },
  ];

  const teams = [
    { name: 'Red Bull Racing', engine: 'Honda RBPT', color: '#3671C6' },
    { name: 'Mercedes', engine: 'Mercedes', color: '#27F4D2' },
    { name: 'Ferrari', engine: 'Ferrari', color: '#E8002D' },
    { name: 'McLaren', engine: 'Mercedes', color: '#FF8000' },
    { name: 'Aston Martin', engine: 'Mercedes', color: '#229971' },
    { name: 'Alpine', engine: 'Renault', color: '#0090FF' },
    { name: 'Williams', engine: 'Mercedes', color: '#005AFF' },
    { name: 'RB', engine: 'Honda RBPT', color: '#6692FF' },
    { name: 'Sauber', engine: 'Ferrari', color: '#52E252' },
    { name: 'Haas', engine: 'Ferrari', color: '#B6BABD' }
  ];

  return (
    <ChapterWrapper
      id="ch12"
      num="12"
      title="THE TEAMS & CARS"
      hook="10 teams, 1000 engineers, and a budget cap that still allows spending $135 million a year."
    >
      {/* BLOCK B — THE CAR ANATOMY DIAGRAM */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl mb-6">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-8 tracking-widest text-center">F1 Car Anatomy</h4>
        
        <div className="relative w-full max-w-3xl mx-auto aspect-[2/1] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)] rounded-xl">
          {/* Abstract Car Silhouette */}
          <svg className="w-full h-full opacity-60" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Tyres */}
            <rect x="150" y="240" width="80" height="80" rx="40" fill="#111" stroke="#333" strokeWidth="2" />
            <rect x="580" y="240" width="80" height="80" rx="40" fill="#111" stroke="#333" strokeWidth="2" />
            
            {/* Body */}
            <path d="M 80,280 L 150,260 L 300,210 L 350,180 L 400,160 L 450,140 L 550,160 L 650,200 L 750,200 L 750,240 L 680,260 L 80,280 Z" fill="#222" stroke="#444" strokeWidth="2" />
            
            {/* Front Wing */}
            <path d="M 40,280 L 120,280 L 120,250 L 80,240 Z" fill="#E8002D" />
            
            {/* Rear Wing */}
            <path d="M 680,200 L 780,200 L 780,140 L 720,160 Z" fill="#E8002D" />
            
            {/* Halo */}
            <path d="M 330,170 Q 380,120 420,150" fill="none" stroke="#666" strokeWidth="6" />
          </svg>

          {/* Annotations */}
          {carAnnotations.map((part) => (
            <div 
              key={part.id}
              className="absolute"
              style={{ left: part.x, top: part.y }}
            >
              {/* Pulsing Dot */}
              <div 
                className="relative w-4 h-4 cursor-pointer group"
                onMouseEnter={() => setActiveCarPart(part)}
                onMouseLeave={() => setActiveCarPart(null)}
              >
                <div className="absolute inset-0 bg-[#00D2BE] rounded-full opacity-75 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-1 bg-white rounded-full z-10" />
                
                {/* Always-on Label (Desktop) */}
                <div className="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-white/50 tracking-widest font-bold group-hover:text-[#00D2BE] transition-colors drop-shadow-md">
                  {part.name}
                </div>
              </div>
            </div>
          ))}

          {/* Annotation Overlay */}
          <AnimatePresence>
            {activeCarPart && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-black/90 border border-[#00D2BE]/50 p-4 rounded-xl z-20 shadow-[0_0_30px_rgba(0,210,190,0.2)] backdrop-blur-md pointer-events-none"
              >
                <h5 className="font-heading text-lg font-bold text-[#00D2BE] uppercase tracking-widest mb-1">{activeCarPart.name}</h5>
                <p className="font-inter text-sm text-white/80">{activeCarPart.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BLOCK A & C — ORG CHART & BUDGET CAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* BUDGET CAP */}
        <div className="bg-[#E8002D]/10 border border-[#E8002D]/30 rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-[inset_0_0_50px_rgba(232,0,45,0.1)]">
          <div className="font-mono text-[42px] md:text-[52px] font-black text-[#E8002D] leading-none mb-1 drop-shadow-[0_0_15px_rgba(232,0,45,0.5)]">
            $135M
          </div>
          <div className="font-mono text-[10px] text-white/60 tracking-widest uppercase mb-4">
            MAXIMUM SPEND PER SEASON
          </div>
          <p className="font-inter text-sm text-white/80">
            The 2021 budget cap revolutionised F1. It explicitly <strong>excludes</strong> driver salaries and top executive pay, but restricts car development spending to close the performance gap between billionaire-backed teams and smaller outfits.
          </p>
        </div>

        {/* TEAM STRUCTURE */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
          <h4 className="font-heading text-sm font-bold uppercase text-white/50 tracking-widest mb-4">Typical Team Structure</h4>
          
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full max-w-[200px] bg-white/10 border border-white/20 p-2 text-center rounded-md font-mono text-xs font-bold text-white shadow-lg">
              TEAM PRINCIPAL
            </div>
            
            <div className="w-[1px] h-4 bg-white/20" />
            
            <div className="w-full max-w-[280px] flex justify-between gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 p-2 text-center rounded-md font-mono text-[10px] text-white/80">
                TECHNICAL DIR.
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 p-2 text-center rounded-md font-mono text-[10px] text-white/80">
                SPORTING DIR.
              </div>
            </div>

            <div className="w-[1px] h-4 bg-white/20" />

            <div className="w-full grid grid-cols-4 gap-2">
              {['AERO', 'CHASSIS', 'ENGINE', 'STRATEGY'].map(dept => (
                <div key={dept} className="bg-black/50 border border-white/5 p-2 text-center rounded-md font-mono text-[9px] text-white/50 flex items-center justify-center">
                  {dept}
                </div>
              ))}
            </div>

            <div className="w-[1px] h-4 bg-white/20" />

            <div className="w-full max-w-[200px] bg-[#00D2BE]/20 border border-[#00D2BE]/40 p-2 text-center rounded-md font-mono text-xs font-bold text-[#00D2BE] shadow-[0_0_10px_rgba(0,210,190,0.2)]">
              RACE DRIVERS
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK D — 2026 TEAM GRID */}
      <h4 className="font-heading text-lg font-bold uppercase text-white mb-4 tracking-widest">The Grid</h4>
      <div className="flex flex-wrap gap-3">
        {teams.map(team => (
          <div 
            key={team.name}
            className="bg-white/[0.02] border-y border-r border-white/[0.05] rounded-md px-4 py-2 flex items-center gap-3 hover:bg-white/[0.05] transition-colors"
            style={{ borderLeft: `3px solid ${team.color}` }}
          >
            <div className="font-heading text-sm font-bold uppercase text-white tracking-wider">{team.name}</div>
            <div className="font-mono text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">{team.engine}</div>
          </div>
        ))}
      </div>

      <ChapterFooter 
        keyTakeaway="An F1 team is fundamentally an aerospace engineering company that happens to go racing on the weekends."
        nextChapterId="ch13"
        nextChapterTitle="READING THE TIMING TOWER"
      />
    </ChapterWrapper>
  );
};
