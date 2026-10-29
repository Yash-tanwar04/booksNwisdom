import React from 'react';
import { getAllArticlesAdmin } from '@/lib/db';
import { AdminArticlesList } from '@/components/admin/AdminArticlesList';
import { WashiTape } from '@/components/decorations/WashiTape';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminWritingsPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-brown-deep dark:text-night-text">
            All Blogs
          </h2>
          <p className="text-sm text-brown-muted dark:text-night-muted mt-0.5">
            Manage your published articles, scheduled posts, and drafts.
          </p>
        </div>
      </div>

      <AdminArticlesList initialArticles={articles} />
    </div>
  );
}
