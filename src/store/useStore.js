import { create } from 'zustand';
import { createH2HSlice } from './h2hSlice';
import { createRacePaceSlice } from './racePaceSlice';

export const useStore = create((set, get) => ({
  ...createH2HSlice(set, get),
  ...createRacePaceSlice(set, get),
  // Session State
  session: {
    year: new Date().getFullYear(),
    round: 1,
    grandPrix: 'BAHRAIN GP',
    status: 'RACE', // QUALIFYING, RACE, FINISHED
    phase: 'LAP 1/57',
    isLive: false,
  },
  setSession: (sessionData) => set((state) => ({ session: { ...state.session, ...sessionData } })),
  
  // Drivers / Leaderboard State
  drivers: [],
  setDrivers: (drivers) => set({ drivers }),
  updateDriverPositions: (positionChanges) => set((state) => {
    // Logic to update positions and trigger animations could go here
    return { drivers: state.drivers }; // Placeholder
  }),
  
  // Telemetry State
  telemetry: {
    selectedDrivers: ['44', '16', '1'],
    speedData: [], 
    throttleBrakeData: [],
  },
  setTelemetryData: (type, data) => set((state) => ({ 
    telemetry: { ...state.telemetry, [type]: data } 
  })),
  setSelectedDrivers: (drivers) => set((state) => ({
    telemetry: { ...state.telemetry, selectedDrivers: drivers }
  })),

  // UI State
  ui: {
    activeTab: 'HOME',
  },
  setActiveTab: (tab) => set((state) => ({ ui: { ...state.ui, activeTab: tab } })),
  setSessionYear: (year) => set((state) => ({ session: { ...state.session, year } })),

  // Circuit Details State
  circuit: {
    selectedYear: new Date().getFullYear(),
    isLoading: false,
    error: null,
    data: null,
  },
  setCircuitState: (circuitData) => set((state) => ({ circuit: { ...state.circuit, ...circuitData } })),
}));
