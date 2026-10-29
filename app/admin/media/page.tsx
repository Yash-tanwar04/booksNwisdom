import React from 'react';
import { getMediaFiles, getAllArticlesAdmin, getSiteSettings } from '@/lib/db';
import { MediaManager } from '@/components/admin/MediaManager';

export const revalidate = 0;

export default async function AdminMediaPage() {
  const media = await getMediaFiles();
  const articles = await getAllArticlesAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-brown-deep dark:text-night-text">
          Visual Media Studio
        </h2>
        <p className="text-sm text-brown-muted dark:text-night-muted mt-0.5">
          Dedicated cards for every site section, hero polaroid, and article cover with one-click photo replacement.
        </p>
      </div>

      <MediaManager initialMedia={media} articles={articles} settings={settings} />
    </div>
  );
}
