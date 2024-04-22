'use client';
// import styles from './style.module.scss';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import { useUEs } from '@/api/ue/search';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import Icons from '@/icons';
import { createSelectFilter, SelectFilter } from '@/components/filteredSearch/SelectFilter';
import { ResultsList } from '@/components/ResultsList';
import { usePageSettings } from '@/module/pageSettings';

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
  name: { component: createInputFilter('ues:filter.search', Icons.Book), parameterName: 'q' }, // This one does not need a name as it will never be displayed
  creditType: {
    component: createSelectFilter(['CS', 'TM']),
    parameterName: 'creditType',
  },
  branch: { component: createSelectFilter(['RT', 'ISI', 'SN']), parameterName: 'branch' },
  branchOption: {
    component: ({ onUpdate, forcedValue, branch }) => (
      <SelectFilter onUpdate={onUpdate} forcedValue={forcedValue} choices={branchOptions[branch]} />
    ),
    dependsOn: ['branch'],
    parameterName: 'branchOption',
  },
  semester: { component: createSelectFilter(['A', 'P']), parameterName: 'semester' },
} satisfies FiltersDataType<FilterNames, UEFiltersType>);

export default function Page() {
  usePageSettings({});
  const [ues, totalUesCount, updateUEs] = useUEs();
  return (
    <div /*className={styles.page}*/>
      <h1>Guide des UEs</h1>
      <div /*className={styles.content}*/>
        <FilteredSearch<FilterNames, UEFiltersType> filtersData={ueFilters} updateSearch={updateUEs} />
        <ResultsList
          data={ues}
          totalResults={totalUesCount}
          baseRedirectUrl={'/ues'}
          InfoFC={({ item }) => (
            <>
              <h2>{item.code}</h2>
              <p>{item.name}</p>
            </>
          )}
          getItemId={(ue) => ue.code}
        />
      </div>
    </div>
  );
}
