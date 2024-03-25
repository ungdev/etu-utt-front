import { useEffect, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import { BaseFilterProps } from '@/components/filteredSearch/FilteredSearch';

export function SelectFilter<Choices extends string>({
  onUpdate,
  choices,
}: BaseFilterProps<Choices> & { choices: Choices[] }) {
  const [value, setValue] = useState<Choices | 'all'>('all');
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(value === 'all' ? null : value, value === 'all' ? null : value);
  }, [value]);
  return (
    <select value={value} onChange={(event) => setValue(event.target.value as Choices | 'all')}>
      <option key={null} value="all">
        {t('ues:filter.semester.all')}
      </option>
      {choices.map((choice) => (
        <option key={choice} value={choice}>
          {choice}
        </option>
      ))}
    </select>
  );
}

export function createSelectFilter<Choices extends string>(choices: Choices[]): React.FC<BaseFilterProps<Choices>> {
  return function SelectFilterWrapper(props: BaseFilterProps<Choices>) {
    return <SelectFilter {...props} choices={choices} />;
  };
}
