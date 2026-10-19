import { getAdminUmkmList } from '@/lib/data/admin';
import { KEPRI_REGIONS } from '@/lib/constants';
import Link from 'next/link';
import { ExternalLink, Search, Store } from 'lucide-react';
import AdminDeleteUmkmButton from '@/components/admin/AdminDeleteUmkmButton';

interface AdminUmkmPageProps {
  searchParams: Promise<{
    q?: string;
    regency?: string;
  }>;
}

export default async function AdminUmkmPage({ searchParams }: AdminUmkmPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const regency = resolvedParams.regency || 'all';

  const umkmList = await getAdminUmkmList({
    search: q,
    regency,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengawasan Pelaku UMKM Se-Kepri
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar seluruh pemilik usaha lokal yang terdaftar di direktori. Anda dapat memeriksa keaslian toko atau menghapus toko spam.
        </p>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <form method="GET" action="/panel/umkm" className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari nama usaha atau username..."
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

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Terapkan
          </button>
        </form>
      </div>

      {/* Tabel UMKM */}
      {umkmList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Store className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Tidak ada UMKM ditemukan</h3>
          <p className="mt-1 text-xs text-slate-400">Coba ubah kata kunci atau filter wilayah.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Toko & Username</th>
                  <th className="py-3 px-4">Wilayah di Kepri</th>
                  <th className="py-3 px-4">Kontak WhatsApp</th>
                  <th className="py-3 px-4">Jumlah Produk</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {umkmList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Toko & Username */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400">@{item.username}</span>
                    </td>

                    {/* Wilayah */}
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {item.regency}
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3 px-4">
                      <a
                        href={`https://wa.me/${item.whatsappNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        +{item.whatsappNumber}
                      </a>
                    </td>

                    {/* Produk */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.productCount} Produk
                    </td>

                    {/* Tanggal Daftar */}
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/umkm/${item.slug}`}
                          target="_blank"
                          title="Lihat Profil Publik"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Etalase</span>
                        </Link>
                        <AdminDeleteUmkmButton
                          umkmId={item.id}
                          businessName={item.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
