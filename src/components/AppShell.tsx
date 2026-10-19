'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  navbar: ReactNode;
  footer: ReactNode;
}

export default function AppShell({ children, navbar, footer }: AppShellProps) {
  const pathname = usePathname();
  const isPanel = pathname?.startsWith('/panel') ?? false;

  // Jika di halaman panel admin (/panel/*), sembunyikan navbar & footer publik
  if (isPanel) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
