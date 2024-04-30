'use client';

import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';
import { usePageSettings } from '@/module/pageSettings';
import GoTo from '@/components/toplevel/GoTo';

export default function Wrapper({ children }: { children: ReactNode }) {
  const { hasNavbar } = usePageSettings();
  return (
    <>
      <GoTo />
      {hasNavbar && <Navbar />}
      <div style={{ width: '100%', height: '100%' }}>{children}</div>
    </>
  );
}
