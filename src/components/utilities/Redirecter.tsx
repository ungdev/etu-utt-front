'use client';

import { useRouter } from 'next/navigation';
import {
  missingPermissionRedirections,
  usePageLoaded,
  usePagePermissions,
  usePageSettings,
} from '@/module/pageSettings';
import { useSessionInitialized } from '@/module/session';

export default function Redirecter() {
  const pageSettings = usePageSettings();
  const router = useRouter();
  const permissions = usePagePermissions();
  const loaded = usePageLoaded();
  const sessionInitialized = useSessionInitialized();

  if (!loaded || !sessionInitialized) {
    return null;
  }

  for (const permission of pageSettings.permissions) {
    if (!permissions[permission]) {
      router.push(missingPermissionRedirections[permission]);
    }
  }
  return false;
}
