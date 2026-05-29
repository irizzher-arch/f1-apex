import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

export const ElevationProfile = ({ elevationData, elevationChange }) => {
  if (!elevationData || elevationData.length === 0) return null;

  // Find max elevation for the dot
  const maxElev = Math.max(...elevationData.map(d => d.elevation));
  const minElev = Math.min(...elevationData.map(d => d.elevation));

  return (
    <div className="relative w-full h-[120px] bg-white/[0.02] border border-white/[0.06] rounded-[10px] mt-6 p-4 flex flex-col justify-end">
      
      {/* Top Right Badge */}
      <div className="absolute top-3 right-3 bg-f1-red/10 border border-f1-red/30 rounded-full px-[10px] py-[3px] z-10">
        <span className="font-mono text-[11px] text-f1-red uppercase">
          Elevation Change: {elevationChange}m
        </span>
      </div>

      <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
        <span className="w-[4px] h-[4px] rounded-full bg-f1-red" />
        <span className="font-mono text-[10px] text-white">Peak: {maxElev}m</span>
      </div>

      <div className="w-full h-[70px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={elevationData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(232,0,45,0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} 
              dy={5}
            />
            
            <YAxis hide domain={[minElev - 5, maxElev + 5]} />
            
            {/* Sea Level Reference */}
            <ReferenceLine 
              y={minElev - 2} 
              stroke="rgba(255,255,255,0.15)" 
              strokeDasharray="3 3" 
              label={{ position: 'insideBottomLeft', value: 'SEA LEVEL', fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} 
            />

            <Area 
              type="monotone" 
              dataKey="elevation" 
              stroke="#E8002D" 
              strokeWidth={1.5}
              fill="url(#elevGradient)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
