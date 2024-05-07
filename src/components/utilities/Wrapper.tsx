'use client';
import styles from './Wrapper.module.scss';
import Navbar from '@/components/Navbar';
import React, { ReactNode, useEffect } from 'react';
import { usePageSettings } from '@/module/pageSettings';
import GoTo from '@/components/toplevel/GoTo';
import { useAppDispatch } from '@/lib/hooks';
import { initCookies } from '@/module/cookies';

export default function Wrapper({ children }: { children: ReactNode }) {
  const { hasNavbar } = usePageSettings();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initCookies());
  }, []);
  return (
    <>
      <GoTo />
      {hasNavbar && <Navbar />}
      <div className={styles.page}>{children}</div>
    </>
  );
}
