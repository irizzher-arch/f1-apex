import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

const quickLinks = [
  { label: 'HOME', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/' },
  { label: 'SCHEDULE', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/schedule' },
  { label: 'LIVE TIMING', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', path: '/live-timing' },
  { label: 'STANDINGS', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', path: '/standings' }, // approximate trophy icon
  { label: 'HEAD TO HEAD', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', path: '/head-to-head' },
  { label: 'RACE PACE', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', path: '/race-pace' },
  { label: 'PIT STOPS', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', path: '/pit-stops' },
  { label: 'CIRCUITS', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', path: '/circuits' },
  { label: 'F1 GUIDE', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', path: '/learn' }
];

export const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`apex.com${location.pathname}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    document.title = '404 — Page Not Found | APEX F1 Dashboard';
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex';
    document.head.appendChild(metaRobots);
    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden" aria-label="404 page not found">
      
      {/* Z-INDEX 0: GIF BACKGROUND */}
      <div className="fixed top-0 left-0 w-full h-full z-0 bg-[#000000]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/source/b96647242892307.6976b29c3b7ca.gif"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
          loading="eager"
          fetchpriority="high"
          decoding="async"
          aria-hidden="true"
          alt=""
        />
      </div>

      {/* Z-INDEX 1: DARK OVERLAY GRADIENTS */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, #000000 0%, transparent 40%),
            radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.75) 100%),
            rgba(0,0,0,0.60)
          `
        }}
      />

      {/* Z-INDEX 2: NAVBAR */}
      <div className="absolute top-0 left-0 w-full z-[2] pointer-events-auto" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
        <Navbar />
      </div>

      {/* Z-INDEX 2: CORNER WATERMARK */}
      <div className="fixed bottom-[-40px] right-[-20px] z-[2] pointer-events-none select-none hidden md:block" aria-hidden="true">
        <span className="font-heading font-black text-[180px] leading-none" style={{ color: 'rgba(232,0,45,0.04)' }}>404</span>
      </div>

      {/* Z-INDEX 10: CONTENT WRAPPER */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 px-6">
        
        {/* MAIN 404 DISPLAY */}
        <div className="relative flex items-center justify-center pt-24 md:pt-32">
          {/* Ghost Layer */}
          <motion.div 
            initial={{ opacity: 0, y: -26 }}
            animate={{ opacity: 1, y: 4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="absolute z-[1] font-heading font-black leading-none"
            style={{ 
              fontSize: 'clamp(140px, 22vw, 240px)', 
              color: 'rgba(232,0,45,0.07)', 
              transform: 'translateX(4px)', 
              filter: 'blur(2px)',
              letterSpacing: '-0.04em'
            }}
          >
            404
          </motion.div>
          {/* Main Layer */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative z-[2] font-heading font-black leading-none"
            style={{
              fontSize: 'clamp(140px, 22vw, 240px)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.15) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.04em',
              textShadow: 'none'
            }}
          >
            404
          </motion.div>
        </div>

        {/* DIAGONAL SLASH DIVIDER - modified to straight line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
          className="flex items-center w-full max-w-[480px] my-6"
        >
          <div className="flex-1 h-[1px] bg-white/10" />
        </motion.div>

        {/* ERROR MESSAGE COPY */}
        <div className="flex flex-col items-center text-center max-w-[500px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.5 }}
            className="font-heading text-[13px] uppercase font-semibold text-[#E8002D] mb-2"
            style={{ letterSpacing: '0.25em' }}
          >
            PAGE NOT FOUND
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="font-heading font-extrabold uppercase leading-tight mb-3"
            style={{ fontSize: 'clamp(24px, 4vw, 36px)', textWrap: 'balance' }}
          >
            <span className="text-white">RETIRED FROM THE </span>
            <span className="text-[#E8002D]">RACE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
            className="font-sans text-[15px] text-white/55 leading-relaxed mt-2"
          >
            The page you're looking for has gone off-track. It may have been moved, deleted, or never existed.
          </motion.p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto px-6 sm:px-0">
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
            onClick={() => navigate('/')}
            autoFocus
            className="w-full sm:w-auto bg-[#E8002D] text-white rounded-lg px-7 py-3 font-heading text-[13px] uppercase font-bold tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(232,0,45,0.5)] hover:scale-105"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK TO HOME
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.93 }}
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-transparent border border-white/20 text-white/75 rounded-lg px-7 py-3 font-heading text-[13px] uppercase font-bold tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-200 hover:border-white/50 hover:text-white hover:bg-white/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            GO BACK
          </motion.button>
        </div>

        {/* QUICK NAVIGATION LINKS */}
        <div className="mt-12 flex flex-col items-center w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="font-mono text-[10px] uppercase text-white/30 tracking-[0.2em] mb-3 text-center"
          >
            OR HEAD TO
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-[600px]">
            {quickLinks.map((link, idx) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 + (idx * 0.03) }}
              >
                <Link
                  to={link.path}
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 font-sans text-[12px] uppercase text-white/60 tracking-[0.08em] transition-all duration-150 hover:bg-white/10 hover:border-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#E8002D]/50"
                >
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* URL DISPLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 1.1 }}
          className="mt-8 relative"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2 max-w-[90vw]">
            <svg className="w-3 h-3 text-[#E8002D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            <div className="font-mono text-[12px] truncate">
              <span className="text-white/30">apex.com/</span>
              <span className="text-white/60">{location.pathname.replace(/^\/+/, '')}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="ml-2 w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors relative group"
              aria-label="Copy URL"
            >
              <svg className="w-3 h-3 text-white/50 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              {copied && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#E8002D] text-white text-[9px] font-bold tracking-wider px-2 py-1 rounded">
                  COPIED
                </div>
              )}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
