import Link from 'next/link';
import { Store, ShieldCheck, Heart, Sparkles, MapPin, Users } from 'lucide-react';
import { KEPRI_REGIONS } from '@/lib/constants';

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 mb-3">
          Inisiatif Terbuka & Gotong Royong
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tentang Info UMKM Kepri
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Platform direktori dan etalase digital terbuka yang didedikasikan untuk mengangkat dan
          mempromosikan produk-produk lokal khas Kepulauan Riau ke khalayak luas secara gratis.
        </p>
      </div>

      {/* Nilai Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            100% Gratis & Tanpa Potongan
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tidak ada biaya pendaftaran, biaya langganan, maupun potongan komisi per transaksi. Seluruh hasil penjualan menjadi hak penuh produsen.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            Mudah Diakses Tanpa Ribet
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pencari produk tidak perlu login atau install aplikasi. Pelaku UMKM cukup mendaftar dengan Username & Kata Sandi tanpa verifikasi rumit.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            Koneksi Langsung WhatsApp
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mendorong interaksi tawar-menawar dan kehangatan transaksi personal antara pembeli dan pengrajin lokal melalui WhatsApp.
          </p>
        </div>
      </div>

      {/* 7 Wilayah yang Dicakup */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-8 sm:p-10 mb-16">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl font-bold text-slate-900">
            Mencakup 7 Kabupaten & Kota di Kepri
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Dari gugusan pulau terdepan Natuna dan Anambas, pusat sejarah di Tanjungpinang dan Daik Lingga, hingga pusat industri di Batam dan Karimun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {KEPRI_REGIONS.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 mb-1">
                <MapPin className="h-3.5 w-3.5 text-sky-600" />
                <span>{r.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ajakan Bergabung */}
      <div className="text-center rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900">
          Bergabung Bersama Ratusan UMKM Kepri
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
          Tingkatkan visibilitas produk khas usaha Anda sekarang juga. Daftarkan tokomu secara gratis dalam 1 menit.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Daftar Usaha Baru
          </Link>
          <Link
            href="/produk"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Jelajahi Produk Lainnya
          </Link>
        </div>
      </div>
    </div>
  );
}
