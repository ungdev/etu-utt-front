import styles from './UENameFilter.module.scss';
import { useEffect, useRef, useState } from 'react';
import Input from '@/components/UI/Input';
import Icons from '@/icons';
import { useAppTranslation } from '@/lib/i18n';

export default function UENameFilter({
  onUpdate,
  forcedValue,
}: {
  onUpdate: (value: string | null, newUrlPart: string | null) => void;
  forcedValue: string | null;
}) {
  const [search, setSearch] = useState<string>('');
  const forcedValueRef = useRef<string | null>(null);
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setSearch(forcedValue);
  }
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
