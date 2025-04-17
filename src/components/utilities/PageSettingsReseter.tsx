'use client';

import { useEffect } from 'react';
import { initPageSettings } from '@/module/pageSettings';
import { useAppDispatch } from '@/lib/hooks';

export default function PageSettingsInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initPageSettings());
  }, []);
  return false;
}
