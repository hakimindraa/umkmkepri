import { getUmkmBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Store, MapPin, MessageCircle, PackageSearch, ChevronRight } from 'lucide-react';
import { InstagramIcon } from '@/components/Icons';
import ProductCard from '@/components/ProductCard';

interface UmkmDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UmkmDetailPage({ params }: UmkmDetailPageProps) {
  const { slug } = await params;
  const umkm = await getUmkmBySlug(slug);

  if (!umkm) {
    notFound();
  }

  let cleanWa = umkm.whatsappNumber.replace(/[^0-9]/g, '');
  if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/umkm" className="hover:text-slate-900 transition-colors">
          Direktori UMKM
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium truncate">{umkm.businessName}</span>
      </nav>

      {/* Header Profil UMKM */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 mb-10 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold text-xl">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {umkm.businessName}
                </h1>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-sky-600" />
                <span className="font-semibold text-slate-700">{umkm.regency}</span>
                {umkm.address && <span>• {umkm.address}</span>}
              </p>
              {umkm.instagramHandle && (
                <p className="mt-1 text-xs text-slate-600 flex items-center gap-1">
                  <InstagramIcon className="h-3.5 w-3.5" />
                  <span>@{umkm.instagramHandle.replace(/^@/, '')}</span>
                </p>
              )}
            </div>
          </div>

          {/* Tombol Hubungi WhatsApp */}
          <div className="w-full sm:w-auto">
            <a
              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                `Halo ${umkm.businessName}, saya melihat profil usaha Anda di katalog Info UMKM Kepri.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bio Usaha */}
        {umkm.bio && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Tentang Usaha Ini
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {umkm.bio}
            </p>
          </div>
        )}
      </div>

      {/* Katalog Produk Toko Ini */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Etalase Produk ({umkm.products.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh produk yang diproduksi dan dijual oleh {umkm.businessName}.
            </p>
          </div>
        </div>

        {umkm.products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <PackageSearch className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600">
              Pelaku UMKM ini belum mengunggah produk ke etalase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {umkm.products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                priceUnit={p.priceUnit}
                isNegotiable={p.isNegotiable}
                imageUrls={p.imageUrls}
                umkmName={umkm.businessName}
                umkmSlug={umkm.slug}
                umkmRegency={umkm.regency}
                categoryName={p.categoryName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
