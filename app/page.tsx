import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Feather, Sparkles } from 'lucide-react';
import { getPublishedArticles, getSiteSettings } from '@/lib/db';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';
import { TornPaper } from '@/components/decorations/TornPaper';
import {
  WaxSealBadge,
  BrassPaperclip,
  PostmarkStamp,
  PressedBotanical,
} from '@/components/decorations/ScrapbookDetails';
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  TiltPolaroid,
} from '@/components/animations/Reveal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSiteSettings();
  const { articles } = await getPublishedArticles({ limit: 4 });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION (Split Scrapbook Hero with 3D Tactile Accents)
         ========================================================================= */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Soft Warm Sunlight Glow in Background */}
        <div className="pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full bg-rose-dusty/15 dark:bg-rose-muted/10 blur-3xl -z-10" />
        <div className="pointer-events-none absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-paper-blush/50 dark:bg-night-card/20 blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Content */}
            <FadeInUp className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
              {/* Handwritten Intro Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-paper-cream/90 dark:bg-night-card border border-paper-border dark:border-night-border shadow-sm text-brown-deep dark:text-rose-dusty">
                <Sparkles className="w-3.5 h-3.5 text-rose-muted animate-pulse" />
                <span className="font-handwriting text-lg sm:text-xl tracking-wide">
                  A little corner for thoughtful minds.
                </span>
              </div>

              {/* Main Headline */}
              <div className="relative">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tight text-brown-deep dark:text-night-text leading-[1.06]">
                  Books
                  <span className="font-serif italic font-normal text-rose-muted dark:text-rose-dusty px-1">
                    &
                  </span>
                  Wisdom
                </h1>
                {/* Subtle Handwritten Margin Annotation */}
                <span className="hidden sm:inline-block font-handwriting text-base text-rose-muted/85 dark:text-rose-dusty/80 rotate-[-4deg] mt-1">
                  — personal reflections, memories & quiet lessons ♡
                </span>
              </div>

              {/* Subheading / Supporting copy */}
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-brown-dark/85 dark:text-night-muted leading-relaxed font-sans">
                {settings.hero_subheading}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/writings"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg font-sans font-medium text-sm sm:text-base hover:bg-rose-deep dark:hover:bg-rose-dusty shadow-[0_8px_22px_-4px_rgba(89,65,59,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(184,120,115,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 group"
                >
                  <BookOpen className="w-4 h-4 opacity-85" />
                  <span>Explore Writings</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/about"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-paper-cream dark:bg-night-surface border border-paper-border dark:border-night-border text-brown-dark dark:text-night-text hover:bg-paper-blush/50 hover:border-rose-dusty text-sm sm:text-base font-sans font-medium transition-all duration-300 text-center shadow-sm"
                >
                  A little about me
                </Link>
              </div>

              {/* Vintage Postmark & Trust Detail */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6">
                <PostmarkStamp dateText="JOURNAL EST." locationText="BOOKS & WISDOM" />
                <div className="hidden sm:flex items-center gap-2 text-xs text-brown-muted dark:text-night-muted font-serif italic">
                  <Feather className="w-3.5 h-3.5 text-rose-muted" />
                  <span>Written from the heart, one page at a time</span>
                </div>
              </div>
            </FadeInUp>

            {/* Right Side: Editorial Polaroid Card with Washi Tape, Brass Paperclip & 3D Wax Seal */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* Pressed Botanical Accents Behind */}
                <div className="absolute -top-12 -right-8 pointer-events-none opacity-85 dark:opacity-65 z-0">
                  <PressedBotanical variant="rosebud" size={88} />
                </div>
                <div className="absolute -bottom-10 -left-10 pointer-events-none opacity-80 dark:opacity-55 z-0">
                  <PressedBotanical variant="eucalyptus" size={82} />
                </div>

                {/* 3D Embossed Wax Seal on Top-Left Corner */}
                <div className="absolute -top-7 -left-6 z-30 hidden sm:block">
                  <WaxSealBadge size={78} />
                </div>

                {/* Interactive Tilt Polaroid Frame */}
                <TiltPolaroid initialRotate={-1.5} className="polaroid-frame relative z-10">
                  <WashiTape color="rose" tilt={-4} className="absolute -top-3 left-10" />
                  <WashiTape color="sage" tilt={2.5} className="absolute -bottom-2.5 right-10" />

                  <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-sm overflow-hidden bg-paper-blush/40 shadow-inner">
                    <Image
                      src={settings.hero_image_url || '/images/homepage/homepage-hero.webp'}
                      alt="Cozy writing desk beside a window at golden hour with an open journal, books, dried flowers, and warm tea"
                      fill
                      priority
                      sizes="(max-width: 768px) 90vw, 440px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="mt-4 text-left pl-2 pr-32 flex items-center gap-2">
                    <span className="font-handwriting text-xl sm:text-2xl text-brown-deep dark:text-night-text">
                      {settings.hero_note}
                    </span>
                  </div>
                </TiltPolaroid>

                {/* Attached Handwritten Sticky Tag with Vintage Brass Paperclip */}
                <FadeInUp
                  delay={0.25}
                  className="absolute -bottom-9 -right-3 sm:-right-8 bg-paper-blush dark:bg-night-card border border-paper-border dark:border-night-border p-3.5 rounded-xl shadow-polaroid rotate-[3.5deg] z-20 max-w-[185px]"
                >
                  <BrassPaperclip className="absolute -top-5 right-5" rotation={12} />
                  <p className="font-handwriting text-base text-brown-deep dark:text-night-text leading-snug pt-0.5">
                    Quiet thoughts, warm tea & open journals ♡
                  </p>
                </FadeInUp>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Torn Paper Edge Transition */}
      <TornPaper position="top" />

      {/* =========================================================================
          2. LATEST WRITINGS SECTION
         ========================================================================= */}
      <section className="py-16 sm:py-22 bg-paper-cream/75 dark:bg-night-surface/40 border-b border-paper-border/60 dark:border-night-border/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <FadeInUp className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-5 border-b border-paper-border/70 dark:border-night-border/60 gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-muted mb-1">
                <FloralAccent size={20} variant="sparkle" />
                <span className="font-handwriting text-xl text-brown-muted dark:text-night-muted">
                  fresh thoughts & personal essays
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text">
                Latest Writings
              </h2>
            </div>

            <Link
              href="/writings"
              className="inline-flex items-center gap-2 font-serif text-base text-rose-muted dark:text-rose-dusty hover:text-brown-deep dark:hover:text-night-text font-semibold group transition-colors"
            >
              <span className="link-editorial">View All Writings</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeInUp>

          {/* Staggered Articles Grid */}
          {articles.length > 0 ? (
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
          ) : (
            <div className="text-center py-16 paper-card p-8 max-w-lg mx-auto">
              <FloralAccent size={48} variant="branch" className="mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text">
                A quiet space waiting for words
              </h3>
              <p className="mt-2 text-sm text-brown-muted dark:text-night-muted">
                No writings have been published yet. Check back soon for heartfelt reflections.
              </p>
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/writings"
              className="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-full bg-paper-cream border border-paper-border font-serif text-brown-deep font-semibold shadow-sm"
            >
              View All Writings →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. QUOTATION / REFLECTION RIBBON SECTION (H03: reflection-background.webp)
         ========================================================================= */}
      <section className="relative py-20 sm:py-26 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <FadeInUp className="relative rounded-3xl overflow-hidden border border-paper-border dark:border-night-border shadow-polaroid">
            {/* Atmospheric Golden-Hour Hills Background (H03) */}
            <div className="absolute inset-0 z-0">
              <Image
                src={settings.quote_image_url || '/images/homepage/reflection-background.webp'}
                alt=""
                fill
                sizes="(max-width: 1024px) 95vw, 900px"
                className="object-cover opacity-45 dark:opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/85 via-paper-warm/78 to-paper-blush/85 dark:from-night-card/90 dark:via-night-bg/85 dark:to-night-card/90" />
            </div>

            <div className="relative z-10 p-8 sm:p-14">
              {/* Washi Tapes on corners */}
              <WashiTape color="rose" tilt={-3} className="absolute -top-3 left-10" />
              <WashiTape color="sage" tilt={3} className="absolute -top-3 right-10" />

              {/* Decorative Vintage Butterfly Accent */}
              <div className="absolute top-5 right-7 pointer-events-none opacity-75 hidden sm:block">
                <Image
                  src="/images/decorative/small-butterfly.png"
                  alt=""
                  width={42}
                  height={42}
                />
              </div>

              {/* Oversized Quote Mark */}
              <div className="font-serif text-6xl sm:text-7xl text-rose-muted/75 leading-none select-none">
                “
              </div>

              {/* Quote Body */}
              <blockquote className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl text-brown-deep dark:text-night-text font-normal italic leading-relaxed max-w-2xl mx-auto">
                {settings.homepage_quote}
              </blockquote>

              {/* Decorative signoff */}
              <div className="mt-7 flex items-center justify-center gap-3">
                <div className="h-[1px] w-14 bg-rose-muted/45" />
                <span className="font-handwriting text-xl text-brown-muted dark:text-rose-dusty">
                  gentle reminders for the soul ♡
                </span>
                <div className="h-[1px] w-14 bg-rose-muted/45" />
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* =========================================================================
          4. ABOUT THE AUTHOR SECTION (H04: author-introduction.webp)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-paper-cream dark:bg-night-surface/50 border-t border-paper-border/60 dark:border-night-border/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Author Polaroid */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <TiltPolaroid initialRotate={2} className="polaroid-frame">
                  <WashiTape color="rose" tilt={2} className="absolute -top-3 right-8" />

                  <div className="relative aspect-[4/3] sm:aspect-square rounded-sm overflow-hidden bg-paper-blush/30">
                    <Image
                      src={settings.author_image_url || '/images/homepage/author-introduction.webp'}
                      alt="Intimate writing desk with an open book, journal, and natural window light"
                      fill
                      sizes="(max-width: 768px) 80vw, 360px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="mt-3.5 text-right pr-3 pl-28">
                    <span className="font-handwriting text-2xl text-brown-deep dark:text-night-text">
                      {settings.author_name} ♡
                    </span>
                  </div>
                </TiltPolaroid>

                {/* Attached Handwritten Post-It with Brass Paperclip */}
                <FadeInUp
                  delay={0.2}
                  className="absolute -bottom-8 -left-4 sm:-left-8 bg-paper-warm dark:bg-night-card border border-paper-border dark:border-night-border p-3.5 rounded-xl shadow-polaroid rotate-[-3.5deg] max-w-[205px] z-20"
                >
                  <BrassPaperclip className="absolute -top-5 left-6" rotation={-8} />
                  <p className="font-handwriting text-base text-brown-deep dark:text-night-text leading-snug pt-1">
                    {settings.author_note}
                  </p>
                </FadeInUp>
              </div>
            </div>

            {/* Author Intro Copy */}
            <FadeInUp className="lg:col-span-7 space-y-6 text-center lg:text-left mt-6 lg:mt-0">
              <div className="inline-flex items-center gap-2 text-rose-muted">
                <FloralAccent size={22} variant="branch" />
                <span className="font-handwriting text-xl text-brown-muted dark:text-night-muted">
                  the voice behind the words
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-deep dark:text-night-text">
                Hi, I'm {settings.author_name}.
              </h2>

              <p className="text-base sm:text-lg text-brown-dark/85 dark:text-night-muted leading-relaxed font-sans">
                {settings.author_intro}
              </p>

              <p className="text-sm sm:text-base text-brown-muted dark:text-night-muted/85 leading-relaxed font-sans">
                {settings.author_story}
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg font-sans font-medium text-sm sm:text-base hover:bg-rose-deep dark:hover:bg-rose-dusty transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>Read My Story</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="font-handwriting text-xl text-rose-muted dark:text-rose-dusty">
                  Welcome to my little journal ♡
                </span>
              </div>
            </FadeInUp>

          </div>
        </div>
      </section>
    </div>
  );
}
