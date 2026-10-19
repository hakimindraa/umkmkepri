'use server';

import { db } from '@/lib/db';
import { products, umkmProfiles } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionResponse {
  error?: string;
  success?: boolean;
}

// 1. Tambah Produk Baru
export async function createProductAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !session.umkmId) {
    return { error: 'Anda harus masuk sebagai pelaku UMKM untuk menambah produk.' };
  }

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const categoryId = formData.get('categoryId')?.toString();
  const priceRaw = formData.get('price')?.toString();
  const priceUnit = formData.get('priceUnit')?.toString().trim() || 'pcs';
  const isNegotiable = formData.get('isNegotiable') === 'on';
  const imageUrl = formData.get('imageUrl')?.toString().trim();

  if (!name || !description) {
    return { error: 'Nama produk dan deskripsi wajib diisi.' };
  }

  const price = priceRaw ? parseInt(priceRaw, 10) : 0;

  // Slug generator
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!baseSlug) baseSlug = 'produk-umkm';
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

  const imagesArray = imageUrl ? [imageUrl] : [];

  try {
    await db.insert(products).values({
      umkmId: session.umkmId,
      categoryId: categoryId || null,
      name,
      slug,
      description,
      price: isNaN(price) ? 0 : price,
      priceUnit,
      isNegotiable,
      imageUrls: imagesArray,
      isActive: true,
    });

    revalidatePath('/dashboard');
    revalidatePath('/produk');
    revalidatePath('/');
  } catch (err: any) {
    console.error('Error creating product:', err);
    return { error: 'Gagal menambahkan produk. Silakan coba lagi.' };
  }

  redirect('/dashboard');
}

// 2. Perbarui Produk
export async function updateProductAction(
  productId: string,
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !session.umkmId) {
    return { error: 'Sesi kedaluwarsa. Silakan masuk kembali.' };
  }

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const categoryId = formData.get('categoryId')?.toString();
  const priceRaw = formData.get('price')?.toString();
  const priceUnit = formData.get('priceUnit')?.toString().trim() || 'pcs';
  const isNegotiable = formData.get('isNegotiable') === 'on';
  const isActive = formData.get('isActive') === 'on';
  const imageUrl = formData.get('imageUrl')?.toString().trim();

  if (!name || !description) {
    return { error: 'Nama produk dan deskripsi wajib diisi.' };
  }

  const price = priceRaw ? parseInt(priceRaw, 10) : 0;
  const imagesArray = imageUrl ? [imageUrl] : [];

  try {
    await db
      .update(products)
      .set({
        name,
        description,
        categoryId: categoryId || null,
        price: isNaN(price) ? 0 : price,
        priceUnit,
        isNegotiable,
        isActive,
        imageUrls: imagesArray,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, productId), eq(products.umkmId, session.umkmId)));

    revalidatePath('/dashboard');
    revalidatePath('/produk');
    revalidatePath(`/produk/${productId}`);
    revalidatePath('/');
  } catch (err: any) {
    console.error('Error updating product:', err);
    return { error: 'Gagal memperbarui produk.' };
  }

  redirect('/dashboard');
}

// 3. Hapus Produk
export async function deleteProductAction(productId: string) {
  const session = await getSession();
  if (!session || !session.umkmId) {
    return { error: 'Tidak berwenang.' };
  }

  try {
    await db
      .delete(products)
      .where(and(eq(products.id, productId), eq(products.umkmId, session.umkmId)));

    revalidatePath('/dashboard');
    revalidatePath('/produk');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Error deleting product:', err);
    return { error: 'Gagal menghapus produk.' };
  }
}

// 4. Perbarui Profil UMKM
export async function updateUmkmProfileAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session || !session.umkmId) {
    return { error: 'Sesi tidak ditemukan.' };
  }

  const businessName = formData.get('businessName')?.toString().trim();
  const regency = formData.get('regency')?.toString().trim();
  const address = formData.get('address')?.toString().trim();
  const whatsappNumber = formData.get('whatsappNumber')?.toString().trim();
  const instagramHandle = formData.get('instagramHandle')?.toString().trim();
  const bio = formData.get('bio')?.toString().trim();
  const logoUrl = formData.get('logoUrl')?.toString().trim();

  if (!businessName || !regency || !whatsappNumber) {
    return { error: 'Nama usaha, wilayah kabupaten/kota, dan nomor WhatsApp wajib diisi.' };
  }

  let cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  if (cleanWa.startsWith('0')) {
    cleanWa = '62' + cleanWa.slice(1);
  } else if (cleanWa.startsWith('8')) {
    cleanWa = '628' + cleanWa.slice(1);
  }

  try {
    await db
      .update(umkmProfiles)
      .set({
        businessName,
        regency,
        address,
        whatsappNumber: cleanWa,
        instagramHandle: instagramHandle?.replace('@', ''),
        bio,
        logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(umkmProfiles.id, session.umkmId));

    revalidatePath('/dashboard/profil');
    revalidatePath(`/umkm`);
    revalidatePath(`/`);
    return { success: true };
  } catch (err) {
    console.error('Error updating profile:', err);
    return { error: 'Gagal memperbarui profil usaha.' };
  }
}
