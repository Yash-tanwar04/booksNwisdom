import { cookies } from 'next/headers';
import { createServerClient } from './supabase/server';

const ADMIN_COOKIE_NAME = 'bw_admin_session';

export async function isAuthenticated(): Promise<boolean> {
  // 1. Check Supabase Auth if configured
  const supabase = createServerClient();
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return true;
      }
    } catch (e) {
      // Continue to session cookie
    }
  }

  // 2. Check secure admin session cookie
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  // Verify session token
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'bw_secret_session_key_2024_secure';
  return sessionToken === expectedToken;
}

export async function getAdminUser() {
  const isAuth = await isAuthenticated();
  if (!isAuth) return null;

  const supabase = createServerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email || 'admin@booksandwisdom.com',
        name: user.user_metadata?.name || 'Anjali',
      };
    }
  }

  return {
    id: 'admin-anjali',
    email: process.env.ADMIN_EMAIL || 'admin@booksandwisdom.com',
    name: 'Anjali',
  };
}
