import { useState } from 'react';
import { useAPI } from '@/api/api';
import { Pagination } from '@/api/api.interface';
import { Asso } from "@/api/assos/asso.interface";

export function useAssos(): [Asso[], number, (query: Record<string, string>) => void] {
  const [assos, setAssos] = useState<Asso[]>([]);
  const [total, setTotal] = useState(0);
  const api = useAPI();
  const updateAssos = async (query: Record<string, string>) =>
    api.get<Pagination<Asso>>(`/assos?${new URLSearchParams(query)}`).on('success', (body) => {
      setAssos(body.items);
      setTotal(body.itemCount);
    });
  return [assos, total, updateAssos];
}
