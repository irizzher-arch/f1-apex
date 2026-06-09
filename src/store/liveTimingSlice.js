export const createLiveTimingSlice = (set, get) => ({
  liveTiming: {
    // Session Identity & State
    sessionKey: null,
    sessionMode: 'waiting', // 'live', 'replay', 'waiting', 'playback'
    sessionMeta: null,
    
    // Core Data from OpenF1
    drivers: {},           // {[driver_number]: driverData}
    positions: {},         // {[driver_number]: positionData}
    intervals: {},         // {[driver_number]: intervalData}
    laps: {},              // {[driver_number]: lap[]}
    stints: {},            // {[driver_number]: stint[]}
    pits: {},              // {[driver_number]: pit[]}
    locations: {},         // {[driver_number]: {x, y, z, date}}
    carData: {},           // {[driver_number]: carDataRecord[]} (Rolling 60s buffer)
    
    // Feeds
    raceControl: [],
    teamRadio: [],
    overtakes: [],
    
    // Environmental
    weather: null,
    trackStatus: 'green',
    drsEnabled: false,
    currentLap: 0,
    totalLaps: 0,
    
    // User Settings & UI State
    selectedDriverNumber: null,
    displayDelay: 0,
    compactMode: false,
    columnVisibility: {
      gap: true,
      interval: true,
      lastLap: true,
      s1: true,
      s2: true,
      s3: true,
      tyre: true,
      pits: true,
      speed: true,
      drs: true,
      miniSectors: false,
    },
    
    // Global Alerts
    toasts: [],
    
    // Replay Orchestration
    replayClock: null,      // timestamp in ms
    playbackSpeed: 1,       // multiplier
    isPlaying: false,       
    replayBuffer: {},       // stores the raw fetched historical data
  },

  // Actions
  setLiveSession: (sessionKey, sessionMode, sessionMeta) => set((state) => ({
    liveTiming: { ...state.liveTiming, sessionKey, sessionMode, sessionMeta }
  })),

  resetLiveTimingState: () => set((state) => ({
    liveTiming: {
      ...state.liveTiming,
      drivers: {}, positions: {}, intervals: {}, laps: {}, stints: {}, pits: {}, locations: {}, carData: {},
      raceControl: [], teamRadio: [], overtakes: [],
      weather: null, trackStatus: 'green', drsEnabled: false, currentLap: 0, totalLaps: 0,
      toasts: [],
      replayClock: state.liveTiming.sessionMeta ? new Date(state.liveTiming.sessionMeta.date_start).getTime() : null,
      isPlaying: false,
    }
  })),

  updateLiveDrivers: (driversMap) => set((state) => ({
    liveTiming: { ...state.liveTiming, drivers: { ...state.liveTiming.drivers, ...driversMap } }
  })),

  updateLivePositions: (positionsMap) => set((state) => ({
    liveTiming: { ...state.liveTiming, positions: { ...state.liveTiming.positions, ...positionsMap } }
  })),

  updateLiveIntervals: (intervalsMap) => set((state) => ({
    liveTiming: { ...state.liveTiming, intervals: { ...state.liveTiming.intervals, ...intervalsMap } }
  })),

  appendLiveLaps: (newLapsMap) => set((state) => {
    const nextLaps = { ...state.liveTiming.laps };
    let highestLap = state.liveTiming.currentLap;
    
    Object.entries(newLapsMap).forEach(([driverNo, laps]) => {
      const existing = nextLaps[driverNo] || [];
      // To avoid duplicates, we can filter out laps already in 'existing' by lap_number,
      // but assuming appendLiveLaps is called with truly *new* laps only.
      const newUniqueLaps = laps.filter(nl => !existing.some(el => el.lap_number === nl.lap_number));
      nextLaps[driverNo] = [...existing, ...newUniqueLaps];
      
      const maxL = Math.max(...nextLaps[driverNo].map(l => l.lap_number || 0));
      if (maxL > highestLap) highestLap = maxL;
    });

    return { 
      liveTiming: { 
        ...state.liveTiming, 
        laps: nextLaps,
        currentLap: highestLap
      } 
    };
  }),

  updateLiveStints: (stintsMap) => set((state) => ({
    liveTiming: { ...state.liveTiming, stints: { ...state.liveTiming.stints, ...stintsMap } }
  })),

  appendLivePits: (newPitsMap) => set((state) => {
    const nextPits = { ...state.liveTiming.pits };
    Object.entries(newPitsMap).forEach(([driverNo, pits]) => {
      const existing = nextPits[driverNo] || [];
      const newUniquePits = pits.filter(np => !existing.some(ep => ep.lap_number === np.lap_number));
      nextPits[driverNo] = [...existing, ...newUniquePits];
    });
    return { liveTiming: { ...state.liveTiming, pits: nextPits } };
  }),

  appendLiveRaceControl: (newMessages) => set((state) => {
    // Prepend or append depending on display preference. The API returns chronological.
    // Let's store them in chronological order.
    const existing = state.liveTiming.raceControl;
    const uniqueNew = newMessages.filter(nm => !existing.some(em => em.date === nm.date && em.message === nm.message));
    
    // Derive track status from flag messages
    let newStatus = state.liveTiming.trackStatus;
    uniqueNew.forEach(msg => {
      if (msg.category === 'Flag') {
        if (msg.flag === 'YELLOW') newStatus = 'yellow';
        else if (msg.flag === 'DOUBLE YELLOW') newStatus = 'yellow'; // Treat double yellow as yellow visually globally or parse appropriately
        else if (msg.flag === 'GREEN' || msg.flag === 'CLEAR') newStatus = 'green';
        else if (msg.flag === 'RED') newStatus = 'red';
      } else if (msg.category === 'SafetyCar') {
        if (msg.message.includes('SAFETY CAR DEPLOYED')) newStatus = 'sc';
        else if (msg.message.includes('VIRTUAL SAFETY CAR DEPLOYED')) newStatus = 'vsc';
      }
    });

    let newDrs = state.liveTiming.drsEnabled;
    uniqueNew.forEach(msg => {
      if (msg.category === 'Drs') {
        if (msg.message.includes('ENABLED')) newDrs = true;
        else if (msg.message.includes('DISABLED')) newDrs = false;
      }
    });

    return { 
      liveTiming: { 
        ...state.liveTiming, 
        raceControl: [...existing, ...uniqueNew],
        trackStatus: newStatus,
        drsEnabled: newDrs
      } 
    };
  }),

  appendLiveTeamRadio: (newRadios) => set((state) => {
    const existing = state.liveTiming.teamRadio;
    const uniqueNew = newRadios.filter(nr => !existing.some(er => er.date === nr.date && er.driver_number === nr.driver_number));
    return { liveTiming: { ...state.liveTiming, teamRadio: [...existing, ...uniqueNew] } };
  }),

  appendLiveOvertakes: (newOvertakes) => set((state) => {
    const existing = state.liveTiming.overtakes;
    const uniqueNew = newOvertakes.filter(no => !existing.some(eo => eo.date === no.date && eo.driver_number_overtaking === no.driver_number_overtaking));
    return { liveTiming: { ...state.liveTiming, overtakes: [...existing, ...uniqueNew] } };
  }),

  updateLiveWeather: (weather) => set((state) => ({
    liveTiming: { ...state.liveTiming, weather }
  })),

  updateLiveLocations: (locationsMap) => set((state) => ({
    // Unlike laps, location is a single point per driver that just gets overwritten
    liveTiming: { ...state.liveTiming, locations: { ...state.liveTiming.locations, ...locationsMap } }
  })),

  appendLiveCarData: (driverNumber, newData) => set((state) => {
    // We only keep the last ~60 seconds of car data for the selected driver to prevent memory leaks.
    // Assuming data points come in at 3-4Hz, 60s is about 240 points. Let's keep max 300 points.
    const existing = state.liveTiming.carData[driverNumber] || [];
    const combined = [...existing, ...newData];
    
    // Sort by date to be safe
    combined.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Keep only the most recent 300
    const trimmed = combined.slice(Math.max(combined.length - 300, 0));

    return { 
      liveTiming: { 
        ...state.liveTiming, 
        carData: {
          ...state.liveTiming.carData,
          [driverNumber]: trimmed
        }
      } 
    };
  }),

  setLiveSelectedDriver: (driverNumber) => set((state) => ({
    liveTiming: { ...state.liveTiming, selectedDriverNumber: driverNumber }
  })),

  setLiveColumnVisibility: (columnKey, isVisible) => set((state) => ({
    liveTiming: { 
      ...state.liveTiming, 
      columnVisibility: { ...state.liveTiming.columnVisibility, [columnKey]: isVisible } 
    }
  })),

  setLiveCompactMode: (isCompact) => set((state) => ({
    liveTiming: { ...state.liveTiming, compactMode: isCompact }
  })),

  setLiveDisplayDelay: (delaySeconds) => set((state) => ({
    liveTiming: { ...state.liveTiming, displayDelay: delaySeconds }
  })),

  addLiveToast: (toast) => set((state) => ({
    liveTiming: { ...state.liveTiming, toasts: [...state.liveTiming.toasts, { id: Date.now(), ...toast }] }
  })),

  removeLiveToast: (id) => set((state) => ({
    liveTiming: { ...state.liveTiming, toasts: state.liveTiming.toasts.filter(t => t.id !== id) }
  })),
  
  setLiveTotalLaps: (totalLaps) => set((state) => ({
    liveTiming: { ...state.liveTiming, totalLaps }
  })),

  // Replay Specific Actions
  setReplayClock: (time) => set((state) => ({
    liveTiming: { ...state.liveTiming, replayClock: time }
  })),
  setPlaybackSpeed: (speed) => set((state) => ({
    liveTiming: { ...state.liveTiming, playbackSpeed: speed }
  })),
  setIsPlaying: (playing) => set((state) => ({
    liveTiming: { ...state.liveTiming, isPlaying: playing }
  })),
  setReplayBuffer: (buffer) => set((state) => ({
    liveTiming: { ...state.liveTiming, replayBuffer: buffer }
  })),
});
