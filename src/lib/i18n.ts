'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

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
    ns: ['common'],
    preload: ['fr'],
    // debug: true,  // Uncomment to let i18next log to the console
  });

export default i18n;
