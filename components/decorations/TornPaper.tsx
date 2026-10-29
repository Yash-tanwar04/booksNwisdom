import React from 'react';

interface TornPaperProps {
  position?: 'top' | 'bottom';
  className?: string;
  fillColor?: string; // defaults to paper cream
}

export function TornPaper({ position = 'top', className = '', fillColor }: TornPaperProps) {
  const isBottom = position === 'bottom';

  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}
      style={{
        transform: isBottom ? 'rotate(180deg)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 1200 30"
        preserveAspectRatio="none"
        className="w-full h-4 sm:h-6 text-paper-cream dark:text-night-surface fill-current"
      >
        <path d="M0,0 L0,15 Q30,18 60,14 Q90,26 120,18 Q150,12 180,22 Q210,16 240,25 Q270,12 300,19 Q330,24 360,16 Q390,13 420,23 Q450,19 480,14 Q510,26 540,16 Q570,12 600,24 Q630,17 660,15 Q690,27 720,18 Q750,13 780,22 Q810,16 840,25 Q870,14 900,20 Q930,26 960,16 Q990,12 1020,24 Q1050,17 1080,15 Q1110,26 1140,18 Q1170,13 1200,22 L1200,0 Z" />
      </svg>
    </div>
  );
}
