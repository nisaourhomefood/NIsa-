'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/storefront/navbar';
import { Footer } from '@/components/storefront/footer';

export function StorefrontWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    // Admin pages: no storefront navbar/footer — admin has its own layout
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
