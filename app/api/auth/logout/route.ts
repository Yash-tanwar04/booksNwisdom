import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

const ADMIN_COOKIE_NAME = 'bw_admin_session';

export async function POST() {
  const supabase = createServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const cookieStore = cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
