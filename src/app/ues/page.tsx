'use client';

import styles from './styles.module.scss';
import { ReactElement, useEffect, useState } from 'react';
import UENameFilter from '@/components/ueFilters/UENameFilter';
import UECreditTypeFilter from '@/components/ueFilters/UECreditTypeFilter';
import UEBranchFilter from '@/components/ueFilters/UEBranchFilter';
import UEBranchOptionFilter from '@/components/ueFilters/UEBranchOptionFilter';
import UESemesterFilter from '@/components/ueFilters/UESemesterFilter';
import Trash from '@/icons/Trash';
import { useUEs } from '@/api/ue/search';
import { useRouter } from 'next/navigation';
import { DeepReadonly } from '@/types';
import { TranslationKey, useAppTranslation } from '@/lib/i18n';

/**
 * A React component that can be used as a filter.
 * It must take an `onUpdate` prop that gives back the new value of the filter and the associated value to pass to the URL parameter of that filter.
 * It also takes the dependencies of the filter as props, if any (for example, the branch option filter needs the branch filter to work properly)
 */
type UEFilterComponent<UEFilterType extends keyof UEFiltersType> = (
  props: {
    onUpdate: (value: UEFiltersType[UEFilterType]['value'] | null, newUrlPart: string | null) => void;
  } & DependencyProps<UEFilterType>,
) => ReactElement;

/**
 * The props that a filter component must take when it has dependencies.
 */
type DependencyProps<UEFilterType extends keyof UEFiltersType> = {
  [K in UEFiltersType[UEFilterType]['dependsOn'][number]]: UEFiltersType[K]['value'];
};

/**
 * The definition of a filter. A filter can be defined with only these fields :
 * - `component`: a React component (so a function) that will be used to interface with the user.
 * - `name`: the of the component that will be displayed (/ translated)
 * - `parameterName`: the name of the parameter in the URL. The value is given by the `onUpdate` function callback of the component.
 * - `dependsOn`: an array of the names (or IDs) of the filters that this filter depends on, ie other filters that need to be present, and that this filter need to be aware of to work properly.
 */
type UEFilter<UEFilterType extends keyof UEFiltersType> = {
  component: UEFilterComponent<UEFilterType>;
  parameterName: string;
} & (UEFilterType extends 'name'
  ? object
  : {
      name: TranslationKey;
    }) &
  (UEFiltersType[UEFilterType]['dependsOn']['length'] extends 0
    ? object
    : {
        dependsOn: UEFiltersType[UEFilterType]['dependsOn'];
      });

/**
 * The different filters that exist.
 */
type UEFiltersType = {
  name: { dependsOn: []; value: string };
  creditType: { dependsOn: []; value: 'CS' | 'TM' };
  branch: { dependsOn: []; value: 'RT' | 'ISI' | 'SN' };
  branchOption: { dependsOn: ['branch']; value: 'HEUUU' | 'JE CONNAIS PAS' };
  semester: { dependsOn: []; value: 'A' | 'P' };
};

/**
 * The definition of the filters. They can then be used in JavaScript code to get the filter component, the name of the filter, ...
 */
const ueFilters = Object.freeze({
  name: { component: UENameFilter, parameterName: 'q' }, // This one does not need a name as it will never be displayed
  creditType: { component: UECreditTypeFilter, name: 'ues:filter.creditType', parameterName: 'creditType' },
  branch: { component: UEBranchFilter, name: 'ues:filter.branch', parameterName: 'branch' },
  branchOption: {
    component: UEBranchOptionFilter,
    name: 'ues:filter.branchOption',
    dependsOn: ['branch'],
    parameterName: 'branchOption',
  },
  semester: { component: UESemesterFilter, name: 'ues:filter.semester', parameterName: 'semester' },
} as const satisfies {
  [key in keyof UEFiltersType]: DeepReadonly<UEFilter<key>>;
});

/**
 * The instance of a filter.
 * An instance is basically just the name of a filter, the current value of the filter, and the value of the URL parameter associated to this filter.
 */
type UEFilterInstance<T extends keyof UEFiltersType = keyof UEFiltersType> = {
  filter: keyof typeof ueFilters;
  value: UEFiltersType[T]['value'] | null;
  search: string | null;
};

/**
 * A filter instance that has a non-null value. Only these filters will be used to filter the UEs.
 */
type NonNullUEFilterInstance<T extends keyof UEFiltersType = keyof UEFiltersType> = {
  [K in keyof UEFilterInstance<T>]: Exclude<UEFilterInstance<T>[K], null>;
};

type NotNameFilter = Exclude<keyof UEFiltersType, 'name'>;

export default function Page() {
  const router = useRouter();
  const [showAddFilterDropdown, setShowAddFilterDropdown] = useState<boolean>(false);
  const [filters, setFilters] = useState<Array<UEFilterInstance>>([{ filter: 'name', value: null, search: null }]);
  const [lastUpdate] = useState<{ value: number }>({ value: Date.now() });
  const [ues, updateUEs] = useUEs();
  const { t } = useAppTranslation();
  useEffect(() => {
    const now = Date.now();
    lastUpdate.value = now;
    setTimeout(() => {
      if (lastUpdate.value === now) {
        updateUEs(
          Object.fromEntries(
            filters
              .filter((filter): filter is NonNullUEFilterInstance => filter.search !== null)
              .map((filter) => [ueFilters[filter.filter].parameterName, filter.search]),
          ),
        );
      }
    }, 1000);
  }, [filters]);
  const updateFilter = <T extends keyof UEFiltersType>(
    filterIndex: number,
    value: UEFiltersType[T]['value'] | null,
    newUrlPart: string | null,
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
  ) as NotNameFilter[];
  return (
    <div className={styles.uePage}>
      <h1>Guide des UEs</h1>
      <div className={styles.filtersBar}>
        <table>
          <tbody>
            {filters.map((filter, i) => {
              const Filter = ueFilters[filter.filter].component;
              const otherProps = Object.fromEntries(
                (ueFilters[filter.filter] as { dependsOn?: string[] }).dependsOn?.map((dependsOn) => {
                  return [dependsOn, filters.find((f) => f.filter === dependsOn)?.value];
                }) ?? [],
              );
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
                {ueFilters[filter].name !== null && t(ueFilters[filter].name!)}
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
