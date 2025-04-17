'use client';
import styles from './style.module.scss';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CookieNames, setCookiesAcceptance } from '@/module/cookies';
import { usePageSettings } from '@/module/pageSettings';
import { useEffect, useState } from 'react';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import Page from "@/components/utilities/Page";

const DEFAULT_COOKIES = Object.fromEntries(Object.values(CookieNames).map((name) => [name, true])) as {
  [K in CookieNames]: boolean;
};

const cookies = [
  {
    cookie: CookieNames.TOKEN,
    name: 'cookies:variables.token.name',
    description: 'cookies:variables.token.description',
  },
] satisfies Array<{
  cookie: CookieNames;
  name: NotParameteredTranslationKey;
  description: NotParameteredTranslationKey;
}>;

export default function CookiesPage() {
  const dispatch = useAppDispatch();
  const cookiesAcceptedFromRedux = useAppSelector((state) => state.cookies.cookiesAccepted);
  const [cookiesAccepted, setCookiesAccepted] = useState(cookiesAcceptedFromRedux ?? DEFAULT_COOKIES);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (!cookiesAcceptedFromRedux) return;
    setCookiesAccepted(cookiesAcceptedFromRedux);
  }, [cookiesAcceptedFromRedux]);

  const toggleCookieAcceptance = (name: CookieNames) => {
    const newCookiesAccepted = { ...cookiesAccepted };
    newCookiesAccepted[name] = !newCookiesAccepted[name];
    setCookiesAccepted(newCookiesAccepted);
  };

  return (
    <Page className={styles.cookiesPage}>
      <h1>{t('cookies:title')}</h1>
      <h2>{t('cookies:whatIsIt.title')}</h2>
      <p>{t('cookies:whatIsIt.text')}</p>
      <h2>{t('cookies:variables.title')}</h2>
      <div className={styles.list}>
        {cookies.map((cookie) => (
          <div className={styles.variable} key={cookie.cookie}>
            <input
              type="checkbox"
              checked={cookiesAccepted[cookie.cookie]}
              onChange={() => toggleCookieAcceptance(cookie.cookie)}
            />
            {t(cookie.name)}
            <p>{t(cookie.description)}</p>
          </div>
        ))}
      </div>
      <button onClick={() => dispatch(setCookiesAcceptance(cookiesAccepted))}>{t('cookies:validate')}</button>
    </Page>
  );
}
