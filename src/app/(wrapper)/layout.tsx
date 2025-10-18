import '@/global.scss';
import React, { ReactNode } from 'react';
import Redirecter from '@/components/utilities/Redirecter';
import Wrapper from '@/components/utilities/Wrapper';

export default function ViceRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Redirecter />
      <Wrapper>{children}</Wrapper>
    </>
  );
}
