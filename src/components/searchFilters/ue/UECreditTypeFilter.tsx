import { useEffect, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';

export default function UECreditTypeFilter({
  onUpdate,
}: {
  onUpdate: (value: 'CS' | 'TM' | null, newUrlPart: string | null) => void;
}) {
  const [creditType, setCreditType] = useState<'CS' | 'TM' | 'all'>('all');
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(creditType === 'all' ? null : creditType, creditType === 'all' ? null : creditType);
  }, [creditType]);
  return (
    <select value={creditType} onChange={(event) => setCreditType(event.target.value as 'CS' | 'TM' | 'all')}>
      <option key={null} value="all">
        {t('ues:filter.creditType.all')}
      </option>
      <option value="CS">CS</option>
      <option value="TM">TM</option>
    </select>
  );
}
