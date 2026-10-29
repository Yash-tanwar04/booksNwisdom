'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-paper/60 border border-paper-border/60 ${className}`} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={`relative w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/80 dark:bg-night-surface hover:bg-paper-blush/40 dark:hover:bg-night-card text-brown-deep dark:text-night-text transition-all duration-200 shadow-sm ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-200 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-brown-deep transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
