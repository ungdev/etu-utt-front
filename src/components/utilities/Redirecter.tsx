'use client';

import { useRouter } from 'next/navigation';
import {
  missingPermissionRedirections,
  usePageLoaded,
  usePagePermissions,
  usePageSettings,
} from '@/module/pageSettings';

export default function Redirecter() {
  const pageSettings = usePageSettings();
  const router = useRouter();
  const permissions = usePagePermissions();
  const loaded = usePageLoaded();

  if (!loaded) {
    return null;
  }

  for (const permission of pageSettings.permissions) {
    if (!permissions[permission]) {
      router.push(missingPermissionRedirections[permission]);
    }
  }
  return false;
}
