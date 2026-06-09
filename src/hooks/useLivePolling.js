import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export const useLivePolling = (endpoint, intervalMs, onData, sessionKey, extraParams = '', appendOnly = false) => {
  const sessionMode = useStore(state => state.liveTiming.sessionMode);
  const displayDelay = useStore(state => state.liveTiming.displayDelay);
  const lastFetched = useRef(null);

  useEffect(() => {
    if (!sessionKey) return;
    // Don't poll in waiting or replay mode
    if (sessionMode !== 'live') return;

    let intervalId;
    let isMounted = true;

    const fetchData = async () => {
      try {
        let url = `https://api.openf1.org/v1/${endpoint}?session_key=${sessionKey}${extraParams}`;
        
        // If appendOnly is true, we only fetch records newer than our last fetch
        if (appendOnly && lastFetched.current) {
          // OpenF1 uses standard ISO strings for date
          url += `&date>${lastFetched.current}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        if (isMounted && data && data.length > 0) {
          // Update lastFetched to the maximum date in the returned data
          if (appendOnly) {
            const maxDateStr = data.reduce((max, curr) => {
              if (!curr.date) return max;
              return new Date(curr.date) > new Date(max) ? curr.date : max;
            }, data[0].date);
            
            if (maxDateStr) {
              lastFetched.current = maxDateStr;
            }
          }

          // Handle display delay queue
          if (displayDelay > 0) {
            setTimeout(() => {
              if (isMounted) onData(data);
            }, displayDelay * 1000);
          } else {
            onData(data);
          }
        }
      } catch (err) {
        console.error(`Live polling failed for ${endpoint}:`, err);
      }
    };

    // Initial fetch immediately
    fetchData();
    
    // Setup interval
    intervalId = setInterval(fetchData, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [endpoint, intervalMs, sessionKey, extraParams, appendOnly, sessionMode, displayDelay, onData]);
};
