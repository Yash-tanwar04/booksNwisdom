import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPublishedArticles, getAllArticlesAdmin, saveArticle } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const adminMode = searchParams.get('admin') === '1';

    if (adminMode) {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const status = (searchParams.get('status') as any) || 'all';
      const sort = (searchParams.get('sort') as any) || 'newest';
      const articles = await getAllArticlesAdmin({ search, status, sort });
      return NextResponse.json({ articles, total: articles.length });
    }

    const result = await getPublishedArticles({ search, limit, offset });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const explicitToken = req.headers.get('x-github-token') || undefined;
    const body = await req.json();
    const article = await saveArticle({
      id: body.id,
      title: body.title || 'Untitled Reflection',
      subtitle: body.subtitle,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      cover_image_path: body.cover_image_path,
      status: body.status || 'draft',
      published_at: body.published_at,
      scheduled_at: body.scheduled_at,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
    }, explicitToken);

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/writings');
    revalidatePath(`/writings/${article.slug}`);
    revalidatePath('/admin');
    revalidatePath('/admin/writings');

    return NextResponse.json({ article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
