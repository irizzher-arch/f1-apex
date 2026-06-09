import { useQuery } from '@tanstack/react-query';

const fetchConstructorStandings = async (year) => {
  const url = year === new Date().getFullYear() 
    ? `https://api.jolpi.ca/ergast/f1/current/constructorStandings.json`
    : `https://api.jolpi.ca/ergast/f1/${year}/constructorStandings.json`;
    
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch constructor standings');
  const data = await res.json();
  
  const standingsLists = data?.MRData?.StandingsTable?.StandingsLists;
  return standingsLists && standingsLists.length > 0 ? standingsLists[0].ConstructorStandings : [];
};

export const useConstructorStandings = (year) => {
  return useQuery({
    queryKey: ['constructorStandings', year],
    queryFn: () => fetchConstructorStandings(year),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!year,
  });
};
