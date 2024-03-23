import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { Pagination } from '@/api/api.interface';
import { UE } from '@/api/ue/ue.interface';

export function useUEs(): [UE[], (filters: Record<string, string>) => void] {
  const api = useAPI();
  const fetch = async (filters: Record<string, string>) => {
    const params = new URLSearchParams(filters).toString();
    api.get<Pagination<UE>>(`/ue?${params}`).on(StatusCodes.OK, (body) => setUEs(body.items));
  };
  const [ues, setUEs] = useState<UE[]>([]);
  useEffect(() => {
    fetch({});
  }, []);
  return [ues, fetch];
}
