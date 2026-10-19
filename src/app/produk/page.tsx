import { getProducts, getCategories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import SearchFilterBar from '@/components/SearchFilterBar';
import RegionFilterPills from '@/components/RegionFilterPills';
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

interface ProdukPageProps {
  searchParams: Promise<{
    q?: string;
    regency?: string;
    category?: string;
  }>;
}

export default async function ProdukPage({ searchParams }: ProdukPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const regency = resolvedParams.regency || 'all';
  const category = resolvedParams.category || 'all';

  const [products, categories] = await Promise.all([
    getProducts({
      query: q,
      regency,
      categorySlug: category,
      limit: 40,
    }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Katalog Produk UMKM Kepri
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Jelajahi seluruh ragam produk olahan, kriya, kuliner, dan fashion dari produsen lokal di 7 Kabupaten/Kota.
        </p>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="space-y-4 mb-8">
        <SearchFilterBar categories={categories} />
        <div className="pt-1">
          <RegionFilterPills currentRegency={regency} categorySlug={category} />
        </div>
      </div>

      {/* Ringkasan Hasil */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
        <div>
          Menampilkan <span className="font-semibold text-slate-800">{products.length}</span> produk
          {regency !== 'all' && <span> di wilayah <strong>{regency}</strong></span>}
          {category !== 'all' && <span> kategori <strong>{categories.find((c) => c.slug === category)?.name || category}</strong></span>}
          {q && <span> dengan kata kunci &ldquo;<strong>{q}</strong>&rdquo;</span>}
        </div>
      </div>

      {/* Grid Produk */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center my-6">
          <PackageSearch className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Tidak ditemukan produk yang sesuai
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian Anda atau pilih filter wilayah dan kategori lainnya.
          </p>
          <div className="mt-4">
            <Link
              href="/produk"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Reset Semua Filter
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
