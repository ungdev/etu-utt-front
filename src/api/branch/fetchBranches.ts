import { API } from '@/api/api';
import { Branch } from '@/api/branch/branch.interface';

export async function fetchBranches(api: API): Promise<Branch[]> {
  return (await api.get<Branch[]>('/branch').toPromise()) ?? [];
}
