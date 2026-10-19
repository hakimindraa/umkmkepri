'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Store,
  Info,
  User,
  PlusCircle,
  LogOut,
  Tags,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { INITIAL_CATEGORIES } from '@/lib/constants';

interface MobileNavProps {
  session: {
    username: string;
    role: string;
    umkmId?: string;
    businessName?: string;
  } | null;
}

export default function MobileNav({ session }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Tutup menu otomatis setiap kali rute berpindah
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/produk', label: 'Katalog Produk', icon: ShoppingBag },
    { href: '/umkm', label: 'Direktori UMKM', icon: Store },
    { href: '/tentang', label: 'Tentang Info UMKM', icon: Info },
  ];

  return (
    <div className="md:hidden">
      {/* Tombol Hamburger / Close */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
        className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop Gelap Layar Penuh di Bawah Header */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu Mengembang di Bawah Navbar */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-5 space-y-6 max-w-lg mx-auto">
            {/* 1. Menu Navigasi Utama */}
            <div>
              <div className="px-1 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Menu Utama
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 2. Jelajah Kategori Produk */}
            <div>
              <div className="px-1 mb-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tags className="h-3.5 w-3.5 text-slate-400" />
                  Kategori Produk
                </span>
                <Link
                  href="/produk"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INITIAL_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/produk?category=${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Akses Akun UMKM */}
            <div className="pt-4 border-t border-slate-200/70">
              {session ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Akun UMKM Terhubung
                    </span>
                    <span className="font-bold text-sm text-slate-900 block truncate">
                      {session.businessName || session.username}
                    </span>
                    <span className="text-xs text-slate-500 block truncate">
                      @{session.username}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    <Store className="h-4 w-4" />
                    <span>Buka Dashboard Toko</span>
                  </Link>

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Keluar Akun</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Area Pelaku UMKM
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Masuk</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Daftar Usaha</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
