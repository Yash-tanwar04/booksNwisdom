import React from 'react';
import { getSiteSettings } from '@/lib/db';
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-brown-deep dark:text-night-text">
          Site Settings
        </h2>
        <p className="text-sm text-brown-muted dark:text-night-muted mt-0.5">
          Configure personal bio, homepage quotes, social channels, and SEO.
        </p>
      </div>

      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
