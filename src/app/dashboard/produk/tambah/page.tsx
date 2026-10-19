'use client';

import { useActionState, useEffect, useState } from 'react';
import { createProductAction } from '@/lib/actions/products';
import Link from 'next/link';
import { ArrowLeft, Plus, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function TambahProdukPage() {
  const [state, formAction, isPending] = useActionState(createProductAction, null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  return (
    <div className="max-w-3xl">
      {/* Header Form */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tambah Produk Baru</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasikan detail produk Anda agar pembeli dapat menemukan dan menghubungi Anda via WhatsApp.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Card Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {state?.error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Nama Produk */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="misal: Kerupuk Atom Natuna Asli Ikan Tongkol"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Kategori & Satuan Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="categoryId"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Kategori
              </label>
              <select
                id="categoryId"
                name="categoryId"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-slate-400 focus:outline-hidden"
              >
                <option value="">Pilih Kategori Produk</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="priceUnit"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Satuan Penjualan
              </label>
              <input
                id="priceUnit"
                name="priceUnit"
                type="text"
                defaultValue="bungkus"
                placeholder="misal: bungkus, kg, toples, pcs, porsi"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Harga & Nego */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label
                htmlFor="price"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Estimasi Harga (Rp)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="500"
                placeholder="misal: 25000 (kosongkan jika fleksibel)"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="isNegotiable"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-0"
                />
                <span className="text-xs font-medium text-slate-700">
                  Harga bisa dinegosiasikan (Nego)
                </span>
              </label>
            </div>
          </div>

          {/* URL Foto Produk */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Tautan / URL Foto Produk
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={imagePreview}
              onChange={(e) => setImagePreview(e.target.value)}
              placeholder="https://contoh.com/foto-produk.jpg"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Masukkan link foto produk online Anda (dari Google Drive publik, Imgur, Cloudinary, atau medsos).
            </p>

            {imagePreview && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-500">Pratinjau Foto:</span>
                <img
                  src={imagePreview}
                  alt="Preview"
                  onError={() => setImagePreview('')}
                  className="h-14 w-14 rounded-lg object-cover border border-slate-200"
                />
              </div>
            )}
          </div>

          {/* Deskripsi Lengkap */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Deskripsi Produk <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Jelaskan bahan baku lokal, daya tahan, berat kemasan, keunggulan rasa/kualitas, dan cara pemesanan..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            ></textarea>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{isPending ? 'Menyimpan...' : 'Tayangkan Produk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
