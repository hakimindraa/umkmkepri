import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Guard: Jika belum login atau bukan admin, mental ke /panel/login
  if (!session || session.role !== 'admin') {
    redirect('/panel/login');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/70 text-slate-900">
      <AdminSidebar adminUsername={session.username} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
