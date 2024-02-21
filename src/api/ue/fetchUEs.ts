import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';
import { DetailedUE } from '@/api/ue/ue.interface';

export default function useFetchUE(code: string): DetailedUE | null {
  const [ue, setUE] = useState<DetailedUE | null>(null);
  useEffect(() => {
    API.get<DetailedUE>(`/ue/${code}`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          setUE(body);
        },
      }),
    );
  }, [code]);
  return ue;
}
