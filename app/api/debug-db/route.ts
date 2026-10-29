import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getAllArticlesAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY);
  const hasAnonKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  );

  const supabase = createServerClient();
  let supabaseStatus = 'not_configured';
  let supabaseCount = null;
  let supabaseError = null;
  let supabaseArticles: any[] = [];

  if (supabase) {
    supabaseStatus = 'client_initialized';
    try {
      const { data, count, error } = await supabase
        .from('articles')
        .select('id, title, slug, status, published_at, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        supabaseError = {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        };
      } else {
        supabaseCount = count;
        supabaseArticles = data || [];
      }
    } catch (err: any) {
      supabaseError = { message: err?.message };
    }
  }

  const allLocal = await getAllArticlesAdmin();

  return NextResponse.json({
    supabase: {
      status: supabaseStatus,
      url: supabaseUrl ? supabaseUrl.replace(/https:\/\/(.{4}).*(\..*)/, 'https://$1***$2') : null,
      hasServiceRoleKey,
      hasAnonKey,
      count: supabaseCount,
      error: supabaseError,
      articles: supabaseArticles,
    },
    localCache: {
      articlesCount: allLocal.length,
      sampleSlugs: allLocal.slice(0, 5).map((a) => a.slug),
    },
  });
}
