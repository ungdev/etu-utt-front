'use client';
import styles from './Wrapper.module.scss';
import Navbar from '@/components/Navbar';
import React, { ReactNode, useEffect } from 'react';
import { usePageLoaded, usePageSettings } from '@/module/pageSettings';
import GoTo from '@/components/toplevel/GoTo';
import { useAppDispatch } from '@/lib/hooks';
import { initCookies } from '@/module/cookies';
import Loader from '@/components/toplevel/Loader';

export default function Wrapper({ children }: { children: ReactNode }) {
  const { hasNavbar, pageComponentReady } = usePageSettings();
  const { internallyLoaded } = usePageLoaded();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initCookies());
  }, []);
  return (
    <>
      <GoTo />
      {hasNavbar && <Navbar />}
      {(!pageComponentReady || !internallyLoaded) && <Loader />}
      <div className={styles.page}>{children}</div>
    </>
  );
}
