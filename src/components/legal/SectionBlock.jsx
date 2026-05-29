import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const TextWithTags = ({ text }) => {
  if (!text) return null;
  
  // Custom simple parser for <white>, <red>, <teal>, <orangeBox>
  const parts = text.split(/(<(?:white|red|teal|orangeBox)>.*?<\/(?:white|red|teal|orangeBox)>)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('<white>')) {
          return <span key={i} className="text-white font-[600]">{part.replace(/<\/?white>/g, '')}</span>;
        }
        if (part.startsWith('<red>')) {
          return <span key={i} className="text-[#E8002D] font-[500]">{part.replace(/<\/?red>/g, '')}</span>;
        }
        if (part.startsWith('<teal>')) {
          return <span key={i} className="text-[#00D2BE]">{part.replace(/<\/?teal>/g, '')}</span>;
        }
        if (part.startsWith('<orangeBox>')) {
          return (
            <div key={i} className="my-4 bg-[#FF8700]/10 border border-[#FF8700]/25 rounded-lg px-[18px] py-[14px]">
              <p className="text-[#FF8700] text-[13px] font-body leading-relaxed m-0">
                {part.replace(/<\/?orangeBox>/g, '')}
              </p>
            </div>
          );
        }
        
        // Handle markdown-style inline API badges: [ERGAST], [OPENF1]
        const textNodes = part.split(/(\[[A-Z0-9]+\])/g).map((subPart, j) => {
          if (subPart.startsWith('[') && subPart.endsWith(']')) {
             return (
               <span key={j} className="font-mono text-[10px] bg-[#00D2BE]/10 border border-[#00D2BE]/30 text-[#00D2BE] rounded-[6px] px-[8px] py-[2px] ml-2 inline-block align-middle">
                 {subPart.replace(/\[|\]/g, '')}
               </span>
             );
          }
          return subPart;
        });

        return <React.Fragment key={i}>{textNodes}</React.Fragment>;
      })}
    </>
  );
};

// Animated Number Component
const AnimatedNumber = ({ number, inView }) => {
  const [displayNum, setDisplayNum] = useState("00");

  useEffect(() => {
    if (inView) {
      // Fast number flip from 00 to actual
      let start = 0;
      const target = parseInt(number, 10);
      const interval = setInterval(() => {
        start += 1;
        setDisplayNum(String(start).padStart(2, '0'));
        if (start >= target) {
          clearInterval(interval);
          setDisplayNum(String(target).padStart(2, '0'));
        }
      }, 300 / target);
      return () => clearInterval(interval);
    } else {
      setDisplayNum("00");
    }
  }, [number, inView]);

  return <>{displayNum}.</>;
};

export const SectionBlock = ({ section, index, isHighlighted, isLast }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numStr = String(index + 1).padStart(2, '0');

  return (
    <>
      <motion.section 
        id={section.id}
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
        className="mb-12 scroll-mt-[360px]"
      >
        <div className="flex flex-col">
          {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            className="w-[3px] h-[28px] bg-f1-red rounded-[2px] origin-top"
          />
          <span className="font-mono text-[13px] text-f1-red">
            <AnimatedNumber number={numStr} inView={isInView} />
          </span>
          <h2 className="font-heading font-[700] text-[22px] uppercase text-white m-0 tracking-wide">
            {section.title}
          </h2>
        </div>
        
        {/* Divider */}
        <div className="h-[1px] w-full bg-white/5 mb-6" />

        {/* Section Body */}
        <div 
          className={`
            rounded-[12px] p-[28px] md:p-[32px] transition-colors duration-300 ease-in-out hover:border-f1-red/20
            ${isHighlighted 
              ? 'bg-[#e8002d]/5 border-l-[4px] border-l-f1-red border-y border-y-[#e8002d]/25 border-r border-r-[#e8002d]/25' 
              : 'bg-white/[0.02] border border-white/[0.055]'}
          `}
        >
          <div className="flex flex-col gap-4">
            {section.content.map((p, i) => (
              <p key={i} className="font-body text-[15px] text-white/70 leading-[1.85] m-0">
                <TextWithTags text={p} />
              </p>
            ))}

            {section.listItems && section.listItems.length > 0 && (
              <ul className="mt-2 list-none p-0 m-0">
                {section.listItems.map((li, i) => (
                  <li 
                    key={i} 
                    className={`
                      font-body text-[14px] text-white/70 leading-[2] py-3 
                      ${i !== section.listItems.length - 1 ? 'border-b border-white/[0.04]' : ''}
                    `}
                  >
                    <span className="inline-block w-[5px] h-[5px] bg-f1-red mr-[10px] align-middle mb-[2px]" />
                    <TextWithTags text={li} />
                  </li>
                ))}
              </ul>
            )}
            
            {section.customChildren}
          </div>
        </div>
        </div>
      </motion.section>

      {!isLast && (
        <div className="w-full flex items-center mb-12 opacity-80">
          <div className="h-[1px] bg-white/[0.06] w-[60%]" />
          <div className="w-[2px] h-[16px] bg-f1-red -rotate-12 opacity-60 ml-1" />
        </div>
      )}
    </>
  );
};
