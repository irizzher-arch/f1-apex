import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { H2HControlsBar } from '@/components/h2h/H2HControlsBar';
import { DriverDuelBanner } from '@/components/h2h/DriverDuelBanner';
import { SeasonScoreboard } from '@/components/h2h/SeasonScoreboard';
import { PointsProgressionChart } from '@/components/h2h/PointsProgressionChart';
import { QualifyingGapChart } from '@/components/h2h/QualifyingGapChart';
import { RoundByRoundTable } from '@/components/h2h/RoundByRoundTable';
import { PerformanceScoreCard } from '@/components/h2h/PerformanceScoreCard';
import { PositionDistribution } from '@/components/h2h/PositionDistribution';
import { LapTimeComparison } from '@/components/h2h/LapTimeComparison';
import { PitStopAnalysis } from '@/components/h2h/PitStopAnalysis';
import { DNFReliability } from '@/components/h2h/DNFReliability';
import { TrackDNARadar } from '@/components/h2h/TrackDNARadar';
import { motion } from 'framer-motion';

export const HeadToHead = () => {
  const [searchParams] = useSearchParams();
  const { setH2HState } = useStore();

  useEffect(() => {
    // Read from URL on mount
    const d1 = searchParams.get('d1');
    const d2 = searchParams.get('d2');
    const year = searchParams.get('year');
    
    if (d1 || d2 || year) {
      setH2HState({
        ...(d1 && { driver1Id: d1 }),
        ...(d2 && { driver2Id: d2 }),
        ...(year && { season: year })
      });
    }
  }, [searchParams, setH2HState]);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden font-sans pb-12 relative">
      <H2HControlsBar />
      
      {/* Animated GIF Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/h2h-bg.gif"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
          alt="Animated Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/80 via-[#050508]/50 to-[#050508]/90" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="pt-20 pb-8 bg-transparent">
          <DriverDuelBanner />
          <SeasonScoreboard />
        </div>
        
        <PerformanceScoreCard />
        <PointsProgressionChart />
        <QualifyingGapChart />
        <RoundByRoundTable />
        <PositionDistribution />
        <LapTimeComparison />
        <PitStopAnalysis />
        <DNFReliability />
        <TrackDNARadar />
      </motion.div>
    </div>
  );
};
