import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import pitStopVideos from '@/data/pitStopVideos.json';

export const VideoPopupModal = () => {
  const { pitStops, setPitStopsState } = useStore();
  const { activeVideo } = pitStops;

  const videoData = activeVideo ? pitStopVideos[activeVideo] : null;

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPitStopsState({ activeVideo: null });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPitStopsState]);

  return (
    <AnimatePresence>
      {activeVideo && videoData && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setPitStopsState({ activeVideo: null })}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[860px] bg-[#111118] border-2 border-[#E8002D]/40 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Top color bar */}
            <div className="w-full h-1 bg-[#E8002D]" />

            {/* Header */}
            <div className="p-6 flex justify-between items-start border-b border-white/10">
              <div className="flex flex-col">
                <h2 className="font-heading font-bold text-2xl text-white">PIT STOP REPLAY</h2>
                <span className="font-mono text-xs text-white/50 mt-1">Key: {activeVideo}</span>
              </div>
              
              <button 
                onClick={() => setPitStopsState({ activeVideo: null })}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video Area (16:9) */}
            <div className="w-full relative pt-[56.25%] bg-black">
              {videoData.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoData.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="autoplay; fullscreen"
                  title="Pit Stop Video"
                />
              ) : videoData.videoUrl ? (
                <video 
                  src={videoData.videoUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain"
                  poster="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMTEiLz48L3N2Zz4="
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
                  <span className="font-mono text-white/30 text-sm">VIDEO UNAVAILABLE</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] flex items-center justify-between">
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] font-bold text-white uppercase">LAP DATA</span>
              </div>
              {videoData.videoUrl && (
                <a 
                  href={videoData.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-white/50 hover:text-[#E8002D] transition-colors"
                >
                  WATCH ON F1.COM →
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
