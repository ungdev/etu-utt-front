'use client';

import { FC, useEffect, useRef, ReactNode } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { defaultPageSettings, initPageSettings, updatePageSettings, PagePermission } from '@/module/pageSettings';

export type PageProps = {
  hasNavbar?: boolean;
  navbarAdditionalComponent?: FC<Record<string, never>> | null;
  permissions?: PagePermission[];
  needsLoading?: boolean;
  className?: string;
  id?: string;
};

export default function Page({
  hasNavbar = defaultPageSettings.hasNavbar,
  navbarAdditionalComponent = defaultPageSettings.navbarAdditionalComponent,
  permissions = defaultPageSettings.permissions,
  needsLoading = false,
  className,
  id,
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
        permissions,
        needsLoading: needsLoading,
      }),
    );
  }, [hasNavbar, needsLoading]);
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
}
