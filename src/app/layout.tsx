import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppShell from '@/components/AppShell';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Info UMKM Kepri - Katalog Terbuka Produk UMKM Kepulauan Riau',
  description:
    'Portal direktori informasi dan etalase gratis produk UMKM se-Kepulauan Riau (Batam, Tanjungpinang, Bintan, Karimun, Lingga, Natuna, Anambas). Terbuka, tanpa biaya, dan terhubung langsung via WhatsApp.',
  keywords: [
    'UMKM Kepri',
    'Produk Kepulauan Riau',
    'Oleh-oleh Batam',
    'Kuliner Tanjungpinang',
    'Kerupuk Atom Natuna',
    'Luti Gendang Anambas',
    'Batik Gonggong',
    'Kriya Melayu',
  ],
};

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 h-16" />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900 font-sans">
        <AppShell
          navbar={
            <Suspense fallback={<NavbarFallback />}>
              <Navbar />
            </Suspense>
          }
          footer={<Footer />}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
