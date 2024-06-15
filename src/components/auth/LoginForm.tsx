'use client';

import styles from './AuthForm.module.scss';
import { useState } from 'react';
import * as sessionModule from '@/module/session';
import { useAppDispatch } from '@/lib/hooks';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import Link from '@/components/UI/Link';
import { useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submit = () => dispatch(sessionModule.login(api, username, password));
  const { t } = useAppTranslation();
  const connectionText = t('login:login.connection');

  console.log('hey ?');
  console.log(process.env.NEXT_PUBLIC_CAS_SERVICE);
  return (
    <div className={styles.authForm}>
      <Icons.LogoUNG className={styles.logo} />
      <div className={styles.title}>
        {connectionText.slice(0, (connectionText.length * 2) / 3)}
        <span className={styles.bluePart}>{connectionText.slice((connectionText.length * 2) / 3)}</span>
      </div>
      <a
        href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
          service: process.env.NEXT_PUBLIC_CAS_SERVICE!,
        }).toString()}`}
        className={styles.cas}>
        <Icons.LogoUTT />
        <span>{t('login:login.connectWithCas')}</span>
      </a>
      <span>{t('common:or').toUpperCase()}</span>
      <div className={styles.inputContainer}>
        <Input value={username} onChange={(v) => setUsername(v)} onEnter={submit} placeholder={t('users:mail')} />
        <Input
          value={password}
          onChange={(v) => setPassword(v)}
          onEnter={submit}
          placeholder={t('users:password')}
          type="password"
        />
      </div>
      <Link href={'/register'} className={styles.link}>
        {t('login:login.noAccountYet')}
      </Link>
      <Button onClick={submit} className={styles.button}>
        {t('login:login.login')}
      </Button>
    </div>
  );
}
