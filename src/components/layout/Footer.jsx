import React from 'react';
import { useStore } from '@/store/useStore';

export const Footer = () => {
  const setActiveTab = useStore(state => state.setActiveTab);

  return (
    <footer className="relative w-full border-t border-white/10 mt-20 z-20">
      {/* Background gradients for the footer */}
      <div className="absolute inset-0 bg-background-base opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-f1-red/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="w-[100px]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="F1 Logo" className="w-full h-auto brightness-0 saturate-100" style={{ filter: 'invert(19%) sepia(91%) saturate(7351%) hue-rotate(352deg) brightness(97%) contrast(114%)' }} />
            </div>
            <p className="text-text-secondary text-sm font-mono max-w-md leading-relaxed">
              APEX is a next-generation fan intelligence dashboard. Built with React and powered by real-time and historical telemetry data. Unofficial and unaffiliated with the Formula 1 companies.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://twitter.com/F1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-f1-red hover:bg-f1-red/20 transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
              </a>
              <a href="https://instagram.com/F1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-f1-red hover:bg-f1-red/20 transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com/F1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-f1-red hover:bg-f1-red/20 transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-heading font-bold uppercase tracking-widest text-lg mb-2">Platform</h3>
            <button onClick={() => { setActiveTab('LIVE'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Live Timing</button>
            <button onClick={() => { setActiveTab('SCHEDULE'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Race Schedule</button>
            <button onClick={() => { setActiveTab('STANDINGS'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Championship Standings</button>
            <button onClick={() => { setActiveTab('RESULTS'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Historical Results</button>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-heading font-bold uppercase tracking-widest text-lg mb-2">Analytics</h3>
            <button onClick={() => { setActiveTab('H2H'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Head-to-Head Stats</button>
            <button onClick={() => { setActiveTab('PACE'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Race Pace Analysis</button>
            <button onClick={() => { setActiveTab('PITS'); window.scrollTo(0,0); }} className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Pit Stop Performance</button>
            <a href="https://ergast.com/mrd/" target="_blank" rel="noopener noreferrer" className="text-left text-text-secondary hover:text-f1-red transition-colors text-sm font-mono">Telemetry Documentation</a>
          </div>

        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-text-secondary/50">
          <p>© {new Date().getFullYear()} APEX Intelligence. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => { setActiveTab('PRIVACY'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => { setActiveTab('TERMS'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => { setActiveTab('DISCLAIMER'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">Data Disclaimer</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

