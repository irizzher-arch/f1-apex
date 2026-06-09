import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useAllRoundsSchedule } from '@/hooks/useAllRoundsSchedule';
import { usePitStopData } from '@/hooks/usePitStopData';
import { useDriverData } from '@/hooks/useRacePaceQueries'; // We can reuse driver hook from race pace
import { PitStopsControlsBar } from '@/components/pitstops/PitStopsControlsBar';
import { FastestStopsTable } from '@/components/pitstops/FastestStopsTable';
import { PitConsistencyChart } from '@/components/pitstops/PitConsistencyChart';
import { AvgTimePerGPChart } from '@/components/pitstops/AvgTimePerGPChart';
import { DriverAvgTable } from '@/components/pitstops/DriverAvgTable';
import { DriverDHLPoints } from '@/components/pitstops/DriverDHLPoints';
import { ConstructorAvgChart } from '@/components/pitstops/ConstructorAvgChart';
import { ConstructorDHLStandings } from '@/components/pitstops/ConstructorDHLStandings';
import { FullPitLogTable } from '@/components/pitstops/FullPitLogTable';
import { VideoPopupModal } from '@/components/pitstops/VideoPopupModal';

export const PitStops = () => {
  const { pitStops } = useStore();
  const { year, selectedRound } = pitStops;

  const { data: schedule, isLoading: scheduleLoading } = useAllRoundsSchedule(year);
  
  // Only query pitstops up to the rounds that have happened to prevent API rate limiting.
  // We check if the race date is in the past.
  const completedRounds = schedule?.filter(r => new Date(r.date) < new Date()).length || 0;
  
  const { data: allStops, isLoading: stopsLoading } = usePitStopData(year, completedRounds);
  
  // We need drivers data for names/colors. We can fetch it for the "latest" round of this year, or the first one.
  const { data: drivers } = useDriverData('latest'); // Assumes 'latest' or 'current' works in OpenF1 for the year.

  return (
    <div className="w-full flex flex-col pb-24 relative min-h-screen">
      <PitStopsControlsBar schedule={schedule} />
      
      <div className="w-full max-w-[1400px] mx-auto px-6 mt-8 flex flex-col gap-8 relative z-10">
        
        {/* Ranked Table */}
        <FastestStopsTable allStops={allStops} schedule={schedule} drivers={drivers} isLoading={stopsLoading} />

        {/* Consistency Chart */}
        <PitConsistencyChart allStops={allStops} drivers={drivers} isLoading={stopsLoading} />

        {/* GP Averages */}
        <AvgTimePerGPChart allStops={allStops} schedule={schedule} drivers={drivers} isLoading={stopsLoading} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Driver Averages Table */}
          <DriverAvgTable allStops={allStops} drivers={drivers} isLoading={stopsLoading} />
          
          {/* Constructor Averages Chart */}
          <ConstructorAvgChart allStops={allStops} drivers={drivers} isLoading={stopsLoading} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Driver DHL Points */}
          <DriverDHLPoints allStops={allStops} schedule={schedule} drivers={drivers} isLoading={stopsLoading} />

          {/* Constructor DHL Standings */}
          <ConstructorDHLStandings allStops={allStops} schedule={schedule} drivers={drivers} isLoading={stopsLoading} />
        </div>

        {/* Full Log */}
        <FullPitLogTable allStops={allStops} schedule={schedule} drivers={drivers} isLoading={stopsLoading} />

      </div>

      <VideoPopupModal />
    </div>
  );
};
