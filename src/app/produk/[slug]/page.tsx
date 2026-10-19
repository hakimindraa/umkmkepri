import { getProductBySlug, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Store, ChevronRight, ArrowLeft } from 'lucide-react';
import { InstagramIcon } from '@/components/Icons';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Ambil produk terkait dari UMKM atau wilayah yang sama
  const relatedProducts = await getProducts({
    regency: product.umkmRegency,
    limit: 4,
  });

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const mainImage =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80';

  const formatPrice = (val: number | null) => {
    if (!val || val === 0) return 'Hubungi Toko Langsung';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Tombol Kembali */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/produk" className="hover:text-slate-900 transition-colors">
          Katalog
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        {product.categoryName && (
          <>
            <Link
              href={`/produk?category=${product.categorySlug}`}
              className="hover:text-slate-900 transition-colors"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </>
        )}
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Grid Informasi Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Kolom Kiri: Galeri Foto */}
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="relative aspect-4/3 sm:aspect-square w-full">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Thumbnail list jika lebih dari 1 */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {product.imageUrls.map((img, idx) => (
                <div
                  key={idx}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200"
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Rincian Produk & Kontak Direct */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Badge Wilayah & Kategori */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
              <MapPin className="h-3.5 w-3.5 text-sky-600" />
              {product.umkmRegency}
            </span>
            {product.categoryName && (
              <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                {product.categoryName}
              </span>
            )}
          </div>

          {/* Judul Produk */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Harga */}
          <div className="mt-4 pb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.price && product.price > 0 && product.priceUnit && (
                <span className="text-sm text-slate-500 font-medium">/{product.priceUnit}</span>
              )}
            </div>
            {product.isNegotiable && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                * Harga dapat dinegosiasikan untuk pembelian dalam jumlah tertentu.
              </p>
            )}
          </div>

          {/* Tombol Aksi WhatsApp (Direct Contact Tanpa Perantara) */}
          <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Tertarik dengan produk ini?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hubungi produsen langsung melalui WhatsApp untuk pemesanan, ketersediaan stok, atau negosiasi.
              </p>
            </div>
            <WhatsAppButton
              phone={product.umkmWa}
              productName={product.name}
              umkmName={product.umkmName}
              className="w-full text-base py-3.5"
              label="Tanya / Beli via WhatsApp"
            />
          </div>

          {/* Deskripsi Lengkap Produk */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Deskripsi Produk
            </h3>
            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Informasi Profil Produsen UMKM */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 mt-auto">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
                <Store className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {product.umkmName}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{product.umkmRegency}</span>
                </p>
                {product.umkmAddress && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {product.umkmAddress}
                  </p>
                )}
                {product.umkmInstagram && (
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                    <InstagramIcon className="h-3 w-3" />
                    <span>@{product.umkmInstagram.replace(/^@/, '')}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/umkm/${product.umkmSlug}`}
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                Kunjungi Profil Toko & Etalase Lengkap →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Produk Terkait */}
      {filteredRelated.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Produk Lainnya di Wilayah {product.umkmRegency}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredRelated.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                priceUnit={p.priceUnit}
                isNegotiable={p.isNegotiable}
                imageUrls={p.imageUrls}
                umkmName={p.umkmName}
                umkmSlug={p.umkmSlug}
                umkmRegency={p.umkmRegency}
                categoryName={p.categoryName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
