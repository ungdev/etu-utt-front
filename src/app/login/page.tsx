import styles from './style.module.scss';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div id="login-page" className={styles.loginPage}>
      <LoginForm />
    </div>
  );
}
