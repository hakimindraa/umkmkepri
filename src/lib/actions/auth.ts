'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users, umkmProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createSession, destroySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export interface AuthState {
  error?: string;
  success?: boolean;
}

// 1. Aksi Masuk / Login
export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get('username')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  let userRole = 'umkm';
  try {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      return { error: 'Username atau kata sandi tidak sesuai.' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { error: 'Username atau kata sandi tidak sesuai.' };
    }

    userRole = user.role;

    // Ambil profil UMKM terkait (jika ada)
    const profileResult = await db
      .select()
      .from(umkmProfiles)
      .where(eq(umkmProfiles.userId, user.id))
      .limit(1);

    const profile = profileResult[0];

    await createSession({
      userId: user.id,
      username: user.username,
      role: user.role,
      umkmId: profile?.id,
      businessName: profile?.businessName || user.name || 'Admin',
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return { error: 'Terjadi kendala pada server saat masuk. Coba lagi.' };
  }

  redirect('/dashboard');
}

// 2. Aksi Pendaftaran / Register
export async function registerAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get('username')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();
  const businessName = formData.get('businessName')?.toString().trim();
  const regency = formData.get('regency')?.toString().trim();
  const whatsappNumber = formData.get('whatsappNumber')?.toString().trim();

  if (!username || !password || !businessName || !regency || !whatsappNumber) {
    return { error: 'Semua kolom bertanda wajib harus dilengkapi.' };
  }

  if (username.length < 3) {
    return { error: 'Username minimal terdiri dari 3 karakter (huruf, angka, atau garis bawah).' };
  }

  // Validasi format username (hanya alfanumerik dan underscore)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { error: 'Username hanya boleh memuat huruf, angka, dan karakter underscore (_).' };
  }

  if (password.length < 6) {
    return { error: 'Kata sandi minimal 6 karakter.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Konfirmasi kata sandi tidak sama.' };
  }

  try {
    // Cek ketersediaan username
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existing.length > 0) {
      return { error: 'Username tersebut sudah digunakan. Silakan pilih username lain.' };
    }

    // Format nomor WhatsApp: ganti 08xx jadi 628xx
    let cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1);
    } else if (cleanWa.startsWith('8')) {
      cleanWa = '628' + cleanWa.slice(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Buat slug bisnis
    let baseSlug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!baseSlug) baseSlug = `umkm-${username}`;
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    // Simpan ke database
    const newUser = await db
      .insert(users)
      .values({
        username,
        passwordHash,
        name: businessName,
        role: 'umkm',
      })
      .returning({ id: users.id });

    const newProfile = await db
      .insert(umkmProfiles)
      .values({
        userId: newUser[0].id,
        businessName,
        slug,
        regency,
        whatsappNumber: cleanWa,
      })
      .returning({ id: umkmProfiles.id, businessName: umkmProfiles.businessName });

    // Buat sesi login otomatis
    await createSession({
      userId: newUser[0].id,
      username,
      role: 'umkm',
      umkmId: newProfile[0].id,
      businessName: newProfile[0].businessName,
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return { error: 'Gagal mendaftarkan akun. Silakan periksa koneksi data dan coba lagi.' };
  }

  redirect('/dashboard');
}

// 3. Aksi Keluar / Logout
export async function logoutAction() {
  await destroySession();
  redirect('/auth/login');
}
