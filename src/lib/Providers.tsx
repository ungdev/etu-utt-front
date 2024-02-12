'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { supportedLngs } from '@/lib/i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lang = localStorage.getItem('etu-utt-lang') || 'fr';
    if (!supportedLngs.some((lng) => lng === lang)) {
      lang = 'fr';
    }
    i18n.changeLanguage(lang);
  }, []);
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Provider>
  );
  return false;
}
