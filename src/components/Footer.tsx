import Link from 'next/link';
import { KEPRI_REGIONS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Kolom 1: Profil Inisiatif */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-xs font-bold text-white">
                IK
              </span>
              <span className="font-bold text-slate-900 text-base">Info UMKM Kepri</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Katalog terbuka dan portal direktori gratis produk UMKM se-Kepulauan Riau.
              Membantu produsen lokal mempromosikan produk khas daerah tanpa biaya perantara dan
              menghubungkan langsung pembeli dengan pengrajin melalui WhatsApp.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>100% Terbuka, Gratis & Non-Komersial</span>
            </div>
          </div>

          {/* Kolom 2: Jelajah 7 Wilayah Kepri */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              7 Wilayah di Kepri
            </h4>
            <ul className="space-y-1.5 text-sm">
              {KEPRI_REGIONS.map((region) => (
                <li key={region.id}>
                  <Link
                    href={`/produk?regency=${region.name}`}
                    className="hover:text-slate-900 transition-colors"
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Tautan Pintas */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produk" className="hover:text-slate-900 transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/umkm" className="hover:text-slate-900 transition-colors">
                  Daftar Toko & UMKM
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-slate-900 transition-colors font-medium text-slate-800">
                  + Daftarkan Usaha Anda
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-slate-900 transition-colors">
                  Masuk Akun UMKM
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-slate-900 transition-colors">
                  Tentang Portal Ini
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Bawah & Copyright */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 Info UMKM Kepri. Didedikasikan untuk kemajuan ekonomi masyarakat Kepulauan Riau.
          </p>
          <p className="flex items-center gap-1">
            <span>Dirancang ringan & cepat untuk seluruh pulau di Kepri.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
