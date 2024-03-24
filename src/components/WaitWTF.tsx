import styles from './WaitWTF.module.scss';
import { ReactElement, useEffect, useState } from 'react';
import Trash from '@/icons/Trash';
import { NotParameteredTranslationKey, TranslationKey, useAppTranslation } from '@/lib/i18n';

/**
 * A React component that can be used as a filter.
 * It must take an `onUpdate` prop that gives back the new value of the filter and the associated value to pass to the URL parameter of that filter.
 * It also takes the dependencies of the filter as props, if any (for example, the branch option filter needs the branch filter to work properly)
 */
type FilterComponent<
  FilterNames extends string,
  FiltersType extends FiltersTypeLayout<FilterNames>,
  FilterType extends FilterNames,
> = (
  props: {
    onUpdate: (value: FiltersType[FilterType]['value'] | null, newUrlPart: string | null) => void;
  } & DependencyProps<FilterNames, FiltersType, FilterType>,
) => ReactElement;

/**
 * The props that a filter component must take when it has dependencies.
 */
type DependencyProps<
  FilterNames extends string,
  FiltersType extends FiltersTypeLayout<FilterNames>,
  FilterType extends FilterNames,
> = {
  [K in FiltersType[FilterType]['dependsOn'][number]]: FiltersType[K]['value'];
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
  FiltersType extends FiltersTypeLayout<FilterNames>,
  FilterType extends FilterNames,
  DefaultFilterName extends FilterNames,
> = {
  component: FilterComponent<FilterNames, FiltersType, FilterType>;
  parameterName: string;
} & (FilterType extends DefaultFilterName
  ? object
  : {
      name: TranslationKey;
    }) &
  (FiltersType[FilterType]['dependsOn']['length'] extends 0
    ? object
    : {
        dependsOn: FiltersType[FilterType]['dependsOn'];
      });

/**
 * A type that will be implemented by the interface representing the different filters that exist.
 */
export type FiltersTypeLayout<FilterNames extends string> = {
  [K in FilterNames]: { dependsOn: FilterNames[]; value: string };
};

export type FiltersDataType<
  FilterNames extends string,
  FiltersType extends FiltersTypeLayout<FilterNames>,
  DefaultFilterName extends FilterNames,
> = {
  [FilterName in FilterNames]: Filter<FilterNames, FiltersType, FilterName, DefaultFilterName>;
};

/**
 * The instance of a filter.
 * An instance is basically just the name of a filter, the current value of the filter, and the value of the URL parameter associated to this filter.
 */
type FilterInstance<
  FilterNames extends string,
  FiltersType extends FiltersTypeLayout<FilterNames>,
  T extends FilterNames = FilterNames,
> = {
  filter: FilterNames;
  value: FiltersType[T]['value'] | null;
  search: string | null;
};

/**
 * A filter instance that has a non-null value. Only these filters will be used to filter the UEs.
 */
type NonNullFilterInstance<
  FilterNames extends string,
  FiltersType extends FiltersTypeLayout<FilterNames>,
  T extends FilterNames = FilterNames,
> = {
  [K in keyof FilterInstance<FilterNames, FiltersType, T>]: Exclude<
    FilterInstance<FilterNames, FiltersType, T>[K],
    null
  >;
};

export default function WaitWTF<
  FilterNames extends string,
  FiltersType extends FiltersTypeLayout<FilterNames>,
  DefaultFilterName extends FilterNames,
>({
  filtersData,
  defaultFilter,
  updateSearch,
}: {
  filtersData: FiltersDataType<FilterNames, FiltersType, DefaultFilterName>;
  defaultFilter: DefaultFilterName;
  updateSearch: (filters: Record<string, string>) => void;
}) {
  const [showAddFilterDropdown, setShowAddFilterDropdown] = useState<boolean>(false);
  const [filters, setFilters] = useState<Array<FilterInstance<FilterNames, FiltersType>>>([
    { filter: defaultFilter, value: null, search: null },
  ]);
  const [lastUpdate] = useState<{ value: number }>({ value: Date.now() });
  const { t } = useAppTranslation();
  useEffect(() => {
    const now = Date.now();
    lastUpdate.value = now;
    setTimeout(() => {
      if (lastUpdate.value === now) {
        updateSearch(
          Object.fromEntries(
            filters
              .filter((filter): filter is NonNullFilterInstance<FilterNames, FiltersType> => filter.search !== null)
              .map((filter) => [filtersData[filter.filter].parameterName, filter.search]),
          ),
        );
      }
    }, 1000);
  }, [filters]);
  const updateFilter = <T extends FilterNames>(
    filterIndex: number,
    value: FiltersType[T]['value'] | null,
    newUrlPart: string | null,
  ) => {
    const newFilters = [...filters];
    newFilters[filterIndex].value = value;
    newFilters[filterIndex].search = newUrlPart;
    setFilters(newFilters);
  };
  const addFilter = (name: FilterNames) => {
    setFilters([...filters, { filter: name, value: null, search: null }]);
  };
  const deleteFilter = (index: number) => {
    const newFilters = filters.toSpliced(index, 1).filter(
      (filter) =>
        !{
          dependsOn: [],
          ...filtersData[filter.filter],
        }.dependsOn.some((dependency) => dependency === filters[index].filter),
    );
    setFilters(newFilters);
  };
  const hasFilter = (filter: FilterNames) => filters.some((usedFilter) => usedFilter.filter === filter);
  const addableFilters = Object.keys(filtersData).filter(
    (filter) => !hasFilter(filter) && { dependsOn: [], ...filtersData[filter] }.dependsOn.every(hasFilter),
  ) as Exclude<FilterNames, DefaultFilterName>[];

  return (
    <div className={styles.filtersBar}>
      <table>
        <tbody>
          {filters.map((filter, i) => {
            const Filter = filtersData[filter.filter].component;
            const otherProps = Object.fromEntries(
              (filtersData[filter.filter] as { dependsOn?: string[] }).dependsOn?.map((dependsOn) => {
                return [dependsOn, filters.find((f) => f.filter === dependsOn)?.value];
              }) ?? [],
            );
            return (
              <tr key={filter.filter}>
                <td>
                  <Filter
                    onUpdate={(value, newUrlPart) => updateFilter(i, value, newUrlPart)}
                    {...(otherProps as DependencyProps<FilterNames, FiltersType, typeof filter.filter>)}
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
              {(filtersData[filter] as { name: NotParameteredTranslationKey }).name !== null &&
                t((filtersData[filter] as { name: NotParameteredTranslationKey }).name!)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}