'use client';

import i18n, { type CustomTypeOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import './i18n.d';

export const supportedLngs = ['fr', 'en'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    load: 'languageOnly',
    lng: 'fr',
    fallbackLng: 'fr',
    react: {
      useSuspense: true,
    },
    supportedLngs,
    ns: ['common', 'login'],
    preload: ['fr'],
    nsSeparator: ':',
    defaultNS: 'common',
    // debug: true,  // Uncomment to let i18next log to the console
  } satisfies Omit<CustomTypeOptions, 'resources'>);

export default i18n;
