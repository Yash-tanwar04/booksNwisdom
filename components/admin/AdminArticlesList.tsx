'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  PenTool,
  Edit3,
  ExternalLink,
  Trash2,
  Globe,
  Archive,
  AlertTriangle,
  Loader2,
  FileEdit,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { FloralAccent } from '../decorations/FloralAccent';

interface AdminArticlesListProps {
  initialArticles: Article[];
}

export function AdminArticlesList({ initialArticles }: AdminArticlesListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatusParam = (searchParams?.get('status') as 'all' | 'published' | 'draft') || 'all';

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>(
    initialStatusParam === 'draft' || initialStatusParam === 'published' ? initialStatusParam : 'all'
  );
  const [sortBy, setSortBy] = useState<'newest' | 'updated'>('newest');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // Also fetch latest articles with no-store on mount so client router cache never hides newly published posts
  useEffect(() => {
    let active = true;
    fetch('/api/articles?admin=1', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const param = searchParams?.get('status');
    if (param === 'draft' || param === 'published' || param === 'all') {
      setStatusFilter(param);
    }
  }, [searchParams]);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftsCount = articles.filter((a) => a.status === 'draft').length;

  // Filtered and sorted
  const filteredArticles = articles
    .filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleTogglePublish = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
        }),
      });

      if (res.ok) {
        const { article: updated } = await res.json();
        setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to toggle publish', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/articles/${deleteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (article: Article) => {
    setDuplicatingId(article.id);
    try {
      const res = await fetch(`/api/articles/${article.id}/duplicate`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setArticles((prev) => [data.article, ...prev]);
        setFeedbackMessage(`Duplicated "${article.title}" as a new draft!`);
        setTimeout(() => setFeedbackMessage(null), 4000);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to duplicate article', err);
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Filter Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-paper-border/70 dark:border-night-border">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            statusFilter === 'all'
              ? 'bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-brown-muted dark:text-night-muted hover:text-brown-deep'
          }`}
        >
          <span>All Writings</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-black/10 dark:bg-white/10">
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('published')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            statusFilter === 'published'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Published Articles</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {publishedCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('draft')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            statusFilter === 'draft'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-amber-700 dark:text-amber-400 hover:bg-amber-50'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Drafts in Progress</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {draftsCount}
          </span>
        </button>
      </div>

      {/* Helpful banner when viewing drafts */}
      {statusFilter === 'draft' && (
        <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileEdit className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Drafts Workspace:</strong> These {draftsCount} reflection(s) are stored privately in your studio. Public visitors cannot see them until you hit <strong>Publish</strong>.
            </span>
          </div>
          <Link
            href="/admin/writings/new"
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 whitespace-nowrap"
          >
            + New Draft
          </Link>
        </div>
      )}

      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brown-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-paper-cream dark:bg-night-surface border border-paper-border dark:border-night-border text-brown-deep dark:text-night-text placeholder:text-brown-muted/60 text-sm outline-none focus:ring-2 focus:ring-rose-muted/50"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-2 px-3 rounded-xl bg-paper-cream dark:bg-night-surface border border-paper-border dark:border-night-border text-xs sm:text-sm text-brown-deep dark:text-night-text outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-2 px-3 rounded-xl bg-paper-cream dark:bg-night-surface border border-paper-border dark:border-night-border text-xs sm:text-sm text-brown-deep dark:text-night-text outline-none"
          >
            <option value="newest">Sort: Newest</option>
            <option value="updated">Sort: Last Updated</option>
          </select>

          <Link
            href="/admin/writings/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B87873] hover:bg-[#A25F5A] text-white text-xs sm:text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>New Blog</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="paper-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-warm/50 dark:bg-night-card border-b border-paper-border/60 dark:border-night-border text-xs text-brown-muted uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">Article</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border/40 dark:divide-night-border/40">
              {filteredArticles.map((article) => {
                const isPublished = article.status === 'published';
                return (
                  <tr key={article.id} className="hover:bg-paper-warm/40 dark:hover:bg-night-card/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {article.cover_image_path ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-paper-blush/30 border border-paper-border/60">
                            <Image
                              src={article.cover_image_path}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-paper-blush/30 flex items-center justify-center flex-shrink-0 text-rose-muted">
                            <FloralAccent size={20} variant="branch" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/writings/${article.id}/edit`}
                            className="font-serif text-base font-semibold text-brown-deep dark:text-night-text hover:text-rose-muted line-clamp-1 transition-colors"
                          >
                            {article.title}
                          </Link>
                          <div className="text-xs text-brown-muted dark:text-night-muted font-sans line-clamp-1">
                            /{article.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-brown-muted dark:text-night-muted whitespace-nowrap">
                      <div>{formatDate(article.published_at || article.created_at)}</div>
                      <div className="text-[11px] opacity-75">{article.reading_time_minutes} min read</div>
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
                        {/* Edit */}
                        <Link
                          href={`/admin/writings/${article.id}/edit`}
                          className="font-medium text-rose-muted hover:text-brown-deep dark:hover:text-night-text transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        {/* Duplicate (WordPress Clone Post) */}
                        <button
                          onClick={() => handleDuplicate(article)}
                          disabled={duplicatingId === article.id}
                          className="text-brown-muted hover:text-brown-deep dark:hover:text-night-text transition-colors flex items-center gap-1 disabled:opacity-50"
                          title="Duplicate this reflection as a draft copy"
                        >
                          {duplicatingId === article.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-muted" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-brown-muted hover:text-rose-muted" />
                          )}
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>

                        {/* Toggle Publish */}
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className="text-brown-muted hover:text-brown-deep dark:hover:text-night-text transition-colors flex items-center gap-1"
                          title={isPublished ? 'Unpublish article' : 'Publish article'}
                        >
                          {isPublished ? (
                            <>
                              <Archive className="w-3.5 h-3.5 text-amber-600" />
                              <span className="hidden sm:inline">Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Publish</span>
                            </>
                          )}
                        </button>

                        {/* View Public */}
                        {isPublished && (
                          <Link
                            href={`/writings/${article.slug}`}
                            target="_blank"
                            className="text-brown-muted hover:text-brown-deep dark:hover:text-night-text transition-colors"
                            title="View on site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(article.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 p-4 text-brown-muted">
            <div className="relative w-40 h-28 mx-auto mb-3 rounded-xl overflow-hidden border border-paper-border/60 shadow-sm">
              <Image
                src="/images/admin/admin-empty-writings.webp"
                alt="Open notebook and fountain pen"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <p className="font-serif text-base text-brown-deep dark:text-night-text">No articles found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-paper-cream dark:bg-night-surface rounded-2xl border border-paper-border dark:border-night-border p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text">
                Delete Article?
              </h3>
              <p className="text-xs text-brown-muted dark:text-night-muted mt-1 leading-relaxed">
                Are you sure you want to delete this reflection? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-paper-border dark:border-night-border text-xs font-medium text-brown-deep dark:text-night-text hover:bg-paper-warm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
