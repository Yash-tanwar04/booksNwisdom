import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Article, MediaFile, SiteSettings } from '@/types';
import {
  initialArticles as INITIAL_ARTICLES,
  initialMediaFiles as INITIAL_MEDIA,
  initialSiteSettings as INITIAL_SITE_SETTINGS,
} from './seed-data';
import { createServerClient } from './supabase/server';
import { calculateReadingTime, extractTextFromContent, slugify } from './utils';

interface LocalDatabase {
  articles: Article[];
  settings: SiteSettings;
  media: MediaFile[];
  site_settings?: SiteSettings;
  media_files?: MediaFile[];
}

// Keep an in-memory cache so warm serverless invocations share state even before Supabase is connected
declare global {
  // eslint-disable-next-line no-var
  var __BW_DB_CACHE__: LocalDatabase | undefined;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(val?: string | null): boolean {
  return Boolean(val && UUID_REGEX.test(val));
}

function toDeterministicUuid(id: string): string {
  if (isUuid(id)) return id;
  const hash = crypto.createHash('md5').update(id).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

// Ensure local .data/db.json exists for immediate out-of-the-box persistence
// On serverless environments (like Vercel) where process.cwd() is read-only,
// gracefully fall back to /tmp/books-and-wisdom-db.json
function getDbFilePath(): string {
  const primaryDir = path.join(process.cwd(), '.data');
  const primaryFile = path.join(primaryDir, 'db.json');
  const tmpFile = path.join('/tmp', 'books-and-wisdom-db.json');

  if (fs.existsSync(tmpFile)) {
    return tmpFile;
  }

  if (fs.existsSync(primaryFile)) {
    try {
      fs.accessSync(primaryFile, fs.constants.W_OK);
      return primaryFile;
    } catch {
      try {
        fs.copyFileSync(primaryFile, tmpFile);
        return tmpFile;
      } catch {
        return primaryFile;
      }
    }
  }

  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    const seed: LocalDatabase = {
      articles: INITIAL_ARTICLES,
      settings: INITIAL_SITE_SETTINGS,
      media: INITIAL_MEDIA,
    };
    fs.writeFileSync(primaryFile, JSON.stringify(seed, null, 2), 'utf-8');
    return primaryFile;
  } catch {
    try {
      const seed: LocalDatabase = {
        articles: INITIAL_ARTICLES,
        settings: INITIAL_SITE_SETTINGS,
        media: INITIAL_MEDIA,
      };
      fs.writeFileSync(tmpFile, JSON.stringify(seed, null, 2), 'utf-8');
      return tmpFile;
    } catch {
      return primaryFile;
    }
  }
}

function loadLocalDb(): LocalDatabase {
  try {
    const filePath = getDbFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as LocalDatabase;
      const normalized: LocalDatabase = {
        articles: Array.isArray(parsed.articles) ? parsed.articles : [...INITIAL_ARTICLES],
        settings: parsed.settings || parsed.site_settings || { ...INITIAL_SITE_SETTINGS },
        media: Array.isArray(parsed.media)
          ? parsed.media
          : Array.isArray(parsed.media_files)
          ? parsed.media_files
          : [...INITIAL_MEDIA],
      };
      globalThis.__BW_DB_CACHE__ = normalized;
      return normalized;
    }
  } catch (err) {
    console.error('Failed to read local DB, using in-memory/seed data:', err);
  }
  if (globalThis.__BW_DB_CACHE__) {
    return globalThis.__BW_DB_CACHE__;
  }
  const fallback: LocalDatabase = {
    articles: [...INITIAL_ARTICLES],
    settings: { ...INITIAL_SITE_SETTINGS },
    media: [...INITIAL_MEDIA],
  };
  globalThis.__BW_DB_CACHE__ = fallback;
  return fallback;
}

function saveLocalDb(data: LocalDatabase): void {
  globalThis.__BW_DB_CACHE__ = data;
  const primaryFile = path.join(process.cwd(), '.data', 'db.json');
  const tmpFile = path.join('/tmp', 'books-and-wisdom-db.json');
  const payload = JSON.stringify(data, null, 2);

  try {
    const dir = path.dirname(primaryFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(primaryFile, payload, 'utf-8');
  } catch {
    try {
      fs.writeFileSync(tmpFile, payload, 'utf-8');
    } catch (err) {
      console.error('Failed to write fallback DB to /tmp:', err);
    }
  }
}

/**
 * Strip fields that might violate Supabase foreign key or UUID constraints
 * (e.g., author_id = 'admin-1' when author_id references auth.users(id))
 */
function toSupabaseArticleRow(article: Article, forceUuidId = false) {
  return {
    id: forceUuidId ? toDeterministicUuid(article.id) : article.id,
    title: article.title,
    subtitle: article.subtitle ?? null,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    cover_image_path: article.cover_image_path ?? null,
    status: article.status,
    published_at: article.published_at ?? null,
    scheduled_at: article.scheduled_at ?? null,
    seo_title: article.seo_title ?? null,
    seo_description: article.seo_description ?? null,
    reading_time_minutes: article.reading_time_minutes ?? 3,
    views_count: 0,
    created_at: article.created_at,
    updated_at: article.updated_at,
  };
}

let isSeedingSupabase = false;

/**
 * Automatically seed Supabase with initial articles and site settings if the Supabase tables are empty
 */
async function ensureSupabaseSeeded(supabase: NonNullable<ReturnType<typeof createServerClient>>) {
  if (isSeedingSupabase) return;
  try {
    const { count, error } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true });

    if (error) {
      // Table may not exist yet or RLS blocks access
      return;
    }

    if (count === 0) {
      isSeedingSupabase = true;
      const localDb = loadLocalDb();
      const seedArticles = localDb.articles.length > 0 ? localDb.articles : INITIAL_ARTICLES;

      // Try inserting with original IDs first; if column is UUID type, retry with deterministic UUIDs
      const rows = seedArticles.map((a) => toSupabaseArticleRow(a, false));
      const { error: insertErr } = await supabase.from('articles').upsert(rows, { onConflict: 'slug' });
      if (insertErr) {
        const uuidRows = seedArticles.map((a) => toSupabaseArticleRow(a, true));
        await supabase.from('articles').upsert(uuidRows, { onConflict: 'slug' });
      }

      // Also seed site_settings if empty
      const { count: settingsCount } = await supabase
        .from('site_settings')
        .select('id', { count: 'exact', head: true });

      if (settingsCount === 0) {
        const s = localDb.settings || INITIAL_SITE_SETTINGS;
        const { id: _ignoreId, ...settingsWithoutId } = s;
        await supabase.from('site_settings').insert(settingsWithoutId);
      }
    }
  } catch (err) {
    console.warn('Supabase auto-seed check skipped:', err);
  } finally {
    isSeedingSupabase = false;
  }
}

// ============================================================================
// PUBLIC & ADMIN ARTICLE QUERIES
// ============================================================================

export async function getPublishedArticles(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; total: number }> {
  const search = options?.search?.trim().toLowerCase() || '';
  const limit = options?.limit || 20;
  const offset = options?.offset || 0;

  // 1. Try Supabase if configured
  const supabase = createServerClient();
  if (supabase) {
    try {
      await ensureSupabaseSeeded(supabase);

      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,subtitle.ilike.%${search}%`);
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);
      if (!error && data) {
        return { articles: data as Article[], total: count || data.length };
      }
    } catch (err) {
      console.warn('Supabase getPublishedArticles fallback to local DB:', err);
    }
  }

  // 2. Fallback to Local DB
  const db = loadLocalDb();

  let filtered = db.articles.filter((a) => a.status === 'published');

  // Sort newest first
  filtered.sort((a, b) => {
    const dateA = a.created_at || a.published_at || '';
    const dateB = b.created_at || b.published_at || '';
    return dateB.localeCompare(dateA);
  });

  if (search) {
    filtered = filtered.filter((a) => {
      const bodyText = extractTextFromContent(a.content).toLowerCase();
      return (
        a.title.toLowerCase().includes(search) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(search)) ||
        a.excerpt.toLowerCase().includes(search) ||
        bodyText.includes(search)
      );
    });
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return { articles: paginated, total };
}

export async function getArticleBySlug(slug: string, includeDrafts = false): Promise<Article | null> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      await ensureSupabaseSeeded(supabase);
      let query = supabase.from('articles').select('*').eq('slug', slug);
      if (!includeDrafts) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return data as Article;
      }
    } catch (err) {
      console.warn('Supabase getArticleBySlug fallback to local DB:', err);
    }
  }

  const db = loadLocalDb();
  const article = db.articles.find(
    (a) => a.slug === slug && (includeDrafts || a.status === 'published')
  );
  return article || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return data as Article;
      }
      if (!isUuid(id)) {
        const uuidId = toDeterministicUuid(id);
        const { data: uuidData, error: uuidErr } = await supabase
          .from('articles')
          .select('*')
          .eq('id', uuidId)
          .maybeSingle();
        if (!uuidErr && uuidData) {
          return uuidData as Article;
        }
      }
    } catch (err) {
      console.warn('Supabase getArticleById fallback to local DB:', err);
    }
  }

  const db = loadLocalDb();
  return db.articles.find((a) => a.id === id || toDeterministicUuid(a.id) === id) || null;
}

export async function getAllArticlesAdmin(options?: {
  search?: string;
  status?: 'all' | 'published' | 'draft' | 'scheduled';
  sort?: 'newest' | 'updated';
}): Promise<Article[]> {
  const search = options?.search?.trim().toLowerCase() || '';
  const status = options?.status || 'all';
  const sort = options?.sort || 'newest';

  const supabase = createServerClient();
  if (supabase) {
    try {
      await ensureSupabaseSeeded(supabase);

      let query = supabase.from('articles').select('*');
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }
      query = query.order(sort === 'updated' ? 'updated_at' : 'created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && data) {
        return data as Article[];
      }
    } catch (err) {
      console.warn('Supabase getAllArticlesAdmin fallback to local DB:', err);
    }
  }

  const db = loadLocalDb();
  let list = [...db.articles];

  if (status !== 'all') {
    list = list.filter((a) => a.status === status);
  }

  if (search) {
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(search) ||
        a.slug.toLowerCase().includes(search) ||
        a.excerpt.toLowerCase().includes(search)
    );
  }

  list.sort((a, b) => {
    const key = sort === 'updated' ? 'updated_at' : 'created_at';
    return b[key].localeCompare(a[key]);
  });

  return list;
}

export async function saveArticle(input: Partial<Article> & { title: string }): Promise<Article> {
  const db = loadLocalDb();
  const now = new Date().toISOString();

  // Check if article already exists in local DB or Supabase
  let existing: Article | null = null;
  if (input.id) {
    existing = await getArticleById(input.id);
  }

  const rawContent = input.content !== undefined ? input.content : existing?.content || { type: 'doc', content: [] };
  const readingTime = calculateReadingTime(rawContent);
  const plainText = extractTextFromContent(rawContent);
  const autoExcerpt = plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '');

  let baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
  if (!baseSlug) baseSlug = `reflection-${Date.now()}`;

  // Ensure slug uniqueness in local DB
  let finalSlug = baseSlug;
  const slugConflictLocal = db.articles.find(
    (a) => a.slug === finalSlug && a.id !== existing?.id && a.id !== input.id
  );
  if (slugConflictLocal) {
    finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  const isPublishing = input.status === 'published';
  const publishedAt = isPublishing
    ? existing?.published_at || input.published_at || now
    : input.status === 'draft'
    ? null
    : existing?.published_at || null;

  const articleId = existing?.id || (input.id && isUuid(input.id) ? input.id : crypto.randomUUID());

  const savedArticle: Article = {
    id: articleId,
    title: input.title.trim() || 'Untitled Reflection',
    subtitle: input.subtitle !== undefined ? input.subtitle : existing?.subtitle || null,
    slug: finalSlug,
    excerpt: (input.excerpt !== undefined ? input.excerpt : existing?.excerpt) || autoExcerpt || 'A personal reflection from Books&Wisdom.',
    content: rawContent,
    cover_image_path:
      input.cover_image_path
        ? input.cover_image_path
        : existing?.cover_image_path || '/images/writings/self-reflection.webp',
    status: input.status || existing?.status || 'draft',
    published_at: publishedAt,
    scheduled_at: input.scheduled_at !== undefined ? input.scheduled_at : existing?.scheduled_at || null,
    seo_title: input.seo_title !== undefined ? input.seo_title : existing?.seo_title || null,
    seo_description:
      input.seo_description !== undefined ? input.seo_description : existing?.seo_description || null,
    reading_time_minutes: readingTime,
    views_count: 0,
    created_at: existing?.created_at || now,
    updated_at: now,
    author_id: existing?.author_id || 'admin-1',
  };

  // 1. Persist to Supabase if configured
  const supabase = createServerClient();
  if (supabase) {
    try {
      await ensureSupabaseSeeded(supabase);

      // Check for slug conflict in Supabase
      const { data: slugCheck } = await supabase
        .from('articles')
        .select('id, slug')
        .eq('slug', savedArticle.slug)
        .maybeSingle();

      if (slugCheck && slugCheck.id !== savedArticle.id && slugCheck.id !== toDeterministicUuid(savedArticle.id)) {
        savedArticle.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      const row = toSupabaseArticleRow(savedArticle, !isUuid(savedArticle.id));
      const { data: upserted, error: upsertErr } = await supabase
        .from('articles')
        .upsert(row, { onConflict: 'id' })
        .select('*')
        .single();

      if (!upsertErr && upserted) {
        savedArticle.id = upserted.id;
      } else if (upsertErr) {
        // Fallback: try upsert with original ID in case table uses TEXT id
        const textRow = toSupabaseArticleRow(savedArticle, false);
        const { data: upsertedText, error: textErr } = await supabase
          .from('articles')
          .upsert(textRow, { onConflict: 'id' })
          .select('*')
          .single();
        if (!textErr && upsertedText) {
          savedArticle.id = upsertedText.id;
        } else {
          console.error('Supabase saveArticle upsert error:', upsertErr.message, textErr?.message);
        }
      }
    } catch (err) {
      console.error('Supabase saveArticle exception:', err);
    }
  }

  // 2. Always persist to Local / In-Memory DB as well
  const existingIdx = db.articles.findIndex(
    (a) => a.id === savedArticle.id || (input.id && a.id === input.id)
  );
  if (existingIdx !== -1) {
    db.articles[existingIdx] = savedArticle;
  } else {
    db.articles.unshift(savedArticle);
  }
  saveLocalDb(db);

  return savedArticle;
}

export async function deleteArticle(id: string): Promise<boolean> {
  let deletedInSupabase = false;
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) deletedInSupabase = true;
      if (!isUuid(id)) {
        await supabase.from('articles').delete().eq('id', toDeterministicUuid(id));
      }
    } catch (err) {
      console.error('Supabase deleteArticle error:', err);
    }
  }

  const db = loadLocalDb();
  const initialLen = db.articles.length;
  db.articles = db.articles.filter((a) => a.id !== id && toDeterministicUuid(a.id) !== id);
  const deletedInLocal = db.articles.length < initialLen;
  if (deletedInLocal) {
    saveLocalDb(db);
  }

  return deletedInSupabase || deletedInLocal;
}

/**
 * Duplicate an existing article as a new draft reflection
 */
export async function duplicateArticle(id: string): Promise<Article | null> {
  const source = await getArticleById(id);
  if (!source) return null;

  return saveArticle({
    title: `${source.title} (Copy)`,
    subtitle: source.subtitle,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    excerpt: source.excerpt,
    content: JSON.parse(JSON.stringify(source.content)),
    cover_image_path: source.cover_image_path,
    status: 'draft',
    published_at: null,
    scheduled_at: null,
    seo_title: source.seo_title,
    seo_description: source.seo_description,
  });
}

// ============================================================================
// SITE SETTINGS QUERIES
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      await ensureSupabaseSeeded(supabase);
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (!error && data) {
        return {
          ...INITIAL_SITE_SETTINGS,
          ...data,
        } as SiteSettings;
      }
    } catch (err) {
      console.warn('Supabase getSiteSettings fallback to local DB:', err);
    }
  }

  const db = loadLocalDb();
  return {
    ...INITIAL_SITE_SETTINGS,
    ...db.settings,
  };
}

export async function updateSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = loadLocalDb();
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...input,
    updated_at: new Date().toISOString(),
  };

  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data: existingRow } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      const { id: _ignoreId, ...payloadWithoutId } = updated as any;
      if (existingRow?.id) {
        await supabase.from('site_settings').update(payloadWithoutId).eq('id', existingRow.id);
      } else {
        await supabase.from('site_settings').insert(payloadWithoutId);
      }
    } catch (err) {
      console.error('Supabase updateSiteSettings error:', err);
    }
  }

  db.settings = updated;
  saveLocalDb(db);
  return updated;
}

// ============================================================================
// MEDIA LIBRARY QUERIES
// ============================================================================

export async function getMediaFiles(): Promise<MediaFile[]> {
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as MediaFile[];
      }
    } catch (err) {
      console.warn('Supabase getMediaFiles fallback to local DB:', err);
    }
  }

  const db = loadLocalDb();
  return db.media || [];
}

export async function addMediaFile(file: Omit<MediaFile, 'id' | 'created_at'>): Promise<MediaFile> {
  const db = loadLocalDb();
  const newMedia: MediaFile = {
    ...file,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .insert(newMedia)
        .select('*')
        .single();
      if (!error && data) {
        newMedia.id = data.id;
      }
    } catch (err) {
      console.error('Supabase addMediaFile error:', err);
    }
  }

  db.media.unshift(newMedia);
  saveLocalDb(db);
  return newMedia;
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  let deletedInSupabase = false;
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('media_files').delete().eq('id', id);
      if (!error) deletedInSupabase = true;
    } catch (err) {
      console.error('Supabase deleteMediaFile error:', err);
    }
  }

  const db = loadLocalDb();
  const initialLen = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  const deletedInLocal = db.media.length < initialLen;
  if (deletedInLocal) {
    saveLocalDb(db);
  }
  return deletedInSupabase || deletedInLocal;
}

// ============================================================================
// ADMIN DASHBOARD STATS & BACKUPS
// ============================================================================

export async function getAdminStats() {
  const allArticles = await getAllArticlesAdmin();
  const mediaFiles = await getMediaFiles();

  const publishedCount = allArticles.filter((a) => a.status === 'published').length;
  const draftsCount = allArticles.filter((a) => a.status === 'draft').length;
  const mediaCount = mediaFiles.length;

  return {
    publishedCount,
    draftsCount,
    mediaCount,
    totalWritings: allArticles.length,
  };
}

export async function exportDatabaseBackup() {
  const articles = await getAllArticlesAdmin();
  const settings = await getSiteSettings();
  const media = await getMediaFiles();

  return {
    version: '1.0',
    exported_at: new Date().toISOString(),
    articles,
    settings,
    media,
  };
}

export async function restoreDatabaseBackup(backupData: {
  articles?: Article[];
  settings?: SiteSettings;
  media?: MediaFile[];
}) {
  const db = loadLocalDb();
  if (Array.isArray(backupData.articles)) {
    db.articles = backupData.articles;
  }
  if (backupData.settings) {
    db.settings = backupData.settings;
  }
  if (Array.isArray(backupData.media)) {
    db.media = backupData.media;
  }
  saveLocalDb(db);

  // If Supabase is configured, sync restored items to Supabase
  const supabase = createServerClient();
  if (supabase) {
    try {
      if (Array.isArray(backupData.articles) && backupData.articles.length > 0) {
        const rows = backupData.articles.map((a) => toSupabaseArticleRow(a, false));
        await supabase.from('articles').upsert(rows, { onConflict: 'slug' });
      }
      if (backupData.settings) {
        const { id: _ignoreId, ...settingsWithoutId } = backupData.settings as any;
        await supabase.from('site_settings').insert(settingsWithoutId);
      }
    } catch (err) {
      console.error('Supabase restore error:', err);
    }
  }

  return {
    articlesCount: db.articles.length,
    mediaCount: db.media.length,
    timestamp: new Date().toISOString(),
  };
}

