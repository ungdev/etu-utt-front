'use client';

import { FC, useEffect, ReactNode } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { defaultPageSettings, initPageSettings, updatePageSettings, PagePermission } from '@/module/pageSettings';

export type PageProps = {
  hasNavbar?: boolean;
  navbarAdditionalComponent?: FC<Record<string, never>> | null;
  permissions?: PagePermission[];
  needsLoading?: boolean;
  className?: string;
  id?: string;
  noWrapperPadding?: boolean;
};

export default function Page({
  hasNavbar = defaultPageSettings.hasNavbar,
  navbarAdditionalComponent = defaultPageSettings.navbarAdditionalComponent,
  permissions = defaultPageSettings.permissions,
  needsLoading = false,
  className,
  id,
  children,
  noWrapperPadding = false,
}: PageProps & {
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();
  useEffect(
    () => () => {
      dispatch(initPageSettings());
    },
    [],
  );
  useEffect(() => {
    dispatch(
      updatePageSettings({
        navbarAdditionalComponent,
        hasNavbar,
        permissions,
        needsLoading,
        noWrapperPadding,
      }),
    );
  }, [hasNavbar, needsLoading, noWrapperPadding]);
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
}
