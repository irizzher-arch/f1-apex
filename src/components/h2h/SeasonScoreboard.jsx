import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useDriverStandings, useSeasonResults, useQualifyingData } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';

const AnimatedCounter = ({ value, duration = 0.8, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = 0;
    const endValue = parseFloat(value) || 0;
    if (isNaN(endValue)) {
      setCount(value);
      return;
    }

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (endValue - startValue) * ease;
      
      setCount(Number.isInteger(endValue) ? Math.round(current) : current.toFixed(1));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const timeout = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, duration, delay]);

  return <span>{count}</span>;
};

const BattleCard = ({ label, val1, val2, c1, c2, delay, isTally = false }) => {
  const num1 = parseFloat(val1) || 0;
  const num2 = parseFloat(val2) || 0;
  
  const d1Wins = isTally ? num1 > num2 : (label.includes('AVG') || label.includes('DNF') ? num1 < num2 && num1 !== 0 : num1 > num2);
  const d2Wins = isTally ? num2 > num1 : (label.includes('AVG') || label.includes('DNF') ? num2 < num1 && num2 !== 0 : num2 > num1);
  const tied = num1 === num2;

  const glowStyle = d1Wins ? { backgroundColor: `${c1}0F`, boxShadow: `inset 2px 0 10px ${c1}1A` } 
                  : d2Wins ? { backgroundColor: `${c2}0F`, boxShadow: `inset -2px 0 10px ${c2}1A` } 
                  : {};

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/5 border border-white/10 rounded-[14px] p-5 flex flex-col justify-between h-[110px] relative overflow-hidden"
      style={glowStyle}
    >
      <div className="absolute top-2 left-0 right-0 text-center text-[10px] uppercase font-heading tracking-widest text-white/40 z-10">
        {label}
      </div>
      
      <div className="flex justify-between items-end h-full w-full relative z-10 mt-4">
        {isTally ? (
           <div className="w-full flex justify-center items-center gap-4 text-[34px] font-mono font-bold tracking-tighter">
              <span style={{ color: c1 }}>
                <AnimatedCounter value={val1} delay={delay} />
              </span>
              <span className="text-white/20 text-lg">—</span>
              <span style={{ color: c2 }}>
                <AnimatedCounter value={val2} delay={delay} />
              </span>
           </div>
        ) : (
          <>
            <div className={`font-mono font-bold tracking-tighter transition-all ${d1Wins || tied ? 'text-[34px] text-white opacity-100' : 'text-[28px] text-white/65'}`}>
              <AnimatedCounter value={val1} delay={delay} />
            </div>
            
            {tied && <div className="text-white/30 text-sm absolute left-1/2 -translate-x-1/2 bottom-2 font-bold">=</div>}

            <div className={`font-mono font-bold tracking-tighter transition-all ${d2Wins || tied ? 'text-[34px] text-white opacity-100' : 'text-[28px] text-white/65'}`}>
              <AnimatedCounter value={val2} delay={delay} />
            </div>
          </>
        )}
      </div>
      
      {/* Team color accent lines on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: c1, opacity: d1Wins ? 1 : 0.3 }} />
      <div className="absolute right-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: c2, opacity: d2Wins ? 1 : 0.3 }} />
    </motion.div>
  );
};

export const SeasonScoreboard = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;
  
  const { data: standings } = useDriverStandings(season);
  const { data: races } = useSeasonResults(season);
  const { data: qualis } = useQualifyingData(season);

  if (!standings || !races || !qualis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-8 max-w-[1400px] mx-auto opacity-50 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[14px] h-[110px] animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8002D]/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>
    );
  }

  const d1Stats = standings.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings.find(s => s.Driver.driverId === driver2Id);
  const c1 = teamColors[d1Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const c2 = teamColors[d2Stats?.Constructors[0]?.constructorId] || '#ffffff';

  // Calculations
  const calc = (did) => {
    let wins = 0, podiums = 0, fastLaps = 0, ptsFinishes = 0, dnfs = 0, laps = 0, raceFinishes = 0, sumRacePos = 0;
    races.forEach(r => {
      const res = r.Results?.find(x => x.Driver.driverId === did);
      if (res) {
        if (res.position === "1") wins++;
        if (parseInt(res.position) <= 3) podiums++;
        if (res.FastestLap?.rank === "1") fastLaps++;
        if (parseFloat(res.points) > 0) ptsFinishes++;
        if (res.status !== "Finished" && !res.status.includes("+") && parseFloat(res.points) === 0) dnfs++;
        laps += parseInt(res.laps || 0);
        
        sumRacePos += parseInt(res.position);
        raceFinishes++;
      }
    });

    let poles = 0, sumQualiPos = 0, qualiCount = 0;
    qualis.forEach(q => {
      const res = q.QualifyingResults?.find(x => x.Driver.driverId === did);
      if (res) {
        if (res.position === "1") poles++;
        sumQualiPos += parseInt(res.position);
        qualiCount++;
      }
    });

    return {
      pts: d1Stats?.points || 0, // Wait, need generic
      wins, podiums, fastLaps, ptsFinishes, dnfs, laps,
      avgRace: raceFinishes ? (sumRacePos / raceFinishes).toFixed(1) : 0,
      poles,
      avgQuali: qualiCount ? (sumQualiPos / qualiCount).toFixed(1) : 0
    };
  };

  const c1Data = calc(driver1Id);
  c1Data.pts = d1Stats?.points || 0;
  const c2Data = calc(driver2Id);
  c2Data.pts = d2Stats?.points || 0;

  // H2H counts
  let qH2H_1 = 0, qH2H_2 = 0;
  qualis.forEach(q => {
    const r1 = q.QualifyingResults?.find(x => x.Driver.driverId === driver1Id);
    const r2 = q.QualifyingResults?.find(x => x.Driver.driverId === driver2Id);
    if (r1 && r2) {
      if (parseInt(r1.position) < parseInt(r2.position)) qH2H_1++;
      else if (parseInt(r2.position) < parseInt(r1.position)) qH2H_2++;
    }
  });

  let rH2H_1 = 0, rH2H_2 = 0;
  races.forEach(r => {
    const r1 = r.Results?.find(x => x.Driver.driverId === driver1Id);
    const r2 = r.Results?.find(x => x.Driver.driverId === driver2Id);
    if (r1 && r2) {
      const dnf1 = r1.status !== "Finished" && !r1.status.includes("+");
      const dnf2 = r2.status !== "Finished" && !r2.status.includes("+");
      if (!dnf1 && !dnf2) {
        if (parseInt(r1.position) < parseInt(r2.position)) rH2H_1++;
        else if (parseInt(r2.position) < parseInt(r1.position)) rH2H_2++;
      }
    }
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-6 relative z-10">
      {/* ROW 1: Championship */}
      <BattleCard label="Championship Points" val1={c1Data.pts} val2={c2Data.pts} c1={c1} c2={c2} delay={0.04} />
      <BattleCard label="Race Wins" val1={c1Data.wins} val2={c2Data.wins} c1={c1} c2={c2} delay={0.08} />
      <BattleCard label="Podiums" val1={c1Data.podiums} val2={c2Data.podiums} c1={c1} c2={c2} delay={0.12} />
      <BattleCard label="Pole Positions" val1={c1Data.poles} val2={c2Data.poles} c1={c1} c2={c2} delay={0.16} />

      {/* ROW 2: Execution */}
      <BattleCard label="Fastest Laps" val1={c1Data.fastLaps} val2={c2Data.fastLaps} c1={c1} c2={c2} delay={0.20} />
      <BattleCard label="Points Finishes" val1={c1Data.ptsFinishes} val2={c2Data.ptsFinishes} c1={c1} c2={c2} delay={0.24} />
      <BattleCard label="DNFs" val1={c1Data.dnfs} val2={c2Data.dnfs} c1={c1} c2={c2} delay={0.28} />
      <BattleCard label="Laps Completed" val1={c1Data.laps} val2={c2Data.laps} c1={c1} c2={c2} delay={0.32} />

      {/* ROW 3: H2H */}
      <BattleCard label="Qualifying H2H" val1={qH2H_1} val2={qH2H_2} c1={c1} c2={c2} delay={0.36} isTally={true} />
      <BattleCard label="Race H2H" val1={rH2H_1} val2={rH2H_2} c1={c1} c2={c2} delay={0.40} isTally={true} />
      <BattleCard label="Avg Quali Position" val1={c1Data.avgQuali} val2={c2Data.avgQuali} c1={c1} c2={c2} delay={0.44} />
      <BattleCard label="Avg Race Finish" val1={c1Data.avgRace} val2={c2Data.avgRace} c1={c1} c2={c2} delay={0.48} />
    </div>
  );
};
