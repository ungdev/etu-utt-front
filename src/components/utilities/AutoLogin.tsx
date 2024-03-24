'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import * as sessionModule from '@/module/session';
import { useAPI } from '@/api/api';

export default function AutoLogin() {
  const dispatch = useAppDispatch();
  const api = useAPI();
  useEffect(() => {
    dispatch(sessionModule.autoLogin(api));
  }, []);
  return false;
}
