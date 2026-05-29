import React from 'react';
import { motion } from 'framer-motion';

export const TrackMasthead = ({ circuit, schedule }) => {
  // If schedule is null, default to placeholder data
  const round = schedule?.round || '00';
  const raceName = schedule?.raceName || `${circuit.circuitName} Grand Prix`;
  const [word1, ...rest] = raceName.split(' ');
  const word2 = rest.join(' ');
  
  const locality = circuit.Location.locality;
  const country = circuit.Location.country;

  // Derive schedule dates (mocking Friday/Saturday/Sunday based on race date)
  const raceDate = schedule ? new Date(`${schedule.date}T${schedule.time || '15:00:00Z'}`) : new Date();
  const qualiDate = new Date(raceDate); qualiDate.setDate(qualiDate.getDate() - 1);
  const fp1Date = new Date(raceDate); fp1Date.setDate(fp1Date.getDate() - 2);

  const formatDateStr = (date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const getDayName = (date) => date.toLocaleDateString('en-GB', { weekday: 'long' });

  return (
    <section className="relative w-full h-[280px] bg-[#000000] border-b border-[#E8002D]/35 overflow-hidden flex flex-col justify-end">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]" 
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
      
      {/* Ghost Round Number */}
      <div className="absolute left-[-20px] top-[-20px] pointer-events-none z-0">
        <span className="font-mono text-[160px] font-bold text-white/[0.06] leading-none tracking-tighter">
          #{round.padStart(2, '0')}
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pb-6 flex flex-col md:flex-row justify-between items-end gap-8">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-heading text-[13px] uppercase tracking-[0.25em] text-white/40 border-l-[3px] border-f1-red pl-[10px]">
              FACTFILE
            </span>
            <div className="w-[1px] h-[20px] bg-white/15" />
            <span className="font-mono text-[11px] text-white/30 uppercase">{circuit.circuitId}</span>
          </div>

          <h1 className="font-heading font-[800] text-[36px] md:text-[54px] uppercase text-white leading-none m-0 mb-3 tracking-wide">
            {word1} <span className="text-f1-red">{word2}</span>
          </h1>

          <div className="flex items-center gap-2 text-white/50 font-body text-[13px]">
            {/* Simple CSS flag placeholder */}
            <div className="w-[32px] h-[20px] bg-white/20 rounded-[2px]" />
            <span>{country}, {locality}</span>
          </div>
        </div>

        {/* RIGHT COLUMN - Schedule Strip */}
        <div className="flex bg-white/[0.02] border border-white/5 rounded-lg p-4 gap-6 self-start md:self-end w-full md:w-auto overflow-x-auto">
          {/* Friday */}
          <div className="flex flex-col min-w-[140px]">
            <span className="font-heading text-[11px] text-white/40 uppercase mb-1">{getDayName(fp1Date)}</span>
            <span className="font-mono text-[13px] text-white mb-3">{formatDateStr(fp1Date)}</span>
            <div className="flex justify-between items-center mb-1">
              <span className="font-body text-[12px] text-white/60">FP1</span>
              <span className="font-mono text-[12px] text-f1-red">13:30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-[12px] text-white/60">FP2</span>
              <span className="font-mono text-[12px] text-f1-red">17:00</span>
            </div>
          </div>
          
          <div className="w-[1px] bg-white/[0.08]" />

          {/* Saturday */}
          <div className="flex flex-col min-w-[140px]">
            <span className="font-heading text-[11px] text-white/40 uppercase mb-1">{getDayName(qualiDate)}</span>
            <span className="font-mono text-[13px] text-white mb-3">{formatDateStr(qualiDate)}</span>
            <div className="flex justify-between items-center mb-1">
              <span className="font-body text-[12px] text-white/60">FP3</span>
              <span className="font-mono text-[12px] text-f1-red">12:30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-[12px] text-white/60">QUALIFYING</span>
              <span className="font-mono text-[12px] text-f1-red">16:00</span>
            </div>
          </div>

          <div className="w-[1px] bg-white/[0.08]" />

          {/* Sunday */}
          <div className="flex flex-col min-w-[140px]">
            <span className="font-heading text-[11px] text-white/40 uppercase mb-1">{getDayName(raceDate)}</span>
            <span className="font-mono text-[13px] text-white mb-3">{formatDateStr(raceDate)}</span>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-body text-[12px] text-white/60">RACE</span>
              <span className="font-mono text-[12px] text-f1-red">15:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
