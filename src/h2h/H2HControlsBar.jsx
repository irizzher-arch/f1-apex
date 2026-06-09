import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useDriverMeta } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const SEASONS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const TEAMS = [
  { id: 'red_bull', name: 'Red Bull Racing', color: teamColors.red_bull || '#3671C6' },
  { id: 'ferrari', name: 'Ferrari', color: teamColors.ferrari || '#E8002D' },
  { id: 'mercedes', name: 'Mercedes', color: teamColors.mercedes || '#27F4D2' },
  { id: 'mclaren', name: 'McLaren', color: teamColors.mclaren || '#FF8000' },
  { id: 'aston_martin', name: 'Aston Martin', color: teamColors.aston_martin || '#229971' },
  { id: 'alpine', name: 'Alpine', color: teamColors.alpine || '#0093CC' },
  { id: 'williams', name: 'Williams', color: teamColors.williams || '#64C4FF' },
  { id: 'rb', name: 'RB', color: teamColors.rb || '#6692FF' },
  { id: 'sauber', name: 'Sauber', color: teamColors.sauber || '#52E252' },
  { id: 'haas', name: 'Haas', color: teamColors.haas || '#B6BABD' },
];

const CustomDriverSelect = ({ value, onChange, options, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOpt = options?.find(o => o.driverId === value);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-transparent text-white font-heading text-lg font-bold uppercase outline-none border-b border-white/20 pb-1 hover:border-white/50 transition-colors"
      >
        <span>{selectedOpt ? `${selectedOpt.code || selectedOpt.familyName.substring(0,3).toUpperCase()} - ${selectedOpt.givenName} ${selectedOpt.familyName}` : 'Select Driver'}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} w-[280px] max-h-[400px] overflow-y-auto bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[100] custom-scrollbar py-2`}
          >
            {options?.map(d => (
              <button
                key={d.driverId}
                onClick={() => { onChange(d.driverId); setIsOpen(false); }}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-white/10 transition-colors group"
              >
                <div className="flex flex-col">
                  <span className={`font-heading uppercase text-sm font-bold ${value === d.driverId ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {d.givenName} {d.familyName}
                  </span>
                  <span className="font-mono text-[10px] text-white/40 tracking-widest">{d.code || d.familyName.substring(0,3).toUpperCase()}</span>
                </div>
                {value === d.driverId && <Check size={14} className="text-f1-red" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomTeamSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTeam = TEAMS.find(t => t.id === value);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[180px] bg-white/5 border border-white/20 text-white text-[11px] font-mono uppercase tracking-widest rounded-md px-3 py-1.5 outline-none hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedTeam && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedTeam.color }} />}
          <span className="truncate">{selectedTeam ? selectedTeam.name : 'Select Team...'}</span>
        </div>
        <ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-1 w-full bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-md shadow-2xl z-[100] py-1"
          >
            {TEAMS.map(t => (
              <button
                key={t.id}
                onClick={() => { onChange(t.id); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${value === t.id ? 'text-white' : 'text-white/60'}`}>{t.name}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const H2HControlsBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { h2h, setH2HState, setH2HSeason } = useStore();
  const { driver1Id, driver2Id, season, comparisonMode, teamId } = h2h;
  
  const { data: drivers } = useDriverMeta(season);

  const handleSeasonChange = (s) => {
    setH2HSeason(s);
    setSearchParams({ d1: driver1Id, d2: driver2Id, year: s });
  };

  const handleDriverChange = (num, newId) => {
    const updates = num === 1 ? { driver1Id: newId } : { driver2Id: newId };
    setH2HState(updates);
    setSearchParams({ 
      d1: num === 1 ? newId : driver1Id, 
      d2: num === 2 ? newId : driver2Id, 
      year: season 
    });
  };

  return (
    <div className="sticky top-[70px] z-[90] h-[64px] bg-black/95 backdrop-blur-[16px] border-b border-white/5 flex items-center justify-between px-6 shadow-xl">
      
      {/* LEFT: Mode Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
          <button 
            onClick={() => setH2HState({ comparisonMode: 'TEAMMATES' })}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${comparisonMode === 'TEAMMATES' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
          >
            Teammates
          </button>
          <button 
            onClick={() => setH2HState({ comparisonMode: 'ANY TWO' })}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${comparisonMode === 'ANY TWO' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
          >
            Any Two Drivers
          </button>
        </div>
        
        {comparisonMode === 'TEAMMATES' && (
          <CustomTeamSelect value={teamId} onChange={(val) => setH2HState({ teamId: val })} />
        )}
      </div>

      {/* CENTER: Driver Selectors */}
      <div className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <CustomDriverSelect 
          value={driver1Id} 
          onChange={(val) => handleDriverChange(1, val)} 
          options={drivers} 
          align="left"
        />

        <div className="font-heading text-xl font-black text-white/30 flex items-center gap-2 px-2">
          <span className="text-f1-red text-sm">←</span> VS <span className="text-f1-red text-sm">→</span>
        </div>

        <CustomDriverSelect 
          value={driver2Id} 
          onChange={(val) => handleDriverChange(2, val)} 
          options={drivers} 
          align="right"
        />
      </div>

      {/* RIGHT: Season Selector */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 overflow-x-auto max-w-[300px] scrollbar-hide">
          {SEASONS.map(s => (
            <button 
              key={s}
              onClick={() => handleSeasonChange(s)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${season === s ? 'bg-f1-red text-white font-bold' : 'text-white/50 hover:bg-white/10'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="bg-f1-red text-white rounded-lg px-6 py-2 uppercase font-heading font-bold text-[13px] hover:bg-[#C20026] transition-colors shadow-[0_0_15px_rgba(232,0,45,0.4)]">
          Compare
        </button>
      </div>

    </div>
  );
};
