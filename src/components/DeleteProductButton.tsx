'use client';

import { useTransition } from 'react';
import { deleteProductAction } from '@/lib/actions/products';
import { Trash2 } from 'lucide-react';

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      startTransition(async () => {
        await deleteProductAction(productId);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Hapus Produk"
      className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
