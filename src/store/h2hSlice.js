export const createH2HSlice = (set, get) => ({
  h2h: {
    driver1Id: 'max_verstappen',
    driver2Id: 'leclerc',
    season: new Date().getFullYear().toString(),
    teamId: null, // For TEAMMATES mode
    comparisonMode: 'ANY TWO', // 'TEAMMATES' | 'ANY TWO'
    allRounds: [],
  },
  setH2HState: (newState) =>
    set((state) => ({ h2h: { ...state.h2h, ...newState } })),
  setH2HDrivers: (driver1Id, driver2Id) =>
    set((state) => ({ h2h: { ...state.h2h, driver1Id, driver2Id } })),
  setH2HSeason: (season) =>
    set((state) => ({ h2h: { ...state.h2h, season } })),
  setH2HMode: (mode) =>
    set((state) => ({ h2h: { ...state.h2h, comparisonMode: mode } })),
  setH2HTeam: (teamId) =>
    set((state) => ({ h2h: { ...state.h2h, teamId } })),
});
