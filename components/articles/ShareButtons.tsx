'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check, Twitter, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return '';
  };

  const handleCopy = () => {
    const fullUrl = getFullUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: getFullUrl(),
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopy();
    }
  };

  const currentUrl = typeof window !== 'undefined' ? encodeURIComponent(getFullUrl()) : '';
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      {/* Native Share button */}
      <button
        onClick={handleNativeShare}
        aria-label="Share article"
        className="w-8 h-8 rounded-full border border-paper-border dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush text-brown-deep dark:text-night-text flex items-center justify-center transition-colors shadow-sm"
        title="Share"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="w-8 h-8 rounded-full border border-paper-border dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush text-brown-deep dark:text-night-text flex items-center justify-center transition-colors shadow-sm relative"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-sage-dark dark:text-sage-light" />
        ) : (
          <Link2 className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="w-8 h-8 rounded-full border border-paper-border dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush text-brown-deep dark:text-night-text flex items-center justify-center transition-colors shadow-sm"
        title="Share on X"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="w-8 h-8 rounded-full border border-paper-border dark:border-night-border bg-paper/60 dark:bg-night-card hover:bg-paper-blush text-brown-deep dark:text-night-text flex items-center justify-center transition-colors shadow-sm"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
