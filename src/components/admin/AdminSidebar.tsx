'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PackageCheck,
  Store,
  Tags,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { adminLogoutAction } from '@/lib/actions/admin';

export default function AdminSidebar({ adminUsername }: { adminUsername: string }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Tutup drawer mobile saat rute berubah
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Kunci scroll body saat drawer mobile terbuka
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const navItems = [
    {
      label: 'Ringkasan Metrik',
      href: '/panel',
      icon: LayoutDashboard,
      active: pathname === '/panel',
    },
    {
      label: 'Moderasi Produk',
      href: '/panel/produk',
      icon: PackageCheck,
      active: pathname.startsWith('/panel/produk'),
    },
    {
      label: 'Kelola UMKM',
      href: '/panel/umkm',
      icon: Store,
      active: pathname.startsWith('/panel/umkm'),
    },
    {
      label: 'Kategori Daerah',
      href: '/panel/kategori',
      icon: Tags,
      active: pathname.startsWith('/panel/kategori'),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm tracking-tight shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block leading-tight">
              Panel Pengelola
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Info UMKM Kepri</span>
          </div>
        </div>

        {/* Tombol Tutup Khusus Mobile Drawer */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Menu Pengawasan
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                item.active
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Button */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
              Masuk Sebagai
            </span>
            <span className="text-xs font-bold text-slate-800 truncate block">
              @{adminUsername}
            </span>
          </div>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200">
            Superadmin
          </span>
        </div>

        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-2xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Panel</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Topbar Header (< md) */}
      <div className="md:hidden sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs block leading-tight">
              Panel Pengelola
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Info UMKM Kepri</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-hidden"
          aria-label="Buka menu navigasi admin"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* 2. Mobile Backdrop & Drawer (< md) */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* 3. Desktop Static Sidebar (md:) */}
      <aside className="hidden md:flex md:w-64 border-r border-slate-200 bg-white flex-col shrink-0 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
