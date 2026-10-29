import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getArticleById, saveArticle, deleteArticle } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const isAuth = await isAuthenticated();
    const article = await getArticleById(params.id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (!isAuth && article.status !== 'published') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const explicitToken = req.headers.get('x-github-token') || undefined;
    const existing = await getArticleById(params.id);
    const body = await req.json();
    const updated = await saveArticle({
      ...existing,
      ...body,
      title: body.title || existing?.title || 'Untitled Reflection',
      id: params.id,
    }, explicitToken);

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/writings');
    revalidatePath(`/writings/${updated.slug}`);
    revalidatePath('/admin');
    revalidatePath('/admin/writings');

    return NextResponse.json({ article: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const explicitToken = req.headers.get('x-github-token') || undefined;
    const success = await deleteArticle(params.id, explicitToken);
    if (!success) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/writings');
    revalidatePath('/admin');
    revalidatePath('/admin/writings');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
