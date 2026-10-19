import { getSession } from '@/lib/auth/session';
import { getDashboardProducts } from '@/lib/data';
import Link from 'next/link';
import { Plus, Package, Edit, ExternalLink } from 'lucide-react';
import { redirect } from 'next/navigation';
import DeleteProductButton from '@/components/DeleteProductButton';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.umkmId) {
    redirect('/auth/login');
  }

  const products = await getDashboardProducts(session.umkmId);

  const formatPrice = (val: number | null) => {
    if (!val || val === 0) return 'Hubungi Toko';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div>
      {/* Header Bagian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Daftar Produk ({products.length})
          </h2>
          <p className="text-xs text-slate-500">
            Semua produk yang terpasang di etalase toko Anda.
          </p>
        </div>

        <Link
          href="/dashboard/produk/tambah"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {/* Tabel / Grid Produk */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Belum ada produk yang ditambahkan
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Mulai pasang produk UMKM Anda agar dapat ditemukan oleh pencari produk di Kepri.
          </p>
          <div className="mt-5">
            <Link
              href="/dashboard/produk/tambah"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Produk Pertama</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Status</th>
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
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Produk Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate max-w-xs">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3 px-4 text-xs font-medium text-slate-700">
                        {item.categoryName || '-'}
                      </td>

                      {/* Harga */}
                      <td className="py-3 px-4 text-xs">
                        <span className="font-semibold text-slate-900">
                          {formatPrice(item.price)}
                        </span>
                        {item.price && item.price > 0 && item.priceUnit && (
                          <span className="text-slate-500 font-normal"> /{item.priceUnit}</span>
                        )}
                        {item.isNegotiable && (
                          <span className="block text-[10px] text-emerald-600 font-medium">Bisa Nego</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Tayang
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/produk/${item.slug}`}
                            target="_blank"
                            title="Buka Halaman Publik"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/produk/${item.id}/edit`}
                            title="Edit Produk"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteProductButton productId={item.id} productName={item.name} />
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
