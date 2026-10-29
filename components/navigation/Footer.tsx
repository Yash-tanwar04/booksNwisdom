'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Mail, Heart, Rss } from 'lucide-react';
import { BookLogo } from '../decorations/BookLogo';
import { TornPaper } from '../decorations/TornPaper';
import { WaxSealBadge, BackToTopButton } from '../decorations/ScrapbookDetails';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <BackToTopButton />
      <footer className="relative mt-20 bg-paper-cream dark:bg-night-surface border-t border-paper-border/80 dark:border-night-border transition-colors">
        <TornPaper position="top" className="absolute -top-3 left-0 right-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-paper-border/60 dark:border-night-border/60 text-center md:text-left">
            {/* Logo & Description */}
            <div className="max-w-md flex flex-col items-center md:items-start">
              <BookLogo />
              <p className="mt-3.5 text-sm text-brown-muted dark:text-night-muted leading-relaxed">
                A quiet space for real thoughts, personal journeys, and meaningful reflections on life, growth, and everything in between.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-brown-dark/80 dark:text-night-text/80">
              <Link href="/" className="hover:text-rose-muted transition-colors link-editorial">
                Home
              </Link>
              <Link href="/writings" className="hover:text-rose-muted transition-colors link-editorial">
                All Writings
              </Link>
              <Link href="/about" className="hover:text-rose-muted transition-colors link-editorial">
                About
              </Link>
              <Link href="/privacy" className="hover:text-rose-muted transition-colors link-editorial">
                Privacy Policy
              </Link>
              <Link href="/rss.xml" className="hover:text-rose-muted transition-colors flex items-center gap-1 link-editorial">
                <Rss className="w-3.5 h-3.5 text-rose-muted" />
                <span>RSS</span>
              </Link>
            </div>

            {/* Social Icons & Mini Wax Seal */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush/60 hover:-translate-y-0.5 text-brown-deep dark:text-night-text transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush/60 hover:-translate-y-0.5 text-brown-deep dark:text-night-text transition-all shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:hello@booksandwisdom.com"
                  aria-label="Email"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border/80 dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush/60 hover:-translate-y-0.5 text-brown-deep dark:text-night-text transition-all shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              <div className="hidden lg:block">
                <WaxSealBadge size={54} />
              </div>
            </div>
          </div>

          {/* Bottom Bar with Handwritten Signoff & Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brown-muted dark:text-night-muted">
            <div className="flex items-center gap-2">
              <span>© {currentYear} Books&Wisdom. All rights reserved.</span>
              <span>·</span>
              <Link href="/admin/login" className="hover:underline opacity-60 hover:opacity-100">
                Admin Studio
              </Link>
            </div>

            <div className="flex items-center gap-2 font-handwriting text-lg text-brown-deep dark:text-rose-dusty">
              <span>Good Thoughts, Brighter Days</span>
              <Heart className="w-3.5 h-3.5 fill-rose-muted text-rose-muted inline animate-pulse" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
