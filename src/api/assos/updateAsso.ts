import { API } from '@/api/api';
import { Asso, AssoUpdateRequest } from './asso.interface';

export async function updateAsso(api: API, assoId: string, options: AssoUpdateRequest): Promise<Asso | undefined> {
  return api.patch<AssoUpdateRequest, Asso>(`/assos/${assoId}`, options).toPromise();
}
