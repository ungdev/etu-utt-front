'use client';

import { useEffect } from 'react';
import { initPageSettings } from '@/module/pageSettings';
import { useAppDispatch } from '@/lib/hooks';
import { initNavbar } from '@/module/navbar';

export default function ReduxModulesInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initPageSettings());
    dispatch(initNavbar());
  }, []);
  return false;
}
