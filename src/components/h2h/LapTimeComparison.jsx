import React, { useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';
import { formatLapTime, parseLapTimeToMs } from '@/utils/formatLapTime';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/95 border border-white/10 rounded-[10px] p-[14px] shadow-2xl">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
          Round {data.round} - {data.circuitName}
        </div>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center gap-4 mb-1">
            <span className="font-heading font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono text-white/80 text-[13px]">{formatLapTime(entry.value)}</span>
          </div>
        ))}
        {data.faster && (
          <div className="mt-2 pt-2 border-t border-white/10 text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: data.fasterColor }}>
              {data.faster} FASTER BY {data.gap.toFixed(3)}s
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const LapTimeComparison = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;

  const { data: races } = useSeasonResults(season);
  const { data: standings } = useDriverStandings(season);

  const d1Stats = standings?.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings?.find(s => s.Driver.driverId === driver2Id);
  
  const c1 = teamColors[d1Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const c2 = teamColors[d2Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const d1Name = d1Stats?.Driver.code || driver1Id.substring(0,3).toUpperCase();
  const d2Name = d2Stats?.Driver.code || driver2Id.substring(0,3).toUpperCase();

  const chartData = useMemo(() => {
    if (!races) return [];
    
    return races.map(r => {
      const res1 = r.Results?.find(x => x.Driver.driverId === driver1Id);
      const res2 = r.Results?.find(x => x.Driver.driverId === driver2Id);

      const t1 = parseLapTimeToMs(res1?.FastestLap?.Time?.time) / 1000 || null;
      const t2 = parseLapTimeToMs(res2?.FastestLap?.Time?.time) / 1000 || null;

      let faster = null;
      let fasterColor = null;
      let gap = null;

      if (t1 && t2) {
        if (t1 < t2) { faster = d1Name; fasterColor = c1; gap = t2 - t1; }
        else if (t2 < t1) { faster = d2Name; fasterColor = c2; gap = t1 - t2; }
      }

      return {
        round: r.round,
        circuitCode: r.Circuit.Location.country.substring(0,3).toUpperCase(),
        circuitName: r.raceName,
        [driver1Id]: t1,
        [driver2Id]: t2,
        faster,
        fasterColor,
        gap
      };
    });
  }, [races, driver1Id, driver2Id, d1Name, d2Name, c1, c2]);

  if (!races) return <div className="w-full h-[280px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;

  // Calculate Averages
  const avg1 = chartData.filter(d => d[driver1Id]).reduce((acc, d) => acc + d[driver1Id], 0) / (chartData.filter(d => d[driver1Id]).length || 1);
  const avg2 = chartData.filter(d => d[driver2Id]).reduce((acc, d) => acc + d[driver2Id], 0) / (chartData.filter(d => d[driver2Id]).length || 1);

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest mb-6">Fastest Lap Comparison By Round</h3>
      
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative">
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="round" tickFormatter={(tick, i) => chartData[i]?.circuitCode} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={['auto', 'auto']} tickFormatter={(val) => formatLapTime(val)} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              
              <Line connectNulls type="monotone" dataKey={driver1Id} name={d1Name} stroke={c1} strokeWidth={2.5} dot={{ r: 4, fill: c1, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', strokeWidth: 0, style: { filter: `drop-shadow(0 0 8px ${c1})` } }} isAnimationActive={true} />
              <Line connectNulls type="monotone" dataKey={driver2Id} name={d2Name} stroke={c2} strokeWidth={2.5} dot={{ r: 4, fill: c2, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', strokeWidth: 0, style: { filter: `drop-shadow(0 0 8px ${c2})` } }} isAnimationActive={true} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 flex justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-[10px] uppercase font-heading text-white/40 tracking-widest mb-1">Avg Fastest Lap</div>
            <div className="font-mono text-xl font-bold" style={{ color: c1 }}>{formatLapTime(avg1)}</div>
          </div>
          <div className="text-white/20">VS</div>
          <div className="text-center">
            <div className="text-[10px] uppercase font-heading text-white/40 tracking-widest mb-1">Avg Fastest Lap</div>
            <div className="font-mono text-xl font-bold" style={{ color: c2 }}>{formatLapTime(avg2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
