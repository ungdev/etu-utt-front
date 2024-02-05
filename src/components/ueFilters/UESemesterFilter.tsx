import { useEffect, useState } from 'react';

export default function UESemesterFilter({ onUpdate }: { onUpdate: (value: 'A' | 'P', newUrlPart: string) => void }) {
  const [semester, setSemester] = useState<'A' | 'P'>('A');
  useEffect(() => {
    onUpdate(semester, semester);
  }, [semester]);
  return (
    <select value={semester} onChange={(event) => setSemester(event.target.value as 'A' | 'P')}>
      <option value="A">A</option>
      <option value="P">P</option>
    </select>
  );
}
