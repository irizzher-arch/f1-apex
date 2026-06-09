import React from 'react';
import { ChapterWrapper } from '../ChapterWrapper';
import { ConceptCard } from '../shared/ConceptCard';
import { QuizCard } from '../shared/QuizCard';
import { ChapterFooter } from '../shared/ChapterFooter';

export const Ch01TheBasics = () => {
  return (
    <ChapterWrapper
      id="ch01"
      num="01"
      title="THE BASICS"
      hook="Formula 1 is the fastest, most technologically advanced motorsport on Earth."
    >
      {/* BLOCK A — "WHAT IS F1?" intro paragraph */}
      <div className="font-inter text-[15px] text-white/72 leading-[1.85] space-y-4 max-w-3xl">
        <p>
          At its core, <strong className="text-white">Formula 1</strong> is an engineering and driving competition regulated by the <strong className="text-white">FIA</strong> (Fédération Internationale de l'Automobile). Ten teams construct their own completely unique cars according to a strict rulebook—the "formula"—and race them around the globe.
        </p>
        <p>
          Every season is actually two separate but simultaneous competitions: The <strong className="text-white">Drivers' Championship</strong>, where individual drivers fight for glory, and the <strong className="text-white">Constructors' Championship</strong>, where the teams battle for massive financial rewards based on their combined points.
        </p>
      </div>

      {/* BLOCK B — THE NUMBERS CARD GRID (4 cards, 2×2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col items-center text-center hover:bg-white/[0.05] transition-colors">
          <div className="font-mono text-[36px] text-f1-red font-bold leading-none mb-2">10 TEAMS</div>
          <div className="font-inter text-[13px] text-white/55">20 drivers racing for 2 world championships</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col items-center text-center hover:bg-white/[0.05] transition-colors">
          <div className="font-mono text-[36px] text-f1-red font-bold leading-none mb-2">24 RACES</div>
          <div className="font-inter text-[13px] text-white/55">Across 5 continents, from Bahrain to Las Vegas</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col items-center text-center hover:bg-white/[0.05] transition-colors">
          <div className="font-mono text-[36px] text-f1-red font-bold leading-none mb-2">300+ KM/H</div>
          <div className="font-inter text-[13px] text-white/55">Top speeds reached on race straights</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col items-center text-center hover:bg-white/[0.05] transition-colors">
          <div className="font-mono text-[36px] text-f1-red font-bold leading-none mb-2">1.6L V6</div>
          <div className="font-inter text-[13px] text-white/55">Turbo hybrid engines producing 1000+ horsepower</div>
        </div>
      </div>

      {/* BLOCK C — THE TWO CHAMPIONSHIPS visual */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 relative">
        <div className="flex-1">
          <ConceptCard 
            title="DRIVERS' CHAMPIONSHIP"
            borderColor="#E8002D"
            bgTint
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-f1-red"><path d="M12 2C7.58 2 4 5.58 4 10v6c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-6c0-4.42-3.58-8-8-8z"/><path d="M4 14h16"/><circle cx="12" cy="14" r="2"/></svg>
            }
            content="Each driver earns points per race based on their finishing position. The driver with the most points at the end of the season is crowned the World Champion."
          />
        </div>

        {/* Plus Symbol */}
        <div className="hidden lg:flex items-center justify-center shrink-0 w-8">
          <div className="text-white/30 text-2xl font-bold">+</div>
        </div>

        <div className="flex-1">
          <ConceptCard 
            title="CONSTRUCTORS' CHAMPIONSHIP"
            borderColor="#00D2BE"
            bgTint
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00D2BE]"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            }
            content="Each team earns the combined points of both their drivers. The team title is arguably worth more financially, determining prize money distribution."
          />
        </div>
      </div>

      {/* BLOCK D — QUICK QUIZ CARD */}
      <div className="mt-4">
        <QuizCard 
          question="How many drivers are on the F1 grid during a typical race?"
          options={["18", "20", "22"]}
          correctAnswer={1} // index for "20"
          explanation="Each of the 10 teams runs exactly 2 drivers per race, making 20 drivers total on the grid."
        />
      </div>

      {/* FOOTER */}
      <ChapterFooter 
        keyTakeaway="F1 is a team sport disguised as an individual sport. The driver gets the glory, but the team gets the money."
        nextChapterId="ch02"
        nextChapterTitle="THE RACE WEEKEND"
      />
    </ChapterWrapper>
  );
};
