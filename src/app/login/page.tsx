'use client';
import styles from './style.module.scss';
import LoginForm from '@/components/auth/LoginForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { CasLoginRequestDto, CasLoginResponseDto } from '@/api/auth/casLogin';
import { setToken } from '@/module/session';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useState } from 'react';
// import { usePageSettings } from '@/module/pageSettings';
import Button from '@/components/UI/Button';
import { RegisterResponseDto } from '@/api/auth/register';
import { CasRegisterRequestDto } from '@/api/auth/casRegister';
import { useTranslation } from 'react-i18next';
import { useAPI } from '@/api/api';

export default function LoginPage() {
  // usePageSettings({ hasNavbar: false, permissions: 'public' });
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [registerToken, setRegisterToken] = useState<string | null>(null);
  const [validatedToken, setValidatedToken] = useState(false);
  const api = useAPI();
  useEffect(() => {
    if (!params.get('ticket') || validatedToken) return;
    setValidatedToken(true);
    api
      .post<CasLoginRequestDto, CasLoginResponseDto>('auth/signin/cas', {
        ticket: params.get('ticket')!,
        service: 'https://etu.utt.fr/dummyurl',
      })
      .on('success', (body) => {
        if (!body.signedIn) {
          setRegisterToken(body.access_token);
          router.replace('/login');
          return;
        }
        dispatch(setToken(body.access_token));
        router.push('/');
      });
  }, []);
  if (params.get('ticket') && !registerToken) {
    return <div>{t('login:connecting')}</div>;
  }
  if (registerToken) {
    return (
      <div>
        {t('login:cgu.text')}
        <Button
          onClick={() =>
            api
              .post<CasRegisterRequestDto, RegisterResponseDto>('auth/signup/cas', {
                registerToken,
              })
              .on('success', (body) => {
                dispatch(setToken(body.access_token));
                router.push('/');
              })
          }>
          {t('login:cgu.button')}
        </Button>
      </div>
    );
  }
  return (
    <div id="login-page" className={styles.loginPage}>
      <LoginForm />
      Ou{' '}
      <a
        href={`https://cas.utt.fr/cas/login?${new URLSearchParams({
          service: 'https://etu.utt.fr/dummyurl',
        }).toString()}`}>
        {t('login:connectWithCas')}
      </a>
    </div>
  );
}
