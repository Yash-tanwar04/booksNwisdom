import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Instagram, Linkedin, Mail, BookOpen } from 'lucide-react';
import { getSiteSettings } from '@/lib/db';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';
import {
  WaxSealBadge,
  BrassPaperclip,
  PressedBotanical,
  PostmarkStamp,
} from '@/components/decorations/ScrapbookDetails';
import { FadeInUp, TiltPolaroid } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'About — Books&Wisdom',
  description: 'A little bit about the person behind this space, and the purpose of it.',
};

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <FadeInUp className="text-center max-w-2xl mx-auto mb-16 relative">
          <WashiTape color="rose" tilt={2} className="absolute -top-6 left-1/2 -translate-x-1/2" />
          
          <div className="inline-flex items-center gap-2 text-rose-muted mb-2 pt-2">
            <FloralAccent size={22} variant="branch" />
            <span className="font-handwriting text-xl text-brown-muted dark:text-night-muted">
              meet the author
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-deep dark:text-night-text tracking-tight">
            About Books&Wisdom
          </h1>

          <p className="mt-3 text-base sm:text-lg text-brown-muted dark:text-night-muted font-sans leading-relaxed">
            A little bit about the person behind this space, and the purpose of it.
          </p>
        </FadeInUp>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Left: Author Polaroid, Wax Seal & Handwritten Tape */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-sm">
              
              {/* Botanical Decorations Behind */}
              <div className="absolute -top-10 -left-8 pointer-events-none opacity-75">
                <PressedBotanical variant="rosebud" size={84} />
              </div>
              <div className="absolute -bottom-10 -right-8 pointer-events-none opacity-75">
                <PressedBotanical variant="eucalyptus" size={80} />
              </div>

              {/* 3D Embossed Wax Seal */}
              <div className="absolute -top-6 -right-5 z-30 hidden sm:block">
                <WaxSealBadge size={74} />
              </div>

              {/* Polaroid Photo */}
              <TiltPolaroid initialRotate={-2} className="polaroid-frame relative z-10">
                <WashiTape color="rose" tilt={-3} className="absolute -top-3 left-8" />
                <WashiTape color="sage" tilt={2} className="absolute -bottom-2 right-8" />

                <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-paper-blush/30">
                  <Image
                    src="/images/about/about-hero.webp?v=2"
                    alt="Quiet personal scene of an open journal, books, dried flowers, and warm sunlight near a window"
                    fill
                    priority
                    sizes="(max-width: 768px) 85vw, 380px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                <div className="mt-4 text-left pl-2 pr-36">
                  <span className="font-handwriting text-2xl text-brown-deep dark:text-night-text">
                    {settings.author_name} Tanwar ♡
                  </span>
                </div>
              </TiltPolaroid>

              {/* Scrapbook Note Card with Brass Paperclip */}
              <FadeInUp
                delay={0.2}
                className="absolute -bottom-10 -right-4 sm:-right-7 bg-paper-blush/95 dark:bg-night-card border border-paper-border dark:border-night-border p-3.5 rounded-xl shadow-polaroid rotate-[3deg] z-20 max-w-[210px]"
              >
                <BrassPaperclip className="absolute -top-5 right-6" rotation={10} />
                <p className="font-handwriting text-base text-brown-deep dark:text-night-text leading-snug pt-1">
                  {settings.author_note}
                </p>
              </FadeInUp>
            </div>
          </div>

          {/* Right: Personal Introduction & Story */}
          <FadeInUp className="lg:col-span-7 space-y-6 text-center lg:text-left mt-8 lg:mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start">
                <PostmarkStamp dateText="AUTHOR BIO" locationText="ANJALI TANWAR" />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text">
                Hi, I'm {settings.author_name}.
              </h2>

              <p className="text-base sm:text-lg text-brown-dark/85 dark:text-night-text/90 leading-relaxed font-sans">
                {settings.author_intro}
              </p>

              <div className="paper-card p-6 sm:p-7 border-l-4 border-l-rose-muted my-6 text-left relative notebook-paper">
                <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-muted" />
                  <span>The Purpose of This Space</span>
                </h3>
                <p className="text-sm sm:text-base text-brown-muted dark:text-night-muted leading-relaxed font-sans">
                  {settings.author_story}
                </p>
              </div>

              <p className="text-sm sm:text-base text-brown-muted dark:text-night-muted leading-relaxed font-sans">
                Writing has always been my compass—a quiet mirror to slow down, listen closely, and find light in everyday ordinary moments. I hope these reflections bring a sense of solace, perspective, and warmth to your own journey.
              </p>
            </div>

            {/* Social Links & Explore Writings Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/writings"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg font-sans font-medium text-sm sm:text-base hover:bg-rose-deep dark:hover:bg-rose-dusty transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Read My Writings</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {settings.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full border border-paper-border dark:border-night-border bg-paper-cream dark:bg-night-card hover:bg-paper-blush hover:-translate-y-0.5 flex items-center justify-center text-brown-deep dark:text-night-text transition-all shadow-sm"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.social_linkedin && (
                  <a
                    href={settings.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full border border-paper-border dark:border-night-border bg-paper-cream dark:bg-night-card hover:bg-paper-blush hover:-translate-y-0.5 flex items-center justify-center text-brown-deep dark:text-night-text transition-all shadow-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {settings.social_email && (
                  <a
                    href={`mailto:${settings.social_email}`}
                    aria-label="Email"
                    className="w-10 h-10 rounded-full border border-paper-border dark:border-night-border bg-paper-cream dark:bg-night-card hover:bg-paper-blush hover:-translate-y-0.5 flex items-center justify-center text-brown-deep dark:text-night-text transition-all shadow-sm"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </FadeInUp>

        </div>

        {/* Section 2: The Writing Process & Everyday Inspiration (A02 & A03) */}
        <FadeInUp delay={0.15} className="mt-20 sm:mt-24 max-w-5xl mx-auto pt-14 border-t border-paper-border/70 dark:border-night-border/60">
          <div className="text-center mb-10">
            <span className="font-handwriting text-xl text-rose-muted dark:text-rose-dusty block mb-1">
              behind the pages ♡
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brown-deep dark:text-night-text">
              The Writing Process &amp; Everyday Inspiration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {/* Card A02: The Writing Process */}
            <div className="paper-card p-4 sm:p-5 relative group">
              <WashiTape color="rose" tilt={-2.5} className="absolute -top-3 left-10" />
              <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-paper-blush/30 mb-4">
                <Image
                  src="/images/about/writing-process.webp"
                  alt="Close-up of a hand writing in an open journal with a fountain pen and a cup of tea nearby"
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text">
                Quiet Mornings &amp; Handwritten Drafts
              </h4>
              <p className="mt-1.5 text-sm text-brown-muted dark:text-night-muted leading-relaxed">
                Every essay begins in a quiet corner—putting honest thoughts onto paper before shaping them into reflections shared here.
              </p>
            </div>

            {/* Card A03: Personal Inspiration */}
            <div className="paper-card p-4 sm:p-5 relative group">
              <WashiTape color="sage" tilt={2.5} className="absolute -top-3 right-10" />
              <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-paper-blush/30 mb-4">
                <Image
                  src="/images/about/personal-inspiration.webp?v=2"
                  alt="Nostalgic arrangement of books, dried flowers, photographs, and a personal journal"
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text">
                Rooted in Lived Experiences
              </h4>
              <p className="mt-1.5 text-sm text-brown-muted dark:text-night-muted leading-relaxed">
                Inspired by conversations, books, changing seasons, and the small moments of grace that teach us who we are becoming.
              </p>
            </div>
          </div>
        </FadeInUp>

      </div>
    </div>
  );
}
