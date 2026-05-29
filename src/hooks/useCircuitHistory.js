import { useState, useEffect } from 'react';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const useCircuitHistory = (circuitId) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!circuitId) return;
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Fetch winners at this circuit (position 1) limit 15 to get enough history
        const winnersRes = await fetch(`${BASE_URL}/circuits/${circuitId}/results/1.json?limit=15`);
        const winnersData = await winnersRes.json();
        
        // Map the races into a past winners format
        const pastWinners = winnersData.MRData.RaceTable.Races.map(race => {
          const result = race.Results[0];
          return {
            year: race.season,
            driverId: result.Driver.driverId,
            winner: `${result.Driver.givenName} ${result.Driver.familyName}`,
            team: result.Constructor.name,
            startingPos: result.grid,
            laps: result.laps,
            fastestLap: result.FastestLap?.Time?.time || "N/A",
            margin: result.Time?.time || "N/A"
          };
        }).sort((a, b) => parseInt(b.year) - parseInt(a.year)); // descending year

        if (isMounted) {
          setHistory({
            pastWinners
          });
        }
      } catch (e) {
        console.error("Failed to fetch circuit history", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => { isMounted = false; };
  }, [circuitId]);

  return { history, loading };
};
