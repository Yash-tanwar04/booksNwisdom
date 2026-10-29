'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { FloralAccent } from '../decorations/FloralAccent';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/articles?search=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.articles || []);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-brown-dark/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-paper-cream dark:bg-night-surface rounded-2xl border border-paper-border dark:border-night-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-paper-border/70 dark:border-night-border/70 bg-paper/50 dark:bg-night-bg/50">
          <Search className="w-5 h-5 text-brown-muted dark:text-night-muted mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search writings, thoughts, and reflections..."
            className="w-full bg-transparent text-brown-dark dark:text-night-text placeholder:text-brown-muted/60 dark:placeholder:text-night-muted/60 text-base sm:text-lg outline-none font-sans"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-brown-muted hover:text-brown-dark dark:hover:text-night-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs uppercase tracking-wider font-medium text-brown-muted hover:text-brown-dark dark:hover:text-night-text"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {query.trim() && (
            <div className="flex items-center justify-between text-xs text-brown-muted dark:text-night-muted pb-2 border-b border-paper-border/40">
              <span>{loading ? 'Searching...' : `${results.length} result${results.length === 1 ? '' : 's'} found`}</span>
              {results.length > 0 && <span className="font-handwriting text-sm">happy reading ♡</span>}
            </div>
          )}

          {results.map((article) => (
            <Link
              key={article.id}
              href={`/writings/${article.slug}`}
              onClick={onClose}
              className="group flex gap-4 p-3 rounded-xl border border-transparent hover:border-paper-border/70 hover:bg-paper/60 dark:hover:bg-night-card transition-all"
            >
              {article.cover_image_path ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-paper-blush/30 border border-paper-border/50">
                  <Image
                    src={article.cover_image_path}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-paper-blush/40 dark:bg-night-card flex items-center justify-center flex-shrink-0 text-rose-muted">
                  <FloralAccent size={24} variant="branch" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[12px] text-brown-muted dark:text-night-muted mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.reading_time_minutes} min read
                  </span>
                </div>

                <h4 className="font-serif text-base sm:text-lg font-semibold text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors line-clamp-1">
                  {article.title}
                </h4>

                <p className="text-xs sm:text-sm text-brown-muted dark:text-night-muted line-clamp-2 mt-0.5">
                  {article.excerpt}
                </p>
              </div>

              <div className="hidden sm:flex items-center self-center text-rose-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}

          {!loading && query.trim() && results.length === 0 && (
            <div className="text-center py-8">
              <div className="relative w-40 h-28 mx-auto mb-3 rounded-xl overflow-hidden border border-paper-border/60 shadow-sm">
                <Image
                  src="/images/search/search-empty.webp"
                  alt="Magnifying glass beside an open book and dried flowers"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <p className="font-serif text-lg text-brown-deep dark:text-night-text">No reflections found</p>
              <p className="text-sm text-brown-muted dark:text-night-muted mt-1 font-handwriting text-base">
                Try searching for “growth”, “perspective”, or “journey” ♡
              </p>
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-8 text-brown-muted dark:text-night-muted">
              <FloralAccent size={32} variant="branch" className="mx-auto mb-2 opacity-50" />
              <p className="font-serif text-base text-brown-deep dark:text-night-text">Search Books&Wisdom</p>
              <p className="text-xs mt-1">Type keywords to search through all published writings and reflections.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
