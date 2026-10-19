import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { Store, User, LogOut, PlusCircle, Compass } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
            IK
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900">
              Info UMKM Kepri
            </span>
            <span className="text-[11px] text-slate-500 font-medium -mt-1">
              Katalog Terbuka Kepulauan Riau
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link
            href="/"
            className="hover:text-slate-900 transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/produk"
            className="hover:text-slate-900 transition-colors"
          >
            Katalog Produk
          </Link>
          <Link
            href="/umkm"
            className="hover:text-slate-900 transition-colors"
          >
            Direktori UMKM
          </Link>
          <Link
            href="/tentang"
            className="hover:text-slate-900 transition-colors text-slate-500"
          >
            Tentang
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
              >
                <Store className="h-4 w-4" />
                <span>Dashboard ({session.businessName || session.username})</span>
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Keluar"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>Masuk UMKM</span>
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Daftar Usaha</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
