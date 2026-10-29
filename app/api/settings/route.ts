import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteSettings, updateSiteSettings } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
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

    const body = await req.json();

    // Mirror logo file to public/images/logo_mark_circle.png and logo_3d_emblem.jpg if local path
    if (body.logo_image_url && typeof body.logo_image_url === 'string') {
      try {
        const cleanPath = body.logo_image_url.startsWith('/') ? body.logo_image_url.slice(1) : body.logo_image_url;
        const sourcePath = path.join(process.cwd(), 'public', cleanPath);
        const targetPath1 = path.join(process.cwd(), 'public', 'images', 'logo_mark_circle.png');
        const targetPath2 = path.join(process.cwd(), 'public', 'images', 'logo_3d_emblem.jpg');
        if (fs.existsSync(sourcePath)) {
          if (sourcePath !== targetPath1) fs.copyFileSync(sourcePath, targetPath1);
          if (sourcePath !== targetPath2) fs.copyFileSync(sourcePath, targetPath2);
        }
      } catch (err) {
        console.warn('Could not mirror logo_image_url', err);
      }
    }

    const updated = await updateSiteSettings(body);

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return NextResponse.json({ settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
