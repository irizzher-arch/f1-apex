import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

const MOCK_DATA = Array.from({ length: 100 }, (_, i) => {
  return {
    distance: i * 50,
    rpm: 10500 + Math.random() * 2000,
    gForce: Math.sin(i / 4) * 4 + (Math.random() * 0.5 - 0.25),
  };
});

export const TelemetryGForce = () => {
  return (
    <div className="f1-card flex flex-col h-full bg-background-card border-none rounded-xl overflow-hidden shadow-lg border border-white/5 relative group">
      <div className="corner-accent corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-2">
          <Zap className="w-4 h-4 text-f1-red" /> RPM & G-Force
        </h2>
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400"></span> RPM</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> LAT G</span>
        </div>
      </div>
      <div className="flex-1 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="distance" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `${val}m`} />
            
            {/* Left Y Axis for RPM */}
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[8000, 13000]} />
            
            {/* Right Y Axis for G-Force */}
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[-5, 5]} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
              formatter={(value, name) => {
                if (name === 'rpm') return [`${Math.round(value)}`, 'RPM'];
                if (name === 'gForce') return [`${value.toFixed(2)} G`, 'Lat G'];
                return [value, name];
              }}
            />
            
            <Line yAxisId="left" type="monotone" dataKey="rpm" stroke="#2dd4bf" strokeWidth={2} dot={false} isAnimationActive={true} />
            <Line yAxisId="right" type="monotone" dataKey="gForce" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
