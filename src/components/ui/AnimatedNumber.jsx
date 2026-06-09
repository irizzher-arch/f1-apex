import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export const AnimatedNumber = ({ number, duration = 1000 }) => {
  const [displayNum, setDisplayNum] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const target = Number(number) || 0;
      if (target === 0) return;
      
      let startTime;
      let animationFrame;

      const update = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setDisplayNum(Math.floor(easeOut * target));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(update);
        } else {
          setDisplayNum(target);
        }
      };

      animationFrame = requestAnimationFrame(update);

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }
  }, [number, inView, duration]);

  return <span ref={ref}>{displayNum}</span>;
};
