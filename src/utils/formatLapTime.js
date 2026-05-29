/**
 * Formats lap time in seconds (e.g. 85.342) or "1:25.342" string to "1:MM.sss" or standard output.
 */
export function formatLapTime(timeInput) {
  if (!timeInput) return '—';
  
  // If it's already a string like "1:25.342", return it or parse it
  if (typeof timeInput === 'string' && timeInput.includes(':')) {
    return timeInput;
  }

  const secondsTotal = parseFloat(timeInput);
  if (isNaN(secondsTotal)) return '—';

  const mins = Math.floor(secondsTotal / 60);
  const secs = (secondsTotal % 60).toFixed(3);
  
  return mins > 0 
    ? `${mins}:${secs.padStart(6, '0')}`
    : secs;
}

/**
 * Parses "1:25.342" into milliseconds
 */
export function parseLapTimeToMs(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseFloat(parts[1]);
    return Math.round((mins * 60 + secs) * 1000);
  }
  return Math.round(parseFloat(timeStr) * 1000);
}
