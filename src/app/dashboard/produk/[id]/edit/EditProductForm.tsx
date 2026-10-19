'use client';

import { useActionState, useState } from 'react';
import { updateProductAction } from '@/lib/actions/products';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import type { Product, Category } from '@/lib/db/schema';

export default function EditProductForm({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const updateActionWithId = updateProductAction.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(updateActionWithId, null);

  const initialImage = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '';
  const [imageUrl, setImageUrl] = useState(initialImage);

  return (
    <div>
      {/* Header Form */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Edit Rincian Produk</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui data harga, stok, deskripsi, atau foto produk Anda.
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
          {/* Status Tayang */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={product.isActive}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Status Tayang Publik
                </span>
                <span className="text-[11px] text-slate-500">
                  Centang untuk menampilkan produk di katalog publik Info UMKM Kepri.
                </span>
              </div>
            </label>
          </div>

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
              defaultValue={product.name}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Kategori & Satuan */}
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
                defaultValue={product.categoryId || ''}
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
                defaultValue={product.priceUnit || 'pcs'}
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
                defaultValue={product.price || 0}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="isNegotiable"
                  type="checkbox"
                  defaultChecked={product.isNegotiable}
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
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
            />
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-500">Pratinjau Foto:</span>
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={() => setImageUrl('')}
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
              defaultValue={product.description}
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
              <Save className="h-4 w-4" />
              <span>{isPending ? 'Menyimpan...' : 'Perbarui Produk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
