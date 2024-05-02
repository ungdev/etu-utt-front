import common from '../../public/locales/fr/common.json';
import ues from '../../public/locales/fr/ues.json';
import login from '../../public/locales/fr/login.json';
import homepage from '../../public/locales/fr/homepage.json';
import users from '../../public/locales/fr/users.json';
import goTo from '../../public/locales/fr/goTo.json';
import { type InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions extends InitOptions {
    ns: ['common', 'login', 'ues', 'homepage', 'users', 'goTo'];
    nsSeparator: ':';
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: typeof common;
      ues: typeof ues;
      login: typeof login;
      homepage: typeof homepage;
      users: typeof users;
      goTo: typeof goTo;
    };
  }
}
