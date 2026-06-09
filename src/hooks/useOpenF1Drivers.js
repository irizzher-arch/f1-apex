import { useQuery } from '@tanstack/react-query';

const fetchOpenF1Drivers = async (year) => {
  // We query all drivers for the given year, and the API returns multiple records per driver (one for each session).
  // We need to deduplicate them to get just one record per driver, prioritizing ones with headshot_url.
  
  const res = await fetch(`https://api.openf1.org/v1/drivers?year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch OpenF1 drivers');
  const data = await res.json();
  
  // Deduplicate by driver_number
  const driverMap = new Map();
  
  data.forEach(record => {
    const existing = driverMap.get(record.driver_number);
    if (!existing) {
      driverMap.set(record.driver_number, record);
    } else {
      // If existing doesn't have a headshot but the new one does, upgrade it
      if (!existing.headshot_url && record.headshot_url) {
        driverMap.set(record.driver_number, record);
      }
    }
  });

  // Convert map to an object indexed by driver_number for easy O(1) lookup in UI
  const result = {};
  for (const [number, record] of driverMap.entries()) {
    result[number] = record;
  }
  
  return result;
};

export const useOpenF1Drivers = (year) => {
  return useQuery({
    queryKey: ['openf1Drivers', year],
    queryFn: () => fetchOpenF1Drivers(year),
    staleTime: Infinity, // Doesn't really change once loaded
    enabled: !!year,
  });
};
