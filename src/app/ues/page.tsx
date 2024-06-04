'use client';
import styles from './style.module.scss';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import { useUEs } from '@/api/ue/search';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import Icons from '@/icons';
import { createSelectFilter, SelectFilter } from '@/components/filteredSearch/SelectFilter';
import { ResultsList } from '@/components/ResultsList';
import { usePageSettings } from '@/module/pageSettings';
import { useAppTranslation } from '@/lib/i18n';

/**
 * The different filters that exist.
 */
interface UEFiltersType extends GenericFiltersType<FilterNames> {
  name: { dependsOn: []; value: string };
  creditType: { dependsOn: []; value: 'CS' | 'TM' };
  branch: { dependsOn: []; value: 'RT' | 'ISI' | 'SN' };
  branchOption: { dependsOn: ['branch']; value: 'HEUUU' | 'JE CONNAIS PAS' };
  semester: { dependsOn: []; value: 'A' | 'P' };
}

type FilterNames = 'name' | 'creditType' | 'branch' | 'branchOption' | 'semester';

type BranchType = 'RT' | 'ISI' | 'SN';
const branchOptions = {
  RT: ['HEUUU'],
  ISI: ['JE CONNAIS PAS'],
  SN: ['HEUUU', 'JE CONNAIS PAS'],
} as const satisfies {
  [key in BranchType]: string[];
};

/**
 * The definition of the filters. They can then be used in JavaScript code to get the filter component, the name of the filter, ...
 */
const ueFilters = Object.freeze({
  name: {
    component: createInputFilter('ues:filter.search', 'ues:filter.search.title', Icons.Book),
    parameterName: 'q',
    updateDelayed: true,
  }, // This one does not need a name as it will never be displayed
  creditType: {
    component: createSelectFilter(['CS', 'TM'], 'ues:filter.creditType.title'),
    parameterName: 'creditType',
    updateDelayed: false,
  },
  branch: {
    component: createSelectFilter(['RT', 'ISI', 'SN'], 'ues:filter.branch.title'),
    parameterName: 'branch',
    updateDelayed: false,
  },
  branchOption: {
    component: ({ onUpdate, forcedValue, branch }) => (
      <SelectFilter
        onUpdate={onUpdate}
        forcedValue={forcedValue}
        choices={branchOptions[branch]}
        title={'ues:filter.branchOption.title'}
      />
    ),
    dependsOn: ['branch'],
    parameterName: 'branchOption',
    updateDelayed: false,
  },
  semester: {
    component: createSelectFilter(['A', 'P'], 'ues:filter.semester.title', {
      A: 'ues:filter.semester.autumn',
      P: 'ues:filter.semester.spring',
    }),
    parameterName: 'semester',
    updateDelayed: false,
  },
} satisfies FiltersDataType<FilterNames, UEFiltersType>);

export default function Page() {
  usePageSettings({});
  const { t } = useAppTranslation();
  const { items: ues, total: totalUesCount, updateFilters: updateUEs, fetchNextItems } = useUEs();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('ues:browser')}</h1>
      <div className={styles.content}>
        <FilteredSearch<FilterNames, UEFiltersType> filtersData={ueFilters} updateSearch={updateUEs} />
        <div className={styles.results}>
          <ResultsList
            data={ues}
            totalResults={totalUesCount}
            baseRedirectUrl={'/ues'}
            onEndReached={fetchNextItems}
            itemFactory={({ item }) => (
              <div className={!item ? styles.glimmer : ''}>
                <h2>{item?.code}</h2>
                <p>{item?.name}</p>
              </div>
            )}
            getItemId={(ue) => ue.code}
          />
        </div>
      </div>
    </div>
  );
}
