'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { adminDeleteCategoryAction } from '@/lib/actions/admin';

interface AdminDeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export default function AdminDeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: AdminDeleteCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await adminDeleteCategoryAction(categoryId);
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        title="Hapus Kategori"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Hapus Kategori?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Anda akan menghapus kategori <strong className="text-slate-900">&ldquo;{categoryName}&rdquo;</strong>.
              {productCount > 0 ? (
                <span className="block mt-2 text-amber-600 font-medium">
                  Perhatian: Terdapat {productCount} produk yang terhubung. Kategori pada produk tersebut akan diatur menjadi Kosong/Lainnya.
                </span>
              ) : null}
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isPending ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
