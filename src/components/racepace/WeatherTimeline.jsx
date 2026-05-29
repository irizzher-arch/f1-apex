import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useWeatherData, useLapData } from '@/hooks/useRacePaceQueries';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

export const WeatherTimeline = () => {
  const { racePace } = useStore();
  const { sessionKey } = racePace;
  
  const { data: weather } = useWeatherData(sessionKey, racePace.isLive);
  const { data: laps } = useLapData(sessionKey, racePace.isLive);

  const chartData = useMemo(() => {
    if (!weather || !laps || laps.length === 0) return [];
    
    // Create a time mapping from lap numbers
    const lapStarts = laps.filter(l => l.driver_number === laps[0].driver_number).map(l => ({ lap: l.lap_number, time: new Date(l.date_start).getTime() }));
    
    // Map weather entries to lap numbers
    const data = weather.map(w => {
      const wTime = new Date(w.date).getTime();
      let nearestLap = 1;
      let minDiff = Infinity;
      
      lapStarts.forEach(l => {
        const diff = Math.abs(l.time - wTime);
        if (diff < minDiff) {
          minDiff = diff;
          nearestLap = l.lap;
        }
      });
      
      return {
        ...w,
        lap: nearestLap,
        timeLabel: new Date(w.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
    
    // Group by lap to simplify
    const grouped = [];
    data.forEach(d => {
      const existing = grouped.find(g => g.lap === d.lap);
      if (existing) {
        existing.air_temperature = d.air_temperature;
        existing.track_temperature = d.track_temperature;
        existing.humidity = d.humidity;
      } else {
        grouped.push(d);
      }
    });
    
    return grouped.sort((a,b) => a.lap - b.lap);
  }, [weather, laps]);

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pt-6 relative group flex flex-col gap-4 mt-6">
      <h3 className="absolute top-4 left-6 text-xs font-heading font-bold tracking-widest uppercase text-white/50 z-10">Track Conditions</h3>
      
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="lap" type="number" domain={['dataMin', 'dataMax']} stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            
            <YAxis 
              yAxisId="temp"
              domain={['auto', 'auto']} 
              stroke="transparent" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
              tickFormatter={(val) => `${val}°C`} 
              width={50} 
            />
            
            <YAxis 
              yAxisId="humidity"
              orientation="right"
              domain={[0, 100]} 
              stroke="transparent" 
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
              tickFormatter={(val) => `${val}%`} 
              width={50} 
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
              labelFormatter={(label) => `LAP ${label}`}
            />

            <Line yAxisId="temp" type="monotone" dataKey="track_temperature" name="Track Temp" stroke="#E8002D" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line yAxisId="temp" type="monotone" dataKey="air_temperature" name="Air Temp" stroke="#00D2BE" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Area yAxisId="humidity" type="monotone" dataKey="humidity" name="Humidity" fill="#0082FF" stroke="#0082FF" fillOpacity={0.1} strokeWidth={1} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
