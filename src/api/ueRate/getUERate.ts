import { UERate } from '@/api/ueRate/ueRateCriterion.interface';
import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';

export default function useGetUERate(ueCode: string): [UERate[] | null, (newVal: UERate[]) => void] {
  const [rates, setRates] = useState<UERate[] | null>(null);
  useEffect(() => {
    API.get<UERate[]>(`ue/${ueCode}/rate`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => setRates(body),
      }),
    );
  }, []);
  return [rates, setRates];
}
