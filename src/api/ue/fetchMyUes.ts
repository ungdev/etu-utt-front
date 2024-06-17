import { API } from '@/api/api';
import { UE } from '@/api/ue/ue.interface';

export function fetchMyUes(api: API) {
  return api.get<UE[]>('/ue/of/me').toPromise();
}