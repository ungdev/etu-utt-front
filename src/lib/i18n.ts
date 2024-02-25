'use client';

import i18n, { type CustomTypeOptions, type FlatNamespace } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
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
    ns: ['common', 'ues'],
    preload: ['fr'],
    nsSeparator: ':',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    // debug: true,  // Uncomment to let i18next log to the console
  } satisfies Omit<CustomTypeOptions, 'resources'>);

export default i18n;

export function useAppTranslation() {
  const { t, i18n } = useTranslation();
  return {
    t: t as unknown as TFunction,
    i18n,
  };
}

export interface TFunction {
  //(key: string, params: Record<string, string>): string;
  <T extends ParameteredTranslationKey>(key: T, params: Record<ParamsOfKey<T>, string>): string;
  <T extends NotParameteredTranslationKey>(key: T): string;
}

export type TranslationKey = {
  [K in keyof CustomTypeOptions['resources']]: `${K}:${keyof CustomTypeOptions['resources'][K] extends string
    ? keyof CustomTypeOptions['resources'][K]
    : never}`;
}[FlatNamespace];

type ParamsOfKey<T extends TranslationKey> = T extends `${infer Ns extends
  keyof CustomTypeOptions['resources']}:${infer Key}`
  ? Key extends keyof CustomTypeOptions['resources'][Ns]
    ? ParamsOfString<CustomTypeOptions['resources'][Ns][Key]>
    : never
  : never;

type ParamsOfString<S> = S extends `${infer Before}{{${infer Param}}}${infer After}`
  ? ParamsOfString<Before> | Param | ParamsOfString<After>
  : never;

export type ParameteredTranslationKey = {
  [K in TranslationKey]: ParamsOfKey<K> extends never ? never : K;
}[TranslationKey];
export type NotParameteredTranslationKey = {
  [K in TranslationKey]: ParamsOfKey<K> extends never ? K : never;
}[TranslationKey];
