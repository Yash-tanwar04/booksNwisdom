'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, BookOpen } from 'lucide-react';
import { BookLogo } from '../decorations/BookLogo';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from '../search/SearchModal';
import { WashiTape } from '../decorations/WashiTape';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Don't render public navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/writings', label: 'All Writings' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-paper/90 dark:bg-night-bg/90 border-b border-paper-border/60 dark:border-night-border/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <BookLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-sans text-[15px] font-medium transition-colors py-1 ${
                    isActive
                      ? 'text-rose-muted dark:text-rose-dusty font-semibold'
                      : 'text-brown-dark/80 dark:text-night-text/80 hover:text-brown-dark dark:hover:text-night-text'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-rose-muted/80 dark:bg-rose-dusty rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Actions: Search & Theme Toggle */}
            <div className="flex items-center gap-3 pl-2 border-l border-paper-border/70 dark:border-night-border/70">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search writings"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/80 dark:bg-night-surface hover:bg-paper-blush/40 dark:hover:bg-night-card text-brown-deep dark:text-night-text transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>

              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search writings"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/80 dark:bg-night-surface text-brown-deep dark:text-night-text"
            >
              <Search className="w-4 h-4" />
            </button>

            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/80 dark:bg-night-surface text-brown-deep dark:text-night-text"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-paper-border/80 dark:border-night-border bg-paper-cream dark:bg-night-surface px-6 py-6 space-y-4 shadow-lg animate-fade-in relative">
            <WashiTape color="rose" tilt={2} className="absolute -top-3 right-8" />
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-serif text-lg py-2 border-b border-paper-border/40 dark:border-night-border/40 transition-colors flex items-center justify-between ${
                      isActive
                        ? 'text-rose-muted dark:text-rose-dusty font-semibold'
                        : 'text-brown-deep dark:text-night-text'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="font-handwriting text-sm">here ♡</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
