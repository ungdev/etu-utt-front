'use client';

import { usePageSettings } from '@/module/pageSettings';

export default function PageNotFound() {
  usePageSettings({});
  return <h1>404 - Page not found</h1>;
}
