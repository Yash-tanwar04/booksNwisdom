import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { WashiTape } from '../decorations/WashiTape';
import { FloralAccent } from '../decorations/FloralAccent';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  withTape?: boolean;
  index?: number;
}

export function ArticleCard({
  article,
  featured = false,
  withTape = false,
  index = 0,
}: ArticleCardProps) {
  const publishedDate = formatDate(article.published_at || article.created_at);
  const tapeColors: Array<'rose' | 'sage' | 'cream' | 'blush'> = ['rose', 'sage', 'cream', 'blush'];
  const tapeColor = tapeColors[index % tapeColors.length];
  const tapeTilt = index % 2 === 0 ? -2.5 : 2;

  return (
    <article className="group relative flex flex-col paper-card overflow-visible hover:shadow-polaroid transition-all duration-500 transform hover:-translate-y-1.5">
      {withTape && (
        <WashiTape
          color={tapeColor}
          tilt={tapeTilt}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        />
      )}

      {/* Subtle Bookmark Ribbon Tag on Hover */}
      <div className="absolute -top-1 right-5 z-20 w-5 h-8 bg-rose-muted/90 text-paper-cream rounded-b-sm shadow-sm flex items-end justify-center pb-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
        <BookOpen className="w-3 h-3" />
      </div>

      {/* Cover Image Container */}
      <Link
        href={`/writings/${article.slug}`}
        className="block relative aspect-[16/10] overflow-hidden rounded-t-[15px] bg-paper-blush/30 border-b border-paper-border/60"
      >
        {article.cover_image_path ? (
          <>
            <Image
              src={article.cover_image_path}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-paper-cream dark:bg-night-card">
            <FloralAccent size={48} variant="branch" className="opacity-40 mb-2" />
            <span className="font-serif text-sm text-brown-muted dark:text-night-muted italic">
              Books&Wisdom reflection
            </span>
          </div>
        )}

        {/* Reading Time Badge Floating on Image Corner */}
        <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-full bg-paper-cream/90 dark:bg-night-bg/90 backdrop-blur-sm border border-paper-border/70 text-[11px] font-medium text-brown-deep dark:text-night-text flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-rose-muted" />
          <span>{article.reading_time_minutes} min read</span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Publication Date */}
          <div className="flex items-center justify-between text-xs text-brown-muted dark:text-night-muted mb-2 font-medium tracking-wide">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-muted" />
              {publishedDate}
            </span>
            <span className="font-handwriting text-sm text-rose-muted/80 opacity-0 group-hover:opacity-100 transition-opacity">
              journal entry ♡
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl sm:text-[22px] font-bold text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors leading-snug line-clamp-2">
            <Link href={`/writings/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-2.5 text-sm text-brown-dark/75 dark:text-night-muted leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        {/* Read More link */}
        <Link
          href={`/writings/${article.slug}`}
          className="mt-5 pt-3.5 border-t border-paper-border/50 dark:border-night-border/50 flex items-center justify-between text-xs font-semibold text-rose-muted dark:text-rose-dusty group-hover:text-brown-deep dark:group-hover:text-night-text transition-colors"
        >
          <span className="font-serif tracking-wide">Read Reflection</span>
          <span className="w-6 h-6 rounded-full bg-paper-blush/60 dark:bg-night-card flex items-center justify-center group-hover:bg-rose-muted group-hover:text-white transition-all duration-300">
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>
    </article>
  );
}
