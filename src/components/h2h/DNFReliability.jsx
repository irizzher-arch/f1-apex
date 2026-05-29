import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useStore } from '@/store/useStore';
import { useSeasonResults, useDriverStandings } from '@/hooks/useH2HData';
import { teamColors } from '@/utils/teamColors';

const MECH_CAUSES = ["Engine", "Gearbox", "Hydraulics", "Suspension", "Brakes", "Transmission", "Electrical", "Oil", "Water", "Power Unit"];
const ACC_CAUSES = ["Accident", "Collision", "Collision damage", "Spun off"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/95 border border-white/10 rounded-[10px] p-[10px] shadow-2xl">
        <div className="text-[11px] font-mono font-bold text-white uppercase">{data.name}</div>
        <div className="text-[13px] font-heading text-white">{data.value} DNF{data.value > 1 ? 's' : ''}</div>
      </div>
    );
  }
  return null;
};

export const DNFReliability = () => {
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

  const parseDNFs = (did) => {
    let mech = 0, acc = 0, other = 0, total = 0;
    const timeline = [];

    races?.forEach(r => {
      const res = r.Results?.find(x => x.Driver.driverId === did);
      if (res) {
        const status = res.status;
        const points = parseFloat(res.points);
        let isDNF = false;
        let cause = '';

        if (status !== "Finished" && !status.includes("+") && points === 0 && !status.includes("Lapped")) {
          isDNF = true;
          total++;
          if (MECH_CAUSES.some(c => status.includes(c))) { mech++; cause = 'Mechanical'; }
          else if (ACC_CAUSES.some(c => status.includes(c))) { acc++; cause = 'Accident'; }
          else { other++; cause = 'Other'; }
        }

        timeline.push({
          round: r.round,
          circuitName: r.raceName,
          status,
          isDNF,
          cause
        });
      }
    });

    return { 
      total, 
      data: [
        { name: 'Mechanical', value: mech, color: '#FF8700' },
        { name: 'Accident', value: acc, color: '#E8002D' },
        { name: 'Other', value: other, color: 'rgba(255,255,255,0.3)' }
      ].filter(d => d.value > 0),
      timeline 
    };
  };

  const d1Data = useMemo(() => parseDNFs(driver1Id), [races, driver1Id]);
  const d2Data = useMemo(() => parseDNFs(driver2Id), [races, driver2Id]);

  if (!races) return <div className="w-full h-[300px] bg-white/5 animate-pulse rounded-2xl max-w-[1400px] mx-auto mt-16 px-6" />;

  const Donut = ({ driverName, tColor, dData }) => (
    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between">
      <div className="text-[12px] font-heading text-white uppercase tracking-widest font-bold mb-4" style={{ color: tColor }}>{driverName}</div>
      <div className="relative w-[180px] h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dData.data.length ? dData.data : [{ name: 'None', value: 1, color: 'rgba(255,255,255,0.05)' }]}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {(dData.data.length ? dData.data : [{ name: 'None', value: 1, color: 'rgba(255,255,255,0.05)' }]).map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-mono text-3xl font-black text-white">{dData.total}</div>
          <div className="text-[9px] uppercase tracking-widest text-white/40">Total DNFs</div>
        </div>
      </div>
      <div className="mt-6 w-full flex flex-wrap justify-center gap-4">
        {dData.data.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            <div className="text-[10px] font-mono text-white/70 uppercase"><span className="text-white font-bold">{d.value}</span> {d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-16 px-6">
      <h3 className="text-sm font-heading text-white/50 uppercase tracking-widest mb-6">Reliability & DNF Breakdown</h3>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Donut driverName={d1Name} tColor={c1} dData={d1Data} />
        <Donut driverName={d2Name} tColor={c2} dData={d2Data} />
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-[10px] uppercase font-mono text-white/40 tracking-widest mb-4">DNF Timeline</h4>
        <div className="flex flex-col gap-4">
          
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="w-12 shrink-0 font-heading text-[12px] uppercase font-bold" style={{ color: c1 }}>{d1Name}</div>
            {d1Data.timeline.map((t, i) => (
              <div key={i} className="relative group cursor-help shrink-0">
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold ${t.isDNF ? 'bg-f1-red text-white' : 'bg-[#00AA44]/20 text-[#00AA44]'}`}>
                  {t.isDNF ? '✕' : ''}
                </div>
                {/* Custom Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-black/95 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Round {t.round}</div>
                  <div className="text-[11px] font-bold text-white">{t.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="w-12 shrink-0 font-heading text-[12px] uppercase font-bold" style={{ color: c2 }}>{d2Name}</div>
            {d2Data.timeline.map((t, i) => (
              <div key={i} className="relative group cursor-help shrink-0">
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold ${t.isDNF ? 'bg-f1-red text-white' : 'bg-[#00AA44]/20 text-[#00AA44]'}`}>
                  {t.isDNF ? '✕' : ''}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-black/95 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Round {t.round}</div>
                  <div className="text-[11px] font-bold text-white">{t.status}</div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};
