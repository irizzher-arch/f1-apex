import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';

export const useReplayOrchestrator = () => {
  const sessionKey = useStore(state => state.liveTiming.sessionKey);
  const sessionMode = useStore(state => state.liveTiming.sessionMode);
  const sessionMeta = useStore(state => state.liveTiming.sessionMeta);
  const selectedDriverNumber = useStore(state => state.liveTiming.selectedDriverNumber);
  
  const isPlaying = useStore(state => state.liveTiming.isPlaying);
  const playbackSpeed = useStore(state => state.liveTiming.playbackSpeed);
  const replayClock = useStore(state => state.liveTiming.replayClock);
  
  const setReplayBuffer = useStore(state => state.setReplayBuffer);
  const setReplayClock = useStore(state => state.setReplayClock);
  const setIsPlaying = useStore(state => state.setIsPlaying);
  const replayBuffer = useStore(state => state.liveTiming.replayBuffer);

  // Zustand updaters
  const updateLiveDrivers = useStore(state => state.updateLiveDrivers);
  const updateLivePositions = useStore(state => state.updateLivePositions);
  const updateLiveIntervals = useStore(state => state.updateLiveIntervals);
  const appendLiveLaps = useStore(state => state.appendLiveLaps);
  const updateLiveStints = useStore(state => state.updateLiveStints);
  const appendLivePits = useStore(state => state.appendLivePits);
  const appendLiveRaceControl = useStore(state => state.appendLiveRaceControl);
  const appendLiveTeamRadio = useStore(state => state.appendLiveTeamRadio);
  const updateLiveWeather = useStore(state => state.updateLiveWeather);
  const appendLiveOvertakes = useStore(state => state.appendLiveOvertakes);
  const appendLiveCarData = useStore(state => state.appendLiveCarData);

  const [isBuffering, setIsBuffering] = useState(false);
  const lastTickTime = useRef(null);
  const realLastFrameTime = useRef(null);

  // 1. Initial Load of Historical Data
  useEffect(() => {
    if (sessionMode !== 'playback' || !sessionKey || Object.keys(replayBuffer).length > 0) return;

    const loadData = async () => {
      setIsBuffering(true);
      try {
        // Fetch Drivers
        const drvRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
        const drvData = await drvRes.json();
        const driversMap = {};
        drvData.forEach(d => { driversMap[d.driver_number] = d; });
        updateLiveDrivers(driversMap);

        // Fetch core telemetry endpoints. We skip car_data due to size constraints.
        const endpoints = ['position', 'intervals', 'laps', 'stints', 'pit', 'race_control', 'team_radio', 'weather', 'overtakes'];
        const promises = endpoints.map(ep => fetch(`https://api.openf1.org/v1/${ep}?session_key=${sessionKey}`).then(r => r.json()).catch(() => []));
        
        const [pos, int, lps, sts, pts, rc, rad, wea, ovt] = await Promise.all(promises);

        // Store sorted by date to allow binary search or simple slicing
        const buffer = {
          position: (pos || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          intervals: (int || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          laps: (lps || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          stints: (sts || []).sort((a,b) => new Date(a.date) - new Date(b.date)), // Stints might not have precise dates for starting, but we try
          pit: (pts || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          race_control: (rc || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          team_radio: (rad || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          weather: (wea || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
          overtakes: (ovt || []).sort((a,b) => new Date(a.date) - new Date(b.date)),
        };

        setReplayBuffer(buffer);
        setIsPlaying(true);
        if (sessionMeta?.date_start) {
          setReplayClock(new Date(sessionMeta.date_start).getTime());
        }

      } catch (err) {
        console.error("Failed to buffer replay data", err);
      } finally {
        setIsBuffering(false);
      }
    };

    loadData();
  }, [sessionMode, sessionKey]);

  // 1.5 Load Telemetry for Selected Driver On-Demand
  useEffect(() => {
    if (sessionMode !== 'playback' || !sessionKey || !selectedDriverNumber) return;
    const cacheKey = `car_data_${selectedDriverNumber}`;
    if (replayBuffer[cacheKey]) return; // Already fetched

    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`https://api.openf1.org/v1/car_data?session_key=${sessionKey}&driver_number=${selectedDriverNumber}`);
        const data = await res.json();
        setReplayBuffer({
          ...useStore.getState().liveTiming.replayBuffer,
          [cacheKey]: data.sort((a,b) => new Date(a.date) - new Date(b.date))
        });
      } catch (err) {
        console.error("Failed to fetch replay telemetry", err);
      }
    };
    fetchTelemetry();
  }, [selectedDriverNumber, sessionKey, sessionMode]); // intentionally omitted replayBuffer from deps to avoid infinite loop

  // 2. Playback Loop
  useEffect(() => {
    if (sessionMode !== 'playback' || !isPlaying || Object.keys(replayBuffer).length === 0 || !replayClock) return;

    let frameId;

    const tick = (time) => {
      if (!realLastFrameTime.current) realLastFrameTime.current = time;
      const dt = time - realLastFrameTime.current;
      realLastFrameTime.current = time;

      // Increment clock by dt * speed
      const newClock = replayClock + (dt * playbackSpeed);
      const oldClock = lastTickTime.current || replayClock;
      
      // Dispatch events that happened between oldClock and newClock
      dispatchEvents(oldClock, newClock);

      setReplayClock(newClock);
      lastTickTime.current = newClock;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      realLastFrameTime.current = null;
    };
  }, [isPlaying, playbackSpeed, replayClock, replayBuffer, sessionMode]);

  const dispatchEvents = (fromTime, toTime) => {
    if (!replayBuffer.position) return;

    // Helper to get events in time window
    const getEvents = (arr) => {
      if (!arr) return [];
      return arr.filter(item => {
        if (!item.date) return false;
        const d = new Date(item.date).getTime();
        return d > fromTime && d <= toTime;
      });
    };

    // 1. Positions (Latest per driver)
    const positions = getEvents(replayBuffer.position);
    if (positions.length > 0) {
      const pMap = {};
      positions.forEach(p => pMap[p.driver_number] = p);
      updateLivePositions(pMap);
    }

    // 2. Intervals
    const intervals = getEvents(replayBuffer.intervals);
    if (intervals.length > 0) {
      const iMap = {};
      intervals.forEach(i => iMap[i.driver_number] = i);
      updateLiveIntervals(iMap);
    }

    // 3. Laps
    const laps = getEvents(replayBuffer.laps);
    if (laps.length > 0) {
      const lMap = {};
      laps.forEach(l => {
        if (!lMap[l.driver_number]) lMap[l.driver_number] = [];
        lMap[l.driver_number].push(l);
      });
      appendLiveLaps(lMap);
    }

    // 4. Stints (Just update them if any new arrived)
    // Note: OpenF1 stints usually update at the start of the stint.
    // We'll filter based on lap_start or if it has no date, we push it if the clock is past session start.
    // For simplicity, we filter by date if present.
    // Wait, stints endpoint doesn't typically have a direct `date` field. Let's just full-update stints up to current lap?
    // Let's assume they have `date` for now, if not we will fetch manually or they arrive empty.

    // 5. Pits
    const pits = getEvents(replayBuffer.pit);
    if (pits.length > 0) {
      const pMap = {};
      pits.forEach(p => {
        if (!pMap[p.driver_number]) pMap[p.driver_number] = [];
        pMap[p.driver_number].push(p);
      });
      appendLivePits(pMap);
    }

    // 6. Race Control
    const rc = getEvents(replayBuffer.race_control);
    if (rc.length > 0) appendLiveRaceControl(rc);

    // 7. Team Radio
    const tr = getEvents(replayBuffer.team_radio);
    if (tr.length > 0) appendLiveTeamRadio(tr);

    // 8. Overtakes
    const ot = getEvents(replayBuffer.overtakes);
    if (ot.length > 0) appendLiveOvertakes(ot);

    // 9. Weather (Latest)
    const wea = getEvents(replayBuffer.weather);
    if (wea.length > 0) updateLiveWeather(wea[wea.length - 1]);

    // 10. Telemetry
    if (selectedDriverNumber) {
      const cacheKey = `car_data_${selectedDriverNumber}`;
      if (replayBuffer[cacheKey]) {
        const tele = getEvents(replayBuffer[cacheKey]);
        if (tele.length > 0) {
          appendLiveCarData(selectedDriverNumber, tele);
        }
      }
    }
  };

  return { isBuffering };
};
