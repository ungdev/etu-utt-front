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
  const { hasNavbar, noWrapperPadding } = usePageSettings();
  const { loaded } = usePageLoaded();

  const contents = <div className={`${styles.page} ${noWrapperPadding ? styles.noPadding : ''}`}>{children}</div>;

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
      {!loaded && <Loader />}
      {hasNavbar ? <Navbar>{contents}</Navbar> : contents}
    </>
  );
}
