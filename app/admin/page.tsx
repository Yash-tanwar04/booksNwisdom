import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PenTool,
  BookOpen,
  FileText,
  FileEdit,
  Eye,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
  Edit3,
  Clock,
  Sparkles,
} from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { getAdminStats, getAllArticlesAdmin, getSiteSettings } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { WashiTape } from '@/components/decorations/WashiTape';
import { FloralAccent } from '@/components/decorations/FloralAccent';
import { GitHubSyncBanner } from '@/components/admin/GitHubSyncBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Dynamic admin dashboard

export default async function AdminDashboardPage() {
  noStore();
  const stats = await getAdminStats();
  const allArticles = await getAllArticlesAdmin({ sort: 'newest' });
  const settings = await getSiteSettings();

  const displayedArticles = allArticles.slice(0, 5);
  const draftArticles = allArticles.filter((a) => a.status === 'draft');

  return (
    <div className="space-y-8">
      {/* Git-Backed Cloud Persistence Status */}
      <GitHubSyncBanner />

      {/* Welcome Banner */}
      <div className="paper-card p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-15 dark:opacity-10">
          <Image
            src="/images/admin/admin-welcome.webp"
            alt=""
            fill
            sizes="1200px"
            className="object-cover"
          />
        </div>
        <WashiTape color="rose" tilt={-2} className="absolute -top-3 left-8 z-10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-rose-muted mb-1">
            <FloralAccent size={20} variant="sparkle" />
            <span className="font-handwriting text-lg text-brown-muted dark:text-night-muted">
              author studio
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-brown-deep dark:text-night-text">
            Welcome back, {settings.author_name}!
          </h2>
          <p className="text-sm text-brown-muted dark:text-night-muted mt-1 font-sans">
            Here's an overview of your writings, drafts, and reflections.
          </p>
        </div>

        <div className="relative z-10">
          <Link
            href="/admin/writings/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B87873] hover:bg-[#A25F5A] text-white text-sm font-medium shadow-md transition-all hover:shadow-lg"
          >
            <PenTool className="w-4 h-4" />
            <span>+ Write a New Blog</span>
          </Link>
        </div>
      </div>

      {/* 3 Real Studio Stat Cards (Published, Drafts, Media Files) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Published */}
        <Link href="/admin/writings?status=published" className="paper-card p-5 relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between text-xs text-brown-muted dark:text-night-muted mb-2 font-medium">
            <span>Published</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text group-hover:text-emerald-700 transition-colors">
            {stats.publishedCount}
          </div>
          <div className="text-[11px] text-brown-muted mt-1 font-handwriting text-base">
            live on website ♡
          </div>
        </Link>

        {/* Drafts */}
        <Link href="/admin/writings?status=draft" className="paper-card p-5 relative overflow-hidden group hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between text-xs text-brown-muted dark:text-night-muted mb-2 font-medium">
            <span>Drafts</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text group-hover:text-amber-600 transition-colors">
            {stats.draftsCount}
          </div>
          <div className="text-[11px] text-brown-muted mt-1 font-handwriting text-base">
            in progress (click to view)
          </div>
        </Link>

        {/* Media Files */}
        <Link href="/admin/media" className="paper-card p-5 relative overflow-hidden group hover:border-rose-muted transition-all">
          <div className="flex items-center justify-between text-xs text-brown-muted dark:text-night-muted mb-2 font-medium">
            <span>Media Files</span>
            <ImageIcon className="w-3.5 h-3.5 text-rose-muted" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors">
            {stats.mediaCount}
          </div>
          <div className="text-[11px] text-brown-muted mt-1 font-handwriting text-base">
            photos & visual cards
          </div>
        </Link>
      </div>

      {/* Recent Posts Table */}
      <div className="paper-card overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-paper-border/60 dark:border-night-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-brown-deep dark:text-night-text">
              Recent Posts
            </h3>
            <p className="text-xs text-brown-muted dark:text-night-muted">
              Your most recently created or updated blogs
            </p>
          </div>

          <Link
            href="/admin/writings"
            className="text-xs font-semibold text-rose-muted hover:text-brown-deep dark:hover:text-night-text flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-warm/50 dark:bg-night-card border-b border-paper-border/60 dark:border-night-border text-xs text-brown-muted uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">Title</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border/40 dark:divide-night-border/40">
              {displayedArticles.map((article) => {
                const isPublished = article.status === 'published';
                return (
                  <tr key={article.id} className="hover:bg-paper-warm/40 dark:hover:bg-night-card/40 transition-colors">
                    <td className="py-4 px-6 font-medium text-brown-deep dark:text-night-text">
                      <div className="font-serif text-base font-semibold line-clamp-1">
                        {article.title}
                      </div>
                      <div className="text-xs text-brown-muted dark:text-night-muted font-sans line-clamp-1">
                        /{article.slug}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-brown-muted dark:text-night-muted whitespace-nowrap">
                      {formatDate(article.published_at || article.created_at)}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isPublished
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <Link
                          href={`/admin/writings/${article.id}/edit`}
                          className="font-medium text-rose-muted hover:text-brown-deep dark:hover:text-night-text transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        {isPublished && (
                          <Link
                            href={`/writings/${article.slug}`}
                            target="_blank"
                            className="text-brown-muted hover:text-brown-deep dark:hover:text-night-text transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEDICATED DRAFTS SECTION */}
      <div className="paper-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <WashiTape color="sage" tilt={2} className="absolute -top-3 right-12" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border/60">
          <div>
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <FileEdit className="w-4 h-4" />
              <span className="font-handwriting text-base font-semibold text-amber-700 dark:text-amber-300">
                private reflections in progress
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text">
              Drafts in Progress ({draftArticles.length})
            </h3>
            <p className="text-xs text-brown-muted dark:text-night-muted mt-0.5">
              Reflections saved in your studio. Click any draft to resume writing or publish.
            </p>
          </div>

          <Link
            href="/admin/writings/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>+ Start Another Draft</span>
          </Link>
        </div>

        {draftArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftArticles.map((draft) => (
              <div
                key={draft.id}
                className="group p-5 rounded-2xl border border-paper-border/80 dark:border-night-border bg-paper-warm/40 dark:bg-night-card hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-brown-muted mb-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Draft
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-muted" />
                      {formatDate(draft.updated_at || draft.created_at)}
                    </span>
                  </div>

                  {draft.cover_image_path && (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 bg-paper-blush/30 border border-paper-border/60">
                      <Image
                        src={draft.cover_image_path}
                        alt={draft.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <h4 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors line-clamp-1">
                    {draft.title}
                  </h4>

                  <p className="text-xs text-brown-muted dark:text-night-muted line-clamp-2 mt-1.5 leading-relaxed font-sans">
                    {draft.excerpt || 'A quiet reflection in progress...'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-paper-border/50 flex items-center justify-between">
                  <span className="text-[11px] text-brown-muted font-sans">
                    {draft.reading_time_minutes} min read
                  </span>
                  <Link
                    href={`/admin/writings/${draft.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B87873] hover:bg-[#A25F5A] text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Resume Writing</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-brown-muted">
            <FloralAccent size={36} variant="branch" className="mx-auto mb-2 opacity-60" />
            <p className="font-serif text-base text-brown-deep dark:text-night-text">No active drafts</p>
            <p className="text-xs mt-1">All your writings have been published. Ready to begin a new reflection?</p>
            <Link
              href="/admin/writings/new"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B87873] text-white text-xs font-semibold shadow-sm"
            >
              + Write a New Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
