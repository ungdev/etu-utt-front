'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/app/login/style.module.scss';
import Page from '@/components/utilities/Page';

export default function RegisterPage() {
  return (
    <Page hasNavbar={false} permissions={'public'} id="register-page" className={styles.loginPage}>
      <RegisterForm />
    </Page>
  );
}
