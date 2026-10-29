import { cookies } from 'next/headers';

export const GITHUB_OWNER = process.env.GITHUB_REPO_OWNER || 'Yash-tanwar04';
export const GITHUB_REPO = process.env.GITHUB_REPO_NAME || 'booksNwisdom';
export const GITHUB_BRANCH = process.env.GITHUB_REPO_BRANCH || 'main';
export const GITHUB_DB_PATH = '.data/db.json';
export const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_DB_PATH}`;

export const GH_COOKIE_NAME = 'bw_gh_token';

/**
 * Retrieve GitHub Personal Access Token from Environment or Admin Cookie
 */
export function getGitHubToken(): string | null {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim()) {
    return process.env.GITHUB_TOKEN.trim();
  }
  if (process.env.GH_TOKEN && process.env.GH_TOKEN.trim()) {
    return process.env.GH_TOKEN.trim();
  }
  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get(GH_COOKIE_NAME)?.value;
    if (cookieToken && cookieToken.trim()) {
      return cookieToken.trim();
    }
  } catch {
    // cookies() might not be available outside request contexts
  }
  return null;
}

/**
 * Fetch the latest database JSON directly from GitHub API (instant raw JSON without CDN delay)
 */
export async function fetchFromGitHubRaw(): Promise<any | null> {
  const token = getGitHubToken();
  try {
    // 1. Primary: GitHub API with raw accept header (100% real-time, zero Fastly caching)
    const headers: Record<string, string> = {
      'User-Agent': 'BooksAndWisdom-Fetcher',
      Accept: 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_DB_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers,
        cache: 'no-store',
      }
    );

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && Array.isArray(data.articles)) {
        return data;
      }
    }

    // 2. Secondary fallback: raw.githubusercontent.com
    const rawRes = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'User-Agent': 'BooksAndWisdom-RawFetcher' },
    });
    if (rawRes.ok) {
      const data = await rawRes.json();
      if (data && Array.isArray(data.articles)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from GitHub raw:', err);
  }
  return null;
}

/**
 * Get current file SHA on GitHub
 */
export async function getGitHubFileSha(token?: string | null): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'BooksAndWisdom-Admin',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_DB_PATH}?ref=${GITHUB_BRANCH}`,
      { headers, cache: 'no-store' }
    );

    if (res.ok) {
      const data = await res.json();
      return data.sha || null;
    }
  } catch (err) {
    console.error('Failed to get GitHub file SHA:', err);
  }
  return null;
}

/**
 * Commit updated database JSON directly to GitHub repository
 */
export async function commitToGitHub(
  data: any,
  commitMessage: string,
  explicitToken?: string | null
): Promise<{ success: boolean; error?: string; commitSha?: string }> {
  const token = explicitToken || getGitHubToken();

  if (!token) {
    return {
      success: false,
      error: 'GitHub Token is missing. Please add GITHUB_TOKEN to Vercel or your Admin Settings.',
    };
  }

  try {
    // 1. Get current SHA
    const sha = await getGitHubFileSha(token);

    // 2. Prepare JSON content
    const contentString = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentString, 'utf-8').toString('base64');

    // 3. Commit via GitHub REST API
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_DB_PATH}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'BooksAndWisdom-Admin',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage || 'Update articles via Books&Wisdom Studio',
          content: contentBase64,
          sha: sha || undefined,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    const result = await res.json();

    if (res.ok && result.commit) {
      return {
        success: true,
        commitSha: result.commit.sha,
      };
    } else {
      return {
        success: false,
        error: result.message || 'GitHub commit failed.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error communicating with GitHub API.',
    };
  }
}
