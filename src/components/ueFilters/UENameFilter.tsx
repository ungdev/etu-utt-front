import styles from './UENameFilter.module.scss';
import { useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import Icons from '@/icons';
import { useTranslation } from 'react-i18next';

export default function UENameFilter({ onUpdate }: { onUpdate: (value: string, newUrlPart: string) => void }) {
  const [search, setSearch] = useState<string>('');
  const { t } = useTranslation();
  useEffect(() => {
    onUpdate(search, search);
  }, [search]);
  return (
    <div className={styles.filter}>
      <Input
        type={'text'}
        value={search}
        onChange={setSearch}
        className={styles.input}
        placeholder={t('ues:filter.search')}
      />
      <Icons.User />
    </div>
  );
}
