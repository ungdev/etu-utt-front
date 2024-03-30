'use client';
import styles from './CookiePopup.module.scss';
import Button from '@/components/UI/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CookieNames, setCookiesAcceptance, useCookie } from '@/module/cookies';
import { useEffect } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import { Trans } from 'react-i18next';

export function CookiePopup() {
  const dispatch = useAppDispatch();
  const displayCookies = useAppSelector((state) => state.cookies.cookiesAccepted === null);
  const cookie = useCookie(CookieNames.COOKIES_ACCEPTED, true);
  const { t } = useAppTranslation();
  useEffect(() => {
    if (cookie === 'yes' && displayCookies) {
      dispatch(setCookiesAcceptance(true));
    }
  }, [cookie]);

  if (!displayCookies) {
    return false;
  }
  return (
    <div className={styles.cookies}>
      <Trans
        i18nKey={'common:cookie.message'}
        components={{
          br: <br />,
        }}
      />
      <div className={styles.buttons}>
        <Button background={'white'} onClick={() => dispatch(setCookiesAcceptance(true))}>
          {t('common:cookie.authorize')}
        </Button>
        <Button background={'white'} onClick={() => dispatch(setCookiesAcceptance(false))}>
          {t('common:cookie.refuse')}
        </Button>
      </div>
    </div>
  );
}
