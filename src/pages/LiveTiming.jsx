import React from 'react';
import { Leaderboard } from '@/components/live/Leaderboard';
import { TrackMap } from '@/components/live/TrackMap';
import { TelemetrySpeed } from '@/components/live/TelemetrySpeed';
import { TelemetryThrottleBrake } from '@/components/live/TelemetryThrottleBrake';
import { TelemetryGForce } from '@/components/live/TelemetryGForce';

export const LiveTiming = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Row 1 */}
      <div className="lg:col-span-7 flex flex-col gap-4 h-[600px]">
        <Leaderboard />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4 h-[600px]">
        <TrackMap />
      </div>

      {/* Row 2 - Telemetry */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="h-[300px]">
          <TelemetrySpeed />
        </div>
        <div className="h-[300px]">
          <TelemetryThrottleBrake />
        </div>
        <div className="h-[300px]">
          <TelemetryGForce />
        </div>
      </div>
    </div>
  );
};
