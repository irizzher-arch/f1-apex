import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useConstructorStandings } from '@/hooks/useConstructorStandings';
import { useDriverStandings } from '@/hooks/useDriverStandings';
import { useOpenF1Drivers } from '@/hooks/useOpenF1Drivers';
import { getCarImageUrl } from '@/utils/carImageUrl';
import { TEAM_LOGOS, TEAM_CARS } from '@/utils/assets';
import { engineSupplierMap } from '@/utils/engineSupplierMap';

const fallbackColors = {
  mercedes: '#00D2BE',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  red_bull: '#3671C6',
  aston_martin: '#358C75',
  alpine: '#FF87BC',
  williams: '#64C4FF',
  rb: '#6692FF',
  haas: '#B6BABD',
  kick_sauber: '#52E252',
  sauber: '#52E252',
  audi: '#52E252',
  cadillac: '#B0B0B0'
};

export const TeamsPage = () => {
  const currentCalendarYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentCalendarYear);
  const navigate = useNavigate();

  const { data: teamStandings, isLoading: cLoading } = useConstructorStandings(selectedYear);
  const { data: driverStandings, isLoading: dLoading } = useDriverStandings(selectedYear);
  const { data: openF1Drivers, isLoading: oLoading } = useOpenF1Drivers(selectedYear);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const years = [currentCalendarYear - 3, currentCalendarYear - 2, currentCalendarYear - 1, currentCalendarYear];

  // Auto-fallback if current year has no data
  useEffect(() => {
    if (selectedYear === currentCalendarYear && !cLoading && (!teamStandings || teamStandings.length === 0)) {
      setSelectedYear(currentCalendarYear - 1);
    }
  }, [selectedYear, currentCalendarYear, cLoading, teamStandings]);

  const isLoading = cLoading || dLoading || oLoading;

  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="pt-24 pb-12 px-6 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10">
        <div>
          <span className="font-mono text-[10px] text-f1-red font-bold tracking-[0.25em] uppercase mb-2 block">
            F1 Constructors Grid
          </span>
          <h1 className="font-heading font-black text-5xl uppercase tracking-tight m-0">
            {selectedYear} Teams
          </h1>
        </div>

        {/* Year Selector */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                selectedYear === y 
                  ? 'bg-f1-red text-white shadow-[0_0_15px_rgba(232,0,45,0.4)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[400px] bg-white/5 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamStandings?.map((teamObj, index) => {
              const constructor = teamObj.Constructor;
              const constructorId = constructor.constructorId;
              
              // Find drivers for this team
              const driversForTeam = driverStandings 
                ? driverStandings.filter(d => d.Constructors[0]?.constructorId === constructorId)
                : [];

              // Get Color
              let teamColor = fallbackColors[constructorId] || '#FFFFFF';
              if (openF1Drivers && driversForTeam.length > 0) {
                const permNum = driversForTeam[0].Driver.permanentNumber;
                if (openF1Drivers[permNum]?.team_colour) {
                  teamColor = `#${openF1Drivers[permNum].team_colour}`;
                }
              }

              // Use official F1 media car render if available, otherwise try F1 dashboard CDN
              const carUrl = TEAM_CARS[constructorId] || getCarImageUrl(selectedYear, constructorId);
              const teamLogoUrl = TEAM_LOGOS[constructorId]?.replace('logowhite.webp', 'logo.webp');
              const engineSupplier = engineSupplierMap[constructorId] || 'Unknown';

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={constructorId}
                  className="group relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 shadow-2xl flex flex-col"
                >
                  {/* Subtle Background Glow */}
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${teamColor} 0%, transparent 70%)` }}
                  />

                  {/* Top Bar Color Strip */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: teamColor }} />

                  {/* Header Row: Logo & Name */}
                  <div className="p-8 pb-0 flex justify-between items-start z-10">
                    <div className="flex flex-col">
                      <h2 className="font-heading font-black text-3xl uppercase leading-none text-white tracking-wide">
                        {constructor.name}
                      </h2>
                      <div className="font-mono text-xs text-white/50 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span>Engine: <strong className="text-white/80">{engineSupplier}</strong></span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Pts: <strong className="text-white/80">{teamObj.points}</strong></span>
                      </div>
                    </div>
                    
                    {teamLogoUrl ? (
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-3 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <img 
                          src={teamLogoUrl} 
                          alt={constructor.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            e.target.onerror = null;
                            if (TEAM_LOGOS[constructorId]) {
                              e.target.src = TEAM_LOGOS[constructorId]; // Fallback to white logo if colored one fails
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 font-heading font-bold text-xl group-hover:scale-110 transition-transform duration-500" style={{ color: teamColor }}>
                        {constructor.name.substring(0,3).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Middle: Car Image */}
                  <div className="relative w-full h-[220px] flex items-center justify-center p-4 z-10 mt-4 mb-4">
                    <img 
                      src={carUrl} 
                      alt={`${constructor.name} Car`}
                      className="max-w-[90%] max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallbackUrl = getCarImageUrl(selectedYear - 1, constructorId);
                        if (e.target.src !== fallbackUrl) {
                          e.target.src = fallbackUrl;
                        } else {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="font-mono text-white/20 text-sm tracking-widest mt-12">CAR RENDER UNAVAILABLE</div>`;
                        }
                      }}
                    />
                  </div>

                  {/* Bottom: Driver Lineup */}
                  <div className="mt-auto p-6 bg-white/5 border-t border-white/10 flex justify-between items-center z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      {driversForTeam.map((d) => (
                        <div key={d.Driver.driverId} className="flex items-center gap-3">
                          <div className="font-heading font-black text-2xl text-white/40 group-hover:text-white transition-colors" style={{ color: teamColor }}>
                            {d.Driver.permanentNumber}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-sans text-[10px] text-white/50 uppercase tracking-widest leading-none mb-0.5">
                              {d.Driver.givenName}
                            </span>
                            <span className="font-heading font-bold text-sm uppercase text-white leading-none">
                              {d.Driver.familyName}
                            </span>
                          </div>
                        </div>
                      ))}
                      {driversForTeam.length === 0 && (
                        <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
                          Lineup TBA
                        </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
