import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from 'recharts';
import { teamColors } from '@/utils/teamColors';

export const AvgTimePerGPChart = ({ allStops, schedule, drivers, isLoading }) => {
  const [viewMode, setViewMode] = useState('FIELD'); // FIELD | TEAM

  const chartData = useMemo(() => {
    if (!allStops || !schedule || !drivers) return { data: [], seasonAvg: 0 };
    
    let totalDuration = 0;
    let totalStops = 0;

    const roundMap = {};

    schedule.forEach(r => {
      roundMap[r.round] = {
        round: parseInt(r.round),
        circuit: r.Circuit.circuitId,
        country: r.Circuit.Location.country,
        totalTime: 0,
        count: 0,
        teams: {},
      };
    });

    allStops.forEach(stop => {
      if (!roundMap[stop.round]) return;
      const drv = stop.driverObj;
      const constructorId = stop.constructorId || 'unknown';
      const dur = stop.durationMs / 1000;
      
      roundMap[stop.round].totalTime += dur;
      roundMap[stop.round].count += 1;
      
      if (!roundMap[stop.round].teams[constructorId]) {
        roundMap[stop.round].teams[constructorId] = { total: 0, count: 0, color: drv?.team_colour ? `#${drv.team_colour}` : (teamColors[constructorId] || '#fff') };
      }
      roundMap[stop.round].teams[constructorId].total += dur;
      roundMap[stop.round].teams[constructorId].count += 1;

      totalDuration += dur;
      totalStops += 1;
    });

    const data = Object.values(roundMap).filter(r => r.count > 0).map(r => {
      const res = {
        name: `Rd ${r.round} ${r.circuit.substring(0,3).toUpperCase()}`,
        avgField: r.totalTime / r.count,
        country: r.country,
      };
      Object.keys(r.teams).forEach(t => {
        res[t] = r.teams[t].total / r.teams[t].count;
        res[`${t}_color`] = r.teams[t].color;
      });
      return res;
    });

    data.sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

    return {
      data,
      seasonAvg: totalStops > 0 ? totalDuration / totalStops : 0
    };
  }, [allStops, schedule, drivers]);

  if (isLoading) return <div className="w-full h-[400px] bg-white/5 rounded-xl animate-pulse"></div>;

  const activeTeams = Array.from(new Set(chartData.data.flatMap(d => Object.keys(d).filter(k => k !== 'name' && k !== 'avgField' && k !== 'country' && !k.includes('_color')))));

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">Average Pit Stop Time Per GP</h3>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('FIELD')} className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all border ${viewMode === 'FIELD' ? 'bg-[#E8002D]/20 text-[#E8002D] border-[#E8002D]/30' : 'bg-transparent text-white/30 border-white/5 hover:bg-white/5'}`}>
            FIELD AVERAGE
          </button>
          <button onClick={() => setViewMode('TEAM')} className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all border ${viewMode === 'TEAM' ? 'bg-[#E8002D]/20 text-[#E8002D] border-[#E8002D]/30' : 'bg-transparent text-white/30 border-white/5 hover:bg-white/5'}`}>
            TEAM BREAKDOWN
          </button>
        </div>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.data} margin={{ top: 20, right: 30, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickMargin={10} />
            <YAxis domain={[2.0, 4.5]} stroke="transparent" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v.toFixed(1)}s`} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#fff' }} />
            <ReferenceLine y={chartData.seasonAvg} stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" label={{ position: 'right', value: `SEASON AVG: ${chartData.seasonAvg.toFixed(2)}s`, fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            
            {viewMode === 'FIELD' ? (
              <Bar dataKey="avgField" fill="#E8002D" radius={[2, 2, 0, 0]} isAnimationActive={true} animationDuration={1000}>
                {chartData.data.map((entry, index) => {
                  const minAvg = Math.min(...chartData.data.map(d => d.avgField));
                  const isFastest = entry.avgField === minAvg;
                  return <Cell key={`cell-${index}`} fill={isFastest ? '#FFD700' : '#E8002D'} fillOpacity={isFastest ? 1 : 0.8} style={{ filter: isFastest ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))' : 'none' }} />;
                })}
              </Bar>
            ) : (
              activeTeams.map(t => (
                <Bar key={t} dataKey={t} fill={teamColors[t] || '#ffffff'} radius={[2, 2, 0, 0]} isAnimationActive={true} animationDuration={1000} barSize={6} />
              ))
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
