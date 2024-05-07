'use client';
import styles from './style.module.scss';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CookieNames, setCookiesAcceptance } from '@/module/cookies';
import { usePageSettings } from '@/module/pageSettings';
import { useEffect, useState } from 'react';

const DEFAULT_COOKIES = Object.fromEntries(Object.values(CookieNames).map((name) => [name, true])) as {
  [K in CookieNames]: boolean;
};

export default function CookiesPage() {
  usePageSettings({});
  const dispatch = useAppDispatch();
  const cookiesAcceptedFromRedux = useAppSelector((state) => state.cookies.cookiesAccepted);
  const [cookiesAccepted, setCookiesAccepted] = useState(cookiesAcceptedFromRedux ?? DEFAULT_COOKIES);

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
    <div className={styles.cookiesPage}>
      <h1>Traceurs (cookies, localStorage, ...)</h1>
      <h2>Qu'est-ce que le localStorage ?</h2>
      Le localStorage est un stockage de données en local, c'est-à-dire sur votre ordinateur. Il permet de stocker des
      données de manière persistante, même après la fermeture de la page web ou de votre navigateur. Il est souvent
      utile pour stocker des préférences utilisateur, des données de connexion, ou des données de navigation.
      <h2>Liste des variables du localStorage</h2>
      <div className={styles.list}>
        <div className={styles.variable}>
          Token de connexion
          <input
            type="checkbox"
            checked={cookiesAccepted[CookieNames.TOKEN]}
            onChange={() => toggleCookieAcceptance(CookieNames.TOKEN)}
          />
        </div>
      </div>
      <button onClick={() => dispatch(setCookiesAcceptance(cookiesAccepted))}>Valider</button>
    </div>
  );
}
