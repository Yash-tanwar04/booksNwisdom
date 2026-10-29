'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PenTool,
  BookOpen,
  FileEdit,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { BookLogo } from '../decorations/BookLogo';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/writings/new', label: 'Write a Blog', icon: PenTool },
    { href: '/admin/writings', label: 'All Blogs', icon: BookOpen },
    { href: '/admin/writings?status=draft', label: 'Drafts in Progress', icon: FileEdit, badge: 'Drafts' },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#59413B] text-[#FFF9F3] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header & Logo */}
          <div className="p-5 border-b border-[#70544C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookLogo variant="icon-only" className="!w-10 !h-10 !rounded-xl flex-shrink-0" />
              <div>
                <div className="font-serif text-xl font-bold text-[#FFF9F3] tracking-tight leading-none">
                  Books<span className="italic font-normal text-[#D8A5A0]">&</span>Wisdom
                </div>
                <div className="text-[12px] font-handwriting text-[#D8A5A0] mt-0.5 tracking-wide">
                  author writing studio ♡
                </div>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-[#D8A5A0] hover:text-white hover:bg-[#70544C]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#B87873] text-white shadow-md'
                      : 'text-[#E8D7CC] hover:bg-[#6D514A] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#70544C] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#E8D7CC] hover:bg-[#6D514A] hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span>View Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#D8A5A0] hover:bg-[#6D514A] hover:text-[#FFF9F3] transition-colors text-left"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
