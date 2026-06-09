import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const QuizCard = ({ title = "TEST YOUR KNOWLEDGE", question, options, correctAnswer, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSelect = (idx) => {
    if (isRevealed) return;
    setSelected(idx);
    setIsRevealed(true);
  };

  const isCorrect = selected === correctAnswer;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 transition-colors duration-300 ${
        isRevealed ? (isCorrect ? 'border-[#00C853]/50 bg-[#00C853]/5' : 'border-[#E8002D]/50 bg-[#E8002D]/5') : ''
      }`}
    >
      <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-3">
        {title}
      </div>
      
      <h4 className="font-inter text-[15px] text-white mb-6 font-medium">
        {question}
      </h4>

      <div className="flex flex-wrap gap-3">
        {options.map((opt, idx) => {
          let btnClass = "bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white";
          
          if (isRevealed) {
            if (idx === correctAnswer) {
              btnClass = "bg-[#00C853] border-[#00C853] text-black font-bold shadow-[0_0_15px_rgba(0,200,83,0.3)]";
            } else if (idx === selected) {
              btnClass = "bg-[#E8002D] border-[#E8002D] text-white font-bold opacity-50";
            } else {
              btnClass = "bg-white/5 border-white/10 text-white/30 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isRevealed}
              className={`px-5 py-2.5 rounded-full font-mono text-sm transition-all ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isRevealed && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg text-sm font-inter flex gap-3 items-start ${
            isCorrect ? 'bg-[#00C853]/10 text-[#00C853]' : 'bg-[#E8002D]/10 text-[#E8002D]'
          }`}
        >
          <span className="font-bold shrink-0 mt-0.5">{isCorrect ? '✓ CORRECT!' : '✗ INCORRECT!'}</span>
          <span className="text-white/80">{explanation}</span>
        </motion.div>
      )}
    </motion.div>
  );
};
