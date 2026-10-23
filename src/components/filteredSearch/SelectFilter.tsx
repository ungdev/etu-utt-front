import styles from './SelectFilter.module.scss';
import { FC, useDeferredValue, useEffect, useState } from 'react';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';
import Select from '@/components/UI/Select';

export function SelectFilter<Choices extends string>({
  onUpdate,
  value,
  choices,
  title,
  humanReadableMapping,
}: BaseFilterProps<Choices> & {
  choices: Choices[];
  title: NotParameteredTranslationKey;
  humanReadableMapping?: Record<Choices, NotParameteredTranslationKey>;
}) {
  const [display, setValue] = useState<Choices | 'all'>('all');
  const { t } = useAppTranslation();
  const deferredValue = useDeferredValue(value);

  if (value !== deferredValue && value !== null)
    setValue(([...choices, 'all'].includes(value) ? value : 'all') as Choices | 'all');

  useEffect(() => {
    onUpdate(display === 'all' ? null : display, display === 'all' ? null : display);
  }, [display]);

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
        value={display}
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
