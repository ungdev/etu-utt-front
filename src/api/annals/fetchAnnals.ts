import { useEffect, useState } from 'react';
import { API, useAPI } from '@/api/api';
import { Annal } from '@/api/annals/annal.interface';
import { useLoggedIn } from '@/module/session';

export default function useAnnals(
  code: string,
): [Annal[] | null | undefined, (index: number, exam: Annal) => void, (exam: Annal) => void] {
  const api = useAPI();
  const logged = useLoggedIn();
  const [annals, setAnnals] = useState<Annal[] | null | undefined>(logged ? undefined : null);

  useEffect(() => {
    if (logged && !annals)
      api.get<Annal[]>(`/ue/annals?ueCode=${code}`, { timeoutMillis: 15 * 1000 }).on('success', setAnnals);
  }, [code, logged]);

  return [
    annals,
    (index, exam) => setAnnals((prev) => (prev ? [...prev.slice(0, index), exam, ...prev.slice(index + 1)] : null)),
    (exam) => setAnnals((prev) => (prev ? [exam, ...prev] : [exam])),
  ];
}

export function openAnnalInNewTab(api: API, id: string) {
  api.getFile(`/ue/annals/${id}`).on('success', (blob) => window.open(URL.createObjectURL(blob), '_blank'));
}
