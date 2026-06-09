export const calculateMedian = (arr) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const calculateMean = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const calculateIQR = (arr) => {
  if (arr.length < 4) return { q1: 0, q3: 0, iqr: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = sorted.length % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);
  const q1 = calculateMedian(lowerHalf);
  const q3 = calculateMedian(upperHalf);
  return { q1, q3, iqr: q3 - q1 };
};

export const calculateConsistencyScore = (arr) => {
  if (arr.length < 2) return 50;
  const mean = calculateMean(arr);
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  const stdDev = Math.sqrt(variance);
  let score = 100 - (stdDev * 20);
  return Math.max(0, Math.min(100, score));
};
