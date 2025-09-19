'use client';

import { useAppSelector } from '@/lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { usePageSettings } from '@/module/pageSettings';

interface RouteConditionState {
  loggedIn: boolean;
}

type RouteRedirectionRules = {
  [key: string]: Array<{ condition: (state: RouteConditionState) => boolean; redirectTo: string }>;
};

const redirectionRules: RouteRedirectionRules = {
  '/login': [{ condition: (state) => state.loggedIn, redirectTo: '/' }],
  '/register': [{ condition: (state) => state.loggedIn, redirectTo: '/' }],
};

export default function Redirecter() {
  const pathname = usePathname();
  const router = useRouter();
  const state = {
    loggedIn: useAppSelector((state) => state.session.logged),
  };
  const { notFound: pageNotFound } = usePageSettings();
  if (pageNotFound) {
    const error = new Error('NEXT_NOT_FOUND'); //notFound();
    // @ts-expect-error
    error.digest = 'NEXT_NOT_FOUND';
    throw error;
  }
  const rules = redirectionRules[pathname];
  if (!rules) {
    return false;
  }
  for (const condition of rules) {
    if (condition.condition(state)) {
      router.push(condition.redirectTo);
    }
  }
  return false;
}
