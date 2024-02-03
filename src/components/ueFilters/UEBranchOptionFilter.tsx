import { useEffect, useState } from 'react';

const branchOptions = {
  RT: ['HEUUU'],
  ISI: ['JE CONNAIS PAS'],
  SN: ['HEUUU', 'JE CONNAIS PAS'],
} as const satisfies {
  [key in 'RT' | 'ISI' | 'SN']: string[];
};

export default function UEBranchOptionFilter<Branch extends 'RT' | 'ISI' | 'SN'>({
  onUpdate,
  branch,
}: {
  onUpdate: (value: (typeof branchOptions)[Branch][number], newUrlPart: string) => void;
  branch: Branch;
}) {
  const [branchOption, setBranchOption] = useState<(typeof branchOptions)[Branch][number]>(branchOptions[branch][0]);
  useEffect(() => {
    onUpdate(branchOption, `branchOption=${branchOption}`);
  }, [branchOption]);
  return (
    <select
      value={branchOption}
      onChange={(event) => setBranchOption(event.target.value as (typeof branchOptions)[Branch][number])}>
      {branchOptions[branch].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
