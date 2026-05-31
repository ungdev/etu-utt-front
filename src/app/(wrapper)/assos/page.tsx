'use client';
import styles from './style.module.scss';
import { IconBook } from 'obra-icons-react';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import { ResultsList } from '@/components/ResultsList';
import { useAppTranslation } from '@/lib/i18n';
import { useAssos } from '@/api/assos/searchAssos.hook';
import Page from '@/components/utilities/Page';

/**
 * The different filters that exist.
 */
interface AssoFiltersType extends GenericFiltersType<FilterNames> {
  name: { dependsOn: []; value: string };
}

type FilterNames = 'name';

/**
 * The definition of the filters. They can then be used in JavaScript code to get the filter component, the name of the filter, ...
 */
const assoFilters = Object.freeze({
  name: {
    component: createInputFilter('assos:filter.search', 'assos:filter.search.title', IconBook),
    parameterName: 'q',
    updateDelayed: true,
  }, // This one does not need a name as it will never be displayed
} satisfies FiltersDataType<FilterNames, AssoFiltersType>);

export default function AssoPage() {
  const { t } = useAppTranslation();
  const { items: assos, total: totalAssosCount, updateFilters: updateAssos, invalidateItems } = useAssos();
  return (
    <Page className={styles.page}>
      <h1 className={styles.title}>{t('assos:browser')}</h1>
      <div className={styles.content}>
        <FilteredSearch<FilterNames, AssoFiltersType>
          filtersData={assoFilters}
          updateSearch={updateAssos}
          invalidateItems={invalidateItems}
        />
        <div className={styles.results}>
          <ResultsList
            data={assos}
            totalResults={totalAssosCount}
            baseRedirectUrl={'/assos'}
            itemFactory={({ item }) => (
              <div>
                <h2>{item?.name}</h2>
                <p>{item?.shortDescription}</p>
              </div>
            )}
            getItemId={(asso) => asso.id}
          />
        </div>
      </div>
    </Page>
  );
}
