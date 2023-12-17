import RegisterForm from '@/app/register/RegisterForm';
import styles from '@/app/login/style.module.scss';

export default function RegisterPage() {
  return (
    <div id="register-page" className={styles.loginPage}>
      <RegisterForm />
    </div>
  );
}
