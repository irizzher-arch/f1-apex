import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useQualifyingData, useSprintResults, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';

const TableHeader = ({ cols }) => (
  <div className="sticky top-0 z-20 bg-[#0A0A0C] border-b border-white/10 uppercase font-mono text-[10px] text-white/40 tracking-widest grid" style={{ gridTemplateColumns: cols }}>
    <div className="p-3 pl-4">Round</div>
    <div className="p-3 text-center">D1 Pos</div>
    <div className="p-3 text-center">D1 Pts</div>
    <div className="p-3">D1 Time / Status</div>
    <div className="p-3 text-center">Winner</div>
    <div className="p-3 text-right">D2 Time / Status</div>
    <div className="p-3 text-center">D2 Pts</div>
    <div className="p-3 text-center pr-4">D2 Pos</div>
  </div>
);

const QualiHeader = ({ cols }) => (
  <div className="sticky top-0 z-20 bg-[#0A0A0C] border-b border-white/10 uppercase font-mono text-[10px] text-white/40 tracking-widest grid" style={{ gridTemplateColumns: cols }}>
    <div className="p-3 pl-4">Round</div>
    <div className="p-3">D1 Q1 / Q2 / Q3</div>
    <div className="p-3 text-center">D1 Pos</div>
    <div className="p-3 text-center">Gap</div>
    <div className="p-3 text-center">D2 Pos</div>
    <div className="p-3 text-right pr-4">D2 Q1 / Q2 / Q3</div>
  </div>
);

export const RoundByRoundTable = () => {
  const [activeTab, setActiveTab] = useState('RACE');
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;

  const { data: races } = useSeasonResults(season);
  const { data: qualis } = useQualifyingData(season);
  const { data: sprints } = useSprintResults(season);
  const { data: standings } = useDriverStandings(season);

  if (!races || !qualis) return <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;

  const hasSprints = sprints && sprints.length > 0;
  
  const d1Stats = standings?.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings?.find(s => s.Driver.driverId === driver2Id);
  const c1 = teamColors[d1Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const c2 = teamColors[d2Stats?.Constructors[0]?.constructorId] || '#ffffff';

  const raceCols = "1.5fr 0.5fr 0.5fr 1fr 0.5fr 1fr 0.5fr 0.5fr";
  const qualiCols = "1.5fr 1.5fr 0.5fr 0.5fr 0.5fr 1.5fr";

  const renderPosition = (pos, status) => {
    if (!pos) return <span className="text-white/20">—</span>;
    if (status && status !== "Finished" && !status.includes('+')) {
      return <span className="text-f1-red font-bold italic">DNF</span>;
    }
    const p = parseInt(pos);
    if (p === 1) return <span className="text-[#FFD700] font-bold">1 <span className="text-[10px]">🏆</span></span>;
    if (p === 2) return <span className="text-slate-300 font-semibold">2</span>;
    if (p === 3) return <span className="text-amber-600 font-semibold">3</span>;
    if (p <= 10) return <span className="text-white font-medium">{p}</span>;
    return <span className="text-white/50">{p}</span>;
  };

  const getWinnerNode = (r1, r2, isRace = true) => {
    if (!r1 || !r2) return <span className="text-white/20">—</span>;
    
    if (isRace) {
      const dnf1 = r1.status !== "Finished" && !r1.status.includes('+');
      const dnf2 = r2.status !== "Finished" && !r2.status.includes('+');
      if (dnf1 && dnf2) return <span className="px-2 py-0.5 rounded text-[9px] bg-f1-red/20 border border-f1-red/40 text-f1-red font-bold uppercase">Both DNF</span>;
      if (dnf1) return <span className="text-xl" style={{ color: c2 }}>→</span>;
      if (dnf2) return <span className="text-xl" style={{ color: c1 }}>←</span>;
    }

    const p1 = parseInt(r1.position);
    const p2 = parseInt(r2.position);
    if (p1 < p2) return <span className="text-xl" style={{ color: c1 }}>←</span>;
    if (p2 < p1) return <span className="text-xl" style={{ color: c2 }}>→</span>;
    return <span className="text-white/20">—</span>;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest">Race-By-Race Breakdown</h3>
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
          {['RACE', 'QUALIFYING', ...(hasSprints ? ['SPRINT'] : [])].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white/10 text-white font-bold' : 'text-white/50 hover:text-white'}`}
            >
              {tab} Results
            </button>
          ))}
        </div>
      </div>

      <div className="w-full border border-white/10 rounded-2xl overflow-hidden bg-white/5 relative h-[520px]">
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
          {activeTab === 'RACE' && <TableHeader cols={raceCols} />}
          {activeTab === 'SPRINT' && <TableHeader cols={raceCols} />}
          {activeTab === 'QUALIFYING' && <QualiHeader cols={qualiCols} />}

          <div className="flex flex-col">
            {(activeTab === 'QUALIFYING' ? qualis : activeTab === 'SPRINT' ? sprints : races).map((round, i) => {
              const resList = activeTab === 'QUALIFYING' ? round.QualifyingResults : round.Results;
              const r1 = resList?.find(r => r.Driver.driverId === driver1Id);
              const r2 = resList?.find(r => r.Driver.driverId === driver2Id);
              
              if (!r1 && !r2) return null;

              const winner = activeTab === 'QUALIFYING' 
                ? (r1 && r2 ? (parseInt(r1.position) < parseInt(r2.position) ? 1 : 2) : 0)
                : (r1 && r2 && (!r1.status || r1.status === "Finished" || r1.status.includes("+")) && (!r2.status || r2.status === "Finished" || r2.status.includes("+")) ? (parseInt(r1.position) < parseInt(r2.position) ? 1 : 2) : 0);

              return (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  key={round.round} 
                  className="grid border-b border-white/5 text-[13px] items-center transition-colors hover:bg-white/5 relative"
                  style={{ gridTemplateColumns: activeTab === 'QUALIFYING' ? qualiCols : raceCols, backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent' }}
                >
                  {winner === 1 && <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: c1, boxShadow: `0 0 10px ${c1}` }} />}
                  {winner === 2 && <div className="absolute right-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: c2, boxShadow: `0 0 10px ${c2}` }} />}

                  <div className="p-3 pl-4 flex items-center gap-3">
                    <span className="font-mono text-white/30 text-[10px]">R{round.round}</span>
                    <img src={`https://flagsapi.com/${round.Circuit.Location.country === 'USA' ? 'US' : round.Circuit.Location.country === 'UK' ? 'GB' : round.Circuit.Location.country === 'UAE' ? 'AE' : round.Circuit.Location.country.substring(0,2).toUpperCase()}/flat/24.png`} className="w-5 h-5 rounded-sm object-cover" alt="" />
                    <span className="font-bold truncate max-w-[120px]">{round.raceName.replace('Grand Prix', 'GP')}</span>
                  </div>

                  {activeTab !== 'QUALIFYING' ? (
                    <>
                      <div className="p-3 text-center">{renderPosition(r1?.position, r1?.status)}</div>
                      <div className="p-3 text-center font-mono">{r1?.points || '-'}</div>
                      <div className="p-3 font-mono text-white/80 text-[11px] truncate">
                        {r1?.FastestLap?.rank === "1" && <span className="inline-block w-2 h-2 rounded-full bg-[#9B59B6] mr-2" title="Fastest Lap" />}
                        {r1?.Time?.time || r1?.status || '-'}
                      </div>
                      
                      <div className="p-3 flex justify-center">{getWinnerNode(r1, r2, true)}</div>

                      <div className="p-3 text-right font-mono text-white/80 text-[11px] truncate">
                        {r2?.Time?.time || r2?.status || '-'}
                        {r2?.FastestLap?.rank === "1" && <span className="inline-block w-2 h-2 rounded-full bg-[#9B59B6] ml-2" title="Fastest Lap" />}
                      </div>
                      <div className="p-3 text-center font-mono">{r2?.points || '-'}</div>
                      <div className="p-3 text-center pr-4">{renderPosition(r2?.position, r2?.status)}</div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 font-mono text-white/80 text-[11px]">
                        {r1?.position === "1" && <span className="inline-block w-2 h-2 rounded-full bg-[#FFD700] mr-2" title="Pole Position" />}
                        {r1?.Q1 || '-'} / {r1?.Q2 || '-'} / {r1?.Q3 || '-'}
                      </div>
                      <div className="p-3 text-center">{renderPosition(r1?.position, null)}</div>
                      <div className="p-3 flex justify-center">{getWinnerNode(r1, r2, false)}</div>
                      <div className="p-3 text-center">{renderPosition(r2?.position, null)}</div>
                      <div className="p-3 text-right font-mono text-white/80 text-[11px] pr-4">
                        {r2?.Q1 || '-'} / {r2?.Q2 || '-'} / {r2?.Q3 || '-'}
                        {r2?.position === "1" && <span className="inline-block w-2 h-2 rounded-full bg-[#FFD700] ml-2" title="Pole Position" />}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(232,0,45,0.4); }
      `}</style>
    </div>
  );
};
