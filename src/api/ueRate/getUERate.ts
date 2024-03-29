import { UERate } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';
import { useEffect, useState } from 'react';

export default function useUERate(ueCode: string): [UERate[] | null, (newVal: UERate[]) => void] {
  const [rates, setRates] = useState<UERate[] | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<UERate[]>(`ue/${ueCode}/rate`).on('success', setRates);
  }, []);
  return [rates, setRates];
}
