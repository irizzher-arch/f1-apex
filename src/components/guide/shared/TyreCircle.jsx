import React from 'react';
import { motion } from 'framer-motion';

export const TyreCircle = ({ type, size = 'md' }) => {
  let color = '#FFFFFF';
  let label = 'H';
  let subLabel = '';

  switch (type) {
    case 'C1':
    case 'C2':
    case 'Hard':
      color = '#FFFFFF';
      label = type.startsWith('C') ? type : 'H';
      break;
    case 'C3':
    case 'Medium':
      color = '#FFD700';
      label = type.startsWith('C') ? type : 'M';
      break;
    case 'C4':
    case 'C5':
    case 'Soft':
      color = '#E8002D';
      label = type.startsWith('C') ? type : 'S';
      break;
    case 'Inter':
      color = '#00C853';
      label = 'I';
      subLabel = 'INTER';
      break;
    case 'Wet':
      color = '#0080FF';
      label = 'W';
      subLabel = 'WET';
      break;
    default:
      break;
  }

  const dims = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl'
  }[size];

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`relative rounded-full flex flex-col items-center justify-center shrink-0 ${dims}`}
      style={{ backgroundColor: '#111', border: `3px solid ${color}` }}
    >
      <span className="font-mono font-bold" style={{ color }}>{label}</span>
      {subLabel && <span className="absolute bottom-1 font-mono text-[8px] tracking-tighter" style={{ color }}>{subLabel}</span>}
      <div className="absolute inset-1 rounded-full border border-black pointer-events-none" />
      <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
    </motion.div>
  );
};
