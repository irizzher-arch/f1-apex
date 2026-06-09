export const createHomeSlice = (set, get) => ({
  home: {
    selectedYear: new Date().getFullYear(),
  },
  
  setHomeSelectedYear: (year) => set((state) => ({
    home: { ...state.home, selectedYear: year }
  })),
});
