import styles from './SelectFilter.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';
import Select from '@/components/UI/Select';

export function SelectFilter<Choices extends string>({
  onUpdate,
  forcedValue,
  choices,
  title,
  humanReadableMapping,
}: BaseFilterProps<Choices> & {
  choices: Choices[];
  title: NotParameteredTranslationKey;
  humanReadableMapping?: Record<Choices, NotParameteredTranslationKey>;
}) {
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
      <Select<Choices | 'all'>
        options={[
          { id: 'all', name: t('common:filter.all') },
          ...choices.map((choice) => ({
            id: choice,
            name: humanReadableMapping ? t(humanReadableMapping[choice]) : choice,
          })),
        ]}
        onSelect={setValue}
        value={value}
      />
    </div>
  );
}

export function createSelectFilter<Choices extends string>(
  choices: Choices[],
  title: NotParameteredTranslationKey,
  humanReadableMapping?: Record<Choices, NotParameteredTranslationKey>,
): FC<BaseFilterProps<Choices>> {
  return function SelectFilterWrapper(props: BaseFilterProps<Choices>) {
    return <SelectFilter {...props} choices={choices} title={title} humanReadableMapping={humanReadableMapping} />;
  };
}
