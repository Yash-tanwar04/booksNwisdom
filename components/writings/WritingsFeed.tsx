'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Search, X, Loader2 } from 'lucide-react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { FloralAccent } from '@/components/decorations/FloralAccent';
import { StaggerContainer, StaggerItem } from '@/components/animations/Reveal';

interface WritingsFeedProps {
  initialArticles: Article[];
  totalCount: number;
}

export function WritingsFeed({ initialArticles, totalCount }: WritingsFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(initialArticles.length);
  const [hasMore, setHasMore] = useState(initialArticles.length < totalCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/articles?search=${encodeURIComponent(val.trim())}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
          setOffset(data.articles.length);
          setHasMore(data.articles.length < data.total);
        }
      } catch (err) {
        console.error('Failed to filter articles', err);
      }
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    startTransition(async () => {
      try {
        const res = await fetch(`/api/articles?limit=6`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
          setOffset(data.articles.length);
          setHasMore(data.articles.length < data.total);
        }
      } catch (err) {
        console.error('Failed to reset search', err);
      }
    });
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(
        `/api/articles?search=${encodeURIComponent(search.trim())}&offset=${offset}&limit=6`
      );
      if (res.ok) {
        const data = await res.json();
        const nextArticles: Article[] = data.articles || [];
        setArticles((prev) => [...prev, ...nextArticles]);
        const newOffset = offset + nextArticles.length;
        setOffset(newOffset);
        setHasMore(newOffset < data.total);
      }
    } catch (err) {
      console.error('Failed to load more articles', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto relative">
        <div className="relative flex items-center bg-paper-cream dark:bg-night-surface border border-paper-border dark:border-night-border rounded-full px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-rose-muted/50 transition-all">
          <Search className="w-5 h-5 text-brown-muted dark:text-night-muted mr-3 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search writings..."
            className="w-full bg-transparent text-brown-deep dark:text-night-text placeholder:text-brown-muted/60 dark:placeholder:text-night-muted/60 outline-none font-sans text-sm sm:text-base"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="p-1 rounded-full text-brown-muted hover:text-brown-deep dark:hover:text-night-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid (3 columns on desktop, 1 on mobile) */}
      {articles.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <StaggerItem key={article.id}>
              <ArticleCard
                article={article}
                withTape={true}
                index={idx}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-16 paper-card max-w-md mx-auto p-8">
          <div className="relative w-48 h-36 mx-auto mb-4 rounded-xl overflow-hidden border border-paper-border/60 shadow-sm">
            <Image
              src="/images/search/search-empty.webp"
              alt="Magnifying glass beside an open book and dried flowers"
              fill
              sizes="192px"
              className="object-cover"
            />
          </div>
          <h3 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text">
            No writings found
          </h3>
          <p className="mt-2 text-sm text-brown-muted dark:text-night-muted">
            {search ? `No results matching "${search}". Try searching another phrase.` : 'Check back soon for new reflections.'}
          </p>
          {search && (
            <button
              onClick={handleClearSearch}
              className="mt-4 px-5 py-2 rounded-full bg-paper-blush text-brown-deep font-sans text-xs font-semibold hover:bg-rose-dusty/50 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-paper-cream dark:bg-night-surface border border-paper-border dark:border-night-border text-brown-deep dark:text-night-text font-serif text-base font-semibold shadow-sm hover:shadow hover:bg-paper-blush/40 dark:hover:bg-night-card transition-all disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-muted" />
                <span>Loading more reflections...</span>
              </>
            ) : (
              <span>Load More Writings ↓</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
