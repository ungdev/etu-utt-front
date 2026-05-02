import { UERate } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { useLoggedIn } from '@/module/session';

export default function useUERate(ueCode: string): [UERate[] | null | undefined, (newVal: UERate[]) => void] {
  const [rates, setRates] = useState<UERate[] | null | undefined>(undefined);
  const logged = useLoggedIn();
  const api = useAPI();
  useEffect(() => {
    if (logged && !rates) {
      api.get<UERate[]>(`ue/${ueCode}/rate`).on('success', setRates);
    } else if (!logged) {
      setRates(null);
    }
  }, [logged]);
  return [rates, setRates];
}
