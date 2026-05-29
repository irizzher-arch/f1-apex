import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useLapData, useStintData, useRaceControlData } from '@/hooks/useRacePaceQueries';
import { filterCleanLaps } from '@/utils/lapTimeUtils';
import { mapRaceControlToLaps } from '@/utils/scVscMapper';
import { processDegradationData, calculateLinearRegression } from '@/utils/degradationUtils';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from 'recharts';

const COMPOUND_COLORS = {
  SOFT: '#E8002D',
  MEDIUM: '#FFD700',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#00AA44',
  WET: '#0080FF'
};

export const TyreDegradationChart = () => {
  const { racePace } = useStore();
  const { sessionKey, selectedDrivers } = racePace;
  
  const [activeCompounds, setActiveCompounds] = useState({ SOFT: true, MEDIUM: true, HARD: true });
  
  const { data: laps } = useLapData(sessionKey, racePace.isLive);
  const { data: stints } = useStintData(sessionKey);
  const { data: raceControl } = useRaceControlData(sessionKey);

  const { chartData, regressions } = useMemo(() => {
    if (!laps || !stints) return { chartData: [], regressions: {} };
    
    const scVscRanges = mapRaceControlToLaps(raceControl, laps);
    const cleanLaps = filterCleanLaps(laps, scVscRanges, false); // always hide outliers for degradation
    
    // Process all driver laps mapped to stints
    const degDataRaw = processDegradationData(cleanLaps, stints);
    
    // Filter to selected drivers
    const degData = degDataRaw.filter(d => selectedDrivers.includes(d.driver_number));
    
    // Calculate personal best per driver per stint (or overall) to get a delta.
    // For true degradation, we plot delta from personal best on that specific stint
    const stintBasePaces = {};
    degData.forEach(d => {
      const key = `${d.driver_number}_${d.stintNumber}`;
      if (!stintBasePaces[key] || d.lap_duration < stintBasePaces[key]) {
        stintBasePaces[key] = d.lap_duration;
      }
    });
    
    const plotData = degData.map(d => ({
      ...d,
      delta: d.lap_duration - stintBasePaces[`${d.driver_number}_${d.stintNumber}`],
    })).filter(d => d.delta < 5); // filter out huge anomalies (>5s off pace)
    
    // Calculate Regression per compound
    const regResults = {};
    ['SOFT', 'MEDIUM', 'HARD'].forEach(compound => {
      const cData = plotData.filter(d => d.compound === compound);
      if (cData.length > 5) {
        const points = cData.map(d => ({ x: d.tyreAge, y: d.delta }));
        regResults[compound] = calculateLinearRegression(points);
      }
    });
    
    return { chartData: plotData, regressions: regResults };
  }, [laps, stints, raceControl, selectedDrivers]);

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4 mt-6">
      <div className="flex justify-between items-center z-10 relative">
        <h3 className="text-xs font-heading font-bold tracking-widest uppercase text-white/50">Degradation Curves</h3>
        
        <div className="flex gap-2">
          {['SOFT', 'MEDIUM', 'HARD'].map(comp => (
            <button
              key={comp}
              onClick={() => setActiveCompounds(prev => ({ ...prev, [comp]: !prev[comp] }))}
              className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all border ${activeCompounds[comp] ? 'bg-white/10 text-white' : 'bg-transparent text-white/30 border-white/5 hover:bg-white/5'}`}
              style={{ borderColor: activeCompounds[comp] ? COMPOUND_COLORS[comp] : 'transparent' }}
            >
              <span className="w-2 h-2 inline-block rounded-full mr-1.5 align-middle" style={{ backgroundColor: COMPOUND_COLORS[comp] }}></span>
              {comp}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 100, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="tyreAge" type="number" name="Tyre Age" domain={[0, 'dataMax']} stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <YAxis dataKey="delta" type="number" name="Pace Drop" domain={[0, 'auto']} stroke="transparent" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `+${val.toFixed(1)}s`} width={50} />
            
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }}
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              formatter={(value, name) => [ `+${value.toFixed(3)}s`, name ]}
            />

            {['SOFT', 'MEDIUM', 'HARD'].map(compound => {
              if (!activeCompounds[compound]) return null;
              const color = COMPOUND_COLORS[compound];
              const cData = chartData.filter(d => d.compound === compound);
              
              // Regression Line computation for plot
              let regLine = [];
              const reg = regressions[compound];
              if (reg && cData.length > 0) {
                const maxAge = Math.max(...cData.map(d => d.tyreAge));
                regLine = [
                  { tyreAge: 0, delta: reg.intercept },
                  { tyreAge: maxAge, delta: reg.intercept + (reg.slope * maxAge) }
                ];
              }

              return (
                <React.Fragment key={compound}>
                  <Scatter name={compound} data={cData} fill={color} fillOpacity={0.6} shape="circle" isAnimationActive={true} animationDuration={1000} />
                  
                  {regLine.length > 0 && (
                    <Line 
                      data={regLine} 
                      type="linear" 
                      dataKey="delta" 
                      stroke={color} 
                      strokeWidth={2} 
                      strokeDasharray="8 4" 
                      dot={false} 
                      activeDot={false} 
                      isAnimationActive={false} 
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend / Slopes */}
      <div className="absolute right-4 top-20 flex flex-col gap-3">
        {['SOFT', 'MEDIUM', 'HARD'].map(comp => {
          if (!activeCompounds[comp] || !regressions[comp]) return null;
          return (
             <div key={comp} className="flex flex-col items-end">
               <span className="font-mono text-xs font-bold" style={{ color: COMPOUND_COLORS[comp] }}>+{regressions[comp].slope.toFixed(3)}s / lap</span>
               <span className="font-mono text-[9px] text-white/40 uppercase">{comp} DEGRADATION</span>
             </div>
          )
        })}
      </div>

    </div>
  );
};
