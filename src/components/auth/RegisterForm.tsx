'use client';

import { useAPI } from '@/api/api';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Link from '@/components/UI/Link';
import Icons from '@/icons';
import { useAppDispatch } from '@/lib/hooks';
import { useAppTranslation } from '@/lib/i18n';
import * as sessionModule from '@/module/session';
import { getCasServiceUrl } from '@/utils/environment';
import { useState } from 'react';
import styles from './AuthForm.module.scss';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { t } = useAppTranslation();
  const submit = () => {
    if (password === passwordConfirmation && password)
      dispatch(sessionModule.register(api, lastname, firstname, username, password));
  };

  return (
    <div className={styles.authForm}>
      <Icons.LogoUNG className={styles.logo} />
      <div className={styles.title}>
        INSCRIPT<span className={styles.bluePart}>ION</span>
      </div>
      <a
        href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
          service: getCasServiceUrl(),
        }).toString()}`}
        className={styles.cas}>
        <Icons.LogoUTT />
        <span>{t('login:login.connectWithCas')}</span>
      </a>
      <span>{t('common:or').toUpperCase()}</span>
      <div className={styles.inputContainer}>
        <Input value={lastname} onChange={setLastname} onEnter={submit} placeholder={t('users:lastName')} />
        <Input value={firstname} onChange={setFirstname} onEnter={submit} placeholder={t('users:firstName')} />
        <Input value={username} onChange={setUsername} onEnter={submit} placeholder={t('users:username')} />
        <Input
          value={password}
          onChange={setPassword}
          onEnter={submit}
          placeholder={t('users:password')}
          type="password"
        />
        <Input
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          onEnter={submit}
          placeholder={t('users:password.confirmation')}
          type="password"
        />
      </div>
      <Link href={'/login'} className={styles.link}>
        {t('auth:alreadyHaveAccount')}
      </Link>
      <Button onClick={submit} className={styles.button}>
        {t('auth:create')}
      </Button>
    </div>
  );
}
