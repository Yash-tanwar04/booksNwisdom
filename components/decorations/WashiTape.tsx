import React from 'react';

interface WashiTapeProps {
  color?: 'rose' | 'cream' | 'sage' | 'blush';
  tilt?: number; // degrees, e.g. -3, 2, 4
  width?: string;
  className?: string;
}

export function WashiTape({
  color = 'rose',
  tilt = -2,
  width = 'w-24 sm:w-28',
  className = '',
}: WashiTapeProps) {
  const colorStyles = {
    rose: 'bg-[#D8A5A0]/50 dark:bg-[#D8A5A0]/40 text-[#B87873]',
    cream: 'bg-[#FFF9F3]/80 dark:bg-[#382D29]/70 text-[#88756D]',
    sage: 'bg-[#A7B29E]/50 dark:bg-[#A7B29E]/40 text-[#849079]',
    blush: 'bg-[#F3E1DC]/70 dark:bg-[#F3E1DC]/30 text-[#B87873]',
  };

  return (
    <div
      className={`h-6 ${width} ${colorStyles[color]} backdrop-blur-[1px] shadow-sm z-20 pointer-events-none ${className}`}
      style={{
        transform: `rotate(${tilt}deg)`,
        clipPath: 'polygon(0% 0%, 98% 2%, 100% 98%, 2% 100%)',
        borderLeft: '1.5px dashed rgba(255,255,255,0.4)',
        borderRight: '1.5px dashed rgba(255,255,255,0.4)',
      }}
    />
  );
}
