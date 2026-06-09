import React, { useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';
import { getCircuitType } from '@/utils/circuitTypeMap';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-white/10 rounded-[10px] p-[14px] shadow-2xl">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
          {payload[0].payload.type}
        </div>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center gap-4 mb-1">
            <span className="font-heading font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono text-white/80 text-[13px]">Avg P{entry.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrackDNARadar = () => {
  const [mode, setMode] = useState('OVERLAID');
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

    const dataMap = {
      'Street Circuit': { d1Sum: 0, d1Count: 0, d2Sum: 0, d2Count: 0 },
      'High Speed': { d1Sum: 0, d1Count: 0, d2Sum: 0, d2Count: 0 },
      'Technical': { d1Sum: 0, d1Count: 0, d2Sum: 0, d2Count: 0 },
      'Mixed': { d1Sum: 0, d1Count: 0, d2Sum: 0, d2Count: 0 },
    };

    races.forEach(r => {
      const type = getCircuitType(r.Circuit.circuitId);
      if (!dataMap[type]) return;

      const r1 = r.Results?.find(x => x.Driver.driverId === driver1Id);
      const r2 = r.Results?.find(x => x.Driver.driverId === driver2Id);

      if (r1 && r1.status === "Finished" || r1?.status?.includes("+")) {
        dataMap[type].d1Sum += parseInt(r1.position);
        dataMap[type].d1Count++;
      }
      if (r2 && r2.status === "Finished" || r2?.status?.includes("+")) {
        dataMap[type].d2Sum += parseInt(r2.position);
        dataMap[type].d2Count++;
      }
    });

    return Object.keys(dataMap).map(type => ({
      type,
      // Default to 20 if no races finished to pull the radar to the edge
      [driver1Id]: dataMap[type].d1Count ? dataMap[type].d1Sum / dataMap[type].d1Count : 20,
      [driver2Id]: dataMap[type].d2Count ? dataMap[type].d2Sum / dataMap[type].d2Count : 20,
    }));
  }, [races, driver1Id, driver2Id]);

  if (!races) return <div className="w-full h-[300px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;

  const RadarInner = () => (
    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
      <PolarGrid stroke="rgba(255,255,255,0.06)" gridType="polygon" />
      <PolarAngleAxis dataKey="type" tick={{ fill: 'white', fontSize: 11, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }} />
      {/* Reversed domain so lower average (better position) is closer to the edge, making the shape bigger */}
      <PolarRadiusAxis angle={90} domain={[20, 1]} tick={false} axisLine={false} reversed />
      <Tooltip content={<CustomTooltip />} />
      <Radar name={d1Name} dataKey={driver1Id} stroke={c1} fill={c1} fillOpacity={0.2} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
      {mode === 'OVERLAID' && (
        <Radar name={d2Name} dataKey={driver2Id} stroke={c2} fill={c2} fillOpacity={0.2} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
      )}
    </RadarChart>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest">Circuit Performance DNA</h3>
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
          {['SEPARATE', 'OVERLAID'].map(tab => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`px-4 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-widest transition-all ${mode === tab ? 'bg-white/10 text-white font-bold' : 'text-white/50 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col items-center">
        {mode === 'OVERLAID' ? (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarInner />
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex w-full gap-6">
            <div className="flex-1 h-[300px] relative">
              <div className="absolute top-0 left-4 text-[14px] font-heading font-bold" style={{ color: c1 }}>{d1Name}</div>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" gridType="polygon" />
                  <PolarAngleAxis dataKey="type" tick={{ fill: 'white', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <PolarRadiusAxis angle={90} domain={[20, 1]} tick={false} axisLine={false} reversed />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar name={d1Name} dataKey={driver1Id} stroke={c1} fill={c1} fillOpacity={0.2} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 h-[300px] relative">
              <div className="absolute top-0 right-4 text-[14px] font-heading font-bold" style={{ color: c2 }}>{d2Name}</div>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" gridType="polygon" />
                  <PolarAngleAxis dataKey="type" tick={{ fill: 'white', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <PolarRadiusAxis angle={90} domain={[20, 1]} tick={false} axisLine={false} reversed />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar name={d2Name} dataKey={driver2Id} stroke={c2} fill={c2} fillOpacity={0.2} strokeWidth={2} isAnimationActive={true} animationDuration={800} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <div className="text-[10px] text-white/30 uppercase font-mono tracking-widest mt-2">
          Note: Outer edge = P1, Center = P20. Larger shape = better performance.
        </div>
      </div>
    </div>
  );
};
