'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface BookLogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'compact';
  className?: string;
  showSubtitle?: boolean;
  logoUrl?: string;
}

export function BookLogo({
  variant = 'horizontal',
  className = '',
  showSubtitle = true,
  logoUrl,
}: BookLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [logoSrc, setLogoSrc] = React.useState<string>(
    logoUrl || '/images/logo_3d_emblem.jpg'
  );

  React.useEffect(() => {
    setMounted(true);

    if (logoUrl) {
      setLogoSrc(logoUrl);
      return;
    }

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.logo_image_url) {
          setLogoSrc(data.settings.logo_image_url);
        }
      })
      .catch(() => {});

    const handleLogoUpdated = (e: any) => {
      if (e.detail) {
        setLogoSrc(e.detail);
      }
    };

    window.addEventListener('bw-logo-updated', handleLogoUpdated);
    return () => window.removeEventListener('bw-logo-updated', handleLogoUpdated);
  }, [logoUrl]);

  const isDark = mounted && resolvedTheme === 'dark';

  if (variant === 'compact') {
    return (
      <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#D8A5A0]/70 bg-paper-cream dark:bg-night-card shadow-[0_4px_12px_rgba(89,65,59,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
          <Image
            src={logoSrc}
            alt="Books&Wisdom 3D Emblem"
            width={36}
            height={36}
            className="object-cover scale-110"
          />
        </div>
        <span className="font-serif text-xl tracking-tight text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors font-semibold">
          B<span className="italic font-normal text-rose-muted">&</span>W
        </span>
      </Link>
    );
  }

  if (variant === 'icon-only') {
    return (
      <div
        className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D8A5A0]/80 bg-paper-cream dark:bg-night-card shadow-[0_8px_20px_-4px_rgba(89,65,59,0.28),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-transform duration-500 hover:scale-105 hover:-rotate-2 ${className}`}
      >
        <Image
          src={logoSrc}
          alt="Books&Wisdom 3D Emblem"
          width={56}
          height={56}
          className="object-cover scale-110"
        />
      </div>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3.5 group [perspective:600px] ${className}`}
    >
      {/* 3D Sculpted Emblem Medallion */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-[#D8A5A0]/75 dark:border-[#B87873]/70 bg-paper-cream dark:bg-night-card shadow-[0_6px_16px_-2px_rgba(89,65,59,0.22),0_2px_4px_rgba(89,65,59,0.12),inset_0_1px_2px_rgba(255,255,255,0.85)] flex items-center justify-center transition-all duration-500 ease-out group-hover:[transform:rotateY(-10deg)_rotateX(6deg)_scale(1.07)] group-hover:shadow-[0_12px_24px_-4px_rgba(184,120,115,0.35)]">
        <Image
          src={logoSrc}
          alt="Books&Wisdom 3D Book & Rose Emblem"
          width={48}
          height={48}
          className="object-cover scale-[1.14] transition-transform duration-500 group-hover:scale-[1.2]"
          priority
        />
        {/* Subtle 3D Glass Rim Highlight */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40 pointer-events-none" />
      </div>

      {/* Brand Wordmark & Handwritten Tagline */}
      <div className="flex flex-col">
        <span className="font-serif text-2xl sm:text-[27px] tracking-tight leading-none text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors duration-300 font-bold">
          Books
          <span className="font-serif italic font-normal text-rose-muted dark:text-rose-dusty px-0.5">
            &
          </span>
          Wisdom
        </span>
        {showSubtitle && (
          <span className="font-handwriting text-[13.5px] sm:text-[15px] text-brown-muted dark:text-night-muted leading-tight mt-0.5 tracking-wide group-hover:text-brown-deep dark:group-hover:text-rose-dusty transition-colors">
            thoughts for a kinder, brighter you ♡
          </span>
        )}
      </div>
    </Link>
  );
}
