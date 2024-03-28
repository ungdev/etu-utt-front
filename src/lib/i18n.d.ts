import common from '../../public/locales/fr/common.json';
import ues from '../../public/locales/fr/ues.json';
import parking from '../../public/locales/fr/parking.json';
import { type InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions extends InitOptions {
    ns: ['common', 'ues', 'parking'];
    nsSeparator: ':';
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: typeof common;
      ues: typeof ues;
      parking: typeof parking;
    };
  }
}
