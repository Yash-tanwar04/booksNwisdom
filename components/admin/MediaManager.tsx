'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Copy,
  Check,
  Eye,
  Loader2,
  Image as ImageIcon,
  Edit3,
  ExternalLink,
  Sparkles,
  Layout,
  BookOpen,
  FileEdit,
  FolderOpen,
  Crop,
  Info,
} from 'lucide-react';
import { MediaFile, Article, SiteSettings } from '@/types';
import { formatDate } from '@/lib/utils';
import { WashiTape } from '../decorations/WashiTape';
import { ImageCropperModal, CropTargetSpec } from './ImageCropperModal';

interface DedicatedCard {
  id: string;
  name: string;
  role: string;
  category: 'core' | 'published' | 'draft';
  currentImage: string;
  description: string;
  targetType: 'article' | 'setting';
  targetId?: string;
  targetSlug?: string;
  badge: string;
  targetResolution: string;
  targetAspect: string;
  isAiGenerated?: boolean;
}

interface MediaManagerProps {
  initialMedia: MediaFile[];
  articles: Article[];
  settings: SiteSettings;
}

export function MediaManager({ initialMedia, articles, settings }: MediaManagerProps) {
  const router = useRouter();

  // Initialize dedicated cards from props
  const buildInitialCards = (): DedicatedCard[] => [
    // 1. Core Site Visuals
    {
      id: 'core-hero',
      name: 'Homepage Hero Polaroid',
      role: 'Hero Section Polaroid photo',
      category: 'core',
      currentImage: settings.hero_image_url || '/images/homepage/homepage-hero.webp',
      description: 'The taped polaroid photograph featured in the split hero next to "Books&Wisdom".',
      targetType: 'setting',
      badge: 'Homepage Hero',
      targetResolution: '1800 × 1200 px',
      targetAspect: '3:2 / 4:5 Hero',
    },
    {
      id: 'core-author',
      name: 'Author Introduction Desk',
      role: 'Homepage Author Intro & About Page',
      category: 'core',
      currentImage: settings.author_image_url || '/images/homepage/author-introduction.webp',
      description: 'Used on the homepage author introduction and the /about section.',
      targetType: 'setting',
      badge: 'Author Bio',
      targetResolution: '1200 × 800 px',
      targetAspect: '3:2 / 1:1',
    },
    {
      id: 'core-logo',
      name: '3D Brand Emblem & Logo Mark',
      role: 'Navbar & Favicon 3D Emblem',
      category: 'core',
      currentImage: settings.logo_image_url || '/images/logo_3d_emblem.jpg',
      description: '3D sculpted leather book & rose illustration used in the navigation bar, footer, and tab icon.',
      targetType: 'setting',
      badge: 'Global Brand',
      targetResolution: '400 × 400 px',
      targetAspect: '1:1 Square',
      isAiGenerated: true,
    },
    {
      id: 'core-quote',
      name: 'Quotation & Reflection Backdrop',
      role: 'Homepage Quote Section (H03)',
      category: 'core',
      currentImage: settings.quote_image_url || '/images/homepage/reflection-background.webp',
      description: 'Atmospheric golden-hour hills backdrop for “A little perspective can turn a difficult day into a meaningful one.”',
      targetType: 'setting',
      badge: 'Quote Backdrop',
      targetResolution: '1800 × 1200 px',
      targetAspect: '3:2 Landscape',
    },
    {
      id: 'core-404',
      name: '404 Wandered Page Artwork',
      role: 'Lost / 404 Error Screen (S02)',
      category: 'core',
      currentImage: settings.not_found_image_url || '/images/errors/404-lost-page.webp',
      description: 'Open book with a loose page, pressed flowers, and brass compass for "This page seems to have wandered off."',
      targetType: 'setting',
      badge: '404 Screen',
      targetResolution: '1200 × 800 px',
      targetAspect: '3:2 Landscape',
    },

    // 2. Published Article Covers
    ...articles
      .filter((a) => a.status === 'published')
      .map((a) => ({
        id: `art-${a.id}`,
        name: `${a.title} (Cover)`,
        role: `Cover for /writings/${a.slug}`,
        category: 'published' as const,
        currentImage: a.cover_image_path || '/images/writings/a-battle-within.webp',
        description: a.excerpt || 'Published reflection cover on Books&Wisdom.',
        targetType: 'article' as const,
        targetId: a.id,
        targetSlug: a.slug,
        badge: 'Published Article',
        targetResolution: '1200 × 800 px',
        targetAspect: '3:2 Landscape',
      })),

    // 3. Draft Article Covers (AI Generated)
    ...articles
      .filter((a) => a.status === 'draft')
      .map((a) => ({
        id: `draft-${a.id}`,
        name: `${a.title} (Draft Cover)`,
        role: `Cover for Draft Reflection`,
        category: 'draft' as const,
        currentImage: a.cover_image_path || '/images/writings/gratitude.webp',
        description: a.excerpt || 'Private draft reflection cover in author studio.',
        targetType: 'article' as const,
        targetId: a.id,
        targetSlug: a.slug,
        badge: 'Draft Cover',
        targetResolution: '1200 × 800 px',
        targetAspect: '3:2 Landscape',
        isAiGenerated: true,
      })),
  ];

  const [cards, setCards] = useState<DedicatedCard[]>(buildInitialCards());
  const [mediaList, setMediaList] = useState<MediaFile[]>(initialMedia);
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'articles' | 'drafts' | 'uploads'>('all');
  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedCropFile, setSelectedCropFile] = useState<File | null>(null);
  const [activeCropCard, setActiveCropCard] = useState<DedicatedCard | null>(null);

  const getTargetSpec = (card: DedicatedCard): CropTargetSpec => {
    if (card.id === 'core-hero') {
      return {
        title: card.name,
        role: card.role,
        targetWidth: 800,
        targetHeight: 1000,
        aspectRatioLabel: '4:5 Portrait',
      };
    }
    if (card.id === 'core-author' || card.id === 'core-logo' || card.id === 'core-404') {
      return {
        title: card.name,
        role: card.role,
        targetWidth: 600,
        targetHeight: 600,
        aspectRatioLabel: '1:1 Square',
      };
    }
    if (card.id === 'core-quote') {
      return {
        title: card.name,
        role: card.role,
        targetWidth: 1200,
        targetHeight: 514,
        aspectRatioLabel: '21:9 Panoramic',
      };
    }
    return {
      title: card.name,
      role: card.role,
      targetWidth: 1200,
      targetHeight: 675,
      aspectRatioLabel: '16:9 Landscape',
    };
  };

  // Trigger file selection for a card
  const handleSelectFileForCard = (card: DedicatedCard, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveCropCard(card);
    setSelectedCropFile(file);
    setCropperOpen(true);
    e.target.value = ''; // Reset input to allow choosing same file again
  };

  // Called when auto-cropper modal completes
  const handleCropComplete = async (croppedBlob: Blob, filename: string) => {
    if (!activeCropCard) return;

    setUploadingTargetId(activeCropCard.id);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('file', croppedBlob, filename);
    formData.append('alt_text', activeCropCard.name);

    try {
      // 1. Upload to media library
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }

      const { media } = await res.json();
      setMediaList((prev) => [media, ...prev]);

      // 2. Automatically update target (article or setting)
      if (activeCropCard.targetType === 'article' && activeCropCard.targetId) {
        await fetch(`/api/articles/${activeCropCard.targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cover_image_path: media.url }),
        });
      } else if (activeCropCard.targetType === 'setting') {
        if (activeCropCard.id === 'core-hero') {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hero_image_url: media.url }),
          });
        } else if (activeCropCard.id === 'core-author') {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_image_url: media.url }),
          });
        } else if (activeCropCard.id === 'core-logo') {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logo_image_url: media.url }),
          });
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bw-logo-updated', { detail: media.url }));
          }
        } else if (activeCropCard.id === 'core-quote') {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quote_image_url: media.url }),
          });
        } else if (activeCropCard.id === 'core-404') {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ not_found_image_url: media.url }),
          });
        }
      }

      // 3. Immediately update the card thumbnail in local React state
      setCards((prev) =>
        prev.map((c) =>
          c.id === activeCropCard.id ? { ...c, currentImage: media.url } : c
        )
      );

      setSuccessMessage(
        `Successfully auto-cropped and updated "${activeCropCard.name}"!`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating image');
    } finally {
      setUploadingTargetId(null);
    }
  };

  // General file upload
  const handleGeneralUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingTargetId('general');
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', file.name);

        const res = await fetch('/api/media', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setMediaList((prev) => [data.media, ...prev]);
        }
      }
      setSuccessMessage('Successfully uploaded files to media library!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploadingTargetId(null);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filter cards based on activeTab
  const displayedCards = cards.filter((c) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'core') return c.category === 'core';
    if (activeTab === 'articles') return c.category === 'published';
    if (activeTab === 'drafts') return c.category === 'draft';
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Toast notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-xs sm:text-sm text-red-700 border border-red-200 flex items-center gap-2 animate-fade-in">
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-paper-border/70 dark:border-night-border">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-brown-muted dark:text-night-muted hover:text-brown-deep'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>All Dedicated Visuals</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-black/10 dark:bg-white/10">
            {cards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('core')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'core'
              ? 'bg-rose-muted text-white shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-brown-muted dark:text-night-muted hover:text-rose-muted'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Site & Hero ({cards.filter((c) => c.category === 'core').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Published Article Covers ({cards.filter((c) => c.category === 'published').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'drafts'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-amber-700 dark:text-amber-400 hover:bg-amber-50'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Drafts & AI Covers ({cards.filter((c) => c.category === 'draft').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'uploads'
              ? 'bg-brown-deep text-paper-warm shadow-sm'
              : 'bg-paper-cream dark:bg-night-card text-brown-muted dark:text-night-muted'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Raw Asset Vault ({mediaList.length})</span>
        </button>
      </div>

      {/* DEDICATED SECTION CARDS WITH AUTO-CROP & RESOLUTION GUIDELINES */}
      {activeTab !== 'uploads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text">
                Dedicated Visual Cards
              </h3>
              <p className="text-xs sm:text-sm text-brown-muted dark:text-night-muted mt-0.5">
                Every section has an exact target resolution. Click <strong>Replace & Auto-Crop</strong> to pick any image and fit it intelligently.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCards.map((card) => {
              const isUploadingThis = uploadingTargetId === card.id;
              const inputId = `file-input-${card.id}`;

              return (
                <div
                  key={card.id}
                  className="paper-card p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-polaroid transition-all group"
                >
                  <WashiTape
                    color={card.category === 'published' ? 'sage' : card.category === 'draft' ? 'cream' : 'rose'}
                    tilt={-2}
                    className="absolute -top-3 left-6 w-20"
                  />

                  {/* Hidden file input */}
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSelectFileForCard(card, e)}
                    className="hidden"
                  />

                  <div>
                    {/* Role badge */}
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                          card.category === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : card.category === 'draft'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {card.badge}
                      </span>

                      {card.isAiGenerated && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-muted">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Artwork</span>
                        </span>
                      )}
                    </div>

                    {/* Target Resolution Guideline Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] text-brown-muted mb-3 font-medium bg-paper-warm/50 dark:bg-night-card px-2.5 py-1 rounded-lg">
                      <Info className="w-3 h-3 text-rose-muted flex-shrink-0" />
                      <span>
                        Target: <strong>{card.targetResolution}</strong> ({card.targetAspect})
                      </span>
                    </div>

                    {/* Image Preview Container */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-paper-blush/30 border border-paper-border/80 mb-3 group/img">
                      <Image
                        src={card.currentImage}
                        alt={card.name}
                        fill
                        className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />

                      {/* Quick view button overlay */}
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            url: card.currentImage,
                            title: card.name,
                            subtitle: `${card.description} · Target: ${card.targetResolution}`,
                          })
                        }
                        className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                        title="Click to view full image"
                      >
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <Eye className="w-5 h-5" />
                        </div>
                      </button>
                    </div>

                    {/* Card Title & Subtitle */}
                    <h4 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text group-hover:text-rose-muted transition-colors line-clamp-1">
                      {card.name}
                    </h4>

                    <p className="text-xs text-brown-muted dark:text-night-muted mt-1 leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3.5 border-t border-paper-border/60 flex items-center justify-between gap-2">
                    {/* Replace & Auto-Crop Button */}
                    <button
                      type="button"
                      onClick={() => document.getElementById(inputId)?.click()}
                      disabled={isUploadingThis}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brown-deep dark:bg-rose-muted text-paper-warm dark:text-night-bg text-xs font-semibold hover:bg-rose-deep transition-all shadow-sm disabled:opacity-60"
                    >
                      {isUploadingThis ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Crop className="w-3.5 h-3.5" />
                          <span>Replace & Auto-Crop</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Copy URL */}
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(card.currentImage, card.id)}
                        className="p-1.5 rounded-lg border border-paper-border/80 hover:bg-paper-warm text-brown-muted dark:text-night-muted transition-colors"
                        title="Copy image URL"
                      >
                        {copiedId === card.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit Article Link if applicable */}
                      {card.targetType === 'article' && card.targetId && (
                        <Link
                          href={`/admin/writings/${card.targetId}/edit`}
                          className="p-1.5 rounded-lg border border-paper-border/80 hover:bg-paper-warm text-brown-muted dark:text-night-muted transition-colors"
                          title="Open editor for this blog"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-rose-muted" />
                        </Link>
                      )}

                      {/* View Live Link if published article */}
                      {card.category === 'published' && card.targetSlug && (
                        <Link
                          href={`/writings/${card.targetSlug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-paper-border/80 hover:bg-paper-warm text-brown-muted dark:text-night-muted transition-colors"
                          title="View live post"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RAW ASSET VAULT & UPLOAD DROPZONE */}
      {(activeTab === 'all' || activeTab === 'uploads') && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-brown-deep dark:text-night-text">
                General Asset Vault ({mediaList.length} files)
              </h3>
              <p className="text-xs sm:text-sm text-brown-muted dark:text-night-muted mt-0.5">
                Drop new illustrations, photography, or textures here to use inside TipTap editor bodies.
              </p>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="paper-card p-6 sm:p-8 relative">
            <WashiTape color="rose" tilt={-2} className="absolute -top-3 left-8" />

            {/* Hidden general input */}
            <input
              id="general-file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleGeneralUpload}
              disabled={uploadingTargetId === 'general'}
              className="hidden"
            />

            <div
              onClick={() => document.getElementById('general-file-input')?.click()}
              className="border-2 border-dashed border-paper-border dark:border-night-border rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-rose-muted hover:bg-paper-warm/40 transition-all text-center"
            >
              {uploadingTargetId === 'general' ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-muted" />
                  <span className="font-serif text-sm font-semibold text-brown-deep dark:text-night-text">
                    Uploading photos to library...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-paper-blush/60 flex items-center justify-center text-rose-muted">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-serif text-base font-bold text-brown-deep dark:text-night-text">
                      Drop images here, or browse files
                    </span>
                    <span className="text-xs text-brown-muted dark:text-night-muted block mt-1">
                      JPEG, PNG, WebP (up to 5MB each)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid of uploaded items */}
          <div className="paper-card p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden border border-paper-border dark:border-night-border bg-paper-warm/40 dark:bg-night-card shadow-sm flex flex-col"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-paper-blush/20">
                    <Image
                      src={item.url}
                      alt={item.alt_text || item.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            url: item.url,
                            title: item.filename,
                            subtitle: `${(item.size_bytes / 1024).toFixed(0)} KB · ${formatDate(item.created_at)}`,
                          })
                        }
                        className="p-1.5 rounded-full bg-white/90 text-brown-deep hover:bg-white shadow"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="p-1.5 rounded-full bg-white/90 text-brown-deep hover:bg-white shadow"
                        title="Copy URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-2 text-[10px] text-brown-muted truncate">
                    {item.filename}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Crop Modal */}
      {cropperOpen && activeCropCard && selectedCropFile && (
        <ImageCropperModal
          isOpen={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            setSelectedCropFile(null);
            setActiveCropCard(null);
          }}
          imageFile={selectedCropFile}
          spec={getTargetSpec(activeCropCard)}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Fullscreen Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-paper-cream dark:bg-night-surface rounded-2xl border border-paper-border dark:border-night-border p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/10">
              <Image
                src={previewImage.url}
                alt={previewImage.title}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-brown-deep dark:text-night-text">
                {previewImage.title}
              </h4>
              {previewImage.subtitle && (
                <p className="text-xs text-brown-muted dark:text-night-muted mt-0.5">
                  {previewImage.subtitle}
                </p>
              )}
              <p className="text-[11px] font-mono text-brown-muted mt-2 bg-paper-warm/60 p-2 rounded-lg break-all">
                {previewImage.url}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewImage.url, 'preview-modal')}
                className="px-4 py-2 rounded-xl bg-paper-blush text-brown-deep text-xs font-semibold hover:bg-rose-dusty/50"
              >
                {copiedId === 'preview-modal' ? 'Copied URL!' : 'Copy URL'}
              </button>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-xl bg-brown-deep text-paper-warm text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
