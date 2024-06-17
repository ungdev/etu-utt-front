import common from '../../public/locales/fr/common.json';
import ues from '../../public/locales/fr/ues.json';
import login from '../../public/locales/fr/login.json';
import homepage from '../../public/locales/fr/homepage.json';
import users from '../../public/locales/fr/users.json';
import goTo from '../../public/locales/fr/goTo.json';
import auth from '../../public/locales/fr/auth.json';
import assos from '../../public/locales/fr/assos.json';
import cookies from '../../public/locales/fr/cookies.json';
import { type InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions extends InitOptions {
    ns: ['common', 'login', 'ues', 'homepage', 'users', 'goTo', 'auth', 'assos', 'cookies'];
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
      auth: typeof auth;
      assos: typeof assos;
      cookies: typeof cookies;
    };
  }
}
