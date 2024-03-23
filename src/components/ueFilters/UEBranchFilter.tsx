import { useEffect, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';

const branches = ['RT', 'ISI', 'SN'] as const;
export type Branch = (typeof branches)[number];

export default function UEBranchFilter({
  onUpdate,
}: {
  onUpdate: (value: Branch | null, newUrlPart: string | null) => void;
}) {
  const [branch, setBranch] = useState<Branch | 'all'>('all');
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
