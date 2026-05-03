'use client';
import { useAPI } from '@/api/api';
import { CasLoginRequestDto, CasLoginResponseDto } from '@/api/auth/casLogin';
import { CasRegisterRequestDto } from '@/api/auth/casRegister';
import { RegisterResponseDto } from '@/api/auth/register';
import LoginForm from '@/components/auth/LoginForm';
import Button from '@/components/UI/Button';
import Page from '@/components/utilities/Page';
import { useAppDispatch } from '@/lib/hooks';
import { useAppTranslation } from '@/lib/i18n';
import { usePageLoaded, useSearchParam } from '@/module/pageSettings';
import { setToken } from '@/module/session';
import { etuuttWebApplicationId } from '@/utils/environment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import styles from './style.module.scss';

export default function LoginPage() {
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
        tokenExpiresIn: 3600,
      })
      .on('success', (body) => {
        if (body.status === 'no_account') {
          if (!body.token) return;
          setRegisterToken(body.token);
          return;
        }
        if (body.status === 'no_api_key') {
          if (!body.token) return;
          router.push(
            `/login/external/create?${new URLSearchParams({
              token: body.token,
              application: application ?? etuuttWebApplicationId,
            }).toString()}`,
          );
          return;
        }
        if (body.redirectUrl) {
          window.location.assign(body.redirectUrl);
          return;
        }
        if (!body.token) return;
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
      <Page hasNavbar={true} needsLoading={true} className={styles.confirmRegister}>
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
      </Page>
    );
  }

  return (
    <Page hasNavbar={true} needsLoading={true} id="login-page" className={styles.loginPage}>
      <LoginForm application={application} />
    </Page>
  );
}
