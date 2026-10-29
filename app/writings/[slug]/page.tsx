import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ChevronRight, Heart, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { getArticleBySlug, getPublishedArticles, getSiteSettings } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ReadingProgress } from '@/components/articles/ReadingProgress';
import { ShareButtons } from '@/components/articles/ShareButtons';
import { ArticleRenderer } from '@/components/articles/ArticleRenderer';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';
import { WaxSealBadge, PostmarkStamp } from '@/components/decorations/ScrapbookDetails';
import { FadeInUp } from '@/components/animations/Reveal';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: 'Article Not Found — Books&Wisdom',
    };
  }

  const title = article.seo_title || `${article.title} — Books&Wisdom`;
  const description = article.seo_description || article.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: article.cover_image_path ? [article.cover_image_path] : ['/images/banner_polaroid_tape.png'],
      type: 'article',
      publishedTime: article.published_at || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const settings = await getSiteSettings();
  const { articles: allPublished } = await getPublishedArticles({ limit: 8 });

  // Filter out current article for "More Writings"
  const moreWritings = allPublished.filter((a) => a.id !== article.id).slice(0, 3);

  // Find previous and next articles
  const currentIndex = allPublished.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allPublished[currentIndex - 1] : null;
  const nextArticle = currentIndex < allPublished.length - 1 ? allPublished[currentIndex + 1] : null;

  // Extract table of contents headings from TipTap content if available
  const headings: { title: string; id: string }[] = [];
  if (article.content && Array.isArray(article.content.content)) {
    article.content.content.forEach((node: any) => {
      if (node.type === 'heading' && node.content) {
        const text = node.content.map((c: any) => c.text || '').join('');
        if (text) {
          const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
          headings.push({ title: text, id });
        }
      }
    });
  }

  return (
    <article className="min-h-screen py-10 sm:py-16 relative">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgress />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-brown-muted dark:text-night-muted mb-8 font-sans">
          <Link href="/" className="hover:text-brown-deep dark:hover:text-night-text transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/writings" className="hover:text-brown-deep dark:hover:text-night-text transition-colors">
            All Writings
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brown-deep dark:text-night-text font-medium truncate max-w-[200px] sm:max-w-xs">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center mb-10 space-y-4">
          {/* Metadata: Date and Reading Time */}
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-brown-muted dark:text-night-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-muted" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-muted" />
              {article.reading_time_minutes} min read
            </span>
          </div>

          {/* Large Serif Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-deep dark:text-night-text leading-[1.15] tracking-tight">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="font-serif text-lg sm:text-xl text-brown-muted dark:text-night-muted italic max-w-2xl mx-auto leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author Bar & Share Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 border-y border-paper-border/60 dark:border-night-border/60 py-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-paper-border/80">
                <Image
                  src={settings.author_image_url || '/images/author_photo.jpg'}
                  alt={settings.author_name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-brown-deep dark:text-night-text">
                By {settings.author_name}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-paper-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-brown-muted mr-1 font-sans">Share</span>
              <ShareButtons title={article.title} />
            </div>
          </div>
        </header>

        {/* Hero Cover Image (Polaroid Style with Washi Tape) */}
        {article.cover_image_path && (
          <div className="max-w-4xl mx-auto mb-14 relative">
            <div className="polaroid-frame relative">
              <WashiTape color="rose" tilt={-3} className="absolute -top-3 left-12" />
              <WashiTape color="cream" tilt={2} className="absolute -top-3 right-12" />

              <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-paper-blush/30">
                <Image
                  src={article.cover_image_path}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Scrapbook Note Ribbon Under Cover */}
              <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-brown-muted dark:text-night-muted px-2">
                <span className="font-handwriting text-lg text-brown-deep dark:text-rose-dusty">
                  A chapter from the heart ♡
                </span>
                <span className="flex items-center gap-1 font-serif italic">
                  Books&Wisdom reflective journal
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout (Desktop split with TOC sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Main Reading Column */}
          <div className="lg:col-span-8 min-w-0">
            <ArticleRenderer content={article.content} />

            {/* Bottom Callout Ribbon */}
            <FadeInUp className="my-14 p-6 sm:p-10 rounded-2xl bg-paper-blush/45 dark:bg-night-card border border-paper-border dark:border-night-border relative text-center notebook-paper shadow-scrapbook">
              <WashiTape color="sage" tilt={-1} className="absolute -top-3 left-1/2 -translate-x-1/2 w-28" />
              <div className="flex justify-center mb-3">
                <WaxSealBadge size={62} />
              </div>
              <p className="font-serif text-lg sm:text-2xl text-brown-deep dark:text-night-text italic max-w-xl mx-auto">
                “Healing begins the moment we choose to be kind to ourselves.”
              </p>
              <p className="font-handwriting text-lg text-brown-muted dark:text-rose-dusty mt-2">
                gentle reminders for quiet souls ♡
              </p>
            </FadeInUp>

            {/* Previous / Next Article Navigation */}
            <div className="border-t border-paper-border/80 dark:border-night-border pt-8 mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={`/writings/${prevArticle.slug}`}
                  className="paper-card p-4 hover:border-rose-muted transition-colors group flex flex-col justify-between"
                >
                  <span className="text-xs text-brown-muted flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Reflection
                  </span>
                  <span className="font-serif text-base font-semibold text-brown-deep dark:text-night-text group-hover:text-rose-muted line-clamp-1">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : <div />}

              {nextArticle && (
                <Link
                  href={`/writings/${nextArticle.slug}`}
                  className="paper-card p-4 hover:border-rose-muted transition-colors group flex flex-col justify-between text-right"
                >
                  <span className="text-xs text-brown-muted flex items-center justify-end gap-1 mb-1">
                    Next Reflection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-serif text-base font-semibold text-brown-deep dark:text-night-text group-hover:text-rose-muted line-clamp-1">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              
              {/* Table of Contents ("On This Page") */}
              {headings.length > 0 && (
                <div className="paper-card p-5">
                  <h3 className="font-serif text-base font-bold text-brown-deep dark:text-night-text pb-2 border-b border-paper-border/60 flex items-center justify-between">
                    <span>On This Page</span>
                    <FloralAccent size={18} variant="sparkle" />
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {headings.map((h, i) => (
                      <li key={i}>
                        <a
                          href={`#${h.id}`}
                          className="text-brown-muted dark:text-night-muted hover:text-rose-muted dark:hover:text-rose-dusty transition-colors line-clamp-1"
                        >
                          {h.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share This Post */}
              <div className="paper-card p-5">
                <h3 className="font-serif text-base font-bold text-brown-deep dark:text-night-text pb-2 border-b border-paper-border/60">
                  Share This Post
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <ShareButtons title={article.title} />
                </div>
              </div>

              {/* More Writings */}
              {moreWritings.length > 0 && (
                <div className="paper-card p-5 space-y-4">
                  <h3 className="font-serif text-base font-bold text-brown-deep dark:text-night-text pb-2 border-b border-paper-border/60 flex items-center justify-between">
                    <span>More Writings</span>
                    <Link href="/writings" className="text-xs text-rose-muted font-sans font-normal hover:underline">
                      view all
                    </Link>
                  </h3>
                  <div className="space-y-3.5">
                    {moreWritings.map((more) => (
                      <Link
                        key={more.id}
                        href={`/writings/${more.slug}`}
                        className="group flex gap-3 items-center"
                      >
                        {more.cover_image_path ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-paper-blush/30 border border-paper-border/50">
                            <Image
                              src={more.cover_image_path}
                              alt={more.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-semibold text-brown-deep dark:text-night-text group-hover:text-rose-muted line-clamp-1 transition-colors">
                            {more.title}
                          </h4>
                          <span className="text-xs text-brown-muted dark:text-night-muted">
                            {formatDate(more.published_at)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}
