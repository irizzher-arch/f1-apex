import React from 'react';
import { motion, useInView } from 'framer-motion';

export const SpeedComparison = ({ seriesSpeed }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!seriesSpeed) return null;

  const seriesData = [
    { name: 'F1', data: seriesSpeed.f1, width: '100%', color: '#E8002D' },
    { name: 'F2', data: seriesSpeed.f2, width: '85%', color: 'rgba(255,255,255,0.4)' },
    { name: 'F3', data: seriesSpeed.f3, width: '70%', color: 'rgba(255,255,255,0.2)' }
  ];

  return (
    <div ref={ref} className="w-full mt-8">
      <span className="font-heading text-[10px] uppercase text-white/40 tracking-widest block mb-4">
        Series Speed Comparison
      </span>
      
      <div className="flex flex-col gap-[6px]">
        {seriesData.map((series, i) => (
          <div key={series.name} className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-white w-[40px] shrink-0">
              {series.name}
            </span>
            <div className="flex-1 bg-white/[0.05] h-[10px] rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={isInView ? { width: series.width } : { width: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: i * 0.12 }}
                className="h-full rounded-full absolute left-0 top-0"
                style={{ backgroundColor: series.color }}
              />
            </div>
            <span className="font-mono text-[11px] text-white/60 shrink-0 w-[140px] text-right">
              ({series.data.time} · {series.data.speed} KPH)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
