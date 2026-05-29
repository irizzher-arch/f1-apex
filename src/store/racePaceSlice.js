export const createRacePaceSlice = (set, get) => ({
  racePace: {
    year: new Date().getFullYear(),
    round: 'last',
    sessionKey: null,
    selectedDrivers: [],
    showOutlierLaps: false,
    rollingAvg: false,
    relativeToWinner: false,
    isLive: false,
  },
  setRacePaceState: (newState) => set((state) => ({ 
    racePace: { ...state.racePace, ...newState } 
  })),
  toggleRacePaceDriver: (driverNumber) => set((state) => {
    const current = state.racePace.selectedDrivers;
    const isSelected = current.includes(driverNumber);
    return {
      racePace: {
        ...state.racePace,
        selectedDrivers: isSelected 
          ? current.filter(d => d !== driverNumber)
          : [...current, driverNumber]
      }
    };
  }),
  setRacePaceDrivers: (drivers) => set((state) => ({
    racePace: { ...state.racePace, selectedDrivers: drivers }
  })),
});
