import { useAPI } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';
import { DetailedUE } from '@/api/ue/ue.interface';
import { notFound } from "next/navigation";

export default function useUE(code: string): [DetailedUE | null, () => void] {
  const [ue, setUE] = useState<DetailedUE | null>(null);
  const api = useAPI();
  const fetchUE = () => {
    api.get<DetailedUE>(`/ue/${code}`)
      .on(StatusCodes.OK, setUE)
      .on(404, () => notFound());
  };
  useEffect(fetchUE, [code]);
  return [ue, fetchUE];
}
