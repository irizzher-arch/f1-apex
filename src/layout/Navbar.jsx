import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

const NAV_ITEMS = [
  { id: 'SCHEDULE', label: 'SCHEDULE' },
  { id: 'RESULTS', label: 'RESULTS' },
  { id: 'STANDINGS', label: 'STANDINGS' },
  { id: 'H2H', label: 'HEAD 2 HEAD' },
  { id: 'PACE', label: 'RACE PACE' },
  { id: 'PITS', label: 'PIT STOPS' },
  { id: 'LIVE', label: 'LIVE TIMING' }
];

export const Navbar = () => {
  const { activeTab } = useStore(state => state.ui);
  const setActiveTab = useStore(state => state.setActiveTab);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // The hero section is 100vh. Trigger the solid navbar when we scroll past it.
      setScrolled(window.scrollY > window.innerHeight - 70);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = activeTab === 'HOME' && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[70px] z-[100] flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${isTransparent ? 'bg-transparent border-transparent' : 'bg-black border-b border-white/5'}`}
         style={{ background: isTransparent ? 'transparent' : 'rgba(10,10,12,1)' }}>
      
      {/* Left: F1 Logo (Links to HOME) */}
      <button onClick={() => { setActiveTab('HOME'); window.scrollTo(0,0); }} className="w-[80px] hover:scale-105 transition-transform duration-200">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="F1 Logo" className="w-full h-auto brightness-0 saturate-100" style={{ filter: 'invert(19%) sepia(91%) saturate(7351%) hue-rotate(352deg) brightness(97%) contrast(114%)' }} />
      </button>
      
      {/* Center: Navigation Pill */}
      <div className="hidden md:flex border border-white/10 bg-black/40 rounded-full p-1 items-center backdrop-blur-md">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); window.scrollTo(0,0); }}
            className={`uppercase tracking-[0.08em] text-[12px] whitespace-nowrap transition-colors duration-200 px-5 py-[8px] rounded-full ${
              (activeTab === item.id)
                ? 'bg-white text-black font-[800]' 
                : 'text-white/60 hover:bg-white/10 hover:text-white font-[500]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <a href="https://f1tv.formula1.com/" target="_blank" rel="noreferrer" className="hidden md:flex items-center bg-[#E8002D] text-white rounded-full px-5 py-[8px] text-[12px] font-[800] uppercase hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(232,0,45,0.5)] transition-all duration-200">
          <span className="w-1.5 h-1.5 bg-[#C20026] rounded-full mr-2 animate-pulse" />
          F1 TV
        </a>
      </div>
    </nav>
  );
};
