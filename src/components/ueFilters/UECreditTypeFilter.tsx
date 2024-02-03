import { useEffect, useState } from 'react';

export default function UECreditTypeFilter({
  onUpdate,
}: {
  onUpdate: (value: 'CS' | 'TM', newUrlPart: string) => void;
}) {
  const [creditType, setCreditType] = useState<'CS' | 'TM'>('CS');
  useEffect(() => {
    onUpdate(creditType, `creditType=${creditType}`);
  }, [creditType]);
  return (
    <select value={creditType} onChange={(event) => setCreditType(event.target.value as 'CS' | 'TM')}>
      <option value="CS">CS</option>
      <option value="TM">TM</option>
    </select>
  );
}
