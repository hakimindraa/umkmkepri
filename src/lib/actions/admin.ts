'use server';

import { db } from '@/lib/db';
import { users, umkmProfiles, products, categories } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createSession, destroySession, requireAdminSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface AdminActionResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

// ----------------------------------------------------
// 1. ADMIN AUTH ACTIONS (Murni Membaca dari .env)
// ----------------------------------------------------

export async function adminLoginAction(
  prevState: AdminActionResponse | null,
  formData: FormData
): Promise<AdminActionResponse> {
  const username = formData.get('username')?.toString().trim();
  const password = formData.get('password')?.toString();

  const expectedUsername = (process.env.ADMIN_USERNAME || 'adminumkm').trim();
  const expectedPassword = process.env.ADMIN_PASSWORD || 'umkmkepri2026';

  if (!username || !password) {
    return { error: 'Username dan kata sandi admin wajib diisi.' };
  }

  // Verifikasi langsung ke environment variables
  if (username !== expectedUsername || password !== expectedPassword) {
    return { error: 'Username atau kata sandi administrator tidak sesuai.' };
  }

  // Buat sesi admin aman
  await createSession({
    userId: 'admin-super-id',
    username: expectedUsername,
    role: 'admin',
    businessName: 'Pengelola Portal',
  });

  redirect('/panel');
}

export async function adminLogoutAction() {
  await destroySession();
  redirect('/panel/login');
}

// ----------------------------------------------------
// 2. MODERASI PRODUK (Takedown & Hapus)
// ----------------------------------------------------

export async function adminToggleProductStatusAction(
  productId: string,
  currentStatus: boolean
): Promise<AdminActionResponse> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: 'Akses ditolak. Sesi admin diperlukan.' };
  }

  try {
    await db
      .update(products)
      .set({
        isActive: !currentStatus,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    revalidatePath('/panel');
    revalidatePath('/panel/produk');
    revalidatePath('/produk');
    revalidatePath('/');

    return {
      success: true,
      message: `Status produk berhasil diubah menjadi ${!currentStatus ? 'Aktif (Tayang)' : 'Nonaktif (Takedown)'}.`,
    };
  } catch (error: any) {
    console.error('Error toggling product status:', error);
    return { error: 'Gagal memperbarui status produk.' };
  }
}

export async function adminDeleteProductAction(productId: string): Promise<AdminActionResponse> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: 'Akses ditolak. Sesi admin diperlukan.' };
  }

  try {
    await db.delete(products).where(eq(products.id, productId));

    revalidatePath('/panel');
    revalidatePath('/panel/produk');
    revalidatePath('/produk');
    revalidatePath('/');

    return { success: true, message: 'Produk berhasil dihapus permanen.' };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { error: 'Gagal menghapus produk.' };
  }
}

// ----------------------------------------------------
// 3. KELOLA & MODERASI UMKM (Hapus Toko Spam)
// ----------------------------------------------------

export async function adminDeleteUmkmAction(umkmId: string): Promise<AdminActionResponse> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: 'Akses ditolak. Sesi admin diperlukan.' };
  }

  try {
    const profile = await db
      .select({ userId: umkmProfiles.userId })
      .from(umkmProfiles)
      .where(eq(umkmProfiles.id, umkmId))
      .limit(1);

    if (profile.length > 0) {
      // Hapus user terkait, otomatis menghapus profil dan produknya secara cascade
      await db.delete(users).where(eq(users.id, profile[0].userId));
    } else {
      await db.delete(umkmProfiles).where(eq(umkmProfiles.id, umkmId));
    }

    revalidatePath('/panel');
    revalidatePath('/panel/umkm');
    revalidatePath('/umkm');
    revalidatePath('/produk');
    revalidatePath('/');

    return { success: true, message: 'Akun toko UMKM dan seluruh produknya berhasil dihapus.' };
  } catch (error: any) {
    console.error('Error deleting UMKM:', error);
    return { error: 'Gagal menghapus akun toko UMKM.' };
  }
}

// ----------------------------------------------------
// 4. KELOLA KATEGORI DAERAH
// ----------------------------------------------------

export async function adminCreateCategoryAction(
  prevState: AdminActionResponse | null,
  formData: FormData
): Promise<AdminActionResponse> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: 'Akses ditolak. Sesi admin diperlukan.' };
  }

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const iconName = formData.get('iconName')?.toString().trim() || 'Package';

  if (!name) {
    return { error: 'Nama kategori wajib diisi.' };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  try {
    await db.insert(categories).values({ name, slug, description, iconName });
    revalidatePath('/panel/kategori');
    revalidatePath('/produk');
    revalidatePath('/');
    return { success: true, message: 'Kategori berhasil ditambahkan.' };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { error: 'Gagal menambahkan kategori. Nama mungkin sudah ada.' };
  }
}

export async function adminUpdateCategoryAction(
  categoryId: string,
  prevState: AdminActionResponse | null,
  formData: FormData
): Promise<AdminActionResponse> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: 'Akses ditolak. Sesi admin diperlukan.' };
  }

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const iconName = formData.get('iconName')?.toString().trim() || 'Package';

  if (!name) {
    return { error: 'Nama kategori wajib diisi.' };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  try {
    await db
      .update(categories)
      .set({ name, slug, description, iconName })
      .where(eq(categories.id, categoryId));

    revalidatePath('/panel/kategori');
    revalidatePath('/produk');
    revalidatePath('/');
    return { success: true, message: 'Kategori berhasil diperbarui.' };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { error: 'Gagal memperbarui kategori.' };
  }
}

export async function adminDeleteCategoryAction(categoryId: string): Promise<AdminActionResponse> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: 'Akses ditolak. Sesi admin diperlukan.' };
  }

  try {
    await db.delete(categories).where(eq(categories.id, categoryId));

    revalidatePath('/panel/kategori');
    revalidatePath('/produk');
    revalidatePath('/');

    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { error: 'Gagal menghapus kategori.' };
  }
}
