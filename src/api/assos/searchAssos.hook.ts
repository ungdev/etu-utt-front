import { useState } from 'react';
import { useAPI } from '@/api/api';
import { Pagination } from '@/api/api.interface';
import { AssoOverview } from '@/api/assos/asso.interface';

export function useAssos(): [AssoOverview[], number, (query: Record<string, string>) => void] {
  const [assos, setAssos] = useState<AssoOverview[]>([]);
  const [total, setTotal] = useState(0);
  const api = useAPI();
  const updateAssos = async (query: Record<string, string>) =>
    api.get<Pagination<AssoOverview>>(`/assos?${new URLSearchParams(query)}`).on('success', (body) => {
      setAssos(body.items);
      setTotal(body.itemCount);
    });
  return [assos, total, updateAssos];
}
