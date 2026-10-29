'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { BookLogo } from '@/components/decorations/BookLogo';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-paper dark:bg-night-bg relative overflow-hidden">
      {/* Decorative florals in background */}
      <div className="absolute top-10 left-10 pointer-events-none opacity-40">
        <FloralAccent size={100} variant="branch" />
      </div>
      <div className="absolute bottom-10 right-10 pointer-events-none opacity-40 rotate-180">
        <FloralAccent size={100} variant="branch" />
      </div>

      <div className="w-full max-w-md paper-card p-8 sm:p-10 relative shadow-polaroid z-10">
        <WashiTape color="rose" tilt={-2} className="absolute -top-3 left-1/2 -translate-x-1/2" />

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <BookLogo variant="icon-only" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brown-deep dark:text-night-text">
            Author Studio
          </h1>
          <p className="font-handwriting text-lg text-brown-muted dark:text-night-muted mt-1">
            sign in to write & publish reflections ♡
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Demo Helper Card */}
          <div className="p-3 rounded-xl bg-paper-warm dark:bg-night-card border border-paper-border/80 text-xs text-brown-muted dark:text-night-muted flex items-center justify-between">
            <div>
              <span className="font-semibold text-brown-deep dark:text-night-text block">Author Login:</span>
              <span className="font-mono text-[11px]">admin@booksandwisdom.com / Wisdom#2024</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@booksandwisdom.com');
                setPassword('Wisdom#2024');
                setError(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-muted text-white text-[11px] font-semibold hover:bg-rose-deep transition-colors"
            >
              Auto-fill
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-brown-muted absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@booksandwisdom.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border text-brown-deep dark:text-night-text placeholder:text-brown-muted/50 outline-none focus:ring-2 focus:ring-rose-muted/50 text-sm font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-brown-muted absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border text-brown-deep dark:text-night-text placeholder:text-brown-muted/50 outline-none focus:ring-2 focus:ring-rose-muted/50 text-sm font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-brown-muted hover:text-brown-deep dark:hover:text-night-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg font-sans font-medium text-sm hover:bg-rose-deep dark:hover:bg-rose-dusty transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Enter Writing Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to public site */}
        <div className="mt-8 pt-4 border-t border-paper-border/60 text-center">
          <Link
            href="/"
            className="text-xs text-brown-muted dark:text-night-muted hover:text-brown-deep dark:hover:text-night-text transition-colors"
          >
            ← Back to Books&Wisdom
          </Link>
        </div>
      </div>
    </div>
  );
}
