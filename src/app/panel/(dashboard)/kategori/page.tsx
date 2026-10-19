import { getCategories } from '@/lib/data';
import { Tag } from 'lucide-react';
import AdminCategoryModal from '@/components/admin/AdminCategoryModal';
import AdminDeleteCategoryButton from '@/components/admin/AdminDeleteCategoryButton';

export default async function AdminKategoriPage() {
  const categoryList = await getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Kategori Khas Kepri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar kategori produk yang digunakan untuk mengelompokkan etalase UMKM di portal.
          </p>
        </div>

        <AdminCategoryModal />
      </div>

      {/* Tabel Kategori */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Kategori</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4">Ikon</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryList.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {cat.slug}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {cat.iconName || 'Package'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <AdminCategoryModal category={cat} />
                      <AdminDeleteCategoryButton categoryId={cat.id} categoryName={cat.name} productCount={0} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
