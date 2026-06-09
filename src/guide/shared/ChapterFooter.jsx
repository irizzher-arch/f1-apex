import React from 'react';
import { motion } from 'framer-motion';

export const ChapterFooter = ({ keyTakeaway, nextChapterId, nextChapterTitle, onNext }) => {
  return (
    <div className="mt-16 pt-10 border-t border-white/10 flex flex-col gap-10">
      
      {/* KEY TAKEAWAY STRIP */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-[#00D2BE]/5 border-y border-r border-white/5 rounded-r-xl p-6 relative overflow-hidden"
        style={{ borderLeft: '3px solid #00D2BE' }}
      >
        <div className="font-mono text-[10px] text-[#00D2BE] tracking-widest uppercase mb-2">
          KEY TAKEAWAY
        </div>
        <p className="font-inter text-[15px] text-white/90 leading-relaxed m-0 font-medium">
          {keyTakeaway}
        </p>
      </motion.div>

      {/* NEXT CHAPTER BUTTON */}
      {nextChapterId && (
        <div className="w-full flex justify-end">
          <button 
            onClick={() => {
              const el = document.getElementById(nextChapterId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              if (onNext) onNext();
            }}
            className="group flex flex-col items-end gap-1"
          >
            <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase group-hover:text-f1-red transition-colors">
              NEXT CHAPTER →
            </span>
            <span className="font-heading text-xl font-bold text-white group-hover:underline underline-offset-4 decoration-f1-red decoration-2">
              {nextChapterTitle}
            </span>
          </button>
        </div>
      )}
      
    </div>
  );
};
