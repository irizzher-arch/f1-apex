import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Activity } from 'lucide-react';
import { teamColors } from '@/utils/teamColors';

const MOCK_DATA = Array.from({ length: 100 }, (_, i) => {
  const base = Math.sin(i / 5) * 100 + 200;
  return {
    distance: i * 50,
    VER: base + Math.random() * 10,
    LEC: base + Math.random() * 15 - 5,
    HAM: base + Math.random() * 8 - 4,
  };
});

export const TelemetrySpeed = () => {
  return (
    <div className="f1-card flex flex-col h-full bg-background-card border-none rounded-xl overflow-hidden shadow-lg border border-white/5 relative group">
      <div className="corner-accent corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
          <Activity className="w-4 h-4 text-f1-red" /> Speed Trace (km/h)
        </h2>
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor: teamColors.redbull}}></span> VER</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor: teamColors.ferrari}}></span> LEC</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor: teamColors.mercedes}}></span> HAM</span>
        </div>
      </div>
      <div className="flex-1 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="distance" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `${val}m`} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={['dataMin - 20', 'dataMax + 20']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
              formatter={(value, name) => [`${Math.round(value)} km/h`, name]}
              labelFormatter={(label) => `Distance: ${label}m`}
            />
            {/* Example Braking Zone */}
            <ReferenceArea x1={1500} x2={2000} fill="rgba(232,0,45,0.1)" strokeOpacity={0} />
            
            <Line type="monotone" dataKey="VER" stroke={teamColors.redbull} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={true} />
            <Line type="monotone" dataKey="LEC" stroke={teamColors.ferrari} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={true} />
            <Line type="monotone" dataKey="HAM" stroke={teamColors.mercedes} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
