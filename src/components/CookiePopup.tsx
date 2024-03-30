'use client';
import styles from './CookiePopup.module.scss';
import Button from '@/components/UI/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CookieNames, setCookiesAcceptance, useCookie } from '@/module/cookies';
import { useEffect } from 'react';

export function CookiePopup() {
  const dispatch = useAppDispatch();
  const displayCookies = useAppSelector((state) => state.cookies.cookiesAccepted === null);
  const cookie = useCookie(CookieNames.COOKIES_ACCEPTED, true);
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
      Nous utilisons des cookies pour vous authentifier automatiquement. <br />
      Cliquez sur "Autoriser" pour autoriser ces cookies
      <div className={styles.buttons}>
        <Button background={'white'} onClick={() => dispatch(setCookiesAcceptance(true))}>
          Autoriser
        </Button>
        <Button background={'white'} onClick={() => dispatch(setCookiesAcceptance(false))}>
          Refuser
        </Button>
      </div>
    </div>
  );
}
