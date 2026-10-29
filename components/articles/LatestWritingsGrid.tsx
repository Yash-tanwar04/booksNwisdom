'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';
import { StaggerContainer, StaggerItem } from '../animations/Reveal';
import { FloralAccent } from '../decorations/FloralAccent';

interface LatestWritingsGridProps {
  initialArticles: Article[];
}

export function LatestWritingsGrid({ initialArticles }: LatestWritingsGridProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  // Sync when initialArticles change from server
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // Background fetch to guarantee freshly published blogs show immediately even if cached by CDN
  useEffect(() => {
    let active = true;
    fetch('/api/articles?limit=4', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 paper-card p-8 max-w-lg mx-auto">
        <FloralAccent size={48} variant="branch" className="mx-auto mb-3 opacity-60" />
        <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text">
          A quiet space waiting for words
        </h3>
        <p className="mt-2 text-sm text-brown-muted dark:text-night-muted">
          No writings have been published yet. Check back soon for heartfelt reflections.
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
  );
}
