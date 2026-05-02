'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setSearchParams, usePageLoaded } from '@/module/pageSettings';

export default function PageSearchParams() {
  const pathname = usePathname();
  const { searchParamsLoaded } = usePageLoaded();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (searchParamsLoaded) return;
    dispatch(setSearchParams(Object.fromEntries(params)));
    if (params.size) router.replace(pathname);
  }, [params, searchParamsLoaded]);
  return false;
}
