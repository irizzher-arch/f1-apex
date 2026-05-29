import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { useStore } from '@/store/useStore';
import { useQualifyingData, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';
import { parseLapTimeToMs } from '@/utils/formatLapTime';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.isDNS) {
      return (
        <div className="bg-black/95 border border-white/10 rounded-[10px] p-[14px] shadow-2xl">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
            Round {data.round} - {data.circuitName}
          </div>
          <div className="text-white font-mono">One or both drivers did not set a time.</div>
        </div>
      );
    }

    const { d1Name, d2Name, d1Time, d2Time, d1Pos, d2Pos, gap, faster, c1, c2 } = data;

    return (
      <div className="bg-black/95 border border-white/10 rounded-[10px] p-[14px] shadow-2xl min-w-[220px]">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
          Round {data.round} - {data.circuitName}
        </div>
        
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="font-heading font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c1 }} />
              {d1Name} (P{d1Pos})
            </span>
            <span className="font-mono text-white/80 text-[13px]">{d1Time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-heading font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c2 }} />
              {d2Name} (P{d2Pos})
            </span>
            <span className="font-mono text-white/80 text-[13px]">{d2Time}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 text-right">
          <span className="text-[11px] font-mono uppercase tracking-widest font-bold" style={{ color: faster === 1 ? c1 : c2 }}>
            {faster === 1 ? d1Name : d2Name} FASTER BY {Math.abs(gap).toFixed(3)}s
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const QualifyingGapChart = () => {
  const { h2h } = useStore();
  const { driver1Id, driver2Id, season } = h2h;

  const { data: qualis } = useQualifyingData(season);
  const { data: standings } = useDriverStandings(season);

  const d1Stats = standings?.find(s => s.Driver.driverId === driver1Id);
  const d2Stats = standings?.find(s => s.Driver.driverId === driver2Id);
  
  const c1 = teamColors[d1Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const c2 = teamColors[d2Stats?.Constructors[0]?.constructorId] || '#ffffff';
  const d1Name = d1Stats?.Driver.code || driver1Id.substring(0,3).toUpperCase();
  const d2Name = d2Stats?.Driver.code || driver2Id.substring(0,3).toUpperCase();

  const chartData = useMemo(() => {
    if (!qualis) return [];
    
    return qualis.map((q) => {
      const r1 = q.QualifyingResults?.find(r => r.Driver.driverId === driver1Id);
      const r2 = q.QualifyingResults?.find(r => r.Driver.driverId === driver2Id);
      
      const t1Str = r1 ? (r1.Q3 || r1.Q2 || r1.Q1) : null;
      const t2Str = r2 ? (r2.Q3 || r2.Q2 || r2.Q1) : null;

      const t1Ms = parseLapTimeToMs(t1Str);
      const t2Ms = parseLapTimeToMs(t2Str);

      let gap = 0;
      let isDNS = false;

      if (!t1Ms || !t2Ms) {
        isDNS = true;
      } else {
        // Driver 1 faster = positive gap. Driver 1 time is smaller.
        gap = (t2Ms - t1Ms) / 1000;
      }

      return {
        round: q.round,
        circuitCode: q.Circuit.Location.country.substring(0,3).toUpperCase(),
        circuitName: q.raceName,
        gap,
        isDNS,
        d1Name, d2Name, c1, c2,
        d1Pos: r1?.position || '-', d2Pos: r2?.position || '-',
        d1Time: t1Str || 'No Time', d2Time: t2Str || 'No Time',
        faster: gap > 0 ? 1 : gap < 0 ? 2 : 0,
      };
    });
  }, [qualis, driver1Id, driver2Id, c1, c2, d1Name, d2Name]);

  const avgGap = useMemo(() => {
    const valid = chartData.filter(d => !d.isDNS);
    if (!valid.length) return 0;
    const sum = valid.reduce((acc, d) => acc + d.gap, 0);
    return sum / valid.length;
  }, [chartData]);

  if (!qualis) {
    return <div className="w-full h-[260px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest mb-6">Qualifying Battle — Gap Per Round</h3>
      
      <div className="w-full h-[260px] bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="round" 
                tickFormatter={(tick, i) => chartData[i]?.circuitCode}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                tickFormatter={(val) => val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="6 3" />
              <ReferenceLine y={avgGap} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              
              <Bar dataKey="gap" isAnimationActive={true} animationDuration={1000} radius={[4, 4, 4, 4]} barSize={24}>
                {chartData.map((entry, index) => {
                  if (entry.isDNS) return <Cell key={`cell-${index}`} fill="rgba(255,255,255,0.1)" />;
                  return <Cell key={`cell-${index}`} fill={entry.gap > 0 ? c1 : c2} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {avgGap !== 0 && (
          <div className="absolute top-4 right-6 flex items-center">
            <div 
              className="px-4 py-1.5 rounded-full font-mono text-[11px] font-bold tracking-widest border"
              style={{ 
                backgroundColor: `${avgGap > 0 ? c1 : c2}1A`, 
                color: avgGap > 0 ? c1 : c2,
                borderColor: `${avgGap > 0 ? c1 : c2}4D` 
              }}
            >
              {avgGap > 0 ? d1Name : d2Name} FASTER ON AVG BY {Math.abs(avgGap).toFixed(3)}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
