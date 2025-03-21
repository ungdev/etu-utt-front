'use client';
import styles from './style.module.scss';
import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { CasLoginRequestDto, CasLoginResponseDto } from '@/api/auth/casLogin';
import { setToken } from '@/module/session';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { usePageLoaded, usePageSettings, useSearchParam } from '@/module/pageSettings';
import Button from '@/components/UI/Button';
import { RegisterResponseDto } from '@/api/auth/register';
import { CasRegisterRequestDto } from '@/api/auth/casRegister';
import { useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';
import { Trans } from 'react-i18next';
import { etuuttWebApplicationId } from '@/utils/environment';

export default function LoginPage() {
  usePageSettings({ hasNavbar: false, permissions: 'public', needsLoading: true });
  const { internallyLoaded, markPageLoaded } = usePageLoaded();
  const ticket = useSearchParam('ticket');
  const application = useSearchParam('application');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation();
  const [registerToken, setRegisterToken] = useState<string | null>(null);
  const [validatedToken, setValidatedToken] = useState(false);
  const api = useAPI();
  useEffect(() => {
    if (application == etuuttWebApplicationId) {
      router.replace('/login');
    }
  }, []);
  useEffect(() => {
    if (!ticket || validatedToken) return;
    setValidatedToken(true);
    api
      .post<CasLoginRequestDto, CasLoginResponseDto>('auth/signin/cas', {
        ticket: ticket,
        service: process.env.NEXT_PUBLIC_CAS_SERVICE!,
      })
      .on('success', (body) => {
        if (!body.signedIn) {
          setRegisterToken(body.token);
          router.replace('/login');
          return;
        }
        dispatch(setToken(body.token, api));
        router.push('/');
      });
  }, [ticket]);
  useEffect(() => {
    if ((!ticket || registerToken) && internallyLoaded) {
      markPageLoaded();
    }
  }, [internallyLoaded]);
  if (ticket && !registerToken) {
    return null;
  }
  if (registerToken) {
    return (
      <div className={styles.confirmRegister}>
        <div>
          <Trans
            i18nKey={'login:legal.text'}
            components={{
              toLegal: <a href="/legal" />,
            }}
          />
        </div>
        <div className={styles.options}>
          <Button
            className={styles.acceptButton}
            onClick={() =>
              api
                .post<CasRegisterRequestDto, RegisterResponseDto>('auth/signup/cas', {
                  registerToken,
                })
                .on('success', (body) => {
                  dispatch(setToken(body.token, api));
                  router.push('/');
                })
            }>
            {t('login:cgu.button')}
          </Button>
          <Button
            onClick={() => {
              router.push('/');
            }}>
            {t('login:legal.dontConnect')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="login-page" className={styles.loginPage}>
      <LoginForm application={application} />
    </div>
  );
}
