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
    //console.log(pathname)
    if (pathname !== realPathname) return;
    console.log(params);
    dispatch(setPageParams(Object.fromEntries(params)));
    console.log(Object.fromEntries(params));
    if (!params.size) return;
    router.replace(pathname);
  }, [pathname]);
  return false;
}
