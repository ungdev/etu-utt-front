'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/app/(wrapper)/login/style.module.scss';
import Page from '@/components/utilities/Page';

export default function RegisterPage() {
  return (
    <Page hasNavbar={false} id="register-page" className={styles.loginPage}>
      <RegisterForm />
    </Page>
  );
}
