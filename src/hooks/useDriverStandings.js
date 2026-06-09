import { useQuery } from '@tanstack/react-query';

const fetchDriverStandings = async (year) => {
  const url = year === new Date().getFullYear() 
    ? `https://api.jolpi.ca/ergast/f1/current/driverStandings.json`
    : `https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`;
    
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch driver standings');
  const data = await res.json();
  
  const standingsLists = data?.MRData?.StandingsTable?.StandingsLists;
  return standingsLists && standingsLists.length > 0 ? standingsLists[0].DriverStandings : [];
};

export const useDriverStandings = (year) => {
  return useQuery({
    queryKey: ['driverStandings', year],
    queryFn: () => fetchDriverStandings(year),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!year,
  });
};
