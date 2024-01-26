import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    load: 'currentOnly',
    lng: 'fr',
    fallbackLng: 'fr',
    debug: true,
    react: {
      useSuspense: true,
    },
    supportedLngs: ['en', 'fr'],
    ns: ['common'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    preload: ['fr'],
  });

export default i18n;
