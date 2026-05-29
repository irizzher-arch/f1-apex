import React from 'react';
import { TRACK_IMAGES } from '@/utils/assets';

export const TrackSVG = ({ circuitId, className = "" }) => {
  // Use the official scraped image if it exists, otherwise fallback to Bahrain as a default
  const imageSrc = TRACK_IMAGES[circuitId] || TRACK_IMAGES['bahrain'];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 
        We apply a CSS filter to the official track layout image to make it fit our aesthetic.
        Usually the F1 images are white or dark grey maps. We invert them and drop a red shadow.
      */}
      <img 
        src={imageSrc} 
        alt={`Circuit map for ${circuitId}`}
        className="w-full h-full object-contain"
        style={{
          filter: 'invert(1) drop-shadow(0 0 10px rgba(232, 0, 45, 0.8)) hue-rotate(140deg)',
          opacity: 0.9
        }}
      />
    </div>
  );
};
