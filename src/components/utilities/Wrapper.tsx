'use client';
import styles from './Wrapper.module.scss';
import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';
import { usePageLoaded, usePageSettings } from '@/module/pageSettings';
import GoTo from '@/components/toplevel/GoTo';
import Loader from '@/components/toplevel/Loader';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Wrapper({ children }: { children: ReactNode }) {
  const { hasNavbar } = usePageSettings();
  const { loaded } = usePageLoaded();
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      <GoTo />
      {hasNavbar && <Navbar />}
      {!loaded && <Loader />}
      <div className={styles.page}>{children}</div>
    </>
  );
}
