'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, PenTool, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '../navigation/ThemeToggle';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({ onToggleSidebar, title, subtitle }: AdminHeaderProps) {
  return (
    <header className="h-16 lg:h-20 bg-paper-cream dark:bg-night-surface border-b border-paper-border/80 dark:border-night-border px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-brown-deep dark:text-night-text hover:bg-paper-blush/50"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title && (
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-brown-deep dark:text-night-text leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-brown-muted dark:text-night-muted hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/writings/new"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B87873] hover:bg-[#A25F5A] text-white text-xs sm:text-sm font-medium shadow-sm transition-all"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Write a Blog</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
