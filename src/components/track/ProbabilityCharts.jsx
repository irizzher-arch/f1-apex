import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';
import { TEAM_COLORS } from '@/utils/constants';

export const ProbabilityCharts = () => {
  // Mock data for probabilities since we aren't running an ML model in the browser
  const constructorProb = [
    { name: 'Red Bull', prob: 38.5, color: TEAM_COLORS['red bull'] || '#3671C6' },
    { name: 'McLaren', prob: 28.2, color: TEAM_COLORS['mclaren'] || '#FF8000' },
    { name: 'Ferrari', prob: 18.0, color: TEAM_COLORS['ferrari'] || '#F91536' },
    { name: 'Mercedes', prob: 10.5, color: TEAM_COLORS['mercedes'] || '#6CD3BF' },
    { name: 'Aston Martin', prob: 4.8, color: TEAM_COLORS['aston martin'] || '#358C75' }
  ];

  const strategyProb = [
    { name: '1-STOP', value: 45, color: '#E8002D' },
    { name: '2-STOP', value: 35, color: '#00D2BE' },
    { name: '3-STOP', value: 5, color: '#FF8700' },
    { name: 'SC STOP', value: 15, color: 'rgba(255,255,255,0.3)' }
  ];

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 p-0 m-0 mt-4 list-none">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-white/80 font-body text-[12px]">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 mt-8">
      
      {/* Left: Constructor Win Probability */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col h-[320px]">
        <h3 className="font-heading text-[16px] uppercase text-white tracking-widest mb-4">
          Constructor Win Probability
        </h3>
        
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={constructorProb}
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} 
                width={90}
              />
              <Bar dataKey="prob" radius={[0, 4, 4, 0]} animationDuration={1000} animationEasing="ease-out">
                {constructorProb.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Custom Labels on bars */}
          <div className="absolute top-0 right-[20px] h-full flex flex-col justify-around py-[14px] pointer-events-none">
            {constructorProb.map((team, i) => (
              <span key={i} className="font-mono text-[11px] text-white/70">
                {team.prob}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Strategy Outcome Probability */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-[14px] p-6 flex flex-col h-[320px]">
        <h3 className="font-heading text-[16px] uppercase text-white tracking-widest mb-0">
          Strategy Outcome
        </h3>
        
        <div className="flex-1 w-full relative -mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={strategyProb}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {strategyProb.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend content={renderCustomLegend} verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="font-mono text-[12px] text-white font-bold leading-tight flex flex-col">
              <span>OPTIMAL</span>
              <span>STRATEGY</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
