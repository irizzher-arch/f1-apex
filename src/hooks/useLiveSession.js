import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

const OPENF1_BASE = 'https://api.openf1.org/v1';
const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';

export const useLiveSession = () => {
  const setLiveSession = useStore(state => state.setLiveSession);
  const setLiveTotalLaps = useStore(state => state.setLiveTotalLaps);
  const sessionMode = useStore(state => state.liveTiming.sessionMode);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const detectSession = async () => {
      // If the user explicitly launched a chronological replay, stop overriding them.
      if (useStore.getState().liveTiming.sessionMode === 'playback') {
        setIsLoading(false);
        return;
      }

      try {
        const year = new Date().getFullYear();
        const res = await fetch(`${OPENF1_BASE}/sessions?year=${year}`);
        const sessions = await res.json();
        
        const now = new Date();
        let activeSession = null;
        let mode = 'waiting';

        // 1. Check for LIVE session
        activeSession = sessions.find(s => {
          const start = new Date(s.date_start);
          const end = new Date(s.date_end);
          // Add a 30 min buffer to date_end just in case of delays
          end.setMinutes(end.getMinutes() + 30);
          return now >= start && now <= end;
        });

        if (activeSession) {
          mode = 'live';
        } else {
          // 2. Check for REPLAY (ended < 2 hours ago)
          activeSession = sessions.find(s => {
            const end = new Date(s.date_end);
            const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            return now > end && end > twoHoursAgo;
          });
          
          if (activeSession) {
            mode = 'replay';
          }
        }

        // 3. Fallback to WAITING
        if (!activeSession) {
          // Find next upcoming session
          const upcoming = sessions
            .filter(s => new Date(s.date_start) > now)
            .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
          
          activeSession = upcoming[0] || null;
          mode = 'waiting';
        }

        if (activeSession) {
          setLiveSession(activeSession.session_key, mode, activeSession);
          
          // Try to fetch total laps from Ergast if it's a Race
          if (activeSession.session_name === 'Race') {
            fetch(`${ERGAST_BASE}/current/next.json`)
              .then(r => r.json())
              .then(data => {
                // We can't directly get total laps from OpenF1 easily, Ergast might not have it either for next race.
                // But typically F1 races are around 50-70 laps. Let's just set it to 0 and derive max lap from /laps.
              }).catch(() => null);
          }
        } else {
          setLiveSession(null, 'waiting', null);
        }

      } catch (err) {
        console.error('Failed to detect session', err);
      } finally {
        setIsLoading(false);
      }
    };

    detectSession();
    
    // Recheck session status every 60 seconds
    intervalId = setInterval(detectSession, 60000);

    return () => clearInterval(intervalId);
  }, [setLiveSession]);

  return { isLoading };
};
