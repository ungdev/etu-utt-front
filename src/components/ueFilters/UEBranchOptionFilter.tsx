import { useEffect, useRef, useState } from 'react';
import { Branch as BranchType } from './UEBranchFilter';
import { useAppTranslation } from '@/lib/i18n';

const branchOptions = {
  RT: ['HEUUU'],
  ISI: ['JE CONNAIS PAS'],
  SN: ['HEUUU', 'JE CONNAIS PAS'],
} as const satisfies {
  [key in BranchType]: string[];
};

export default function UEBranchOptionFilter<Branch extends BranchType>({
  onUpdate,
  forcedValue,
  branch,
}: {
  onUpdate: (value: (typeof branchOptions)[Branch][number] | null, newUrlPart: string | null) => void;
  forcedValue: (typeof branchOptions)[Branch][number] | null;
  branch: Branch;
}) {
  const [branchOption, setBranchOption] = useState<(typeof branchOptions)[Branch][number] | 'all'>('all');
  const forcedValueRef = useRef<(typeof branchOptions)[Branch][number] | null>(null);
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setBranchOption(forcedValue);
  }
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(branchOption === 'all' ? null : branchOption, branchOption === 'all' ? null : branchOption);
  }, [branchOption]);
  return (
    <select
      value={branchOption}
      onChange={(event) => setBranchOption(event.target.value as (typeof branchOptions)[Branch][number])}>
      <option key={null} value="all">
        {t('ues:filter.branchOption.all')}
      </option>
      {branchOptions[branch].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
