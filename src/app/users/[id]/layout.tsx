'use client';
import { useParams, usePathname } from 'next/navigation';
import { useUser } from '@/api/users/getUser';
import Link from '@/components/UI/Link';
import styles from './layout.module.scss';
import defaultAvatar from '@/../public/images/default-avatar.jpg';

const tabsInfo = [
  { path: '/', name: 'Informations' },
  { path: '/assos', name: 'Associatif' },
];

export default function UserDetailsLayout({ children }: { children: React.ReactNode }) {
  const { id: userId } = useParams<{ id: string }>();
  const pathname = usePathname().match(/\/users\/[\w-]+(\/\w+)?/)?.[1] ?? '/';
  const user = useUser(userId);
  if (!user) {
    return false;
  }
  return (
    <div className={styles.userDetailsLayout}>
      <div className={styles.header}>
        <img className={styles.avatar} src={defaultAvatar.src} />
        <h1 className={styles.name}>
          {user.firstName} {user.lastName}
        </h1>
      </div>
      <div className={styles.tabs}>
        {tabsInfo.map((tab) => (
          <Link
            key={tab.path}
            href={`/users/${userId}${tab.path}`}
            className={`${styles.tab} ${tab.path === pathname ? styles.active : ''}`}
            noStyle>
            {tab.name}
          </Link>
        ))}
      </div>
      <div className={styles.page}>{children}</div>
    </div>
  );
}
