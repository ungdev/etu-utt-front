'use client';

import styles from './RegisterForm.module.scss';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import ung from '../../../public/images/ung-logo.png';
import Input from '@/components/UI/Input';
import Link from '@/components/UI/Link';
import Button from '@/components/UI/Button';
import * as sessionModule from '@/module/session';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  return (
    <div className={styles.registerForm}>
      <img alt="Logo UNG" src={ung.src} className={styles.logo} />
      <div className={styles.title}>
        INSCRIPT<span className={styles.bluePart}>ION</span>
      </div>
      <Input value={lastname} onChange={setLastname} placeholder="Nom" />
      <Input value={firstname} onChange={setFirstname} placeholder="Prénom" />
      <Input value={username} onChange={setUsername} placeholder="Nom d'utilisateur" />
      <Input value={password} onChange={setPassword} placeholder="Mot de passe" />
      <Input
        value={passwordConfirmation}
        onChange={setPasswordConfirmation}
        placeholder="Confirmation de mot de passe"
      />
      <Link href={'/login'} className={styles.registerLink}>
        Vous avez déjà un compte ? Connectez-vous !
      </Link>
      <Button
        onClick={() => dispatch(sessionModule.register(lastname, firstname, username, password))}
        className={styles.registerButton}>
        Créer un compte
      </Button>
    </div>
  );
}
