'use client';

import styles from './AuthForm.module.scss';
import { useState } from 'react';
import * as sessionModule from '@/module/session';
import { useAppDispatch } from '@/lib/hooks';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import Link from '@/components/UI/Link';
import ung from '@/../public/images/ung-logo.svg';
import { useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submit = () => dispatch(sessionModule.login(api, username, password));
  const { t } = useAppTranslation();
  const connectionText = t('login:login.connection');

  return (
    <div className={styles.authForm}>
      <img alt="Logo UNG" src={ung.src} className={styles.logo} />
      <div className={styles.title}>
        {connectionText.slice(0, (connectionText.length * 2) / 3)}
        <span className={styles.bluePart}>{connectionText.slice((connectionText.length * 2) / 3)}</span>
      </div>
      <Input value={username} onChange={(v) => setUsername(v)} onEnter={submit} placeholder="Adresse mail" />
      <Input
        value={password}
        onChange={(v) => setPassword(v)}
        onEnter={submit}
        placeholder="Mot de passe"
        type="password"
      />
      <Link href={'/register'} className={styles.link}>
        {t('login:login.noAccountYet')}
      </Link>
      <Button onClick={submit} className={styles.button}>
        {t('login:login.login')}
      </Button>
      <p>
        {t('common:or')}{' '}
        <a
          href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
            service: 'https://etu.utt.fr/dummyurl',
          }).toString()}`}>
          {t('login:login.connectWithCas')}
        </a>
      </p>
    </div>
  );
}
