import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

export const GuideSidebar = ({ activeChapter }) => {
  const { scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest * 100);
    });
  }, [scrollYProgress]);

  const chapters = [
    { id: 'ch01', title: '01 · THE BASICS' },
    { id: 'ch02', title: '02 · THE RACE WEEKEND' },
    { id: 'ch03', title: '03 · QUALIFYING EXPLAINED' },
    { id: 'ch04', title: '04 · THE SPRINT WEEKEND' },
    { id: 'ch05', title: '05 · RACE DAY' },
    { id: 'ch06', title: '06 · FLAGS & SIGNALS' },
    { id: 'ch07', title: '07 · SAFETY CAR & VSC' },
    { id: 'ch08', title: '08 · TYRE COMPOUNDS' },
    { id: 'ch09', title: '09 · DRS SYSTEM' },
    { id: 'ch10', title: '10 · PIT STOPS' },
    { id: 'ch11', title: '11 · POINTS SYSTEM' },
    { id: 'ch12', title: '12 · THE TEAMS & CARS' },
    { id: 'ch13', title: '13 · READING THE TIMING TOWER' },
    { id: 'ch14', title: '14 · RACE STRATEGY' },
    { id: 'ch15', title: '15 · F1 GLOSSARY' },
  ];

  const scrollToChapter = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 w-[240px] h-screen bg-[#050508] border-r border-white/10 z-50 pt-8 pb-4">
        {/* Progress Bar Container */}
        <div className="absolute top-0 right-0 w-[4px] h-full bg-white/5">
          <motion.div 
            className="w-full bg-f1-red"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
        
        <div className="px-6 mb-8 flex flex-col gap-2 relative">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-white transition-colors mb-4">
            <span>←</span> BACK TO DASHBOARD
          </button>
          <h2 className="font-heading text-f1-red text-[14px] uppercase tracking-widest font-bold">
            F1 Beginner's Guide
          </h2>
          <div className="text-[10px] font-mono text-white/35 mt-1">
            {Math.round(scrollProgress)}% COMPLETE
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-1 pb-10 relative">
          {chapters.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id)}
                className={`text-left text-[12px] font-inter px-4 py-2.5 transition-all duration-150 ${
                  isActive 
                    ? 'text-white bg-f1-red/5 border-l-3 border-f1-red font-medium' 
                    : 'text-white/50 border-l-3 border-transparent hover:text-white hover:bg-white/5'
                }`}
                style={{ borderLeftWidth: '3px' }}
              >
                {ch.title}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-[60px] bg-[#050508]/95 backdrop-blur-md border-t border-white/10 z-50 flex items-center overflow-x-auto no-scrollbar px-4 gap-2">
        {chapters.map((ch) => {
          const isActive = activeChapter === ch.id;
          const num = ch.title.split(' ')[0]; // Gets "01"
          return (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id)}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                isActive ? 'bg-f1-red text-white' : 'bg-white/5 text-white/50'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </>
  );
};
