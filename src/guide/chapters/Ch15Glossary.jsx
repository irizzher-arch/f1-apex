import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';

export const Ch15Glossary = ({ onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  const glossaryData = [
    { term: "Apex", cat: "Racing", def: "The innermost point of a corner. Hitting the apex allows the car to take the straightest line through the curve." },
    { term: "Blistering", cat: "Tyres", def: "When the inside of the tyre overheats and chunks of rubber tear away from the surface." },
    { term: "Box", cat: "Comms", def: "A radio instruction telling the driver to enter the pit lane. (Originates from the German word 'Boxenstopp')." },
    { term: "Bottoming Out", cat: "Tech", def: "When the bottom of the car's floor scrapes against the track surface, creating sparks." },
    { term: "Dirty Air", cat: "Aero", def: "Turbulent wake left behind a fast-moving car. Causes following cars to lose downforce and overheat." },
    { term: "DRS", cat: "Tech", def: "Drag Reduction System. A flap on the rear wing that opens to increase straight-line speed." },
    { term: "Flat Spot", cat: "Tyres", def: "When a driver locks the brakes and slides, burning a flat patch onto the perfectly round tyre, causing severe vibrations." },
    { term: "Graining", cat: "Tyres", def: "When the tyre slides on the track surface, causing rubber to peel off and stick back onto the tyre, reducing grip." },
    { term: "Lock-up", cat: "Racing", def: "When a driver brakes too hard and one or more wheels stop spinning while the car is still moving, causing smoke and flat spots." },
    { term: "Overcut", cat: "Strategy", def: "Staying out on older tyres while your rival pits, attempting to build a gap before pitting yourself." },
    { term: "Oversteer", cat: "Racing", def: "When the rear wheels lose grip before the front wheels, causing the back of the car to slide outwards." },
    { term: "Parc Fermé", cat: "Rules", def: "French for 'closed park'. The period where teams are forbidden from making mechanical changes to the car." },
    { term: "Pole Position", cat: "Rules", def: "Starting the race from the first position on the grid, earned by setting the fastest qualifying time." },
    { term: "Porpoising", cat: "Aero", def: "A violent bouncing motion caused by aerodynamics sucking the car to the ground until stalling, repeatedly." },
    { term: "Slipstream", cat: "Aero", def: "Driving in the low-pressure area immediately behind another car on a straight, significantly reducing drag and increasing speed (also called a 'tow')." },
    { term: "Undercut", cat: "Strategy", def: "Pitting before your rival to use the speed advantage of fresh tyres to pass them when they eventually pit." },
    { term: "Understeer", cat: "Racing", def: "When the front wheels lose grip and the car refuses to turn sharply, pushing wide of the apex." }
  ];

  const categories = ['ALL', 'Racing', 'Tyres', 'Aero', 'Strategy', 'Rules', 'Tech', 'Comms'];

  const filteredData = glossaryData.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.def.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || item.cat === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <ChapterWrapper
      id="ch15"
      num="15"
      title="F1 GLOSSARY"
      hook="Sound like an expert by Sunday. The ultimate cheat sheet for F1 terminology."
    >
      <div className="bg-[#050508] border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl mb-16">
        
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 border-b border-white/10 pb-8">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-inter text-sm focus:outline-none focus:border-f1-red transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  selectedCat === cat 
                    ? 'bg-[#00D2BE] text-black' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dictionary List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredData.map(item => (
              <motion.div 
                key={item.term}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider">{item.term}</h4>
                  <span className="font-mono text-[9px] bg-white/10 px-2 py-1 rounded text-white/50">{item.cat}</span>
                </div>
                <p className="font-inter text-[13px] text-white/70 leading-relaxed">
                  {item.def}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredData.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 font-mono text-white/40">
              NO TERMS FOUND FOR "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* GRADUATION BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative bg-gradient-to-br from-f1-red to-[#800] rounded-3xl p-8 lg:p-12 text-center shadow-[0_20px_50px_rgba(232,0,45,0.4)] overflow-hidden flex flex-col items-center"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay" />
        
        <div className="text-6xl mb-6 relative z-10">🏁</div>
        <h2 className="font-heading text-4xl lg:text-5xl font-black text-white uppercase tracking-widest mb-4 relative z-10">
          You Are Race Ready
        </h2>
        <p className="font-inter text-lg text-white/80 max-w-2xl mx-auto mb-10 relative z-10">
          You've mastered the rules, deciphered the strategy, and learned the jargon. It's time to enjoy your first Grand Prix.
        </p>

        <button 
          onClick={onComplete}
          className="relative z-10 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-heading text-xl font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl flex items-center gap-3 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-f1-red group-hover:animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          Claim Your Super License
        </button>
      </motion.div>

    </ChapterWrapper>
  );
};
