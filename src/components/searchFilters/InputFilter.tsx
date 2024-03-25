import styles from './InputFilter.module.scss';
import { useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/FilteredSearch';

export function InputFilter({
  onUpdate,
  placeholder,
  Icon,
}: BaseFilterProps<string> & { placeholder: NotParameteredTranslationKey; Icon?: React.FC }) {
  const [search, setSearch] = useState<string>('');
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(search === '' ? null : search, search === '' ? null : search);
  }, [search]);
  return (
    <div className={styles.filter}>
      <Input type={'text'} value={search} onChange={setSearch} className={styles.input} placeholder={t(placeholder)} />
      {Icon && <Icon />}
    </div>
  );
}

export function createInputFilter(
  placeholder: NotParameteredTranslationKey,
  Icon?: React.FC,
): React.FC<BaseFilterProps<string>> {
  return function CustomInputFilter({ onUpdate }: BaseFilterProps<string>) {
    return <InputFilter onUpdate={onUpdate} placeholder={placeholder} Icon={Icon} />;
  };
}
