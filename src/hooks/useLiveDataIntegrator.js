import { useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { useLivePolling } from './useLivePolling';

export const useLiveDataIntegrator = () => {
  const sessionKey = useStore(state => state.liveTiming.sessionKey);
  const sessionMode = useStore(state => state.liveTiming.sessionMode);
  
  const updateLiveDrivers = useStore(state => state.updateLiveDrivers);
  const updateLivePositions = useStore(state => state.updateLivePositions);
  const updateLiveIntervals = useStore(state => state.updateLiveIntervals);
  const appendLiveLaps = useStore(state => state.appendLiveLaps);
  const updateLiveStints = useStore(state => state.updateLiveStints);
  const appendLivePits = useStore(state => state.appendLivePits);
  const appendLiveRaceControl = useStore(state => state.appendLiveRaceControl);
  const appendLiveTeamRadio = useStore(state => state.appendLiveTeamRadio);
  const updateLiveWeather = useStore(state => state.updateLiveWeather);
  const updateLiveLocations = useStore(state => state.updateLiveLocations);
  const appendLiveCarData = useStore(state => state.appendLiveCarData);
  const appendLiveOvertakes = useStore(state => state.appendLiveOvertakes);
  
  const selectedDriverNumber = useStore(state => state.liveTiming.selectedDriverNumber);

  // 1. Fetch Drivers (Static for the session, fetch once)
  useEffect(() => {
    if (!sessionKey || sessionMode === 'waiting') return;
    fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
      .then(r => r.json())
      .then(data => {
        const driversMap = {};
        data.forEach(d => {
          driversMap[d.driver_number] = d;
        });
        updateLiveDrivers(driversMap);
      })
      .catch(err => console.error('Failed to fetch live drivers', err));
  }, [sessionKey, sessionMode, updateLiveDrivers]);

  // Callbacks for polling
  const handlePositions = useCallback((data) => {
    const map = {};
    data.forEach(d => { map[d.driver_number] = d; }); // Last record wins (since we get multiple positions per driver potentially, though polling frequency mitigates it)
    updateLivePositions(map);
  }, [updateLivePositions]);

  const handleIntervals = useCallback((data) => {
    const map = {};
    data.forEach(d => { map[d.driver_number] = d; });
    updateLiveIntervals(map);
  }, [updateLiveIntervals]);

  const handleLaps = useCallback((data) => {
    const map = {};
    data.forEach(d => {
      if (!map[d.driver_number]) map[d.driver_number] = [];
      map[d.driver_number].push(d);
    });
    appendLiveLaps(map);
  }, [appendLiveLaps]);

  const handleStints = useCallback((data) => {
    const map = {};
    data.forEach(d => {
      if (!map[d.driver_number]) map[d.driver_number] = [];
      map[d.driver_number].push(d);
    });
    // Ensure chronological order per driver
    Object.keys(map).forEach(k => {
      map[k].sort((a, b) => a.stint_number - b.stint_number);
    });
    updateLiveStints(map);
  }, [updateLiveStints]);

  const handlePits = useCallback((data) => {
    const map = {};
    data.forEach(d => {
      if (!map[d.driver_number]) map[d.driver_number] = [];
      map[d.driver_number].push(d);
    });
    appendLivePits(map);
  }, [appendLivePits]);

  const handleRaceControl = useCallback((data) => {
    appendLiveRaceControl(data);
  }, [appendLiveRaceControl]);

  const handleTeamRadio = useCallback((data) => {
    appendLiveTeamRadio(data);
  }, [appendLiveTeamRadio]);

  const handleWeather = useCallback((data) => {
    if (data && data.length > 0) {
      updateLiveWeather(data[data.length - 1]); // Get the most recent
    }
  }, [updateLiveWeather]);

  const handleLocations = useCallback((data) => {
    const map = {};
    data.forEach(d => { map[d.driver_number] = d; });
    updateLiveLocations(map);
  }, [updateLiveLocations]);

  const handleCarData = useCallback((data) => {
    if (data && data.length > 0) {
      // Data is only for selectedDriverNumber, so we append directly
      appendLiveCarData(selectedDriverNumber, data);
    }
  }, [appendLiveCarData, selectedDriverNumber]);

  const handleOvertakes = useCallback((data) => {
    appendLiveOvertakes(data);
  }, [appendLiveOvertakes]);


  // Polling Registrations (Active during 'live' mode via useLivePolling internal logic)
  
  // 4s polling
  useLivePolling('position', 4000, handlePositions, sessionKey, '', true);
  useLivePolling('intervals', 4000, handleIntervals, sessionKey, '', true);
  
  // 5s polling (append-only)
  useLivePolling('laps', 5000, handleLaps, sessionKey, '', true);
  useLivePolling('race_control', 5000, handleRaceControl, sessionKey, '', true);
  useLivePolling('overtakes', 5000, handleOvertakes, sessionKey, '', true);
  
  // 10s polling
  useLivePolling('team_radio', 10000, handleTeamRadio, sessionKey, '', true);
  useLivePolling('pit', 10000, handlePits, sessionKey, '', true);
  
  // 15s polling
  useLivePolling('stints', 15000, handleStints, sessionKey, ''); // stints might get updated with lap_end, so maybe full fetch is safer, or append and merge. Actually stints endpoint doesn't return full history effectively if we append-only on date, it's safer to full fetch or merge carefully. Let's full fetch every 15s since the payload is small.
  
  // 60s polling
  useLivePolling('weather', 60000, handleWeather, sessionKey, '');
  
  // High frequency polling (1s)
  useLivePolling('location', 1000, handleLocations, sessionKey, '', true);
  
  // Telemetry specific to selected driver (1s)
  // Only poll car_data if a driver is selected
  useLivePolling('car_data', 1000, handleCarData, selectedDriverNumber ? sessionKey : null, `&driver_number=${selectedDriverNumber}`, true);

  // Initial historic fetch for REPLAY mode (and LIVE mode startup to fill state)
  useEffect(() => {
    if (!sessionKey || sessionMode === 'waiting') return;

    // We do a one-off fetch for the full history of append-only endpoints
    // This is especially important for REPLAY mode where useLivePolling will short-circuit,
    // and for LIVE mode to get all the data that happened *before* we joined.
    
    const fetchHistoric = async () => {
      try {
        const endpoints = ['position', 'intervals', 'laps', 'stints', 'pit', 'race_control', 'team_radio', 'weather', 'overtakes'];
        const promises = endpoints.map(ep => fetch(`https://api.openf1.org/v1/${ep}?session_key=${sessionKey}`).then(r => r.json()).catch(() => []));
        
        const [pos, int, lps, sts, pts, rc, rad, wea, ovt] = await Promise.all(promises);
        
        if (pos) handlePositions(pos);
        if (int) handleIntervals(int);
        if (lps) handleLaps(lps);
        if (sts) handleStints(sts);
        if (pts) handlePits(pts);
        if (rc) handleRaceControl(rc);
        if (rad) handleTeamRadio(rad);
        if (wea) handleWeather(wea);
        if (ovt) handleOvertakes(ovt);
        
      } catch(err) {
        console.error('Failed to load historic session data', err);
      }
    };

    fetchHistoric();
  }, [sessionKey, sessionMode, handlePositions, handleIntervals, handleLaps, handleStints, handlePits, handleRaceControl, handleTeamRadio, handleWeather, handleOvertakes]);

};
