import React, { useEffect, useState } from 'react';
import { getCircuitPath } from '@/utils/circuitSVGs';
import { teamColors } from '@/utils/teamColors';
import { Map } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to get point on SVG path (mocking car positions)
const MOCK_CARS = [
  { id: '1', driver: 'VER', team: 'redbull', progress: 0 },
  { id: '16', driver: 'LEC', team: 'ferrari', progress: -0.05 },
  { id: '11', driver: 'PER', team: 'redbull', progress: -0.1 },
  { id: '4', driver: 'NOR', team: 'mclaren', progress: -0.15 },
  { id: '44', driver: 'HAM', team: 'ferrari', progress: -0.2 },
];

export const TrackMap = () => {
  const [cars, setCars] = useState(MOCK_CARS);
  const pathRef = React.useRef(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.002; // Speed of cars
      setCars(prevCars => prevCars.map((car, index) => ({
        ...car,
        // Calculate progress, keeping it within 0-1
        progress: ((time + index * 0.05) % 1 + 1) % 1
      })));
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="f1-card flex flex-col h-full bg-background-card border-none rounded-xl overflow-hidden shadow-lg border border-white/5 relative">
      {/* Corner Accents */}
      <div className="corner-accent corner-tl" />
      <div className="corner-accent corner-tr" />
      <div className="corner-accent corner-bl" />
      <div className="corner-accent corner-br" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 z-10">
        <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
          <Map className="w-5 h-5 text-text-secondary" />
          Live Tracker
        </h2>
        
        {/* Mini Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> FASTEST</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> PB</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> SLOW</span>
        </div>
      </div>
      
      <div className="flex-1 relative bg-black/20 p-8 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}>
          
          {/* Main Track Path */}
          <path
            ref={pathRef}
            d={getCircuitPath('saudi')}
            className="stroke-white/20 fill-none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Track Overlay (optional effect) */}
          <path
            d={getCircuitPath('saudi')}
            className="stroke-white/5 fill-none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'blur(4px)' }}
          />

          {/* Cars */}
          {pathLength > 0 && cars.map(car => {
            const point = pathRef.current.getPointAtLength(car.progress * pathLength);
            const teamColor = teamColors[car.team] || '#fff';
            return (
              <g key={car.id} transform={`translate(${point.x}, ${point.y})`}>
                <circle
                  r="6"
                  fill={teamColor}
                  className="animate-pulse"
                  style={{ filter: `drop-shadow(0 0 6px ${teamColor})` }}
                />
                <text
                  y="-12"
                  textAnchor="middle"
                  fill="white"
                  className="text-[12px] font-mono font-bold"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {car.driver}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
