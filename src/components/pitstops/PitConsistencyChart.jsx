import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { calculateMedian, calculateIQR } from '@/utils/pitStopCalculations';
import { teamColors } from '@/utils/teamColors';

export const PitConsistencyChart = ({ allStops, drivers, isLoading }) => {
  const { pitStops } = useStore();
  const { selectedRound } = pitStops;
  const [groupBy, setGroupBy] = useState('DRIVER'); // DRIVER | CONSTRUCTOR

  const chartData = useMemo(() => {
    if (!allStops || !drivers) return [];
    
    let filtered = allStops;
    if (selectedRound !== 'ALL') {
      filtered = filtered.filter(s => String(s.round) === String(selectedRound));
    }

    const grouped = {};

    filtered.forEach(stop => {
      const drv = stop.driverObj;
      const constructorId = stop.constructorId || 'unknown';
      const key = groupBy === 'DRIVER' ? (drv?.name_acronym || stop.driverId) : constructorId;
      const tColor = drv?.team_colour ? `#${drv.team_colour}` : (teamColors[constructorId] || '#ffffff');

      if (!grouped[key]) {
        grouped[key] = { key, color: tColor, durations: [], name: groupBy === 'DRIVER' ? (drv?.full_name || stop.driverId) : constructorId.toUpperCase() };
      }
      grouped[key].durations.push(stop.durationMs / 1000);
    });

    const plotData = [];
    Object.values(grouped).forEach(group => {
      if (group.durations.length === 0) return;
      const { q1, q3, iqr } = calculateIQR(group.durations);
      const median = calculateMedian(group.durations);
      const lowerLimit = q1 - (1.5 * iqr);
      const upperLimit = q3 + (1.5 * iqr);
      
      group.durations.forEach(val => {
        const isOutlier = val < lowerLimit || val > upperLimit;
        plotData.push({
          x: group.key,
          y: val,
          color: group.color,
          name: group.name,
          median,
          isOutlier,
          q1, q3
        });
      });
    });

    return plotData;
  }, [allStops, drivers, selectedRound, groupBy]);

  if (isLoading) {
    return <div className="w-full h-[400px] bg-white/5 rounded-xl animate-pulse"></div>;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md font-mono text-xs text-white">
          <div className="font-bold text-sm mb-1" style={{ color: data.color }}>{data.name}</div>
          <div className="flex justify-between gap-4"><span>Duration:</span> <span className="font-bold">{data.y.toFixed(3)}s</span></div>
          <div className="flex justify-between gap-4 text-white/50"><span>Median:</span> <span>{data.median.toFixed(3)}s</span></div>
          {data.isOutlier && <div className="mt-2 text-[#FF8700] font-bold">⚠️ OUTLIER STOP</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">Pit Stop Times Consistency</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setGroupBy('DRIVER')}
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all border ${groupBy === 'DRIVER' ? 'bg-[#E8002D]/20 text-[#E8002D] border-[#E8002D]/30' : 'bg-transparent text-white/30 border-white/5 hover:bg-white/5'}`}
          >
            BY DRIVER
          </button>
          <button 
            onClick={() => setGroupBy('CONSTRUCTOR')}
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all border ${groupBy === 'CONSTRUCTOR' ? 'bg-[#E8002D]/20 text-[#E8002D] border-[#E8002D]/30' : 'bg-transparent text-white/30 border-white/5 hover:bg-white/5'}`}
          >
            BY CONSTRUCTOR
          </button>
        </div>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="x" type="category" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} interval={0} angle={groupBy === 'DRIVER' ? -45 : 0} textAnchor={groupBy === 'DRIVER' ? 'end' : 'middle'} height={groupBy === 'DRIVER' ? 50 : 30} />
            <YAxis dataKey="y" type="number" domain={[1.5, 6.0]} stroke="transparent" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => `${v.toFixed(1)}s`} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
            
            <Scatter data={chartData} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isOutlier ? 'none' : entry.color} stroke={entry.isOutlier ? '#FF8700' : entry.color} strokeWidth={entry.isOutlier ? 1.5 : 0} fillOpacity={0.6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
