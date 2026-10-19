'use client';

import { useTransition } from 'react';
import { adminDeleteProductAction } from '@/lib/actions/admin';
import { Trash2, Loader2 } from 'lucide-react';

export default function AdminDeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Sebagai admin, Anda akan menghapus permanen produk "${productName}". Lanjutkan?`)) {
      startTransition(async () => {
        await adminDeleteProductAction(productId);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Hapus Produk Permanen"
      className="inline-flex items-center justify-center p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-colors"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
