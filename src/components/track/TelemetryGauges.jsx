import React from 'react';
import { motion, useInView } from 'framer-motion';

export const TelemetryGauges = ({ stats }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!stats) return null;

  // Helpers for SVG gauge calculations
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  
  // Fake "percentage" for visual display based on the raw stat value to determine how full the gauge is
  // In a real app we'd map this against the season average, here we'll just mock the fill based on arbitrary logic for visual flair.
  const fuelEffectPercent = 75; // e.g. 75% full
  const fuelConsumptionPercent = 60;
  const throttlePercent = stats.fullThrottle; // it's already a percent

  const gauges = [
    { 
      label: 'FUEL EFFECT', 
      value: stats.fuelEffect, 
      sub: '(SEASON AVERAGE: 0.25sec/10kg)', 
      color: '#E8002D',
      percent: fuelEffectPercent
    },
    { 
      label: 'FUEL CONSUMPTION', 
      value: stats.fuelConsumption, 
      sub: '(SEASON AVERAGE: 1.50kg/lap)', 
      color: '#FF8700',
      percent: fuelConsumptionPercent
    },
    { 
      label: 'FULL THROTTLE', 
      value: `${stats.fullThrottle}% OF LAP`, 
      sub: '(SEASON AVERAGE: 62%)', 
      color: '#00D2BE',
      percent: throttlePercent
    }
  ];

  return (
    <div ref={ref} className="flex flex-col gap-6 w-full">
      {gauges.map((gauge, i) => {
        const offset = circumference - (gauge.percent / 100) * circumference;
        
        return (
          <div key={i} className="flex items-center gap-4">
            <div className="relative w-[70px] h-[70px] shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 76 76">
                <circle 
                  cx="38" cy="38" r={radius} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.06)" 
                  strokeWidth="6" 
                />
                <circle 
                  cx="38" cy="38" r={radius} 
                  fill="none" 
                  stroke={gauge.color} 
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={isInView ? offset : circumference}
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-white leading-none">
                  {gauge.percent}%
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-mono text-[14px] text-white leading-tight">{gauge.value}</span>
              <span className="font-heading text-[9px] uppercase text-white/50">{gauge.label} <br/><span className="text-white/30">{gauge.sub}</span></span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
