import { useMemo } from 'react';

const POINTS_STRUCTURE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export const useDHLPoints = (allStops, driversData, schedule) => {
  return useMemo(() => {
    if (!allStops || allStops.length === 0 || !schedule || !driversData) {
      return { constructorStandings: [], driverStandings: [] };
    }

    const constructorPoints = {};
    const driverPoints = {};

    // Group stops by round
    const stopsByRound = {};
    allStops.forEach(stop => {
      if (!stopsByRound[stop.round]) stopsByRound[stop.round] = [];
      stopsByRound[stop.round].push(stop);
    });

    Object.keys(stopsByRound).forEach(roundStr => {
      const round = parseInt(roundStr);
      const stops = stopsByRound[round];

      // Map driverId to constructorId based on the driversData
      const mappedStops = stops.map(stop => {
        const drv = driversData.find(d => String(d.driver_number) === stop.driverId || d.driverId === stop.driverId);
        return {
          ...stop,
          constructorId: drv ? drv.team_name?.replace(/\s/g, '').toLowerCase() || drv.constructorId : 'unknown',
          driverObj: drv
        };
      });

      // Filter fastest stop per constructor
      const fastestPerConstructor = {};
      mappedStops.forEach(stop => {
        if (!fastestPerConstructor[stop.constructorId] || stop.durationMs < fastestPerConstructor[stop.constructorId].durationMs) {
          fastestPerConstructor[stop.constructorId] = stop;
        }
      });

      // Sort these fastest stops
      const rankedStops = Object.values(fastestPerConstructor).sort((a, b) => a.durationMs - b.durationMs);

      // Award points
      rankedStops.forEach((stop, idx) => {
        const pts = idx < POINTS_STRUCTURE.length ? POINTS_STRUCTURE[idx] : 0;
        
        // Constructor points
        if (!constructorPoints[stop.constructorId]) {
          constructorPoints[stop.constructorId] = { total: 0, wins: 0, byRound: {} };
        }
        constructorPoints[stop.constructorId].total += pts;
        constructorPoints[stop.constructorId].byRound[round] = pts;
        if (idx === 0) constructorPoints[stop.constructorId].wins += 1;

        // Driver points (attributed to driver who got the team's best stop)
        if (stop.driverId) {
          if (!driverPoints[stop.driverId]) {
            driverPoints[stop.driverId] = { total: 0, wins: 0, byRound: {}, driverObj: stop.driverObj };
          }
          driverPoints[stop.driverId].total += pts;
          driverPoints[stop.driverId].byRound[round] = pts;
          if (idx === 0) driverPoints[stop.driverId].wins += 1;
        }
      });
    });

    const constructorStandings = Object.entries(constructorPoints).map(([id, data]) => ({
      id,
      ...data
    })).sort((a, b) => b.total - a.total);

    const driverStandings = Object.entries(driverPoints).map(([id, data]) => ({
      id,
      ...data
    })).sort((a, b) => b.total - a.total);

    return { constructorStandings, driverStandings };
  }, [allStops, driversData, schedule]);
};
