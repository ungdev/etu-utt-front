'use client';
import styles from './CookiePopup.module.scss';
import Button from '@/components/UI/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setAllCookiesAcceptance } from '@/module/cookies';
import { useAppTranslation } from '@/lib/i18n';
import { Trans } from 'react-i18next';
import Link from '@/components/UI/Link';

export function CookiePopup() {
  const dispatch = useAppDispatch();
  const displayCookies = useAppSelector((state) => state.cookies.cookiesAccepted === null);
  const { t } = useAppTranslation();

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
        <Button background={'white'} onClick={() => dispatch(setAllCookiesAcceptance(true))}>
          {t('common:cookie.authorize')}
        </Button>
        <Button background={'white'} onClick={() => dispatch(setAllCookiesAcceptance(false))}>
          {t('common:cookie.refuse')}
        </Button>
        <Link href={'/cookies'}>
          <Button background={'white'}>{t('common:cookie.personalize')}</Button>
        </Link>
      </div>
    </div>
  );
}
