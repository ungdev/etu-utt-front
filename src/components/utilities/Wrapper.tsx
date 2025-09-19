'use client';
import styles from './Wrapper.module.scss';
import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';
import { usePageLoaded, usePageSettings } from '@/module/pageSettings';
import GoTo from '@/components/toplevel/GoTo';
import Loader from '@/components/toplevel/Loader';

export default function Wrapper({ children }: { children: ReactNode }) {
  const { hasNavbar } = usePageSettings();
  const { loaded } = usePageLoaded();
  return (
    <>
      <GoTo />
      {hasNavbar && <Navbar />}
      {!loaded && <Loader />}
      <div className={styles.page}>{children}</div>
    </>
  );
}
