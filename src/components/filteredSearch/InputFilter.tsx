import styles from './InputFilter.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import Input from '@/components/UI/Input';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';

export function InputFilter({
  onUpdate,
  forcedValue,
  placeholder,
  Icon,
  title,
}: BaseFilterProps<string> & {
  placeholder: NotParameteredTranslationKey;
  Icon?: FC;
  title: NotParameteredTranslationKey;
}) {
  const [search, setSearch] = useState<string>('');
  const { t } = useAppTranslation();
  const forcedValueRef = useRef<string | null>(null);
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setSearch(forcedValue);
  }
  useEffect(() => {
    onUpdate(search === '' ? null : search, search === '' ? null : search);
  }, [search]);

  return (
    <div className={styles.filter}>
      <h3 className={styles.title}>{t(title)}</h3>
      <div className={styles.input}>
        <Input
          type={'text'}
          value={search}
          onChange={setSearch}
          className={styles.input}
          placeholder={t(placeholder)}
        />
        {Icon && <Icon />}
      </div>
    </div>
  );
}

export function createInputFilter(
  placeholder: NotParameteredTranslationKey,
  title: NotParameteredTranslationKey,
  Icon?: FC,
): FC<BaseFilterProps<string>> {
  return function CustomInputFilter({ onUpdate, forcedValue }: BaseFilterProps<string>) {
    return (
      <InputFilter onUpdate={onUpdate} forcedValue={forcedValue} placeholder={placeholder} Icon={Icon} title={title} />
    );
  };
}
