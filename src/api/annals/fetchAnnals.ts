import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { Annal } from '@/api/annals/annal.interface';
import { useAppSelector } from '@/lib/hooks';
import { UserType } from '@/module/user';
import { apiUrl, apiVersion } from '@/utils/environment';

export default function useAnnals(code: string): [Annal[] | null, (index: number, exam: Annal) => void] {
  const [annals, setAnnals] = useState<Annal[] | null>(null);
  const api = useAPI();
  const type = useAppSelector((state) => state.user?.type);

  useEffect(() => {
    if (type === UserType.STUDENT || type === UserType.FORMER_STUDENT)
      api.get<Annal[]>(`/ue/annals?ueCode=${code}`).on('success', setAnnals);
  }, []);
  return [
    annals,
    (index, exam) => setAnnals((prev) => (prev ? [...prev.slice(0, index), exam, ...prev.slice(index + 1)] : null)),
  ];
}

export function getAnnalURL(id: string) {
  return `${apiUrl.slice(-1) === '/' ? apiUrl.slice(0, -1) : apiUrl}/${apiVersion}/${id}`;
}
