import React from 'react';

interface FloralAccentProps {
  variant?: 'branch' | 'single' | 'sparkle' | 'corner' | 'butterfly';
  className?: string;
  size?: number;
}

export function FloralAccent({ variant = 'branch', className = '', size = 32 }: FloralAccentProps) {
  if (variant === 'sparkle') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-rose-dusty dark:text-rose-muted ${className}`}
      >
        <path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6" opacity="0.35" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'butterfly') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="currentColor"
        className={`text-rose-muted/80 dark:text-rose-dusty/80 ${className}`}
      >
        <path d="M16 15c-1-3-4-7-8-6-4 1-5 6-3 9 2 3 6 4 10 1-1 3-2 6 0 8 3 2 6-1 6-5 0-3-1-5-5-7z" opacity="0.85" />
        <path d="M16 15c1-3 4-7 8-6 4 1 5 6 3 9-2 3-6 4-10 1 1 3 2 6 0 8-3 2-6-1-6-5 0-3 1-5 5-7z" opacity="0.75" />
        <line x1="16" y1="12" x2="16" y2="24" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  // Botanical branch
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-rose-muted/70 dark:text-rose-dusty/70 ${className}`}
    >
      {/* Delicate Curved Stem */}
      <path d="M8 56 Q 32 40 56 12" />
      {/* Leaves */}
      <path d="M22 47 C 18 42, 20 34, 26 38 C 24 43, 23 45, 22 47" fill="currentColor" fillOpacity="0.25" />
      <path d="M34 38 C 40 33, 44 38, 38 43 C 35 41, 34 39, 34 38" fill="currentColor" fillOpacity="0.25" />
      <path d="M44 28 C 42 21, 49 22, 47 28 C 45 28, 44 28, 44 28" fill="currentColor" fillOpacity="0.25" />
      {/* Blossom petals */}
      <circle cx="56" cy="12" r="3" fill="#D8A5A0" stroke="none" />
      <circle cx="52" cy="16" r="2.5" fill="#F3E1DC" stroke="none" />
      <circle cx="60" cy="15" r="2" fill="#D8A5A0" stroke="none" />
    </svg>
  );
}
