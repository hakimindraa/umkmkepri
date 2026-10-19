'use client';

import { useState, useActionState, useEffect } from 'react';
import { Plus, Edit2, Loader2, AlertCircle, Check, X } from 'lucide-react';
import { adminCreateCategoryAction, adminUpdateCategoryAction } from '@/lib/actions/admin';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconName: string | null;
}

interface AdminCategoryModalProps {
  category?: CategoryItem;
  triggerButton?: React.ReactNode;
}

const AVAILABLE_ICONS = [
  'Package',
  'Utensils',
  'Fish',
  'Sparkles',
  'Shirt',
  'Wheat',
  'Briefcase',
  'Coffee',
  'ShoppingBag',
  'Tag',
  'Heart',
];

export default function AdminCategoryModal({
  category,
  triggerButton,
}: AdminCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = !!category;

  const updateWithId = adminUpdateCategoryAction.bind(null, category?.id || '');
  const [state, formAction, isPending] = useActionState(
    isEditing ? updateWithId : adminCreateCategoryAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setIsOpen(true)}>{triggerButton}</div>
      ) : isEditing ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Edit Kategori"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Perbarui Kategori' : 'Tambah Kategori Produk'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {state?.error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={category?.name || ''}
                  required
                  placeholder="misal: Kerajinan Kain Tenun"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deskripsi Kategori
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={category?.description || ''}
                  placeholder="Penjelasan ringkas produk dalam kategori ini..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ikon Lucide
                </label>
                <select
                  name="iconName"
                  defaultValue={category?.iconName || 'Package'}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>{isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
