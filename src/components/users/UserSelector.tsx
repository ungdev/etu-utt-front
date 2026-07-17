import { PropsWithoutRef, useEffect, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import { useUsers } from '@/api/users/searchUsers.hook';
import { User } from '@/api/users/user.interface';
import Input from '../UI/Input';
import styles from './UserSelector.module.scss';
import { UserCard } from './UserCard';

export default function UserSelector({
  updateInterval = 500,
  onSelect,
}: PropsWithoutRef<{ updateInterval?: number; onSelect?: (user: User) => void }>) {
  const { t } = useAppTranslation();

  const { items, updateFilters } = useUsers();

  const [searchString, setSearchString] = useState<string>('');

  useEffect(() => {
    const tId = setTimeout(() => updateFilters({ q: searchString }), updateInterval);
    return () => clearTimeout(tId);
  }, [searchString]);

  const select = (user: User) => {
    setSearchString('');
    onSelect?.(user);
  };

  return (
    <div className={styles.userSelector}>
      <Input value={searchString} onChange={setSearchString} placeholder={t('users:selector.ui.placeholder')} />
      <div className={styles.resultPool}>
        {!items.length && <div className={styles.noResult}>{t('users:selector.ui.noResult')}</div>}
        {items.map((user: User | null) => user && <UserCard key={user.id} user={user} onSelect={select} />)}
      </div>
    </div>
  );
}
