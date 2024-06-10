'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from '@/app/login/style.module.scss';
import { usePageSettings } from '@/module/pageSettings';

export default function RegisterPage() {
  usePageSettings({ hasNavbar: false, permissions: 'public' });
  return (
    <div id="register-page" className={styles.loginPage}>
      <RegisterForm />
    </div>
  );
}
