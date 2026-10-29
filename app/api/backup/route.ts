import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { exportDatabaseBackup, restoreDatabaseBackup } from '@/lib/db';

export async function GET() {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backup = await exportDatabaseBackup();
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `books-and-wisdom-backup-${dateStr}.json`;

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
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

    const backupData = await req.json();
    if (!backupData || (!backupData.articles && !backupData.settings)) {
      return NextResponse.json(
        { error: 'Invalid backup file structure. Missing articles or settings.' },
        { status: 400 }
      );
    }

    const result = await restoreDatabaseBackup(backupData);
    return NextResponse.json({
      success: true,
      message: `Database restored successfully (${result.articlesCount} articles, ${result.mediaCount} media items).`,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
