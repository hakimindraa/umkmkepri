import { db } from '@/lib/db';
import { products, umkmProfiles, categories } from '@/lib/db/schema';
import { eq, desc, and, ilike, or, sql } from 'drizzle-orm';

export interface ProductFilters {
  query?: string;
  regency?: string;
  categorySlug?: string;
  limit?: number;
  offset?: number;
}

// 1. Ambil Semua Produk dengan Filter Wilayah & Kategori
export async function getProducts(filters: ProductFilters = {}) {
  const { query, regency, categorySlug, limit = 24, offset = 0 } = filters;

  const conditions = [eq(products.isActive, true)];

  if (query && query.trim() !== '') {
    const searchPattern = `%${query.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, searchPattern),
        ilike(products.description, searchPattern)
      )!
    );
  }

  if (regency && regency !== 'all') {
    conditions.push(ilike(umkmProfiles.regency, `%${regency}%`));
  }

  if (categorySlug && categorySlug !== 'all') {
    conditions.push(eq(categories.slug, categorySlug));
  }

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      priceUnit: products.priceUnit,
      isNegotiable: products.isNegotiable,
      imageUrls: products.imageUrls,
      createdAt: products.createdAt,
      umkmId: umkmProfiles.id,
      umkmName: umkmProfiles.businessName,
      umkmSlug: umkmProfiles.slug,
      umkmRegency: umkmProfiles.regency,
      umkmWa: umkmProfiles.whatsappNumber,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(umkmProfiles, eq(products.umkmId, umkmProfiles.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

// 2. Ambil Detail Produk berdasarkan Slug
export async function getProductBySlug(slug: string) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      priceUnit: products.priceUnit,
      isNegotiable: products.isNegotiable,
      imageUrls: products.imageUrls,
      createdAt: products.createdAt,
      umkmId: umkmProfiles.id,
      umkmName: umkmProfiles.businessName,
      umkmSlug: umkmProfiles.slug,
      umkmRegency: umkmProfiles.regency,
      umkmAddress: umkmProfiles.address,
      umkmWa: umkmProfiles.whatsappNumber,
      umkmInstagram: umkmProfiles.instagramHandle,
      umkmBio: umkmProfiles.bio,
      umkmLogo: umkmProfiles.logoUrl,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(umkmProfiles, eq(products.umkmId, umkmProfiles.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  return result[0] || null;
}

// 3. Ambil Kategori
export async function getCategories() {
  return await db.select().from(categories).orderBy(categories.name);
}

// 4. Ambil Daftar UMKM
export async function getUmkmProfiles(filters: { regency?: string; limit?: number } = {}) {
  const { regency, limit = 50 } = filters;
  const conditions = [];

  if (regency && regency !== 'all') {
    conditions.push(ilike(umkmProfiles.regency, `%${regency}%`));
  }

  const result = await db
    .select({
      id: umkmProfiles.id,
      name: umkmProfiles.businessName,
      slug: umkmProfiles.slug,
      regency: umkmProfiles.regency,
      address: umkmProfiles.address,
      whatsappNumber: umkmProfiles.whatsappNumber,
      instagramHandle: umkmProfiles.instagramHandle,
      bio: umkmProfiles.bio,
      logoUrl: umkmProfiles.logoUrl,
      createdAt: umkmProfiles.createdAt,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(umkmProfiles)
    .leftJoin(products, and(eq(products.umkmId, umkmProfiles.id), eq(products.isActive, true)))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(umkmProfiles.id)
    .orderBy(desc(umkmProfiles.createdAt))
    .limit(limit);

  return result;
}

// 5. Ambil Profil UMKM Lengkap dengan Daftar Produknya
export async function getUmkmBySlug(slug: string) {
  const profileResult = await db
    .select()
    .from(umkmProfiles)
    .where(eq(umkmProfiles.slug, slug))
    .limit(1);

  const profile = profileResult[0];
  if (!profile) return null;

  const umkmProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      priceUnit: products.priceUnit,
      isNegotiable: products.isNegotiable,
      imageUrls: products.imageUrls,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.umkmId, profile.id), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));

  return {
    ...profile,
    products: umkmProducts,
  };
}

// 6. Ambil Produk untuk Dashboard UMKM
export async function getDashboardProducts(umkmId: string) {
  return await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      priceUnit: products.priceUnit,
      isNegotiable: products.isNegotiable,
      isActive: products.isActive,
      imageUrls: products.imageUrls,
      categoryName: categories.name,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.umkmId, umkmId))
    .orderBy(desc(products.createdAt));
}
