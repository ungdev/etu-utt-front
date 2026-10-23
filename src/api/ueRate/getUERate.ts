import { UERate } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';
import { useState } from 'react';
import { useLoggedIn } from '@/module/session';

export default function useUERate(ueCode: string): [UERate[] | null | undefined, (newVal: UERate[]) => void] {
  const logged = useLoggedIn();
  const api = useAPI();
  const [rates, setRates] = useState<UERate[] | null | undefined>(!logged ? null : undefined);
  if (logged && !rates) api.get<UERate[]>(`ue/${ueCode}/rate`).on('success', setRates);
  return [rates, setRates];
}
