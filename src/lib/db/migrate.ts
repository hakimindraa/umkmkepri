import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { INITIAL_CATEGORIES } from '../constants';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is missing in environment variables.');
  process.exit(1);
}

const sql = neon(connectionString);

async function runMigration() {
  console.log('--- Memulai migrasi database Info UMKM Kepri ke NeonDB ---');

  try {
    // 1. Buat Tabel Users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'umkm' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Tabel users siap');

    // 2. Buat Tabel UMKM Profiles
    await sql`
      CREATE TABLE IF NOT EXISTS umkm_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_name VARCHAR(150) NOT NULL,
        slug VARCHAR(160) UNIQUE NOT NULL,
        regency VARCHAR(50) NOT NULL,
        address TEXT,
        whatsapp_number VARCHAR(30) NOT NULL,
        instagram_handle VARCHAR(50),
        bio TEXT,
        logo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Tabel umkm_profiles siap');

    // 3. Buat Tabel Categories
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        icon_name VARCHAR(50) DEFAULT 'Package'
      );
    `;
    console.log('✓ Tabel categories siap');

    // 4. Buat Tabel Products
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        umkm_id UUID NOT NULL REFERENCES umkm_profiles(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(220) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price INTEGER DEFAULT 0,
        price_unit VARCHAR(50) DEFAULT 'pcs',
        is_negotiable BOOLEAN DEFAULT FALSE NOT NULL,
        image_urls TEXT[],
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Tabel products siap');

    // 5. Seed Kategori Awal
    console.log('-> Seeding kategori default...');
    for (const cat of INITIAL_CATEGORIES) {
      await sql`
        INSERT INTO categories (name, slug, description, icon_name)
        VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.iconName})
        ON CONFLICT (slug) DO UPDATE
        SET name = EXCLUDED.name,
            description = EXCLUDED.description,
            icon_name = EXCLUDED.icon_name;
      `;
    }
    console.log('✓ Kategori default berhasil disinkronkan');

    // 6. Seed Akun Contoh & Produk Nyata Kepri (Jika belum ada)
    const existingDemoUser = await sql`SELECT id FROM users WHERE username = 'warung_natuna' LIMIT 1;`;

    if (existingDemoUser.length === 0) {
      console.log('-> Membuat data contoh UMKM & Produk khas Kepri...');
      const hashedPassword = await bcrypt.hash('kepri123', 10);

      // Buat User 1: Natuna
      const userNatuna = await sql`
        INSERT INTO users (username, password_hash, name, role)
        VALUES ('warung_natuna', ${hashedPassword}, 'Ibu Rohana', 'umkm')
        RETURNING id;
      `;
      const userId1 = userNatuna[0].id;

      const profileNatuna = await sql`
        INSERT INTO umkm_profiles (
          user_id, business_name, slug, regency, address, whatsapp_number, instagram_handle, bio, logo_url
        ) VALUES (
          ${userId1},
          'Dapur Natuna Bahari',
          'dapur-natuna-bahari',
          'Kabupaten Natuna',
          'Jl. Soekarno-Hatta No. 14, Ranai Kota, Kab. Natuna',
          '6281270001122',
          '@natunabahari',
          'Produsen kerupuk atom dan olahan ikan tongkol asli perairan Natuna dengan bahan ikan segar kualitas terbaik.',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'
        ) RETURNING id;
      `;
      const umkmId1 = profileNatuna[0].id;

      // Ambil ID Kategori Kuliner & Hasil Laut
      const catKuliner = await sql`SELECT id FROM categories WHERE slug = 'kuliner-makanan-ringan' LIMIT 1;`;
      const catHasilLaut = await sql`SELECT id FROM categories WHERE slug = 'hasil-laut-olahan-ikan' LIMIT 1;`;
      const catFashion = await sql`SELECT id FROM categories WHERE slug = 'fashion-batik-kepri' LIMIT 1;`;
      const catKriya = await sql`SELECT id FROM categories WHERE slug = 'kriya-kerajinan-tangan' LIMIT 1;`;

      // Produk 1: Kerupuk Atom Natuna
      await sql`
        INSERT INTO products (
          umkm_id, category_id, name, slug, description, price, price_unit, is_negotiable, image_urls, is_active
        ) VALUES (
          ${umkmId1},
          ${catKuliner[0]?.id || null},
          'Kerupuk Atom Natuna Original (Ikan Tongkol)',
          'kerupuk-atom-natuna-original',
          'Kerupuk bulat khas Pulau Natuna yang gurih dan renyah. Terbuat dari 100% daging ikan tongkol segar pilihan perairan Natuna, tepung sagu asli, dan bumbu rempah alami tanpa pengawet kimia. Cocok untuk oleh-oleh dan camilan keluarga.',
          30000,
          'bungkus (250gr)',
          false,
          ARRAY['https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80'],
          true
        );
      `;

      // Produk 2: Abon Tongkol Asap
      await sql`
        INSERT INTO products (
          umkm_id, category_id, name, slug, description, price, price_unit, is_negotiable, image_urls, is_active
        ) VALUES (
          ${umkmId1},
          ${catHasilLaut[0]?.id || null},
          'Abon Ikan Tongkol Asap Rempah',
          'abon-ikan-tongkol-asap-rempah',
          'Abon ikan tongkol dengan aroma asap khas dan bumbu rempah tradisional gurih pedas manis. Praktis untuk lauk bekal dan sarapan lezat.',
          45000,
          'toples (200gr)',
          false,
          ARRAY['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'],
          true
        );
      `;

      // Buat User 2: Batam Kriya & Batik
      const userBatam = await sql`
        INSERT INTO users (username, password_hash, name, role)
        VALUES ('batik_gonggong_batam', ${hashedPassword}, 'Bambang Irawan', 'umkm')
        RETURNING id;
      `;
      const userId2 = userBatam[0].id;

      const profileBatam = await sql`
        INSERT INTO umkm_profiles (
          user_id, business_name, slug, regency, address, whatsapp_number, instagram_handle, bio, logo_url
        ) VALUES (
          ${userId2},
          'Rumah Batik Gonggong Batam',
          'rumah-batik-gonggong-batam',
          'Kota Batam',
          'Komp. Megamall Blok D-12, Batam Centre, Kota Batam',
          '6281364003344',
          '@batikgonggong_btm',
          'Pusat kreasi batik kontemporer Kepulauan Riau bermotif biota laut Gonggong khas Batam dengan bahan katun primissima halus.',
          'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=200&auto=format&fit=crop&q=80'
        ) RETURNING id;
      `;
      const umkmId2 = profileBatam[0].id;

      // Produk 3: Kain Batik Gonggong
      await sql`
        INSERT INTO products (
          umkm_id, category_id, name, slug, description, price, price_unit, is_negotiable, image_urls, is_active
        ) VALUES (
          ${umkmId2},
          ${catFashion[0]?.id || null},
          'Kain Batik Cap Halus Motif Gonggong Pesisir',
          'kain-batik-cap-motif-gonggong-pesisir',
          'Kain batik tulis/cap motif khas siput gonggong yang melambangkan kekayaan laut Kepri. Menggunakan katun primissima lembut, adem dipakai untuk kemeja formal maupun seragam instansi.',
          185000,
          'potong (2 meter)',
          true,
          ARRAY['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'],
          true
        );
      `;

      // Buat User 3: Tanjungpinang & Bintan
      const userTpi = await sql`
        INSERT INTO users (username, password_hash, name, role)
        VALUES ('kriya_jong_melayu', ${hashedPassword}, 'Tengku Ahmad', 'umkm')
        RETURNING id;
      `;
      const userId3 = userTpi[0].id;

      const profileTpi = await sql`
        INSERT INTO umkm_profiles (
          user_id, business_name, slug, regency, address, whatsapp_number, instagram_handle, bio, logo_url
        ) VALUES (
          ${userId3},
          'Bengkel Jong & Kriya Melayu',
          'bengkel-jong-kriya-melayu',
          'Kota Tanjungpinang',
          'Jl. Hang Tuah No. 5, Senggarang, Kota Tanjungpinang',
          '6281177005566',
          '@jongmelayukepri',
          'Pengrajin miniatur perahu layar Jong tradisional dan cinderamata khas budaya pesisir Tanjungpinang & Bintan.',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80'
        ) RETURNING id;
      `;
      const umkmId3 = profileTpi[0].id;

      // Produk 4: Miniatur Perahu Jong
      await sql`
        INSERT INTO products (
          umkm_id, category_id, name, slug, description, price, price_unit, is_negotiable, image_urls, is_active
        ) VALUES (
          ${umkmId3},
          ${catKriya[0]?.id || null},
          'Miniatur Perahu Layar Jong Tradisional Kayu Pulai',
          'miniatur-perahu-layar-jong-kayu-pulai',
          'Prakarya miniatur perahu jong balap khas Kepulauan Riau yang legendaris. Dikerjakan tangan dengan kayu pulai ringan berkualitas dan layar kain parasut warna-warni khas festival laut Kepri.',
          250000,
          'unit',
          true,
          ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'],
          true
        );
      `;

      console.log('✓ Akun demo & produk contoh berhasil dibuat');
    }

    console.log('--- Migrasi dan inisialisasi basis data selesai dengan sukses! ---');
  } catch (error) {
    console.error('Terjadi kesalahan saat migrasi basis data:', error);
    process.exit(1);
  }
}

runMigration();
