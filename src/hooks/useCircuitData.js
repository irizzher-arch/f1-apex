import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { defaultCircuit } from '@/data/circuits/defaultCircuit';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const useCircuitData = (circuitId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { circuit } = useStore();
  const year = circuit.selectedYear;

  useEffect(() => {
    if (!circuitId) return;

    let isMounted = true;

    const fetchCircuitInfo = async () => {
      try {
        setLoading(true);

        // 1. Fetch Ergast Circuit Metadata
        const circuitRes = await fetch(`${BASE_URL}/circuits/${circuitId}.json`);
        const circuitData = await circuitRes.json();
        const ergastCircuit = circuitData.MRData.CircuitTable.Circuits[0];

        if (!ergastCircuit) throw new Error("Circuit not found in Ergast API");

        // 2. Fetch Schedule to get the round and date for this year
        let scheduleRace = null;
        try {
          const schedRes = await fetch(`${BASE_URL}/${year}/circuits/${circuitId}/races.json`);
          const schedData = await schedRes.json();
          scheduleRace = schedData.MRData.RaceTable.Races[0];
        } catch (e) {
          console.warn("Could not fetch schedule for this year", e);
        }

        // 3. Load Static JSON Fallback Data
        let staticData = defaultCircuit;
        try {
          // Dynamic import of the JSON file
          const module = await import(`../data/circuits/${circuitId}.json`);
          staticData = module.default || module;
        } catch (e) {
          console.warn(`No static data found for ${circuitId}, using default fallback`);
        }

        if (isMounted) {
          setData({
            id: circuitId,
            ergast: ergastCircuit,
            schedule: scheduleRace,
            static: staticData
          });
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCircuitInfo();

    return () => {
      isMounted = false;
    };
  }, [circuitId, year]);

  return { data, loading, error };
};
