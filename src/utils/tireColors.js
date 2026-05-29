export const tireColors = {
  soft: '#E8002D',
  medium: '#FFD12E',
  hard: '#FFFFFF',
  intermediate: '#39B54A',
  wet: '#00AEEF',
};

export const getTireColor = (compound) => {
  return tireColors[compound?.toLowerCase()] || '#9CA3AF';
};
