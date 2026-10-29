import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  // If visiting login page, allow directly without sidebar
  const isAuth = await isAuthenticated();

  return (
    <AdminShell isAuthenticated={isAuth}>
      {children}
    </AdminShell>
  );
}
