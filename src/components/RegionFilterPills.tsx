import Link from 'next/link';
import { KEPRI_REGIONS } from '@/lib/constants';

interface RegionFilterPillsProps {
  currentRegency?: string;
  categorySlug?: string;
}

export default function RegionFilterPills({
  currentRegency = 'all',
  categorySlug = 'all',
}: RegionFilterPillsProps) {
  const buildUrl = (regencyVal: string) => {
    const params = new URLSearchParams();
    if (regencyVal !== 'all') params.set('regency', regencyVal);
    if (categorySlug !== 'all') params.set('category', categorySlug);
    const queryString = params.toString();
    return `/produk${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
      <Link
        href={buildUrl('all')}
        className={`shrink-0 rounded-full px-3.5 py-1.5 font-medium transition-colors ${
          currentRegency === 'all' || !currentRegency
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        }`}
      >
        Semua Wilayah
      </Link>
      {KEPRI_REGIONS.map((region) => {
        const isSelected =
          currentRegency.toLowerCase().includes(region.id) ||
          currentRegency.toLowerCase().includes(region.alias.toLowerCase());

        return (
          <Link
            key={region.id}
            href={buildUrl(region.name)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-medium transition-colors ${
              isSelected
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {region.alias}
          </Link>
        );
      })}
    </div>
  );
}
