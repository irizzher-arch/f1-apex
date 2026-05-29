import React from 'react';
import { motion } from 'framer-motion';

export const ChapterWrapper = ({ id, num, title, hook, children }) => {
  // Extract the last word for the split-color title effect
  const words = title.split(' ');
  const lastWord = words.pop();
  const restOfTitle = words.join(' ');

  return (
    <section id={id} className="chapter-section w-full scroll-mt-[60px] lg:scroll-mt-[40px]">
      
      {/* CHAPTER HEADER */}
      <motion.div 
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="inline-block bg-f1-red/10 border border-f1-red/30 rounded-md px-2 py-1 mb-3">
          <span className="font-mono text-[11px] text-f1-red font-bold">{num}</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-heading font-black uppercase text-white tracking-widest leading-none mb-3">
          {restOfTitle} <span className="text-f1-red">{lastWord}</span>
        </h2>
        
        <p className="font-inter text-[15px] text-white/55 italic max-w-2xl">
          "{hook}"
        </p>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-white/5 mt-6 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-f1-red transform -skew-x-[25deg]" />
        </div>
      </motion.div>

      {/* CHAPTER BODY */}
      <div className="flex flex-col gap-8 w-full">
        {children}
      </div>

    </section>
  );
};
