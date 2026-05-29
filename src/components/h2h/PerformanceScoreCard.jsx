import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useQualifyingData, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';
import { calculateApexScore } from '@/utils/calculateApexScore';

const ScoreGauge = ({ score, color, title, side }) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    let startTime;
    const duration = 1200;
    const startValue = 0;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic-bezier roughly
      setCurrentScore(Math.round(startValue + (score - startValue) * ease));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    
    window.requestAnimationFrame(step);
  }, [score]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center relative group">
      <svg width="200" height="200" className="-rotate-90">
        <circle 
          cx="100" cy="100" r={radius} 
          fill="transparent" 
          stroke="rgba(255,255,255,0.06)" 
          strokeWidth="10" 
        />
        <circle 
          cx="100" cy="100" r={radius} 
          fill="transparent" 
          stroke={color} 
          strokeWidth="10" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-100 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
        <div className="font-mono text-[42px] font-black text-white leading-none">{currentScore}</div>
        <div className="text-[10px] font-heading text-f1-red uppercase tracking-widest mt-1">Apex Score</div>
      </div>
      <div className="mt-4 text-white font-bold uppercase tracking-widest text-sm">{title}</div>
    </div>
  );
};

const MetricRow = ({ name, v1, v2, c1, c2, max = 100, isInverse = false }) => {
  // Safe div to handle NaN/Infinity
  let pct1 = max ? (v1 / max) * 100 : 0;
  let pct2 = max ? (v2 / max) * 100 : 0;
  
  if (isInverse) {
    pct1 = max ? ((max - v1) / max) * 100 : 0;
    pct2 = max ? ((max - v2) / max) * 100 : 0;
  }
  
  const total = pct1 + pct2 || 1;
  const w1 = (pct1 / total) * 100;
  const w2 = (pct2 / total) * 100;

  return (
    <div className="grid grid-cols-[1fr_60px_140px_60px_1fr] items-center gap-4 py-2 border-b border-white/5">
      <div className="text-[10px] uppercase font-mono text-white/50 tracking-widest text-right">{name}</div>
      <div className="text-right font-mono text-[13px] font-bold" style={{ color: c1 }}>{Number(v1).toFixed(isInverse ? 1 : 0)}</div>
      <div className="h-[6px] bg-white/5 rounded-full relative overflow-hidden flex">
        <div className="h-full transition-all duration-1000" style={{ width: `${w1}%`, backgroundColor: c1 }} />
        <div className="h-full transition-all duration-1000" style={{ width: `${w2}%`, backgroundColor: c2 }} />
      </div>
      <div className="text-left font-mono text-[13px] font-bold" style={{ color: c2 }}>{Number(v2).toFixed(isInverse ? 1 : 0)}</div>
      <div />
    </div>
  );
};

export const PerformanceScoreCard = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;

  const { data: races } = useSeasonResults(season);
  const { data: qualis } = useQualifyingData(season);
  const { data: standings } = useDriverStandings(season);
  const [expanded, setExpanded] = useState(false);

  if (!races || !qualis || !standings) return <div className="w-full h-[400px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;

  const d1Stats = standings.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings.find(s => s.Driver.driverId === driver2Id);
  const c1 = teamColors[d1Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const c2 = teamColors[d2Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const d1Name = d1Stats?.Driver.code || driver1Id.substring(0,3).toUpperCase();
  const d2Name = d2Stats?.Driver.code || driver2Id.substring(0,3).toUpperCase();

  const getStats = (did) => {
    let rAhead = 0, qAhead = 0, podiums = 0, ptsFinishes = 0, dnfs = 0, sumFinish = 0, rStarted = 0;
    
    races.forEach(r => {
      const res = r.Results?.find(x => x.Driver.driverId === did);
      if (res) {
        if (parseInt(res.position) <= 3) podiums++;
        if (parseFloat(res.points) > 0) ptsFinishes++;
        if (res.status !== "Finished" && !res.status.includes('+') && parseFloat(res.points) === 0) dnfs++;
        sumFinish += parseInt(res.position);
        rStarted++;
      }
    });

    return {
      points: parseFloat(standings.find(s => s.Driver.driverId === did)?.points || 0),
      podiums, ptsFinishes, dnfs, rStarted,
      avgFinish: rStarted ? sumFinish / rStarted : 20,
      racesAhead: 0, qualiAhead: 0
    };
  };

  const s1 = getStats(driver1Id);
  const s2 = getStats(driver2Id);

  // H2H
  let totalSharedRaces = 0, totalSharedQuali = 0;
  races.forEach(r => {
    const r1 = r.Results?.find(x => x.Driver.driverId === driver1Id);
    const r2 = r.Results?.find(x => x.Driver.driverId === driver2Id);
    if (r1 && r2) {
      totalSharedRaces++;
      if (parseInt(r1.position) < parseInt(r2.position)) s1.racesAhead++;
      else if (parseInt(r2.position) < parseInt(r1.position)) s2.racesAhead++;
    }
  });

  qualis.forEach(q => {
    const r1 = q.QualifyingResults?.find(x => x.Driver.driverId === driver1Id);
    const r2 = q.QualifyingResults?.find(x => x.Driver.driverId === driver2Id);
    if (r1 && r2) {
      totalSharedQuali++;
      if (parseInt(r1.position) < parseInt(r2.position)) s1.qualiAhead++;
      else if (parseInt(r2.position) < parseInt(r1.position)) s2.qualiAhead++;
    }
  });

  const maxPts = parseFloat(standings[0]?.points || 1);
  const score1 = calculateApexScore(s1, maxPts, totalSharedRaces, totalSharedQuali);
  const score2 = calculateApexScore(s2, maxPts, totalSharedRaces, totalSharedQuali);

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest mb-6">Overall Performance Score</h3>
      
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center">
        
        {/* GAUGES */}
        <div className="flex justify-center items-center gap-16 mb-12">
          <ScoreGauge score={score1} color={c1} title={d1Name} side="left" />
          <div className="flex flex-col items-center opacity-40">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent mb-2" />
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold">Higher Score Wins</div>
            <div className="text-[24px] font-heading mt-1">VS</div>
            <div className="w-[1px] h-12 bg-gradient-to-t from-transparent via-white to-transparent mt-2" />
          </div>
          <ScoreGauge score={score2} color={c2} title={d2Name} side="right" />
        </div>

        {/* METRICS */}
        <div className="w-full max-w-3xl">
          <MetricRow name="Championship Pts" v1={s1.points} v2={s2.points} c1={c1} c2={c2} max={maxPts} />
          <MetricRow name="Race H2H Wins" v1={s1.racesAhead} v2={s2.racesAhead} c1={c1} c2={c2} max={totalSharedRaces} />
          <MetricRow name="Quali H2H Wins" v1={s1.qualiAhead} v2={s2.qualiAhead} c1={c1} c2={c2} max={totalSharedQuali} />
          <MetricRow name="Podiums" v1={s1.podiums} v2={s2.podiums} c1={c1} c2={c2} max={s1.rStarted} />
          <MetricRow name="Points Finishes" v1={s1.ptsFinishes} v2={s2.ptsFinishes} c1={c1} c2={c2} max={s1.rStarted} />
          <MetricRow name="Average Finish" v1={s1.avgFinish} v2={s2.avgFinish} c1={c1} c2={c2} max={20} isInverse />
          <MetricRow name="DNFs" v1={s1.dnfs} v2={s2.dnfs} c1={c1} c2={c2} max={s1.rStarted} isInverse />
        </div>

        {/* ACCORDION */}
        <div className="mt-8 w-full max-w-3xl">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-[10px] font-mono text-white/40 hover:text-white/80 transition-colors w-full text-center"
          >
            HOW IS THIS CALCULATED? {expanded ? '▲' : '▼'}
          </button>
          
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              className="mt-4 bg-black/40 border border-white/10 rounded-lg p-4 text-[11px] font-mono text-white/60"
            >
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-2 pb-2 border-b border-white/10 text-white/40">
                <div>Metric</div><div>Weight & Calculation</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>Championship Pts</div><div>25% - (Driver pts / max pts) × 100</div></div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>Race H2H</div><div>20% - (Races ahead / shared races) × 100</div></div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>Qualifying H2H</div><div>20% - (Quali ahead / shared rounds) × 100</div></div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>Podium Rate</div><div>15% - (Podiums / races started) × 100</div></div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>Points Finish Rate</div><div>10% - (Points finishes / races started) × 100</div></div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>Avg Finish (inv.)</div><div>5% - ((20 - avg finish) / 19) × 100</div></div>
              <div className="grid grid-cols-[200px_1fr] gap-2 mb-1"><div>DNF Penalty</div><div>5% - (1 - DNF count / races entered) × 100</div></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
