import React from 'react';
import { notFound } from 'next/navigation';
import { getArticleById } from '@/lib/db';
import { TipTapEditor } from '@/components/admin/TipTapEditor';

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <TipTapEditor initialArticle={article} />
    </div>
  );
}
