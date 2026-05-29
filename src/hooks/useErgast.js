import { useState, useCallback } from 'react';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const useErgast = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStandings = useCallback(async (year = 'current') => {
    try {
      setLoading(true);
      const [driverRes, constructorRes] = await Promise.all([
        fetch(`${BASE_URL}/${year}/driverStandings.json`),
        fetch(`${BASE_URL}/${year}/constructorStandings.json`)
      ]);
      const driverData = await driverRes.json();
      const constructorData = await constructorRes.json();
      
      return {
        drivers: driverData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [],
        constructors: constructorData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []
      };
    } catch (err) {
      setError(err);
      return { drivers: [], constructors: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSchedule = useCallback(async (year = 'current') => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${year}.json`);
      const data = await res.json();
      return data.MRData.RaceTable.Races || [];
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResults = useCallback(async (year = 'current', round = 'last') => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${year}/${round}/results.json`);
      const data = await res.json();
      return data.MRData.RaceTable.Races[0] || null;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchStandings, fetchSchedule, fetchResults };
};
