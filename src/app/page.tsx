import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import RegionFilterPills from '@/components/RegionFilterPills';
import { ArrowRight, Search, ShieldCheck, Sparkles, Store, Users } from 'lucide-react';
import { KEPRI_REGIONS } from '@/lib/constants';

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative border-b border-slate-200 bg-linear-to-b from-slate-50/80 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tag Inisiatif */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>Katalog Terbuka & Gratis • 7 Kabupaten/Kota Kepri</span>
            </div>

            {/* Judul Utama */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Katalog Terbuka Produk UMKM Kepulauan Riau
            </h1>

            {/* Deskripsi */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Temukan aneka kuliner khas, kriya pesisir, batik gonggong, dan olahan hasil laut langsung
              dari produsen lokal. Bebas jelajah tanpa wajib login, hubungi penjual langsung via WhatsApp.
            </p>

            {/* Kotak Pencarian Hero */}
            <form
              action="/produk"
              method="GET"
              className="mt-8 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Cari kerupuk atom, luti gendang, batik..."
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Cari Produk
              </button>
            </form>
          </div>

          {/* Quick Filter 7 Wilayah */}
          <div className="mt-10 pt-6 border-t border-slate-200/70 max-w-4xl mx-auto">
            <div className="text-center mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jelajahi Berdasarkan Wilayah
            </div>
            <RegionFilterPills />
          </div>
        </div>
      </section>

      {/* 2. PRODUK TERBARU & UNGGULAN */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Etalase Produk Unggulan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Produk segar dan karya pengrajin lokal Kepri yang baru ditambahkan.
            </p>
          </div>
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-slate-900 hover:underline"
          >
            <span>Semua Produk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid Produk */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            Belum ada produk yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                priceUnit={p.priceUnit}
                isNegotiable={p.isNegotiable}
                imageUrls={p.imageUrls}
                umkmName={p.umkmName}
                umkmSlug={p.umkmSlug}
                umkmRegency={p.umkmRegency}
                categoryName={p.categoryName}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. KATEGORI UTAMA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Jelajahi Kategori Khas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Temukan produk sesuai kebutuhan Anda, dari kuliner tradisional hingga kriya bahari.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produk?category=${cat.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-2xs transition-all"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                <span>Lihat Produk</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BANNER AJAKAN PRODUSEN (PRODUSEN DAFTAR DENGAN USERNAME & PASSWORD) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-8 sm:p-12 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Punya Usaha di Kepulauan Riau?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Pasarkan produk khas daerah Anda di katalog terbuka ini. Pendaftaran sangat mudah —
            cukup buat <strong>Username & Kata Sandi</strong>, tanpa perlu ribet verifikasi email atau akun Google.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Daftarkan Usaha Anda Sekarang (Gratis)
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Sudah Punya Akun? Masuk di Sini
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
