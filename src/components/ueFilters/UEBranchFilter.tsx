import { useEffect, useState } from 'react';

type Branch = 'RT' | 'ISI' | 'SN';

export default function UEBranchFilter({ onUpdate }: { onUpdate: (value: Branch, newUrlPart: string) => void }) {
  const [branch, setBranch] = useState<Branch>('RT');
  useEffect(() => {
    onUpdate(branch, branch);
  }, [branch]);
  return (
    <select value={branch} onChange={(event) => setBranch(event.target.value as Branch)}>
      <option value="RT">RT</option>
      <option value="ISI">ISI</option>
      <option value="SN">SN</option>
    </select>
  );
}
