import styles from './SelectFilter.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import { NotParameteredTranslationKey, useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';
import Select from "@/components/UI/Select";

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
  const [value, _setValue] = useState<Choices | 'all'>('all');
  const { t } = useAppTranslation();
  const forcedValueRef = useRef<string | null>(null);
  const setValue = (val: Choices | 'all') => {
    _setValue(val);
    onUpdate(val === 'all' ? null : val, val === 'all' ? null : val)
  }
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setValue(([...choices, 'all'].includes(forcedValue) ? forcedValue : 'all') as Choices | 'all');
  }
  return (
    <div className={styles.filter}>
      <h3 className={styles.title}>{t(title)}</h3>
      <Select<'all' | Choices>
        className={styles.select}
        value={value}
        options={{
          'all': t("common:filter.all"),
          ...Object.fromEntries(choices.map((choice) => [choice, humanReadableMapping ? t(humanReadableMapping[choice]) : choice])) as Record<Choices, string>}}
        onChange={setValue} />
    </div>
  );
}

export function createSelectFilter<Choices extends string>(
  choices: Choices[],
  title: NotParameteredTranslationKey,
  humanReadableMapping?: Record<Choices, NotParameteredTranslationKey>
): FC<BaseFilterProps<Choices>> {
  return function SelectFilterWrapper(props: BaseFilterProps<Choices>) {
    return <SelectFilter {...props} choices={choices} title={title} humanReadableMapping={humanReadableMapping} />;
  };
}
