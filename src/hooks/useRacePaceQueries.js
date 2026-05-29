import { useQuery } from '@tanstack/react-query';

const OPENF1_BASE = 'https://api.openf1.org/v1';
const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';

// OpenF1 Hooks
export const useOpenF1Session = (year, round) => {
  return useQuery({
    queryKey: ['openf1', 'session', year, round],
    queryFn: async () => {
      const ergastRes = await fetch(`${ERGAST_BASE}/${year}.json`);
      const ergastData = await ergastRes.json();
      const race = ergastData.MRData.RaceTable.Races.find(r => r.round === String(round));
      if (!race) throw new Error('Race not found');
      
      const country = race.Circuit.Location.country;
      
      const res = await fetch(`${OPENF1_BASE}/sessions?year=${year}&session_type=Race`);
      const sessions = await res.json();
      
      if (!Array.isArray(sessions)) return null;
      
      const session = sessions.find(s => s.country_name === country || s.location === race.Circuit.Location.locality);
      return session || sessions[sessions.length - 1] || null;
    },
    enabled: !!year && !!round,
    staleTime: 10 * 60 * 1000,
  });
};

export const useLapData = (sessionKey, isLive) => {
  return useQuery({
    queryKey: ['openf1', 'laps', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/laps?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
    refetchInterval: isLive ? 15000 : false,
  });
};

export const useStintData = (sessionKey) => {
  return useQuery({
    queryKey: ['openf1', 'stints', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/stints?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
  });
};

export const usePositionData = (sessionKey, isLive) => {
  return useQuery({
    queryKey: ['openf1', 'position', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/position?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
    refetchInterval: isLive ? 15000 : false,
  });
};

export const useIntervalData = (sessionKey, isLive) => {
  return useQuery({
    queryKey: ['openf1', 'intervals', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/intervals?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
    refetchInterval: isLive ? 15000 : false,
  });
};

export const useRaceControlData = (sessionKey) => {
  return useQuery({
    queryKey: ['openf1', 'race_control', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/race_control?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
  });
};

export const useWeatherData = (sessionKey, isLive) => {
  return useQuery({
    queryKey: ['openf1', 'weather', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/weather?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
    refetchInterval: isLive ? 30000 : false,
  });
};

export const useDriverData = (sessionKey) => {
  return useQuery({
    queryKey: ['openf1', 'drivers', sessionKey],
    queryFn: async () => {
      const res = await fetch(`${OPENF1_BASE}/drivers?session_key=${sessionKey}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!sessionKey,
  });
};

// Ergast Hooks
export const useErgastResults = (year, round) => {
  return useQuery({
    queryKey: ['ergast', 'results', year, round],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}/${round}/results.json`);
      const data = await res.json();
      return data?.MRData?.RaceTable?.Races?.[0] || null;
    },
    enabled: !!year && !!round,
  });
};

export const useErgastSchedule = (year) => {
  return useQuery({
    queryKey: ['ergast', 'schedule', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}.json`);
      const data = await res.json();
      return data?.MRData?.RaceTable?.Races || [];
    },
    enabled: !!year,
  });
};
