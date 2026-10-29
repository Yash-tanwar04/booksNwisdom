import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';

export const metadata: Metadata = {
  title: 'Privacy Policy — Books&Wisdom',
  description: 'Privacy Policy and data guidelines for Books&Wisdom.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-brown-muted dark:text-night-muted hover:text-brown-deep dark:hover:text-night-text mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Paper Container */}
        <div className="paper-card p-8 sm:p-12 relative overflow-hidden">
          <WashiTape color="rose" tilt={-2} className="absolute -top-3 left-12" />
          
          <div className="flex items-center gap-3 text-rose-muted mb-4">
            <Shield className="w-6 h-6" />
            <span className="font-handwriting text-xl text-brown-muted dark:text-night-muted">
              peace of mind
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text mb-6">
            Privacy Policy
          </h1>

          <div className="prose prose-stone dark:prose-invert max-w-none text-brown-dark/85 dark:text-night-muted space-y-6 leading-relaxed font-sans text-base">
            <p>
              Welcome to <strong>Books&Wisdom</strong>. Your privacy and trust are deeply valued in this quiet corner of the internet.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text pt-4">
              1. Information We Collect
            </h2>
            <p>
              Books&Wisdom is a personal writing space and journal. We do not require visitors to register reader accounts, do not sell personal data, and do not employ intrusive cross-site behavioral tracking or third-party ad networks.
            </p>
            <p>
              When you browse the site, standard non-identifying server logs (such as request timestamps and general device browser headers) may be recorded for operational security, performance monitoring, and error diagnostics.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text pt-4">
              2. Cookies & Local Storage
            </h2>
            <p>
              We use minimal local storage exclusively to preserve your chosen reading theme (light or dark mode) across visits. For administrators logging into the writing studio, secure authentication cookies are used strictly to maintain the authorized session.
            </p>

            <h2 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text pt-4">
              3. Contacting Us
            </h2>
            <p>
              If you reach out via email, your correspondence is held in confidence and used solely to reply to your inquiry.
            </p>

            <div className="pt-6 border-t border-paper-border/60 text-sm text-brown-muted">
              Last updated: October 2024 · Books&Wisdom
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
