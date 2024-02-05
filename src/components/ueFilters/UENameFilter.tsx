import { useEffect, useState } from 'react';
import Input from '@/components/Input';

export default function UENameFilter({ onUpdate }: { onUpdate: (value: string, newUrlPart: string) => void }) {
  const [search, setSearch] = useState<string>('');
  useEffect(() => {
    onUpdate(search, search);
  }, [search]);
  return <Input type={'text'} value={search} onChange={setSearch} />;
}
