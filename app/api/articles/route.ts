import { NextResponse } from 'next/server';
import { getPublishedArticles, getAllArticlesAdmin, saveArticle } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const status = searchParams.get('status') || undefined;
      const search = searchParams.get('search') || undefined;
      const sort = (searchParams.get('sort') as 'newest' | 'updated') || undefined;

      const articles = await getAllArticlesAdmin({ status, search, sort });
      return NextResponse.json({ articles });
    }

    // Public list
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    const search = searchParams.get('search') || undefined;

    const result = await getPublishedArticles({ limit, offset, search });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const article = await saveArticle(body);
    return NextResponse.json({ article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save article' }, { status: 500 });
  }
}
