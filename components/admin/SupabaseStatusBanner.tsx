'use client';

import React, { useEffect, useState } from 'react';
import { Database, AlertTriangle, CheckCircle2, ExternalLink, Copy, Check, Terminal, Sparkles, X } from 'lucide-react';

interface SupabaseStatus {
  status: string;
  hasServiceRoleKey: boolean;
  hasAnonKey: boolean;
  count: number | null;
  error: {
    message: string;
    code?: string;
  } | null;
}

export function SupabaseStatusBanner() {
  const [loading, setLoading] = useState(true);
  const [supabaseData, setSupabaseData] = useState<SupabaseStatus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sqlContent, setSqlContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/debug-db', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.supabase) {
          setSupabaseData(data.supabase);
        }
      })
      .catch((err) => console.error('Failed to check Supabase status:', err))
      .finally(() => setLoading(false));

    fetch('/api/supabase-schema')
      .then((r) => r.json())
      .then((data) => {
        if (data?.sql) {
          setSqlContent(data.sql);
        }
      })
      .catch((err) => console.error('Failed to load SQL schema:', err));
  }, []);

  const handleCopySql = () => {
    if (!sqlContent) return;
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) return null;

  const isConfigured = supabaseData?.status === 'client_initialized';
  const hasSchemaError = Boolean(
    supabaseData?.error &&
      (supabaseData.error.code === 'PGRST205' ||
        supabaseData.error.message?.includes('articles') ||
        supabaseData.error.message?.includes('schema cache'))
  );
  const isHealthy = isConfigured && !hasSchemaError && supabaseData?.count !== null;

  // Case 1: Schema migration needed
  if (isConfigured && hasSchemaError) {
    return (
      <>
        <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-800 dark:text-amber-200 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-amber-950 dark:text-amber-100">
                    Supabase Database Setup Required
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                    1-Click Fix
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 mt-1 max-w-2xl leading-relaxed">
                  Your Supabase keys are connected on Vercel, but the PostgreSQL database tables (
                  <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-[12px]">articles</code>,{' '}
                  <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-[12px]">site_settings</code>)
                  have not been created yet. Run the 1-click SQL migration so newly published blogs persist across all Vercel servers and browsers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>Run SQL Setup (1-Click)</span>
              </button>
              <a
                href="https://supabase.com/dashboard/project/ixyusueytlwqricjjgxw/sql/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 text-amber-900 dark:text-amber-200 transition-colors"
              >
                <span>Supabase SQL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* SQL Migration Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-paper-warm dark:bg-night-card rounded-2xl max-w-2xl w-full border border-paper-border dark:border-night-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-paper-border/60 dark:border-night-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-muted" />
                    Supabase 1-Click Database Setup
                  </h3>
                  <p className="text-xs text-brown-muted dark:text-night-muted mt-1">
                    Follow these 3 easy steps (takes 15 seconds) to link your database permanently.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-brown-muted hover:text-brown-deep dark:text-night-muted hover:bg-paper-cream dark:hover:bg-night-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-rose-muted text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brown-deep dark:text-night-text">
                        Copy the complete SQL migration script below:
                      </p>
                      <button
                        type="button"
                        onClick={handleCopySql}
                        className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-muted hover:bg-rose-muted/90 text-white transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy SQL Script (Click here)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-rose-muted text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brown-deep dark:text-night-text">
                        Open your Supabase SQL Editor:
                      </p>
                      <a
                        href="https://supabase.com/dashboard/project/ixyusueytlwqricjjgxw/sql/new"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-brown-muted/30 dark:border-night-border hover:bg-paper-cream dark:hover:bg-night-surface text-brown-deep dark:text-night-text transition-colors"
                      >
                        <span>Open Supabase SQL Editor</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-rose-muted text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brown-deep dark:text-night-text">
                        Paste the SQL script and click the green <strong className="text-green-700 dark:text-green-400">Run</strong> button!
                      </p>
                      <p className="text-xs text-brown-muted dark:text-night-muted mt-0.5">
                        Once run, all published articles will instantly synchronize across Vercel, the main site, and all visitor browsers!
                      </p>
                    </div>
                  </div>
                </div>

                {/* SQL Code Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-brown-muted dark:text-night-muted">
                    <span className="font-mono">supabase/migrations/001_initial_schema.sql</span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="text-rose-muted hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-night-bg text-night-text font-mono text-[11px] leading-relaxed max-h-52 overflow-y-auto border border-night-border select-all">
                    {sqlContent || '-- Loading SQL script...'}
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-paper-cream/60 dark:bg-night-surface border-t border-paper-border/60 dark:border-night-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-brown-muted/30 dark:border-night-border hover:bg-paper-warm dark:hover:bg-night-card text-brown-deep dark:text-night-text"
                >
                  Close
                </button>
                <a
                  href="https://supabase.com/dashboard/project/ixyusueytlwqricjjgxw/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg hover:opacity-90 transition-opacity"
                >
                  <span>Go to SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Case 2: Supabase is healthy and connected!
  if (isHealthy) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Supabase Cloud Active:</strong> Synchronized with Postgres ({supabaseData.count} article{supabaseData.count === 1 ? '' : 's'} live across Vercel).
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
          Cloud Connected
        </span>
      </div>
    );
  }

  return null;
}
