import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-white/10 rounded-[10px] p-[14px] shadow-2xl">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
          Position: {payload[0].payload.position}
        </div>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-heading font-bold text-white uppercase">{entry.name}</span>
            <span className="font-mono text-[14px] ml-auto">{entry.value}x</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const PositionDistribution = () => {
  const [mode, setMode] = useState('OVERLAID'); // SEPARATE | OVERLAID
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
    
    // Positions 1-20 + DNF
    const dist = Array.from({ length: 21 }, (_, i) => ({
      position: i === 20 ? 'DNF' : `P${i + 1}`,
      [driver1Id]: 0,
      [driver2Id]: 0
    }));

    races.forEach(r => {
      [driver1Id, driver2Id].forEach(did => {
        const res = r.Results?.find(x => x.Driver.driverId === did);
        if (res) {
          if (res.status !== "Finished" && !res.status.includes("+") && parseFloat(res.points) === 0) {
            dist[20][did]++;
          } else {
            const p = parseInt(res.position);
            if (p >= 1 && p <= 20) dist[p - 1][did]++;
          }
        }
      });
    });

    return dist;
  }, [races, driver1Id, driver2Id]);

  if (!races) return <div className="w-full h-[300px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;

  const mostFreq1 = chartData.reduce((prev, current) => (prev[driver1Id] > current[driver1Id]) ? prev : current);
  const mostFreq2 = chartData.reduce((prev, current) => (prev[driver2Id] > current[driver2Id]) ? prev : current);

  const best1 = chartData.find(d => d[driver1Id] > 0 && d.position !== 'DNF')?.position || '-';
  const best2 = chartData.find(d => d[driver2Id] > 0 && d.position !== 'DNF')?.position || '-';

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest">Finish Position Distribution</h3>
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

      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative">
        {mode === 'OVERLAID' ? (
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="position" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey={driver1Id} name={d1Name} fill={c1} radius={[4, 4, 0, 0]} isAnimationActive={true}>
                  {chartData.map((entry, index) => (
                    <Cell key={`c1-${index}`} fill={entry.position === 'DNF' ? '#E8002D' : c1} style={entry.position === 'P1' ? { filter: `drop-shadow(0 0 6px ${c1})` } : {}} />
                  ))}
                </Bar>
                <Bar dataKey={driver2Id} name={d2Name} fill={c2} radius={[4, 4, 0, 0]} isAnimationActive={true}>
                  {chartData.map((entry, index) => (
                    <Cell key={`c2-${index}`} fill={entry.position === 'DNF' ? '#E8002D' : c2} style={entry.position === 'P1' ? { filter: `drop-shadow(0 0 6px ${c2})` } : {}} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="w-full h-[140px]">
              <div className="text-[10px] font-mono text-white/50 mb-2 uppercase" style={{ color: c1 }}>{d1Name}</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -30, bottom: 0 }}>
                  <XAxis dataKey="position" hide />
                  <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey={driver1Id} name={d1Name} fill={c1} radius={[4, 4, 0, 0]} isAnimationActive={true}>
                    {chartData.map((entry, index) => <Cell key={`c1-${index}`} fill={entry.position === 'DNF' ? '#E8002D' : c1} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full h-[140px]">
              <div className="text-[10px] font-mono text-white/50 mb-2 uppercase" style={{ color: c2 }}>{d2Name}</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -30, bottom: 0 }}>
                  <XAxis dataKey="position" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey={driver2Id} name={d2Name} fill={c2} radius={[4, 4, 0, 0]} isAnimationActive={true}>
                    {chartData.map((entry, index) => <Cell key={`c2-${index}`} fill={entry.position === 'DNF' ? '#E8002D' : c2} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Stats Strip */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between gap-4 flex-col md:flex-row">
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono uppercase text-white/70">
               {d1Name} MOST FREQUENT: <strong className="text-white">{mostFreq1.position}</strong> ({mostFreq1[driver1Id]}x)
             </div>
             <div className="px-3 py-1 bg-[#27F4D2]/10 border border-[#27F4D2]/30 rounded-full text-[11px] font-mono uppercase text-[#27F4D2]">
               BEST: {best1}
             </div>
          </div>
          <div className="flex items-center gap-4 md:justify-end">
             <div className="px-3 py-1 bg-[#27F4D2]/10 border border-[#27F4D2]/30 rounded-full text-[11px] font-mono uppercase text-[#27F4D2]">
               BEST: {best2}
             </div>
             <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono uppercase text-white/70">
               {d2Name} MOST FREQUENT: <strong className="text-white">{mostFreq2.position}</strong> ({mostFreq2[driver2Id]}x)
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
