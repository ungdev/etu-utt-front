import common from '../../public/locales/fr/common.json';
import ues from '../../public/locales/fr/ues.json';
import { type CustomTypeOptions, type FlatNamespace, type InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions extends InitOptions {
    ns: ['common', 'ues'];
    nsSeparator: ':';
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: typeof common;
      ues: typeof ues;
    };
  }
  // We clearly remove some features
  // For now, it seems that they are useless for us
  // If someday you need them, you can add them back. I wish you good luck tho :)
  interface TFunction {
    (key: TranslationKey): string;
  }
}

type KeyFromNs<Ns extends FlatNamespace> = keyof CustomTypeOptions['resources'][Ns] extends string
  ? keyof CustomTypeOptions['resources'][Ns]
  : never;

export type TranslationKey<
  Ns extends FlatNamespace = FlatNamespace,
  K extends KeyFromNs<Ns> = KeyFromNs<Ns>,
> = `${Ns}:${K}`;
