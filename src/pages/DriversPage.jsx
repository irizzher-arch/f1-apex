import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useDriverStandings } from '@/hooks/useDriverStandings';
import { useOpenF1Drivers } from '@/hooks/useOpenF1Drivers';
import { getDriverImageUrl } from '@/utils/driverImageUrl';
import { getCountryFlagSlug } from '@/utils/countryFlagMap';
import { DRIVER_IMAGES } from '@/utils/assets';

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

export const DriversPage = () => {
  const currentCalendarYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentCalendarYear);
  const navigate = useNavigate();

  const { data: driverStandings, isLoading: dLoading } = useDriverStandings(selectedYear);
  const { data: openF1Drivers, isLoading: oLoading } = useOpenF1Drivers(selectedYear);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const years = [currentCalendarYear - 3, currentCalendarYear - 2, currentCalendarYear - 1, currentCalendarYear];

  // Auto-fallback if current year has no data
  useEffect(() => {
    if (selectedYear === currentCalendarYear && !dLoading && (!driverStandings || driverStandings.length === 0)) {
      setSelectedYear(currentCalendarYear - 1);
    }
  }, [selectedYear, currentCalendarYear, dLoading, driverStandings]);

  const isLoading = dLoading || oLoading;

  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="pt-24 pb-12 px-6 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10">
        <div>
          <span className="font-mono text-[10px] text-f1-red font-bold tracking-[0.25em] uppercase mb-2 block">
            F1 Drivers Grid
          </span>
          <h1 className="font-heading font-black text-5xl uppercase tracking-tight m-0">
            {selectedYear} Drivers
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {driverStandings?.map((driverObj, index) => {
              const driver = driverObj.Driver;
              const constructor = driverObj.Constructors[0];
              const constructorId = constructor?.constructorId;
              const permNum = driver.permanentNumber;
              
              const openF1Data = openF1Drivers && permNum ? openF1Drivers[permNum] : null;
              const teamColor = (openF1Data?.team_colour && `#${openF1Data.team_colour}`) || fallbackColors[constructorId] || '#FFFFFF';
              const headshotUrl = openF1Data?.headshot_url;
              
              const primaryImg = getDriverImageUrl(selectedYear, driver.familyName);
              const finalImg = primaryImg || headshotUrl;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={driver.driverId}
                  className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl"
                >
                  {/* Team Color Top Border */}
                  <div className="absolute top-0 left-0 w-full h-[4px] z-20" style={{ backgroundColor: teamColor }} />

                  {/* Top Info Row */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                    <div className="font-heading font-black text-6xl leading-none opacity-20 group-hover:opacity-100 transition-opacity duration-300" style={{ color: teamColor }}>
                      {permNum}
                    </div>
                    <img 
                      src={`https://flagcdn.com/32x24/${getCountryFlagSlug(driver.nationality)}.png`} 
                      alt={driver.nationality}
                      className="w-8 h-6 rounded-sm shadow-md"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>

                  {/* Driver Portrait */}
                  <div className="w-full aspect-[4/5] relative bg-gradient-to-t from-black via-black/20 to-transparent">
                    {finalImg ? (
                      <img 
                        src={finalImg} 
                        alt={driver.familyName}
                        className="absolute bottom-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop
                          if (e.target.src !== headshotUrl && headshotUrl) {
                            e.target.src = headshotUrl;
                          } else if (e.target.src !== DRIVER_IMAGES[driver.driverId] && DRIVER_IMAGES[driver.driverId]) {
                            e.target.src = DRIVER_IMAGES[driver.driverId];
                          } else {
                            e.target.src = 'https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1/common/f1/2026/fallbackdriverright.webp';
                          }
                        }}
                      />
                    ) : (
                      <div className="absolute bottom-0 w-full h-full flex items-center justify-center font-heading font-bold text-6xl text-white/10">
                        {driver.code || driver.familyName.substring(0,3).toUpperCase()}
                      </div>
                    )}
                    {/* Gradient Overlay for Text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-col">
                      <span className="font-sans text-xs text-white/70 uppercase tracking-widest mb-1">
                        {driver.givenName}
                      </span>
                      <span className="font-heading font-black text-2xl uppercase leading-none truncate text-white">
                        {driver.familyName}
                      </span>
                    </div>
                    
                    <div className="w-full h-px bg-white/10 my-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-bold text-[11px] uppercase tracking-wider truncate max-w-[60%]" style={{ color: teamColor }}>
                        {constructor?.name || 'Unknown Team'}
                      </span>
                      <span className="font-mono text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                        {driverObj.points} PTS
                      </span>
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
