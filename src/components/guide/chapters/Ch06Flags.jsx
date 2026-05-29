import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterWrapper } from '../ChapterWrapper';
import { ChapterFooter } from '../shared/ChapterFooter';

const FlagVisual = ({ type }) => {
  // CSS rendering of different flags
  switch(type) {
    case 'chequered':
      return (
        <div className="w-16 h-12 bg-white flex flex-wrap shadow-inner overflow-hidden border border-white/20">
          {[...Array(24)].map((_, i) => (
            <div key={i} className={`w-4 h-4 ${((i % 4) + Math.floor(i / 4)) % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>
      );
    case 'red':
      return <div className="w-16 h-12 bg-[#E8002D] animate-pulse border border-white/10" />;
    case 'yellow':
      return <div className="w-16 h-12 bg-[#FFD700] border border-white/10" style={{ animation: 'wave 2s infinite ease-in-out' }} />;
    case 'blue':
      return <div className="w-16 h-12 bg-[#0080FF] border border-white/10" />;
    case 'green':
      return <div className="w-16 h-12 bg-[#00C853] border border-white/10" />;
    case 'black-white':
      return (
        <div className="w-16 h-12 relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-black" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
        </div>
      );
    case 'black':
      return <div className="w-16 h-12 bg-black border border-white/30" />;
    case 'meatball':
      return (
        <div className="w-16 h-12 bg-black border border-white/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#FF8700]" />
        </div>
      );
    case 'red-yellow':
      return (
        <div className="w-16 h-12 flex flex-col border border-white/10 opacity-90">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#E8002D]' : 'bg-[#FFD700]'}`} />
          ))}
        </div>
      );
    case 'yellow-black':
      return (
        <div className="w-16 h-12 flex border border-white/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#FFD700]' : 'bg-black'}`} style={{ transform: 'skewX(-20deg)', margin: '0 -2px' }} />
          ))}
        </div>
      );
    case 'white':
      return <div className="w-16 h-12 bg-white border border-white/30" />;
    default:
      return <div className="w-16 h-12 bg-gray-500" />;
  }
};

export const Ch06Flags = () => {
  const flags = [
    { type: 'chequered', name: 'CHEQUERED FLAG', color: '#FFFFFF', desc: 'Race/session over. The moment every driver is racing for.' },
    { type: 'red', name: 'RED FLAG', color: '#E8002D', desc: 'Session stopped immediately. Serious incident or dangerous conditions. Return to pits.' },
    { type: 'yellow', name: 'YELLOW FLAG', color: '#FFD700', desc: 'Danger ahead. Drivers must slow down, no overtaking. Double yellow = be prepared to stop.' },
    { type: 'blue', name: 'BLUE FLAG', color: '#0080FF', desc: 'A faster car is about to lap you. You must let them pass within 3 blue flags.' },
    { type: 'green', name: 'GREEN FLAG', color: '#00C853', desc: 'Track is clear. Incident resolved. Normal racing resumes.' },
    { type: 'black-white', name: 'BLACK & WHITE', color: '#AAAAAA', desc: 'Official warning to a specific driver for unsportsmanlike behaviour.' },
    { type: 'black', name: 'BLACK FLAG', color: '#555555', badge: 'RARE', desc: 'Disqualification. The driver must immediately retire from the race.' },
    { type: 'meatball', name: 'BLACK & ORANGE', color: '#FF8700', desc: 'Mechanical problem that could be dangerous. Return to pits immediately.' },
    { type: 'red-yellow', name: 'RED & YELLOW', color: '#FF8700', desc: 'Slippery surface ahead — oil, water, or debris on track. Exercise caution.' },
    { type: 'white', name: 'WHITE FLAG', color: '#DDDDDD', desc: 'Slow-moving vehicle on track, such as a recovery vehicle or medical car.' }
  ];

  // Quiz State
  const quizFlags = ['chequered', 'red', 'yellow', 'blue', 'green', 'black-white', 'black', 'meatball', 'red-yellow', 'white'];
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState(null); // {correct: boolean, text: string}
  const [options, setOptions] = useState([]);

  const currentFlagType = quizFlags[quizIdx];
  const currentFlagObj = flags.find(f => f.type === currentFlagType);

  useEffect(() => {
    if (!quizFinished && currentFlagObj) {
      // Generate options
      const incorrectOptions = flags.filter(f => f.type !== currentFlagType).sort(() => 0.5 - Math.random()).slice(0, 2);
      const newOptions = [currentFlagObj, ...incorrectOptions].sort(() => 0.5 - Math.random());
      setOptions(newOptions);
      setFeedback(null);
    }
  }, [quizIdx, quizFinished, currentFlagObj]);

  const handleQuizGuess = (selectedName) => {
    if (feedback) return; // Prevent double clicking
    const isCorrect = selectedName === currentFlagObj.name;
    if (isCorrect) setScore(s => s + 1);
    
    setFeedback({
      correct: isCorrect,
      text: isCorrect ? 'Correct!' : `Wrong! It was ${currentFlagObj.name}`
    });

    setTimeout(() => {
      if (quizIdx + 1 < 5) { // 5 questions max
        setQuizIdx(i => i + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setScore(0);
    setQuizIdx(0);
    setQuizFinished(false);
    setFeedback(null);
  };

  return (
    <ChapterWrapper
      id="ch06"
      num="06"
      title="FLAGS & SIGNALS"
      hook="Every flag colour is a message — learn to read them before race day."
    >
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0) skewY(0deg); }
          25% { transform: translateY(-2px) skewY(2deg); }
          75% { transform: translateY(2px) skewY(-2deg); }
        }
      `}</style>

      {/* BLOCK A — THE FLAG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flags.map((flag, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/[0.03] border border-white/[0.07] rounded-lg p-5 flex flex-col hover:bg-white/[0.05] transition-colors relative overflow-hidden"
            style={{ borderLeft: `3px solid ${flag.color}` }}
          >
            {flag.badge && (
              <div className="absolute top-0 right-0 bg-white/10 px-2 py-1 text-[10px] font-mono font-bold text-white/50 rounded-bl-md">
                {flag.badge}
              </div>
            )}
            <div className="mb-4">
              <FlagVisual type={flag.type} />
            </div>
            <h4 className="font-heading text-lg font-bold text-white tracking-widest uppercase mb-1">{flag.name}</h4>
            <p className="font-inter text-[13px] text-white/65 leading-relaxed">{flag.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* BLOCK B — INTERACTIVE FLAG QUIZ */}
      <div className="mt-8 bg-[#050508] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl max-w-2xl mx-auto w-full">
        <h3 className="font-heading text-2xl font-black text-white uppercase tracking-widest mb-1 text-center">Can You Read The Flags?</h3>
        <p className="font-inter text-sm text-white/50 mb-8 text-center">Test your knowledge before race day.</p>

        {!quizFinished ? (
          <div className="flex flex-col items-center">
            <div className="mb-8 scale-[1.5]">
              <FlagVisual type={currentFlagType} />
            </div>
            
            <div className="flex flex-col gap-3 w-full max-w-sm">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizGuess(opt.name)}
                  disabled={!!feedback}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-sm tracking-widest uppercase transition-all ${
                    feedback 
                      ? (opt.name === currentFlagObj.name ? 'bg-[#00C853] text-black font-bold' : 'bg-white/5 text-white/30')
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 font-bold font-mono tracking-widest ${feedback.correct ? 'text-[#00C853]' : 'text-[#E8002D]'}`}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-[10px] font-mono text-white/30">QUESTION {quizIdx + 1} / 5</div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="text-6xl mb-4">{score === 5 ? '🏆' : (score >= 3 ? '👍' : '📚')}</div>
            <h4 className="font-heading text-3xl font-black text-white uppercase mb-2">
              {score} / 5 CORRECT
            </h4>
            <p className="font-inter text-white/60 mb-8">
              {score === 5 ? 'MARSHAL MATERIAL 🏁 Perfect score!' : 'Good effort! Keep studying those flags.'}
            </p>
            <button 
              onClick={restartQuiz}
              className="bg-f1-red text-white hover:bg-f1-red/80 px-8 py-3 rounded-full font-bold font-mono text-sm tracking-widest uppercase transition-colors"
            >
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </div>

      <ChapterFooter 
        keyTakeaway="Blue means get out of the way, yellow means slow down, red means stop. Memorize these three and you'll understand 90% of race control messages."
        nextChapterId="ch07"
        nextChapterTitle="SAFETY CAR & VSC"
      />
    </ChapterWrapper>
  );
};
