import React from 'react';
import { motion } from 'framer-motion';

export const ConceptCard = ({ title, content, icon, borderColor = '#00D2BE', bgTint, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/[0.03] border-y border-r border-white/[0.07] rounded-xl overflow-hidden relative p-6 flex flex-col gap-4"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {bgTint && (
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: borderColor }} />
      )}
      
      {(title || icon) && (
        <div className="flex items-center gap-3 relative z-10">
          {icon && (
            <div className="text-white/80 w-6 h-6 flex items-center justify-center">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="font-heading text-lg font-bold uppercase text-white tracking-wider m-0">
              {title}
            </h3>
          )}
        </div>
      )}

      {content && (
        <p className="font-inter text-sm text-white/70 leading-relaxed relative z-10 m-0">
          {content}
        </p>
      )}

      {children && (
        <div className="relative z-10 mt-2">
          {children}
        </div>
      )}
    </motion.div>
  );
};
