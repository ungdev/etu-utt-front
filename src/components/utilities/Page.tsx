'use client';

import { FC, useEffect, useRef, ReactNode } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { defaultPageSettings, initPageSettings, updatePageSettings } from '@/module/pageSettings';

export type PageProps = {
  hasNavbar?: boolean;
  navbarAdditionalComponent?: FC<Record<string, never>> | null;
  needsLoading?: boolean;
  className?: string;
};

export default function Page({
  hasNavbar = defaultPageSettings.hasNavbar,
  navbarAdditionalComponent = defaultPageSettings.navbarAdditionalComponent,
  needsLoading = false,
  className,
  children,
}: PageProps & {
  children: ReactNode;
}) {
  const firstLoad = useRef(true);
  const dispatch = useAppDispatch();
  useEffect(
    () => () => {
      dispatch(initPageSettings());
    },
    [],
  );
  useEffect(() => {
    firstLoad.current = false;
    dispatch(
      updatePageSettings({
        navbarAdditionalComponent,
        hasNavbar,
        permissions: 'user',
        needsLoading: needsLoading,
      }),
    );
  }, [hasNavbar, needsLoading]);
  return <div className={className}>{children}</div>;
}
