import { useQuery } from '@tanstack/react-query';

const ERGAST_BASE = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE = 'https://api.openf1.org/v1';

export const usePitStopData = (year, totalRounds) => {
  return useQuery({
    queryKey: ['pitstops', 'all', year, totalRounds],
    queryFn: async () => {
      // 1. Fetch OpenF1 Sessions for the year
      const sessionsRes = await fetch(`${OPENF1_BASE}/sessions?year=${year}&session_type=Race`);
      const sessionsData = await sessionsRes.json();
      
      // Sort sessions by date and filter to only the main Grand Prix
      const sortedSessions = sessionsData
        .filter(s => s.session_name === 'Race')
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      // 2. Parallel fetch for all rounds, staggered slightly to prevent rate limiting from OpenF1
      const promises = Array.from({ length: totalRounds }, (_, i) => i + 1).map(async (round, index) => {
        await new Promise(resolve => setTimeout(resolve, index * 200)); // 200ms stagger
        try {
          // Ergast Pitstops
          const pitRes = fetch(`${ERGAST_BASE}/${year}/${round}/pitstops.json`).then(r => r.json()).catch(() => null);
          // Ergast Results (to map driverId to driver number and constructor)
          const resRes = fetch(`${ERGAST_BASE}/${year}/${round}/results.json`).then(r => r.json()).catch(() => null);
          
          // OpenF1 Pitstops & Drivers
          let openF1Pits = [];
          let openF1Drivers = [];
          const session = sortedSessions[round - 1]; // Assuming 1:1 mapping by chronological order
          
          if (session) {
            const of1PitRes = fetch(`${OPENF1_BASE}/pit?session_key=${session.session_key}`).then(r => r.json());
            const of1DrvRes = fetch(`${OPENF1_BASE}/drivers?session_key=${session.session_key}`).then(r => r.json());
            const [of1Pit, of1Drv] = await Promise.all([of1PitRes, of1DrvRes].map(p => p.catch(() => [])));
            openF1Pits = of1Pit || [];
            openF1Drivers = of1Drv || [];
          }

          let ergastStops = [];
          let ergastResults = [];

          try {
            const [ergastPitData, ergastResData] = await Promise.all([pitRes, resRes]);
            ergastStops = ergastPitData?.MRData?.RaceTable?.Races?.[0]?.PitStops || [];
            ergastResults = ergastResData?.MRData?.RaceTable?.Races?.[0]?.Results || [];
          } catch (err) {
            console.warn(`Ergast failed for round ${round}, will try to fallback to OpenF1`, err);
          }

          // Map results to easily find driver number & constructor by driverId
          const driverMap = {};
          ergastResults.forEach(r => {
            driverMap[r.Driver.driverId] = {
              number: parseInt(r.number),
              constructorId: r.Constructor.constructorId,
              constructorName: r.Constructor.name
            };
          });

          // OpenF1 drivers map by number
          const of1DriverMap = {};
          openF1Drivers.forEach(d => {
            of1DriverMap[d.driver_number] = d;
          });

          // OpenF1 pits map by driver_number + lap
          const of1PitMap = {};
          openF1Pits.forEach(p => {
            of1PitMap[`${p.driver_number}-${p.lap_number}`] = p;
          });

          let enhancedStops = [];

          if (ergastStops && ergastStops.length > 0) {
            // Ergast data available
            const durations = ergastStops.map(s => parseFloat(s.duration) * 1000).sort((a, b) => a - b);
            const median = durations[Math.floor(durations.length / 2)] || 24000;
            const validStops = durations.filter(d => d > median - 5000);
            const minDuration = validStops.length > 0 ? Math.min(...validStops) : 24000;
            const transitTimeMs = minDuration - 2230;

            enhancedStops = ergastStops.map(stop => {
              const dInfo = driverMap[stop.driverId];
              const dNum = dInfo?.number;
              const of1Drv = dNum ? of1DriverMap[dNum] : null;

              const laneDurationMs = parseFloat(stop.duration) * 1000;
              
              // Find matching OpenF1 pitstop to get the exact API provided stationary time
              const of1Pit = dNum ? of1PitMap[`${dNum}-${stop.lap}`] : null;
              
              // Use OpenF1 stationary time if available, otherwise fallback to transit time median math
              let statDurationMs = Math.max(1500, laneDurationMs - transitTimeMs);
              if (of1Pit) {
                const apiStatTime = parseFloat(of1Pit.pit_duration || of1Pit.stop_duration || 0) * 1000;
                if (apiStatTime > 0 && apiStatTime < laneDurationMs) {
                  statDurationMs = apiStatTime;
                }
              }

              return {
                ...stop,
                round,
                driverNumber: dNum,
                constructorId: dInfo?.constructorId || 'unknown',
                constructorName: dInfo?.constructorName,
                durationMs: statDurationMs,
                laneDurationMs: laneDurationMs,
                isStationaryTime: !!of1Pit,
                driverObj: of1Drv || { 
                  full_name: stop.driverId, 
                  first_name: stop.driverId.split('_')[0] || stop.driverId,
                  last_name: stop.driverId.split('_')[1] || '',
                  name_acronym: stop.driverId.substring(0,3).toUpperCase() 
                }
              };
            });
          } else if (openF1Pits && openF1Pits.length > 0) {
            // Fallback to OpenF1 if Ergast is empty (e.g. for 2026 season)
            const laneDurations = openF1Pits.map(s => parseFloat(s.pit_duration || s.lane_duration || 0) * 1000).filter(d => d > 0).sort((a, b) => a - b);
            const median = laneDurations[Math.floor(laneDurations.length / 2)] || 24000;
            const validStops = laneDurations.filter(d => d > median - 5000);
            const minDuration = validStops.length > 0 ? Math.min(...validStops) : 24000;
            const transitTimeMs = minDuration - 2230;

            enhancedStops = openF1Pits.map(stop => {
              const of1Drv = of1DriverMap[stop.driver_number];
              const laneDurationMs = parseFloat(stop.lane_duration || stop.pit_duration || 0) * 1000;
              
              // Some OpenF1 races populate pit_duration as stationary time, some as lane duration.
              let statDurationMs = Math.max(1500, laneDurationMs - transitTimeMs);
              const apiStatTime = parseFloat(stop.pit_duration || stop.stop_duration || 0) * 1000;
              if (apiStatTime > 0 && apiStatTime < laneDurationMs) {
                statDurationMs = apiStatTime;
              }

              return {
                driverId: of1Drv?.name_acronym || String(stop.driver_number),
                round,
                lap: stop.lap_number,
                driverNumber: stop.driver_number,
                constructorId: of1Drv?.team_name?.replace(/\s/g, '').toLowerCase() || 'unknown',
                constructorName: of1Drv?.team_name || 'Unknown',
                durationMs: statDurationMs,
                laneDurationMs: laneDurationMs,
                isStationaryTime: true,
                driverObj: of1Drv || { 
                  full_name: String(stop.driver_number), 
                  first_name: '',
                  last_name: String(stop.driver_number),
                  name_acronym: String(stop.driver_number)
                }
              };
            });
          }

          return enhancedStops;
        } catch (e) {
          console.error(`Error fetching round ${round}:`, e);
          return [];
        }
      });

      const results = await Promise.all(promises);
      
      let allStops = [];
      results.forEach(roundStops => {
        allStops = [...allStops, ...roundStops];
      });

      return allStops;
    },
    enabled: !!year && !!totalRounds && totalRounds > 0,
    staleTime: 10 * 60 * 1000,
  });
};
