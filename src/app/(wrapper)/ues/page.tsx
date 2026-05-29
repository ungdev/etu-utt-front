'use client';
import styles from './style.module.scss';
import { Branch } from '@/api/branch/branch.interface';
import { CreditCategory } from '@/api/credit/credit.interface';
import { useUEs } from '@/api/ue/search';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import { createSelectFilter, SelectFilter } from '@/components/filteredSearch/SelectFilter';
import { ResultsList } from '@/components/ResultsList';
import Tooltip from '@/components/UI/Tooltip';
import Page from '@/components/utilities/Page';
import Icons from '@/icons';
import { useAppTranslation } from '@/lib/i18n';
import { useBranches, useCreditCategories } from '@/module/constantData';
import { useMemo } from 'react';

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
        component: createInputFilter('ues:filter.search', 'ues:filter.search.title', Icons.Book),
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
  const {
    items: ues,
    total: totalUesCount,
    updateFilters: updateUEs,
    fetchNextItems,
    invalidateItems: invalidateItems,
  } = useUEs();
  const branches = useBranches();
  const creditCategories = useCreditCategories();
  const ueFilters = useUeFilters(creditCategories, branches);
  if (!branches) return <Page>'Chargement'</Page>;
  return (
    <Page className={styles.page}>
      <h1>{t('ues:browser')}</h1>
      <div className={styles.content}>
        <FilteredSearch<FilterNames, UEFiltersType>
          filtersData={ueFilters}
          updateSearch={updateUEs}
          invalidateItems={invalidateItems}
        />
        <div className={styles.results}>
          <ResultsList
            data={ues}
            totalResults={totalUesCount}
            baseRedirectUrl={'/ues'}
            onEndReached={fetchNextItems}
            itemFactory={({ item }) => (
              <div className={!item ? styles.glimmer : styles.container}>
                <div className={styles.headerLayout}>
                  <h2>{item?.code}</h2>
                  <div className={styles.metaContainer}>
                    <div className={styles.sideData}>
                      <div className={styles.credits}>
                        <span className={styles.label}>{t('ues:overview.credits')}</span>
                        {item?.credits
                          ?.sort((a, b) =>
                            a.category.name > b.category.name ? 1 : a.category.name < b.category.name ? -1 : 0,
                          )
                          .map((credit, i) => (
                            <div key={`${credit.category.code}-${i}`}>
                              {credit.credits}
                              <span className={styles.categoryLabel}>
                                <Tooltip styles="RIGHT" content={credit.category.name}>
                                  {credit.category.code}
                                </Tooltip>
                              </span>
                            </div>
                          ))}
                      </div>
                      <div className={styles.languages}>
                        <span className={[styles.taughtIn, styles.label].join(' ')}>{t('ues:overview.taughtIn')}</span>
                        {item?.info.languages.map((language) => <span key={language}>{language}</span>)}
                      </div>
                    </div>
                    <div className={styles.sideData}>
                      {item?.info.minors.length ? (
                        <div className={styles.minors}>
                          <span className={[styles.label, styles.categoryLabel].join(' ')}>
                            {t('ues:overview.minors')}
                          </span>
                          {item?.info.minors.map((minor) => <span key={minor}>{minor}</span>)}
                        </div>
                      ) : (
                        ''
                      )}
                      {item?.info?.requirements?.length ? (
                        <div className={[styles.requirements, styles.categoryLabel].join(' ')}>
                          <Tooltip styles="LEFT" content={item?.info?.requirements?.join(', ')}>
                            {item?.info?.requirements?.length}{' '}
                            <span className={styles.label}>{t('ues:overview.requirements')}</span>
                          </Tooltip>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
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
