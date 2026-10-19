import Link from 'next/link';
import { MapPin, Store, Tag } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  priceUnit: string | null;
  isNegotiable: boolean;
  imageUrls: string[] | null;
  umkmName: string;
  umkmSlug: string;
  umkmRegency: string;
  categoryName?: string | null;
}

export default function ProductCard({
  name,
  slug,
  price,
  priceUnit,
  isNegotiable,
  imageUrls,
  umkmName,
  umkmSlug,
  umkmRegency,
  categoryName,
}: ProductCardProps) {
  const imageUrl = imageUrls && imageUrls.length > 0
    ? imageUrls[0]
    : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';

  const formatPrice = (val: number | null) => {
    if (!val || val === 0) return 'Hubungi Toko';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-sm">
      {/* Gambar Produk */}
      <Link href={`/produk/${slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badge Wilayah */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-xs px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-xs border border-slate-200/80">
            <MapPin className="h-3 w-3 text-sky-600" />
            {umkmRegency.replace('Kabupaten ', 'Kab. ')}
          </span>
        </div>
      </Link>

      {/* Konten & Info Produk */}
      <div className="flex flex-1 flex-col p-4">
        {/* Kategori */}
        {categoryName && (
          <span className="mb-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {categoryName}
          </span>
        )}

        {/* Judul Produk */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
          <Link href={`/produk/${slug}`}>{name}</Link>
        </h3>

        {/* Pemilik UMKM */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Store className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <Link
            href={`/umkm/${umkmSlug}`}
            className="hover:text-slate-800 hover:underline truncate"
          >
            {umkmName}
          </Link>
        </div>

        {/* Harga & Status Nego */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">
              {formatPrice(price)}
              {price && price > 0 && priceUnit ? (
                <span className="text-xs font-normal text-slate-500"> /{priceUnit}</span>
              ) : null}
            </div>
            {isNegotiable && (
              <span className="text-[11px] text-emerald-600 font-medium">Bisa Nego</span>
            )}
          </div>

          <Link
            href={`/produk/${slug}`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
