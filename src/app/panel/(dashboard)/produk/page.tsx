import { getAdminProductsList } from '@/lib/data/admin';
import { KEPRI_REGIONS } from '@/lib/constants';
import Link from 'next/link';
import { ExternalLink, Search, PackageSearch } from 'lucide-react';
import AdminProductToggle from '@/components/admin/AdminProductToggle';
import AdminDeleteProductButton from '@/components/admin/AdminDeleteProductButton';

interface AdminProdukPageProps {
  searchParams: Promise<{
    q?: string;
    regency?: string;
    status?: string;
  }>;
}

export default async function AdminProdukPage({ searchParams }: AdminProdukPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const regency = resolvedParams.regency || 'all';
  const status = resolvedParams.status || 'all';

  const products = await getAdminProductsList({
    search: q,
    regency,
    status,
  });

  const formatPrice = (val: number | null) => {
    if (!val || val === 0) return 'Hubungi Toko';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Moderasi Produk UMKM Se-Kepri
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Periksa seluruh produk yang diunggah pelaku usaha. Anda dapat menonaktifkan (*takedown*) produk tak layak atau menghapus produk spam.
        </p>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <form method="GET" action="/panel/produk" className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk atau nama toko..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          <select
            name="regency"
            defaultValue={regency}
            className="rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Wilayah</option>
            {KEPRI_REGIONS.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif (Tayang)</option>
            <option value="inactive">Nonaktif (Takedown)</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Terapkan
          </button>
        </form>
      </div>

      {/* Tabel Produk */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <PackageSearch className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada produk ditemukan</h3>
          <p className="mt-1 text-xs text-slate-400">Coba ubah kata kunci atau filter status.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Toko & Wilayah</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Estimasi Harga</th>
                  <th className="py-3 px-4">Status Moderasi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((item) => {
                  const img =
                    item.imageUrls && item.imageUrls.length > 0
                      ? item.imageUrls[0]
                      : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Produk */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate max-w-xs">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Toko */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block truncate max-w-[140px]">
                          {item.umkmName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.umkmRegency.replace('Kabupaten ', 'Kab. ')}
                        </span>
                      </td>

                      {/* Kategori */}
                      <td className="py-3 px-4 text-slate-700">
                        {item.categoryName || '-'}
                      </td>

                      {/* Harga */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">
                          {formatPrice(item.price)}
                        </span>
                        {item.isNegotiable && (
                          <span className="text-[10px] text-emerald-600 font-medium">Bisa Nego</span>
                        )}
                      </td>

                      {/* Status Moderasi (1-Klik Takedown/Aktifkan) */}
                      <td className="py-3 px-4">
                        <AdminProductToggle
                          productId={item.id}
                          currentStatus={item.isActive}
                        />
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/produk/${item.slug}`}
                            target="_blank"
                            title="Buka Produk di Publik"
                            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <AdminDeleteProductButton
                            productId={item.id}
                            productName={item.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
