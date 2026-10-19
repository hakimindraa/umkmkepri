import { db } from '@/lib/db';
import { users, umkmProfiles, products, categories } from '@/lib/db/schema';
import { eq, desc, sql, and, ilike, or } from 'drizzle-orm';
import { KEPRI_REGIONS } from '@/lib/constants';

// 1. Ambil Metrik Ringkasan untuk Dashboard /panel
export async function getAdminMetrics() {
  const [totalUmkmResult, totalProductsResult, activeProductsResult, inactiveProductsResult] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(umkmProfiles),
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(eq(products.isActive, true)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(eq(products.isActive, false)),
    ]);

  // Sebaran per 7 Wilayah di Kepri
  const regencyStats = await Promise.all(
    KEPRI_REGIONS.map(async (reg) => {
      const result = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(umkmProfiles)
        .where(ilike(umkmProfiles.regency, `%${reg.name}%`));

      return {
        id: reg.id,
        name: reg.name,
        count: result[0]?.count || 0,
      };
    })
  );

  // 5 UMKM Pendaftaran Terbaru
  const recentUmkm = await db
    .select({
      id: umkmProfiles.id,
      name: umkmProfiles.businessName,
      slug: umkmProfiles.slug,
      regency: umkmProfiles.regency,
      whatsappNumber: umkmProfiles.whatsappNumber,
      createdAt: umkmProfiles.createdAt,
    })
    .from(umkmProfiles)
    .orderBy(desc(umkmProfiles.createdAt))
    .limit(5);

  // 5 Produk Terbaru
  const recentProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      priceUnit: products.priceUnit,
      isActive: products.isActive,
      umkmName: umkmProfiles.businessName,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(umkmProfiles, eq(products.umkmId, umkmProfiles.id))
    .orderBy(desc(products.createdAt))
    .limit(5);

  return {
    totalUmkm: totalUmkmResult[0]?.count || 0,
    totalProducts: totalProductsResult[0]?.count || 0,
    activeProducts: activeProductsResult[0]?.count || 0,
    inactiveProducts: inactiveProductsResult[0]?.count || 0,
    regencyStats,
    recentUmkm,
    recentProducts,
  };
}

// 2. Ambil Semua Produk untuk Moderasi (/panel/produk)
export async function getAdminProductsList(filters: { search?: string; regency?: string; status?: string } = {}) {
  const { search, regency, status } = filters;
  const conditions = [];

  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(
      or(ilike(products.name, pattern), ilike(umkmProfiles.businessName, pattern))!
    );
  }

  if (regency && regency !== 'all') {
    conditions.push(ilike(umkmProfiles.regency, `%${regency}%`));
  }

  if (status === 'active') {
    conditions.push(eq(products.isActive, true));
  } else if (status === 'inactive') {
    conditions.push(eq(products.isActive, false));
  }

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
      createdAt: products.createdAt,
      umkmId: umkmProfiles.id,
      umkmName: umkmProfiles.businessName,
      umkmSlug: umkmProfiles.slug,
      umkmRegency: umkmProfiles.regency,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(umkmProfiles, eq(products.umkmId, umkmProfiles.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt));
}

// 3. Ambil Daftar UMKM untuk Pengawasan (/panel/umkm)
export async function getAdminUmkmList(filters: { search?: string; regency?: string } = {}) {
  const { search, regency } = filters;
  const conditions = [];

  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(
      or(ilike(umkmProfiles.businessName, pattern), ilike(users.username, pattern))!
    );
  }

  if (regency && regency !== 'all') {
    conditions.push(ilike(umkmProfiles.regency, `%${regency}%`));
  }

  return await db
    .select({
      id: umkmProfiles.id,
      name: umkmProfiles.businessName,
      slug: umkmProfiles.slug,
      regency: umkmProfiles.regency,
      address: umkmProfiles.address,
      whatsappNumber: umkmProfiles.whatsappNumber,
      instagramHandle: umkmProfiles.instagramHandle,
      username: users.username,
      createdAt: umkmProfiles.createdAt,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(umkmProfiles)
    .innerJoin(users, eq(umkmProfiles.userId, users.id))
    .leftJoin(products, eq(products.umkmId, umkmProfiles.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(umkmProfiles.id, users.username)
    .orderBy(desc(umkmProfiles.createdAt));
}
