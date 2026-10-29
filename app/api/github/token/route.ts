import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GH_COOKIE_NAME, GITHUB_OWNER, GITHUB_REPO, getGitHubToken } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const cookieStore = cookies();
  const cookieToken = cookieStore.get(GH_COOKIE_NAME)?.value;

  const activeToken = envToken || cookieToken;

  if (!activeToken) {
    return NextResponse.json({
      configured: false,
      source: 'none',
      repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    });
  }

  // Verify token with GitHub
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${activeToken}`,
        'User-Agent': 'BooksAndWisdom-Admin',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const repoData = await res.json();
      return NextResponse.json({
        configured: true,
        source: envToken ? 'env' : 'cookie',
        repo: repoData.full_name,
        permissions: repoData.permissions,
        canPush: repoData.permissions?.push ?? false,
      });
    } else {
      return NextResponse.json({
        configured: false,
        source: envToken ? 'env' : 'cookie',
        error: `GitHub returned status ${res.status}. Token may be invalid or expired.`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      configured: false,
      source: envToken ? 'env' : 'cookie',
      error: err.message,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token || !token.trim()) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const cleanToken = token.trim();

    // Verify token with GitHub repo access
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${cleanToken}`,
        'User-Agent': 'BooksAndWisdom-Admin',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.message || 'Invalid GitHub token or insufficient repository permissions.' },
        { status: 401 }
      );
    }

    const repoData = await res.json();
    if (!repoData.permissions?.push) {
      return NextResponse.json(
        { error: 'Token does not have write (push) access to this repository. Please grant "Contents: Read and write" permission.' },
        { status: 403 }
      );
    }

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: GH_COOKIE_NAME,
      value: cleanToken,
      httpOnly: true,
      secure: false, // allow local dev
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return NextResponse.json({
      success: true,
      repo: repoData.full_name,
      message: 'GitHub Token successfully connected and saved!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save token' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(GH_COOKIE_NAME);
  return NextResponse.json({ success: true, message: 'GitHub token removed' });
}
