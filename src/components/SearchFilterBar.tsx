'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { KEPRI_REGIONS } from '@/lib/constants';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface SearchFilterBarProps {
  categories: CategoryItem[];
}

export default function SearchFilterBar({ categories }: SearchFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [regency, setRegency] = useState(searchParams.get('regency') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) params.set('q', query.trim());
    if (regency && regency !== 'all') params.set('regency', regency);
    if (category && category !== 'all') params.set('category', category);

    startTransition(() => {
      const queryString = params.toString();
      router.push(`/produk${queryString ? `?${queryString}` : ''}`);
    });
  };

  const handleReset = () => {
    setQuery('');
    setRegency('all');
    setCategory('all');
    router.push('/produk');
  };

  const hasActiveFilters = Boolean(
    searchParams.get('q') ||
      (searchParams.get('regency') && searchParams.get('regency') !== 'all') ||
      (searchParams.get('category') && searchParams.get('category') !== 'all')
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <form onSubmit={handleApplyFilter} className="flex flex-col md:flex-row gap-3">
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama produk, olahan khas, kerajinan..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Filter Wilayah */}
        <div className="w-full md:w-52">
          <select
            value={regency}
            onChange={(e) => {
              setRegency(e.target.value);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-slate-400 focus:bg-white focus:outline-hidden"
          >
            <option value="all">Semua Wilayah Kepri</option>
            {KEPRI_REGIONS.map((reg) => (
              <option key={reg.id} value={reg.name}>
                {reg.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Kategori */}
        <div className="w-full md:w-56">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-slate-400 focus:bg-white focus:outline-hidden"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Cari */}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>{isPending ? 'Memuat...' : 'Terapkan'}</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset Filter"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
