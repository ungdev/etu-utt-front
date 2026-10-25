'use client';
import styles from './Wrapper.module.scss';
import Navbar from '@/components/Navbar';
import { createContext, ReactNode, useContext, useState } from 'react';
import { usePageLoaded, usePageSettings } from '@/module/pageSettings';
import GoTo from '@/components/toplevel/GoTo';
import Loader from '@/components/toplevel/Loader';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavbarContext = createContext<HTMLElement | null>(null);
export const useNavbarPortal = () => useContext(NavbarContext);

export default function Wrapper({ children }: { children: ReactNode }) {
  const { hasNavbar, noWrapperPadding } = usePageSettings();
  const { loaded } = usePageLoaded();
  const [additionalElements, setAdditionalElements] = useState<HTMLElement | null>(null);

  return (
    <NavbarContext value={additionalElements}>
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
      {hasNavbar && <Navbar ref={setAdditionalElements} />}
      <div className={`${styles.page} ${noWrapperPadding ? styles.noPadding : ''}`}>{children}</div>
    </NavbarContext>
  );
}
