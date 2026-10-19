import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, PlusCircle, UserCircle, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { umkmProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.umkmId) {
    redirect('/auth/login');
  }

  // Ambil slug profil UMKM untuk tautan pratinjau publik
  const profile = await db
    .select({ slug: umkmProfiles.slug, name: umkmProfiles.businessName })
    .from(umkmProfiles)
    .where(eq(umkmProfiles.id, session.umkmId))
    .limit(1);

  const profileSlug = profile[0]?.slug;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard Sub-header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Panel Kelola UMKM
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            {profile[0]?.name || session.username}
          </h1>
        </div>

        {profileSlug && (
          <Link
            href={`/umkm/${profileSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Lihat Etalase Publik Anda</span>
          </Link>
        )}
      </div>

      {/* Navigasi Tab Dashboard */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 border-b-2 border-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-900"
        >
          <Package className="h-4 w-4" />
          <span>Produk Saya</span>
        </Link>
        <Link
          href="/dashboard/produk/tambah"
          className="flex items-center gap-2 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Tambah Produk</span>
        </Link>
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-2 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
        >
          <UserCircle className="h-4 w-4" />
          <span>Profil Toko & Kontak</span>
        </Link>
      </div>

      {/* Konten Halaman */}
      <div>{children}</div>
    </div>
  );
}
