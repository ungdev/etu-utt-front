'use client';
import '@/global';
import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { useLanguage } from '@/lib/i18n';

function LangProvider({ children }: { children: ReactNode }) {
  const lang = useLanguage();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <LangProvider>{children}</LangProvider>
    </Provider>
  );
}
