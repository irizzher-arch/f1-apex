import { useQuery } from '@tanstack/react-query';

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';

export const useAllRoundsSchedule = (year) => {
  return useQuery({
    queryKey: ['ergast', 'schedule', 'all', year],
    queryFn: async () => {
      const res = await fetch(`${ERGAST_BASE}/${year}.json`);
      const data = await res.json();
      return data?.MRData?.RaceTable?.Races || [];
    },
    enabled: !!year,
    staleTime: 10 * 60 * 1000,
  });
};
