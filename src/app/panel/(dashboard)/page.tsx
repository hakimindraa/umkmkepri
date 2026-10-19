import { getAdminMetrics } from '@/lib/data/admin';
import Link from 'next/link';
import { Store, Package, CheckCircle2, AlertOctagon, ArrowRight, MapPin } from 'lucide-react';

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics();

  const totalUmkm = metrics.totalUmkm;

  return (
    <div className="space-y-8">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Ringkasan & Metrik Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pantau sebaran usaha dan pertumbuhan produk UMKM di 7 Kabupaten/Kota Kepulauan Riau.
        </p>
      </div>

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total UMKM */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Toko UMKM</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{metrics.totalUmkm}</div>
          <p className="mt-1 text-[11px] text-slate-400">Terdaftar di direktori Kepri</p>
        </div>

        {/* Total Produk */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Produk</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{metrics.totalProducts}</div>
          <p className="mt-1 text-[11px] text-slate-400">Etalase yang diunggah</p>
        </div>

        {/* Produk Aktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Produk Tayang</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-700">{metrics.activeProducts}</div>
          <p className="mt-1 text-[11px] text-slate-400">Aktif & dapat dilihat publik</p>
        </div>

        {/* Produk Takedown / Nonaktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Produk Nonaktif</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-700">{metrics.inactiveProducts}</div>
          <p className="mt-1 text-[11px] text-slate-400">Draft atau di-takedown admin</p>
        </div>
      </div>

      {/* Grid: Sebaran Wilayah & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Sebaran 7 Kabupaten/Kota */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Sebaran UMKM di 7 Wilayah</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribusi usaha lokal per Kabupaten / Kota di Kepri.
              </p>
            </div>
            <Link
              href="/panel/umkm"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Kelola Toko</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {metrics.regencyStats.map((item) => {
              const percentage = totalUmkm > 0 ? Math.round((item.count / totalUmkm) * 100) : 0;
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-sky-600" />
                      {item.name}
                    </span>
                    <span className="text-slate-500">
                      <strong>{item.count}</strong> Toko ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Pendaftaran Toko Terbaru */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Pendaftaran Toko Terbaru</h2>
              <Link
                href="/panel/umkm"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {metrics.recentUmkm.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada UMKM terdaftar.</p>
              ) : (
                metrics.recentUmkm.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-[180px]">
                        {u.name}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {u.regency.replace('Kabupaten ', 'Kab. ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/panel/produk"
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>Periksa Moderasi Seluruh Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
