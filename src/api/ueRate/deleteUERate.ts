import { API } from '@/api/api';
import { UERate } from '@/api/ueRate/ueRateCriterion.interface';

export default function deleteUERate(api: API, ueCode: string, criterion: string) {
  return api
    .delete<UERate>(`ue/${ueCode}/rate/${criterion}`)
    .on('success', () => true)
    .on('error', () => false)
    .on('failure', () => false);
}
