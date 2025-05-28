'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-fit w-150 bg-white text-center px-12 py-6 rounded-4xl shadow-lg">
      <h1 className="text-4xl font-bold text-blue-800 mb-2">404 - Page Not Found</h1>
      <Image
        src="/images/404.webp"
        alt="Server down"
        width={428}
        height={600}
        className="mb-6"
      />
      <p className="text-gray-600 mb-6">
        Looks like you hit a dead end. This road doesn’t exist.
      </p>
      <Button className='cursor-pointer' onClick={() => router.push('/')}>Back to Dashboard</Button>
    </div>
  );
}
