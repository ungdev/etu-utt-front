'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/app/(wrapper)/login/style.module.scss';
import Page from '@/components/utilities/Page';
import { notFound } from 'next/navigation';
import { isDevEnv } from '@/utils/environment';

export default function RegisterPage() {
  if (!isDevEnv() || true) {
    return notFound();
  }

  return (
    <Page hasNavbar={true} id="register-page" className={styles.loginPage} noWrapperPadding={true}>
      <RegisterForm />
    </Page>
  );
}
