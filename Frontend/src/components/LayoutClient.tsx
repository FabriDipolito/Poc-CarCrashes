'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useEffect, useState } from 'react';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth/login');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className='flex flex-col items-center justify-between h-screen w-screen'>
      {!isAuthPage && <Header />}
      <main className="w-full h-[calc(100%-8rem)] overflow-y-scroll bg-[#f8f9f7] px-8 py-2 grid place-items-center">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
