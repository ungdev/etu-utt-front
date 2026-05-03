'use client';

import { useAPI } from '@/api/api';
import { useRouter } from 'next/navigation';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Link from '@/components/UI/Link';
import Icons from '@/icons';
import { useAppDispatch } from '@/lib/hooks';
import { useAppTranslation } from '@/lib/i18n';
import * as sessionModule from '@/module/session';
import { useState } from 'react';
import styles from './AuthForm.module.scss';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const api = useAPI();
  const router = useRouter();
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const { t } = useAppTranslation();
  const submit = () => {
    dispatch(sessionModule.register(api, lastname, firstname, username, mail));
    router.push('/');
  };

  return (
    <div className={styles.authForm}>
      <Icons.LogoUNG className={styles.logo} />
      <div className={styles.title}>
        INSCRIPT<span className={styles.bluePart}>ION</span>
      </div>
      <p>Environnement de développement uniquement</p>
      <div className={styles.inputContainer}>
        <Input value={lastname} onChange={setLastname} onEnter={submit} placeholder={t('users:lastName')} />
        <Input value={firstname} onChange={setFirstname} onEnter={submit} placeholder={t('users:firstName')} />
        <Input value={username} onChange={setUsername} onEnter={submit} placeholder={t('users:username')} />
        <Input value={mail} onChange={setMail} onEnter={submit} placeholder={t('users:mail')} />
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
