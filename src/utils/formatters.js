export const formatGap = (gapString) => {
  if (!gapString) return '';
  if (gapString === '0' || gapString === 0) return 'LEADER';
  if (typeof gapString === 'string' && gapString.startsWith('+')) return gapString;
  return `+${gapString}`;
};

export const formatTime = (timeInSeconds) => {
  if (!timeInSeconds) return '--:--.---';
  const mins = Math.floor(timeInSeconds / 60);
  const secs = Math.floor(timeInSeconds % 60);
  const ms = Math.floor((timeInSeconds % 1) * 1000);
  
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
  return `${secs}.${ms.toString().padStart(3, '0')}`;
};
