import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { useStore } from '@/store/useStore';
import { useErgast } from '@/hooks/useErgast';
import { DRIVER_IMAGES, TEAM_LOGOS } from '@/utils/assets';

export const Home = () => {
  const setActiveTab = useStore(state => state.setActiveTab);
  const { fetchResults } = useErgast();
  const [latestRace, setLatestRace] = useState(null);
  const [seasonStats, setSeasonStats] = useState(null);

  useEffect(() => {
    fetchResults('current', 'last').then(setLatestRace);
    fetch('/api/season-stats.json')
      .then(res => res.json())
      .then(setSeasonStats)
      .catch(console.error);
  }, [fetchResults]);

  const podium = latestRace?.Results?.slice(0, 3) || [];

  return (
    <div className="w-full">
      {/* Top Fold: Cinematic Hero */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <HeroBanner />
      </div>

      {/* Content Below Hero */}
      <div className="flex flex-col gap-24 py-24 w-full max-w-7xl mx-auto px-6">
        
        {/* Section 2: Latest Race Highlight */}
        {latestRace && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
              <img src="https://media.formula1.com/image/upload/t_16by9South/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Bahrain.jpg" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-50 transition-opacity duration-500" alt="Podium" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8 z-10">
                <span className="text-f1-red font-bold tracking-widest text-sm uppercase">Latest Result</span>
                <h2 className="text-4xl font-heading font-black text-white mt-2 drop-shadow-md">{latestRace.raceName}</h2>
                <button onClick={() => { setActiveTab('RESULTS'); window.scrollTo(0,0); }} className="mt-6 border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold uppercase text-sm transition-colors">
                  View Classification
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              {podium.map((result, index) => {
                const driverImg = DRIVER_IMAGES[result.Driver.driverId] || "https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1/common/f1/2026/fallbackdriverright.webp";
                const teamLogo = TEAM_LOGOS[result.Constructor.constructorId];
                
                return (
                  <div key={result.position} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute right-0 bottom-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none transform translate-x-4 translate-y-4">
                      {teamLogo && <img src={teamLogo} alt="Team" className="w-full h-full object-contain grayscale" />}
                    </div>
                    
                    <span className="text-4xl font-black font-heading text-white/20 w-12 text-center">{result.position}</span>
                    
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 bg-black/50">
                      <img src={driverImg} alt={result.Driver.familyName} className="w-full h-full object-cover object-top" />
                    </div>
                    
                    <div className="flex-1 relative z-10">
                      <h3 className="text-xl font-bold text-white uppercase truncate">{result.Driver.givenName} {result.Driver.familyName}</h3>
                      <div className="flex justify-between items-center pr-2 mt-0.5">
                        <span className="text-sm text-text-secondary uppercase truncate">{result.Constructor.name}</span>
                        <span className="text-f1-red font-bold text-sm whitespace-nowrap bg-f1-red/10 px-2 py-0.5 rounded-md">{result.points} PTS</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Section 1.5: Beginner Guide Promo */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(232,0,45,0.15)] group cursor-pointer"
          onClick={() => window.location.href = '/learn'}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-f1-red/5 z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(232,0,45,0.2)_0%,transparent_70%)] opacity-50" />
          </div>
          <div className="relative z-20 p-12 md:p-16 flex flex-col items-start max-w-2xl">
            <span className="text-f1-red font-bold tracking-widest text-sm uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-f1-red animate-pulse" />
              New to Formula 1?
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase drop-shadow-md leading-tight">
              The Ultimate <span className="text-f1-red">Starter Pack</span>
            </h2>
            <p className="text-text-secondary font-mono mt-4 mb-8 text-sm md:text-base leading-relaxed">
              Everything you need to watch, understand, and love Formula 1 from your very first race. 15 interactive chapters covering rules, strategy, technology, and more.
            </p>
            <button className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full font-bold uppercase text-sm transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Start Learning
            </button>
          </div>
          <div className="absolute top-[-20%] right-[30%] w-[1px] h-[150%] bg-white/10 transform rotate-[30deg] z-10" />
          <div className="absolute top-[-20%] right-[32%] w-[3px] h-[150%] bg-f1-red/20 transform rotate-[30deg] z-10" />
        </motion.section>

        {/* Season Stats Cards */}
        {seasonStats && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Fastest Pit Stop */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:bg-white/10 transition-colors group shadow-lg">
              <h3 className="text-text-secondary font-mono text-sm uppercase tracking-wider mb-2">2026 Fastest Pit Stop</h3>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black font-heading text-white drop-shadow-md">{seasonStats.fastestPitStop.time}</span>
                <span className="text-2xl text-f1-red font-bold mb-1">s</span>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center p-1.5 group-hover:bg-white/20 transition-colors">
                  <img src={TEAM_LOGOS['ferrari'] || 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/ferrari'} alt="Ferrari" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm uppercase">{seasonStats.fastestPitStop.driver} - Round {seasonStats.fastestPitStop.round}</div>
                  <div className="text-text-secondary text-[10px] flex items-center gap-1.5 mt-0.5 uppercase tracking-widest font-mono">
                    <img src={`https://flagsapi.com/JP/flat/24.png`} alt="Japan" className="w-4 h-4 rounded-sm" /> {seasonStats.fastestPitStop.country}
                  </div>
                </div>
              </div>
            </div>

            {/* Crash Damage */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:bg-white/10 transition-colors shadow-lg">
              <h3 className="text-text-secondary font-mono text-sm uppercase tracking-wider mb-2">2026 Crash Damage Total Costs</h3>
              <div className="text-4xl font-black font-heading text-white drop-shadow-md">${seasonStats.crashDamage.total.toLocaleString()}</div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-f1-red font-bold text-sm">+ ${seasonStats.crashDamage.sinceLastRace.toLocaleString()}</div>
                <div className="text-text-secondary text-[10px] font-mono uppercase tracking-widest mt-1">since last race</div>
              </div>
            </div>

            {/* Total Used Elements */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:bg-white/10 transition-colors shadow-lg">
              <h3 className="text-text-secondary font-mono text-sm uppercase tracking-wider mb-2">2026 Total Used Elements</h3>
              <div className="text-4xl font-black font-heading text-white drop-shadow-md">{seasonStats.usedElements.total}</div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-[#34D399] font-bold text-sm">
                  + {seasonStats.usedElements.sinceLastRace} <span className="opacity-70">(+{seasonStats.usedElements.percentageChange}%)</span>
                </div>
                <div className="text-text-secondary text-[10px] font-mono uppercase tracking-widest mt-1">since last race</div>
              </div>
            </div>

            {/* Total Tech Upgrades */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:bg-white/10 transition-colors shadow-lg">
              <h3 className="text-text-secondary font-mono text-sm uppercase tracking-wider mb-2">2026 Total Tech Upgrades</h3>
              <div className="text-4xl font-black font-heading text-white drop-shadow-md">{seasonStats.techUpgrades.total}</div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-[#34D399] font-bold text-sm">
                  + {seasonStats.techUpgrades.sinceLastRace} <span className="opacity-70">(+{seasonStats.techUpgrades.percentageChange}%)</span>
                </div>
                <div className="text-text-secondary text-[10px] font-mono uppercase tracking-widest mt-1">since last race</div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Section 3: Championship Snapshot */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative w-full rounded-3xl overflow-hidden p-16 border border-white/10 shadow-2xl"
        >
           <img src="https://media.formula1.com/image/upload/t_16by9South/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Monaco.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay grayscale" alt="Championship" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/80" />
           
           <div className="relative z-10 text-center mb-10">
             <h2 className="text-4xl font-heading font-black text-white uppercase tracking-widest drop-shadow-lg">2026 Championship Battle</h2>
             <p className="text-text-secondary mt-3 font-mono">The fight for the title is closer than ever.</p>
           </div>

           <div className="relative z-10 flex justify-center">
             <button onClick={() => { setActiveTab('STANDINGS'); window.scrollTo(0,0); }} className="bg-f1-red text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(232,0,45,0.4)]">
               View Full Standings
             </button>
           </div>
        </motion.section>

        {/* Section 4: Telemetry Features */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div onClick={() => { setActiveTab('H2H'); window.scrollTo(0,0); }} className="group cursor-pointer relative h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-lg">
            <img src="https://media.formula1.com/image/upload/t_16by9South/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Spain.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 grayscale" alt="H2H" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-black text-white uppercase drop-shadow-md">Head to Head</h3>
              <p className="text-text-secondary font-mono text-sm mt-1">Compare advanced driver telemetry directly.</p>
            </div>
          </div>
          <div onClick={() => { setActiveTab('PACE'); window.scrollTo(0,0); }} className="group cursor-pointer relative h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-lg">
            <img src="https://media.formula1.com/image/upload/t_16by9South/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Italy.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 grayscale" alt="Pace" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-black text-white uppercase drop-shadow-md">Race Pace Analysis</h3>
              <p className="text-text-secondary font-mono text-sm mt-1">Analyze tire degradation and stint times.</p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};
