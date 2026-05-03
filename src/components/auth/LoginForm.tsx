'use client';

import { useAPI } from '@/api/api';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Link from '@/components/UI/Link';
import Icons from '@/icons';
import { useAppDispatch } from '@/lib/hooks';
import { useAppTranslation } from '@/lib/i18n';
import * as sessionModule from '@/module/session';
import { etuuttWebApplicationId, getCasServiceUrl, isDevEnv } from '@/utils/environment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './AuthForm.module.scss';

export default function LoginForm({ application }: { application: string | undefined }) {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { t } = useAppTranslation();

  const submit = async () => {
    const res = await dispatch(sessionModule.login(api, username, application));
    if (!res) return;
    if (!res.signedIn) {
      router.push(
        `/login/external/create?${new URLSearchParams({
          token: res.token,
          application: application ?? etuuttWebApplicationId,
        }).toString()}`,
      );
      return;
    }
    if (res.redirectUrl) {
      router.push(res.redirectUrl);
    }
    router.push('/');
  };
  const connectionText = t('login:login.connection');

  return (
    <div className={styles.authForm}>
      <Icons.LogoUNG className={styles.logo} />
      <div className={styles.title}>
        {connectionText.slice(0, (connectionText.length * 2) / 3)}
        <span className={styles.bluePart}>{connectionText.slice((connectionText.length * 2) / 3)}</span>
      </div>
      <a
        href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
          service: getCasServiceUrl(application),
        }).toString()}`}
        className={styles.cas}>
        <Icons.LogoUTT />
        <span>{t('login:login.connectWithCas')}</span>
      </a>
      {isDevEnv() && (
        <>
          <span>{t('common:or').toUpperCase()}</span>
          <p>Environnement de développement uniquement</p>
          <div className={styles.inputContainer}>
            <Input value={username} onChange={(v) => setUsername(v)} onEnter={submit} placeholder={t('users:mail')} />
          </div>
          <Link href={'/register'} className={styles.link}>
            {t('login:login.noAccountYet')}
          </Link>
          <Button onClick={submit} className={styles.button}>
            {t('login:login.login')}
          </Button>
        </>
      )}
    </div>
  );
}
