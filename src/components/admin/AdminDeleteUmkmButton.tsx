'use client';

import { useTransition } from 'react';
import { adminDeleteUmkmAction } from '@/lib/actions/admin';
import { Trash2, Loader2 } from 'lucide-react';

export default function AdminDeleteUmkmButton({
  umkmId,
  businessName,
}: {
  umkmId: string;
  businessName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        `PERINGATAN ADMIN: Apakah Anda yakin ingin menghapus akun toko "${businessName}"? Seluruh produk milik toko ini juga akan terhapus otomatis.`
      )
    ) {
      startTransition(async () => {
        await adminDeleteUmkmAction(umkmId);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Hapus Toko & Seluruh Produknya"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 text-xs font-semibold transition-colors"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      <span>Hapus Toko</span>
    </button>
  );
}
