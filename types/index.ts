export type ArticleStatus = 'draft' | 'scheduled' | 'published';

export interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  excerpt: string;
  content: any; // TipTap JSON structure or HTML string
  cover_image_path?: string | null;
  status: ArticleStatus;
  published_at?: string | null;
  scheduled_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  reading_time_minutes: number;
  views_count?: number;
  created_at: string;
  updated_at: string;
  author_id?: string | null;
}

export interface SiteSettings {
  id?: string;
  site_name: string;
  tagline: string;
  author_name: string;
  author_intro: string;
  author_story: string;
  author_image_url: string;
  hero_image_url?: string;
  logo_image_url?: string;
  quote_image_url?: string;
  not_found_image_url?: string;
  author_note: string;
  hero_headline: string;
  hero_subheading: string;
  hero_note: string;
  homepage_quote: string;
  social_instagram: string;
  social_linkedin: string;
  social_email: string;
  social_twitter: string;
  footer_text: string;
  footer_signoff: string;
  seo_default_title: string;
  seo_default_description: string;
  updated_at?: string;
}

export interface MediaFile {
  id: string;
  file_path: string;
  url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  alt_text?: string | null;
  created_at: string;
}

export interface SearchResult {
  article: Article;
  matchedField: 'title' | 'excerpt' | 'content';
  snippet: string;
}
