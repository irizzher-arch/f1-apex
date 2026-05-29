import React from 'react';
import { useErgastResults, useRaceControlData, useWeatherData, useErgastSchedule } from '@/hooks/useRacePaceQueries';
import { useStore } from '@/store/useStore';

export const RaceSummaryStrip = () => {
  const { racePace } = useStore();
  const { year, round, sessionKey } = racePace;
  
  const { data: results } = useErgastResults(year, round);
  const { data: raceControl } = useRaceControlData(sessionKey);
  const { data: weather } = useWeatherData(sessionKey);
  
  // Computations
  const winner = results?.Results?.[0];
  const fastestLapObj = results?.Results?.find(r => r.FastestLap?.rank === "1");
  const totalLaps = winner?.laps || '-';
  
  const scCount = raceControl?.filter(m => m.category === 'SafetyCar' && m.message?.includes('DEPLOYED')).length || 0;
  const vscCount = raceControl?.filter(m => m.message?.includes('VSC DEPLOYED')).length || 0;
  
  const lastWeather = weather && weather.length > 0 ? weather[weather.length - 1] : null;

  return (
    <div className="w-full bg-white/[0.02] border-b border-white/[0.06] py-5 px-6">
      <div className="max-w-[1400px] mx-auto flex flex-wrap lg:flex-nowrap gap-4 justify-between">
        
        {/* Race */}
        <div className="flex-1 min-w-[200px] bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20 group-hover:bg-white/40 transition-colors" />
          <div className="flex flex-col pl-2">
            <span className="font-mono text-[10px] text-text-secondary uppercase mb-1">Round {round}</span>
            <span className="font-heading font-bold text-white text-lg leading-tight truncate">{results?.raceName || 'Loading...'}</span>
            <span className="font-mono text-[10px] text-text-secondary mt-1 truncate">{results?.Circuit.circuitName || '-'}</span>
          </div>
        </div>

        {/* Winner */}
        <div className="flex-1 min-w-[200px] bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-f1-red/80" />
          <div className="flex flex-col pl-2">
            <span className="font-mono text-[10px] text-text-secondary uppercase mb-1">Race Winner</span>
            {winner ? (
              <>
                <span className="font-heading font-bold text-white text-xl leading-tight truncate">{winner.Driver.code || winner.Driver.familyName.toUpperCase()}</span>
                <span className="font-mono text-xs text-white/50 mt-1">{winner.Time?.time || '-'}</span>
              </>
            ) : <span className="font-mono text-sm text-white/50">Loading...</span>}
          </div>
        </div>

        {/* Fastest Lap */}
        <div className="flex-1 min-w-[200px] bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#9B59B6]" />
          <div className="flex flex-col pl-2">
            <span className="font-mono text-[10px] text-text-secondary uppercase mb-1">Fastest Lap</span>
            {fastestLapObj ? (
              <>
                <span className="font-mono font-bold text-[#9B59B6] text-xl leading-tight">{fastestLapObj.FastestLap.Time.time}</span>
                <span className="font-mono text-[10px] text-white/50 mt-1">{fastestLapObj.Driver.code} (LAP {fastestLapObj.FastestLap.lap})</span>
              </>
            ) : <span className="font-mono text-sm text-white/50">Loading...</span>}
          </div>
        </div>

        {/* Total Laps */}
        <div className="flex-1 min-w-[150px] bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20" />
          <div className="flex flex-col pl-2">
            <span className="font-mono text-[10px] text-f1-red uppercase mb-1">Race Distance</span>
            <div className="flex items-end gap-1.5 mt-1">
              <span className="font-mono font-bold text-white text-3xl leading-none">{totalLaps}</span>
              <span className="font-mono text-[10px] text-text-secondary pb-1">LAPS</span>
            </div>
          </div>
        </div>

        {/* Cautions */}
        <div className="flex-1 min-w-[150px] bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF8700]" />
          <div className="flex flex-col pl-2">
            <span className="font-mono text-[10px] text-text-secondary uppercase mb-1">Under Caution</span>
            <div className="flex gap-3 mt-1">
              <div className="flex flex-col">
                <span className="font-mono font-bold text-[#FF8700] text-lg">{scCount}</span>
                <span className="font-mono text-[9px] text-[#FF8700]/70">SC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-[#FFC300] text-lg">{vscCount}</span>
                <span className="font-mono text-[9px] text-[#FFC300]/70">VSC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div className="flex-1 min-w-[150px] bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00D2BE]" />
          <div className="flex flex-col pl-2">
            <span className="font-mono text-[10px] text-text-secondary uppercase mb-1">Final Weather</span>
            {lastWeather ? (
              <>
                <span className="font-mono font-bold text-white text-xl leading-tight">{lastWeather.track_temperature}°C</span>
                <span className="font-mono text-[10px] text-white/50 mt-1 flex items-center gap-1">
                  {lastWeather.rainfall > 0 ? <span className="text-[#0082FF]">● Wet</span> : <span>○ Dry</span>}
                </span>
              </>
            ) : <span className="font-mono text-sm text-white/50">Loading...</span>}
          </div>
        </div>

      </div>
    </div>
  );
};
