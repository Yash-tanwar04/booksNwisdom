'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, BookOpen, Heart, Sparkles } from 'lucide-react';

/**
 * 1. Tactile 3D Embossed Wax Seal Badge
 */
export function WaxSealBadge({
  text = 'BOOKS & WISDOM • CURATED JOURNAL •',
  size = 84,
  className = '',
}: {
  text?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group ${className}`}
      style={{ width: size, height: size }}
      title="Handcrafted Personal Scrapbook"
    >
      {/* Outer organically scalloped wax seal */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_6px_12px_rgba(89,65,59,0.28)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6"
      >
        <defs>
          <radialGradient id="waxGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#D8A5A0" />
            <stop offset="55%" stopColor="#B87873" />
            <stop offset="90%" stopColor="#8E5450" />
            <stop offset="100%" stopColor="#6E3D3A" />
          </radialGradient>
          <radialGradient id="waxInner" cx="65%" cy="70%" r="65%">
            <stop offset="0%" stopColor="#C98A85" />
            <stop offset="70%" stopColor="#9E605B" />
            <stop offset="100%" stopColor="#7A4541" />
          </radialGradient>
          <path
            id="sealTextPath"
            d="M 50, 50 m -31, 0 a 31,31 0 1,1 62,0 a 31,31 0 1,1 -62,0"
          />
        </defs>

        {/* Organic Wavy Wax Rim */}
        <path
          d="M50 4 C57 4, 62 7, 68 6 C74 5, 79 11, 84 15 C89 19, 94 23, 94 30 C94 37, 97 43, 96 50 C95 57, 95 64, 91 70 C87 76, 86 83, 80 87 C74 91, 68 93, 61 95 C54 97, 46 96, 39 95 C32 94, 25 91, 19 86 C13 81, 10 75, 7 68 C4 61, 4 54, 4 47 C4 40, 7 33, 9 26 C11 19, 17 14, 23 10 C29 6, 36 6, 42 5 C45 4, 48 4, 50 4 Z"
          fill="url(#waxGrad)"
          stroke="#7A4541"
          strokeWidth="0.8"
        />

        {/* Recessed Inner Stamp Ring */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="url(#waxInner)"
          stroke="#FBF3EA"
          strokeOpacity="0.35"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
        />
        <circle
          cx="50"
          cy="50"
          r="24"
          fill="none"
          stroke="#FBF3EA"
          strokeOpacity="0.3"
          strokeWidth="0.8"
        />

        {/* Circular Engraved Motto */}
        <text
          fill="#FFF9F3"
          fontSize="5.3"
          fontWeight="600"
          letterSpacing="1.35"
          className="font-serif uppercase opacity-90"
        >
          <textPath href="#sealTextPath" startOffset="0%">
            {text}
          </textPath>
        </text>

        {/* Center Embossed Open Book & Botanical Motif */}
        <g transform="translate(38, 39)" stroke="#FFF9F3" strokeWidth="1.4" fill="none" opacity="0.92">
          <path d="M12 4 C9 2, 4 2, 1 4 L1 17 C4 15, 9 15, 12 17 C15 15, 20 15, 23 17 L23 4 C20 2, 15 2, 12 4 Z" fill="#B87873" fillOpacity="0.4" />
          <path d="M12 4 L12 17" />
          <circle cx="12" cy="1" r="1.2" fill="#FFF9F3" stroke="none" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. Vintage Brass Paperclip Accent
 */
export function BrassPaperclip({
  className = '',
  rotation = 8,
}: {
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      className={`pointer-events-none select-none z-30 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg
        width="26"
        height="54"
        viewBox="0 0 26 54"
        fill="none"
        className="drop-shadow-[1px_3px_4px_rgba(48,38,34,0.22)]"
      >
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5C185" />
            <stop offset="50%" stopColor="#C89D54" />
            <stop offset="100%" stopColor="#9A7432" />
          </linearGradient>
        </defs>
        <path
          d="M7 14 V39 C7 45.5 11.5 50 16.5 50 C21.5 50 24 45.5 24 39 V11 C24 5.5 20 2 14.5 2 C9 2 4 5.5 4 11 V36 C4 40 7 43 11 43 C15 43 18 40 18 36 V15"
          stroke="url(#brassGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * 3. Vintage Postmark Ink Stamp
 */
export function PostmarkStamp({
  dateText = 'ARCHIVE NO. 04',
  locationText = 'PERSONAL SCRAPBOOK',
  className = '',
}: {
  dateText?: string;
  locationText?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 pointer-events-none select-none opacity-65 dark:opacity-50 ${className}`}
    >
      <svg width="110" height="48" viewBox="0 0 110 48" fill="none" className="text-brown-deep dark:text-rose-dusty">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 1.5" />
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="0.7" />
        <text x="24" y="21" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="700" letterSpacing="0.8">
          {locationText.slice(0, 10)}
        </text>
        <line x1="11" y1="24" x2="37" y2="24" stroke="currentColor" strokeWidth="0.7" />
        <text x="24" y="30" textAnchor="middle" fill="currentColor" fontSize="4.8" fontFamily="monospace">
          {dateText}
        </text>
        {/* Wavy cancellation lines */}
        <path d="M48 14 Q 60 10, 72 14 T 96 14 L 106 13" stroke="currentColor" strokeWidth="1.1" fill="none" />
        <path d="M48 21 Q 60 17, 72 21 T 96 21 L 106 20" stroke="currentColor" strokeWidth="1.1" fill="none" />
        <path d="M48 28 Q 60 24, 72 28 T 96 28 L 106 27" stroke="currentColor" strokeWidth="1.1" fill="none" />
        <path d="M48 35 Q 60 31, 72 35 T 96 35 L 106 34" stroke="currentColor" strokeWidth="1.1" fill="none" />
      </svg>
    </div>
  );
}

/**
 * 4. Pressed Botanical Sprig (Rosebud / Eucalyptus / Lavender)
 */
export function PressedBotanical({
  variant = 'lavender',
  className = '',
  size = 64,
}: {
  variant?: 'lavender' | 'eucalyptus' | 'rosebud';
  className?: string;
  size?: number;
}) {
  if (variant === 'eucalyptus') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className={`pointer-events-none select-none animate-float-slow ${className}`}
      >
        <path d="M16 68 Q 38 42, 62 12" stroke="#849079" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="28" cy="50" rx="8" ry="5" transform="rotate(-35 28 50)" fill="#A7B29E" fillOpacity="0.55" stroke="#849079" strokeWidth="1" />
        <ellipse cx="42" cy="46" rx="8" ry="5" transform="rotate(20 42 46)" fill="#CAD1C4" fillOpacity="0.6" stroke="#849079" strokeWidth="1" />
        <ellipse cx="38" cy="34" rx="9" ry="5.5" transform="rotate(-40 38 34)" fill="#A7B29E" fillOpacity="0.6" stroke="#849079" strokeWidth="1" />
        <ellipse cx="52" cy="31" rx="8" ry="5" transform="rotate(25 52 31)" fill="#A7B29E" fillOpacity="0.5" stroke="#849079" strokeWidth="1" />
        <ellipse cx="50" cy="19" rx="7" ry="4.5" transform="rotate(-30 50 19)" fill="#CAD1C4" fillOpacity="0.65" stroke="#849079" strokeWidth="1" />
      </svg>
    );
  }

  if (variant === 'rosebud') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className={`pointer-events-none select-none animate-float-slow ${className}`}
      >
        <path d="M22 66 Q 36 46, 48 24" stroke="#7A866E" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M33 48 C 25 45, 24 37, 32 39 C 35 42, 34 46, 33 48 Z" fill="#A7B29E" fillOpacity="0.65" />
        <path d="M40 42 C 48 40, 50 47, 42 48 C 40 46, 40 43, 40 42 Z" fill="#A7B29E" fillOpacity="0.65" />
        {/* Rose Petals */}
        <path d="M48 24 C 42 18, 45 9, 53 12 C 60 15, 56 26, 48 24 Z" fill="#D8A5A0" stroke="#B87873" strokeWidth="1" />
        <path d="M50 22 C 47 16, 52 10, 57 15 C 60 19, 54 24, 50 22 Z" fill="#B87873" fillOpacity="0.8" />
        <circle cx="52" cy="16" r="2.5" fill="#F3E1DC" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={`pointer-events-none select-none animate-float-slow ${className}`}
    >
      <path d="M18 68 Q 38 44, 58 14" stroke="#849079" strokeWidth="1.4" strokeLinecap="round" />
      {/* Lavender florets */}
      <ellipse cx="56" cy="16" rx="2.5" ry="4" transform="rotate(30 56 16)" fill="#B87873" fillOpacity="0.75" />
      <ellipse cx="50" cy="21" rx="2.5" ry="4.2" transform="rotate(-15 50 21)" fill="#D8A5A0" />
      <ellipse cx="53" cy="25" rx="2.5" ry="4.2" transform="rotate(45 53 25)" fill="#D8A5A0" />
      <ellipse cx="44" cy="29" rx="2.6" ry="4.5" transform="rotate(-20 44 29)" fill="#B87873" fillOpacity="0.8" />
      <ellipse cx="48" cy="33" rx="2.6" ry="4.5" transform="rotate(40 48 33)" fill="#D8A5A0" />
      <ellipse cx="38" cy="37" rx="2.6" ry="4.5" transform="rotate(-20 38 37)" fill="#D8A5A0" />
      <ellipse cx="42" cy="41" rx="2.6" ry="4.5" transform="rotate(40 42 41)" fill="#B87873" fillOpacity="0.7" />
    </svg>
  );
}

/**
 * 5. Floating Back-to-Top Vintage Seal Button
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg shadow-[0_8px_24px_rgba(89,65,59,0.3)] border-2 border-paper-cream/60 flex items-center justify-center hover:bg-rose-muted dark:hover:bg-rose-dusty hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
      title="Return to top of journal"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
