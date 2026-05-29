import { User } from '@/api/users/user.interface';
import { useAppTranslation } from '@/lib/i18n';
import styles from './UserCard.module.scss';

export function UserCard({ user, onSelect }: { user: User; onSelect?: (user: User) => void }) {
  const { t } = useAppTranslation();
  return (
    <div className={styles.user} onClick={() => onSelect?.(user)}>
      <div className={styles.avatar}>
        {user?.avatar ? (
          <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
        ) : (
          user?.firstName.charAt(0) || '?'
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>
          {user?.firstName || user?.lastName ? (
            <>
              {user?.firstName} {user?.lastName}
            </>
          ) : (
            t('users:selector.ui.noName')
          )}
        </div>
        <div className={styles.cursus}>
          {user?.branch || user?.semester ? (
            <>
              {user?.branch} {user?.semester}
            </>
          ) : (
            t('users:selector.ui.noCursus')
          )}
        </div>
      </div>
    </div>
  );
}
