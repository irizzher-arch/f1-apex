import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Settings, Gauge, ArrowRightLeft, Maximize2 } from 'lucide-react';

export const CircuitStatPill = ({ statId, value, subLabel, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getIcon = () => {
    switch (statId) {
      case 'gForce': return <Activity size={18} className="text-f1-red" />;
      case 'gearChanges': return <Settings size={18} className="text-f1-red" />;
      case 'topSpeed': return <Gauge size={18} className="text-f1-red" />;
      case 'overtakes': return <ArrowRightLeft size={18} className="text-f1-red" />;
      case 'trackWidth': return <Maximize2 size={18} className="text-f1-red" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white/[0.03] border border-white/[0.07] border-l-[2px] border-l-f1-red rounded-[12px] p-[16px] flex items-center gap-4"
    >
      <div className="shrink-0 p-2 bg-f1-red/10 rounded-full">
        {getIcon()}
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[16px] text-white font-bold">{value}</span>
        <span className="font-heading text-[10px] text-white/50 uppercase tracking-wide">{subLabel}</span>
      </div>
    </motion.div>
  );
};
