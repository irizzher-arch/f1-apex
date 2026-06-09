import React from 'react';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch04SprintWeekend = () => {
  return (
    <ChapterWrapper
      id="ch04"
      num="04"
      title="THE SPRINT WEEKEND"
      hook="Sprint weekends flip the schedule — twice the action, double the tension."
    >
      {/* BLOCK A — SPRINT vs STANDARD WEEKEND COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Weekend */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
          <h3 className="font-heading text-lg font-bold text-white/50 mb-4 tracking-wider">STANDARD WEEKEND</h3>
          <div className="flex flex-col gap-3 font-inter text-[13px] text-white/60">
            <div className="flex border-b border-white/5 pb-2">
              <span className="w-24 font-mono font-bold text-white/40">FRIDAY</span>
              <div className="flex flex-col">
                <span>Free Practice 1</span>
                <span>Free Practice 2</span>
              </div>
            </div>
            <div className="flex border-b border-white/5 pb-2">
              <span className="w-24 font-mono font-bold text-white/40">SATURDAY</span>
              <div className="flex flex-col">
                <span>Free Practice 3</span>
                <span>Qualifying (for GP)</span>
              </div>
            </div>
            <div className="flex">
              <span className="w-24 font-mono font-bold text-white/40">SUNDAY</span>
              <div className="flex flex-col text-white font-medium">
                <span>Grand Prix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sprint Weekend */}
        <div className="bg-[#FF8700]/5 border border-[#FF8700]/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#FF8700] text-black font-bold font-mono text-[10px] px-2 py-1 rounded-bl-md">6 RACES A YEAR</div>
          <h3 className="font-heading text-lg font-bold text-[#FF8700] mb-4 tracking-wider">SPRINT WEEKEND</h3>
          <div className="flex flex-col gap-3 font-inter text-[13px] text-white">
            <div className="flex border-b border-white/10 pb-2 items-center">
              <span className="w-24 font-mono font-bold text-white/70">FRIDAY</span>
              <div className="flex flex-col gap-1">
                <span className="text-white/60">Free Practice 1</span>
                <span className="bg-[#FF8700] text-black font-bold px-2 py-0.5 rounded text-xs w-fit">Sprint Qualifying (SQ)</span>
              </div>
            </div>
            <div className="flex border-b border-white/10 pb-2 items-center">
              <span className="w-24 font-mono font-bold text-white/70">SATURDAY</span>
              <div className="flex flex-col gap-1">
                <span className="bg-[#E8002D] text-white font-bold px-2 py-0.5 rounded text-xs w-fit">SPRINT RACE</span>
                <span>Qualifying (for GP)</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-24 font-mono font-bold text-white/70">SUNDAY</span>
              <div className="flex flex-col font-medium">
                <span>Grand Prix</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-2">
        <span className="bg-[#FF8700]/20 border border-[#FF8700]/30 text-[#FF8700] px-3 py-1 rounded-full text-[11px] font-mono font-bold">NO FP2 OR FP3</span>
        <span className="bg-[#FF8700]/20 border border-[#FF8700]/30 text-[#FF8700] px-3 py-1 rounded-full text-[11px] font-mono font-bold">SPRINT RACE ON SATURDAY</span>
        <span className="bg-[#FF8700]/20 border border-[#FF8700]/30 text-[#FF8700] px-3 py-1 rounded-full text-[11px] font-mono font-bold">GP QUALIFYING HAPPENS AFTER SPRINT</span>
      </div>

      {/* BLOCK B — THE SPRINT RACE CARD */}
      <div className="mt-8">
        <ConceptCard 
          title="THE SPRINT RACE EXPLAINED"
          borderColor="#FF8700"
          bgTint
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF8700]"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="flex flex-col gap-3 font-inter text-sm text-white/70">
              <div><strong className="text-white">Distance:</strong> ~100km (roughly 30% of a full Grand Prix)</div>
              <div><strong className="text-white">Duration:</strong> ~30 minutes</div>
              <div><strong className="text-white">Pit stops:</strong> Optional. Teams usually run one tyre compound for the whole sprint.</div>
              <div><strong className="text-white">Fastest Lap:</strong> No bonus point available.</div>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-lg p-4">
              <div className="font-mono text-[10px] text-[#FF8700] tracking-widest uppercase mb-3">SPRINT POINTS SYSTEM</div>
              <div className="grid grid-cols-4 gap-2 font-mono text-sm text-center">
                <div className="bg-[#FF8700]/20 text-[#FF8700] rounded p-1">P1=8</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P2=7</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P3=6</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P4=5</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P5=4</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P6=3</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P7=2</div>
                <div className="bg-white/5 text-white/80 rounded p-1">P8=1</div>
              </div>
              <div className="text-center font-inter text-xs text-white/40 mt-2">P9–P20 = 0 points</div>
            </div>
          </div>
        </ConceptCard>
      </div>

      {/* BLOCK C — SPRINT QUALIFYING (SQ) EXPLAINED */}
      <div className="mt-8 bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-2">Sprint Qualifying (SQ)</h4>
        <p className="font-inter text-[14px] text-white/70 mb-4">
          Sprint Qualifying on Friday afternoon uses the exact same knockout format as normal qualifying (SQ1, SQ2, SQ3) but with shorter session times (12m, 10m, 8m).
        </p>
        <div className="bg-[#E8002D]/10 border-l-4 border-[#E8002D] p-4 text-sm font-inter text-white">
          <strong>CRITICAL RULE:</strong> The Sprint Qualifying sets the grid for the Sprint Race ONLY. 
          The Grand Prix qualifying on Saturday sets the Sunday race grid. They are completely independent!
        </div>
      </div>

      <ChapterFooter 
        keyTakeaway="Sprint weekends test a team's adaptability. With only 1 hour of practice before qualifying begins, setting up the car correctly from minute one is crucial."
        nextChapterId="ch05"
        nextChapterTitle="RACE DAY"
      />
    </ChapterWrapper>
  );
};
