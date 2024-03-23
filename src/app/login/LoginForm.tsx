'use client';

import styles from './LoginForm.module.scss';
import { useState } from 'react';
import * as sessionModule from '@/module/session';
import { useAppDispatch } from '@/lib/hooks';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import Link from '@/components/UI/Link';
import ung from '@/../public/images/ung-logo.png';
import { useAPI } from '@/api/api';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submit = () => dispatch(sessionModule.login(api, username, password));

  return (
    <div className={styles.loginForm}>
      <img alt="Logo UNG" src={ung.src} className={styles.logo} />
      <div className={styles.title}>
        CONNEX<span className={styles.bluePart}>ION</span>
      </div>
      <Input value={username} onChange={(v) => setUsername(v)} onEnter={submit} placeholder="Adresse mail" />
      <Input
        value={password}
        onChange={(v) => setPassword(v)}
        onEnter={submit}
        placeholder="Mot de passe"
        type="password"
      />
      <Link href={'/register'} className={styles.registerLink}>
        Pas encore de compte ? Inscrivez-vous !
      </Link>
      <Button onClick={submit} className={styles.connectButton}>
        Se connecter
      </Button>
    </div>
  );
}
