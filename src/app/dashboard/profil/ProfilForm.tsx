'use client';

import { useActionState, useState } from 'react';
import { updateUmkmProfileAction } from '@/lib/actions/products';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { KEPRI_REGIONS } from '@/lib/constants';
import type { UmkmProfile } from '@/lib/db/schema';

export default function ProfilForm({ profile }: { profile: UmkmProfile }) {
  const [state, formAction, isPending] = useActionState(updateUmkmProfileAction, null);
  const [logoPreview, setLogoPreview] = useState(profile?.logoUrl || '');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Profil Usaha & Kontak</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Informasi ini akan ditampilkan kepada calon pembeli di halaman publik etalase Anda.
        </p>
      </div>

      {/* Card Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {state?.error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.success && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>Profil usaha Anda berhasil diperbarui!</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Nama Usaha */}
          <div>
            <label
              htmlFor="businessName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nama Usaha / Merek <span className="text-red-500">*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              defaultValue={profile?.businessName || ''}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Wilayah & Nomor WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="regency"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Wilayah Kabupaten / Kota <span className="text-red-500">*</span>
              </label>
              <select
                id="regency"
                name="regency"
                required
                defaultValue={profile?.regency || ''}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-slate-400 focus:outline-hidden"
              >
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
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                required
                defaultValue={profile?.whatsappNumber || ''}
                placeholder="0812xxxxxxx"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Digunakan sebagai nomor tujuan tombol beli langsung bagi calon pelanggan.
              </p>
            </div>
          </div>

          {/* Instagram & Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="instagramHandle"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Akun Instagram (Opsional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  @
                </span>
                <input
                  id="instagramHandle"
                  name="instagramHandle"
                  type="text"
                  defaultValue={profile?.instagramHandle || ''}
                  placeholder="namatoko"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="logoUrl"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                URL Logo / Foto Toko (Opsional)
              </label>
              <input
                id="logoUrl"
                name="logoUrl"
                type="url"
                value={logoPreview}
                onChange={(e) => setLogoPreview(e.target.value)}
                placeholder="https://contoh.com/logo.jpg"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Alamat Fisik */}
          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Alamat Lengkap Usaha / Toko Fisik
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={profile?.address || ''}
              placeholder="Jl. Merdeka No. 10, Kecamatan, Kelurahan..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Bio / Tentang Toko */}
          <div>
            <label
              htmlFor="bio"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Profil / Bio Singkat Usaha
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile?.bio || ''}
              placeholder="Ceritakan tentang sejarah usaha Anda, bahan khas yang digunakan, atau keunggulan produk Anda..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            ></textarea>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isPending ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
