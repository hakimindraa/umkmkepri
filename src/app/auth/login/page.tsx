'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth';
import Link from 'next/link';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header Form */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-lg mb-3">
            IK
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke Akun UMKM
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Kelola produk dan informasi usaha Anda di portal Info UMKM Kepri.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          {state?.error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="misal: warung_natuna"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Kata Sandi (Password)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>{isPending ? 'Sedang Masuk...' : 'Masuk Sekarang'}</span>
            </button>
          </form>

          {/* Akun Demo Helper */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Akun Uji Coba (Demo):</span>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span>Username: <strong className="text-slate-800">warung_natuna</strong></span>
              <span>Sandi: <strong className="text-slate-800">kepri123</strong></span>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Belum memiliki akun usaha?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-slate-900 hover:underline"
            >
              Daftar Usaha (Gratis)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
