'use client';

import styles from './styles.module.scss';
import { createInputFilter } from '@/components/filteredSearch/InputFilter';
import { useUEs } from '@/api/ue/search';
import { useRouter } from 'next/navigation';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/filteredSearch/FilteredSearch';
import Icons from '@/icons';
import { createSelectFilter, SelectFilter } from '@/components/filteredSearch/SelectFilter';

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
    name: 'ues:filter.creditType',
    parameterName: 'creditType',
  },
  branch: { component: createSelectFilter(['RT', 'ISI', 'SN']), name: 'ues:filter.branch', parameterName: 'branch' },
  branchOption: {
    component: ({ onUpdate, branch }) => <SelectFilter onUpdate={onUpdate} choices={branchOptions[branch]} />,
    name: 'ues:filter.branchOption',
    dependsOn: ['branch'],
    parameterName: 'branchOption',
  },
  semester: { component: createSelectFilter(['A', 'P']), name: 'ues:filter.semester', parameterName: 'semester' },
} satisfies FiltersDataType<FilterNames, UEFiltersType, 'name'>);

export default function Page() {
  const router = useRouter();
  const [ues, updateUEs] = useUEs();
  return (
    <div className={styles.uePage}>
      <h1>Guide des UEs</h1>
      <FilteredSearch<FilterNames, UEFiltersType, 'name'>
        filtersData={ueFilters}
        defaultFilter={'name'}
        updateSearch={updateUEs}
      />
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
