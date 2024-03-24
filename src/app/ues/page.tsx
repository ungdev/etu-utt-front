'use client';

import styles from './styles.module.scss';
import UENameFilter from '@/components/ueFilters/UENameFilter';
import UECreditTypeFilter from '@/components/ueFilters/UECreditTypeFilter';
import UEBranchFilter from '@/components/ueFilters/UEBranchFilter';
import UEBranchOptionFilter from '@/components/ueFilters/UEBranchOptionFilter';
import UESemesterFilter from '@/components/ueFilters/UESemesterFilter';
import { useUEs } from '@/api/ue/search';
import { useRouter } from 'next/navigation';
import WaitWTF, { FiltersDataType } from '@/components/WaitWTF';

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

type FilterNames = 'name' | 'creditType' | 'branch' | 'branchOption' | 'semester';

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
} satisfies FiltersDataType<FilterNames, UEFiltersType, 'name'>);

export default function Page() {
  const router = useRouter();
  const [ues, updateUEs] = useUEs();
  return (
    <div className={styles.uePage}>
      <h1>Guide des UEs</h1>
      <WaitWTF<FilterNames, UEFiltersType, 'name'>
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
