'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      setShowModal(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  return (
    <>
      <header className="flex h-20 w-full shrink-0 items-center justify-between bg-[#f8f9f7] px-8 md:px-12">
        <Link href="/" className="flex items-center gap-2 bg-[#f8f9f7]" prefetch={false}>
          <div className="w-[80px]">
            <CarIcon className="h-6 w-6" />
            <span className="sr-only">Car</span>
          </div>
        </Link>

        <div className="flex gap-4 bg-[#f8f9f7]">
          <Link
            href="/states"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-[#f8f9f7] px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900"
            prefetch={false}
          >
            States
          </Link>
          <Link
            href="/vehicles"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-[#f8f9f7] px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900"
            prefetch={false}
          >
            Vehicles
          </Link>
        </div>

        <div className="w-[80]">
          <button
            onClick={() => setShowModal(true)}
            className="h-9 rounded-md bg-[#f8f9f7] px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300",
          showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="relative bg-white rounded-lg p-8 shadow-lg flex flex-col items-center w-full max-w-md">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          <h2 className="text-lg font-semibold mb-4 text-center">
            Before you leave, would you mind sharing some feedback?
          </h2>

          <div className="flex gap-10">
            <button
              onClick={() => {
                router.push('/feedback');
                setShowModal(false);
              }}
              className="h-9 rounded-md bg-[#1590ef] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 cursor-pointer"
            >
              Leave Feedback
            </button>

            <button
              onClick={handleLogout}
              className="h-9 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface CarIconProps {
  className?: string;
}
function CarIcon({ className }: CarIconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
