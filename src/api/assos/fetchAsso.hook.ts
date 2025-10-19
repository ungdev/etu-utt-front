import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { Asso } from '@/api/assos/asso.interface';

export function useAsso(assoId: string): [Asso | null, (asso: Asso) => void] {
  const [asso, setAsso] = useState<Asso | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<Asso>(`/assos/${assoId}`).on('success', (body) => {
      setAsso(body);
    });
  }, []);
  return [asso, setAsso];
}
