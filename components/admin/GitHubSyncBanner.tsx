'use client';

import React, { useEffect, useState } from 'react';
import { GitBranch, CheckCircle2, KeyRound, ExternalLink, Loader2, Sparkles, AlertCircle, Check } from 'lucide-react';

interface GitHubStatus {
  configured: boolean;
  source?: 'env' | 'cookie' | 'none';
  repo?: string;
  error?: string;
}

export function GitHubSyncBanner() {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const checkStatus = () => {
    fetch('/api/github/token', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error('Failed to load GitHub status:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setConnecting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/github/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Connected successfully!');
        setTokenInput('');
        checkStatus();
      } else {
        setErrorMsg(data.error || 'Failed to connect token.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection failed.');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return null;

  // Case 1: GitHub Token is configured and push access is confirmed!
  if (status?.configured) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                Git-Backed Cloud Sync Active
              </span>
              <span className="text-[10px] font-mono bg-emerald-200/70 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-medium">
                {status.repo || 'Yash-tanwar04/booksNwisdom'}
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
              Every blog post you publish commits directly to your GitHub repository and updates the live site.
            </p>
          </div>
        </div>

        <a
          href="https://github.com/Yash-tanwar04/booksNwisdom/blob/main/.data/db.json"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-night-card border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-night-surface transition-colors shrink-0"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>View db.json in GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // Case 2: Not yet connected - simple 1-step token input
  return (
    <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-muted shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
              <span>Connect GitHub for 1-Click Publishing</span>
              <span className="text-[10px] font-sans uppercase tracking-wider bg-rose-200/70 dark:bg-rose-900/40 text-brown-deep dark:text-night-text px-2 py-0.5 rounded-full font-semibold">
                No Database Needed
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-brown-muted dark:text-night-muted mt-1 max-w-xl">
              Books&Wisdom saves all articles directly inside your GitHub repository (<code>Yash-tanwar04/booksNwisdom</code>). Paste a GitHub Personal Access Token to enable seamless cloud publishing on Vercel.
            </p>
          </div>
        </div>

        <a
          href="https://github.com/settings/tokens/new?scopes=repo&description=BooksAndWisdom-Vercel"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-night-card border border-rose-300 dark:border-rose-800 text-brown-deep dark:text-night-text hover:bg-rose-50 dark:hover:bg-night-surface transition-colors shrink-0 shadow-sm"
        >
          <KeyRound className="w-3.5 h-3.5 text-rose-muted" />
          <span>Generate Token on GitHub (1-Click)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <form onSubmit={handleSaveToken} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl">
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste GitHub Token here (starts with ghp_...)"
          className="flex-1 px-3.5 py-2 rounded-xl border border-paper-border dark:border-night-border bg-white dark:bg-night-surface text-brown-deep dark:text-night-text text-xs font-mono outline-none focus:border-rose-muted shadow-sm"
        />
        <button
          type="submit"
          disabled={connecting || !tokenInput.trim()}
          className="px-5 py-2 rounded-xl bg-brown-deep hover:bg-rose-deep text-paper-warm text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          {connecting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Connect & Save</span>
            </>
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
