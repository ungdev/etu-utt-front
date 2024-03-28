'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPageParams } from '@/module/pageSettings';

export default function PageSearchParams() {
  const pathname = useAppSelector((state) => state.pageSettings.page);
  const realPathname = usePathname();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (pathname !== realPathname) return;
    if (!params.size) return;
    dispatch(setPageParams(Object.fromEntries(params.entries())));
    router.replace(pathname);
  }, [params, pathname]);
  return false;
}
