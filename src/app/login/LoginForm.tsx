'use client';

import styles from './LoginForm.module.scss';
import { useState } from 'react';
import * as sessionModule from '@/module/session';
import { useAppDispatch } from '@/lib/hooks';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import Link from '@/components/UI/Link';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.loginForm}>
      <div className={styles.title}>
        CONNEX<span className={styles.bluePart}>ION</span>
      </div>
      <Input value={username} onChange={(v) => setUsername(v)} placeholder="Nom d'utilisateur" />
      <Input
        value={password}
        onChange={(v) => setPassword(v)}
        placeholder="Mot de passe"
        className={styles.passwordField}
      />
      <Link href={'/register'} className={styles.registerLink}>Pas encore de compte ? Inscrivez-vous !</Link>
      <Button onClick={() => dispatch(sessionModule.login(username, password))} className={styles.connectButton}>
        Se connecter
      </Button>
    </div>
  );
}
