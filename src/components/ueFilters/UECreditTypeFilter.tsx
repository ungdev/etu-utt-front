import { useEffect, useRef, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';

export default function UECreditTypeFilter({
  onUpdate,
  forcedValue,
}: {
  onUpdate: (value: 'CS' | 'TM' | null, newUrlPart: string | null) => void;
  forcedValue: 'CS' | 'TM' | null;
}) {
  const [creditType, setCreditType] = useState<'CS' | 'TM' | 'all'>('all');
  const forcedValueRef = useRef<'CS' | 'TM' | null>(null);
  if (forcedValue !== forcedValueRef.current && forcedValue !== null) {
    forcedValueRef.current = forcedValue;
    setCreditType(forcedValue);
  }
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
