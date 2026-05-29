import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gauge } from 'lucide-react';

const MOCK_DATA = Array.from({ length: 100 }, (_, i) => {
  const isBraking = Math.sin(i / 3) < -0.5;
  return {
    distance: i * 50,
    throttle: isBraking ? 0 : Math.min(100, Math.sin(i / 5) * 50 + 50 + Math.random() * 20),
    brake: isBraking ? Math.min(100, Math.abs(Math.sin(i / 3)) * 100) : 0,
  };
});

export const TelemetryThrottleBrake = () => {
  return (
    <div className="f1-card flex flex-col h-full bg-background-card border-none rounded-xl overflow-hidden shadow-lg border border-white/5 relative group">
      <div className="corner-accent corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-f1-red" /> Throttle & Brake
        </h2>
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> THR</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> BRK</span>
        </div>
      </div>
      <div className="flex-1 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorThrottle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBrake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="distance" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `${val}m`} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
              formatter={(value, name) => [`${Math.round(value)}%`, name.toUpperCase()]}
            />
            <Area type="stepBefore" dataKey="throttle" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorThrottle)" isAnimationActive={true} />
            <Area type="stepBefore" dataKey="brake" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBrake)" isAnimationActive={true} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
