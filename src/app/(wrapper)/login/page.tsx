'use client';
import { useAPI } from '@/api/api';
import { CasLoginRequestDto, CasLoginResponseDto } from '@/api/auth/casLogin';
import LoginForm from '@/components/auth/LoginForm';
import LegalsForm from '@/components/auth/LegalsForm';
import Page from '@/components/utilities/Page';
import { useAppDispatch } from '@/lib/hooks';
import { usePageLoaded, useSearchParam } from '@/module/pageSettings';
import { setToken } from '@/module/session';
import { etuuttWebApplicationId, authorizationTokenExpiresIn } from '@/utils/environment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

export default function LoginPage() {
  const { internallyLoaded, markPageLoaded } = usePageLoaded();
  const ticket = useSearchParam('ticket');
  const application = useSearchParam('application');
  const router = useRouter();
  const dispatch = useAppDispatch();
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
      .post<CasLoginRequestDto, CasLoginResponseDto>('auth/signin', {
        ticket: ticket,
        tokenExpiresIn: authorizationTokenExpiresIn(),
      })
      .on('success', (body) => {
        if (body.status === 'no_account') {
          setRegisterToken(body.token);
          return;
        }
        if (body.status === 'no_api_key') {
          router.push(
            `/login/external/create?${new URLSearchParams({
              token: body.token,
              application: application ?? etuuttWebApplicationId,
            }).toString()}`,
          );
          return;
        }
        if (body.token === null) {
          window.location.assign(body.redirectUrl);
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
  if (registerToken) {
    return (
      <Page
        hasNavbar={true}
        needsLoading={true}
        id="register-page"
        className={styles.loginPage}
        noWrapperPadding={true}>
        <LegalsForm registerToken={registerToken} />
      </Page>
    );
  }

  return (
    <Page hasNavbar={true} needsLoading={true} id="login-page" className={styles.loginPage} noWrapperPadding={true}>
      <LoginForm application={application} />
    </Page>
  );
}
