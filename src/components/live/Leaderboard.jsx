import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { teamColors } from '@/utils/teamColors';
import { getTireColor } from '@/utils/tireColors';
import { formatGap } from '@/utils/formatters';

const MOCK_DRIVERS = [
  { id: '1', pos: 1, posDiff: 0, code: 'VER', name: 'Max Verstappen', team: 'redbull', lapTime: '1:31.421', gap: 'LEADER', tire: 'hard', pits: 1, drs: false, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png' },
  { id: '16', pos: 2, posDiff: 1, code: 'LEC', name: 'Charles Leclerc', team: 'ferrari', lapTime: '1:31.554', gap: '+2.145', tire: 'hard', pits: 1, drs: true, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png' },
  { id: '11', pos: 3, posDiff: -1, code: 'PER', name: 'Sergio Perez', team: 'redbull', lapTime: '1:31.602', gap: '+4.512', tire: 'medium', pits: 1, drs: false, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png' },
  { id: '4', pos: 4, posDiff: 2, code: 'NOR', name: 'Lando Norris', team: 'mclaren', lapTime: '1:31.320', gap: '+8.901', tire: 'hard', pits: 1, drs: true, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png' },
  { id: '44', pos: 5, posDiff: -2, code: 'HAM', name: 'Lewis Hamilton', team: 'ferrari', lapTime: '1:31.810', gap: '+12.443', tire: 'hard', pits: 1, drs: false, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png' },
  { id: '81', pos: 6, posDiff: 0, code: 'PIA', name: 'Oscar Piastri', team: 'mclaren', lapTime: '1:31.705', gap: '+14.200', tire: 'medium', pits: 1, drs: false, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png' },
  { id: '63', pos: 7, posDiff: 0, code: 'RUS', name: 'George Russell', team: 'mercedes', lapTime: '1:31.990', gap: '+18.650', tire: 'hard', pits: 1, drs: true, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png' },
  { id: '14', pos: 8, posDiff: 3, code: 'ALO', name: 'Fernando Alonso', team: 'astonmartin', lapTime: '1:32.100', gap: '+22.100', tire: 'hard', pits: 1, drs: false, photoUrl: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png' },
];

export const Leaderboard = () => {
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);

  // Auto-shuffle positions slightly to demo framer motion (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => {
        const newDrivers = [...prev];
        // randomly swap 2nd and 3rd
        if (Math.random() > 0.7) {
          const tempPos = newDrivers[1].pos;
          newDrivers[1].pos = newDrivers[2].pos;
          newDrivers[2].pos = tempPos;
          
          newDrivers[1].posDiff = newDrivers[1].pos < newDrivers[2].pos ? 1 : -1;
          newDrivers[2].posDiff = newDrivers[2].pos < newDrivers[1].pos ? 1 : -1;
        }
        return newDrivers.sort((a, b) => a.pos - b.pos);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="f1-card flex flex-col h-full bg-background-card border-none rounded-xl overflow-hidden shadow-lg border border-white/5">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-f1-red animate-pulse-glow" /> 
          Live Leaderboard
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[60px_60px_1fr_120px_100px_80px_60px_60px] gap-2 px-4 py-2 text-xs font-mono text-text-secondary border-b border-white/5 uppercase tracking-wider">
            <div className="text-center">Pos</div>
            <div className="text-center">Chg</div>
            <div>Driver</div>
            <div>Lap Time</div>
            <div>Gap</div>
            <div className="text-center">Tire</div>
            <div className="text-center">Pits</div>
            <div className="text-center">DRS</div>
          </div>
          
          {/* Rows */}
          <div className="flex flex-col p-2 gap-1 relative">
            <AnimatePresence>
              {drivers.map((driver, index) => {
                const teamColor = teamColors[driver.team] || '#fff';
                const isLeader = driver.pos === 1;
                
                return (
                  <motion.div
                    key={driver.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`grid grid-cols-[60px_60px_1fr_120px_100px_80px_60px_60px] gap-2 items-center px-2 py-1.5 rounded-md relative overflow-hidden group hover:bg-white/5 transition-colors ${isLeader ? 'bg-f1-red/5' : index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                  >
                    {/* Team Color Left Border */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-[4px]" 
                      style={{ backgroundColor: teamColor }} 
                    />
                    
                    {/* Position */}
                    <div className="text-center font-heading font-bold text-xl text-white ml-2">
                      {driver.pos}
                    </div>
                    
                    {/* Change Arrow */}
                    <div className="flex justify-center items-center">
                      {driver.posDiff > 0 ? (
                        <ChevronUp className="w-5 h-5 text-green-500" />
                      ) : driver.posDiff < 0 ? (
                        <ChevronDown className="w-5 h-5 text-f1-red" />
                      ) : (
                        <Minus className="w-4 h-4 text-text-secondary" />
                      )}
                    </div>
                    
                    {/* Driver Name & Photo */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
                        <img src={driver.photoUrl} alt={driver.code} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-white leading-tight uppercase tracking-wide">{driver.name.split(' ')[1]}</span>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: teamColor }} />
                          <span className="text-[10px] font-mono text-text-secondary uppercase">{driver.team}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lap Time */}
                    <div className="font-mono text-sm text-white">
                      {driver.lapTime}
                    </div>
                    
                    {/* Gap */}
                    <div className="font-mono text-sm text-text-secondary">
                      {driver.gap}
                    </div>
                    
                    {/* Tire */}
                    <div className="flex justify-center items-center">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-background-card flex items-center justify-center font-bold text-[8px] text-background-card bg-white"
                        style={{ borderColor: getTireColor(driver.tire) }}
                        title={driver.tire.toUpperCase()}
                      >
                        <span style={{ color: getTireColor(driver.tire) }}>{driver.tire.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    
                    {/* Pits */}
                    <div className="text-center font-mono text-sm text-text-secondary">
                      {driver.pits}
                    </div>
                    
                    {/* DRS */}
                    <div className="flex justify-center items-center">
                      {driver.drs && (
                        <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold font-mono tracking-widest">
                          DRS
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
