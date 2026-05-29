import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { teamColors } from '@/utils/teamColors';

const MOCK_PITS = [
  { driver: 'VER', time: 2.1, team: 'redbull' },
  { driver: 'NOR', time: 2.3, team: 'mclaren' },
  { driver: 'LEC', time: 2.4, team: 'ferrari' },
  { driver: 'PIA', time: 2.5, team: 'mclaren' },
  { driver: 'SAI', time: 2.8, team: 'ferrari' },
  { driver: 'PER', time: 3.1, team: 'redbull' },
  { driver: 'HAM', time: 3.2, team: 'mercedes' },
  { driver: 'RUS', time: 3.5, team: 'mercedes' },
].sort((a, b) => a.time - b.time);

export const PitStops = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <img 
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/4e2ed6245443887.69ae60efe11db.png" 
          className="w-full h-full object-cover opacity-80 mix-blend-screen" 
          alt="Pit Stops Header"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-base via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-heading font-bold uppercase tracking-widest !m-0 drop-shadow-md">
            Pit Stop Performance
          </h1>
          <p className="text-sm font-mono text-text-secondary mt-1">Stationary pit stop duration per driver.</p>
        </div>
      </div>

      <div className="f1-card p-6 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_PITS} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'JetBrains Mono' }} domain={[0, 'dataMax + 1']} />
            <YAxis type="category" dataKey="driver" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Formula1 Display' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '14px', fontWeight: 'bold' }}
              formatter={(value) => [`${value}s`, 'Time']}
            />
            <Bar dataKey="time" radius={[0, 4, 4, 0]} isAnimationActive={true}>
              {MOCK_PITS.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={teamColors[entry.team]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
