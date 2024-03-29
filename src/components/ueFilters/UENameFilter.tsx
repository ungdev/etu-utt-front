import styles from './UENameFilter.module.scss';
import { useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import Icons from '@/icons';
import { useAppTranslation } from '@/lib/i18n';

export default function UENameFilter({
  onUpdate,
}: {
  onUpdate: (value: string | null, newUrlPart: string | null) => void;
}) {
  const [search, setSearch] = useState<string>('');
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(search === '' ? null : search, search === '' ? null : search);
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
