'use client';

import { useTransition } from 'react';
import { adminToggleProductStatusAction } from '@/lib/actions/admin';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminProductToggle({
  productId,
  currentStatus,
}: {
  productId: string;
  currentStatus: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await adminToggleProductStatusAction(productId, currentStatus);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={currentStatus ? 'Takedown Produk (Nonaktifkan)' : 'Aktifkan Produk'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
        currentStatus
          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
      } disabled:opacity-50`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : currentStatus ? (
        <Eye className="h-3.5 w-3.5" />
      ) : (
        <EyeOff className="h-3.5 w-3.5" />
      )}
      <span>{currentStatus ? 'Tayang' : 'Takedown'}</span>
    </button>
  );
}
