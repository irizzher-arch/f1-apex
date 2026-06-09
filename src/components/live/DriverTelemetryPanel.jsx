import React, { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

export const DriverTelemetryPanel = () => {
  const selectedDriverNumber = useStore(state => state.liveTiming.selectedDriverNumber);
  const carData = useStore(state => state.liveTiming.carData);
  const drivers = useStore(state => state.liveTiming.drivers);

  const driverData = useMemo(() => {
    if (!selectedDriverNumber || !carData[selectedDriverNumber]) return [];
    return carData[selectedDriverNumber];
  }, [selectedDriverNumber, carData]);

  if (!selectedDriverNumber) {
    return (
      <div className="w-full h-[300px] bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex items-center justify-center p-8 text-center shadow-lg">
        <div className="flex flex-col items-center">
          <svg className="w-10 h-10 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          <h3 className="font-heading text-lg font-bold text-white/50 tracking-widest uppercase">Select a Driver</h3>
          <p className="text-white/30 text-sm mt-2">Click on any row in the leaderboard to view live real-time telemetry</p>
        </div>
      </div>
    );
  }

  const driver = drivers[selectedDriverNumber];
  const latest = driverData[driverData.length - 1];

  return (
    <div className="w-full bg-[#050508]/80 backdrop-blur-md border border-white/[0.06] rounded-xl flex flex-col shadow-lg overflow-hidden">
      {/* Identity Strip */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-4">
           {driver?.headshot_url && (
              <img src={driver.headshot_url} alt="" className="w-12 h-12 rounded-full border-2 object-cover object-top" style={{ borderColor: `#${driver.team_colour}` }} onError={(e) => e.target.style.display = 'none'} />
           )}
           <div className="flex flex-col">
             <span className="font-heading font-black text-2xl uppercase italic tracking-wider leading-none" style={{ color: `#${driver?.team_colour}` }}>{driver?.name_acronym}</span>
             <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">{driver?.team_name}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">SPEED</span>
            <span className="font-mono text-3xl font-bold text-white leading-none">{latest?.speed || 0}<span className="text-sm text-white/50 ml-1">KM/H</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">GEAR</span>
            <span className="font-mono text-3xl font-bold text-[#FF8700] leading-none">{latest?.gear || 'N'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">DRS</span>
            <div className={`px-4 py-1.5 rounded font-bold text-sm tracking-wider ${latest?.drs === 14 ? 'bg-[#00D2BE] text-black shadow-[0_0_10px_#00D2BE] animate-pulse' : 'bg-white/10 text-white/30'}`}>
              {latest?.drs === 14 ? 'OPEN' : 'CLOSED'}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        
        {/* Speed Chart */}
        <div className="h-[200px] flex flex-col">
          <h4 className="text-[10px] text-white/50 font-bold tracking-widest mb-2">SPEED (KM/H)</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driverData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 350]} hide />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} labelStyle={{ display: 'none' }} itemStyle={{ color: '#E8002D', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="speed" stroke="#E8002D" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throttle & Brake */}
        <div className="h-[200px] flex flex-col">
          <h4 className="text-[10px] text-white/50 font-bold tracking-widest mb-2">THROTTLE (%) & BRAKE (%)</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={driverData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} labelStyle={{ display: 'none' }} />
                <Area type="step" dataKey="throttle" stroke="#00C853" fillOpacity={0.2} fill="#00C853" isAnimationActive={false} />
                <Area type="step" dataKey="brake" stroke="#E8002D" fillOpacity={0.2} fill="#E8002D" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RPM */}
        <div className="h-[200px] flex flex-col">
          <h4 className="text-[10px] text-white/50 font-bold tracking-widest mb-2">RPM</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driverData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 15000]} hide />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} labelStyle={{ display: 'none' }} itemStyle={{ color: '#00D2BE', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="rpm" stroke="#00D2BE" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
