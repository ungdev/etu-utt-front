import styles from './InputFilter.module.scss';
import { FC, useDeferredValue, useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';

export function InputFilter({
  onUpdate,
  value,
  placeholder,
  icon: Icon,
  title,
}: BaseFilterProps<string> & {
  placeholder: NotParameteredTranslationKey;
  icon?: FC;
  title: NotParameteredTranslationKey;
}) {
  const [search, setSearch] = useState<string>('');
  const { t } = useAppTranslation();
  const lazyValue = useDeferredValue(value);
  if (lazyValue !== value && value) setSearch(value);

  useEffect(() => {
    onUpdate(search === '' ? null : search, search === '' ? null : search);
  }, [search]);

  return (
    <div className={styles.filter}>
      <h3 className={styles.title}>{t(title)}</h3>
      <Input
        type={'text'}
        value={search}
        onChange={setSearch}
        className={styles.input}
        placeholder={t(placeholder)}
        icon={Icon}
      />
    </div>
  );
}

export function createInputFilter(
  placeholder: NotParameteredTranslationKey,
  title: NotParameteredTranslationKey,
  icon?: FC,
): FC<BaseFilterProps<string>> {
  return function CustomInputFilter({ onUpdate, value }: BaseFilterProps<string>) {
    return <InputFilter onUpdate={onUpdate} value={value} placeholder={placeholder} icon={icon} title={title} />;
  };
}
