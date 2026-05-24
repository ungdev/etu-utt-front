import styles from './FilteredSearch.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import { useAppSelector } from '@/lib/hooks';

/**
 * A React component that can be used as a filter.
 * It must take an `onUpdate` prop that gives back the new value of the filter and the associated value to pass to the URL parameter of that filter.
 * It also takes the dependencies of the filter as props, if any (for example, the branch option filter needs the branch filter to work properly)
 */
type FilterComponent<
  FilterNames extends string,
  FiltersType extends GenericFiltersType<FilterNames>,
  FilterName extends FilterNames,
> = React.FC<BaseFilterProps<FiltersType[FilterName]['value']> & DependencyProps<FilterNames, FiltersType, FilterName>>;

/**
 * The props that a filter component must take when it has dependencies.
 */
type DependencyProps<
  FilterNames extends string,
  FiltersType extends GenericFiltersType<FilterNames>,
  FilterName extends FilterNames,
> = {
  [K in FiltersType[FilterName]['dependsOn'][number]]: FiltersType[K]['value'];
};

export type BaseFilterProps<Value extends string> = {
  onUpdate: (value: Value | null, search: string | null) => void;
  forcedValue: string | null;
};

/**
 * The definition of a filter. A filter can be defined with only these fields :
 * - `component`: a React component (so a function) that will be used to interface with the user.
 * - `name`: the name of the component that will be displayed (this is actually a translation key)
 * - `parameterName`: the name of the parameter in the URL. The value is given by the `onUpdate` function callback of the component.
 * - `dependsOn`: an array of the names (or IDs) of the filters that this filter depends on, ie other filters that need to be present, and that this filter need to be aware of to work properly.
 */
type Filter<
  FilterNames extends string,
  FiltersType extends GenericFiltersType<FilterNames>,
  FilterType extends FilterNames,
> = {
  component: FilterComponent<FilterNames, FiltersType, FilterType>;
  parameterName: string;
  updateDelayed: boolean;
} & (FiltersType[FilterType]['dependsOn']['length'] extends 0
  ? object
  : {
      dependsOn: FiltersType[FilterType]['dependsOn'];
    });

/**
 * A type that will be implemented by the interface representing the different filters that exist.
 */
export type GenericFiltersType<FilterNames extends string> = {
  [K in FilterNames]: { dependsOn: FilterNames[]; value: string };
};

export type FiltersDataType<FilterNames extends string, FiltersType extends GenericFiltersType<FilterNames>> = {
  [FilterName in FilterNames]: Filter<FilterNames, FiltersType, FilterName>;
};

/**
 * The instance of a filter.
 * An instance is basically just the name of a filter, the current value of the filter, and the value of the URL parameter associated to this filter.
 */
type FilterInstance<
  FilterNames extends string,
  FiltersType extends GenericFiltersType<FilterNames>,
  T extends FilterNames = FilterNames,
> = {
  filter: FilterNames;
  value: FiltersType[T]['value'] | null;
  search: string | null;
  forcedValue: FiltersType[T]['value'] | null;
};

/**
 * A filter instance that has a non-null value. Only these filters will be used to filter the UEs.
 */
type NonNullFilterInstance<
  FilterNames extends string,
  FiltersType extends GenericFiltersType<FilterNames>,
  T extends FilterNames = FilterNames,
> = {
  [K in keyof FilterInstance<FilterNames, FiltersType, T>]: Exclude<
    FilterInstance<FilterNames, FiltersType, T>[K],
    null
  >;
};

enum FilterUpdateType {
  NoUpdate,
  Delay,
  Instant,
}

export default function FilteredSearch<
  FilterNames extends string,
  FiltersType extends GenericFiltersType<FilterNames>,
>({
  filtersData,
  updateSearch,
}: {
  filtersData: FiltersDataType<FilterNames, FiltersType>;
  updateSearch: (filters: Record<string, string>, page?: number) => void;
}) {
  // The filters currently used.
  const [filters, _setFilters] = useState<Array<FilterInstance<FilterNames, FiltersType>>>(
    Object.entries(filtersData)
      .filter(([, filter]) => !('dependsOn' in filter) || filter.dependsOn.length === 0)
      .map(([filterName]) => ({ filter: filterName, value: null, search: null, forcedValue: null })),
  );
  // When the filters were last updated. Used to avoid updating the search too often.
  const [lastUpdate] = useState<{ value: number }>({ value: Date.now() });
  const { t } = useAppTranslation();
  const searchParams = useAppSelector((state) => state.pageSettings.searchParams);
  const updateType = useRef(FilterUpdateType.NoUpdate);

  // Update the value of filters when the URL parameters.
  useEffect(() => {
    Object.entries(searchParams).forEach(([value, key]) => {
      const [filterName] = Object.entries(filtersData).find(([, filter]) => filter.parameterName === key) ?? [
        undefined,
      ];
      if (filterName === undefined) return;
      const index = filters.findIndex((filter) => filter.filter === filterName);
      if (index >= 0) {
        updateFilter(index, { forcedValue: value });
      } else {
        addFilter(filterName, value);
      }
    });
  }, [searchParams]);

  // When filters are modified, update the search after 1 second.
  useEffect(() => {
    const now = Date.now();
    switch (updateType.current) {
      case FilterUpdateType.Instant:
        lastUpdate.value = now;
        callUpdateSearch();
        break;
      case FilterUpdateType.Delay:
        lastUpdate.value = now;
        setTimeout(() => {
          if (lastUpdate.value === now) {
            callUpdateSearch();
          }
        }, 300);
        break;
    }
    updateType.current = FilterUpdateType.NoUpdate;
  }, [filters]);

  const callUpdateSearch = () => {
    updateSearch(
      Object.fromEntries(
        filters
          .filter((filter): filter is NonNullFilterInstance<FilterNames, FiltersType> => filter.search !== null)
          .map((filter) => [filtersData[filter.filter].parameterName, filter.search]),
      ),
    );
  };

  const setFilters = (filters: Parameters<typeof _setFilters>[0], updateTypeValue: FilterUpdateType) => {
    _setFilters(filters);
    updateType.current = Math.max(updateTypeValue, updateType.current);
  };

  const deleteDependentFilters = (filterName: FilterNames) => {
    filters
      .filter((filter) =>
        ({ dependsOn: [], ...filtersData[filter.filter] }).dependsOn.some((dependsOn) => dependsOn === filterName),
      )
      .map((filter) => {
        deleteDependentFilters(filter.filter);
        setFilters((filters) => filters.filter((f) => f.filter !== filter.filter), FilterUpdateType.Instant);
      });
  };

  const createDependentFilters = (filterName: FilterNames) => {
    Object.entries(filtersData)
      .filter(([, filter]) => ({ dependsOn: [], ...filter }).dependsOn.some((dependsOn) => dependsOn === filterName))
      .map(([filterName]) => addFilter(filterName));
  };

  const addFilter = (name: FilterNames, forcedValue?: string) => {
    setFilters(
      (filters) => [...filters, { filter: name, value: null, search: null, forcedValue: forcedValue ?? null }],
      FilterUpdateType.Instant,
    );
  };

  const updateFilter = <T extends FilterNames>(
    filterIndex: number,
    { value, search, forcedValue }: Partial<Omit<FilterInstance<FilterNames, FiltersType, T>, 'filter'>>,
  ) => {
    const newFilters = [...filters];
    const oldValue = newFilters[filterIndex].value;
    if (value !== undefined) newFilters[filterIndex].value = value;
    if (search !== undefined) newFilters[filterIndex].search = search;
    if (forcedValue !== undefined) newFilters[filterIndex].forcedValue = forcedValue;
    if (filtersData[newFilters[filterIndex].filter].updateDelayed) {
      setFilters(newFilters, FilterUpdateType.Delay);
    } else {
      setFilters(newFilters, FilterUpdateType.Instant);
    }
    if (value === null) {
      deleteDependentFilters(newFilters[filterIndex].filter);
    } else if (oldValue === null) {
      createDependentFilters(newFilters[filterIndex].filter);
    }
  };

  return (
    <div className={styles.filtersBar}>
      <h2>{t('common:filter.filters')}</h2>
      {filters.map((filter, i) => {
        const Filter = filtersData[filter.filter].component;
        const otherProps = Object.fromEntries(
          (filtersData[filter.filter] as { dependsOn?: string[] }).dependsOn?.map((dependsOn) => {
            return [dependsOn, filters.find((f) => f.filter === dependsOn)?.value];
          }) ?? [],
        );
        return (
          <div key={filter.filter} className={styles.filter}>
            <Filter
              onUpdate={(value, search) => updateFilter(i, { value, search })}
              forcedValue={filter.forcedValue}
              {...(otherProps as DependencyProps<FilterNames, FiltersType, typeof filter.filter>)}
            />
          </div>
        );
      })}
    </div>
  );
}
