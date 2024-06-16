import { API } from '@/api/api';
import { CreditCategory } from '@/api/credit/credit.interface';

export async function fetchCreditCategories(api: API) {
  return (await api.get<CreditCategory[]>('/ue/credit').toPromise()) ?? [];
}
