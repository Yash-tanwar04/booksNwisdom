import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { duplicateArticle } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const duplicated = await duplicateArticle(params.id);
    if (!duplicated) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      article: duplicated,
      message: `Duplicated "${duplicated.title}" as a new draft reflection.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
