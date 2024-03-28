import { useEffect, useRef, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';

const branches = ['RT', 'ISI', 'SN'] as const;
export type Branch = (typeof branches)[number];

export default function UEBranchFilter({
  onUpdate,
  forcedValue,
}: {
  onUpdate: (value: Branch | null, newUrlPart: string | null) => void;
  forcedValue: Branch | null;
}) {
  const [branch, setBranch] = useState<Branch | 'all'>('all');
  const forcedValueRef = useRef<string | null>(null);
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setBranch(forcedValue);
  }
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(branch === 'all' ? null : branch, branch === 'all' ? null : branch);
  }, [branch]);
  return (
    <select value={branch} onChange={(event) => setBranch(event.target.value as Branch | 'all')}>
      <option key={null} value="all">
        {t('ues:filter.branch.all')}
      </option>
      {branches.map((branch) => (
        <option key={branch} value={branch}>
          {branch}
        </option>
      ))}
    </select>
  );
}
