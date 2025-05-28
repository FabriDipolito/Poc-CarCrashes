import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LoadingTruckProvider } from '@/hooks/useLoadingTruck';
import { NotificationProvider } from '@/components/Notifications/NotificationProvider';
import LayoutClient from '@/components/LayoutClient';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Car Crashes PoC',
  description: 'This is a personal project from Fabricio Dipolito',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-h-screen min-h-screen bg-[#f8f9f7]`}>
        <LoadingTruckProvider>
          <NotificationProvider>
            <LayoutClient>{children}</LayoutClient>
          </NotificationProvider>
        </LoadingTruckProvider>
      </body>
    </html>
  );
}
