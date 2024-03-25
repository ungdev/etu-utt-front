import common from '../../public/locales/fr/common.json';
import ues from '../../public/locales/fr/ues.json';
import goTo from '../../public/locales/fr/goTo.json';
import { type InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions extends InitOptions {
    ns: ['common', 'ues', 'goTo'];
    nsSeparator: ':';
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: typeof common;
      ues: typeof ues;
      goTo: typeof goTo;
    };
  }
}
