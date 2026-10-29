import { createClient } from '@supabase/supabase-js';

export function normalizeSupabaseUrl(rawUrl?: string): string | null {
  if (!rawUrl) return null;
  let url = rawUrl.trim();

  // If user pasted dashboard URL: https://supabase.com/dashboard/project/ixyusueytlwqricjjgxw...
  const dashboardMatch = url.match(/\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // If user passed bare project ID: ixyusueytlwqricjjgxw
  if (/^[a-zA-Z0-9]{15,25}$/.test(url)) {
    return `https://${url}.supabase.co`;
  }

  // If missing https://
  if (url.includes('.supabase.co') && !url.startsWith('http')) {
    return `https://${url}`;
  }

  return url;
}

export function createServerClient() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const supabaseUrl = normalizeSupabaseUrl(rawUrl);

  // Prefer Service Role Key on the server so admin CRUD operations bypass RLS restrictions,
  // while falling back to the Anon / Publishable key if Service Role Key is not set.
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
        });
      },
    },
  });
}
