import styles from './SelectFilter.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';

export function SelectFilter<Choices extends string>({
  onUpdate,
  forcedValue,
  choices,
  title,
}: BaseFilterProps<Choices> & { choices: Choices[]; title: NotParameteredTranslationKey }) {
  const [value, setValue] = useState<Choices | 'all'>('all');
  const { t } = useAppTranslation();
  const forcedValueRef = useRef<string | null>(null);
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setValue(([...choices, 'all'].includes(forcedValue) ? forcedValue : 'all') as Choices | 'all');
  }
  useEffect(() => {
    onUpdate(value === 'all' ? null : value, value === 'all' ? null : value);
  }, [value]);
  return (
    <div className={styles.filter}>
      <h3 className={styles.title}>{t(title)}</h3>
      <label key={'all'} className={styles.option}>
        <input type={'radio'} name={title} value={'all'} onChange={() => setValue('all')} />
        {t('ues:filter.all')}
      </label>
      {choices.map((choice) => (
        <label key={choice} className={styles.option}>
          <input type={'radio'} name={title} value={choice} onChange={() => setValue(choice)} />
          {choice}
        </label>
      ))}
    </div>
  );
}

export function createSelectFilter<Choices extends string>(
  choices: Choices[],
  title: NotParameteredTranslationKey,
): FC<BaseFilterProps<Choices>> {
  return function SelectFilterWrapper(props: BaseFilterProps<Choices>) {
    return <SelectFilter {...props} choices={choices} title={title} />;
  };
}
