import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getMediaFiles, addMediaFile, deleteMediaFile } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function GET() {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const media = await getMediaFiles();
    return NextResponse.json({ media });
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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('alt_text') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload JPEG, PNG, or WebP.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = `${Date.now()}-${file.name.replace(/[^\w\.\-]/g, '_')}`;

    // 1. Try Supabase Storage if configured
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase.storage
        .from('books-and-wisdom-media')
        .upload(safeName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('books-and-wisdom-media')
          .getPublicUrl(data.path);

        const newMedia = await addMediaFile({
          file_path: data.path,
          url: publicUrlData.publicUrl,
          filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          alt_text: altText,
        });

        return NextResponse.json({ media: newMedia });
      }
    }

    // 2. Local fallback storage in public/uploads/ (with Vercel read-only filesystem fallback to Data URI)
    let fileUrl = `/uploads/${safeName}`;
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);
    } catch {
      // On Vercel serverless without Supabase Storage configured, use inline Data URL so uploads never fail with EROFS
      fileUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const newMedia = await addMediaFile({
      file_path: safeName,
      url: fileUrl,
      filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText,
    });

    return NextResponse.json({ media: newMedia });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    const success = await deleteMediaFile(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
