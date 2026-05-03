'use client';

import { useAPI } from '@/api/api';
import Button from '@/components/UI/Button';
import { useAppDispatch } from '@/lib/hooks';
import { useAppTranslation } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.scss';
import { CasRegisterRequestDto } from '@/api/auth/casRegister';
import { RegisterResponseDto } from '@/api/auth/register';
import { Trans } from 'react-i18next';
import { setToken } from '@/module/session';
import Icons from '@/icons';

export default function LegalsForm({ registerToken }: { registerToken: string }) {
  const { t } = useAppTranslation();
  const api = useAPI();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAccept = () => {
    api
      .post<CasRegisterRequestDto, RegisterResponseDto>('auth/signup', {
        registerToken,
      })
      .on('success', (body) => {
        dispatch(setToken(body.token, api));
        router.push('/');
      });
  };

  const registerText = t('login:legal.title');

  return (
    <div className={styles.authForm}>
      <Icons.LogoUNG className={styles.logo} />
      <div className={styles.title}>
        {registerText.slice(0, (registerText.length * 2) / 3)}
        <span className={styles.bluePart}>{registerText.slice((registerText.length * 2) / 3)}</span>
      </div>
      <p className={styles.missingAccount}>{t('login:legal.missingAccount')}</p>
      <Trans
        i18nKey={'login:legal.text'}
        components={{
          toLegal: <a href="/legal" target="_blank" rel="noopener noreferrer" className={styles.link} />,
        }}
      />
      <div className={styles.actions}>
        <Button className={styles.acceptButton} onClick={handleAccept}>
          {t('login:cgu.button')}
        </Button>
        <a
          onClick={() => {
            router.push('/');
          }}>
          {t('login:legal.dontConnect')}
        </a>
      </div>
    </div>
  );
}
