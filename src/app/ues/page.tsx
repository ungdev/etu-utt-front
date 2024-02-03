'use client';

import styles from './styles.module.scss';
import { ReactElement, useEffect, useState } from 'react';
import UENameFilter from '@/components/ueFilters/UENameFilter';
import UECreditTypeFilter from '@/components/ueFilters/UECreditTypeFilter';
import UEBranchFilter from '@/components/ueFilters/UEBranchFilter';
import UEBranchOptionFilter from '@/components/ueFilters/UEBranchOptionFilter';
import UESemesterFilter from '@/components/ueFilters/UESemesterFilter';
import Trash from '@/icons/Trash';

type UEFilterComponent<UEFilterType extends keyof UEFiltersType> = (
  props: {
    onUpdate: (value: UEFiltersType[UEFilterType]['value'], newUrlPart: string) => void;
  } & DependencyProps<UEFilterType>,
) => ReactElement;

type DependencyProps<UEFilterType extends keyof UEFiltersType> = {
  [K in UEFiltersType[UEFilterType]['dependsOn'][number]]: UEFiltersType[K]['value'];
};

type UEFilter<UEFilterType extends keyof UEFiltersType> = {
  component: UEFilterComponent<UEFilterType>;
  name: string;
} & (UEFiltersType[UEFilterType]['dependsOn']['length'] extends 0
  ? object
  : {
      dependsOn: UEFiltersType[UEFilterType]['dependsOn'];
    });

type UEFiltersType = {
  name: { dependsOn: []; value: string };
  creditType: { dependsOn: []; value: 'CS' | 'TM' };
  branch: { dependsOn: []; value: 'RT' | 'ISI' | 'SN' };
  branchOption: { dependsOn: ['branch']; value: 'HEUUU' | 'JE CONNAIS PAS' };
  semester: { dependsOn: []; value: 'A' | 'P' };
};

const ueFilters = Object.freeze({
  name: { component: UENameFilter, name: '' }, // This one does not need a name as it will never be displayed
  creditType: { component: UECreditTypeFilter, name: 'Type de crédits' },
  branch: { component: UEBranchFilter, name: 'Branche' },
  branchOption: { component: UEBranchOptionFilter, name: 'Filière', dependsOn: ['branch'] },
  semester: { component: UESemesterFilter, name: 'Semestre' },
} as const satisfies {
  [key in keyof UEFiltersType]: UEFilter<key>;
});

type UEFilterInstance<T extends keyof UEFiltersType = keyof UEFiltersType> = {
  filter: keyof typeof ueFilters;
  value: UEFiltersType[T]['value'] | null;
  urlPart: string | null;
};

export default function Page() {
  const [showAddFilterDropdown, setShowAddFilterDropdown] = useState<boolean>(false);
  const [filters, setFilters] = useState<Array<UEFilterInstance>>([{ filter: 'name', value: null, urlPart: null }]);
  const [lastUpdate] = useState<{ value: number }>({ value: Date.now() });
  useEffect(() => {
    const now = Date.now();
    lastUpdate.value = now;
    setTimeout(() => {
      if (lastUpdate.value === now) {
        console.log('Filters have not been updated for 1 second');
      }
    }, 1000);
  }, [filters]);
  const updateFilter = <T extends keyof UEFiltersType>(
    filterIndex: number,
    value: UEFiltersType[T]['value'],
    newUrlPart: string,
  ) => {
    const newFilters = [...filters];
    newFilters[filterIndex].value = value;
    newFilters[filterIndex].urlPart = newUrlPart;
    setFilters(newFilters);
  };
  const addFilter = (name: keyof typeof ueFilters) => {
    setFilters([...filters, { filter: name, value: null, urlPart: null }]);
  };
  const deleteFilter = (index: number) => {
    const newFilters = filters.toSpliced(index, 1).filter(
      (filter) =>
        !{
          dependsOn: [],
          ...ueFilters[filter.filter],
        }.dependsOn.some((dependency) => dependency === filters[index].filter),
    );
    setFilters(newFilters);
  };
  const hasFilter = (filter: keyof typeof ueFilters) => filters.some((usedFilter) => usedFilter.filter === filter);
  const addableFilters = Object.keys(ueFilters).filter(
    (filter) => !hasFilter(filter) && { dependsOn: [], ...ueFilters[filter] }.dependsOn.every(hasFilter),
  );
  return (
    <div className={styles.uePage}>
      <h1>Guide des UEs</h1>
      <div className={styles.filtersBar}>
        <table>
          <tbody>
            {filters.map((filter, i) => {
              const Filter = ueFilters[filter.filter].component;
              const otherProps = (ueFilters[filter.filter] as { dependsOn?: unknown }).dependsOn
                ? Object.fromEntries(
                    { dependsOn: [], ...ueFilters[filter.filter] }.dependsOn?.map((dependsOn) => {
                      return [dependsOn, filters.find((f) => f.filter === dependsOn)?.value];
                    }),
                  )
                : {};
              return (
                <tr key={filter.filter}>
                  <td>
                    <Filter
                      onUpdate={(value, newUrlPart) => updateFilter(i, value, newUrlPart)}
                      {...(otherProps as DependencyProps<typeof filter.filter>)}
                    />
                  </td>
                  <td>
                    {i !== 0 && (
                      <button onClick={() => deleteFilter(i)}>
                        <Trash className={styles.trash} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.addFilter}>
          <button
            onFocus={() => setShowAddFilterDropdown(true)}
            onBlur={() => setShowAddFilterDropdown(false)}
            disabled={addableFilters.length === 0}>
            + Ajouter des filtres
          </button>
          <div className={`${styles.addFilterDropdown} ${showAddFilterDropdown ? styles.show : ''}`}>
            {addableFilters.map((filter) => (
              <button key={filter} onClick={() => addFilter(filter)}>
                {ueFilters[filter].name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
