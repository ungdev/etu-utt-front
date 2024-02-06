'use client';

import styles from './styles.module.scss';
import { ReactElement, useEffect, useState } from 'react';
import UENameFilter from '@/components/ueFilters/UENameFilter';
import UECreditTypeFilter from '@/components/ueFilters/UECreditTypeFilter';
import UEBranchFilter from '@/components/ueFilters/UEBranchFilter';
import UEBranchOptionFilter from '@/components/ueFilters/UEBranchOptionFilter';
import UESemesterFilter from '@/components/ueFilters/UESemesterFilter';
import Trash from '@/icons/Trash';
import { useSearchUEs } from '@/api/ue/search';
import { useRouter } from 'next/navigation';

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
  parameterName: string;
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
  name: { component: UENameFilter, name: '', parameterName: 'q' }, // This one does not need a name as it will never be displayed
  creditType: { component: UECreditTypeFilter, name: 'Type de crédits', parameterName: 'creditType' },
  branch: { component: UEBranchFilter, name: 'Branche', parameterName: 'branch' },
  branchOption: {
    component: UEBranchOptionFilter,
    name: 'Filière',
    dependsOn: ['branch'],
    parameterName: 'branchOption',
  },
  semester: { component: UESemesterFilter, name: 'Semestre', parameterName: 'semester' },
} as const satisfies {
  [key in keyof UEFiltersType]: DeepReadonly<UEFilter<key>>;
});

type UEFilterInstance<T extends keyof UEFiltersType = keyof UEFiltersType> = {
  filter: keyof typeof ueFilters;
  value: UEFiltersType[T]['value'] | null;
  search: string | null;
};

type RealUEFilterInstance<T extends keyof UEFiltersType = keyof UEFiltersType> = {
  [K in keyof UEFilterInstance<T>]: Exclude<UEFilterInstance<T>[K], null>;
};

export default function Page() {
  const router = useRouter();
  const [showAddFilterDropdown, setShowAddFilterDropdown] = useState<boolean>(false);
  const [filters, setFilters] = useState<Array<UEFilterInstance>>([{ filter: 'name', value: null, search: null }]);
  const [lastUpdate] = useState<{ value: number }>({ value: Date.now() });
  const [ues, updateUEs] = useSearchUEs();
  useEffect(() => {
    const now = Date.now();
    lastUpdate.value = now;
    setTimeout(() => {
      if (lastUpdate.value === now) {
        updateUEs(
          Object.fromEntries(
            filters
              .filter((filter): filter is RealUEFilterInstance => filter.search !== null)
              .map((filter) => [ueFilters[filter.filter].parameterName, filter.search]),
          ),
        );
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
    newFilters[filterIndex].search = newUrlPart;
    setFilters(newFilters);
  };
  const addFilter = (name: keyof typeof ueFilters) => {
    setFilters([...filters, { filter: name, value: null, search: null }]);
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
      <div>
        {ues.map((ue) => (
          <div key={ue.code} className={styles.ue} onClick={() => router.push(`/ues/${ue.code}`)}>
            <div className={styles.basicInfo}>
              <h2>{ue.code}</h2>
              <p>{ue.name}</p>
            </div>
            <p className={styles.details}>Détails {'>'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
