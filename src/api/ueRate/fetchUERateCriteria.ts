import { API } from '@/api/api';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';

export default function fetchUERateCriteria(api: API) {
  return api.get<UERateCriterion[]>('ue/rate/criteria');
}
