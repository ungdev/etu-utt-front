import common from '../../public/locales/fr/common.json';
import ues from '../../public/locales/fr/ues.json';
import users from '../../public/locales/fr/users.json';
import { type InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions extends InitOptions {
    ns: ['common', 'ues', 'users'];
    nsSeparator: ':';
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: typeof common;
      ues: typeof ues;
      users: typeof users;
    };
  }
}
