'use client';

import styles from './AuthForm.module.scss';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import ung from '../../../public/images/ung-logo.svg';
import Input from '@/components/UI/Input';
import Link from '@/components/UI/Link';
import Button from '@/components/UI/Button';
import * as sessionModule from '@/module/session';
import { useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';
import logoUtt from '@/../public/images/logoutt.jpg';

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
      <img alt="Logo UNG" src={ung.src} className={styles.logo} />
      <div className={styles.title}>
        INSCRIPT<span className={styles.bluePart}>ION</span>
      </div>
      <a
        href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
          service: 'https://etu.assos.utt.fr/login',
        }).toString()}`}
        className={styles.cas}>
        <img src={logoUtt.src} alt="Logo UTT" />
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
