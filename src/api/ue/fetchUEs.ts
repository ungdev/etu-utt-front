import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';
import { DetailedUE } from '@/api/ue/ue.interface';

export default function useUE(code: string): [DetailedUE | null, () => void] {
  const [ue, setUE] = useState<DetailedUE | null>(null);
  const fetchUE = () => {
    API.get<DetailedUE>(`/ue/${code}`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => setUE(body),
      }),
    );
  };
  useEffect(fetchUE, [code]);
  return [ue, fetchUE];
}
