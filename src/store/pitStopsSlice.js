export const createPitStopsSlice = (set, get) => ({
  pitStops: {
    year: new Date().getFullYear(),
    selectedRound: 'ALL',
    selectedTeam: 'ALL',
    showCleanStopsOnly: false,
    sortConfig: { key: 'duration', direction: 'asc' },
  },
  setPitStopsState: (newState) => set((state) => ({ 
    pitStops: { ...state.pitStops, ...newState } 
  })),
  togglePitStopsTeam: (teamId) => set((state) => {
    // If we want multiple team filtering, or just single team selection
    return { pitStops: { ...state.pitStops, selectedTeam: teamId } };
  }),
});
