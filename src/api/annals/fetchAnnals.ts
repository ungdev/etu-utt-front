import { useEffect, useState } from 'react';
import { API, useAPI } from '@/api/api';
import { Annal } from '@/api/annals/annal.interface';

export default function useAnnals(
  code: string,
): [Annal[] | null, (index: number, exam: Annal) => void, (exam: Annal) => void] {
  const [annals, setAnnals] = useState<Annal[] | null>(null);
  const api = useAPI();

  useEffect(() => {
    api.get<Annal[]>(`/ue/annals?ueCode=${code}`, { timeoutMillis: 15 * 1000 }).on('success', setAnnals);
  }, []);

  return [
    annals,
    (index, exam) => setAnnals((prev) => (prev ? [...prev.slice(0, index), exam, ...prev.slice(index + 1)] : null)),
    (exam) => setAnnals((prev) => (prev ? [exam, ...prev] : [exam])),
  ];
}

export function openAnnalInNewTab(api: API, id: string) {
  api
    .get(`/ue/annals/${id}`, {
      isFile: true,
    })
    .on('success', (blob) => window.open(URL.createObjectURL(blob), '_blank'));
}
