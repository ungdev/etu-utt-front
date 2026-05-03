'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/app/(wrapper)/login/style.module.scss';
import Page from '@/components/utilities/Page';

export default function RegisterPage() {
  return (
    <Page hasNavbar={true} id="register-page" className={styles.loginPage} noWrapperPadding={true}>
      <RegisterForm />
    </Page>
  );
}
