'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { supportedLngs } from '@/lib/i18n-server';
import { useCookies } from 'next-client-cookies';

export default function Providers({ children }: { children: ReactNode }) {
  let lang = useCookies().get('etu-utt-lang') || 'fr';
  if (!supportedLngs.some((lng) => lng === lang)) {
    lang = 'fr';
  }
  i18n.changeLanguage(lang);
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Provider>
  );
}
