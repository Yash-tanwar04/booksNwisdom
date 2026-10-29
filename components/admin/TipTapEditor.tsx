'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Upload,
  X,
  Eye,
  Check,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Globe,
  Save,
  Crop,
  Copy,
  Info,
} from 'lucide-react';
import { Article } from '@/types';
import { calculateReadingTime, extractTextFromContent, slugify } from '@/lib/utils';
import { CURATED_WRITING_COVERS } from '@/lib/seed-data';
import { ArticleRenderer } from '../articles/ArticleRenderer';
import { WashiTape } from '../decorations/WashiTape';
import { ImageCropperModal, CropTargetSpec } from './ImageCropperModal';

interface TipTapEditorProps {
  initialArticle?: Partial<Article>;
}

export function TipTapEditor({ initialArticle }: TipTapEditorProps) {
  const router = useRouter();

  // State
  const [id, setId] = useState<string | undefined>(initialArticle?.id);
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [coverImagePath, setCoverImagePath] = useState<string | null>(initialArticle?.cover_image_path || null);
  const [status, setStatus] = useState<'draft' | 'published'>(initialArticle?.status === 'published' ? 'published' : 'draft');
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialArticle?.seo_description || '');

  // UI state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [seoCollapsed, setSeoCollapsed] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [libraryPickerOpen, setLibraryPickerOpen] = useState(false);

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-rose-muted underline decoration-rose-muted/60 hover:text-brown-deep',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 mx-auto paper-card p-2 shadow-sm',
        },
      }),
      Placeholder.configure({
        placeholder: 'Begin typing your reflection here...',
      }),
    ],
    content: initialArticle?.content || '',
    editorProps: {
      attributes: {
        class: 'prose-literary outline-none min-h-[420px] text-brown-dark/90 dark:text-night-text text-lg sm:text-[19px] leading-[1.8] font-sans focus:outline-none',
      },
    },
    onUpdate: () => {
      setSaveStatus('unsaved');
    },
  });

  // Calculate live word count and reading time
  const currentContent = editor?.getJSON() || initialArticle?.content;
  const wordCount = extractTextFromContent(currentContent).split(/\s+/).filter(Boolean).length;
  const readingTime = calculateReadingTime(currentContent);

  // Auto-generate slug from title if new
  useEffect(() => {
    if (!initialArticle?.id && title && !slug) {
      setSlug(slugify(title));
    }
  }, [title, slug, initialArticle?.id]);

  // Save / Autosave handler
  const performSave = useCallback(
    async (overrideStatus?: 'draft' | 'published') => {
      if (!title.trim() && !editor?.getText().trim()) {
        return;
      }

      setSaveStatus('saving');
      const articleStatus = overrideStatus || status;

      const payload = {
        id,
        title: title.trim() || 'Untitled Reflection',
        subtitle: subtitle.trim() || null,
        slug: slug.trim() || slugify(title || 'untitled-reflection'),
        excerpt: excerpt.trim() || undefined,
        content: editor?.getJSON() || { type: 'doc', content: [] },
        cover_image_path: coverImagePath,
        status: articleStatus,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
      };

      try {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.article) {
            setId(data.article.id);
            setSlug(data.article.slug);
            setStatus(data.article.status);
            setSaveStatus('saved');
            const now = new Date();
            setLastSavedTime(
              now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            );
          }
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error('Save error', err);
        setSaveStatus('error');
      }
    },
    [id, title, subtitle, slug, excerpt, coverImagePath, status, seoTitle, seoDescription, editor]
  );

  // Debounced Autosave (1.5 seconds)
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;

    const timer = setTimeout(() => {
      performSave();
    }, 1500);

    return () => clearTimeout(timer);
  }, [saveStatus, performSave]);

  // Warn before unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved' || saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Cover image upload
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedCropFile, setSelectedCropFile] = useState<File | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const coverSpec: CropTargetSpec = {
    title: title || 'Reflection Cover',
    role: 'Editorial 16:9 Landscape Cover',
    targetWidth: 1200,
    targetHeight: 675,
    aspectRatioLabel: '16:9 Landscape',
  };

  const handleSelectCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedCropFile(file);
    setCropperOpen(true);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob, filename: string) => {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append('file', croppedBlob, filename);
    formData.append('alt_text', title || 'Article cover');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImagePath(data.media.url);
        setSaveStatus('unsaved');
      }
    } catch (err) {
      console.error('Cover upload failed', err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDuplicatePost = async () => {
    if (!id) return;
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/articles/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/writings/${data.article.id}/edit`);
      }
    } catch (err) {
      console.error('Failed to duplicate', err);
    } finally {
      setIsDuplicating(false);
    }
  };

  // Insert image at cursor into TipTap
  const handleInsertInlineImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      const altInput = window.prompt('Enter image description (alt text) for readers:', 'Editorial reflection photograph') || 'Editorial reflection photograph';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', altInput);

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          editor.chain().focus().setImage({ src: data.media.url, alt: altInput }).run();
          setSaveStatus('unsaved');
        }
      } catch (err) {
        console.error('Inline image upload failed', err);
      }
    };
    input.click();
  };

  // Insert link
  const handleInsertLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter hyperlink URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setSaveStatus('unsaved');
  };

  // Publish action
  const handlePublish = async () => {
    setIsPublishing(true);
    await performSave('published');
    setIsPublishing(false);
    router.push('/admin/writings');
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="paper-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 lg:top-20 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/writings"
            className="p-1.5 rounded-lg text-brown-muted hover:text-brown-deep dark:hover:text-night-text hover:bg-paper-warm"
            title="Back to all writings"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Real Save Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-sans">
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving reflection...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}</span>
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-brown-muted dark:text-night-muted font-medium">
                Unsaved edits...
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-500 font-medium">
                Error saving changes
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {id && (
            <button
              type="button"
              onClick={handleDuplicatePost}
              disabled={isDuplicating}
              className="px-3.5 py-2 rounded-xl border border-paper-border dark:border-night-border text-xs sm:text-sm font-medium text-brown-deep dark:text-night-text hover:bg-paper-warm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Duplicate as a new draft reflection"
            >
              {isDuplicating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-muted" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-rose-muted" />
              )}
              <span className="hidden sm:inline">Duplicate</span>
            </button>
          )}

          <button
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2 rounded-xl border border-paper-border dark:border-night-border text-xs sm:text-sm font-medium text-brown-deep dark:text-night-text hover:bg-paper-warm flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => performSave('draft')}
            className="px-4 py-2 rounded-xl bg-paper-blush/60 dark:bg-night-card border border-paper-border text-xs sm:text-sm font-medium text-brown-deep dark:text-night-text hover:bg-paper-blush flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl bg-[#B87873] hover:bg-[#A25F5A] text-white text-xs sm:text-sm font-medium shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>{status === 'published' ? 'Update & Publish' : 'Publish Reflection'}</span>
          </button>
        </div>
      </div>

      {/* Main Writing Container */}
      <div className="paper-card p-6 sm:p-10 space-y-6 relative">
        <WashiTape color="rose" tilt={-2} className="absolute -top-3 left-10" />

        {/* Cover Image Box */}
        <div className="relative">
          {/* Resolution Target Guidance Badge + Curated Library Picker Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-brown-muted dark:text-night-muted mb-2 font-medium bg-paper-warm/50 dark:bg-night-card px-3 py-1.5 rounded-lg border border-paper-border/60">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rose-muted flex-shrink-0" />
              <span>
                Target Cover Resolution: <strong>1200 × 800 px (3:2 / 16:9 Landscape)</strong>. Intelligent auto-crop is applied when uploading.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLibraryPickerOpen(!libraryPickerOpen)}
              className="px-2.5 py-1 rounded-md bg-paper-blush/70 dark:bg-night-surface text-brown-deep dark:text-night-text hover:bg-rose-dusty/40 text-[11px] font-semibold transition-colors"
            >
              {libraryPickerOpen ? 'Hide Visual Library' : 'Choose from 20 Curated Themes'}
            </button>
          </div>

          {libraryPickerOpen && (
            <div className="mb-4 p-4 rounded-xl bg-paper-warm/70 dark:bg-night-card border border-paper-border dark:border-night-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-brown-deep dark:text-night-text">
                  Books&amp;Wisdom Visual Library (20 Emotional Metaphors)
                </span>
                <button
                  type="button"
                  onClick={() => setLibraryPickerOpen(false)}
                  className="text-xs text-brown-muted hover:text-brown-deep"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {CURATED_WRITING_COVERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCoverImagePath(item.path);
                      setSaveStatus('unsaved');
                      setLibraryPickerOpen(false);
                    }}
                    className={`group text-left rounded-lg overflow-hidden border transition-all ${
                      coverImagePath === item.path
                        ? 'border-rose-muted ring-2 ring-rose-muted/40'
                        : 'border-paper-border/80 hover:border-rose-muted'
                    }`}
                  >
                    <div className="relative aspect-[3/2] bg-paper-blush/30">
                      <Image
                        src={item.path}
                        alt={item.title}
                        fill
                        sizes="160px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-1.5 bg-paper-cream dark:bg-night-surface">
                      <div className="text-[11px] font-serif font-bold text-brown-deep dark:text-night-text truncate">
                        {item.title}
                      </div>
                      <div className="text-[9px] text-brown-muted truncate">
                        {item.emotion}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {coverImagePath ? (
            <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-paper-blush/30 border border-paper-border/80 group">
              <Image
                src={coverImagePath}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-white text-brown-deep text-xs font-semibold hover:bg-paper-warm transition-colors shadow flex items-center gap-1.5">
                  <Crop className="w-3.5 h-3.5 text-rose-muted" />
                  <span>Replace & Auto-Crop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelectCoverFile}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCoverImagePath(null);
                    setSaveStatus('unsaved');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-paper-border dark:border-night-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-rose-muted hover:bg-paper-warm/30 transition-all text-center">
              {uploadingCover ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-rose-muted" />
                  <span className="text-xs text-brown-muted">Processing and uploading cover image...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-paper-blush/60 flex items-center justify-center text-rose-muted">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-serif text-sm font-semibold text-brown-deep dark:text-night-text">
                      Click to upload cover image
                    </span>
                    <span className="text-xs text-brown-muted block mt-0.5">
                      JPEG, PNG or WebP · Auto-crops to 1200 × 675 px (16:9)
                    </span>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleSelectCoverFile}
                disabled={uploadingCover}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title & Subtitle Inputs */}
        <div className="space-y-3 pt-2">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder="Reflection Title..."
            className="w-full bg-transparent font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-deep dark:text-night-text placeholder:text-brown-muted/40 outline-none leading-tight"
          />

          <input
            type="text"
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder="Add an optional subtitle or quiet premise..."
            className="w-full bg-transparent font-serif italic text-lg sm:text-xl text-brown-muted dark:text-night-muted placeholder:text-brown-muted/40 outline-none"
          />
        </div>

        {/* TipTap Toolbar */}
        {editor && (
          <div className="sticky top-32 z-10 p-2 rounded-xl bg-paper-warm dark:bg-night-card border border-paper-border/80 dark:border-night-border flex flex-wrap items-center gap-1 text-brown-deep dark:text-night-text shadow-sm">
            {/* Paragraph */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`p-2 rounded-lg text-xs font-semibold ${
                editor.isActive('paragraph') ? 'bg-[#D8A5A0]/40 text-brown-deep' : 'hover:bg-paper-blush/40'
              }`}
              title="Normal Paragraph"
            >
              <Pilcrow className="w-4 h-4" />
            </button>

            {/* Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded-lg ${
                editor.isActive('heading', { level: 1 }) ? 'bg-[#D8A5A0]/40 font-bold' : 'hover:bg-paper-blush/40'
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-lg ${
                editor.isActive('heading', { level: 2 }) ? 'bg-[#D8A5A0]/40 font-bold' : 'hover:bg-paper-blush/40'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded-lg ${
                editor.isActive('heading', { level: 3 }) ? 'bg-[#D8A5A0]/40 font-bold' : 'hover:bg-paper-blush/40'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-paper-border/80 mx-1" />

            {/* Bold, Italic, Underline, Strike */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg ${editor.isActive('bold') ? 'bg-[#D8A5A0]/40 font-bold' : 'hover:bg-paper-blush/40'}`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg ${editor.isActive('italic') ? 'bg-[#D8A5A0]/40 italic' : 'hover:bg-paper-blush/40'}`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-lg ${editor.isActive('underline') ? 'bg-[#D8A5A0]/40 underline' : 'hover:bg-paper-blush/40'}`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-lg ${editor.isActive('strike') ? 'bg-[#D8A5A0]/40 line-through' : 'hover:bg-paper-blush/40'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-paper-border/80 mx-1" />

            {/* Lists & Quotes */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg ${editor.isActive('bulletList') ? 'bg-[#D8A5A0]/40' : 'hover:bg-paper-blush/40'}`}
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg ${editor.isActive('orderedList') ? 'bg-[#D8A5A0]/40' : 'hover:bg-paper-blush/40'}`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg ${editor.isActive('blockquote') ? 'bg-[#D8A5A0]/40' : 'hover:bg-paper-blush/40'}`}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-paper-border/80 mx-1" />

            {/* Media & Links */}
            <button
              type="button"
              onClick={handleInsertLink}
              className={`p-2 rounded-lg ${editor.isActive('link') ? 'bg-[#D8A5A0]/40' : 'hover:bg-paper-blush/40'}`}
              title="Insert Link (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleInsertInlineImage}
              className="p-2 rounded-lg hover:bg-paper-blush/40"
              title="Insert Image Between Paragraphs"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded-lg hover:bg-paper-blush/40"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="h-5 w-[1px] bg-paper-border/80 mx-1" />

            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded-lg hover:bg-paper-blush/40 disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded-lg hover:bg-paper-blush/40 disabled:opacity-30"
              title="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="p-2 rounded-lg hover:bg-paper-blush/40"
              title="Clear Formatting"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TipTap Writing Canvas */}
        <div className="pt-4 min-h-[420px] bg-paper-cream dark:bg-night-surface rounded-xl p-4 sm:p-6 border border-paper-border/40">
          <EditorContent editor={editor} />
        </div>

        {/* Live Word Count & Reading Time */}
        <div className="pt-2 flex items-center justify-between text-xs text-brown-muted dark:text-night-muted font-sans border-t border-paper-border/40">
          <div>
            <span>{wordCount} words</span>
            <span className="mx-2">·</span>
            <span>~{readingTime} min read</span>
          </div>
          <div className="font-handwriting text-sm text-brown-muted">
            write gently, reflect deeply ♡
          </div>
        </div>

        {/* Collapsible SEO & URL Settings */}
        <div className="pt-4 border-t border-paper-border/80 dark:border-night-border">
          <button
            type="button"
            onClick={() => setSeoCollapsed(!seoCollapsed)}
            className="w-full flex items-center justify-between py-2 text-sm font-semibold text-brown-deep dark:text-night-text"
          >
            <span>Publication & SEO Settings (Slug, Excerpt, Meta)</span>
            {seoCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {!seoCollapsed && (
            <div className="mt-4 p-5 rounded-xl bg-paper-warm/50 dark:bg-night-card space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-brown-deep dark:text-night-text mb-1">
                  Custom URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-paper-blush/40 border border-r-0 border-paper-border rounded-l-xl text-brown-muted">
                    /writings/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      setSaveStatus('unsaved');
                    }}
                    className="w-full px-3 py-2 border border-paper-border rounded-r-xl bg-paper-cream dark:bg-night-surface outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brown-deep dark:text-night-text mb-1">
                  Short Excerpt (Displayed on article cards)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    setSaveStatus('unsaved');
                  }}
                  placeholder="A short 1-2 sentence preview for your readers..."
                  className="w-full px-3 py-2 border border-paper-border rounded-xl bg-paper-cream dark:bg-night-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brown-deep dark:text-night-text mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => {
                      setSeoTitle(e.target.value);
                      setSaveStatus('unsaved');
                    }}
                    placeholder="Custom SEO Title"
                    className="w-full px-3 py-2 border border-paper-border rounded-xl bg-paper-cream dark:bg-night-surface outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brown-deep dark:text-night-text mb-1">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => {
                      setSeoDescription(e.target.value);
                      setSaveStatus('unsaved');
                    }}
                    placeholder="Search engine summary"
                    className="w-full px-3 py-2 border border-paper-border rounded-xl bg-paper-cream dark:bg-night-surface outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Public Layout Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-paper dark:bg-night-bg rounded-3xl border border-paper-border dark:border-night-border max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-12 relative shadow-2xl my-8">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-paper-cream dark:bg-night-card border border-paper-border text-brown-deep dark:text-night-text hover:bg-paper-blush transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Simulated Public Article Layout */}
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-rose-muted font-semibold">
                  Article Preview
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brown-deep dark:text-night-text">
                  {title || 'Untitled Reflection'}
                </h1>
                {subtitle && (
                  <p className="font-serif italic text-lg text-brown-muted dark:text-night-muted">
                    {subtitle}
                  </p>
                )}
              </div>

              {coverImagePath && (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-polaroid my-6">
                  <Image src={coverImagePath} alt={title} fill className="object-cover" />
                </div>
              )}

              <div className="pt-4">
                <ArticleRenderer content={editor?.getJSON()} />
              </div>

              <div className="pt-8 border-t border-paper-border text-center">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-brown-deep text-paper-warm text-sm font-semibold"
                >
                  Return to Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageFile={selectedCropFile}
        spec={coverSpec}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
