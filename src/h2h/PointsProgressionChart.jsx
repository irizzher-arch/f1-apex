import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d1 = payload[0];
    const d2 = payload[1];
    
    // determine leader
    let leader = null;
    let diff = 0;
    if (d1 && d2) {
      if (d1.value > d2.value) { leader = d1; diff = d1.value - d2.value; }
      else if (d2.value > d1.value) { leader = d2; diff = d2.value - d1.value; }
    }

    return (
      <div className="bg-black/95 border border-white/10 rounded-[10px] p-[14px] shadow-2xl min-w-[200px]">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
          Round {label} - {payload[0]?.payload?.circuitName}
        </div>
        
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-heading font-bold text-white uppercase">{entry.name}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] text-white/40 font-mono">+{entry.payload[`pts_${entry.dataKey}`]}</span>
              <span className="font-mono font-bold text-white text-[14px]">{entry.value}</span>
            </div>
          </div>
        ))}

        {leader && diff > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10 text-right">
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: leader.color }}>
              +{diff} pts gap
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const PointsProgressionChart = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;

  const { data: races } = useSeasonResults(season);
  const { data: standings } = useDriverStandings(season);

  const chartData = useMemo(() => {
    if (!races) return [];
    
    let cum1 = 0;
    let cum2 = 0;
    
    return races.map((race) => {
      const r1 = race.Results?.find(r => r.Driver.driverId === driver1Id);
      const r2 = race.Results?.find(r => r.Driver.driverId === driver2Id);
      
      const pts1 = r1 ? parseFloat(r1.points) : 0;
      const pts2 = r2 ? parseFloat(r2.points) : 0;
      
      cum1 += pts1;
      cum2 += pts2;

      return {
        round: race.round,
        circuitCode: race.Circuit.Location.country.substring(0,3).toUpperCase(),
        circuitName: race.raceName,
        [driver1Id]: cum1,
        [driver2Id]: cum2,
        [`pts_${driver1Id}`]: pts1,
        [`pts_${driver2Id}`]: pts2,
      };
    });
  }, [races, driver1Id, driver2Id]);

  if (!races) {
    return <div className="w-full h-[320px] bg-white/5 animate-pulse rounded-2xl" />;
  }

  const d1Stats = standings?.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings?.find(s => s.Driver.driverId === driver2Id);
  
  const c1 = teamColors[d1Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const c2 = teamColors[d2Stats?.Constructors[0]?.constructorId] || '#ffffff';
  
  const d1Name = d1Stats?.Driver.code || driver1Id.substring(0,3).toUpperCase();
  const d2Name = d2Stats?.Driver.code || driver2Id.substring(0,3).toUpperCase();

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest mb-6">Championship Points Progression</h3>
      <div className="w-full h-[320px] bg-white/5 border border-white/10 rounded-2xl p-6 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
            <XAxis 
              dataKey="round" 
              tickFormatter={(tick, i) => chartData[i]?.circuitCode}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              dy={10}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey={driver1Id} 
              name={d1Name}
              stroke={c1} 
              strokeWidth={3}
              dot={{ r: 4, fill: c1, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', style: { filter: `drop-shadow(0 0 8px ${c1})` } }}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey={driver2Id} 
              name={d2Name}
              stroke={c2} 
              strokeWidth={3}
              dot={{ r: 4, fill: c2, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', style: { filter: `drop-shadow(0 0 8px ${c2})` } }}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
