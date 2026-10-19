'use client';

import { useActionState } from 'react';
import { registerAction } from '@/lib/actions/auth';
import Link from 'next/link';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { KEPRI_REGIONS } from '@/lib/constants';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Header Form */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-lg mb-3">
            IK
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftarkan Usaha UMKM Anda
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Hanya butuh Username & Kata Sandi. Gratis selamanya, tanpa email & tanpa verifikasi rumit.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {state?.error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Bagian Akun */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                1. Buat Akun Masuk
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="contoh: dapur_batam_berkah"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Gunakan huruf kecil, angka, atau underscore. Ini digunakan untuk login.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Kata Sandi <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Min. 6 karakter"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Ulangi Sandi <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Ketik ulang sandi"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Profil Usaha */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                2. Informasi Usaha & WhatsApp
              </h3>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nama Usaha / Merek <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    placeholder="misal: Kerupuk Gonggong Ibu Sari"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="regency"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Wilayah di Kepri <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="regency"
                      name="regency"
                      required
                      defaultValue=""
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-hidden"
                    >
                      <option value="" disabled>Pilih Kabupaten/Kota</option>
                      {KEPRI_REGIONS.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="whatsappNumber"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      type="tel"
                      required
                      placeholder="0812xxxxxxx"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isPending ? 'Sedang Mendaftarkan...' : 'Daftar & Buat Etalase'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Sudah memiliki akun usaha?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-slate-900 hover:underline"
            >
              Masuk di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
