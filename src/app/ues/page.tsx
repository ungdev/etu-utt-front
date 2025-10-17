'use client';
import styles from './style.module.scss';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import { useUEs } from '@/api/ue/search';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import { IconBook } from 'obra-icons-react';
import { createSelectFilter, SelectFilter } from '@/components/filteredSearch/SelectFilter';
import { ResultsList } from '@/components/ResultsList';
import { useAppTranslation } from '@/lib/i18n';
import { Branch } from '@/api/branch/branch.interface';
import { useBranches, useCreditCategories } from '@/module/constantData';
import { useMemo } from 'react';
import { CreditCategory } from '@/api/credit/credit.interface';
import Page from '@/components/utilities/Page';

/**
 * The different filters that exist.
 */
interface UEFiltersType extends GenericFiltersType<FilterNames> {
  name: { dependsOn: []; value: string };
  creditType: { dependsOn: []; value: string };
  branch: { dependsOn: []; value: string };
  branchOption: { dependsOn: ['branch']; value: string };
  semester: { dependsOn: []; value: 'A' | 'P' };
}

type FilterNames = 'name' | 'creditType' | 'branch' | 'branchOption' | 'semester';

/**
 * The definition of the filters. They can then be used in JavaScript code to get the filter component, the name of the filter, ...
 */
function useUeFilters(creditCategories: CreditCategory[] | null, branches: Branch[] | null) {
  return useMemo(() => {
    return Object.freeze({
      name: {
        component: createInputFilter('ues:filter.search', 'ues:filter.search.title', IconBook),
        parameterName: 'q',
        updateDelayed: true,
      }, // This one does not need a name as it will never be displayed
      creditType: {
        component: createSelectFilter(
          creditCategories?.map((creditCategory) => creditCategory.code) ?? [],
          'ues:filter.creditType.title',
        ),
        parameterName: 'creditType',
        updateDelayed: false,
      },
      branch: {
        component: createSelectFilter(branches?.map((branch) => branch.code) ?? [], 'ues:filter.branch.title'),
        parameterName: 'branch',
        updateDelayed: false,
      },
      branchOption: {
        component: ({ onUpdate, forcedValue, branch }) => (
          <SelectFilter
            onUpdate={onUpdate}
            forcedValue={forcedValue}
            choices={
              branches?.find((b) => b.code === branch)?.branchOptions?.map((branchOption) => branchOption.code) ?? []
            }
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
    } as const satisfies FiltersDataType<FilterNames, UEFiltersType>);
  }, [creditCategories?.length ?? 0, branches?.length ?? 0]);
}

export default function UesPage() {
  const { t } = useAppTranslation();
  const { items: ues, total: totalUesCount, updateFilters: updateUEs, fetchNextItems } = useUEs();
  const branches = useBranches();
  const creditCategories = useCreditCategories();
  const ueFilters = useUeFilters(creditCategories, branches);
  if (!branches) return <Page>'Chargement'</Page>;
  return (
    <Page className={styles.page}>
      <h1>{t('ues:browser')}</h1>
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
    </Page>
  );
}
