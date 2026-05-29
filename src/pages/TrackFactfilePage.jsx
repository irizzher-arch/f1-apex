import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useCircuitData } from '@/hooks/useCircuitData';
import { useCircuitHistory } from '@/hooks/useCircuitHistory';

// Components
import { TrackMasthead } from '@/components/track/TrackMasthead';
import { CircuitStatPill } from '@/components/track/CircuitStatPill';
import { CircuitMap } from '@/components/track/CircuitMap';
import { ElevationProfile } from '@/components/track/ElevationProfile';
import { SpeedComparison } from '@/components/track/SpeedComparison';
import { TyreSelection } from '@/components/track/TyreSelection';
import { StrategyCards } from '@/components/track/StrategyCards';
import { TelemetryGauges } from '@/components/track/TelemetryGauges';
import { CarSetupSliders } from '@/components/track/CarSetupSliders';
import { ProbabilityCharts } from '@/components/track/ProbabilityCharts';
import { HistoryTable } from '@/components/track/HistoryTable';
import { DriverSpotlightCard } from '@/components/track/DriverSpotlightCard';
import { SessionTimeline } from '@/components/track/SessionTimeline';

const SectionHeader = ({ num, title }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="flex items-center gap-3">
      <div className="w-[3px] h-[28px] bg-f1-red rounded-[2px]" />
      <span className="font-mono text-[13px] text-f1-red">{num}.</span>
    </div>
    <h2 className="font-heading font-[800] text-[28px] uppercase text-white m-0 tracking-wide">
      {title}
    </h2>
    <div className="flex-1 h-[1px] bg-white/[0.06] ml-4" />
    <div className="w-[2px] h-[16px] bg-f1-red -rotate-12 opacity-60 ml-1" />
  </div>
);

export const TrackFactfilePage = () => {
  const { circuitId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useCircuitData(circuitId);
  const { history } = useCircuitHistory(circuitId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [circuitId]);

  if (loading) {
    return <div className="min-h-screen bg-[#050508] flex items-center justify-center text-f1-red font-mono animate-pulse">LOADING TELEMETRY...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center text-white font-mono gap-4">
        <p>Error loading circuit data for {circuitId}</p>
        <button onClick={() => navigate('/')} className="text-f1-red border border-f1-red px-4 py-2 rounded hover:bg-f1-red hover:text-white">BACK TO DASHBOARD</button>
      </div>
    );
  }

  const { ergast, schedule, static: staticData } = data;
  const stats = staticData.stats;
  const cStats = staticData.characterStats;

  // Mock Top 3 drivers for Driver Spotlight
  const mockTopDrivers = [
    { name: "Max Verstappen", team: "Red Bull Racing", stats: { starts: 8, wins: 3, podiums: 5, poles: 2, fastestLaps: 2, totalLaps: 412, personalBest: "1:11.233" } },
    { name: "Lando Norris", team: "McLaren", stats: { starts: 5, wins: 0, podiums: 2, poles: 0, fastestLaps: 1, totalLaps: 250, personalBest: "1:12.004" } },
    { name: "Charles Leclerc", team: "Ferrari", stats: { starts: 6, wins: 1, podiums: 3, poles: 3, fastestLaps: 0, totalLaps: 300, personalBest: "1:11.376" } }
  ];

  return (
    <div className="w-full bg-[#050508] min-h-screen flex flex-col pb-24">
      {/* Back Navigation Overlay */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-md border border-white/10 p-2 rounded-full text-white/50 hover:text-white hover:border-f1-red transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      {/* SECTION 1: MASTHEAD */}
      <TrackMasthead circuit={ergast} schedule={schedule} />

      <main className="w-full max-w-[1280px] mx-auto px-6 pt-16 flex flex-col gap-20">
        
        {/* SECTION 2: TRACK STATS */}
        <section>
          <SectionHeader num="01" title="TRACK STATS" />
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left 35% - Key Stats Stack */}
            <div className="w-full lg:w-[35%] flex flex-col gap-[1px] bg-white/[0.05] border border-white/[0.05] rounded-xl overflow-hidden p-[1px]">
              <div className="bg-[#050508] p-6 border-l-[2px] border-l-f1-red flex flex-col">
                <span className="font-mono text-[32px] text-white font-bold leading-none">{stats.raceDistance}</span>
                <span className="font-body text-[11px] uppercase text-white/45 tracking-[0.12em] mt-1">RACE DISTANCE</span>
              </div>
              <div className="bg-[#050508] p-6 border-l-[2px] border-l-[#00D2BE] flex flex-col">
                <span className="font-mono text-[32px] text-white font-bold leading-none">{stats.circuitLength}</span>
                <span className="font-body text-[11px] uppercase text-white/45 tracking-[0.12em] mt-1">CIRCUIT LENGTH</span>
              </div>
              <div className="bg-[#050508] p-6 border-l-[2px] border-l-[#FF8700] flex flex-col">
                <span className="font-mono text-[32px] text-white font-bold leading-none">{stats.laps}</span>
                <span className="font-body text-[11px] uppercase text-white/45 tracking-[0.12em] mt-1">NUMBER OF LAPS</span>
              </div>
              <div className="bg-[#050508] p-6 border-l-[2px] border-l-f1-red flex flex-col">
                <span className="font-mono text-[32px] text-white font-bold leading-none">{stats.lapRecord.time}</span>
                <span className="font-body text-[11px] uppercase text-white/45 tracking-[0.12em] mt-1">LAP RECORD</span>
                <span className="font-mono text-[11px] text-white/30 mt-2">{stats.lapRecord.driver} ({stats.lapRecord.year})</span>
              </div>
            </div>

            {/* Right 65% - Circuit Map & Elements */}
            <div className="w-full lg:w-[65%] flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 min-h-[300px]">
                  <CircuitMap speedAnnotations={staticData.speedAnnotations} />
                </div>
                
                {/* Character Stat Pills (Vertical Stack) */}
                <div className="w-full md:w-[240px] flex flex-col gap-3">
                  <CircuitStatPill statId="gForce" value={cStats.gForce.value} subLabel={cStats.gForce.sub} index={0} />
                  <CircuitStatPill statId="gearChanges" value={cStats.gearChanges.value} subLabel={cStats.gearChanges.sub} index={1} />
                  <CircuitStatPill statId="topSpeed" value={cStats.topSpeed.value} subLabel={cStats.topSpeed.sub} index={2} />
                  <CircuitStatPill statId="overtakes" value={cStats.overtakes.value} subLabel={cStats.overtakes.sub} index={3} />
                  <CircuitStatPill statId="trackWidth" value={cStats.trackWidth.value} subLabel={cStats.trackWidth.sub} index={4} />
                </div>
              </div>

              <ElevationProfile elevationData={staticData.elevation} elevationChange={staticData.elevationChange} />
              <SpeedComparison seriesSpeed={staticData.seriesSpeed} />
            </div>
          </div>
        </section>

        {/* SECTION 3: CIRCUIT NOTES */}
        <section>
          <SectionHeader num="02" title="CIRCUIT CHARACTER NOTES" />
          <div className="w-full bg-white/[0.02] border border-white/[0.055] border-l-[3px] border-l-[#00D2BE] rounded-xl p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col">
              <div className="self-start bg-[#00D2BE]/10 border border-[#00D2BE]/30 rounded-md px-3 py-1 mb-4">
                <span className="font-mono text-[10px] text-[#00D2BE] uppercase tracking-wide">ANALYST NOTE</span>
              </div>
              <p className="font-body text-[14px] text-white/70 leading-[1.85] m-0" dangerouslySetInnerHTML={{ __html: staticData.analystNote.replace(/<(white|teal)>/g, (m, g) => `<span class="${g === 'white' ? 'text-white font-semibold' : 'text-[#00D2BE]'}">`).replace(/<\/(white|teal)>/g, '</span>') }} />
            </div>

            {/* Difficulty Rating Bars */}
            <div className="w-full md:w-[240px] flex flex-col gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
              <span className="font-heading text-[12px] uppercase text-white/40 tracking-widest mb-2">DIFFICULTY RATING</span>
              
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase text-white/40">Physical Demand</span>
                <div className="flex gap-1 h-[6px]">
                  {[1,2,3,4,5].map(n => <div key={n} className={`flex-1 rounded-sm ${n <= staticData.difficultyRatings.physical ? 'bg-f1-red' : 'bg-white/10'}`} />)}
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase text-white/40">Technical Complexity</span>
                <div className="flex gap-1 h-[6px]">
                  {[1,2,3,4,5].map(n => <div key={n} className={`flex-1 rounded-sm ${n <= staticData.difficultyRatings.technical ? 'bg-[#00D2BE]' : 'bg-white/10'}`} />)}
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase text-white/40">Overtaking Difficulty</span>
                <div className="flex gap-1 h-[6px]">
                  {[1,2,3,4,5].map(n => <div key={n} className={`flex-1 rounded-sm ${n <= staticData.difficultyRatings.overtaking ? 'bg-[#FF8700]' : 'bg-white/10'}`} />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: STRATEGY */}
        <section>
          <SectionHeader num="03" title="STRATEGY" />
          
          <TyreSelection selectedTyres={staticData.tyreSelection} />
          <StrategyCards stats={staticData.strategyStats} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-t border-white/10 pt-12">
            <TelemetryGauges stats={staticData.strategyStats} />
            <CarSetupSliders stats={staticData.strategyStats} />
            
            {/* Additional Strategy Stats Column */}
            <div className="flex flex-col w-full">
              {[
                ['AVERAGE PIT STOPS', staticData.strategyStats.avgPitStops],
                ['UNDERCUT WINDOW', staticData.strategyStats.undercutWindow],
                ['TYRE DELTA (S→M)', staticData.strategyStats.tyreDelta],
                ['PIT LANE TIME LOSS', staticData.strategyStats.pitLaneTimeLoss]
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/[0.05] last:border-0">
                  <span className="font-heading text-[10px] uppercase text-white/40">{label}</span>
                  <span className="font-mono text-[14px] text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: RACE PROBABILITY */}
        <section>
          <SectionHeader num="04" title="RACE PROBABILITY" />
          <ProbabilityCharts />
        </section>

        {/* SECTION 6: HISTORY */}
        <section>
          <SectionHeader num="05" title="HISTORY" />
          
          {/* Driver Spotlight */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {mockTopDrivers.map(d => <DriverSpotlightCard key={d.name} driverName={d.name} team={d.team} stats={d.stats} />)}
          </div>

          <HistoryTable pastWinners={history?.pastWinners} />
        </section>

        {/* SECTION 7: SCHEDULE */}
        <section>
          <SectionHeader num="06" title="LIVE SCHEDULE" />
          <SessionTimeline schedule={schedule} />
        </section>

      </main>
    </div>
  );
};
