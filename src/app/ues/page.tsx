'use client';

import styles from './styles.module.scss';
import { createInputFilter } from '@/components/searchFilters/InputFilter';
import UECreditTypeFilter from '@/components/searchFilters/ue/UECreditTypeFilter';
import UEBranchFilter from '@/components/searchFilters/ue/UEBranchFilter';
import UEBranchOptionFilter from '@/components/searchFilters/ue/UEBranchOptionFilter';
import UESemesterFilter from '@/components/searchFilters/ue/UESemesterFilter';
import { useUEs } from '@/api/ue/search';
import { useRouter } from 'next/navigation';
import FilteredSearch, { FiltersDataType, GenericFiltersType } from '@/components/FilteredSearch';
import Icons from '@/icons';

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

/**
 * The definition of the filters. They can then be used in JavaScript code to get the filter component, the name of the filter, ...
 */
const ueFilters = Object.freeze({
  name: { component: createInputFilter('ues:filter.search', Icons.User), parameterName: 'q' }, // This one does not need a name as it will never be displayed
  creditType: { component: UECreditTypeFilter, name: 'ues:filter.creditType', parameterName: 'creditType' },
  branch: { component: UEBranchFilter, name: 'ues:filter.branch', parameterName: 'branch' },
  branchOption: {
    component: UEBranchOptionFilter,
    name: 'ues:filter.branchOption',
    dependsOn: ['branch'],
    parameterName: 'branchOption',
  },
  semester: { component: UESemesterFilter, name: 'ues:filter.semester', parameterName: 'semester' },
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
