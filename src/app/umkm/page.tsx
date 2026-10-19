import { getUmkmProfiles } from '@/lib/data';
import Link from 'next/link';
import { Store, MapPin, MessageCircle, Package } from 'lucide-react';
import { InstagramIcon } from '@/components/Icons';
import RegionFilterPills from '@/components/RegionFilterPills';

interface UmkmPageProps {
  searchParams: Promise<{
    regency?: string;
  }>;
}

export default async function UmkmPage({ searchParams }: UmkmPageProps) {
  const resolvedParams = await searchParams;
  const regency = resolvedParams.regency || 'all';

  const umkmList = await getUmkmProfiles({
    regency,
    limit: 60,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Direktori Pelaku UMKM Kepulauan Riau
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Daftar pengrajin, produsen kuliner khas, dan pengusaha lokal yang terdaftar di 7 Kabupaten/Kota se-Kepri.
        </p>
      </div>

      {/* Filter Wilayah */}
      <div className="mb-8">
        <RegionFilterPills currentRegency={regency} />
      </div>

      {/* Grid UMKM */}
      {umkmList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <Store className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Belum ada UMKM terdaftar di wilayah ini
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Apakah Anda memiliki usaha di wilayah ini? Jadilah yang pertama mendaftar secara gratis.
          </p>
          <div className="mt-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Daftarkan Usaha Anda
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkmList.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-2xs transition-all"
            >
              <div>
                {/* Header Toko */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-slate-900 truncate">
                      <Link href={`/umkm/${item.slug}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-sky-600 shrink-0" />
                      <span>{item.regency}</span>
                    </p>
                  </div>
                </div>

                {/* Bio Ringkas */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {item.bio || 'Pelaku UMKM terdaftar di portal terbuka Info UMKM Kepri.'}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Package className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.productCount} Produk</span>
                  </span>
                  {item.instagramHandle && (
                    <span className="flex items-center gap-1 truncate">
                      <InstagramIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>@{item.instagramHandle.replace(/^@/, '')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Aksi Kunjungi & Chat WA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/umkm/${item.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Lihat Etalase Produk
                </Link>

                <a
                  href={`https://wa.me/${item.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
