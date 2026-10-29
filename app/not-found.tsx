import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full paper-card p-8 sm:p-12 text-center relative overflow-hidden shadow-polaroid">
        <WashiTape color="rose" tilt={-3} className="absolute -top-3 left-1/2 -translate-x-1/2" />

        {/* 404 Lost Page Editorial Illustration (S02) */}
        <div className="relative aspect-[3/2] w-full max-w-sm mx-auto mb-6 rounded-xl overflow-hidden border border-paper-border/80 shadow-sm bg-paper-blush/30">
          <Image
            src="/images/errors/404-lost-page.webp"
            alt="An open vintage book with a loose page, small pressed flowers, and a brass compass"
            fill
            sizes="(max-width: 640px) 85vw, 380px"
            className="object-cover"
          />
        </div>

        {/* 404 Number */}
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-brown-deep dark:text-night-text tracking-tight">
          404
        </h1>

        {/* Handwritten Message */}
        <p className="font-handwriting text-2xl text-brown-muted dark:text-rose-dusty mt-2 mb-6">
          This page seems to have wandered off. ♡
        </p>

        <p className="text-sm text-brown-dark/75 dark:text-night-muted mb-8 leading-relaxed">
          The reflection or path you were looking for doesn't exist here. Perhaps it found a new chapter.
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg font-sans font-medium text-sm hover:bg-rose-deep transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
