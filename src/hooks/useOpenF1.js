import { useCallback } from 'react';

const BASE_URL = 'https://api.openf1.org/v1';

export const useOpenF1 = () => {
  const fetchLatestSession = useCallback(async () => {
    try {
      // Get the most recent race session
      const res = await fetch(`${BASE_URL}/sessions?session_name=Race&session_type=Race`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        // Sort by date descending
        const sorted = data.sort((a, b) => new Date(b.date_start) - new Date(a.date_start));
        return sorted[0];
      }
      return null;
    } catch (err) {
      console.error('Error fetching session', err);
      return null;
    }
  }, []);

  const getDrivers = useCallback(async (sessionKey) => {
    try {
      const res = await fetch(`${BASE_URL}/drivers?session_key=${sessionKey}`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching drivers', err);
      return [];
    }
  }, []);

  const getIntervals = useCallback(async (sessionKey) => {
    try {
      // To get latest intervals, we'd normally poll or get the most recent entries.
      // We will get a subset to not freeze the browser.
      const res = await fetch(`${BASE_URL}/intervals?session_key=${sessionKey}&limit=200`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching intervals', err);
      return [];
    }
  }, []);

  const getCarData = useCallback(async (sessionKey, driverNumber) => {
    try {
      const res = await fetch(`${BASE_URL}/car_data?session_key=${sessionKey}&driver_number=${driverNumber}&limit=100`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching car data', err);
      return [];
    }
  }, []);

  const getLocation = useCallback(async (sessionKey) => {
    try {
      // Get recent locations for all cars
      const res = await fetch(`${BASE_URL}/location?session_key=${sessionKey}&limit=100`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching location', err);
      return [];
    }
  }, []);

  return { fetchLatestSession, getDrivers, getIntervals, getCarData, getLocation };
};
