import React from 'react';

const getSegmentColor = (status) => {
  switch (status) {
    case 2048: return 'bg-[#FFD700]'; // Yellow
    case 2049: return 'bg-[#00C853]'; // Green (PB)
    case 2051: return 'bg-[#9C27B0]'; // Purple (Overall Best)
    case 2052: return 'bg-white/10 border border-white/20'; // Pit
    default: return 'bg-white/5';     // Not set
  }
};

export const MiniSectorStrip = ({ lap }) => {
  if (!lap) return null;

  const s1 = lap.segments_sector_1 || [];
  const s2 = lap.segments_sector_2 || [];
  const s3 = lap.segments_sector_3 || [];

  const renderGroup = (segments, label) => {
    if (!segments || segments.length === 0) {
      return <div className="flex gap-[1px] opacity-20"><div className="w-2 h-[4px] bg-white/20" /></div>;
    }
    return (
      <div className="flex gap-[2px]">
        {segments.map((status, i) => (
          <div key={`${label}-${i}`} className={`w-2.5 h-[5px] rounded-[1px] ${getSegmentColor(status)}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex items-center gap-3">
      {renderGroup(s1, 's1')}
      {renderGroup(s2, 's2')}
      {renderGroup(s3, 's3')}
    </div>
  );
};
