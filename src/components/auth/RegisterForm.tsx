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
      <a href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
            service: 'https://etu.assos.utt.fr/login',
          }).toString()}`} className={styles.cas}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1Q_WNZSIZWs328kwIn2Tun59WALMhEesae0jenVHfg&s" alt="Logo UTT" />
        <span>{t('login:login.connectWithCas')}</span>
      </a>
      <span>{t('common:or').toUpperCase()}</span>
      <div className={styles.inputContainer}>
        <Input value={lastname} onChange={setLastname} onEnter={submit} placeholder="Nom" />
        <Input value={firstname} onChange={setFirstname} onEnter={submit} placeholder="Prénom" />
        <Input value={username} onChange={setUsername} onEnter={submit} placeholder="Nom d'utilisateur" />
        <Input value={password} onChange={setPassword} onEnter={submit} placeholder="Mot de passe" type="password" />
        <Input
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          onEnter={submit}
          placeholder="Confirmation de mot de passe"
          type="password"
        />
      </div>
      <Link href={'/login'} className={styles.link}>
        Vous avez déjà un compte ? Connectez-vous !
      </Link>
      <Button onClick={submit} className={styles.button}>
        Créer un compte
      </Button>
    </div>
  );
}
