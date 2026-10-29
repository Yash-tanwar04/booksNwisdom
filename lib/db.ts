import fs from 'fs';
import os from 'os';
import path from 'path';
import { Article, ArticleStatus, SiteSettings, MediaFile, SearchResult } from '@/types';
import { initialArticles, initialSiteSettings, initialMediaFiles } from './seed-data';
import { calculateReadingTime, extractTextFromContent, slugify } from './utils';
import { createServerClient } from './supabase/server';

interface LocalDatabase {
  articles: Article[];
  settings: SiteSettings;
  media: MediaFile[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'books-and-wisdom-db.json');

function ensureLocalDb(): LocalDatabase {
  // 1. In serverless environments (e.g. Vercel), check /tmp first if already written during this instance lifecycle
  if (process.env.VERCEL && fs.existsSync(TMP_DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TMP_DB_FILE, 'utf-8'));
    } catch {
      // Fall through to bundled DB_FILE
    }
  }

  // 2. Read bundled .data/db.json if present
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      // Fall through to seed data
    }
  }

  // 3. Initialize from seed data
  const initialDb: LocalDatabase = {
    articles: initialArticles,
    settings: initialSiteSettings,
    media: initialMediaFiles,
  };

  saveLocalDb(initialDb);
  return initialDb;
}

function saveLocalDb(db: LocalDatabase) {
  const serialized = JSON.stringify(db, null, 2);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, serialized, 'utf-8');
  } catch {
    // On Vercel serverless read-only filesystem (/var/task), safely fall back to /tmp
    try {
      fs.writeFileSync(TMP_DB_FILE, serialized, 'utf-8');
    } catch (tmpErr) {
      console.error('Could not write local fallback DB:', tmpErr);
    }
  }
}

// ----------------------------------------------------------------------------
// ARTICLES
// ----------------------------------------------------------------------------

export async function getPublishedArticles(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<{ articles: Article[]; total: number }> {
  const supabase = createServerClient();
  const now = new Date().toISOString();

  if (supabase) {
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .or(`published_at.is.null,published_at.lte.${now}`)
      .order('published_at', { ascending: false });

    if (params?.search) {
      query = query.ilike('title', `%${params.search}%`);
    }

    if (params?.limit) {
      const from = params.offset || 0;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (!error && data) {
      return { articles: data as Article[], total: count || data.length };
    }
  }

  // Local fallback
  const db = ensureLocalDb();
  let list = db.articles.filter((a) => {
    if (a.status !== 'published') return false;
    if (a.published_at && new Date(a.published_at) > new Date()) return false;
    return true;
  });

  // Sort by published_at or created_at descending
  list.sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        extractTextFromContent(a.content).toLowerCase().includes(q)
    );
  }

  const total = list.length;
  const offset = params?.offset || 0;
  if (params?.limit) {
    list = list.slice(offset, offset + params.limit);
  }

  return { articles: list, total };
}

export async function getArticleBySlug(slug: string, options?: { allowDraft?: boolean }): Promise<Article | null> {
  const supabase = createServerClient();
  const now = new Date().toISOString();

  if (supabase) {
    let query = supabase.from('articles').select('*').eq('slug', slug);

    if (!options?.allowDraft) {
      query = query.eq('status', 'published').or(`published_at.is.null,published_at.lte.${now}`);
    }

    const { data, error } = await query.single();
    if (!error && data) {
      return data as Article;
    }
  }

  const db = ensureLocalDb();
  const found = db.articles.find((a) => a.slug === slug);
  if (!found) return null;

  if (!options?.allowDraft) {
    if (found.status !== 'published') return null;
    if (found.published_at && new Date(found.published_at) > new Date()) return null;
  }

  return found;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = createServerClient();
  if (supabase) {
    const { data } = await supabase.from('articles').select('*').eq('id', id).single();
    if (data) return data as Article;
  }

  const db = ensureLocalDb();
  return db.articles.find((a) => a.id === id) || null;
}

export async function getAllArticlesAdmin(params?: {
  status?: string;
  search?: string;
  sort?: 'newest' | 'updated';
}): Promise<Article[]> {
  const supabase = createServerClient();

  if (supabase) {
    let query = supabase.from('articles').select('*');
    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }
    if (params?.search) {
      query = query.ilike('title', `%${params.search}%`);
    }

    const orderCol = params?.sort === 'updated' ? 'updated_at' : 'created_at';
    query = query.order(orderCol, { ascending: false });

    const { data, error } = await query;
    if (!error && data) return data as Article[];
  }

  const db = ensureLocalDb();
  let list = [...db.articles];

  if (params?.status && params.status !== 'all') {
    list = list.filter((a) => a.status === params.status);
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        extractTextFromContent(a.content).toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => {
    if (params?.sort === 'updated') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return list;
}

export async function saveArticle(articleData: Partial<Article>): Promise<Article> {
  const now = new Date().toISOString();
  const db = ensureLocalDb();

  if (articleData.id) {
    // UPDATE EXISTING ARTICLE
    const existingIndex = db.articles.findIndex((a) => a.id === articleData.id);
    if (existingIndex >= 0) {
      const existing = db.articles[existingIndex];

      let title = articleData.title !== undefined ? (articleData.title?.trim() || existing.title) : existing.title;
      let slug = articleData.slug !== undefined ? (articleData.slug?.trim() || existing.slug) : existing.slug;
      
      // Ensure slug uniqueness if changed
      if (slug !== existing.slug) {
        let uniqueSlug = slug;
        let counter = 1;
        while (db.articles.some((a) => a.slug === uniqueSlug && a.id !== existing.id)) {
          uniqueSlug = `${slug}-${counter++}`;
        }
        slug = uniqueSlug;
      }

      let excerpt = articleData.excerpt !== undefined ? articleData.excerpt : existing.excerpt;
      if (!excerpt && articleData.content) {
        const rawText = extractTextFromContent(articleData.content);
        excerpt = rawText.slice(0, 160).trim();
        if (rawText.length > 160) excerpt += '...';
      }

      const readingTime = articleData.content !== undefined 
        ? calculateReadingTime(articleData.content)
        : existing.reading_time_minutes;

      const updated: Article = {
        ...existing,
        ...articleData,
        title,
        slug,
        excerpt: excerpt || existing.excerpt,
        reading_time_minutes: readingTime,
        updated_at: now,
        published_at:
          articleData.status === 'published' && !existing.published_at
            ? now
            : articleData.published_at !== undefined
            ? articleData.published_at
            : existing.published_at,
      };

      db.articles[existingIndex] = updated;
      saveLocalDb(db);
      return updated;
    }
  }

  // CREATE NEW ARTICLE
  let title = articleData.title?.trim() || 'Untitled Reflection';
  let slug = articleData.slug?.trim() || slugify(title);

  const readingTime = calculateReadingTime(articleData.content);

  let excerpt = articleData.excerpt?.trim();
  if (!excerpt) {
    const rawText = extractTextFromContent(articleData.content);
    excerpt = rawText.slice(0, 160).trim();
    if (rawText.length > 160) excerpt += '...';
    if (!excerpt) excerpt = 'A quiet reflection from Books&Wisdom.';
  }

  let uniqueSlug = slug;
  let counter = 1;
  while (db.articles.some((a) => a.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter++}`;
  }
  slug = uniqueSlug;

  const newArticle: Article = {
    id: articleData.id || `art-${Date.now()}`,
    title,
    subtitle: articleData.subtitle || null,
    slug,
    excerpt,
    content: articleData.content || { type: 'doc', content: [] },
    cover_image_path: articleData.cover_image_path || null,
    status: articleData.status || 'draft',
    published_at: articleData.status === 'published' ? now : null,
    scheduled_at: articleData.scheduled_at || null,
    seo_title: articleData.seo_title || null,
    seo_description: articleData.seo_description || null,
    reading_time_minutes: readingTime,
    views_count: 0,
    created_at: now,
    updated_at: now,
    author_id: articleData.author_id || null,
  };

  db.articles.unshift(newArticle);
  saveLocalDb(db);
  return newArticle;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = ensureLocalDb();
  const index = db.articles.findIndex((a) => a.id === id);
  if (index >= 0) {
    db.articles.splice(index, 1);
    saveLocalDb(db);
    return true;
  }
  return false;
}

export async function duplicateArticle(id: string): Promise<Article | null> {
  const db = ensureLocalDb();
  const original = db.articles.find((a) => a.id === id);
  if (!original) return null;

  const now = new Date().toISOString();
  const title = `(Copy) ${original.title}`;
  const baseSlug = `${original.slug}-copy`;
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (db.articles.some((a) => a.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const duplicated: Article = {
    ...original,
    id: `art-${Date.now()}`,
    title,
    slug: uniqueSlug,
    status: 'draft',
    published_at: null,
    scheduled_at: null,
    views_count: 0,
    created_at: now,
    updated_at: now,
  };

  db.articles.unshift(duplicated);
  saveLocalDb(db);
  return duplicated;
}

// ----------------------------------------------------------------------------
// SITE SETTINGS
// ----------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createServerClient();
  if (supabase) {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
    if (data) return data as SiteSettings;
  }

  const db = ensureLocalDb();
  return db.settings || initialSiteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = ensureLocalDb();
  db.settings = {
    ...db.settings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  saveLocalDb(db);
  return db.settings;
}

// ----------------------------------------------------------------------------
// MEDIA
// ----------------------------------------------------------------------------

export async function getMediaFiles(): Promise<MediaFile[]> {
  const db = ensureLocalDb();
  return db.media || [];
}

export async function addMediaFile(media: Omit<MediaFile, 'id' | 'created_at'>): Promise<MediaFile> {
  const db = ensureLocalDb();
  const newMedia: MediaFile = {
    ...media,
    id: `med-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  db.media.unshift(newMedia);
  saveLocalDb(db);
  return newMedia;
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  const db = ensureLocalDb();
  const index = db.media.findIndex((m) => m.id === id);
  if (index >= 0) {
    db.media.splice(index, 1);
    saveLocalDb(db);
    return true;
  }
  return false;
}

// ----------------------------------------------------------------------------
// ADMIN STATS
// ----------------------------------------------------------------------------

export async function getAdminStats(): Promise<{
  publishedCount: number;
  draftsCount: number;
  totalViews: number;
  mediaCount: number;
}> {
  const db = ensureLocalDb();
  const publishedCount = db.articles.filter((a) => a.status === 'published').length;
  const draftsCount = db.articles.filter((a) => a.status === 'draft').length;
  const totalViews = db.articles.reduce((acc, a) => acc + (a.views_count || 0), 0);
  const mediaCount = db.media.length;

  return {
    publishedCount,
    draftsCount,
    totalViews,
    mediaCount,
  };
}

// ----------------------------------------------------------------------------
// FULL SITE BACKUP (EXPORT / RESTORE)
// ----------------------------------------------------------------------------

export async function exportDatabaseBackup(): Promise<{
  version: string;
  exported_at: string;
  articles: Article[];
  settings: SiteSettings;
  media: MediaFile[];
}> {
  const db = ensureLocalDb();
  return {
    version: '1.0',
    exported_at: new Date().toISOString(),
    articles: db.articles,
    settings: db.settings,
    media: db.media,
  };
}

export async function restoreDatabaseBackup(backup: {
  articles?: Article[];
  settings?: SiteSettings;
  media?: MediaFile[];
}): Promise<{ success: boolean; articlesCount: number; mediaCount: number }> {
  const db = ensureLocalDb();

  if (Array.isArray(backup.articles)) {
    db.articles = backup.articles;
  }
  if (backup.settings && typeof backup.settings === 'object') {
    db.settings = { ...db.settings, ...backup.settings };
  }
  if (Array.isArray(backup.media)) {
    db.media = backup.media;
  }

  saveLocalDb(db);

  return {
    success: true,
    articlesCount: db.articles.length,
    mediaCount: db.media.length,
  };
}
