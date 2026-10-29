-- Books&Wisdom Database Schema Migration
-- Designed for Supabase PostgreSQL with Row Level Security (RLS)

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    cover_image_path TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    reading_time_minutes INTEGER DEFAULT 3,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexing for search, slugs and public listing
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON public.articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles (created_at DESC);

-- 2. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'Books&Wisdom',
    tagline TEXT DEFAULT 'thoughts for a kinder, brighter you ♡',
    author_name TEXT DEFAULT 'Anjali',
    author_intro TEXT DEFAULT 'This is my little corner on the internet where I share my thoughts, experiences and lessons from life. Through my writings, I hope to reflect, grow and maybe connect with someone who feels the same.',
    author_story TEXT DEFAULT 'Books&Wisdom was born from a journal, a quiet room, and a desire to make sense of the tender, messy, and beautiful experience of being human. Here, I write about finding peace within ourselves, navigating transitions, embracing our vulnerabilities, and learning to be gentle along the way.',
    author_image_url TEXT DEFAULT '/images/homepage/author-introduction.webp',
    hero_image_url TEXT DEFAULT '/images/homepage/homepage-hero.webp',
    logo_image_url TEXT DEFAULT '/images/logo_3d_emblem.jpg',
    quote_image_url TEXT DEFAULT '/images/homepage/reflection-background.webp',
    not_found_image_url TEXT DEFAULT '/images/errors/404-lost-page.webp',
    author_note TEXT DEFAULT 'Just a girl who loves reading, writing and finding beauty in little things ♡',
    hero_headline TEXT DEFAULT 'Books&Wisdom',
    hero_subheading TEXT DEFAULT 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
    hero_note TEXT DEFAULT 'Good thoughts, brighter days ♡',
    homepage_quote TEXT DEFAULT 'A little perspective can turn a difficult day into a meaningful one.',
    social_instagram TEXT DEFAULT 'https://instagram.com',
    social_linkedin TEXT DEFAULT 'https://linkedin.com',
    social_email TEXT DEFAULT 'hello@booksandwisdom.com',
    social_twitter TEXT DEFAULT 'https://x.com',
    footer_text TEXT DEFAULT 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
    footer_signoff TEXT DEFAULT 'Good thoughts, Brighter Days ♡',
    seo_default_title TEXT DEFAULT 'Books&Wisdom — Personal Scrapbook & Writings',
    seo_default_description TEXT DEFAULT 'A space for real thoughts, personal journeys and meaningful reflections on life, growth and everything in between.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create media_files table
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path TEXT NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Articles RLS Policies:
-- Public can read ONLY published articles whose publication date has arrived
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (
    status = 'published' AND (published_at IS NULL OR published_at <= NOW())
);

-- Authenticated admins have full access to articles
DROP POLICY IF EXISTS "Admins have full access to articles" ON public.articles;
CREATE POLICY "Admins have full access to articles"
ON public.articles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Site settings RLS Policies:
-- Public can read settings
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can update settings
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Media files RLS Policies:
-- Public can view media
DROP POLICY IF EXISTS "Public can view media files" ON public.media_files;
CREATE POLICY "Public can view media files"
ON public.media_files
FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can upload, modify, and delete media
DROP POLICY IF EXISTS "Admins can manage media files" ON public.media_files;
CREATE POLICY "Admins can manage media files"
ON public.media_files
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage bucket configuration for Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('books-and-wisdom-media', 'books-and-wisdom-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view objects
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'books-and-wisdom-media');

-- Storage RLS: Authenticated admin can upload objects
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'books-and-wisdom-media');

-- Storage RLS: Authenticated admin can update/delete objects
DROP POLICY IF EXISTS "Admin Modify" ON storage.objects;
CREATE POLICY "Admin Modify"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'books-and-wisdom-media');

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'books-and-wisdom-media');
