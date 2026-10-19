import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table (Murni Username & Password)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }),
  role: varchar('role', { length: 20 }).default('umkm').notNull(), // 'umkm' | 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. UMKM Profiles
export const umkmProfiles = pgTable('umkm_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  businessName: varchar('business_name', { length: 150 }).notNull(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  regency: varchar('regency', { length: 50 }).notNull(), // Batam, Tanjungpinang, Bintan, Karimun, Lingga, Natuna, Kepulauan Anambas
  address: text('address'),
  whatsappNumber: varchar('whatsapp_number', { length: 30 }).notNull(),
  instagramHandle: varchar('instagram_handle', { length: 50 }),
  bio: text('bio'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  iconName: varchar('icon_name', { length: 50 }).default('Package'),
});

// 4. Products Table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  umkmId: uuid('umkm_id')
    .references(() => umkmProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 220 }).notNull().unique(),
  description: text('description').notNull(),
  price: integer('price').default(0), // dalam Rupiah
  priceUnit: varchar('price_unit', { length: 50 }).default('pcs'), // pcs, bungkus, kg, toples, meter
  isNegotiable: boolean('is_negotiable').default(false).notNull(),
  imageUrls: text('image_urls').array(), // daftar URL foto produk
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(umkmProfiles, {
    fields: [users.id],
    references: [umkmProfiles.userId],
  }),
}));

export const umkmProfilesRelations = relations(umkmProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [umkmProfiles.userId],
    references: [users.id],
  }),
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  umkm: one(umkmProfiles, {
    fields: [products.umkmId],
    references: [umkmProfiles.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UmkmProfile = typeof umkmProfiles.$inferSelect;
export type NewUmkmProfile = typeof umkmProfiles.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
