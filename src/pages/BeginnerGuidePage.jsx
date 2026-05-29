import React, { useEffect, useState } from 'react';
import { GuideSidebar } from '@/components/guide/GuideSidebar';
import { GuideHeroBanner } from '@/components/guide/GuideHeroBanner';
import { Ch01TheBasics } from '@/components/guide/chapters/Ch01TheBasics';
import { Ch02RaceWeekend } from '@/components/guide/chapters/Ch02RaceWeekend';
import { Ch03Qualifying } from '@/components/guide/chapters/Ch03Qualifying';
import { Ch04SprintWeekend } from '@/components/guide/chapters/Ch04SprintWeekend';
import { Ch05RaceDay } from '@/components/guide/chapters/Ch05RaceDay';
import { Ch06Flags } from '@/components/guide/chapters/Ch06Flags';
import { Ch07SafetyCar } from '@/components/guide/chapters/Ch07SafetyCar';
import { Ch08Tyres } from '@/components/guide/chapters/Ch08Tyres';
import { Ch09DRS } from '@/components/guide/chapters/Ch09DRS';
import { Ch10PitStops } from '@/components/guide/chapters/Ch10PitStops';
import { Ch11Points } from '@/components/guide/chapters/Ch11Points';
import { Ch12TeamsAndCars } from '@/components/guide/chapters/Ch12TeamsAndCars';
import { Ch13TimingTower } from '@/components/guide/chapters/Ch13TimingTower';
import { Ch14Strategy } from '@/components/guide/chapters/Ch14Strategy';
import { Ch15Glossary } from '@/components/guide/chapters/Ch15Glossary';
import { CompletionScreen } from '@/components/guide/CompletionScreen';

export const BeginnerGuidePage = () => {
  const [activeChapter, setActiveChapter] = useState('ch01');
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  useEffect(() => {
    // Simple intersection observer to update active chapter
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveChapter(entry.target.id);
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    const chapters = document.querySelectorAll('section.chapter-section');
    chapters.forEach(ch => observer.observe(ch));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-inter flex relative overflow-x-hidden">
      <GuideSidebar activeChapter={activeChapter} />
      
      <main className="flex-1 lg:ml-[240px] w-full min-h-screen pb-[120px]">
        <GuideHeroBanner />
        
        <div className="w-full max-w-[900px] px-6 lg:px-10 mx-auto mt-16 flex flex-col gap-24">
          <div className="flex flex-col w-full">
            <Ch01TheBasics />
            <Ch02RaceWeekend />
            <Ch03Qualifying />
            <Ch04SprintWeekend />
            <Ch05RaceDay />
            <Ch06Flags />
            <Ch07SafetyCar />
            <Ch08Tyres />
            <Ch09DRS />
            <Ch10PitStops />
            <Ch11Points />
            <Ch12TeamsAndCars />
            <Ch13TimingTower />
            <Ch14Strategy />
            <Ch15Glossary onComplete={() => setShowCompletionScreen(true)} />
          </div>
        </div>
      </main>

      {showCompletionScreen && (
        <CompletionScreen onClose={() => setShowCompletionScreen(false)} />
      )}
    </div>
  );
};
