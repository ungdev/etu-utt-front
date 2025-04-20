import '@/global.scss';
import React, { ReactNode } from 'react';
import Redirecter from '@/components/utilities/Redirecter';
import Wrapper from '@/components/utilities/Wrapper';
import { CookiePopup } from '@/components/CookiePopup';

export default function ViceRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Redirecter />
      <CookiePopup />
      <Wrapper>{children}</Wrapper>
    </>
  );
}
