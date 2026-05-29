import { useQuery } from '@tanstack/react-query';

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE = 'https://api.openf1.org/v1';

export const useDriverMeta = (year) => {
  return useQuery({
    queryKey: ['driverMeta', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}/drivers.json?limit=100`);
      const data = await res.json();
      return data.MRData.DriverTable.Drivers;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSeasonResults = (year) => {
  return useQuery({
    queryKey: ['seasonResults', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}/results.json?limit=1000`);
      const data = await res.json();
      return data.MRData.RaceTable.Races;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useQualifyingData = (year) => {
  return useQuery({
    queryKey: ['qualifyingData', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}/qualifying.json?limit=1000`);
      const data = await res.json();
      return data.MRData.RaceTable.Races;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useDriverStandings = (year) => {
  return useQuery({
    queryKey: ['driverStandings', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}/driverStandings.json`);
      const data = await res.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSprintResults = (year) => {
  return useQuery({
    queryKey: ['sprintResults', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}/sprint.json?limit=1000`);
      const data = await res.json();
      return data.MRData.RaceTable.Races;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// We will fetch pit stops directly per driver/round in the orchestrator if needed, 
// or fetch all laps/pit stops via Jolpi. 
export const usePitStopData = (year, round) => {
  return useQuery({
    queryKey: ['pitStopData', year, round],
    queryFn: async () => {
      if (!round) return null;
      const res = await fetch(`${ERGAST_BASE}/${year}/${round}/pitstops.json?limit=1000`);
      const data = await res.json();
      return data.MRData.RaceTable.Races[0]?.PitStops || [];
    },
    enabled: !!round && !!year,
    staleTime: 1000 * 60 * 5,
  });
};
