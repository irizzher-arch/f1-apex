/**
 * Calculate the APEX PERFORMANCE SCORE (0-100) for a driver.
 *
 * Metric             Weight    Calculation
 * ─────────────────────────────────────────────────────────────
 * Championship Pts   25%       Driver pts / max possible pts in season × 100
 * Race H2H           20%       Races ahead / total shared races × 100
 * Qualifying H2H     20%       Quali rounds ahead / total shared rounds × 100
 * Podium Rate        15%       Podiums / races started × 100
 * Points Finish Rate 10%       Points finishes / races started × 100
 * Avg Finish (inv.)  5%        (20 - avg finish position) / 19 × 100 (lower pos = higher score)
 * DNF Penalty        5%        (1 - DNF count / races entered) × 100
 */

export function calculateApexScore(stats, maxPointsInSeason, totalSharedRaces, totalSharedQuali) {
  if (!stats) return 0;

  const {
    points = 0,
    racesAhead = 0,
    qualiAhead = 0,
    podiums = 0,
    racesStarted = 0,
    pointsFinishes = 0,
    avgFinish = 20,
    dnfs = 0,
  } = stats;

  const safeDiv = (num, den) => (den === 0 ? 0 : num / den);

  const scorePts = safeDiv(points, maxPointsInSeason || 1) * 100;
  const scoreRaceH2H = safeDiv(racesAhead, totalSharedRaces || 1) * 100;
  const scoreQualiH2H = safeDiv(qualiAhead, totalSharedQuali || 1) * 100;
  const scorePodium = safeDiv(podiums, racesStarted || 1) * 100;
  const scorePointsFinish = safeDiv(pointsFinishes, racesStarted || 1) * 100;
  
  // Inverse finish position: 1st = 100%, 20th = 0%
  const clampedAvg = Math.max(1, Math.min(20, avgFinish));
  const scoreAvgFinish = ((20 - clampedAvg) / 19) * 100;

  const scoreDnf = (1 - safeDiv(dnfs, racesStarted || 1)) * 100;

  const weightedTotal = 
    (scorePts * 0.25) +
    (scoreRaceH2H * 0.20) +
    (scoreQualiH2H * 0.20) +
    (scorePodium * 0.15) +
    (scorePointsFinish * 0.10) +
    (scoreAvgFinish * 0.05) +
    (scoreDnf * 0.05);

  return Math.min(100, Math.max(0, Math.round(weightedTotal)));
}
