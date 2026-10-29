'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Save,
  Check,
  Loader2,
  Upload,
  FileUp,
  Globe,
  Sparkles,
  Download,
  Rss,
  Database,
  RefreshCw,
  FileText,
  Copy,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { SiteSettings } from '@/types';
import { WashiTape } from '../decorations/WashiTape';

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'homepage' | 'social' | 'seo' | 'migration' | 'database'>('general');

  // Supabase Database State
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [sqlContent, setSqlContent] = useState<string>('');
  const [sqlCopied, setSqlCopied] = useState(false);

  // WordPress Migration State
  const [wpJsonInput, setWpJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ count?: number; message?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  // Author Photo Upload
  const handleAuthorPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', 'Author photo');

    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, author_image_url: data.media.url }));
      }
    } catch (err) {
      console.error('Failed to upload author photo', err);
    }
  };

  // WordPress Import Handler
  const handleImportWordPress = async () => {
    if (!wpJsonInput.trim()) return;
    setImporting(true);
    setImportResult(null);

    try {
      let parsedData: any = wpJsonInput;
      if (wpJsonInput.trim().startsWith('[') || wpJsonInput.trim().startsWith('{')) {
        try {
          parsedData = JSON.parse(wpJsonInput);
        } catch (e) {
          // Keep as string
        }
      }

      const res = await fetch('/api/import-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData }),
      });

      const resData = await res.json();
      if (res.ok) {
        setImportResult({
          count: resData.importedCount,
          message: `Successfully imported ${resData.importedCount} reflection(s) from WordPress!`,
        });
        setWpJsonInput('');
        router.refresh();
      } else {
        setImportResult({ message: resData.error || 'Import failed.' });
      }
    } catch (err: any) {
      setImportResult({ message: err.message || 'Import failed.' });
    } finally {
      setImporting(false);
    }
  };

  // Full Site Backup Export
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleExportBackup = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) throw new Error('Backup failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `books-and-wisdom-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to export backup: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Restoring will merge/overwrite site records with this backup. Do you want to proceed?')) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    setRestoreResult(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (res.ok) {
        setRestoreResult({ success: true, message: data.message });
        router.refresh();
      } else {
        setRestoreResult({ success: false, message: data.error || 'Restore failed' });
      }
    } catch (err: any) {
      setRestoreResult({ success: false, message: 'Invalid JSON backup: ' + err.message });
    } finally {
      setRestoring(false);
      e.target.value = '';
    }
  };

  const loadDbInfo = async () => {
    setDbLoading(true);
    try {
      const [dbRes, sqlRes] = await Promise.all([
        fetch('/api/debug-db', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/supabase-schema').then((r) => r.json()),
      ]);
      setDbStatus(dbRes?.supabase || null);
      if (sqlRes?.sql) setSqlContent(sqlRes.sql);
    } catch (e) {
      console.error(e);
    } finally {
      setDbLoading(false);
    }
  };

  const handleCopySql = () => {
    if (!sqlContent) return;
    navigator.clipboard.writeText(sqlContent);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-paper-border/80 dark:border-night-border pb-3">
        {[
          { id: 'general', label: 'General' },
          { id: 'homepage', label: 'Homepage' },
          { id: 'social', label: 'Social Links' },
          { id: 'seo', label: 'SEO Defaults' },
          { id: 'migration', label: 'Backup & WordPress Tools' },
          { id: 'database', label: 'Supabase Database' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'database') loadDbInfo();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg shadow-sm'
                : 'bg-paper-cream dark:bg-night-card text-brown-muted dark:text-night-muted hover:text-brown-deep'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="paper-card p-6 sm:p-8 space-y-6 relative">
          <WashiTape color="rose" tilt={-2} className="absolute -top-3 left-8" />

          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text border-b border-paper-border/60 pb-2">
                General Site Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={form.site_name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Author Display Name
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    value={form.author_name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Author Photo
                  </label>
                  <div className="flex items-center gap-3">
                    {form.author_image_url && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-paper-border flex-shrink-0">
                        <Image src={form.author_image_url} alt="Author" fill className="object-cover" />
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 rounded-xl border border-paper-border bg-paper-warm/40 text-xs font-semibold text-brown-deep hover:bg-paper-blush transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                      <input type="file" accept="image/*" onChange={handleAuthorPhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Author Introduction (Homepage bio)
                </label>
                <textarea
                  rows={3}
                  name="author_intro"
                  value={form.author_intro}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  About Page Story & Reflection
                </label>
                <textarea
                  rows={4}
                  name="author_story"
                  value={form.author_story}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Handwritten Note / Quote (Taped on Author Photo)
                </label>
                <input
                  type="text"
                  name="author_note"
                  value={form.author_note}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE */}
          {activeTab === 'homepage' && (
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text border-b border-paper-border/60 pb-2">
                Homepage Elements
              </h3>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Hero Supporting Subtitle
                </label>
                <textarea
                  rows={2}
                  name="hero_subheading"
                  value={form.hero_subheading}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Hero Polaroid Handwritten Note
                </label>
                <input
                  type="text"
                  name="hero_note"
                  value={form.hero_note}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Featured Homepage Quotation
                </label>
                <textarea
                  rows={2}
                  name="homepage_quote"
                  value={form.homepage_quote}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans font-serif italic text-base"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text border-b border-paper-border/60 pb-2">
                Social Links & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="social_instagram"
                    value={form.social_instagram}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="social_linkedin"
                    value={form.social_linkedin}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    name="social_email"
                    value={form.social_email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    Twitter / X URL
                  </label>
                  <input
                    type="url"
                    name="social_twitter"
                    value={form.social_twitter}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text border-b border-paper-border/60 pb-2">
                Default Search Engine Optimization (SEO)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Default Site Meta Title
                </label>
                <input
                  type="text"
                  name="seo_default_title"
                  value={form.seo_default_title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  name="seo_default_description"
                  value={form.seo_default_description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-sm outline-none font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP, EXPORT & WORDPRESS TOOLS */}
          {activeTab === 'migration' && (
            <div className="space-y-8">
              {/* SECTION A: FULL SITE BACKUP & EXPORT (WORDPRESS TOOLS STYLE) */}
              <div className="p-5 rounded-2xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
                      <Database className="w-5 h-5 text-rose-muted" />
                      <span>Export Full Site Backup</span>
                    </h4>
                    <p className="text-xs text-brown-muted dark:text-night-muted mt-1 leading-relaxed">
                      Download a complete snapshot of all published blogs, private drafts, media records, and site configurations in JSON format. Keep this file safe for instant one-click restoration anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportBackup}
                    disabled={exporting}
                    className="px-4 py-2.5 rounded-xl bg-brown-deep text-paper-warm text-xs font-semibold hover:bg-rose-deep transition-all shadow flex items-center gap-2 flex-shrink-0 disabled:opacity-60"
                  >
                    {exporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>Download Backup (.json)</span>
                  </button>
                </div>

                {/* Restore Backup */}
                <div className="pt-4 border-t border-paper-border/60 dark:border-night-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-brown-deep dark:text-night-text block">
                      Restore / Import Backup
                    </span>
                    <span className="text-[11px] text-brown-muted">
                      Upload a previously exported <code>books-and-wisdom-backup.json</code> file to restore.
                    </span>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/50 hover:bg-paper-warm text-xs font-semibold text-brown-deep dark:text-night-text transition-colors">
                    {restoring ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-muted" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-rose-muted" />
                    )}
                    <span>{restoring ? 'Restoring...' : 'Upload Backup File'}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreFile}
                      disabled={restoring}
                      className="hidden"
                    />
                  </label>
                </div>

                {restoreResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      restoreResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {restoreResult.message}
                  </div>
                )}
              </div>

              {/* SECTION B: RSS 2.0 FEED */}
              <div className="p-5 rounded-2xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
                    <Rss className="w-5 h-5 text-amber-600" />
                    <span>RSS 2.0 Syndication Feed</span>
                  </h4>
                  <a
                    href="/rss.xml"
                    target="_blank"
                    className="text-xs text-rose-muted hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Open Live Feed</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-brown-muted leading-relaxed">
                  Your blog automatically provides a compliant RSS 2.0 XML feed for feed readers like Feedly, NetNewsWire, and Substack/newsletter integrations.
                </p>
                <div className="p-2.5 rounded-xl bg-paper-warm/70 dark:bg-night-surface border border-paper-border text-xs font-mono text-brown-deep dark:text-night-text flex items-center justify-between">
                  <span>/rss.xml</span>
                  <span className="text-[11px] text-brown-muted font-sans font-medium">Standard RSS 2.0</span>
                </div>
              </div>

              {/* SECTION C: WORDPRESS BLOG IMPORTER */}
              <div className="p-5 rounded-2xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border space-y-4">
                <h4 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-rose-muted" />
                  <span>WordPress Blog Importer</span>
                </h4>

                <p className="text-xs text-brown-muted leading-relaxed">
                  Paste your WordPress export (either XML WXR file content or JSON array of posts from the WP REST API).
                  All original titles, publication dates, formatted content, and custom slugs will be automatically preserved.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-brown-deep dark:text-night-text uppercase tracking-wider mb-1.5">
                    WordPress XML or JSON Export Payload
                  </label>
                  <textarea
                    rows={6}
                    value={wpJsonInput}
                    onChange={(e) => setWpJsonInput(e.target.value)}
                    placeholder="Paste <rss> XML or [{ id: 1, title: {...}, content: {...} }] JSON here..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-surface text-brown-deep dark:text-night-text text-xs font-mono outline-none"
                  />
                </div>

                {importResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      importResult.count
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {importResult.message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleImportWordPress}
                  disabled={importing || !wpJsonInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brown-deep text-paper-warm text-xs font-semibold hover:bg-rose-deep transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                  <span>Import WordPress Articles</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SUPABASE DATABASE & CLOUD SYNC */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
                  <Database className="w-5 h-5 text-rose-muted" />
                  <span>Supabase PostgreSQL Cloud Integration</span>
                </h3>
                <p className="text-xs text-brown-muted dark:text-night-muted mt-1">
                  Connect Books&Wisdom with your Supabase database so your published articles synchronize permanently across all Vercel servers and visitor devices.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-5 rounded-2xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-brown-deep dark:text-night-text flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-muted" />
                    <span>Live Database Connection Status</span>
                  </h4>
                  <button
                    type="button"
                    onClick={loadDbInfo}
                    disabled={dbLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-paper-border hover:bg-paper-warm dark:hover:bg-night-surface text-brown-muted transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${dbLoading ? 'animate-spin' : ''}`} />
                    <span>Check Connection</span>
                  </button>
                </div>

                {dbLoading ? (
                  <div className="flex items-center gap-2 text-xs text-brown-muted py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-rose-muted" />
                    <span>Testing Supabase connection...</span>
                  </div>
                ) : dbStatus?.status === 'client_initialized' && dbStatus?.error ? (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2 text-amber-900 dark:text-amber-200">
                    <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-100">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Schema Migration Required (Tables Missing)</span>
                    </div>
                    <p className="leading-relaxed">
                      Supabase connected successfully, but the required tables (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">public.articles</code>, <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">public.site_settings</code>) have not been created in your Supabase project yet.
                    </p>
                    <p className="font-mono text-[11px] text-amber-700 dark:text-amber-300">
                      Error: {dbStatus.error.message || 'PGRST205'}
                    </p>
                  </div>
                ) : dbStatus?.status === 'client_initialized' && dbStatus?.count !== null ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1 text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-center gap-2 font-bold text-emerald-950 dark:text-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Supabase Cloud Connected & Ready!</span>
                    </div>
                    <p>
                      {dbStatus.count} article{dbStatus.count === 1 ? '' : 's'} currently stored in your Supabase database. Cloud sync is 100% active.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-paper-warm/50 border border-paper-border text-xs text-brown-muted space-y-1">
                    <p className="font-medium text-brown-deep dark:text-night-text">Local Storage Mode Active</p>
                    <p>Articles are currently saved to local storage.</p>
                  </div>
                )}
              </div>

              {/* 1-Click Migration Guide */}
              <div className="p-5 rounded-2xl bg-paper-cream dark:bg-night-card border border-paper-border dark:border-night-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-base font-bold text-brown-deep dark:text-night-text">
                      1-Click Supabase SQL Setup (15 Seconds)
                    </h4>
                    <p className="text-xs text-brown-muted dark:text-night-muted mt-0.5">
                      Copy this script and paste it into the Supabase SQL editor to create the required tables and security rules.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-muted hover:bg-rose-muted/90 text-white transition-colors"
                    >
                      {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{sqlCopied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/ixyusueytlwqricjjgxw/sql/new"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-brown-muted/30 dark:border-night-border hover:bg-paper-warm dark:hover:bg-night-surface text-brown-deep dark:text-night-text transition-colors"
                    >
                      <span>Open SQL Editor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-brown-muted">
                    <span className="font-mono">supabase/migrations/001_initial_schema.sql</span>
                    <span>126 lines</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-night-bg text-night-text font-mono text-xs leading-relaxed max-h-64 overflow-y-auto border border-night-border select-all">
                    {sqlContent || '-- Loading schema script...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {activeTab !== 'migration' && activeTab !== 'database' && (
            <div className="pt-4 border-t border-paper-border/60 flex items-center justify-between">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-[#B87873] hover:bg-[#A25F5A] text-white text-sm font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              {savedSuccess && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Settings saved successfully!</span>
                </span>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
