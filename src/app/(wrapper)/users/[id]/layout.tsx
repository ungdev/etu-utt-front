'use client';
import { useParams, usePathname } from 'next/navigation';
import { useUser } from '@/api/users/getUser';
import Link from '@/components/UI/Link';
import styles from './layout.module.scss';
import defaultAvatar from '../../../../../public/images/default-avatar.jpg';
import { apiUrl } from '@/utils/environment';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';

const tabsInfo = [
  { path: '/', name: 'users:generalInfo.tabName' },
  { path: '/assos', name: 'users:assos.tabName' },
] as Array<{ path: string; name: NotParameteredTranslationKey }>;

export default function UserDetailsLayout({ children }: { children: React.ReactNode }) {
  const { id: userId } = useParams<{ id: string }>();
  const pathname = usePathname().match(/\/users\/[\w-]+(\/\w+)?/)?.[1] ?? '/';
  const user = useUser(userId);
  const { t } = useAppTranslation();
  if (!user) {
    return false;
  }
  return (
    <div className={styles.userDetailsLayout}>
      <div className={styles.header}>
        <img
          className={styles.avatar}
          src={user.avatar && user.avatar !== 'default.png' ? `${apiUrl}${user.avatar}` : defaultAvatar.src}
          alt={'avatar'}
        />
        <div className={styles.basicInfo}>
          <h1 className={styles.name}>
            {user.firstName} {user.lastName}
          </h1>
          <p className={styles.semester}>
            {user.branch}
            {user.semester}
          </p>
        </div>
      </div>
      <div className={styles.tabs}>
        {tabsInfo.map((tab) => (
          <Link
            key={tab.path}
            href={`/users/${userId}${tab.path}`}
            className={`${styles.tab} ${tab.path === pathname ? styles.active : ''}`}
            noStyle>
            {t(tab.name)}
          </Link>
        ))}
      </div>
      <div className={styles.page}>{children}</div>
    </div>
  );
}
