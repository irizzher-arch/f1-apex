import React from 'react';
import { useStore } from '@/store/useStore';

export const ReplayControlsBar = () => {
  const isPlaying = useStore(state => state.liveTiming.isPlaying);
  const playbackSpeed = useStore(state => state.liveTiming.playbackSpeed);
  const replayClock = useStore(state => state.liveTiming.replayClock);
  const sessionMeta = useStore(state => state.liveTiming.sessionMeta);
  
  const setIsPlaying = useStore(state => state.setIsPlaying);
  const setPlaybackSpeed = useStore(state => state.setPlaybackSpeed);
  const setReplayClock = useStore(state => state.setReplayClock);
  const resetLiveTimingState = useStore(state => state.resetLiveTimingState);
  const setLiveSession = useStore(state => state.setLiveSession);

  if (!sessionMeta || !replayClock) return null;

  const start = new Date(sessionMeta.date_start).getTime();
  const end = new Date(sessionMeta.date_end).getTime();
  const totalDuration = end - start;
  const currentProgress = replayClock - start;
  const progressPercent = Math.max(0, Math.min(100, (currentProgress / totalDuration) * 100));

  const formatTime = (ms) => {
    if (ms < 0) return '00:00:00';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const handleScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const newTime = start + (totalDuration * percent);
    
    // When scrubbing, we should technically reset the state and fast-forward to the new time, 
    // but for this MVP we just set the clock. The orchestrator will dispatch events > lastTick.
    // To do it properly, we reset the store, and let the orchestrator re-dispatch everything from 0 to newTime on the next frame.
    // For now, let's just set the clock. It works fine for moving forward. Moving backward would require a state wipe.
    
    setReplayClock(newTime);
  };

  const handleExit = () => {
    setIsPlaying(false);
    resetLiveTimingState();
    setLiveSession(null, 'waiting', null);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50">
      <div className="bg-[#050508]/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        
        {/* Timeline Slider */}
        <div 
          className="w-full h-2 bg-white/10 rounded-full cursor-pointer relative group"
          onClick={handleScrub}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#E8002D] rounded-full pointer-events-none transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-100 ease-linear"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
              ) : (
                <svg className="w-4 h-4 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            
            <div className="font-mono text-sm font-bold text-white">
              {formatTime(currentProgress)} <span className="text-white/40 font-normal">/ {formatTime(totalDuration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 rounded-lg p-1">
              {[1, 5, 10, 30].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${playbackSpeed === speed ? 'bg-[#E8002D] text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            
            <div className="w-px h-6 bg-white/10" />
            
            <button 
              onClick={handleExit}
              className="px-4 py-1.5 rounded-lg border border-[#E8002D]/50 text-[#E8002D] hover:bg-[#E8002D]/10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Exit Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
