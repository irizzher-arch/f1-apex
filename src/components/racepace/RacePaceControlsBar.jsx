import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useErgastSchedule, useDriverData, useOpenF1Session } from '@/hooks/useRacePaceQueries';
import { teamColors } from '@/utils/teamColors';

export const RacePaceControlsBar = () => {
  const { racePace, setRacePaceState, toggleRacePaceDriver } = useStore();
  const { year, round, sessionKey, selectedDrivers } = racePace;
  
  // Available Years
  const years = Array.from({ length: 9 }, (_, i) => 2026 - i); // 2018-2026
  
  // Queries
  const { data: schedule } = useErgastSchedule(year);
  const { data: session } = useOpenF1Session(year, round);
  const { data: drivers } = useDriverData(sessionKey);
  
  // Update session key in global store when it changes
  useEffect(() => {
    if (session?.session_key) {
      setRacePaceState({ sessionKey: session.session_key });
    }
  }, [session, setRacePaceState]);

  // When drivers load, select top 3 by default if none selected
  useEffect(() => {
    if (drivers && drivers.length > 0 && selectedDrivers.length === 0) {
      setRacePaceState({ selectedDrivers: [drivers[0].driver_number, drivers[1].driver_number, drivers[2].driver_number] });
    }
  }, [drivers, selectedDrivers, setRacePaceState]);

  return (
    <div className="sticky top-[72px] w-full min-h-[68px] py-3 bg-black/95 backdrop-blur-[20px] border-b border-t border-white/10 z-[90] flex items-center">
      <div className="w-full max-w-[1400px] mx-auto px-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
      
        {/* LEFT: Session Selector */}
        <div className="flex items-center gap-4 min-w-fit lg:min-w-[250px]">
          <select 
            value={year}
            onChange={(e) => setRacePaceState({ year: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-white font-heading font-bold outline-none hover:bg-white/10 transition-colors cursor-pointer"
          >
            {years.map(y => <option key={y} value={y} className="bg-background-base">{y}</option>)}
          </select>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {schedule?.map(r => (
              <button
                key={r.round}
                onClick={() => setRacePaceState({ round: r.round })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-colors border ${String(round) === String(r.round) ? 'bg-f1-red border-f1-red text-white' : 'bg-white/5 border-white/5 text-text-secondary hover:bg-white/10 hover:text-white'}`}
              >
                <img src={`https://flagsapi.com/${r.Circuit.Location.country === 'USA' ? 'US' : r.Circuit.Location.country === 'UK' ? 'GB' : r.Circuit.Location.country.substring(0, 2).toUpperCase()}/flat/16.png`} alt="flag" className="w-3.5 h-3.5 rounded-sm object-cover opacity-80" onError={(e) => e.target.style.display='none'} />
                Rd {r.round}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Driver Filter */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-[300px]">
          <div className="flex gap-1.5 flex-wrap justify-center max-w-2xl">
            <button 
              onClick={() => setRacePaceState({ selectedDrivers: drivers?.map(d => d.driver_number) || [] })}
              className="px-2 py-1 text-[9px] font-mono font-bold uppercase rounded bg-white/5 hover:bg-white/10 text-white/50 border border-white/10"
            >
              ALL
            </button>
            <button 
              onClick={() => setRacePaceState({ selectedDrivers: [] })}
              className="px-2 py-1 text-[9px] font-mono font-bold uppercase rounded bg-white/5 hover:bg-white/10 text-white/50 border border-white/10 mr-2"
            >
              NONE
            </button>
            {drivers?.map(d => {
              const isSelected = selectedDrivers.includes(d.driver_number);
              const tColor = d.team_colour ? `#${d.team_colour}` : (teamColors[d.team_name?.replace(/\s/g, '').toLowerCase()] || '#ffffff');
              const drvName = d.name_acronym || d.last_name?.substring(0,3).toUpperCase() || String(d.driver_number);
              
              return (
                <button
                  key={d.driver_number}
                  onClick={() => toggleRacePaceDriver(d.driver_number)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all border ${isSelected ? 'bg-white/10 text-white' : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'}`}
                  style={{ borderColor: isSelected ? tColor : 'transparent' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tColor }} />
                  {drvName}
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Display Options */}
        <div className="flex items-center gap-4 min-w-fit lg:min-w-[200px] justify-end">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={racePace.showOutlierLaps} onChange={(e) => setRacePaceState({ showOutlierLaps: e.target.checked })} />
            <div className={`block w-8 h-4 rounded-full transition-colors ${racePace.showOutlierLaps ? 'bg-f1-red' : 'bg-white/10'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${racePace.showOutlierLaps ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <span className="text-[10px] font-mono font-bold text-text-secondary group-hover:text-white transition-colors uppercase">Outliers</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={racePace.rollingAvg} onChange={(e) => setRacePaceState({ rollingAvg: e.target.checked })} />
            <div className={`block w-8 h-4 rounded-full transition-colors ${racePace.rollingAvg ? 'bg-f1-red' : 'bg-white/10'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform ${racePace.rollingAvg ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <span className="text-[10px] font-mono font-bold text-text-secondary group-hover:text-white transition-colors uppercase">Rolling Avg</span>
        </label>
      </div>

      </div>
    </div>
  );
};
