import React from 'react';
import type { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/db';
import { WritingsFeed } from '@/components/writings/WritingsFeed';
import { FloralAccent } from '@/components/decorations/FloralAccent';
import { WashiTape } from '@/components/decorations/WashiTape';
import { PressedBotanical, PostmarkStamp } from '@/components/decorations/ScrapbookDetails';
import { FadeInUp } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'All Writings — Books&Wisdom',
  description: 'Thoughts, experiences, and reflections — collected in one place.',
};

export const revalidate = 60;

export default async function AllWritingsPage() {
  const { articles, total } = await getPublishedArticles({ limit: 6 });

  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Subtle Ambient Background Botanicals */}
      <div className="pointer-events-none absolute top-14 left-8 opacity-45 hidden lg:block">
        <PressedBotanical variant="eucalyptus" size={76} />
      </div>
      <div className="pointer-events-none absolute top-20 right-10 opacity-45 hidden lg:block">
        <PressedBotanical variant="lavender" size={72} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <FadeInUp className="text-center max-w-2xl mx-auto mb-14 relative">
          <WashiTape color="rose" tilt={-2} className="absolute -top-6 left-1/2 -translate-x-1/2" />
          
          <div className="inline-flex items-center gap-2 text-rose-muted mb-2 pt-2">
            <FloralAccent size={22} variant="branch" />
            <span className="font-handwriting text-xl text-brown-muted dark:text-night-muted">
              collected journal entries
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-deep dark:text-night-text tracking-tight">
            All Writings
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-brown-muted dark:text-night-muted font-sans leading-relaxed">
            Thoughts, experiences, and reflections — collected in one place.
          </p>

          <div className="mt-4 flex justify-center">
            <PostmarkStamp dateText={`${total} ESSAYS`} locationText="COMPLETE ARCHIVE" />
          </div>
        </FadeInUp>

        {/* Writings Feed Component */}
        <WritingsFeed initialArticles={articles} totalCount={total} />

      </div>
    </div>
  );
}
