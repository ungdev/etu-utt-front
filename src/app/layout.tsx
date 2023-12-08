import '@/global.scss';
import Providers from '../lib/Providers';
import React from 'react';
import Redirecter from '@/components/utilities/Redirecter';
import AutoLogin from '@/components/utilities/AutoLogin';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <Redirecter />
        <AutoLogin />
        <body>{children}</body>
      </Providers>
    </html>
  );
}
