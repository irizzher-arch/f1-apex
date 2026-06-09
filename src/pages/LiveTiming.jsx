import React from 'react';
import { useStore } from '@/store/useStore';
import { useLiveSession } from '@/hooks/useLiveSession';
import { useLiveDataIntegrator } from '@/hooks/useLiveDataIntegrator';
import { useReplayOrchestrator } from '@/hooks/useReplayOrchestrator';

import { LiveStatusBar } from '@/components/live/LiveStatusBar';
import { SessionWaitingScreen } from '@/components/live/SessionWaitingScreen';
import { LiveLeaderboard } from '@/components/live/LiveLeaderboard';
import { LiveTrackMap } from '@/components/live/LiveTrackMap';
import { RaceControlFeed } from '@/components/live/RaceControlFeed';
import { TeamRadioFeed } from '@/components/live/TeamRadioFeed';
import { TyreStintHistory } from '@/components/live/TyreStintHistory';
import { DriverTelemetryPanel } from '@/components/live/DriverTelemetryPanel';
import { LiveGapChart } from '@/components/live/LiveGapChart';
import { LiveWeatherWidget } from '@/components/live/LiveWeatherWidget';
import { OvertakeFeed } from '@/components/live/OvertakeFeed';
import { DisplayOptionsDrawer } from '@/components/live/DisplayOptionsDrawer';
import { LiveAlertToast } from '@/components/live/LiveAlertToast';
import { ReplayControlsBar } from '@/components/live/ReplayControlsBar';

export const LiveTiming = () => {
  const { isLoading: isSessionDetecting } = useLiveSession();
  useLiveDataIntegrator(); // Start polling if session is live/replay
  const { isBuffering } = useReplayOrchestrator();

  const sessionMode = useStore(state => state.liveTiming.sessionMode);
  
  if (isSessionDetecting || isBuffering) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#050508] gap-4">
        <div className="w-12 h-12 border-4 border-[#E8002D] border-t-transparent rounded-full animate-spin"></div>
        {isBuffering && <div className="text-white/50 font-mono text-sm tracking-widest uppercase">Buffering Historical Data...</div>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden pb-20 relative">
      <LiveStatusBar />
      <LiveAlertToast />
      <DisplayOptionsDrawer />
      {sessionMode === 'playback' && <ReplayControlsBar />}
      
      {sessionMode === 'waiting' ? (
        <SessionWaitingScreen />
      ) : (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            {/* Overtake Ticker overlapping the top of the map/grid */}
            <div className="lg:col-span-12 relative z-50">
              <OvertakeFeed />
            </div>

            {/* Main Content Area */}
            {/* Left Column - Leaderboard */}
            <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-[800px]">
              <LiveLeaderboard />
            </div>
            
            {/* Right Column - Track Map & Logs */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="relative">
                 <LiveWeatherWidget className="absolute top-4 right-4 z-20 scale-90 origin-top-right" />
                 <LiveTrackMap />
              </div>
              <RaceControlFeed />
            </div>
            
            {/* Stints Section */}
            <div className="lg:col-span-12 mt-4">
              <TyreStintHistory />
            </div>
            
            {/* Bottom Row - Radios & Gap Chart */}
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <TeamRadioFeed />
              <LiveGapChart />
            </div>
            
            {/* Telemetry - Full Width Floating or Inline */}
            <div className="lg:col-span-12 mt-4">
              <DriverTelemetryPanel />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
