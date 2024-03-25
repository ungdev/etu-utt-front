import { useEffect, useState } from 'react';
import { useAppTranslation } from '@/lib/i18n';

export default function UESemesterFilter({
  onUpdate,
}: {
  onUpdate: (value: 'A' | 'P' | null, newUrlPart: string | null) => void;
}) {
  const [semester, setSemester] = useState<'A' | 'P' | 'both'>('both');
  const { t } = useAppTranslation();
  useEffect(() => {
    onUpdate(semester === 'both' ? null : semester, semester === 'both' ? null : semester);
  }, [semester]);
  return (
    <select value={semester} onChange={(event) => setSemester(event.target.value as 'A' | 'P' | 'both')}>
      <option key={null} value="all">
        {t('ues:filter.semester.all')}
      </option>
      <option value="A">A</option>
      <option value="P">P</option>
    </select>
  );
}
