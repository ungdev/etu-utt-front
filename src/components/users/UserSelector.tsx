'use client';

import { PropsWithoutRef, useEffect, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import { useUsers } from '@/api/users/searchUsers.hook';
import { User } from '@/api/users/user.interface';
import Input from '../UI/Input';
import styles from './UserSelector.module.scss';

export default function UserSelector({
  updateInterval = 1000,
  onSelect,
}: PropsWithoutRef<{ updateInterval?: number; onSelect?: (user: User) => void }>) {
  const { t } = useAppTranslation();

  const { items, updateFilters } = useUsers();

  const [searchString, setSearchString] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<number>(-1);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    if (Date.now() - lastUpdate >= updateInterval) {
      updateFilters({ q: searchString });
      setLastUpdate(Date.now());
    } else {
      if (timeoutId >= 0) clearTimeout(timeoutId);
      setTimeoutId(
        window.setTimeout(
          () => {
            updateFilters({ q: searchString });
            setLastUpdate(Date.now());
            setTimeoutId(-1);
          },
          updateInterval - (Date.now() - lastUpdate),
        ),
      );
    }
  }, [searchString]);

  const select = (user: User) => {
    setSearchString('');
    onSelect?.(user);
  };

  return (
    <div className={styles.userSelector}>
      <Input
        value={searchString}
        onChange={(value) => setSearchString(value)}
        placeholder={t('users:selector.ui.placeholder')}
      />
      <div className={styles.resultPool}>
        {!items.length && <div className={styles.noResult}>{t('users:selector.ui.noResult')}</div>}
        {items.map(
          (user: User | null) =>
            user && (
              <div key={user?.id} className={styles.user} onClick={() => select(user)}>
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
                  <div>
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
            ),
        )}
      </div>
    </div>
  );
}
