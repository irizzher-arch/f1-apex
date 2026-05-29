import React from 'react';
import { RacePaceControlsBar } from '@/components/racepace/RacePaceControlsBar';
import { RaceSummaryStrip } from '@/components/racepace/RaceSummaryStrip';
import { LapTimeEvolutionChart } from '@/components/racepace/LapTimeEvolutionChart';
import { PositionChangesChart } from '@/components/racepace/PositionChangesChart';
import { PaceEvolutionChart } from '@/components/racepace/PaceEvolutionChart';
import { FastestLapHighlights } from '@/components/racepace/FastestLapHighlights';
import { TyreStintMap } from '@/components/racepace/TyreStintMap';
import { TyreDegradationChart } from '@/components/racepace/TyreDegradationChart';
import { SpeedTrapTable } from '@/components/racepace/SpeedTrapTable';
import { GapToLeaderChart } from '@/components/racepace/GapToLeaderChart';
import { LapDistribution } from '@/components/racepace/LapDistribution';
import { WeatherTimeline } from '@/components/racepace/WeatherTimeline';
import { PaceDeltaComparison } from '@/components/racepace/PaceDeltaComparison';
import { LiveSessionBadge } from '@/components/racepace/LiveSessionBadge';

export const RacePace = () => {
  return (
    <div className="flex flex-col w-full min-h-screen pb-20 relative">
      
      {/* Full Page Video Background */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-background-base overflow-hidden pointer-events-none">
        <video 
          src="/race-pace-bg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-15 grayscale mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-base/80 via-transparent to-background-base/90" />
      </div>

      {/* Page Title Header */}
      <div className="w-full max-w-[1400px] mx-auto px-6 mt-8 mb-4">
        <h1 className="text-3xl font-heading font-bold uppercase tracking-widest text-white drop-shadow-md">
          Race Pace Analysis
        </h1>
        <p className="text-sm font-mono text-text-secondary mt-1">Stint simulation lap trace plotting degradation over time.</p>
      </div>

      {/* 1. Master Controls Bar */}
      <RacePaceControlsBar />
      
      {/* 2. Race Summary Hero Strip */}
      <RaceSummaryStrip />
      
      <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto px-6 mt-8">
        
        {/* Row 1: Main Pace & Strategy */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* 3. Lap-by-Lap Time Chart */}
            <LapTimeEvolutionChart />
            {/* 5. Pace Evolution Chart */}
            <PaceEvolutionChart />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* 7a. Tyre Stints */}
            <TyreStintMap />
            {/* 7b. Degradation */}
            <TyreDegradationChart />
          </div>
        </div>

        {/* 6. Fastest Lap Highlights */}
        <FastestLapHighlights />

        {/* Row 2: Positions & Deltas */}
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          <div className="w-full lg:w-1/2">
            {/* 4. Position Changes Chart */}
            <PositionChangesChart />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* 9. Gap To Leader */}
            <GapToLeaderChart />
            {/* 12. Pace Delta Comparison */}
            <PaceDeltaComparison />
          </div>
        </div>

        {/* Row 3: Distribution & Weather */}
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          <div className="w-full lg:w-1/2">
             {/* 10. Lap Time Distribution */}
             <LapDistribution />
          </div>
          <div className="w-full lg:w-1/2">
             {/* 11. Weather & Track Conditions */}
             <WeatherTimeline />
          </div>
        </div>

        {/* Row 4: Speed Traps */}
        {/* 8. Top Speed Traps */}
        <SpeedTrapTable />
        
      </div>
      
      {/* 13. Live Session Badge */}
      <LiveSessionBadge />
      
    </div>
  );
};
