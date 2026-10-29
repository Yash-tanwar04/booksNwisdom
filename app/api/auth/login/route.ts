import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

const ADMIN_COOKIE_NAME = 'bw_admin_session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Try Supabase Auth if configured
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session) {
        return NextResponse.json({ success: true, user: data.user });
      }
    }

    // 2. Fallback Admin Auth verification
    const normalizedInputEmail = (email || '').trim().toLowerCase();
    const normalizedInputPass = (password || '').trim();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@booksandwisdom.com').trim().toLowerCase();
    const expectedPass = (process.env.ADMIN_PASSWORD || 'Wisdom#2024').trim();

    // Check email match (accepts full email or 'admin')
    const isEmailValid =
      normalizedInputEmail === expectedEmail ||
      normalizedInputEmail === 'admin' ||
      normalizedInputEmail === 'admin@booksandwisdom.com' ||
      normalizedInputEmail === 'anjali@booksandwisdom.com';

    // Check password match (accepts Wisdom#2024, wisdom#2024, or admin)
    const isPassValid =
      normalizedInputPass === expectedPass ||
      normalizedInputPass === 'Wisdom#2024' ||
      normalizedInputPass === 'wisdom#2024' ||
      normalizedInputPass.toLowerCase() === expectedPass.toLowerCase() ||
      normalizedInputPass === 'admin';

    if (isEmailValid && isPassValid) {
      const sessionToken = process.env.ADMIN_SESSION_SECRET || 'bw_secret_session_key_2024_secure';
      
      const cookieStore = cookies();
      cookieStore.set({
        name: ADMIN_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        path: '/',
        secure: false, // allow http in local dev
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        user: { email: expectedEmail, name: 'Anjali' },
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password. Please verify your credentials.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login error' }, { status: 500 });
  }
}
