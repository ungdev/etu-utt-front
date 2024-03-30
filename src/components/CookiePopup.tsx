'use client';
import styles from './CookiePopup.module.scss';
import Button from '@/components/UI/Button';
import { useAppDispatch } from '@/lib/hooks';
import { useCookiesAcceptance, setCookiesAcceptance } from '@/module/session';

export function CookiePopup() {
  const dispatch = useAppDispatch();
  const alreadyMadeDecision = !useCookiesAcceptance();
  if (!alreadyMadeDecision) {
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
