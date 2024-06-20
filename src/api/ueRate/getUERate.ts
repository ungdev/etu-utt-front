import { UERate } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { useAppSelector } from "@/lib/hooks";

export default function useUERate(ueCode: string): [UERate[] | null, (newVal: UERate[]) => void] {
  const logged = useAppSelector((state) => state.session.logged);
  const [rates, setRates] = useState<UERate[] | null>(null);
  const api = useAPI();
  useEffect(() => {
    if (!logged) return;
    api.get<UERate[]>(`ue/${ueCode}/rate`).on('success', setRates);
  }, [logged]);
  return [rates, setRates];
}
