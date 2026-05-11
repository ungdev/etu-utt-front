import styles from './Loader.module.scss';
import Icons from '@/icons';
import { isDevEnv } from '@/utils/environment';

export default function Loader() {
  return (
    <div className={styles.loader}>
      <Icons.LogoEtu className={styles.icon} />
      {isDevEnv() && (
        <p>
          <strong>DevNote:</strong> Make sure the page is surrounded with the Page component
        </p>
      )}
    </div>
  );
}
